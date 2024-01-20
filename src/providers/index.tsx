"use client";

import { ThemeProvider } from "next-themes";
import React, { type PropsWithChildren } from "react";

export function Providers({ children }: PropsWithChildren) {
  return (
    <>
      {/* <ThemeProvider> */}
        {children}
      {/* </ThemeProvider> */}
    </>
  );
}
