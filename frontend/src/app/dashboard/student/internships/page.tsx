"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Award,
  Bot,
  Briefcase,
  Building2,
  CheckCircle2,
  Code2,
  FlaskConical,
  Laptop,
  Loader2,
  MapPin,
  Megaphone,
  Palette,
  Rocket,
  Sparkles,
  Users,
} from "lucide-react";
import { StudentShell } from "@/components/student-shell";
import { BrandLogo } from "@/components/student-home/brand-logo";
import {
  AiAssistantChip,
  BlueHero,
  CollagePage,
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

type Internship = {
  id: string;
  title: string;
  location?: string | null;
  mode?: string | null;
  stipend?: number | string | null;
  duration?: string | null;
  skills?: string | null;
  description?: string | null;
  isActive?: boolean;
  company?: { name?: string; city?: string; industry?: string; logoUrl?: string } | null;
};

const CATEGORIES = [
  { label: "Software Dev", icon: Code2, tone: "bg-blue-50 text-[#0F3DDE]" },
  { label: "Product / UI", icon: Laptop, tone: "bg-violet-50 text-violet-600" },
  { label: "Data & AI", icon: Sparkles, tone: "bg-emerald-50 text-emerald-600" },
  { label: "Marketing", icon: Megaphone, tone: "bg-amber-50 text-amber-600" },
  { label: "HR / Ops", icon: Users, tone: "bg-sky-50 text-sky-600" },
  { label: "Campus Drive", icon: Building2, tone: "bg-rose-50 text-rose-600" },
  { label: "Design", icon: Palette, tone: "bg-pink-50 text-pink-600" },
  { label: "Research", icon: FlaskConical, tone: "bg-indigo-50 text-indigo-600" },
];

const BENEFITS = [
  { title: "Mentor reviews", body: "Weekly feedback from industry mentors." },
  { title: "Verified stipend", body: "Transparent pay and offer letters." },
  { title: "Completion certificate", body: "Creds you can add to your wallet." },
  { title: "Job convert path", body: "Intern-to-hire with partner firms." },
];

const JOURNEY = [
  { step: "01", title: "Explore", body: "Browse roles matched to your skills" },
  { step: "02", title: "Apply", body: "One-tap apply with your Ellowring resume" },
  { step: "03", title: "Interview", body: "Practice with AI Interview Coach" },
  { step: "04", title: "Offer", body: "Accept, track milestones, earn cert" },
];

const FALLBACK: Internship[] = [
  {
    id: "mock-1",
    title: "Software Development Intern",
    location: "Chennai",
    mode: "HYBRID",
    stipend: 15000,
    duration: "3 months",
    skills: "React, TypeScript",
    company: { name: "Zoho" },
  },
  {
    id: "mock-2",
    title: "Business Analyst Intern",
    location: "Bengaluru",
    mode: "ONSITE",
    stipend: 12000,
    duration: "6 months",
    skills: "Excel, SQL",
    company: { name: "TCS" },
  },
  {
    id: "mock-3",
    title: "UI/UX Design Intern",
    location: "Remote",
    mode: "REMOTE",
    stipend: 10000,
    duration: "3 months",
    skills: "Figma, Research",
    company: { name: "Wipro" },
  },
  {
    id: "mock-4",
    title: "Full Stack Intern",
    location: "Bangalore",
    mode: "HYBRID",
    stipend: 20000,
    duration: "4 months",
    skills: "Node, React",
    company: { name: "Freshworks" },
  },
];

export default function InternshipsPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const list = await api<Internship[]>("/internships", { token: token || undefined });
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

  const featured = useMemo(() => items.slice(0, 6), [items]);

  async function onApply(id: string, title: string) {
    if (!token) {
      window.alert("Please sign in to apply for this internship.");
      return;
    }
    if (id.startsWith("mock-")) {
      setMsg(`Applied to ${title} (demo listing).`);
      return;
    }
    setBusyId(id);
    setError("");
    try {
      await api(`/internships/${id}/enroll`, { method: "POST", token }).catch(async () => {
        await api("/applications", { method: "POST", token, body: JSON.stringify({ internshipId: id }) });
      });
      setMsg(`Applied to ${title}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Apply failed");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <StudentShell>
      <CollagePage>
        <CollageTitle
          title="Ellowring Internship Hub"
          subtitle="Discover, apply, and track internships with AI-matched recommendations."
          icon={Briefcase}
          action={<AiAssistantChip />}
        />

        {error ? (
          <p className="rounded-xl bg-rose-50 px-4 py-2.5 text-[13px] text-rose-700 ring-1 ring-rose-100">{error}</p>
        ) : null}
        {msg ? (
          <p className="rounded-xl bg-emerald-50 px-4 py-2.5 text-[13px] text-emerald-700 ring-1 ring-emerald-100">{msg}</p>
        ) : null}

        <BlueHero>
          <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="grid flex-1 grid-cols-3 gap-3">
              {[
                { label: "Active", value: "1" },
                { label: "Applications", value: "12" },
                { label: "Interview", value: "3" },
              ].map((m) => (
                <div key={m.label} className="rounded-2xl bg-white/10 px-3 py-3 text-center ring-1 ring-white/15">
                  <p className="text-[10px] font-semibold text-blue-100">{m.label}</p>
                  <p className="mt-1 font-display text-2xl font-extrabold">{m.value}</p>
                </div>
              ))}
            </div>
            <div className="flex shrink-0 flex-col items-center self-center rounded-2xl bg-white/10 px-4 py-3">
              <ScoreRing value={40} label="Completion" size={96} tone="mixed" onDark />
            </div>
          </div>
        </BlueHero>

        <WhiteCard title="Explore Categories">
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {CATEGORIES.map((c) => {
              const Icon = c.icon;
              return (
                <button
                  key={c.label}
                  type="button"
                  className="flex flex-col items-start gap-2 rounded-[16px] bg-white p-3 ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <SoftIcon icon={Icon} className={c.tone} />
                  <span className="text-[12px] font-extrabold text-[#0B1F3A]">{c.label}</span>
                </button>
              );
            })}
          </div>
        </WhiteCard>

        <WhiteCard
          title="Featured Internships"
          action={
            loading ? (
              <Loader2 className="animate-spin text-[#0F3DDE]" size={16} />
            ) : (
              <span className="text-[11px] font-bold text-slate-400">{featured.length} listed</span>
            )
          }
        >
          <ul className="space-y-3">
            {featured.map((item) => {
              const company = labelOf(item.company, "Company");
              const stipend = item.stipend != null ? `₹${moneyOf(item.stipend)}/mo` : "Negotiable";
              return (
                <li
                  key={item.id}
                  className="flex flex-wrap items-center gap-3 rounded-2xl bg-[#F8FAFC] p-3.5 ring-1 ring-slate-100"
                >
                  <BrandLogo name={company} className="h-11 w-11" rounded="xl" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-extrabold text-[#0B1F3A]">{item.title}</p>
                    <p className="text-[12px] font-semibold text-[#0F3DDE]">{company}</p>
                    <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-slate-500">
                      <MapPin size={11} /> {labelOf(item.location, "Flexible")} · {labelOf(item.mode, "Remote")} ·{" "}
                      {stipend}
                    </p>
                  </div>
                  <PillButton onClick={() => void onApply(item.id, item.title)} className="!py-2">
                    {busyId === item.id ? "Applying…" : "Apply Now"}
                  </PillButton>
                </li>
              );
            })}
          </ul>
        </WhiteCard>

        <WhiteCard title="Why Intern with Ellowring">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map((b) => (
              <div key={b.title} className="rounded-2xl bg-[#EFF6FF] p-4">
                <CheckCircle2 size={18} className="text-[#0F3DDE]" />
                <p className="mt-2 text-[13px] font-extrabold text-[#0B1F3A]">{b.title}</p>
                <p className="mt-1 text-[12px] text-slate-600">{b.body}</p>
              </div>
            ))}
          </div>
        </WhiteCard>

        <WhiteCard title="Your Internship Journey">
          <ol className="relative space-y-0">
            {JOURNEY.map((j, i) => (
              <li key={j.step} className="flex gap-3 pb-5 last:pb-0">
                <div className="flex flex-col items-center">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0F3DDE] text-[11px] font-extrabold text-white">
                    {j.step}
                  </span>
                  {i < JOURNEY.length - 1 ? <span className="mt-1 w-0.5 flex-1 bg-[#BFDBFE]" /> : null}
                </div>
                <div className="pt-1">
                  <p className="text-[14px] font-extrabold text-[#0B1F3A]">{j.title}</p>
                  <p className="text-[12px] text-slate-500">{j.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </WhiteCard>

        <BlueHero>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex max-w-lg items-start gap-3">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20">
                <Bot size={28} />
              </span>
              <div>
                <p className="inline-flex items-center gap-1.5 text-[12px] font-bold text-blue-100">
                  <Sparkles size={14} /> AI recommendation
                </p>
                <h3 className="mt-1 font-display text-xl font-extrabold">
                  Zoho SDE Intern looks like a 92% match
                </h3>
                <p className="mt-1 text-[13px] text-blue-100">
                  Based on your Resume Builder skills (React, TypeScript) and Interview Coach score 84.
                </p>
                <div className="mt-3 max-w-xs">
                  <ProgressBar value={92} color="bg-emerald-400" />
                </div>
              </div>
            </div>
            <PillButton tone="white" href="/dashboard/student/resume">
              <Award size={14} /> Sync Resume
            </PillButton>
          </div>
        </BlueHero>
      </CollagePage>
    </StudentShell>
  );
}
