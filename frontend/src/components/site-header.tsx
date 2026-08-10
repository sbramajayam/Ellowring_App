"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, X } from "lucide-react";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useAuth, dashboardPath } from "@/lib/auth-context";
import clsx from "clsx";
import { EllowringLogo } from "@/components/ellowring-logo";

const links = [
  { href: "/coaching", label: "Coaching" },
  { href: "/career-guidance", label: "Career" },
  { href: "/colleges", label: "Colleges" },
  { href: "/courses", label: "Courses" },
  { href: "/internships", label: "Internships" },
  { href: "/jobs", label: "Jobs" },
  { href: "/study-abroad", label: "Study Abroad" },
  { href: "/partner", label: "Partners" },
];

const searchTargets = [
  ...links,
  { href: "/about", label: "About" },
  { href: "/login", label: "Login" },
  { href: "/register", label: "Register" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { user, logout, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    setOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!searchRef.current?.contains(e.target as Node)) setSearchOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const showUser = hydrated && !loading && !!user;
  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return [];
    return searchTargets.filter((item) => item.label.toLowerCase().includes(query)).slice(0, 6);
  }, [q]);

  function onSearchSubmit(e: FormEvent) {
    e.preventDefault();
    if (results[0]) {
      window.location.href = results[0].href;
    }
  }

  return (
    <header
      className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl"
      suppressHydrationWarning
    >
      <div className="mx-auto flex h-[72px] max-w-[1200px] items-center gap-6 px-5 md:px-8 lg:gap-8">
        {/* Brand */}
        <Link href="/" className="shrink-0 transition-opacity hover:opacity-90" aria-label="Ellowring home">
          <EllowringLogo variant="horizontal" size="md" className="origin-left scale-[1.08]" />
        </Link>

        {/* Primary nav — equal rhythm, padded hit targets */}
        <nav className="hidden flex-1 items-center justify-center gap-0.5 xl:flex">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={clsx(
                  "rounded-full px-3 py-2 font-display text-[13px] font-semibold tracking-[-0.01em] transition-colors",
                  active
                    ? "bg-[#EEF2FF] text-[#0F3DDE]"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <div className="relative" ref={searchRef}>
            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              className={clsx(
                "inline-flex h-10 w-10 items-center justify-center rounded-full border transition",
                searchOpen
                  ? "border-[#0F3DDE]/30 bg-[#EEF2FF] text-[#0F3DDE]"
                  : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-800",
              )}
              aria-label="Open search"
            >
              <Search size={16} strokeWidth={2} />
            </button>
            {searchOpen ? (
              <form
                onSubmit={onSearchSubmit}
                className="absolute right-0 top-[calc(100%+10px)] z-50 w-[min(320px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
              >
                <div className="relative border-b border-slate-100">
                  <Search
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    size={15}
                  />
                  <input
                    autoFocus
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search coaching, colleges, jobs…"
                    className="w-full bg-white py-3 pl-10 pr-3 font-display text-sm text-slate-800 outline-none placeholder:text-slate-400"
                  />
                </div>
                {results.length > 0 ? (
                  <ul className="max-h-64 overflow-y-auto p-1.5">
                    {results.map((r) => (
                      <li key={r.href}>
                        <Link
                          href={r.href}
                          onClick={() => setSearchOpen(false)}
                          className="block rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-[#EEF2FF] hover:text-[#0F3DDE]"
                        >
                          {r.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="px-4 py-3 text-xs text-slate-400">Try “Colleges”, “Jobs”, “NEET”…</p>
                )}
              </form>
            ) : null}
          </div>

          <div className="hidden h-6 w-px bg-slate-200 sm:block" />

          <div className="hidden items-center gap-2.5 md:flex">
            {!hydrated || loading ? (
              <div className="h-10 w-36 animate-pulse rounded-full bg-slate-100" aria-hidden />
            ) : showUser ? (
              <>
                <button
                  type="button"
                  onClick={logout}
                  className="inline-flex h-10 items-center rounded-full px-3.5 font-display text-[13px] font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                >
                  Logout
                </button>
                <Link
                  href={dashboardPath(user!.role)}
                  className="inline-flex h-10 items-center rounded-full bg-[#0F3DDE] px-4 font-display text-[13px] font-semibold text-white shadow-[0_8px_20px_rgba(15,61,222,0.22)] transition hover:bg-[#0C32B8]"
                >
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="inline-flex h-10 items-center rounded-full px-3.5 font-display text-[13px] font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="inline-flex h-10 items-center rounded-full bg-[#0F3DDE] px-4 font-display text-[13px] font-semibold text-white shadow-[0_8px_20px_rgba(15,61,222,0.22)] transition hover:bg-[#0C32B8]"
                >
                  Start Learning
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition hover:bg-slate-50 xl:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-slate-100 bg-white px-5 py-4 xl:hidden">
          <nav className="grid gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={clsx(
                  "rounded-xl px-3 py-2.5 font-display text-sm font-semibold",
                  pathname === l.href ? "bg-[#EEF2FF] text-[#0F3DDE]" : "text-slate-700 hover:bg-slate-50",
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 font-display text-sm font-semibold text-slate-800"
            >
              Login
            </Link>
            <Link
              href="/register"
              onClick={() => setOpen(false)}
              className="inline-flex h-11 items-center justify-center rounded-full bg-[#0F3DDE] font-display text-sm font-semibold text-white"
            >
              Start Learning
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
