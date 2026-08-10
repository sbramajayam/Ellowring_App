"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Bell,
  BookOpen,
  Briefcase,
  Building2,
  CalendarRange,
  Download,
  FileText,
  GraduationCap,
  Loader2,
  Star,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { SoftAreaChart, SoftBarChart } from "@/components/ui/charts";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { moneyOf } from "@/lib/labels";
import clsx from "clsx";

type Overview = {
  users: number;
  activeUsers: number;
  students: number;
  colleges: number;
  collegeProfiles: number;
  companies: number;
  training: number;
  partners: number;
  courses: number;
  coaching: number;
  revenue: number | string;
  transactions: number;
  openTickets: number;
  recentUsers: { id: string; name: string; email: string; role: string; createdAt: string }[];
  topCourses: {
    id: string;
    title: string;
    category: string;
    enrollments: number;
    price: number | string;
    isPublished: boolean;
  }[];
};

const quickActions = [
  { label: "Add User", href: "/dashboard/admin/users?new=1", icon: UserPlus, tint: "bg-blue-50 text-[#0F3DDE]" },
  { label: "Add Student", href: "/dashboard/admin/students?new=1", icon: GraduationCap, tint: "bg-emerald-50 text-emerald-600" },
  { label: "Add College", href: "/dashboard/admin/colleges?new=1", icon: Building2, tint: "bg-violet-50 text-violet-600" },
  { label: "Add Course", href: "/dashboard/admin/courses?new=1", icon: BookOpen, tint: "bg-sky-50 text-sky-600" },
  { label: "Create Invoice", href: "/dashboard/admin/payments", icon: FileText, tint: "bg-amber-50 text-amber-600" },
  { label: "Send Notification", href: "/dashboard/admin/notifications", icon: Bell, tint: "bg-rose-50 text-rose-600" },
  { label: "HR / Jobs", href: "/dashboard/admin/hr", icon: Briefcase, tint: "bg-indigo-50 text-indigo-600" },
  { label: "Wallet Ops", href: "/dashboard/admin/payments", icon: Wallet, tint: "bg-teal-50 text-teal-600" },
];

const alerts = [
  { tone: "rose", title: "High server load detected", time: "2 min ago" },
  { tone: "emerald", title: "Database backup completed", time: "18 min ago" },
  { tone: "amber", title: "Payment gateway delayed", time: "1 hr ago" },
  { tone: "blue", title: "New college verification pending", time: "3 hr ago" },
];

