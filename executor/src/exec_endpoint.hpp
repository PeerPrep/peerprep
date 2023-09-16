#ifndef EXECUTOR_EXEC_ENDPOINT
#define EXECUTOR_EXEC_ENDPOINT

#include <cppevent_fcgi/endpoint.hpp>

#include <string_view>

namespace cppevent {

class event_loop;

}

namespace executor {

class exec_endpoint : public cppevent::endpoint {
private:
    cppevent::event_loop& m_loop;
public:
    exec_endpoint(cppevent::event_loop& e_loop);

    cppevent::awaitable_task<void> process(const cppevent::context& cont,
                                                 cppevent::stream& s_stdin,
                                                 cppevent::output& o_stdout);
};

}

#endif
