"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { Bot, Loader2, MessageSquare, Plus, Send, Sparkles } from "lucide-react";
import { StudentShell } from "@/components/student-shell";
import { PrimaryButton, StudentModuleChrome } from "@/components/student-home/module-chrome";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

const CHATS_KEY = "ellowring_ai_chats";

type Msg = { role: "user" | "assistant"; text: string };

type Chat = {
  id: string;
  title: string;
  messages: Msg[];
  updatedAt: string;
};

function loadChats(): Chat[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CHATS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveChats(list: Chat[]) {
  localStorage.setItem(CHATS_KEY, JSON.stringify(list));
}

function newChatId(): string {
  return `chat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

const GREETING: Msg = {
  role: "assistant",
  text: "Hi! I'm your Ellowring AI Mentor. Ask me anything about careers, exams, colleges, courses, or internships — I'll guide you from Class 11 to your first job.",
};

export default function AiAssistantPage() {
  const { token, user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const activeChat = chats.find((c) => c.id === activeId);
  const messages = activeChat?.messages ?? [GREETING];

  useEffect(() => {
    const list = loadChats();
    setChats(list);
    if (list.length > 0) setActiveId(list[0].id);
    setHydrated(true);
  }, []);

  const persist = useCallback((list: Chat[]) => {
    setChats(list);
    saveChats(list);
  }, []);

  function startNewChat() {
    const chat: Chat = {
      id: newChatId(),
      title: "New chat",
      messages: [GREETING],
      updatedAt: new Date().toISOString(),
    };
    const list = [chat, ...chats];
    persist(list);
    setActiveId(chat.id);
    setInput("");
  }

  function selectChat(id: string) {
    setActiveId(id);
    setInput("");
  }

  async function send(text: string) {
    const q = text.trim();
    if (!q || busy) return;
    setInput("");
    setBusy(true);

    let chatId = activeId;
    let list = [...chats];
    let chat = list.find((c) => c.id === chatId);

    if (!chat) {
      chat = {
        id: newChatId(),
        title: q.slice(0, 40) + (q.length > 40 ? "…" : ""),
        messages: [GREETING],
        updatedAt: new Date().toISOString(),
      };
      chatId = chat.id;
      list = [chat, ...list];
      setActiveId(chatId);
    }

    const userMsg: Msg = { role: "user", text: q };
    const withUser = [...chat.messages, userMsg];
    list = list.map((c) =>
      c.id === chatId
        ? {
            ...c,
            title: c.messages.length <= 1 ? q.slice(0, 40) + (q.length > 40 ? "…" : "") : c.title,
            messages: withUser,
            updatedAt: new Date().toISOString(),
          }
        : c,
    );
    persist(list);

    try {
      const res = await api<{ recommendations?: string[]; message?: string }>(
        `/career/assistant/suggest?interest=${encodeURIComponent(q)}`,
        { token: token || undefined },
      ).catch(() => null);
      const recs = res?.recommendations?.length
        ? `\n\nSuggested paths: ${res.recommendations.join(", ")}.`
        : "";
      const firstName = user?.name?.replace(/^Mr\.?\s+/i, "").trim().split(/\s+/)[0] || "there";
      const reply =
        (res?.message ||
          `Hi ${firstName}! Based on your question (“${q}”), map your interests to a stream, shortlist coaching and courses on Ellowring, then build projects and apply for internships.`) +
        recs;
      const assistantMsg: Msg = { role: "assistant", text: reply };
      list = list.map((c) =>
        c.id === chatId
          ? { ...c, messages: [...withUser, assistantMsg], updatedAt: new Date().toISOString() }
          : c,
      );
      persist(list);
    } finally {
      setBusy(false);
    }
  }

  if (!hydrated) {
    return (
      <StudentShell>
        <p className="p-6 text-sm text-slate-500">
          <Loader2 className="mr-2 inline animate-spin" size={16} /> Loading…
        </p>
      </StudentShell>
    );
  }

  return (
    <StudentShell>
      <StudentModuleChrome
        title="AI Mentor"
        description="Personalized career guidance powered by Ellowring AI."
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard/student" }, { label: "Productivity" }]}
        actions={
          <PrimaryButton onClick={startNewChat}>
            <Plus size={16} /> New Chat
          </PrimaryButton>
        }
      >
        <div className="grid min-h-[560px] gap-0 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 lg:grid-cols-[260px_1fr]">
          {/* Left: Recent Chats */}
          <aside className="border-b border-slate-100 bg-[#F8FAFC] p-4 lg:border-b-0 lg:border-r">
            <p className="mb-3 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-400">
              <MessageSquare size={12} /> Recent Chats
            </p>
            {chats.length === 0 ? (
              <p className="text-xs text-slate-400">No chats yet. Start a conversation below.</p>
            ) : (
              <ul className="space-y-1">
                {chats.map((c) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => selectChat(c.id)}
                      className={`flex w-full items-start gap-2 rounded-xl px-3 py-2.5 text-left text-sm transition ${
                        activeId === c.id
                          ? "bg-[#0F3DDE] font-bold text-white shadow-sm"
                          : "font-medium text-slate-600 hover:bg-white"
                      }`}
                    >
                      <Bot size={15} className="mt-0.5 shrink-0" />
                      <span className="line-clamp-2">{c.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </aside>

          {/* Right: Active chat */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3 border-b border-slate-100 bg-gradient-to-r from-[#EEF2FF] to-white px-5 py-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0F3DDE] text-white shadow-md">
                <Sparkles size={20} />
              </div>
              <div>
                <p className="font-bold text-slate-800">Ellowring AI Mentor</p>
                <p className="text-[11px] text-slate-500">Online · Education & career specialist</p>
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-3 overflow-y-auto bg-[#FAFBFC] p-5" style={{ minHeight: 360 }}>
              {messages.map((msg, i) => (
                <div key={`${msg.role}-${i}`} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "rounded-br-md bg-[#0F3DDE] text-white"
                        : "rounded-bl-md bg-white text-slate-700 shadow-sm ring-1 ring-slate-100"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {busy && <p className="text-xs font-medium text-slate-400">AI is thinking…</p>}
            </div>

            <div className="border-t border-slate-100 bg-white p-4">
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
                  placeholder="Ask me anything…"
                  className="flex-1 rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-3 text-sm outline-none focus:border-[#0F3DDE] focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
                <PrimaryButton type="submit" disabled={busy || !input.trim()}>
                  <Send size={16} /> Send
                </PrimaryButton>
              </form>
            </div>
          </div>
        </div>
      </StudentModuleChrome>
    </StudentShell>
  );
}
