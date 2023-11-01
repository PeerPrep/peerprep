#include "exec_endpoint.hpp"

#include "util.hpp"

#include <cerrno>
#include <cstring>
#include <cstdlib>

#include <array>
#include <algorithm>
#include <unordered_map>
#include <string_view>
#include <stdexcept>

#include <cppevent_base/util.hpp>

#include <unistd.h>
#include <fcntl.h>
#include <sys/stat.h>

constexpr long DIR_NAME_LEN = 12;

constexpr long BUF_LEN = 1024;
constexpr long MAX_RESPONSE_SIZE = 10 * 1024; 

constexpr std::string_view COMPILE_ERR = "compile_err.out";
constexpr std::string_view RUN_STDOUT = "run.out";

executor::exec_endpoint::exec_endpoint(cppevent::event_loop& e_loop): m_loop(e_loop) {
}

cppevent::awaitable_task<void> download(long content_len,
                                        cppevent::stream& s_stdin,
                                        int fd) {
    std::array<uint8_t, BUF_LEN> buffer;
    while (content_len > 0) {
        long download_size = std::min(BUF_LEN, content_len);
        co_await s_stdin.read(buffer.data(), download_size, true);
        cppevent::throw_if_error(write(fd, buffer.data(), download_size), "Failed to download: ");
        content_len -= download_size; 
    }
}

template <long BUFFER_SIZE>
bool read_to_buffer(std::array<uint8_t, BUFFER_SIZE>& buffer, long& read_size, int fd) {
    read_size = read(fd, buffer.data(), BUFFER_SIZE);
    return read_size > 0;
}

cppevent::awaitable_task<void> executor::exec_endpoint::upload(std::string_view dir,
                                                               std::string_view name,
                                                               cppevent::output& o_stdout) {
    int fd = open_file(dir, name, O_RDONLY);
    std::array<uint8_t, BUF_LEN> buffer;
    long response_size = 0;
    long read_size;
    while (response_size < MAX_RESPONSE_SIZE && read_to_buffer<BUF_LEN>(buffer, read_size, fd)) {
        co_await o_stdout.write(buffer.data(), read_size);
        response_size += read_size;
    }
    close(fd);
    m_unused_dirs.push(std::string { dir });
}

const std::unordered_map<std::string_view, std::string_view> source_file_names = {
    { "cpp", "source.cpp" },
    { "java", "Source.java" },
    { "python", "source.py" }
};

cppevent::awaitable_task<void> executor::exec_endpoint::process(const cppevent::context& cont,
                                                                cppevent::stream& s_stdin,
                                                                cppevent::output& o_stdout) {
    auto lang_opt = cont.get_path_segment("lang");
    auto& lang = lang_opt.value();
    long content_len = cont.get_content_len();
    auto it = source_file_names.find(lang);
    if (it == source_file_names.end()) {
        co_await o_stdout.write("status: 400\ncontent-length: 16\n\nunknown language");
        co_return;
    } else if (content_len == 0) {
        co_await o_stdout.write("status: 400\ncontent-length: 23\n\nNo source code provided");
        co_return;
    }

    char dir_name[DIR_NAME_LEN];
    strncpy(dir_name, "code_XXXXXX", DIR_NAME_LEN);
    if (!m_unused_dirs.empty()) {
        strncpy(dir_name, m_unused_dirs.front().c_str(), DIR_NAME_LEN);
        m_unused_dirs.pop();
    } else if (mkdtemp(dir_name) == NULL || chmod(dir_name, 0755) < 0) {
        co_await o_stdout.write("status: 500\ncontent-type: text/plain\n\n");
        co_await o_stdout.write(strerror(errno));
        co_return;
    }

    const std::string_view& source_file_name = it->second;
    const int source_fd = open_file(dir_name, source_file_name, O_WRONLY | O_CREAT | O_TRUNC);
    co_await download(content_len, s_stdin, source_fd);
    close(source_fd);

    const int compile_err_fd = open_file(dir_name, COMPILE_ERR, O_WRONLY | O_CREAT | O_TRUNC);
    bool compiled_success = co_await await_compile(compile_err_fd, m_loop, dir_name, lang);
    close(compile_err_fd);

    if (!compiled_success) {
        co_await o_stdout.write("status: 200\nx-exec-status: compile_error\ncontent-type: text/plain\n\n");
        co_await upload(dir_name, COMPILE_ERR, o_stdout);
        co_return;
    }

    const int run_out_fd = open_file(dir_name, RUN_STDOUT, O_WRONLY | O_CREAT | O_TRUNC);
    CODE_EXEC_STATUS run_status = co_await await_run(run_out_fd, m_loop, dir_name, lang);
    close(run_out_fd);

    switch (run_status) {
        case CODE_EXEC_STATUS::RUN_ERROR:
            co_await o_stdout.write("status: 200\nx-exec-status: run_error\ncontent-type: text/plain\n\n");
            break;
        case CODE_EXEC_STATUS::RUN_TIMEOUT:
            co_await o_stdout.write("status: 200\nx-exec-status: timeout\ncontent-type: text/plain\n\n");
            break;
        case CODE_EXEC_STATUS::RUN_SUCCESS:
            co_await o_stdout.write("status: 200\nx-exec-status: success\ncontent-type: text/plain\n\n");
            break;
    }
    co_await upload(dir_name, RUN_STDOUT, o_stdout);
}
