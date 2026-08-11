"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Award,
  BadgeCheck,
  Download,
  FolderOpen,
  Lightbulb,
  Link2,
  Loader2,
  Plus,
  QrCode,
  ScanLine,
  Share2,
  Shield,
  Sparkles,
  Upload,
} from "lucide-react";
import { StudentShell } from "@/components/student-shell";
import {
  AiAssistantChip,
  BlueHero,
  CollagePage,
  CollageTitle,
  PillButton,
  ProgressBar,
  SoftIcon,
  WhiteCard,
} from "@/components/student-home/collage-ui";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { labelOf } from "@/lib/labels";

type Cert = {
  id: string;
  title?: string;
  issuer?: string;
  credentialId?: string;
  issuedAt?: string;
  verified?: boolean;
  skills?: string[];
};

const FALLBACK: Cert[] = [
  {
    id: "c1",
    title: "Full Stack Development",
    issuer: "Ellowring Academy",
    credentialId: "ELW-FS-2025-0142",
    issuedAt: "2025-11-12",
    verified: true,
    skills: ["React", "Node.js"],
  },
  {
    id: "c2",
    title: "AWS Cloud Practitioner",
    issuer: "Amazon Web Services",
    credentialId: "AWS-CP-8821",
    issuedAt: "2025-08-03",
    verified: true,
    skills: ["Cloud"],
  },
  {
    id: "c3",
    title: "UI/UX Fundamentals",
    issuer: "Google",
    credentialId: "GUX-4410",
    issuedAt: "2025-06-20",
    verified: true,
    skills: ["Design"],
  },
  {
    id: "c4",
    title: "SQL for Data Analysis",
    issuer: "Coursera",
    credentialId: "SQL-2291",
    issuedAt: "2025-04-18",
    verified: false,
    skills: ["SQL"],
  },
];

const BADGES = [
  { label: "Top Learner", tone: "bg-amber-50 text-amber-700" },
  { label: "Verified Pro", tone: "bg-emerald-50 text-emerald-700" },
  { label: "Skill Streak", tone: "bg-blue-50 text-[#0F3DDE]" },
  { label: "Mentor Pick", tone: "bg-violet-50 text-violet-700" },
  { label: "Campus Star", tone: "bg-sky-50 text-sky-700" },
  { label: "Early Bird", tone: "bg-rose-50 text-rose-700" },
  { label: "Cloud Ready", tone: "bg-indigo-50 text-indigo-700" },
  { label: "Design Eye", tone: "bg-pink-50 text-pink-700" },
];

const CATEGORY_BARS = [
  { label: "Technical", value: 72 },
  { label: "Cloud", value: 48 },
  { label: "Design", value: 35 },
  { label: "Soft Skills", value: 58 },
  { label: "Domain", value: 41 },
];

const ANALYTICS_SLICES = [
  { label: "Verified", value: 16, color: "#0F3DDE" },
  { label: "Pending", value: 2, color: "#F59E0B" },
];

const QUICK_ACTIONS = [
  { label: "Scan Verify", icon: ScanLine },
  { label: "Share Wallet", icon: Share2 },
  { label: "Download All", icon: Download },
  { label: "Add Manually", icon: Plus },
  { label: "QR Code", icon: QrCode },
  { label: "Folders", icon: FolderOpen },
];

