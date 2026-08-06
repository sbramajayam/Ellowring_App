"use client";

import { Suspense } from "react";
import { AppLoginScreen } from "@/components/app-login-screen";

/** Root route — web application login (no marketing site). */
export default function RootPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#0B2A6B] text-blue-100">
          Loading…
        </div>
      }
    >
      <AppLoginScreen />
    </Suspense>
  );
}
