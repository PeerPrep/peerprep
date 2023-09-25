#ifndef EXECUTOR_CHILD_PID_HPP
#define EXECUTOR_CHILD_PID_HPP

#include <cppevent_base/task.hpp>

namespace cppevent {

class event_loop;

}

namespace executor {

cppevent::awaitable_task<bool> await_child_process(int pid_fd, cppevent::event_loop& e_loop);

}

#endif
