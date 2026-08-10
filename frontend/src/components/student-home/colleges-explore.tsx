"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Award,
  Bookmark,
  Building2,
  CheckCircle2,
  ChevronDown,
  Filter,
  GraduationCap,
  Loader2,
  MapPin,
  Search,
  SlidersHorizontal,
  Star,
  Wallet,
} from "lucide-react";
import clsx from "clsx";
import { BrandLogo } from "@/components/student-home/brand-logo";
import {
  CollageTitle,
  PillButton,
  SoftIcon,
  WhiteCard,
} from "@/components/student-home/collage-ui";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { labelOf } from "@/lib/labels";

type Ranking = { source?: string; rank?: number; year?: number; category?: string };
type College = {
  id: string;
  name: string;
  city?: string | null;
  state?: string | null;
  type?: string | null;
  website?: string | null;
  description?: string | null;
  logoUrl?: string | null;
  isVerified?: boolean;
  rankings?: Ranking[];
};

const FALLBACK: College[] = [
  {
    id: "mock-c1",
    name: "PSG College of Technology",
    city: "Coimbatore",
    state: "Tamil Nadu",
    type: "Engineering",
    isVerified: true,
    rankings: [{ source: "NIRF", rank: 48 }],
  },
  {
    id: "mock-c2",
    name: "SSN College of Engineering",
    city: "Chennai",
    state: "Tamil Nadu",
    type: "Engineering",
    isVerified: true,
    rankings: [{ source: "NIRF", rank: 45 }],
  },
  {
    id: "mock-c3",
    name: "Thiagarajar College of Engineering",
    city: "Madurai",
    state: "Tamil Nadu",
    type: "Engineering",
    rankings: [{ source: "NIRF", rank: 64 }],
  },
  {
    id: "mock-c4",
    name: "Sri Venkateswara College of Engineering",
    city: "Chennai",
    state: "Tamil Nadu",
    type: "Engineering",
    isVerified: true,
  },
  {
    id: "mock-c5",
    name: "Kongu Engineering College",
    city: "Erode",
    state: "Tamil Nadu",
    type: "Engineering",
    rankings: [{ source: "NIRF", rank: 91 }],
  },
];

const FILTER_PILLS = [
  { id: "district", label: "District", icon: MapPin },
  { id: "course", label: "Course", icon: GraduationCap },
  { id: "fees", label: "Fees", icon: Wallet },
  { id: "placement", label: "Placement", icon: Building2 },
  { id: "scholarship", label: "Scholarship", icon: Award },
  { id: "ownership", label: "Ownership", icon: SlidersHorizontal },
];

const SCHOLARSHIPS = [
  {
    title: "Central / State Govt",
    body: "NSP & TN BC/MBC schemes",
    amount: "Up to ₹50K",
    tone: "bg-blue-50 text-[#0F3DDE] ring-blue-100",
    bar: "bg-[#0F3DDE]",
  },
  {
    title: "Merit Scholars",
    body: "90%+ board / entrance",
    amount: "₹25–75K",
    tone: "bg-amber-50 text-amber-700 ring-amber-100",
    bar: "bg-amber-500",
  },
  {
    title: "Minority Support",
    body: "Community & institute aid",
    amount: "₹15–40K",
    tone: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    bar: "bg-emerald-500",
  },
  {
    title: "Private Foundation",
    body: "CSR & trust fellowships",
    amount: "₹30–1L",
    tone: "bg-violet-50 text-violet-700 ring-violet-100",
    bar: "bg-violet-500",
  },
];

const CAMPUS_GRADIENTS = [
  "from-[#0B1F3A] via-[#0F3DDE] to-[#60A5FA]",
  "from-[#0F3DDE] via-[#2563EB] to-[#93C5FD]",
  "from-[#082f49] via-[#0284c7] to-[#7dd3fc]",
  "from-[#1e3a5f] via-[#1d4ed8] to-[#818cf8]",
];

const COMPARE_ROWS = [
  { label: "Fees / yr", a: "₹1.8L", b: "₹2.1L", c: "₹1.5L" },
  { label: "NIRF", a: "#48", b: "#45", c: "#64" },
  { label: "Placement", a: "92%", b: "94%", c: "88%" },
  { label: "Scholarship", a: "Yes", b: "Limited", c: "Yes" },
];

