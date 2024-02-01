"use client";

import { MiddleNavBarProvider, EndNavBarProvider } from "./navbar-provider";
import React, { type PropsWithChildren } from "react";

export function Providers({ children }: PropsWithChildren) {
  return (
    <>
      <MiddleNavBarProvider>
        <EndNavBarProvider>
          {children}
        </EndNavBarProvider>
      </MiddleNavBarProvider>
    </>
  );
}
