"use client";

import { AntdProvider } from "@/app/components/AntdProvider/AntdProvider";
import useLoading from "@/app/hooks/useLoading";
import useRedirectLogin from "@/app/hooks/useRedirectLogin";
import LoadingPage from "@/app/loading";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
import { Provider } from "jotai";
import React from "react";

function Providers({ children }: React.PropsWithChildren) {
  const [client] = React.useState(new QueryClient());
  const isLoading = useLoading();

  if (isLoading) {
    <LoadingPage />;
  }

  return (
    <Provider>
      <AntdProvider>
        <QueryClientProvider client={client}>
          <ReactQueryStreamedHydration>{children}</ReactQueryStreamedHydration>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </AntdProvider>
    </Provider>
  );
}

export default Providers;
