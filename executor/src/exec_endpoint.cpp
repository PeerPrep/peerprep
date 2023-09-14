#include "exec_endpoint.hpp"

#include <sstream>

cppevent::awaitable_task<void> executor::exec_endpoint::process(const cppevent::context& cont,
                                                                cppevent::stream& s_stdin,
                                                                cppevent::output& o_stdout) {
    auto lang_opt = cont.get_path_segment("lang");
    auto& lang = lang_opt.value();
    std::stringstream ss;
    ss << "content-length: " << 6 + lang.size() << "\ncontent-type: text/plain\n\n";
    ss << "hello " << lang;
    co_await o_stdout.write(ss.str());
}
