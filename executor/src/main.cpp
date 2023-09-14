#include <iostream>

#include "exec_endpoint.hpp"

#include <cppevent_base/event_loop.hpp>

#include <cppevent_fcgi/fcgi_server.hpp>
#include <cppevent_fcgi/router.hpp>

int main() {
    cppevent::event_loop e_loop;
    cppevent::router routes;
    executor::exec_endpoint exec;
    routes.post("/api/v1/execute/{lang}", exec);
    cppevent::fcgi_server server("localhost", "9000", e_loop, routes);
    e_loop.run();
    return 0;
}
