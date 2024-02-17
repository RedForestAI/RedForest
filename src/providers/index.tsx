"use client";

import { MiddleNavBarProvider, EndNavBarProvider } from "./navbar-provider";
import { HighlightProvider } from "./highlight-provider";
import React, { type PropsWithChildren } from "react";

export function Providers({ children }: PropsWithChildren) {
  return (
    <>
        <MiddleNavBarProvider>
          <EndNavBarProvider>
            <HighlightProvider>
              {children}
            </HighlightProvider>
          </EndNavBarProvider>
        </MiddleNavBarProvider>
    </>
  );
}
