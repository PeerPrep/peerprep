#include <iostream>

#include "exec_endpoint.hpp"

#include <cppevent_base/event_loop.hpp>

#include <cppevent_fcgi/fcgi_server.hpp>
#include <cppevent_fcgi/router.hpp>

int main() {
    cppevent::event_loop e_loop;
    cppevent::router routes;
    executor::exec_endpoint exec(e_loop);
    routes.post("/api/v1/execute/{lang}", exec);
    cppevent::fcgi_server server("0.0.0.0", "9000", e_loop, routes);
    std::cout << "Starting executor service" << std::endl;
    e_loop.run();
    return 0;
}
