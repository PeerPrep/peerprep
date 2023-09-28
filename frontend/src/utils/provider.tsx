"use client";

import React from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
import { AntdProvider } from "@/app/components/AntdProvider/AntdProvider";

function Providers({ children }: React.PropsWithChildren) {
  const [client] = React.useState(new QueryClient());

  return (
    <AntdProvider>
      <QueryClientProvider client={client}>
        <ReactQueryStreamedHydration>{children}</ReactQueryStreamedHydration>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AntdProvider>
  );
}

export default Providers;
