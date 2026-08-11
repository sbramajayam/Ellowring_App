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
  { title: "Mentor reviews", body: "Weekly feedback from industry mentors.", tone: "bg-blue-50 text-[#0F3DDE]" },
  { title: "Verified stipend", body: "Transparent pay and offer letters.", tone: "bg-emerald-50 text-emerald-600" },
  { title: "Completion certificate", body: "Creds you can add to your wallet.", tone: "bg-amber-50 text-amber-600" },
  { title: "Job convert path", body: "Intern-to-hire with partner firms.", tone: "bg-violet-50 text-violet-600" },
];

const JOURNEY = [
  { step: "01", title: "Explore", body: "Browse roles matched to your skills", done: true },
  { step: "02", title: "Apply", body: "One-tap apply with your Ellowring resume", done: true },
  { step: "03", title: "Interview", body: "Practice with AI Interview Coach", done: false, active: true },
  { step: "04", title: "Offer", body: "Accept, track milestones, earn cert", done: false },
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

        <WhiteCard
          title="AI Insights"
          action={
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0F3DDE]">
              <Sparkles size={12} /> Live overview
            </span>
          }
        >
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {[
              { label: "Active", value: "1", tone: "bg-blue-50 text-[#0F3DDE]", hint: "In progress" },
              { label: "Applications", value: "12", tone: "bg-violet-50 text-violet-600", hint: "Submitted" },
              { label: "Interviews", value: "3", tone: "bg-amber-50 text-amber-600", hint: "Scheduled" },
              { label: "Completion", value: "40%", tone: "bg-emerald-50 text-emerald-600", hint: "Journey" },
            ].map((m) => (
              <div key={m.label} className="rounded-2xl bg-[#F8FAFC] p-3.5 ring-1 ring-slate-100">
                <span className={`inline-flex h-8 w-8 items-center justify-center rounded-xl text-[11px] font-extrabold ${m.tone}`}>
                  {m.label.slice(0, 1)}
                </span>
                <p className="mt-2 font-display text-2xl font-extrabold leading-none text-[#0B1F3A]">{m.value}</p>
                <p className="mt-1 text-[12px] font-extrabold text-[#0B1F3A]">{m.label}</p>
                <p className="text-[10px] text-slate-500">{m.hint}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-col items-center gap-3 rounded-2xl bg-gradient-to-br from-[#0B1F3A] via-[#0F3DDE] to-[#3B82F6] p-4 text-white sm:flex-row sm:justify-between">
            <div>
              <p className="text-[11px] font-bold text-blue-100">Internship completion score</p>
              <p className="mt-0.5 text-[13px] font-semibold text-white/90">
                Keep applying — Interview Coach boosts offer odds.
              </p>
            </div>
            <ScoreRing value={40} label="Completion" size={88} tone="mixed" onDark />
          </div>
        </WhiteCard>

        <WhiteCard title="Explore Categories">
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-8">
            {CATEGORIES.map((c) => {
              const Icon = c.icon;
              return (
                <button
                  key={c.label}
                  type="button"
                  className="flex flex-col items-center gap-2 rounded-[16px] bg-white p-3 text-center ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:shadow-md lg:p-3.5"
                >
                  <SoftIcon icon={Icon} className={c.tone} />
                  <span className="text-[11px] font-extrabold leading-tight text-[#0B1F3A] lg:text-[12px]">
                    {c.label}
                  </span>
                </button>
              );
            })}
          </div>
        </WhiteCard>

        <WhiteCard
          title="Featured Ellowring Internships"
          action={
            loading ? (
              <Loader2 className="animate-spin text-[#0F3DDE]" size={16} />
            ) : (
              <span className="text-[11px] font-bold text-slate-400">{featured.length} listed</span>
            )
          }
        >
          <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {featured.map((item) => {
              const company = labelOf(item.company, "Company");
              const stipend = item.stipend != null ? `₹${moneyOf(item.stipend)}/mo` : "Negotiable";
              const skillTags = String(item.skills || "")
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
                .slice(0, 3);
              return (
                <li
                  key={item.id}
                  className="flex flex-col rounded-2xl bg-[#F8FAFC] p-3.5 ring-1 ring-slate-100"
                >
                  <div className="flex items-start gap-3">
                    <BrandLogo name={company} className="h-11 w-11 shrink-0" rounded="xl" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-extrabold leading-snug text-[#0B1F3A]">{item.title}</p>
                      <p className="text-[12px] font-semibold text-[#0F3DDE]">{company}</p>
                      <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-slate-500">
                        <MapPin size={11} /> {labelOf(item.location, "Flexible")} ·{" "}
                        {labelOf(item.mode, "Remote")} · {stipend}
                      </p>
                    </div>
                  </div>
                  {skillTags.length ? (
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {skillTags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-600 ring-1 ring-slate-200"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  <PillButton onClick={() => void onApply(item.id, item.title)} className="mt-3 w-full !py-2">
                    {busyId === item.id ? "Applying…" : "Apply Now"}
                  </PillButton>
                </li>
              );
            })}
          </ul>
        </WhiteCard>

        <div className="grid gap-4 lg:grid-cols-2">
          <WhiteCard title="Why Intern with Ellowring">
            <div className="grid gap-3 sm:grid-cols-2">
              {BENEFITS.map((b) => (
                <div key={b.title} className="rounded-2xl bg-[#EFF6FF] p-3.5 ring-1 ring-[#DBEAFE]">
                  <SoftIcon icon={CheckCircle2} className={b.tone} />
                  <p className="mt-2 text-[13px] font-extrabold text-[#0B1F3A]">{b.title}</p>
                  <p className="mt-1 text-[12px] text-slate-600">{b.body}</p>
                </div>
              ))}
            </div>
          </WhiteCard>

          <WhiteCard title="My Internship Journey">
            <ol className="relative grid gap-0 sm:grid-cols-4 sm:gap-2">
              {JOURNEY.map((j, i) => (
                <li key={j.step} className="flex gap-3 pb-5 last:pb-0 sm:flex-col sm:items-center sm:pb-0 sm:text-center">
                  <div className="flex flex-col items-center sm:w-full sm:flex-row sm:justify-center">
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold ${
                        j.done
                          ? "bg-emerald-500 text-white"
                          : j.active
                            ? "bg-[#0F3DDE] text-white"
                            : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      {j.done ? <CheckCircle2 size={16} /> : j.step}
                    </span>
                    {i < JOURNEY.length - 1 ? (
                      <span className="mt-1 w-0.5 flex-1 bg-[#BFDBFE] sm:mt-0 sm:h-0.5 sm:w-full sm:flex-none sm:max-w-[40px]" />
                    ) : null}
                  </div>
                  <div className="pt-1 sm:pt-2">
                    <p className="text-[13px] font-extrabold text-[#0B1F3A]">{j.title}</p>
                    <p className="text-[11px] text-slate-500 sm:mt-0.5">{j.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </WhiteCard>
        </div>

        <BlueHero>
          <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex max-w-xl items-start gap-3">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20">
                <Bot size={28} />
              </span>
              <div>
                <p className="inline-flex items-center gap-1.5 text-[12px] font-bold text-blue-100">
                  <Rocket size={14} /> AI Internship Recommendation
                </p>
                <h3 className="mt-1 font-display text-xl font-extrabold lg:text-2xl">
                  Zoho SDE Intern looks like a 92% match
                </h3>
                <p className="mt-1 text-[13px] text-blue-100">
                  Based on your Resume Builder skills (React, TypeScript) and Interview Coach score 84.
                </p>
                <div className="mt-3 max-w-xs">
                  <div className="mb-1 flex justify-between text-[11px] font-semibold text-blue-100">
                    <span>Match confidence</span>
                    <span>92%</span>
                  </div>
                  <ProgressBar value={92} color="bg-emerald-400" />
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <PillButton tone="white" onClick={() => void onApply("mock-1", "Software Development Intern")}>
                Apply Now
              </PillButton>
              <PillButton tone="outline" href="/dashboard/student/resume" className="!bg-white/10 !text-white !ring-white/40">
                <Award size={14} /> Sync Resume
              </PillButton>
            </div>
          </div>
        </BlueHero>
      </CollagePage>
    </StudentShell>
  );
}
