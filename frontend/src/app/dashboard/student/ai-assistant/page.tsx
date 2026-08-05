"use client";

import Link from "next/link";
import {
  Bot,
  Send,
  Sparkles,
  Compass,
  BookOpen,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import { useState } from "react";
import { StudentShell } from "@/components/student-shell";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

const chips = [
  "What are the best career options for me?",
  "Suggest courses for CSE",
  "NEET vs JEE — which should I choose?",
  "How do I prepare for internships?",
];

const quickLinks = [
  { href: "/dashboard/student/career", label: "Career Guidance", icon: Compass },
  { href: "/dashboard/student/courses", label: "Browse Courses", icon: BookOpen },
  { href: "/dashboard/student/jobs", label: "Explore Jobs", icon: Briefcase },
  { href: "/dashboard/student/coaching", label: "Coaching", icon: GraduationCap },
];

type Msg = { role: "user" | "assistant"; text: string };

export default function AiCareerAssistantPage() {
  const { token } = useAuth();
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      text: "Hi! I'm your Ellowring AI Career Assistant. Ask about streams, exams, colleges, courses, or career paths — I'll guide you from Class 11 to first job.",
    },
  ]);

  async function send(text: string) {
    const q = text.trim();
    if (!q || busy) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text: q }]);
    setBusy(true);
    try {
      const res = await api<{
        recommendations?: string[];
        message?: string;
      }>(`/career/assistant/suggest?interest=${encodeURIComponent(q)}`, {
        token: token || undefined,
      }).catch(() => null);
      const recs = res?.recommendations?.length
        ? `\n\nSuggested paths: ${res.recommendations.join(", ")}.`
        : "";
      const reply =
        (res?.message ||
          `Based on your question (“${q}”), map your interests to a stream, shortlist coaching/courses on Ellowring, then build projects and apply for internships.`) +
        recs;
      setMessages((m) => [...m, { role: "assistant", text: reply }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <StudentShell>
      <div className="mx-auto max-w-5xl space-y-5 p-4 lg:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2563EB]">
              <Sparkles size={12} /> AI Career Assistant
            </p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">Personalized guidance</h1>
            <p className="mt-1 text-sm text-slate-500">
              Course recommendations and career roadmap based on your interests and skills.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {quickLinks.map((l) => {
              const Icon = l.icon;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-blue-200 hover:text-[#2563EB]"
                >
                  <Icon size={12} /> {l.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
          <div className="flex items-center gap-3 border-b border-slate-100 bg-gradient-to-r from-[#EFF6FF] to-[#DBEAFE] px-4 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
              <Bot className="h-5 w-5 text-[#2563EB]" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">Ellowring AI</p>
              <p className="text-[11px] text-slate-500">Online · Education & career specialist</p>
            </div>
          </div>

          <div className="flex max-h-[420px] min-h-[320px] flex-col gap-3 overflow-y-auto bg-[#F8FAFC] p-4">
            {messages.map((msg, i) => (
              <div
                key={`${msg.role}-${i}`}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "rounded-br-md bg-[#2563EB] text-white"
                      : "rounded-bl-md bg-white text-slate-700 shadow-sm ring-1 ring-slate-100"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {busy && (
              <p className="text-xs font-medium text-slate-400">AI is thinking…</p>
            )}
          </div>

          <div className="border-t border-slate-100 bg-white p-3">
            <div className="mb-2 flex flex-wrap gap-2">
              {chips.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => send(c)}
                  className="rounded-full bg-slate-50 px-3 py-1 text-[11px] font-medium text-slate-600 ring-1 ring-slate-100 hover:bg-blue-50 hover:text-[#2563EB]"
                >
                  {c}
                </button>
              ))}
            </div>
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                void send(input);
              }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about careers, exams, colleges, courses…"
                className="flex-1 rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                <Send size={16} /> Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </StudentShell>
  );
}
