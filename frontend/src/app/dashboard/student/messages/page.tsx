"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { MessageSquarePlus, Send } from "lucide-react";
import clsx from "clsx";
import { StudentShell } from "@/components/student-shell";
import {
  ModuleSearchInput,
  PrimaryButton,
  StudentModuleChrome,
} from "@/components/student-home/module-chrome";

const STORAGE_KEY = "ellowring_messages_v1";

type ChatMessage = {
  id: string;
  role: "me" | "them";
  text: string;
  at: string;
};

type Conversation = {
  id: string;
  name: string;
  avatarHint: string;
  snippet: string;
  updatedAt: string;
  unread: number;
  messages: ChatMessage[];
};

function newId(prefix = "msg"): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function seedConversations(): Conversation[] {
  const now = Date.now();
  return [
    {
      id: "conv-career",
      name: "Career Mentor",
      avatarHint: "CM",
      snippet: "Your mock test scores look strong — let's plan next steps.",
      updatedAt: new Date(now - 3600000).toISOString(),
      unread: 1,
      messages: [
        {
          id: newId(),
          role: "them",
          text: "Hi! I reviewed your recent NEET mock scores — great improvement in Biology.",
          at: new Date(now - 7200000).toISOString(),
        },
        {
          id: newId(),
          role: "me",
          text: "Thank you! Which topics should I focus on this week?",
          at: new Date(now - 5400000).toISOString(),
        },
        {
          id: newId(),
          role: "them",
          text: "Your mock test scores look strong — let's plan next steps.",
          at: new Date(now - 3600000).toISOString(),
        },
      ],
    },
    {
      id: "conv-support",
      name: "Support Team",
      avatarHint: "ST",
      snippet: "Your wallet top-up was successful.",
      updatedAt: new Date(now - 86400000).toISOString(),
      unread: 0,
      messages: [
        {
          id: newId(),
          role: "them",
          text: "Welcome to Ellowring! Reach out anytime for account help.",
          at: new Date(now - 172800000).toISOString(),
        },
        {
          id: newId(),
          role: "them",
          text: "Your wallet top-up was successful.",
          at: new Date(now - 86400000).toISOString(),
        },
      ],
    },
    {
      id: "conv-ai",
      name: "AI Mentor",
      avatarHint: "AI",
      snippet: "Try the 30-day study planner in AI Hub.",
      updatedAt: new Date(now - 180000).toISOString(),
      unread: 2,
      messages: [
        {
          id: newId(),
          role: "them",
          text: "I can help you build a personalised study schedule.",
          at: new Date(now - 600000).toISOString(),
        },
        {
          id: newId(),
          role: "me",
          text: "Can you suggest a daily routine for JEE prep?",
          at: new Date(now - 300000).toISOString(),
        },
        {
          id: newId(),
          role: "them",
          text: "Try the 30-day study planner in AI Hub.",
          at: new Date(now - 180000).toISOString(),
        },
      ],
    },
  ];
}

function loadConversations(): Conversation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedConversations();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return seedConversations();
    return parsed as Conversation[];
  } catch {
    return seedConversations();
  }
}

