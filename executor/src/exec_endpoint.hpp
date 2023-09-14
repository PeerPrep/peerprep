#ifndef EXECUTOR_EXEC_ENDPOINT
#define EXECUTOR_EXEC_ENDPOINT

#include <cppevent_fcgi/endpoint.hpp>

namespace executor {

class exec_endpoint : public cppevent::endpoint {
public:
    cppevent::awaitable_task<void> process(const cppevent::context& cont,
                                                 cppevent::stream& s_stdin,
                                                 cppevent::output& o_stdout);
};

}

#endif
