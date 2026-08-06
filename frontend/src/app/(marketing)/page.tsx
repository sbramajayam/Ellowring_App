import Link from "next/link";
import { ArrowRight, Briefcase, Globe2, GraduationCap, Sparkles } from "lucide-react";

const pathways = [
  {
    href: "/study-abroad",
    title: "Study Abroad",
    hint: "University shortlist · visas · scholarships",
    icon: Globe2,
  },
  {
    href: "/courses",
    title: "Training & Courses",
    hint: "Live projects · mentor labs · certificates",
    icon: GraduationCap,
  },
  {
    href: "/internships",
    title: "Internships",
    hint: "Company projects · mentor reviews · LOR",
    icon: Sparkles,
  },
  {
    href: "/jobs",
    title: "Placements & Jobs",
    hint: "Mocks · partner drives · offers",
    icon: Briefcase,
  },
];

/** Marketing website home — first screen on GitHub Pages. */
export default function MarketingHomePage() {
  return (
    <div className="bg-[#F4F7FB]">
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 60% 50% at 85% 20%, rgba(37,99,235,0.12), transparent 55%), radial-gradient(ellipse 45% 40% at 10% 90%, rgba(148,163,184,0.18), transparent 60%)",
          }}
          aria-hidden
        />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 md:px-6 md:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12 lg:py-24">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2563EB]">
              Ellowring Software Solutions
            </p>
            <h1 className="mt-3 font-display text-[clamp(2rem,4.5vw,3.25rem)] font-extrabold leading-[1.12] tracking-tight text-slate-900">
              Global Education, Career &amp;{" "}
              <span className="text-slate-400">Startup Ecosystem</span>
            </h1>
            <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-slate-500 md:text-[17px]">
              One platform to learn, grow, build &amp; launch — programs, placements, and partner
              pathways under Ellowring.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/courses"
                className="inline-flex h-11 items-center gap-2 rounded-full bg-[#2563EB] px-6 text-[14px] font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
              >
                Explore Programs <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex h-11 items-center gap-2 rounded-full border border-slate-300 bg-white px-6 text-[14px] font-bold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50"
              >
                Sign in to app
              </Link>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-slate-200/80 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
              Start your journey
            </p>
            <h2 className="mt-2 font-display text-xl font-extrabold text-slate-900">
              Students · Colleges · HR · Partners
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Create an account or open your workspace dashboard after login.
            </p>
            <div className="mt-6 flex flex-col gap-2.5">
              <Link
                href="/register"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-[#0B1F3A] text-[13px] font-bold text-white"
              >
                Apply / Create account
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-[#F8FAFC] text-[13px] font-bold text-slate-700"
              >
                Talk to counsellor
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200/80 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-16">
          <h2 className="font-display text-2xl font-extrabold text-slate-900 md:text-3xl">
            Pathways
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-500 md:text-base">
            Browse public pathways on the website, then sign in for your role dashboard.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {pathways.map((p) => {
              const Icon = p.icon;
              return (
                <Link
                  key={p.href}
                  href={p.href}
                  className="group rounded-2xl border border-slate-200 bg-[#F8FAFC] p-5 transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-white hover:shadow-md"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-[#2563EB] ring-1 ring-slate-200">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-display text-[17px] font-bold text-slate-900 group-hover:text-[#2563EB]">
                    {p.title}
                  </h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-slate-500">{p.hint}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
