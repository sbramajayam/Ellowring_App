"use client";

import { Suspense } from "react";
import { AppLoginScreen } from "@/components/app-login-screen";

/** Application Sign In — linked from the marketing website. */
export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#E8F1FF] text-[#0F3DDE]">
          Loading…
        </div>
      }
    >
      <AppLoginScreen />
    </Suspense>
  );
}
