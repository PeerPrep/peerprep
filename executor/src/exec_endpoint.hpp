#ifndef EXECUTOR_EXEC_ENDPOINT
#define EXECUTOR_EXEC_ENDPOINT

#include <cppevent_fcgi/endpoint.hpp>

#include <string_view>
#include <string>
#include <queue>

namespace cppevent {

class event_loop;

}

namespace executor {

class exec_endpoint : public cppevent::endpoint {
private:
    cppevent::event_loop& m_loop;
    std::queue<std::string> m_unused_dirs;

    cppevent::awaitable_task<void> upload(std::string_view dir, std::string_view name,
                                          cppevent::output& o_stdout);
public:
    exec_endpoint(cppevent::event_loop& e_loop);

    cppevent::awaitable_task<void> process(const cppevent::context& cont,
                                                 cppevent::stream& s_stdin,
                                                 cppevent::output& o_stdout);
};

}

#endif
