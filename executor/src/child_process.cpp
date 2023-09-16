#include "child_process.hpp"

#include <cppevent_base/event_loop.hpp>
#include <cppevent_base/event_listener.hpp>
#include <cppevent_base/util.hpp>

#include <sys/syscall.h>
#include <sys/wait.h>

class pid_listener {
private:
    cppevent::event_listener* const listener;
public:
    pid_listener(cppevent::event_loop& e_loop, int fd): listener(e_loop.get_io_listener(fd)) {
    }

    ~pid_listener() {
        listener->detach();
    }

    cppevent::read_awaiter wait_signal() {
        return cppevent::read_awaiter { *listener };
    }
};

cppevent::awaitable_task<bool> executor::await_child_process(int pid_fd,
                                                             cppevent::event_loop& e_loop) {
    pid_listener listener(e_loop, pid_fd);
    
    siginfo_t info = {};
    while (waitid(P_PIDFD, pid_fd, &info, WEXITED) == -1) {
        if (errno == EAGAIN) {
            co_await listener.wait_signal();
            continue;
        }
        cppevent::throw_error("Error waiting for pid");
    }

    co_return info.si_status == 0;
}
