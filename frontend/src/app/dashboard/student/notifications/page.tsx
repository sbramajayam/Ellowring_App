"use client";

import Link from "next/link";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import {
  Bell,
  BellRing,
  Briefcase,
  CalendarDays,
  CheckCheck,
  GraduationCap,
  Loader2,
  MapPin,
  Newspaper,
  Sparkles,
  Trophy,
} from "lucide-react";
import clsx from "clsx";
import { StudentShell } from "@/components/student-shell";
import {
  BlueHero,
  CollagePage,
  CollageTitle,
  PillButton,
  SoftIcon,
  WhiteCard,
} from "@/components/student-home/collage-ui";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

type FeedCat = "all" | "exam" | "admissions" | "scholarships" | "internships" | "jobs" | "sponsored";

type FeedItem = {
  id: string;
  title: string;
  message: string;
  category: Exclude<FeedCat, "all">;
  cta: string;
  href: string;
  isRead: boolean;
  createdAt: string;
  location?: string;
  thumb?: string;
};

const MOCK_FEED: FeedItem[] = [
  {
    id: "m1",
    title: "JEE Main Session-2 mock slots open",
    message: "Book your next timed mock before Sunday — AI insights included.",
    category: "exam",
    cta: "Start Mock",
    href: "/dashboard/student/mock-tests",
    isRead: false,
    createdAt: new Date().toISOString(),
    location: "Online · All India",
    thumb: "from-violet-500 to-indigo-600",
  },
  {
    id: "m2",
    title: "VIT early admission counseling",
    message: "Priority counseling window closes in 5 days for 2026 batch.",
    category: "admissions",
    cta: "View Colleges",
    href: "/dashboard/student/colleges",
    isRead: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    location: "Vellore / Chennai",
    thumb: "from-sky-500 to-cyan-600",
  },
  {
    id: "m3",
    title: "NSP scholarship document reminder",
    message: "Upload income certificate to complete your application.",
    category: "scholarships",
    cta: "Continue",
    href: "/dashboard/student/wallet",
    isRead: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    location: "National · Online",
    thumb: "from-amber-400 to-orange-500",
  },
  {
    id: "m4",
    title: "Zoho SDE Intern shortlist",
    message: "Your profile matches 92% — apply before Friday.",
    category: "internships",
    cta: "Apply Now",
    href: "/dashboard/student/internships",
    isRead: false,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    location: "Chennai · Hybrid",
    thumb: "from-emerald-500 to-teal-600",
  },
  {
    id: "m5",
    title: "Infosys Springboard off-campus drive",
    message: "Hiring for 2026 batch — eligibility BE / B.Tech CSE & IT.",
    category: "jobs",
    cta: "Register",
    href: "/dashboard/student/jobs",
    isRead: false,
    createdAt: new Date(Date.now() - 10800000).toISOString(),
    location: "Bangalore / Remote",
    thumb: "from-[#0F3DDE] to-[#3B82F6]",
  },
  {
    id: "m6",
    title: "Sponsored: Manipal open house",
    message: "Virtual campus tour with counselor Q&A this weekend.",
    category: "sponsored",
    cta: "Know More",
    href: "/dashboard/student/colleges",
    isRead: true,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    location: "Manipal · Online",
    thumb: "from-rose-500 to-pink-600",
  },
];

const TODAY = [
  {
    title: "AI Interview Coach",
    body: "15-min warm-up",
    href: "/dashboard/student/ai-assistant",
    icon: Sparkles,
    tone: "bg-pink-50 text-pink-600",
  },
  {
    title: "Campus drive",
    body: "Accenture Associate",
    href: "/dashboard/student/jobs",
    icon: Briefcase,
    tone: "bg-blue-50 text-[#0F3DDE]",
  },
  {
    title: "Scholarship FAQ",
    body: "Live at 6 PM",
    href: "/dashboard/student/wallet",
    icon: Trophy,
    tone: "bg-amber-50 text-amber-600",
  },
  {
    title: "College fair",
    body: "South zone listing",
    href: "/dashboard/student/colleges",
    icon: GraduationCap,
    tone: "bg-emerald-50 text-emerald-600",
  },
];

