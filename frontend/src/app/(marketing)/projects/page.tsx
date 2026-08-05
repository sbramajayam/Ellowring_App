"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

type Project = {
  id: string;
  title: string;
  domain?: string;
  description?: string;
  stipend?: number;
  duration?: string;
  company?: { name: string };
};

export default function ProjectsPage() {
  const [items, setItems] = useState<Project[]>([]);
  const { token } = useAuth();
  const [msg, setMsg] = useState("");

  useEffect(() => {
    api<Project[]>("/projects").then(setItems).catch(console.error);
  }, []);

  async function apply(projectId: string) {
    if (!token) return setMsg("Login to apply.");
    await api("/applications", { method: "POST", token, body: JSON.stringify({ projectId }) });
    setMsg("Project application submitted.");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 md:px-6">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-canopy">Live Projects</p>
      <h1 className="mt-2 font-display text-4xl font-bold md:text-6xl">Ship real work.</h1>
      {msg && <p className="mt-4 text-canopy">{msg}</p>}
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {items.map((p) => (
          <article key={p.id} className="surface rounded-3xl p-6">
            <span className="text-xs font-semibold uppercase text-canopy">{p.domain}</span>
            <h2 className="mt-2 font-display text-2xl font-bold text-forest">{p.title}</h2>
            <p className="mt-1 text-slate">{p.company?.name}</p>
            <p className="mt-3 text-slate">{p.description}</p>
            <div className="mt-5 flex items-center justify-between">
              <span className="font-semibold">₹{p.stipend?.toLocaleString("en-IN")}</span>
              <button className="btn-primary" onClick={() => apply(p.id)}>
                Join project
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
