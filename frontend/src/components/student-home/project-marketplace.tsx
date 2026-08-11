"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Award,
  BadgeCheck,
  Bot,
  Briefcase,
  CheckCircle2,
  Code2,
  Cpu,
  FlaskConical,
  FolderOpen,
  Layers,
  Loader2,
  MapPin,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import clsx from "clsx";
import { BrandLogo } from "@/components/student-home/brand-logo";
import {
  BlueHero,
  CollageTitle,
  PillButton,
  ProgressBar,
  ScoreRing,
  SoftIcon,
  WhiteCard,
} from "@/components/student-home/collage-ui";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { labelOf, moneyOf } from "@/lib/labels";

export type Project = {
  id: string;
  title: string;
  domain?: string | null;
  description?: string | null;
  duration?: string | null;
  stipend?: number | string | null;
  skills?: string | null;
  isActive?: boolean;
  technologies?: { technology?: string; name?: string }[];
  company?: { name?: string; industry?: string; city?: string; logoUrl?: string } | null;
};

const CATEGORIES = [
  { id: "Mini", label: "Mini", icon: Zap, tone: "bg-amber-50 text-amber-600" },
  { id: "Major", label: "Major", icon: Layers, tone: "bg-blue-50 text-[#0F3DDE]" },
  { id: "IEEE", label: "IEEE", icon: FlaskConical, tone: "bg-violet-50 text-violet-600" },
  { id: "Client", label: "Client", icon: Users, tone: "bg-emerald-50 text-emerald-600" },
  { id: "IoT", label: "IoT", icon: Cpu, tone: "bg-sky-50 text-sky-600" },
  { id: "AI/ML", label: "AI/ML", icon: Sparkles, tone: "bg-rose-50 text-rose-600" },
];

const FALLBACK: Project[] = [
  {
    id: "mock-p1",
    title: "E-Commerce Web Application",
    domain: "Full Stack · Mini",
    description: "Cart, payments & admin for retail SMEs.",
    duration: "4–6 weeks",
    stipend: 0,
    skills: "React, Node.js, MongoDB",
    company: { name: "Shopify", city: "Remote" },
  },
  {
    id: "mock-p2",
    title: "AI Chatbot for Student Support",
    domain: "AI/ML · Major",
    description: "NLP FAQ bot with ticket handoff.",
    duration: "6–8 weeks",
    stipend: 8000,
    skills: "Python, FastAPI, OpenAI",
    company: { name: "OpenAI", city: "Chennai" },
  },
  {
    id: "mock-p3",
    title: "IEEE Smart Campus IoT Board",
    domain: "Embedded · IEEE",
    description: "Sensor mesh + paper-ready evaluation kit.",
    duration: "8–10 weeks",
    stipend: 0,
    skills: "C++, Arduino, MQTT",
    company: { name: "Arduino", city: "Coimbatore" },
  },
  {
    id: "mock-p4",
    title: "Live Client HR Portal Sprint",
    domain: "Client · Web",
    description: "Employee onboarding flows for hiring teams.",
    duration: "3–5 weeks",
    stipend: 12000,
    skills: "Next.js, PostgreSQL",
    company: { name: "Zoho", city: "Chennai" },
  },
];

const MATCH_BARS = [
  { name: "Full Stack Web", value: 92 },
  { name: "AI / ML Applications", value: 78 },
  { name: "IoT Hardware-Software", value: 64 },
  { name: "IEEE Paper Projects", value: 55 },
];

const WHY_BUILD = [
  "Prove skills beyond marks & CGPA",
  "Build a job-ready GitHub portfolio",
  "Earn certificates & mentor letters",
  "Join live client teams before hire",
  "Improve AI placement match score",
];

const ACHIEVEMENTS = [
  { label: "Projects shipped", value: "2", icon: Code2 },
  { label: "Certificates", value: "1", icon: Award },
  { label: "GitHub stars", value: "18", icon: BadgeCheck },
];

function techTags(p: Project): string[] {
  if (p.technologies?.length) {
    return p.technologies.map((t) => labelOf(t.technology ?? t.name ?? t)).filter(Boolean);
  }
  if (p.skills) return p.skills.split(",").map((s) => s.trim()).filter(Boolean);
  return [];
}

function levelOf(p: Project, index: number): string {
  const d = `${p.domain || ""}`.toLowerCase();
  if (d.includes("ieee") || d.includes("major")) return "Advanced";
  if (d.includes("mini") || index % 3 === 0) return "Beginner";
  return "Intermediate";
}

