"use client";

import { NavBarProvider } from "./navbar-provider";
import React, { type PropsWithChildren } from "react";

export function Providers({ children }: PropsWithChildren) {
  return (
    <>
      <NavBarProvider>
        {children}
      </NavBarProvider>
    </>
  );
}
