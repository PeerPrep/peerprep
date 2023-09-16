cmake_minimum_required(VERSION 3.1)

project(executor
    VERSION 1.0
    DESCRIPTION "executor service"
    LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -fcoroutines")

add_subdirectory(libs/cppevent-base)
add_subdirectory(libs/cppevent-net)
add_subdirectory(libs/cppevent-fcgi)

add_executable(executor
    src/exec_endpoint.cpp
    src/child_process.cpp
    src/util.cpp
    src/main.cpp
)

target_link_libraries(executor PRIVATE cppevent-fcgi)
