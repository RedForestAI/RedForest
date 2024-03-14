"use client";

import { InAssignmentProvider } from "./InAssignmentProvider";
import { MiddleNavBarProvider, EndNavBarProvider } from "./NavbarProvider";
import { HighlightProvider } from "./HighlightProvider";
import React, { type PropsWithChildren } from "react";

export function Providers({ children }: PropsWithChildren) {
  return (
    <>
        <MiddleNavBarProvider>
          <EndNavBarProvider>
            <InAssignmentProvider>
              <HighlightProvider>
                {children}
              </HighlightProvider>
            </InAssignmentProvider>
          </EndNavBarProvider>
        </MiddleNavBarProvider>
    </>
  );
}