function nirfRank(college: College): string | null {
  const nirf = college.rankings?.find((r) => String(r.source || "").toUpperCase() === "NIRF");
  return nirf?.rank != null ? String(nirf.rank) : null;
}

function placementOf(college: College): string {
  const rank = Number(nirfRank(college) || 80);
  if (rank <= 50) return "94% placed";
  if (rank <= 80) return "89% placed";
  return "82% placed";
}

function scholarshipOf(college: College, index: number): string {
  if (index % 2 === 0) return "Merit + Hostel aid";
  return "Govt / Trust aid";
}

function ratingOf(college: College): string {
  const rank = Number(nirfRank(college) || 70);
  if (rank <= 50) return "4.6";
  if (rank <= 80) return "4.3";
  return "4.0";
}

export function CollegesExploreContent({
  showTitle = true,
  compact = false,
}: {
  showTitle?: boolean;
  compact?: boolean;
}) {
  const { token, user } = useAuth();
  const firstName =
    user?.name?.replace(/^Mr\.?\s+/i, "").trim().split(/\s+/)[0] || "Vignesh";
  const [items, setItems] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [carouselIdx, setCarouselIdx] = useState(0);
  const [bookmarked, setBookmarked] = useState<Record<string, boolean>>({});

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const list = await api<College[]>("/colleges", { token: token || undefined });
      setItems(Array.isArray(list) && list.length ? list : FALLBACK);
    } catch {
      setItems(FALLBACK);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const hay = `${item.name} ${item.city || ""} ${item.state || ""} ${item.type || ""}`.toLowerCase();
      if (query.trim() && !hay.includes(query.trim().toLowerCase())) return false;
      if (activeFilter === "course" && !(item.type || "").toLowerCase().includes("eng")) return false;
      if (activeFilter === "district") {
        const city = (item.city || "").toLowerCase();
        if (!city.includes("chennai") && !city.includes("coimbatore") && !city.includes("madurai")) {
          return false;
        }
      }
      if (activeFilter === "placement" && !nirfRank(item)) return false;
      return true;
    });
  }, [items, query, activeFilter]);

  const sponsored = filtered.slice(0, compact ? 3 : 5);
  const nearYou = (
    filtered.filter((c) => {
      const city = (c.city || "").toLowerCase();
      return (
        city.includes("chennai") ||
        city.includes("coimbatore") ||
        city.includes("madurai") ||
        city.includes("erode")
      );
    }).length
      ? filtered.filter((c) => {
          const city = (c.city || "").toLowerCase();
          return (
            city.includes("chennai") ||
            city.includes("coimbatore") ||
            city.includes("madurai") ||
            city.includes("erode")
          );
        })
      : filtered
  ).slice(0, compact ? 3 : 4);

  useEffect(() => {
    if (sponsored.length <= 1) return;
    const t = window.setInterval(() => {
      setCarouselIdx((i) => (i + 1) % sponsored.length);
    }, 4500);
    return () => window.clearInterval(t);
  }, [sponsored.length]);

  return (
    <div className="space-y-5 lg:space-y-6">
      {showTitle ? (
        <CollageTitle
          title="Explore Colleges & Scholarships"
          subtitle={`Shortlist campuses, fees & funding near ${firstName}`}
          icon={GraduationCap}
        />
      ) : null}

      <div className="flex gap-2">
        <div className="relative min-w-0 flex-1">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            size={16}
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search college, city, course…"
            className="w-full rounded-full border-0 bg-white py-2.5 pl-10 pr-4 text-[13px] text-[#0B1F3A] shadow-[0_2px_14px_rgba(15,23,42,0.06)] outline-none ring-1 ring-slate-200 placeholder:text-slate-400 focus:ring-[#93C5FD]"
          />
        </div>
        <button
          type="button"
          className="inline-flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full bg-[#0F3DDE] text-white shadow-[0_8px_18px_rgba(15,61,222,0.25)]"
          aria-label="Open filters"
          onClick={() => setActiveFilter((f) => (f ? null : "district"))}
        >
          <Filter size={16} />
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {FILTER_PILLS.map((f) => {
          const Icon = f.icon;
          const active = activeFilter === f.id;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setActiveFilter((prev) => (prev === f.id ? null : f.id))}
              className={clsx(
                "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-[12px] font-bold transition",
                active
                  ? "bg-[#0F3DDE] text-white shadow-sm"
                  : "bg-white text-slate-600 ring-1 ring-slate-200",
              )}
            >
              <Icon size={13} />
              {f.label}
              <ChevronDown size={12} className={clsx(active && "rotate-180")} />
            </button>
          );
        })}
      </div>

      {loading ? (
        <p className="inline-flex items-center gap-2 text-sm text-slate-500">
          <Loader2 className="animate-spin" size={16} /> Loading colleges…
        </p>
      ) : null}
      {error ? (
        <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-100">{error}</p>
      ) : null}

      <WhiteCard
        title="Sponsored Colleges"
        action={<span className="text-[11px] font-bold text-amber-600">Promoted</span>}
      >
        <div className="flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {sponsored.map((c, i) => {
            const rank = nirfRank(c);
            return (
              <article
                key={c.id}
                className={clsx(
                  "min-w-[260px] max-w-[280px] overflow-hidden rounded-2xl bg-white ring-1 ring-slate-100 shadow-[0_2px_12px_rgba(15,23,42,0.05)] transition",
                  carouselIdx === i && "ring-[#93C5FD]",
                )}
              >
                <div
                  className={clsx(
                    "relative h-[92px] bg-gradient-to-br",
                    CAMPUS_GRADIENTS[i % CAMPUS_GRADIENTS.length],
                  )}
                >
                  <span className="absolute left-2.5 top-2.5 rounded-full bg-amber-400 px-2 py-0.5 text-[9px] font-extrabold text-[#0B1F3A]">
                    Sponsored
                  </span>
                  <div className="absolute -bottom-5 left-3">
                    <BrandLogo name={c.name} className="h-11 w-11 shadow-md" rounded="xl" />
                  </div>
                </div>
                <div className="px-3.5 pb-3.5 pt-7">
                  <h3 className="text-[13px] font-extrabold leading-snug text-[#0B1F3A]">{c.name}</h3>
                  <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-slate-500">
                    <MapPin size={11} /> {[c.city, c.state].filter(Boolean).join(", ") || "India"}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <span className="rounded-full bg-[#EFF6FF] px-2 py-0.5 text-[10px] font-bold text-[#0F3DDE]">
                      {placementOf(c)}
                    </span>
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                      {scholarshipOf(c, i)}
                    </span>
                    {rank ? (
                      <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-600 ring-1 ring-slate-200">
                        NIRF #{rank}
                      </span>
                    ) : null}
                  </div>
                  {c.website ? (
                    <a
                      href={c.website.startsWith("http") ? c.website : `https://${c.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-[#0F3DDE] px-3 py-2 text-[11px] font-bold text-white"
                    >
                      Know More
                    </a>
                  ) : (
                    <PillButton className="mt-3 w-full !py-2 !text-[11px]">Know More</PillButton>
                  )}
                </div>
              </article>
            );
          })}
        </div>
        {sponsored.length > 1 ? (
          <div className="mt-3 flex justify-center gap-1.5">
            {sponsored.map((c, i) => (
              <button
                key={c.id}
                type="button"
                aria-label={`Slide ${i + 1}`}
                onClick={() => setCarouselIdx(i)}
                className={clsx(
                  "h-1.5 rounded-full transition-all",
                  carouselIdx === i ? "w-5 bg-[#0F3DDE]" : "w-1.5 bg-slate-300",
                )}
              />
            ))}
          </div>
        ) : null}
        {!loading && sponsored.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-500">No colleges match your filters.</p>
        ) : null}
      </WhiteCard>

      <WhiteCard
        title="Colleges Near You"
        action={<span className="text-[11px] font-bold text-slate-400">TN focus</span>}
      >
        <ul className="space-y-2.5">
          {nearYou.map((c, i) => (
            <li
              key={c.id}
              className="flex flex-wrap items-center gap-3 rounded-2xl bg-slate-50 px-3 py-3 ring-1 ring-slate-100"
            >
              <BrandLogo name={c.name} className="h-11 w-11 shrink-0" rounded="xl" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  {i === 0 ? (
                    <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[9px] font-extrabold text-white">
                      Free Promotion
                    </span>
                  ) : null}
                  <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-amber-600">
                    <Star size={11} className="fill-amber-500 text-amber-500" />
                    {ratingOf(c)}
                  </span>
                </div>
                <p className="mt-0.5 text-[13px] font-extrabold text-[#0B1F3A]">{c.name}</p>
                <p className="text-[11px] text-slate-500">
                  <MapPin size={10} className="inline" /> {[c.city, c.state].filter(Boolean).join(", ")}
                  {nirfRank(c) ? ` · NIRF #${nirfRank(c)}` : ""}
                  {" · "}
                  {labelOf(c.type, "Campus")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Bookmark college"
                  onClick={() =>
                    setBookmarked((prev) => ({ ...prev, [c.id]: !prev[c.id] }))
                  }
                  className={clsx(
                    "inline-flex h-9 w-9 items-center justify-center rounded-full bg-white ring-1 ring-slate-200",
                    bookmarked[c.id] ? "text-[#0F3DDE]" : "text-slate-400",
                  )}
                >
                  <Bookmark size={15} className={bookmarked[c.id] ? "fill-current" : ""} />
                </button>
                <PillButton
                  tone="outline"
                  className="!border-emerald-200 !px-3 !py-1.5 !text-[11px] !text-emerald-700 !ring-emerald-200"
                  href="/dashboard/student/admissions"
                >
                  Apply Now
                </PillButton>
              </div>
            </li>
          ))}
        </ul>
      </WhiteCard>

      <WhiteCard title="Scholarships">
        <div className="flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {SCHOLARSHIPS.map((s) => (
            <article
              key={s.title}
              className={clsx(
                "min-w-[200px] max-w-[220px] overflow-hidden rounded-2xl p-3.5 ring-1",
                s.tone,
              )}
            >
              <div className={clsx("mb-2 h-1 w-10 rounded-full", s.bar)} />
              <SoftIcon icon={Award} className="h-9 w-9 bg-white/80" />
              <h3 className="mt-2 text-[13px] font-extrabold text-[#0B1F3A]">{s.title}</h3>
              <p className="mt-0.5 text-[11px] opacity-80">{s.body}</p>
              <p className="mt-2 text-[12px] font-extrabold">{s.amount}</p>
              <PillButton
                href="/dashboard/student/ai-hub#scholarship"
                className="mt-3 w-full !py-1.5 !text-[11px]"
              >
                Apply
              </PillButton>
            </article>
          ))}
        </div>
      </WhiteCard>

      <section className="overflow-hidden rounded-[22px] bg-[#EFF6FF] p-4 ring-1 ring-[#BFDBFE] lg:p-5">
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wide text-[#0F3DDE]">
              Compare & Choose
            </p>
            <h3 className="mt-1 font-display text-lg font-extrabold text-[#0B1F3A]">
              Side-by-side fees, NIRF & placements
            </h3>
            <ul className="mt-3 space-y-1.5">
              {[
                "Pick up to 3 campuses",
                "AI ranks fit for your budget & course",
                "See scholarship probability",
              ].map((t) => (
                <li key={t} className="flex items-center gap-2 text-[12px] font-semibold text-[#0B1F3A]">
                  <CheckCircle2 size={15} className="text-[#0F3DDE]" />
                  {t}
                </li>
              ))}
            </ul>
            <PillButton href="/dashboard/student/ai-assistant" className="mt-4">
              Start Comparing
            </PillButton>
          </div>
          <div className="overflow-hidden rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-100">
            <div className="mb-2 grid grid-cols-4 gap-1 text-[9px] font-bold text-slate-400">
              <span />
              <span className="text-center text-[#0F3DDE]">PSG</span>
              <span className="text-center text-[#0F3DDE]">SSN</span>
              <span className="text-center text-[#0F3DDE]">TCE</span>
            </div>
            {COMPARE_ROWS.map((row) => (
              <div
                key={row.label}
                className="grid grid-cols-4 gap-1 border-t border-slate-50 py-1.5 text-[10px]"
              >
                <span className="font-semibold text-slate-500">{row.label}</span>
                <span className="text-center font-bold text-[#0B1F3A]">{row.a}</span>
                <span className="text-center font-bold text-[#0B1F3A]">{row.b}</span>
                <span className="text-center font-bold text-[#0B1F3A]">{row.c}</span>
              </div>
            ))}
            <Link
              href="/dashboard/student/colleges"
              className="mt-2 block text-center text-[11px] font-bold text-[#0F3DDE]"
            >
              Open full compare →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
