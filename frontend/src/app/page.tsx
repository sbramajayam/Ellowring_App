"use client";

import { useEffect } from "react";
import { WEBSITE_URL } from "@/lib/site";

/**
 * Mandatory flow: Website first → App after.
 * `/` opens the marketing website; `/login` and dashboards are the web app.
 */
export default function HomeRedirectPage() {
  useEffect(() => {
    window.location.replace(`${WEBSITE_URL}/`);
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#F8F9FA] px-4 text-center">
      <p className="text-sm font-semibold text-slate-600">Opening Ellowring website…</p>
      <a
        href={`${WEBSITE_URL}/`}
        className="text-sm font-bold text-[#0B1F3A] underline underline-offset-2"
      >
        Continue to website
      </a>
      <p className="mt-4 text-xs text-slate-500">
        App Sign In stays on{" "}
        <a href="/login" className="underline underline-offset-2">
          /login
        </a>
      </p>
    </div>
  );
}
