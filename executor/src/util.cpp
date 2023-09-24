#include "util.hpp"

#include "child_process.hpp"

#include <fcntl.h>
#include <sys/syscall.h>
#include <unistd.h>
#include <cerrno>
#include <signal.h>

#include <string>
#include <iostream>

#include <cppevent_base/util.hpp>
#include <cppevent_base/event_loop.hpp>
#include <cppevent_base/event_listener.hpp>
#include <cppevent_base/async_signal.hpp>
#include <cppevent_base/timer.hpp>

using namespace std::chrono_literals;

constexpr std::chrono::seconds EXECUTION_TIMEOUT = 5s;

constexpr int SOURCE_PROGRAM_UID = 1500;

int executor::open_file(std::string_view dir_name, std::string_view name, int flags) {
    std::string path { dir_name };
    path.push_back('/');
    path.append(name);
    int fd = open(path.c_str(), flags, 0755);
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
    bool compilation_normal = co_await await_child_process(pid_fd, e_loop);

    close(pid_fd);
    co_return compilation_normal;
}

void run_in_child(pid_t child_pid, int out_fd, const char* dir, std::string_view lang) {
    if (child_pid != 0) {
        return;
    }
    try {
        cppevent::throw_if_error(chdir(dir), "Error when changing working directory: ");
        cppevent::throw_if_error(dup2(out_fd, STDOUT_FILENO), "Error when dup2: ");
        cppevent::throw_if_error(dup2(out_fd, STDERR_FILENO), "Error when dup2: ");
        cppevent::throw_if_error(setreuid(SOURCE_PROGRAM_UID, SOURCE_PROGRAM_UID),
                                 "Error when setuid: ");
        int exec_status;
        if (lang == "cpp") {
            exec_status = execl("source", "source", (char*) NULL);
        } else if (lang == "java") {
            exec_status = execlp("java", "java", "Source", (char*) NULL);
        } else if (lang == "python") {
            exec_status = execlp("python3", "python3", "source.py", (char*) NULL);
        }
        cppevent::throw_if_error(exec_status, "Error when exec: ");
    } catch (std::runtime_error err) {
        std::cerr << "(Server error) " << err.what() << std::endl;
        exit(1);
    } 
}

cppevent::awaitable_task<bool> await_child_and_signal(int pid_fd,
                                                      bool& execution_done,
                                                      cppevent::event_loop& e_loop,
                                                      cppevent::signal_trigger trigger) {
    bool child_exited_normally = co_await executor::await_child_process(pid_fd, e_loop);
    execution_done = true;
    trigger.activate();
    co_return child_exited_normally;
}

cppevent::awaitable_task<void> await_timeout(cppevent::event_loop& e_loop,
                                             cppevent::signal_trigger trigger) {
    cppevent::timer t(EXECUTION_TIMEOUT, e_loop);
    co_await t.wait();
    trigger.activate();
}

cppevent::awaitable_task<executor::CODE_EXEC_STATUS> executor::await_run(int out_fd,
                                                                         cppevent::event_loop& e_loop,
                                                                         const char* dir, std::string_view lang) {
    pid_t child_pid = fork();
    cppevent::throw_if_error(child_pid, "Error when forking: ");
    run_in_child(child_pid, out_fd, dir, lang);

    int pid_fd = syscall(SYS_pidfd_open, child_pid, O_NONBLOCK);
    cppevent::throw_if_error(pid_fd, "Error when creating pidfd: ");

    cppevent::async_signal a_signal(e_loop);

    bool exec_done = false;
    auto execution_task = await_child_and_signal(pid_fd, exec_done, e_loop, a_signal.get_trigger());
    auto timeout_task = await_timeout(e_loop, a_signal.get_trigger());

    co_await a_signal.await_signal();
    bool exec_timeout = !exec_done;
    if (exec_timeout) {
        cppevent::throw_if_error(syscall(SYS_pidfd_send_signal, pid_fd, SIGKILL, NULL, 0),
                                 "Failed to kill child: ");
    }

    bool execution_normal = co_await execution_task;
    close(pid_fd);

    if (exec_timeout) {
        co_return CODE_EXEC_STATUS::RUN_TIMEOUT;
    }
    co_return execution_normal ? CODE_EXEC_STATUS::RUN_SUCCESS : CODE_EXEC_STATUS::RUN_ERROR;
}
