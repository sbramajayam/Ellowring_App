import Link from "next/link";
import { EllowringLogo } from "@/components/ellowring-logo";
import { WEBSITE_URL } from "@/lib/site";

const columns = [
  {
    title: "Explore",
    links: [
      { label: "Home", href: `${WEBSITE_URL}/`, external: true },
      { label: "About Us", href: `${WEBSITE_URL}/#about`, external: true },
      { label: "Vision & Mission", href: `${WEBSITE_URL}/#vision`, external: true },
      { label: "Services", href: `${WEBSITE_URL}/services`, external: true },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Pathways",
    links: [
      { label: "Study Abroad", href: "/study-abroad" },
      { label: "Training Programs", href: "/courses" },
      { label: "College Workshops", href: "/colleges" },
      { label: "Internships", href: "/internships" },
      { label: "Projects", href: "/projects" },
      { label: "Placements", href: "/jobs" },
    ],
  },
  {
    title: "Get started",
    links: [
      { label: "Startup Hub", href: `${WEBSITE_URL}/#startup`, external: true },
      { label: "HR / Companies", href: "/login?next=/dashboard/hr" },
      { label: "Register", href: "/register" },
      { label: "Log in", href: "/login" },
      { label: "Activities", href: `${WEBSITE_URL}/activities`, external: true },
    ],
  },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-white/5 bg-[#071525] text-white">
      <div className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-14">
        <div className="flex flex-col gap-5 rounded-[1.5rem] border border-white/10 bg-gradient-to-r from-white/[0.06] to-white/[0.02] p-6 md:flex-row md:items-center md:justify-between md:p-7">
          <div className="flex items-center gap-3.5">
            <EllowringLogo variant="mark" size="md" dark />
            <div>
              <div className="font-display text-[16px] font-extrabold tracking-tight">ELLOWRING</div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/40">
                Software Solutions
              </div>
            </div>
          </div>
          <p className="max-w-md text-[13px] leading-relaxed text-white/55 md:text-right">
            Global Education · Career · Startup Ecosystem — Electronic City, Bangalore.
          </p>
        </div>

        <div className="mt-11 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:gap-14">
          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-teal-300/75">{col.title}</p>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href + link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        className="group inline-flex items-center gap-2.5 text-[14px] font-semibold text-white/70 transition hover:text-white"
                      >
                        <span className="h-1.5 w-1.5 shrink-0 rounded-[2px] bg-teal-300/50 group-hover:bg-teal-300" />
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="group inline-flex items-center gap-2.5 text-[14px] font-semibold text-white/70 transition hover:text-white"
                      >
                        <span className="h-1.5 w-1.5 shrink-0 rounded-[2px] bg-teal-300/50 group-hover:bg-teal-300" />
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-[12px] text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Ellowring Software Solutions. All rights reserved.</p>
          <a
            href="https://www.ellowring.com"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-white/60 transition hover:text-white"
          >
            www.ellowring.com
          </a>
        </div>
      </div>
    </footer>
  );
}