function certBadges(p: Project): string[] {
  const badges = ["Certificate"];
  if (p.stipend != null && Number(p.stipend) > 0) badges.push("Stipend");
  if (`${p.domain || ""}`.toLowerCase().includes("ieee")) badges.push("Publication");
  else badges.push("Letter");
  return badges;
}

export function ProjectMarketplaceContent({
  showTitle = true,
  compact = false,
}: {
  showTitle?: boolean;
  compact?: boolean;
}) {
  const { token, user } = useAuth();
  const firstName =
    user?.name?.replace(/^Mr\.?\s+/i, "").trim().split(/\s+/)[0] || "Vignesh";
  const [items, setItems] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [cat, setCat] = useState("Mini");
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const list = await api<Project[]>("/projects", { token: token || undefined });
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
    const needle = cat === "AI/ML" ? "ai" : cat.toLowerCase();
    const matched = items.filter((p) =>
      `${p.domain || ""} ${p.title} ${p.skills || ""}`.toLowerCase().includes(needle),
    );
    return matched.length ? matched : items;
  }, [items, cat]);

  const recommended = filtered.slice(0, compact ? 3 : 4);
  const liveClients = items
    .filter((p) => {
      const d = `${p.domain || ""} ${p.company?.name || ""}`.toLowerCase();
      return d.includes("client") || Boolean(p.company?.name) || (p.stipend != null && Number(p.stipend) > 0);
    })
    .slice(0, 3);

  async function onEnroll(id: string, title: string) {
    if (!token) {
      window.alert("Please sign in to enroll in this project.");
      return;
    }
    if (id.startsWith("mock-")) {
      setMsg(`Enrolled in ${title} (demo listing).`);
      return;
    }
    setBusyId(id);
    setError("");
    try {
      await api(`/projects/${id}/enroll`, { method: "POST", token }).catch(async () => {
        await api("/applications", { method: "POST", token, body: JSON.stringify({ projectId: id }) });
      });
      setMsg(`Enrolled in ${title}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Enroll failed");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-5 lg:space-y-6">
      {showTitle ? (
        <CollageTitle
          title="Project Marketplace"
          subtitle={`Build real projects · Get certified · Boost placement for ${firstName}`}
          icon={FolderOpen}
        />
      ) : null}

      <BlueHero>
        <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-blue-100">
              Ellowring Projects
            </p>
            <h2 className="mt-1 font-display text-xl font-extrabold lg:text-2xl">Project Marketplace</h2>
            <div className="mb-3 mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold text-white ring-1 ring-white/25">
              <Sparkles size={12} /> AI Recommended for Full Stack
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                { label: "Available", value: "1248" },
                { label: "Live Client", value: "186" },
                { label: "Students", value: "12,540" },
                { label: "Placement", value: "420" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl bg-white/10 px-3 py-2.5 backdrop-blur-sm">
                  <p className="font-display text-xl font-extrabold tabular-nums lg:text-2xl">{s.value}</p>
                  <p className="mt-0.5 text-[10px] font-medium text-blue-100">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <PillButton
                tone="white"
                onClick={() => {
                  document.getElementById("recommended-projects")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Start a Project
              </PillButton>
              <PillButton
                href="/dashboard/student/ai-assistant"
                tone="outline"
                className="!bg-white/10 !text-white !ring-white/40"
              >
                <Bot size={14} /> Ask AI Match
              </PillButton>
            </div>
          </div>
          <div className="relative flex shrink-0 items-center justify-center self-center">
            <div className="relative flex h-[112px] w-[112px] items-center justify-center rounded-[28px] bg-white/15 ring-1 ring-white/25 backdrop-blur-sm">
              <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-400 text-[10px] font-extrabold text-[#0B1F3A] shadow-lg">
                AI
              </div>
              <Bot size={42} className="text-white" />
              <Sparkles size={16} className="absolute bottom-3 right-3 text-sky-200" />
            </div>
          </div>
        </div>
      </BlueHero>

      <WhiteCard title="Categories" className="!p-3 lg:!p-4">
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6 sm:gap-2">
          {CATEGORIES.map((c) => {
            const Icon = c.icon;
            const active = cat === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setCat(c.id)}
                className="flex flex-col items-center gap-1.5"
              >
                <span
                  className={clsx(
                    "inline-flex h-14 w-14 items-center justify-center rounded-full shadow-[0_4px_14px_rgba(15,23,42,0.08)] ring-2 transition",
                    active ? "bg-[#0F3DDE] text-white ring-[#93C5FD]" : `${c.tone} ring-white`,
                  )}
                >
                  <Icon size={22} />
                </span>
                <span
                  className={clsx(
                    "text-[11px] font-bold",
                    active ? "text-[#0F3DDE]" : "text-slate-600",
                  )}
                >
                  {c.label}
                </span>
              </button>
            );
          })}
        </div>
      </WhiteCard>

      {loading ? (
        <p className="inline-flex items-center gap-2 text-sm text-slate-500">
          <Loader2 className="animate-spin" size={16} /> Loading projects…
        </p>
      ) : null}
      {error ? (
        <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-100">{error}</p>
      ) : null}
      {msg ? (
        <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 ring-1 ring-emerald-100">{msg}</p>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-4">
          <WhiteCard
            title="Recommended Projects"
            action={<span className="text-[11px] font-bold text-slate-400">For {firstName}</span>}
          >
            <div id="recommended-projects" className="space-y-3">
              {recommended.map((p, i) => {
                const tags = techTags(p);
                const brand = p.company?.name || "Ellowring";
                return (
                  <article
                    key={p.id}
                    className="rounded-2xl bg-slate-50 p-3.5 ring-1 ring-slate-100"
                  >
                    <div className="flex gap-3">
                      <BrandLogo name={brand} className="h-12 w-12 shrink-0" rounded="xl" />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="rounded-full bg-[#EFF6FF] px-2 py-0.5 text-[10px] font-bold text-[#0F3DDE]">
                            {labelOf(p.domain, cat)}
                          </span>
                          <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-600 ring-1 ring-slate-200">
                            {levelOf(p, i)}
                          </span>
                        </div>
                        <h3 className="mt-1.5 text-[14px] font-extrabold leading-snug text-[#0B1F3A]">
                          {p.title}
                        </h3>
                        <p className="mt-0.5 text-[11px] text-slate-500">
                          {p.duration || "4–6 weeks"}
                          {p.company?.city ? (
                            <>
                              {" · "}
                              <MapPin size={10} className="inline" /> {p.company.city}
                            </>
                          ) : null}
                          {p.stipend != null && Number(p.stipend) > 0
                            ? ` · ₹${moneyOf(p.stipend)}/mo`
                            : null}
                        </p>
                      </div>
                    </div>
                    {tags.length > 0 ? (
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {tags.slice(0, 4).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-600 ring-1 ring-slate-200"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : null}
                    <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                      {certBadges(p).map((b) => (
                        <span
                          key={b}
                          className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700"
                        >
                          <BadgeCheck size={10} /> {b}
                        </span>
                      ))}
                    </div>
                    <PillButton
                      className="mt-3 w-full"
                      disabled={busyId === p.id}
                      onClick={() => void onEnroll(p.id, p.title)}
                    >
                      {busyId === p.id ? "Enrolling…" : "Enroll Now"}
                    </PillButton>
                  </article>
                );
              })}
              {!loading && recommended.length === 0 ? (
                <p className="py-6 text-center text-sm text-slate-500">No projects in this category yet.</p>
              ) : null}
            </div>
          </WhiteCard>

          <WhiteCard title="Progress Tracker">
            <div className="mb-2 flex items-center justify-between text-[12px]">
              <span className="font-bold text-[#0B1F3A]">Overall completion</span>
              <span className="font-extrabold text-[#0F3DDE]">68%</span>
            </div>
            <ProgressBar value={68} color="bg-gradient-to-r from-[#0F3DDE] to-[#38BDF8]" />
            <ul className="mt-3.5 space-y-2">
              {[
                { label: "Proposal approved", done: true },
                { label: "Sprint 1 deliverable", done: true },
                { label: "Mentor mid-review", done: false },
                { label: "Final demo + certificate", done: false },
              ].map((step) => (
                <li key={step.label} className="flex items-center gap-2.5 text-[12px]">
                  <CheckCircle2
                    size={16}
                    className={step.done ? "text-emerald-500" : "text-slate-300"}
                  />
                  <span className={step.done ? "font-bold text-[#0B1F3A]" : "font-medium text-slate-500"}>
                    {step.label}
                  </span>
                </li>
              ))}
            </ul>
          </WhiteCard>
        </div>

        <div className="space-y-4">
          <WhiteCard title="AI Project Match Score">
            <div className="space-y-3.5">
              {MATCH_BARS.map((m) => (
                <div key={m.name}>
                  <div className="mb-1 flex items-center justify-between text-[12px]">
                    <span className="font-bold text-[#0B1F3A]">{m.name}</span>
                    <span className="font-semibold text-slate-500">{m.value}%</span>
                  </div>
                  <ProgressBar
                    value={m.value}
                    color={m.value >= 85 ? "bg-emerald-500" : "bg-[#0F3DDE]"}
                  />
                </div>
              ))}
            </div>
          </WhiteCard>

          <WhiteCard className="flex flex-col items-center text-center text-[#0B1F3A]">
            <p className="mb-2 font-display text-[15px] font-extrabold">AI Recommendation Score</p>
            <ScoreRing value={94} max={100} label="Fit" size={118} tone="blue" percent />
            <p className="mt-2 max-w-[220px] text-[12px] text-slate-500">
              Strong match for Full Stack + AI/ML client sprints this placement window.
            </p>
          </WhiteCard>

          <WhiteCard
            title="Live Client Projects"
            action={<span className="text-[11px] font-bold text-emerald-600">● Live</span>}
          >
            <ul className="space-y-2.5">
              {(liveClients.length ? liveClients : recommended.slice(0, 3)).map((c) => (
                <li
                  key={c.id}
                  className="flex flex-wrap items-center gap-2.5 rounded-xl bg-slate-50 px-3 py-2.5 ring-1 ring-slate-100"
                >
                  <BrandLogo name={c.company?.name || "Client"} className="h-9 w-9" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] font-extrabold text-[#0B1F3A]">{c.title}</p>
                    <p className="text-[10px] text-slate-500">
                      {labelOf(c.company?.name, "Client")}
                      {c.company?.city ? ` · ${c.company.city}` : ""}
                    </p>
                  </div>
                  <PillButton
                    className="!px-3 !py-1.5 !text-[11px]"
                    disabled={busyId === c.id}
                    onClick={() => void onEnroll(c.id, c.title)}
                  >
                    {busyId === c.id ? "…" : "Join Team"}
                  </PillButton>
                </li>
              ))}
            </ul>
          </WhiteCard>

          <section className="overflow-hidden rounded-[20px] bg-gradient-to-br from-[#0B1F3A] via-[#0F3DDE] to-[#2563EB] p-4 text-white shadow-[0_16px_36px_rgba(15,61,222,0.28)] lg:rounded-[22px] lg:p-5">
            <div className="mb-2 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-blue-100">
              <Bot size={14} /> Ask AI Mentor
            </div>
            <h3 className="font-display text-lg font-extrabold">Stuck on scope or stack?</h3>
            <p className="mt-1 text-[12px] text-blue-100">
              Get a 2-week sprint plan, IEEE outline, or tech pick in seconds.
            </p>
            <PillButton href="/dashboard/student/ai-assistant" tone="white" className="mt-4">
              Ask AI Mentor
            </PillButton>
          </section>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <WhiteCard title="Achievement & Portfolio">
          <div className="grid grid-cols-3 gap-2">
            {ACHIEVEMENTS.map((a) => (
              <div
                key={a.label}
                className="rounded-2xl bg-[#F8FAFC] p-3 text-center ring-1 ring-slate-100"
              >
                <SoftIcon icon={a.icon} className="mx-auto h-9 w-9 bg-[#EFF6FF] text-[#0F3DDE]" />
                <p className="mt-1.5 font-display text-lg font-extrabold text-[#0B1F3A]">{a.value}</p>
                <p className="text-[10px] font-semibold text-slate-500">{a.label}</p>
              </div>
            ))}
          </div>
          <PillButton href="/dashboard/student/resume" tone="outline" className="mt-3 w-full">
            View portfolio on Resume
          </PillButton>
        </WhiteCard>

        <WhiteCard title="Why Build Projects">
          <ul className="space-y-2">
            {WHY_BUILD.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-[12px]">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#0F3DDE]" />
                <span className="font-semibold text-[#0B1F3A]">{item}</span>
              </li>
            ))}
          </ul>
          <Link
            href="/dashboard/student/career"
            className="mt-3 inline-flex items-center gap-1 text-[12px] font-bold text-[#0F3DDE]"
          >
            <Briefcase size={13} /> See career impact
          </Link>
        </WhiteCard>
      </div>
    </div>
  );
}