const CAT_META: Record<
  Exclude<FeedCat, "all">,
  {
    label: string;
    chip: string;
    iconTone: string;
    icon: typeof Bell;
    bar: string;
    thumb: string;
  }
> = {
  exam: {
    label: "Exam",
    chip: "bg-violet-50 text-violet-700",
    iconTone: "bg-violet-50 text-violet-600",
    icon: CalendarDays,
    bar: "bg-violet-500",
    thumb: "from-violet-500 to-indigo-600",
  },
  admissions: {
    label: "Admissions",
    chip: "bg-sky-50 text-sky-700",
    iconTone: "bg-sky-50 text-sky-600",
    icon: GraduationCap,
    bar: "bg-sky-500",
    thumb: "from-sky-500 to-cyan-600",
  },
  scholarships: {
    label: "Scholarships",
    chip: "bg-amber-50 text-amber-700",
    iconTone: "bg-amber-50 text-amber-600",
    icon: Trophy,
    bar: "bg-amber-500",
    thumb: "from-amber-400 to-orange-500",
  },
  internships: {
    label: "Internships",
    chip: "bg-emerald-50 text-emerald-700",
    iconTone: "bg-emerald-50 text-emerald-600",
    icon: Briefcase,
    bar: "bg-emerald-500",
    thumb: "from-emerald-500 to-teal-600",
  },
  jobs: {
    label: "Jobs",
    chip: "bg-blue-50 text-[#0F3DDE]",
    iconTone: "bg-blue-50 text-[#0F3DDE]",
    icon: Newspaper,
    bar: "bg-[#0F3DDE]",
    thumb: "from-[#0F3DDE] to-[#3B82F6]",
  },
  sponsored: {
    label: "Sponsored",
    chip: "bg-rose-50 text-rose-700",
    iconTone: "bg-rose-50 text-rose-600",
    icon: Sparkles,
    bar: "bg-rose-500",
    thumb: "from-rose-500 to-pink-600",
  },
};

function mapApiType(type: string): Exclude<FeedCat, "all"> {
  const t = type.toUpperCase();
  if (t.includes("JOB") || t === "SUCCESS") return "jobs";
  if (t.includes("INTERN")) return "internships";
  if (t.includes("EXAM") || t === "WARNING") return "exam";
  if (t.includes("ADMISS")) return "admissions";
  if (t.includes("SCHOLAR")) return "scholarships";
  if (t === "SYSTEM" || t === "ALERT") return "sponsored";
  return "jobs";
}

