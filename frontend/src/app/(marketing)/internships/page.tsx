"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

type Internship = {
  id: string;
  title: string;
  location?: string;
  mode: string;
  stipend?: number;
  duration?: string;
  description?: string;
  company?: { name: string };
};

export default function InternshipsPage() {
  const [items, setItems] = useState<Internship[]>([]);
  const { token } = useAuth();
  const [msg, setMsg] = useState("");

  useEffect(() => {
    api<Internship[]>("/internships").then(setItems).catch(console.error);
  }, []);

  async function apply(internshipId: string) {
    if (!token) return setMsg("Login to apply.");
    await api("/applications", {
      method: "POST",
      token,
      body: JSON.stringify({ internshipId }),
    });
    setMsg("Internship application sent.");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 md:px-6">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-canopy">Internships</p>
      <h1 className="mt-2 font-display text-4xl font-bold md:text-6xl">Earn proof. Get paid.</h1>
      {msg && <p className="mt-4 text-canopy">{msg}</p>}
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {items.map((item) => (
          <article key={item.id} className="surface rounded-3xl p-6">
            <h2 className="font-display text-2xl font-bold text-forest">{item.title}</h2>
            <p className="mt-1 text-slate">
              {item.company?.name} · {item.mode} · {item.location}
            </p>
            <p className="mt-3 text-slate">{item.description}</p>
            <div className="mt-5 flex items-center justify-between">
              <span className="font-semibold">₹{item.stipend?.toLocaleString("en-IN")}/mo</span>
              <button className="btn-primary" onClick={() => apply(item.id)}>
                Apply
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
