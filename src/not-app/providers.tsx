'use client';
import React from "react";
import { useServerInsertedHTML } from "next/navigation";
import { NextUIProvider, CssBaseline } from "@nextui-org/react";

export default function Providers({ children }: { children: React.ReactNode }) {
  useServerInsertedHTML(() => {
    return <>{CssBaseline.flush()}</>;
  });

  return (
    <>
      <NextUIProvider>{children}</NextUIProvider>
    </>
  );
}
