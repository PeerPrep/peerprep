#ifndef EXECUTOR_UTIL_HPP
#define EXECUTOR_UTIL_HPP

#include <cppevent_base/task.hpp>

#include <unordered_map>
#include <vector>
#include <string_view>

namespace cppevent {

class event_loop;

}

namespace executor {

int open_file(std::string_view dir_name, std::string_view name, int flags);

cppevent::awaitable_task<bool> await_compile(int err_fd, cppevent::event_loop& e_loop,
                                             const char* dir, std::string_view lang);

cppevent::awaitable_task<bool> await_run(int out_fd, int err_fd, cppevent::event_loop& e_loop,
                                         const char* dir, std::string_view lang);


}

#endif
