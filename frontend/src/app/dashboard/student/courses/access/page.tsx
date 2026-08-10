"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, Check, MessageCircle, Shield, X } from "lucide-react";
import { StudentShell } from "@/components/student-shell";
import { StudentModuleChrome } from "@/components/student-home/module-chrome";

const PERMISSIONS = [
  { action: "Browse courses", student: true, admin: true },
  { action: "Search & filter catalogue", student: true, admin: true },
  { action: "Enroll in a course", student: true, admin: true },
  { action: "View course details", student: true, admin: true },
  { action: "Add new courses", student: false, admin: true },
  { action: "Edit course content", student: false, admin: true },
  { action: "Delete courses", student: false, admin: true },
  { action: "Publish / unpublish courses", student: false, admin: true },
  { action: "Manage study materials", student: false, admin: true },
];

function PermissionCell({ allowed }: { allowed: boolean }) {
  return allowed ? (
    <span className="inline-flex items-center gap-1 text-emerald-600">
      <Check size={16} strokeWidth={2.5} /> Yes
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-slate-400">
      <X size={16} strokeWidth={2.5} /> No
    </span>
  );
}

export default function CoursesAccessPage() {
  return (
    <StudentShell>
      <StudentModuleChrome
        title="Who Can Add Courses?"
        description="Understand what students and admins can do in the courses catalogue."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard/student" },
          { label: "Courses", href: "/dashboard/student/courses" },
          { label: "Access" },
        ]}
      >
        <Link
          href="/dashboard/student/courses"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0F3DDE] hover:underline"
        >
          <ArrowLeft size={16} /> Back to Courses
        </Link>

        <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch">
          <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#0F3DDE]">
              <BookOpen size={24} />
            </span>
            <h2 className="mt-4 font-display text-lg font-bold text-[#0B1F3A]">Student</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Students browse the course catalogue, search and filter by category or level, and enroll in published
              courses to start learning.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <Check size={16} className="mt-0.5 shrink-0 text-emerald-500" />
                Browse &amp; enroll in courses
              </li>
              <li className="flex items-start gap-2">
                <Check size={16} className="mt-0.5 shrink-0 text-emerald-500" />
                Use search and filters
              </li>
              <li className="flex items-start gap-2">
                <X size={16} className="mt-0.5 shrink-0 text-slate-400" />
                Cannot add or manage courses
              </li>
            </ul>
          </article>

          <div className="flex items-center justify-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 font-display text-sm font-extrabold text-slate-500 ring-1 ring-slate-200">
              VS
            </span>
          </div>

          <article className="rounded-2xl bg-gradient-to-br from-[#0F3DDE] to-[#2563EB] p-6 text-white shadow-lg">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <Shield size={24} />
            </span>
            <h2 className="mt-4 font-display text-lg font-bold">Admin / Training</h2>
            <p className="mt-2 text-sm leading-relaxed text-blue-50">
              Admins and training partners create, edit, publish, and manage the full course catalogue including
              materials and pricing.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-blue-50">
              <li className="flex items-start gap-2">
                <Check size={16} className="mt-0.5 shrink-0 text-emerald-300" />
                Full CRUD on courses
              </li>
              <li className="flex items-start gap-2">
                <Check size={16} className="mt-0.5 shrink-0 text-emerald-300" />
                Publish &amp; manage catalogue
              </li>
              <li className="flex items-start gap-2">
                <Check size={16} className="mt-0.5 shrink-0 text-emerald-300" />
                Upload study materials
              </li>
            </ul>
          </article>
        </div>

        <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
          <div className="border-b border-slate-100 px-5 py-4 lg:px-6">
            <h2 className="font-display text-lg font-bold text-[#0B1F3A]">Permission comparison</h2>
            <p className="mt-1 text-sm text-slate-500">What each role can do in the courses module.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80">
                  <th className="px-5 py-3 font-bold text-slate-700 lg:px-6">Action</th>
                  <th className="px-5 py-3 font-bold text-slate-700">Student</th>
                  <th className="px-5 py-3 font-bold text-slate-700 lg:px-6">Admin / Training</th>
                </tr>
              </thead>
              <tbody>
                {PERMISSIONS.map((row) => (
                  <tr key={row.action} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                    <td className="px-5 py-3.5 font-medium text-slate-800 lg:px-6">{row.action}</td>
                    <td className="px-5 py-3.5">
                      <PermissionCell allowed={row.student} />
                    </td>
                    <td className="px-5 py-3.5 lg:px-6">
                      <PermissionCell allowed={row.admin} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-100 lg:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-base font-bold text-[#0B1F3A]">Need to publish courses?</h2>
              <p className="mt-1 max-w-xl text-sm text-slate-600">
                If you represent a training institute or need admin access, contact our support team to upgrade your
                account role.
              </p>
            </div>
            <Link
              href="/dashboard/student/messages"
              className="inline-flex items-center gap-2 rounded-full bg-[#0F3DDE] px-5 py-2.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(15,61,222,0.25)] hover:bg-[#0c33c4]"
            >
              <MessageCircle size={16} /> Contact Support
            </Link>
          </div>
        </section>
      </StudentModuleChrome>
    </StudentShell>
  );
}