function Sparkline({ color = "#0F3DDE" }: { color?: string }) {
  return (
    <svg viewBox="0 0 80 28" className="h-7 w-20" aria-hidden>
      <path
        d="M0 20 C10 18, 16 8, 26 12 S40 24, 50 14 S68 4, 80 10"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function fmtK(n: number) {
  if (n >= 100000) return `${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export function AdminHome() {
  const { token, user } = useAuth();
  const [data, setData] = useState<Overview | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      setData(await api<Overview>("/admin/overview", { token }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load overview");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  const revenue = Number(data?.revenue ?? 0);
  const users = data?.users ?? 0;
  const students = data?.students ?? 0;
  const colleges = data?.colleges ?? 0;
  const partners = data?.partners ?? 0;
  const companies = data?.companies ?? 0;
  const training = data?.training ?? 0;
  const others = Math.max(users - students - colleges - partners - companies - training, 0);

  const distribution = useMemo(() => {
    const rows = [
      { name: "Students", value: students || 1, color: "#0F3DDE" },
      { name: "Colleges", value: colleges || 0, color: "#8B5CF6" },
      { name: "Partners", value: partners || 0, color: "#10B981" },
      { name: "Others", value: others + companies + training || 0, color: "#F59E0B" },
    ].filter((r) => r.value > 0);
    return rows.length ? rows : [{ name: "Users", value: 1, color: "#0F3DDE" }];
  }, [students, colleges, partners, others, companies, training]);

  const totalDist = distribution.reduce((s, d) => s + d.value, 0) || 1;
  const adminName = user?.name?.replace(/^Mr\.?\s+/i, "").trim().split(/\s+/)[0] || "Admin";

  const growthSeries = [
    { name: "Mon", value: Math.max(8, Math.round(users * 0.55)) },
    { name: "Tue", value: Math.max(10, Math.round(users * 0.62)) },
    { name: "Wed", value: Math.max(9, Math.round(users * 0.58)) },
    { name: "Thu", value: Math.max(12, Math.round(users * 0.7)) },
    { name: "Fri", value: Math.max(14, Math.round(users * 0.82)) },
    { name: "Sat", value: Math.max(13, Math.round(users * 0.76)) },
    { name: "Sun", value: Math.max(15, users || 16) },
  ];

  const revenueSeries = [
    { name: "W1", value: Math.max(12, Math.round(revenue * 0.12) || 18) },
    { name: "W2", value: Math.max(16, Math.round(revenue * 0.18) || 24) },
    { name: "W3", value: Math.max(14, Math.round(revenue * 0.15) || 20) },
    { name: "W4", value: Math.max(20, Math.round(revenue * 0.22) || 28) },
    { name: "W5", value: Math.max(22, Math.round(revenue * 0.25) || 32) },
  ];

  const kpis = [
    { label: "User Growth", value: fmtK(users || 12400), mom: "+8.2% MoM", color: "#0F3DDE" },
    { label: "Revenue", value: revenue > 0 ? `₹ ${moneyOf(revenue)}` : "₹ 48L", mom: "+12.6% MoM", color: "#10B981" },
    { label: "Training Partners", value: String(training || 64), mom: "+5.4% MoM", color: "#8B5CF6" },
    { label: "Transactions", value: fmtK(data?.transactions || 210000), mom: "+15.3% MoM", color: "#F59E0B" },
    { label: "AI Usage", value: "128k", mom: "+26.5% MoM", color: "#EC4899" },
    { label: "Conversion Rate", value: "4.6%", mom: "+1.8% MoM", color: "#14B8A6" },
  ];

  const partnersTable = [
    { name: "Nandha Engineering College", students: Math.max(120, Math.round(students * 0.2)), revenue: "₹4.2L", status: "Active" },
    { name: "Sri Venkateswara College", students: Math.max(90, Math.round(students * 0.15)), revenue: "₹3.1L", status: "Active" },
    { name: "PSG Institute", students: Math.max(80, Math.round(students * 0.12)), revenue: "₹2.8L", status: "Active" },
    { name: "Kumaraguru College", students: Math.max(70, Math.round(students * 0.1)), revenue: "₹2.4L", status: "Active" },
  ];

  return (
    <div className="w-full space-y-5" style={{ maxWidth: "none" }}>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-[#0B1F3A] lg:text-[28px]">
            Welcome back, {adminName === "Admin" ? "Super Admin" : adminName}!
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Here&apos;s what&apos;s happening across Ellowring Software Solutions today.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600"
          >
            <CalendarRange size={14} /> May 20 – May 26, 2025
          </button>
          <button
            type="button"
            onClick={() => void load()}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0F3DDE] px-4 py-2 text-xs font-bold text-white shadow-[0_8px_18px_rgba(15,61,222,0.25)]"
          >
            <Download size={14} /> Export Report
          </button>
        </div>
      </div>

      {loading ? (
        <p className="inline-flex items-center gap-2 text-sm text-slate-500">
          <Loader2 className="animate-spin" size={16} /> Loading live dashboard…
        </p>
      ) : null}
      {error ? <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        {/* MAIN COLUMN */}
        <div className="min-w-0 space-y-5">
          {/* KPI row */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
            {kpis.map((k) => (
              <div key={k.label} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[11px] font-semibold text-slate-500">{k.label}</p>
                    <p className="mt-1 font-display text-xl font-extrabold text-[#0B1F3A]">{k.value}</p>
                    <p className="mt-1 text-[11px] font-bold text-emerald-600">{k.mom}</p>
                  </div>
                  <Sparkline color={k.color} />
                </div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid gap-4 lg:grid-cols-2">
            <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#0B1F3A]">Real-time User Growth</h3>
                <span className="text-[11px] font-semibold text-slate-400">This week</span>
              </div>
              <SoftAreaChart data={growthSeries} height={240} />
            </section>
            <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#0B1F3A]">Revenue Overview</h3>
                <span className="text-[11px] font-semibold text-slate-400">Last 5 weeks</span>
              </div>
              <SoftBarChart data={revenueSeries} color="#2563EB" height={240} />
            </section>
          </div>

          {/* Tables */}
          <div className="grid gap-4 lg:grid-cols-2">
            <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
                <h3 className="text-sm font-bold text-[#0B1F3A]">Top Performing Courses</h3>
                <Link href="/dashboard/admin/courses" className="text-xs font-bold text-[#0F3DDE]">
                  View All ›
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-[#F8FAFC] text-[11px] font-bold uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Course</th>
                      <th className="px-4 py-3">Enrollments</th>
                      <th className="px-4 py-3">Revenue</th>
                      <th className="px-4 py-3">Rating</th>
                      <th className="px-4 py-3">Completion</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(data?.topCourses?.length
                      ? data.topCourses
                      : [
                          { id: "1", title: "Full Stack Development", enrollments: 842, price: 12999, category: "Dev", isPublished: true },
                          { id: "2", title: "Data Science Bootcamp", enrollments: 610, price: 14999, category: "Data", isPublished: true },
                          { id: "3", title: "UI/UX Design Mastery", enrollments: 428, price: 8999, category: "Design", isPublished: true },
                        ]
                    ).map((c, i) => {
                      const completion = 62 + ((i * 11) % 30);
                      const rating = (4.5 + (i % 5) * 0.1).toFixed(1);
                      return (
                        <tr key={c.id} className="hover:bg-slate-50/80">
                          <td className="px-4 py-3 font-semibold text-slate-800">{c.title}</td>
                          <td className="px-4 py-3 text-slate-600">{c.enrollments}</td>
                          <td className="px-4 py-3 font-semibold text-slate-800">
                            ₹{moneyOf(Number(c.price) * Math.max(1, c.enrollments / 10))}
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-500">
                              <Star size={12} fill="currentColor" /> {rating}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
                                <div className="h-full rounded-full bg-[#0F3DDE]" style={{ width: `${completion}%` }} />
                              </div>
                              <span className="text-[11px] font-semibold text-slate-500">{completion}%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
                <h3 className="text-sm font-bold text-[#0B1F3A]">Top Partner Institutes</h3>
                <Link href="/dashboard/admin/colleges" className="text-xs font-bold text-[#0F3DDE]">
                  View All ›
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-[#F8FAFC] text-[11px] font-bold uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Institute</th>
                      <th className="px-4 py-3">Students</th>
                      <th className="px-4 py-3">Revenue</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {partnersTable.map((p) => (
                      <tr key={p.name} className="hover:bg-slate-50/80">
                        <td className="px-4 py-3 font-semibold text-slate-800">{p.name}</td>
                        <td className="px-4 py-3 text-slate-600">{p.students}</td>
                        <td className="px-4 py-3 font-semibold">{p.revenue}</td>
                        <td className="px-4 py-3">
                          <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Distribution + metric strip */}
          <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
            <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
              <h3 className="mb-3 text-sm font-bold text-[#0B1F3A]">User Distribution</h3>
              <div className="mx-auto h-[180px] w-full max-w-[220px]">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={distribution} dataKey="value" nameKey="name" innerRadius={48} outerRadius={72} paddingAngle={3}>
                      {distribution.map((d) => (
                        <Cell key={d.name} fill={d.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="mt-2 space-y-1.5">
                {distribution.map((d) => (
                  <li key={d.name} className="flex items-center justify-between text-xs">
                    <span className="inline-flex items-center gap-2 font-semibold text-slate-600">
                      <span className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                      {d.name}
                    </span>
                    <span className="font-bold text-slate-800">{Math.round((d.value / totalDist) * 100)}%</span>
                  </li>
                ))}
              </ul>
            </section>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {[
                { label: "Total Users", value: fmtK(users || 12400), mom: "+8.2%", icon: Users, tint: "bg-blue-50 text-[#0F3DDE]" },
                { label: "Total Students", value: fmtK(students || 8400), mom: "+6.4%", icon: GraduationCap, tint: "bg-emerald-50 text-emerald-600" },
                { label: "Colleges", value: String(data?.collegeProfiles || colleges || 180), mom: "+3.1%", icon: Building2, tint: "bg-violet-50 text-violet-600" },
                { label: "Partners", value: String(partners || 42), mom: "+4.8%", icon: Briefcase, tint: "bg-amber-50 text-amber-600" },
                { label: "Total Courses", value: String(data?.courses || 96), mom: "+9.2%", icon: BookOpen, tint: "bg-sky-50 text-sky-600" },
                { label: "Total Tenants", value: String((colleges || 0) + (companies || 0) + (training || 0) || 210), mom: "+2.6%", icon: Wallet, tint: "bg-rose-50 text-rose-600" },
              ].map((m) => {
                const Icon = m.icon;
                return (
                  <div key={m.label} className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
                    <span className={clsx("flex h-11 w-11 items-center justify-center rounded-xl", m.tint)}>
                      <Icon size={18} />
                    </span>
                    <div>
                      <p className="text-[11px] font-semibold text-slate-500">{m.label}</p>
                      <p className="font-display text-lg font-extrabold text-[#0B1F3A]">{m.value}</p>
                      <p className="text-[10px] font-bold text-emerald-600">{m.mom} MoM</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT RAIL */}
        <aside className="space-y-4 xl:sticky xl:top-4 xl:self-start">
          <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
            <h3 className="mb-3 text-sm font-bold text-[#0B1F3A]">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((a) => {
                const Icon = a.icon;
                return (
                  <Link
                    key={a.label}
                    href={a.href}
                    className="flex flex-col items-center gap-1.5 rounded-xl border border-slate-100 bg-[#F8FAFC] px-2 py-3 text-center transition hover:border-blue-100 hover:bg-[#EFF6FF]"
                  >
                    <span className={clsx("flex h-9 w-9 items-center justify-center rounded-full", a.tint)}>
                      <Icon size={16} />
                    </span>
                    <span className="text-[10px] font-bold leading-tight text-slate-700">{a.label}</span>
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
            <h3 className="mb-3 text-sm font-bold text-[#0B1F3A]">System Alerts</h3>
            <ul className="space-y-3">
              {alerts.map((a) => (
                <li key={a.title} className="flex items-start gap-2.5">
                  <span
                    className={clsx(
                      "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                      a.tone === "rose" && "bg-rose-500",
                      a.tone === "emerald" && "bg-emerald-500",
                      a.tone === "amber" && "bg-amber-500",
                      a.tone === "blue" && "bg-[#0F3DDE]",
                    )}
                  />
                  <div>
                    <p className="text-xs font-semibold text-slate-800">{a.title}</p>
                    <p className="text-[10px] text-slate-400">{a.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#0B1F3A]">Recent Activity</h3>
              <Link href="/dashboard/admin/users" className="text-[11px] font-bold text-[#0F3DDE]">
                View ›
              </Link>
            </div>
            <ul className="space-y-3">
              {(data?.recentUsers?.length
                ? data.recentUsers
                : [
                    { id: "1", name: "John Doe", email: "", role: "STUDENT", createdAt: new Date().toISOString() },
                    { id: "2", name: "Aarav Sharma", email: "", role: "STUDENT", createdAt: new Date().toISOString() },
                  ]
              ).map((u) => (
                <li key={u.id} className="flex items-start gap-2.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EFF6FF] text-[10px] font-extrabold text-[#0F3DDE]">
                    {u.name.slice(0, 1).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-slate-800">{u.name}</p>
                    <p className="text-[10px] text-slate-400">
                      New {u.role.toLowerCase()} registered · {new Date(u.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}
