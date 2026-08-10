"use client";

/** Shared SSR-safe loading frame for dashboard shells (avoids hydration mismatch). */
export function DashboardLoading({ label = "Loading dashboard…" }: { label?: string }) {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-[#F8FAFC] text-slate-500"
      suppressHydrationWarning
    >
      {label}
    </div>
  );
}
