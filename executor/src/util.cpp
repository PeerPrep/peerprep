#include "util.hpp"

#include <fcntl.h>
#include <sys/syscall.h>
#include <sys/wait.h>
#include <unistd.h>
#include <cerrno>

#include <string>
#include <iostream>

#include <cppevent_base/util.hpp>
#include <cppevent_base/event_loop.hpp>
#include <cppevent_base/event_listener.hpp>

int executor::open_file(std::string_view dir_name, std::string_view name, int flags) {
    std::string path { dir_name };
    path.push_back('/');
    path.append(name);
    int fd = open(path.c_str(), flags, S_IRWXU);
    cppevent::throw_if_error(fd, "File open failed: ");
    return fd;
}

void compile_in_child(pid_t child_pid, int err_fd, const char* dir, std::string_view lang) {
    if (child_pid != 0) {
        return;
    }
    cppevent::throw_if_error(chdir(dir), "Error when changing working directory: ");
    cppevent::throw_if_error(dup2(err_fd, STDERR_FILENO), "Error when dup2: ");
    if (lang == "cpp") {
        execlp("g++", "g++", "-o", "source", "source.cpp", (char*) NULL);
    } else if (lang == "java") {
        execlp("javac", "javac", "Source.java", (char*) NULL);
    }
}

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

cppevent::awaitable_task<bool> executor::await_compile(int err_fd, cppevent::event_loop& e_loop,
                                                       const char* dir, std::string_view lang) {
    if (lang == "python") {
        co_return true;
    }

    pid_t child_pid = fork();
    cppevent::throw_if_error(child_pid, "Error when forking: ");
    compile_in_child(child_pid, err_fd, dir, lang);

    int pid_fd = syscall(SYS_pidfd_open, child_pid, O_NONBLOCK);
    cppevent::throw_if_error(pid_fd, "Error when creating pidfd: ");

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

void run_in_child(pid_t child_pid, int out_fd, const char* dir, std::string_view lang) {
    if (child_pid != 0) {
        return;
    }
    cppevent::throw_if_error(chdir(dir), "Error when changing working directory: ");
    cppevent::throw_if_error(dup2(out_fd, STDOUT_FILENO), "Error when dup2: ");
    cppevent::throw_if_error(dup2(out_fd, STDERR_FILENO), "Error when dup2: ");
    if (lang == "cpp") {
        execl("./source", "./source", (char*) NULL);
    } else if (lang == "java") {
        execlp("java", "java", "Source", (char*) NULL);
    } else if (lang == "python") {
        execlp("python3", "python3", "source.py", (char*) NULL);
    }
}

cppevent::awaitable_task<bool> executor::await_run(int out_fd,
                                                   cppevent::event_loop& e_loop,
                                                   const char* dir, std::string_view lang) {
    pid_t child_pid = fork();
    cppevent::throw_if_error(child_pid, "Error when forking: ");
    run_in_child(child_pid, out_fd, dir, lang);

    int pid_fd = syscall(SYS_pidfd_open, child_pid, O_NONBLOCK);
    cppevent::throw_if_error(pid_fd, "Error when creating pidfd: ");

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