function saveConversations(list: Conversation[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 60000) return "Just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
  if (diff < 86400000) return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  if (diff < 604800000) return d.toLocaleDateString("en-IN", { weekday: "short" });
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function formatBubbleTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [newOpen, setNewOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    const list = loadConversations();
    if (!raw) saveConversations(list);
    setConversations(list);
    setActiveId(list[0]?.id ?? null);
    setHydrated(true);
  }, []);

  const persist = useCallback((list: Conversation[]) => {
    setConversations(list);
    saveConversations(list);
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.snippet.toLowerCase().includes(q) ||
        c.messages.some((m) => m.text.toLowerCase().includes(q)),
    );
  }, [conversations, search]);

  const active = conversations.find((c) => c.id === activeId) ?? null;

  function selectConversation(id: string) {
    setActiveId(id);
    persist(
      conversations.map((c) =>
        c.id === id ? { ...c, unread: 0 } : c,
      ),
    );
  }

  function sendMessage(e: FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text || !activeId) return;
    const at = new Date().toISOString();
    const msg: ChatMessage = { id: newId(), role: "me", text, at };
    persist(
      conversations.map((c) =>
        c.id === activeId
          ? {
              ...c,
              messages: [...c.messages, msg],
              snippet: text,
              updatedAt: at,
              unread: 0,
            }
          : c,
      ),
    );
    setDraft("");
  }

  function createConversation(e: FormEvent) {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    const conv: Conversation = {
      id: newId("conv"),
      name,
      avatarHint: initials(name),
      snippet: "Start a conversation…",
      updatedAt: new Date().toISOString(),
      unread: 0,
      messages: [],
    };
    const next = [conv, ...conversations];
    persist(next);
    setActiveId(conv.id);
    setNewName("");
    setNewOpen(false);
  }

  if (!hydrated) return null;

  return (
    <StudentShell>
      <StudentModuleChrome
        title="Messages"
        description="Chat with mentors, support, and AI assistants."
        actions={
          <PrimaryButton onClick={() => setNewOpen(true)}>
            <MessageSquarePlus size={16} />
            New Message
          </PrimaryButton>
        }
        filters={<ModuleSearchInput value={search} onChange={setSearch} placeholder="Search conversations…" />}
      >
        <div className="flex min-h-[520px] flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 lg:flex-row lg:min-h-[calc(100vh-280px)]">
          {/* Left pane */}
          <div className="flex w-full flex-col border-b border-slate-100 lg:w-[320px] lg:shrink-0 lg:border-b-0 lg:border-r xl:w-[360px]">
            <div className="hidden border-b border-slate-100 px-4 py-3 lg:block">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Conversations</p>
            </div>
            <div className="max-h-[240px] flex-1 overflow-y-auto lg:max-h-none">
              {filtered.length === 0 ? (
                <p className="p-6 text-center text-sm text-slate-500">No conversations match your search.</p>
              ) : (
                filtered.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => selectConversation(c.id)}
                    className={clsx(
                      "flex w-full items-start gap-3 border-b border-slate-50 px-4 py-3.5 text-left transition hover:bg-[#F8FAFC]",
                      activeId === c.id && "bg-[#EEF2FF]",
                    )}
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0F3DDE]/10 text-sm font-bold text-[#0F3DDE]">
                      {c.avatarHint || initials(c.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-bold text-slate-800">{c.name}</p>
                        <span className="shrink-0 text-[11px] text-slate-400">{formatTime(c.updatedAt)}</span>
                      </div>
                      <div className="mt-0.5 flex items-center justify-between gap-2">
                        <p className="truncate text-xs text-slate-500">{c.snippet}</p>
                        {c.unread > 0 ? (
                          <span className="flex h-5 min-w-[20px] shrink-0 items-center justify-center rounded-full bg-[#0F3DDE] px-1.5 text-[10px] font-bold text-white">
                            {c.unread}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Right pane */}
          <div className="flex min-h-[360px] flex-1 flex-col">
            {active ? (
              <>
                <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3.5 lg:px-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0F3DDE]/10 text-sm font-bold text-[#0F3DDE]">
                    {active.avatarHint || initials(active.name)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{active.name}</p>
                    <p className="text-[11px] text-slate-400">Active now</p>
                  </div>
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto bg-[#F8FAFC] p-4 lg:p-5">
                  {active.messages.length === 0 ? (
                    <p className="py-8 text-center text-sm text-slate-400">No messages yet — say hello!</p>
                  ) : (
                    active.messages.map((m) => (
                      <div
                        key={m.id}
                        className={clsx("flex", m.role === "me" ? "justify-end" : "justify-start")}
                      >
                        <div
                          className={clsx(
                            "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm",
                            m.role === "me"
                              ? "rounded-br-md bg-[#0F3DDE] text-white"
                              : "rounded-bl-md bg-white text-slate-700 ring-1 ring-slate-100",
                          )}
                        >
                          <p className="leading-relaxed">{m.text}</p>
                          <p
                            className={clsx(
                              "mt-1 text-[10px]",
                              m.role === "me" ? "text-blue-100" : "text-slate-400",
                            )}
                          >
                            {formatBubbleTime(m.at)}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <form
                  onSubmit={sendMessage}
                  className="flex items-center gap-2 border-t border-slate-100 bg-white p-3 lg:p-4"
                >
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Type a message…"
                    className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-2.5 text-sm outline-none focus:border-[#0F3DDE] focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                  <PrimaryButton type="submit" disabled={!draft.trim()}>
                    <Send size={16} />
                    Send
                  </PrimaryButton>
                </form>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
                <MessageSquarePlus className="text-slate-300" size={40} />
                <p className="mt-3 text-sm font-medium text-slate-600">Select a conversation</p>
                <p className="mt-1 text-xs text-slate-400">Or start a new message</p>
              </div>
            )}
          </div>
        </div>

        {newOpen ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <form
              onSubmit={createConversation}
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-100"
            >
              <h2 className="text-lg font-bold text-slate-900">New Message</h2>
              <p className="mt-1 text-sm text-slate-500">Start a conversation with a mentor or contact.</p>
              <input
                autoFocus
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Recipient name"
                className="mt-4 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#0F3DDE] focus:ring-4 focus:ring-blue-100"
              />
              <div className="mt-5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNewOpen(false)}
                  className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <PrimaryButton type="submit" disabled={!newName.trim()}>
                  Create
                </PrimaryButton>
              </div>
            </form>
          </div>
        ) : null}
      </StudentModuleChrome>
    </StudentShell>
  );
}
