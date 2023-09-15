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

constexpr long BUF_LEN = 1024; 

constexpr std::string_view COMPILE_ERR = "compile_err.out";
constexpr std::string_view RUN_ERR = "run_err.out";
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

cppevent::awaitable_task<void> upload(std::string_view dir, std::string_view name,
                                      cppevent::output& o_stdout) {
    int fd = executor::open_file(dir, name, O_RDONLY);
    std::array<uint8_t, BUF_LEN> buffer;
    long upload_size;
    while ((upload_size = read(fd, buffer.data(), BUF_LEN)) > 0) {
        co_await o_stdout.write(buffer.data(), upload_size);
    }
    close(fd);
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
    if (it == source_file_names.end() || content_len == 0) {
        co_await o_stdout.write("status: 400\ncontent-length: 16\n\nunknown language");
        co_return;
    }
    char dir_name[12];
    strcpy(dir_name, "code_XXXXXX");
    if (mkdtemp(dir_name) == NULL) {
        co_await o_stdout.write("status: 500\ncontent-type: text/plain\n\n");
        co_await o_stdout.write(strerror(errno));
        co_return;
    }

    const std::string_view& source_file_name = it->second;
    const int source_fd = open_file(dir_name, source_file_name, O_WRONLY | O_CREAT);
    co_await download(content_len, s_stdin, source_fd);
    close(source_fd);

    const int compile_err_fd = open_file(dir_name, COMPILE_ERR, O_WRONLY | O_CREAT);
    bool compiled_success = co_await await_compile(compile_err_fd, m_loop, dir_name, lang);
    close(compile_err_fd);

    if (!compiled_success) {
        co_await o_stdout.write("status: 200\nx-exec-status: compile_error\ncontent-type: text/plain\n\n");
        co_await upload(dir_name, COMPILE_ERR, o_stdout);
        co_return;
    }

    const int run_err_fd = open_file(dir_name, RUN_ERR, O_WRONLY | O_CREAT);
    const int run_out_fd = open_file(dir_name, RUN_STDOUT, O_WRONLY | O_CREAT);
    bool run_success = co_await await_run(run_out_fd, run_err_fd, m_loop, dir_name, lang);
    close(run_err_fd);
    close(run_out_fd);

    if (!run_success) {
        co_await o_stdout.write("status: 200\nx-exec-status: run_error\ncontent-type: text/plain\n\n");
        co_await upload(dir_name, RUN_ERR, o_stdout);
        co_return;
    }

    co_await o_stdout.write("status: 200\nx-exec-status: success\ncontent-type: text/plain\n\n");
    co_await upload(dir_name, RUN_STDOUT, o_stdout);
}