export default function CertificatesPage() {
  const { token } = useAuth();
  const [certs, setCerts] = useState<Cert[]>(FALLBACK);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api<Cert[]>("/students/me/certificates", { token: token || undefined });
      if (Array.isArray(data) && data.length) {
        setCerts(
          data.map((c, i) => ({
            ...c,
            id: String(c.id || `api-${i}`),
            verified: c.verified !== false,
          })),
        );
      }
    } catch {
      /* keep fallback */
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  const total = 18;
  const verified = 16;
  const skills = 12;
  const badges = 8;
  const verifiedPct = Math.round((verified / total) * 100);

  return (
    <StudentShell>
      <CollagePage>
        <CollageTitle
          title="Digital Certificate Wallet"
          subtitle="Store, verify, and share credentials with blockchain-backed security."
          icon={Award}
          action={<AiAssistantChip />}
        />

        <BlueHero>
          <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-semibold text-blue-100">Your wallet</p>
              <h2 className="mt-1 font-display text-2xl font-extrabold">Credentials at a glance</h2>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:max-w-2xl">
                {[
                  { label: "Total", value: String(total) },
                  { label: "Verified", value: String(verified) },
                  { label: "Skills", value: String(skills) },
                  { label: "Badges", value: String(badges) },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-2xl bg-white/10 px-3 py-2.5 text-center ring-1 ring-white/15"
                  >
                    <p className="text-[10px] font-semibold text-blue-100">{s.label}</p>
                    <p className="mt-0.5 font-display text-xl font-extrabold lg:text-2xl">{s.value}</p>
                  </div>
                ))}
              </div>
            </div>
            <PillButton tone="white" onClick={() => window.alert("Upload certificate (demo).")}>
              <Upload size={14} /> Upload Certificate
            </PillButton>
          </div>
        </BlueHero>

        <WhiteCard title="Quick Actions">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {QUICK_ACTIONS.map((a) => {
              const Icon = a.icon;
              return (
                <button
                  key={a.label}
                  type="button"
                  onClick={() => window.alert(`${a.label} (demo).`)}
                  className="flex flex-col items-start gap-2 rounded-[16px] bg-[#F8FAFC] p-3 text-left ring-1 ring-slate-100 transition hover:-translate-y-0.5"
                >
                  <SoftIcon icon={Icon} />
                  <span className="text-[12px] font-extrabold text-[#0B1F3A]">{a.label}</span>
                </button>
              );
            })}
          </div>
        </WhiteCard>

        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <WhiteCard
            title="My Certificates"
            action={loading ? <Loader2 className="animate-spin text-[#0F3DDE]" size={16} /> : (
              <span className="text-[11px] font-bold text-slate-400">{certs.length} shown</span>
            )}
          >
            <ul className="space-y-3">
              {certs.map((c) => (
                <li
                  key={c.id}
                  className="flex flex-wrap items-center gap-3 rounded-2xl bg-[#F8FAFC] p-3.5 ring-1 ring-slate-100"
                >
                  <SoftIcon icon={Award} className="bg-[#EFF6FF] text-[#0F3DDE]" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-[14px] font-extrabold text-[#0B1F3A]">
                        {labelOf(c.title, "Certificate")}
                      </p>
                      {c.verified !== false ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                          <BadgeCheck size={12} /> Verified
                        </span>
                      ) : (
                        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                          Pending
                        </span>
                      )}
                    </div>
                    <p className="text-[12px] text-slate-500">
                      {labelOf(c.issuer, "Issuer")}
                      {c.credentialId ? ` · ${c.credentialId}` : ""}
                      {c.issuedAt
                        ? ` · ${new Date(c.issuedAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}`
                        : ""}
                    </p>
                    {c.skills?.length ? (
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {c.skills.map((sk) => (
                          <span
                            key={sk}
                            className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-600 ring-1 ring-slate-200"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                  <PillButton
                    tone="outline"
                    className="!py-1.5"
                    onClick={() => window.alert("Share certificate link copied.")}
                  >
                    <Link2 size={14} /> Share
                  </PillButton>
                </li>
              ))}
            </ul>
          </WhiteCard>

          <div className="space-y-4">
            <WhiteCard title="Certificates by Category">
              <div className="space-y-3">
                {CATEGORY_BARS.map((bar) => (
                  <div key={bar.label}>
                    <div className="mb-1 flex justify-between text-[11px]">
                      <span className="font-bold text-[#0B1F3A]">{bar.label}</span>
                      <span className="font-semibold text-slate-500">{bar.value}%</span>
                    </div>
                    <ProgressBar
                      value={bar.value}
                      color={bar.value >= 60 ? "bg-[#0F3DDE]" : "bg-sky-400"}
                    />
                  </div>
                ))}
              </div>
            </WhiteCard>

            <WhiteCard title="Analytics">
              <div className="flex flex-col items-center gap-4 sm:flex-row">
                <div
                  className="relative h-[120px] w-[120px] shrink-0 rounded-full"
                  style={{
                    background: `conic-gradient(#0F3DDE ${(verified / total) * 360}deg, #F59E0B 0)`,
                  }}
                >
                  <div className="absolute inset-3 flex flex-col items-center justify-center rounded-full bg-white">
                    <span className="font-display text-lg font-extrabold text-[#0B1F3A]">
                      {verifiedPct}%
                    </span>
                    <span className="text-[9px] font-semibold text-slate-400">Verified</span>
                  </div>
                </div>
                <ul className="w-full space-y-2">
                  {ANALYTICS_SLICES.map((s) => (
                    <li key={s.label} className="flex items-center justify-between text-[12px]">
                      <span className="inline-flex items-center gap-2 font-bold text-[#0B1F3A]">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
                        {s.label}
                      </span>
                      <span className="font-semibold text-slate-500">{s.value}</span>
                    </li>
                  ))}
                  <li className="rounded-xl bg-[#EFF6FF] px-3 py-2 text-[11px] font-semibold text-[#0F3DDE]">
                    {verified} of {total} credentials blockchain-ready
                  </li>
                </ul>
              </div>
            </WhiteCard>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <WhiteCard title="AI Insight">
            <div className="flex gap-3">
              <SoftIcon icon={Lightbulb} className="bg-[#EFF6FF] text-[#0F3DDE]" />
              <div>
                <p className="text-[13px] font-extrabold text-[#0B1F3A]">Boost placement match</p>
                <p className="mt-1 text-[12px] leading-relaxed text-slate-600">
                  Add 1 cloud + 1 domain certificate this month to lift your AI job match from 91% to
                  96% for Full Stack roles.
                </p>
              </div>
            </div>
            <PillButton href="/dashboard/student/courses" tone="outline" className="mt-3 w-full !py-2">
              Explore cert tracks
            </PillButton>
          </WhiteCard>

          <WhiteCard title="Achievement Badges">
            <div className="flex flex-wrap gap-2">
              {BADGES.map((b) => (
                <span
                  key={b.label}
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-bold ${b.tone}`}
                >
                  <Sparkles size={12} /> {b.label}
                </span>
              ))}
            </div>
          </WhiteCard>

          <WhiteCard title="Share Achievement">
            <p className="text-[12px] text-slate-600">
              Post your Verified Pro wallet summary to LinkedIn or send a proof link to recruiters.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <PillButton
                tone="outline"
                className="!py-1.5"
                onClick={() => window.alert("Shared wallet summary.")}
              >
                <Share2 size={13} /> Share
              </PillButton>
              <PillButton className="!py-1.5" onClick={() => window.alert("Downloading pack…")}>
                <Download size={13} /> Export
              </PillButton>
            </div>
          </WhiteCard>
        </div>

        <section className="flex flex-col gap-4 rounded-[22px] bg-gradient-to-r from-[#0B1F3A] to-[#122F6B] p-5 text-white shadow-lg sm:flex-row sm:items-center">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
            <Shield size={22} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-display text-[16px] font-extrabold">Blockchain Verify</p>
            <p className="mt-0.5 text-[12px] text-blue-100">
              Verified Ellowring certificates are hashed and timestamped for tamper-proof proof of
              achievement.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/20 px-3 py-1.5 text-[11px] font-bold text-emerald-300">
              <Sparkles size={12} /> Secured
            </span>
            <PillButton
              tone="white"
              className="!py-2"
              onClick={() => window.alert("Opening blockchain verifier (demo).")}
            >
              <ScanLine size={14} /> Verify
            </PillButton>
          </div>
        </section>
      </CollagePage>
    </StudentShell>
  );
}
