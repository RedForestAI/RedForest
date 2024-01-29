"use client";

import { MiddleNavBarProvider, EndNavBarProvider } from "./navbar-provider";
import { WebGazerProvider } from "./WebGazerContext"
import React, { type PropsWithChildren } from "react";

export function Providers({ children }: PropsWithChildren) {
  return (
    <>
      <WebGazerProvider>
        <MiddleNavBarProvider>
          <EndNavBarProvider>
                {children}
          </EndNavBarProvider>
        </MiddleNavBarProvider>
      </WebGazerProvider>
    </>
  );
}