function hrefFor(cat: Exclude<FeedCat, "all">): string {
  switch (cat) {
    case "exam":
      return "/dashboard/student/mock-tests";
    case "admissions":
      return "/dashboard/student/colleges";
    case "scholarships":
      return "/dashboard/student/wallet";
    case "internships":
      return "/dashboard/student/internships";
    case "jobs":
      return "/dashboard/student/jobs";
    default:
      return "/dashboard/student/colleges";
  }
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function StudentNotificationsPage() {
  return (
    <Suspense
      fallback={
        <StudentShell>
          <div className="flex items-center gap-2 p-6 text-sm text-slate-500">
            <Loader2 className="animate-spin" size={16} /> Loading notifications…
          </div>
        </StudentShell>
      }
    >
      <NotificationsInner />
    </Suspense>
  );
}

function NotificationsInner() {
  const { token } = useAuth();
  const [items, setItems] = useState<FeedItem[]>(MOCK_FEED);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FeedCat>("all");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await api<
        { id: string; title: string; message: string; type: string; isRead: boolean; createdAt: string }[]
      >("/notifications", { token });
      if (Array.isArray(data) && data.length) {
        const mapped: FeedItem[] = data.map((n) => {
          const category = mapApiType(n.type);
          return {
            id: n.id,
            title: n.title,
            message: n.message,
            category,
            cta: "Open",
            href: hrefFor(category),
            isRead: n.isRead,
            createdAt: n.createdAt,
            location: "Ellowring",
            thumb: CAT_META[category].thumb,
          };
        });
        setItems([...mapped, ...MOCK_FEED.filter((m) => !mapped.some((x) => x.title === m.title))]);
      }
    } catch {
      /* keep mock */
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  const counts = useMemo(() => {
    const base: Record<FeedCat, number> = {
      all: items.length,
      exam: 0,
      admissions: 0,
      scholarships: 0,
      internships: 0,
      jobs: 0,
      sponsored: 0,
    };
    for (const i of items) base[i.category] += 1;
    base.all = Math.max(base.all, 24);
    return base;
  }, [items]);

  const filtered = useMemo(
    () => (filter === "all" ? items : items.filter((i) => i.category === filter)),
    [items, filter],
  );

  const unread = items.filter((i) => !i.isRead).length;

  async function markAllRead() {
    setBusy(true);
    try {
      if (token) await api("/notifications/read-all", { method: "PATCH", token }).catch(() => null);
      setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } finally {
      setBusy(false);
    }
  }

  function markRead(id: string) {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    if (token && !id.startsWith("m")) {
      void api(`/notifications/${id}/read`, { method: "PATCH", token }).catch(() => null);
    }
  }

  const chips: { id: FeedCat; label: string; count: number; icon: typeof Bell; tone: string }[] = [
    { id: "all", label: "All", count: counts.all, icon: Bell, tone: "bg-slate-100 text-slate-600" },
    { id: "exam", label: "Exam", count: counts.exam, icon: CalendarDays, tone: CAT_META.exam.iconTone },
    {
      id: "admissions",
      label: "Admissions",
      count: counts.admissions,
      icon: GraduationCap,
      tone: CAT_META.admissions.iconTone,
    },
    {
      id: "scholarships",
      label: "Scholarships",
      count: counts.scholarships,
      icon: Trophy,
      tone: CAT_META.scholarships.iconTone,
    },
    {
      id: "internships",
      label: "Internships",
      count: counts.internships,
      icon: Briefcase,
      tone: CAT_META.internships.iconTone,
    },
    { id: "jobs", label: "Jobs", count: counts.jobs, icon: Newspaper, tone: CAT_META.jobs.iconTone },
    {
      id: "sponsored",
      label: "Sponsored",
      count: counts.sponsored,
      icon: Sparkles,
      tone: CAT_META.sponsored.iconTone,
    },
  ];

  return (
    <StudentShell>
      <CollagePage>
        <CollageTitle
          title="Notifications & Opportunity Feed"
          subtitle="Exams, admissions, scholarships, internships, and jobs in one stream."
          icon={Bell}
          action={
            <PillButton tone="outline" onClick={() => void markAllRead()} className="!py-2" disabled={busy}>
              <CheckCheck size={14} /> Mark all as read
              {unread > 0 ? ` (${unread})` : ""}
            </PillButton>
          }
        />

        <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {chips.map((chip) => {
            const Icon = chip.icon;
            const active = filter === chip.id;
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => setFilter(chip.id)}
                className={clsx(
                  "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-[12px] font-bold transition",
                  active
                    ? "bg-[#0F3DDE] text-white shadow-sm"
                    : "bg-white text-slate-600 ring-1 ring-slate-200",
                )}
              >
                <span
                  className={clsx(
                    "inline-flex h-6 w-6 items-center justify-center rounded-full",
                    active ? "bg-white/20 text-white" : chip.tone,
                  )}
                >
                  <Icon size={12} />
                </span>
                {chip.label}
                <span
                  className={clsx(
                    "rounded-full px-1.5 text-[10px]",
                    active ? "bg-white/20" : "bg-slate-100",
                  )}
                >
                  {chip.count}
                </span>
              </button>
            );
          })}
        </div>

        {loading ? (
          <p className="inline-flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="animate-spin" size={16} /> Syncing feed…
          </p>
        ) : null}

        <ul className="space-y-3">
          {filtered.map((n) => {
            const meta = CAT_META[n.category];
            const ThumbIcon = meta.icon;
            return (
              <li key={n.id}>
                <article
                  className={clsx(
                    "relative overflow-hidden rounded-[20px] bg-white shadow-[0_2px_14px_rgba(15,23,42,0.06)] ring-1 ring-slate-100",
                    !n.isRead && "bg-[#FAFBFF]",
                  )}
                >
                  <span className={clsx("absolute inset-y-0 left-0 w-1", meta.bar)} />
                  <div className="flex flex-wrap items-start gap-3 p-3.5 pl-4">
                    <div
                      className={clsx(
                        "relative h-[64px] w-[64px] shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br",
                        n.thumb || meta.thumb,
                      )}
                    >
                      <span className="absolute inset-0 flex items-center justify-center text-white/90">
                        <ThumbIcon size={22} />
                      </span>
                      <span
                        className={clsx(
                          "absolute bottom-1 left-1 rounded px-1 py-px text-[8px] font-extrabold text-white",
                          meta.bar,
                        )}
                      >
                        {meta.label}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={clsx("rounded-full px-2 py-0.5 text-[10px] font-bold", meta.chip)}>
                          {meta.label}
                        </span>
                        {!n.isRead ? (
                          <span className="rounded-full bg-[#0F3DDE] px-2 py-0.5 text-[9px] font-extrabold text-white">
                            New
                          </span>
                        ) : null}
                      </div>
                      <h3
                        className={clsx(
                          "mt-1 text-[14px] text-[#0B1F3A]",
                          !n.isRead ? "font-extrabold" : "font-bold",
                        )}
                      >
                        {n.title}
                      </h3>
                      <p className="mt-0.5 text-[13px] text-slate-500">{n.message}</p>
                      <p className="mt-1.5 inline-flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-slate-400">
                        <span>{relativeTime(n.createdAt)}</span>
                        {n.location ? (
                          <span className="inline-flex items-center gap-0.5">
                            <MapPin size={10} /> {n.location}
                          </span>
                        ) : null}
                      </p>
                      <PillButton
                        href={n.href}
                        className="mt-3 !py-2"
                        onClick={() => markRead(n.id)}
                      >
                        {n.cta}
                      </PillButton>
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
          {!loading && filtered.length === 0 ? (
            <li className="rounded-2xl bg-white py-12 text-center text-sm text-slate-500 ring-1 ring-slate-100">
              No items in this filter.
            </li>
          ) : null}
        </ul>

        <WhiteCard title="Today's Opportunities">
          <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
            {TODAY.map((t) => {
              const Icon = t.icon;
              return (
                <Link
                  key={t.title}
                  href={t.href}
                  className="rounded-[16px] bg-[#F8FAFC] p-3.5 ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <SoftIcon icon={Icon} className={t.tone} />
                  <p className="mt-2 text-[13px] font-extrabold text-[#0B1F3A]">{t.title}</p>
                  <p className="text-[11px] text-slate-500">{t.body}</p>
                </Link>
              );
            })}
          </div>
        </WhiteCard>

        <BlueHero>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                <BellRing size={22} />
              </span>
              <div>
                <h3 className="font-display text-lg font-extrabold">Enable Notifications</h3>
                <p className="mt-0.5 text-[13px] text-blue-100">
                  Get exam alerts, admission deadlines, and job matches instantly.
                </p>
              </div>
            </div>
            <PillButton
              tone="white"
              onClick={() => {
                if (typeof Notification !== "undefined" && Notification.permission !== "granted") {
                  void Notification.requestPermission();
                }
                window.alert("Notifications enabled for this browser (demo).");
              }}
            >
              Turn on alerts
            </PillButton>
          </div>
        </BlueHero>
      </CollagePage>
    </StudentShell>
  );
}
