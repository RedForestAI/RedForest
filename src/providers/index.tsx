"use client";

import { MiddleNavBarProvider } from "./navbar-provider";
import React, { type PropsWithChildren } from "react";

export function Providers({ children }: PropsWithChildren) {
  return (
    <>
      <MiddleNavBarProvider>
        {children}
      </MiddleNavBarProvider>
    </>
  );
}
