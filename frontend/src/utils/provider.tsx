"use client";

import { AntdProvider } from "@/app/components/AntdProvider/AntdProvider";
import useLoading from "@/app/hooks/useLoading";
import LoadingPage from "@/app/loading";
import React from "react";

function Providers({ children }: React.PropsWithChildren) {
  const isLoading = useLoading();

  if (isLoading) {
    <LoadingPage />;
  }

  return <AntdProvider>{children}</AntdProvider>;
}

export default Providers;
