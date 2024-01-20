"use client";

import { type } from "os";
import React, { useState } from "react";

type SlotProps = {
  children: React.ReactNode
}

export default function Slot(props: SlotProps) {
  const [children, setChildren] = useState<React.ReactNode>(props.children)

  return (
    <>
      {children}
    </>
  )  
}