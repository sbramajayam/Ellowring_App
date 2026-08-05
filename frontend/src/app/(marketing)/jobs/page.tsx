"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

type Job = {
  id: string;
  title: string;
  location?: string;
  type: string;
  salaryMin?: number;
  salaryMax?: number;
  skills?: string;
  description?: string;
  company?: { name: string; city?: string };
};

export default function JobsPage() {
  const [items, setItems] = useState<Job[]>([]);
  const [q, setQ] = useState("");
  const { token, user } = useAuth();
  const [msg, setMsg] = useState("");

  const load = () =>
    api<Job[]>(`/jobs${q ? `?q=${encodeURIComponent(q)}` : ""}`)
      .then(setItems)
      .catch(console.error);

  useEffect(() => {
    load();
  }, []);

  async function apply(jobId: string) {
    if (!token) {
      setMsg("Login as a student to apply.");
      return;
    }
    try {
      await api("/applications", {
        method: "POST",
        token,
        body: JSON.stringify({ jobId }),
      });
      setMsg("Application submitted.");
    } catch (e: any) {
      setMsg(e.message);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 md:px-6">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-canopy">Job Portal</p>
      <h1 className="mt-2 font-display text-4xl font-bold md:text-6xl">Roles ready for you.</h1>
      <div className="mt-8 flex gap-3">
        <input
          className="input max-w-md"
          placeholder="Search role, skill, city"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button className="btn-primary" onClick={load}>
          Search
        </button>
      </div>
      {msg && <p className="mt-4 text-sm font-medium text-canopy">{msg}</p>}
      <div className="mt-8 grid gap-5">
        {items.map((job) => (
          <article key={job.id} className="surface rounded-3xl p-6 md:flex md:items-center md:justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold text-forest">{job.title}</h2>
              <p className="mt-1 text-slate">
                {job.company?.name} · {job.location} · {job.type}
              </p>
              <p className="mt-3 max-w-2xl text-slate">{job.description}</p>
              <p className="mt-2 text-sm text-canopy">{job.skills}</p>
            </div>
            <div className="mt-4 md:mt-0 md:text-right">
              <div className="font-semibold">
                ₹{((job.salaryMin || 0) / 100000).toFixed(1)}–
                {((job.salaryMax || 0) / 100000).toFixed(1)} LPA
              </div>
              <button
                className="btn-primary mt-3"
                onClick={() => apply(job.id)}
                disabled={user?.role === "COMPANY"}
              >
                Apply
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
