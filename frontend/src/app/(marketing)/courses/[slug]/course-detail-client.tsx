"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { labelOf } from "@/lib/labels";

type Course = {
  id: string;
  title: string;
  category?: string | { name?: string; slug?: string } | null;
  level?: string | null;
  price: number;
  duration?: string;
  description?: string;
  partner?: { name: string };
  trainingCenter?: { name: string };
};

export default function CourseDetailClient() {
  const params = useParams<{ slug: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const { token } = useAuth();
  const [msg, setMsg] = useState("");

  useEffect(() => {
    api<Course>(`/courses/${params.slug}`).then(setCourse).catch(console.error);
  }, [params.slug]);

  async function enroll() {
    if (!token || !course) return setMsg("Login as student to enroll.");
    await api(`/courses/${course.id}/enroll`, { method: "POST", token });
    setMsg("Enrolled successfully.");
  }

  if (!course) return <div className="p-10 text-slate">Loading…</div>;

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 md:px-6">
      <Link href="/courses" className="text-sm font-semibold text-canopy">
        ← Courses
      </Link>
      <h1 className="mt-4 font-display text-4xl font-bold text-forest md:text-5xl">{course.title}</h1>
      <p className="mt-2 text-slate">
        {labelOf(course.category, "Course")} · {labelOf(course.level, "All levels")}
        {labelOf(course.trainingCenter ?? course.partner) ? ` · ${labelOf(course.trainingCenter ?? course.partner)}` : ""}
      </p>
      <p className="mt-6 text-lg text-slate">{course.description}</p>
      <div className="mt-8 flex items-center gap-4">
        <span className="font-display text-3xl font-bold">₹{course.price.toLocaleString("en-IN")}</span>
        <button className="btn-primary" onClick={enroll}>
          Enroll
        </button>
      </div>
      {msg && <p className="mt-3 text-canopy">{msg}</p>}
    </div>
  );
}
