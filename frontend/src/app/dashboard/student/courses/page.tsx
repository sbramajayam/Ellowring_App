"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BookOpen, Loader2 } from "lucide-react";
import { StudentShell } from "@/components/student-shell";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

type Course = {
  id: string;
  title: string;
  category: string;
  level: string;
  duration?: string | null;
  price: number;
  description?: string | null;
};

export default function StudentCoursesPage() {
  const { token } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await api<Course[]>("/courses", { token });
        if (!cancelled) setCourses(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load courses");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <StudentShell>
      <div className="mx-auto max-w-6xl space-y-5 p-4 lg:p-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Courses</h1>
          <p className="mt-1 text-sm text-slate-500">
            Industry-aligned skill courses with progress tracking and certificates.
          </p>
        </div>

        {loading && (
          <p className="inline-flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="animate-spin" size={16} /> Loading courses…
          </p>
        )}
        {error && (
          <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-100">
            {error}
          </p>
        )}

        {!loading && !error && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((c) => (
              <article
                key={c.id}
                className="flex flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100"
              >
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
                  <BookOpen size={20} />
                </div>
                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  {c.category} · {c.level}
                </p>
                <h2 className="mt-1 text-base font-bold text-slate-900">{c.title}</h2>
                <p className="mt-2 line-clamp-2 flex-1 text-sm text-slate-500">
                  {c.description || "Skill course on Ellowring."}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900">
                    {c.price > 0 ? `₹${c.price.toLocaleString("en-IN")}` : "Free"}
                  </span>
                  <span className="text-xs text-slate-400">{c.duration || "Self-paced"}</span>
                </div>
                <button
                  type="button"
                  className="mt-3 w-full rounded-xl bg-[#2563EB] py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Enroll
                </button>
              </article>
            ))}
          </div>
        )}

        {!loading && !error && courses.length === 0 && (
          <p className="rounded-2xl bg-white p-8 text-center text-sm text-slate-500 ring-1 ring-slate-100">
            No published courses yet.{" "}
            <Link href="/courses" className="font-semibold text-[#2563EB]">
              Browse public catalogue
            </Link>
          </p>
        )}
      </div>
    </StudentShell>
  );
}
