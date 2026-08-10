"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Users, Clock3, ArrowRight } from "lucide-react";
import clsx from "clsx";

export type MarketplaceCardProps = {
  title: string;
  eyebrow?: string;
  imageGradient?: string;
  rating?: string;
  students?: string;
  duration?: string;
  price?: string;
  href?: string;
  cta?: string;
  className?: string;
  onCtaClick?: () => void;
};

export function MarketplaceCard({
  title,
  eyebrow = "Program",
  imageGradient = "from-[#0F3DDE] via-[#2563EB] to-[#60A5FA]",
  rating = "4.8",
  students = "12k+",
  duration = "12 weeks",
  price = "₹4,999",
  href = "#",
  cta = "Enroll now",
  className,
  onCtaClick,
}: MarketplaceCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={clsx(
        "overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.06)]",
        className,
      )}
    >
      <div className={clsx("relative h-36 bg-gradient-to-br p-4 text-white", imageGradient)}>
        <span className="rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide backdrop-blur">
          {eyebrow}
        </span>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.25),transparent_45%)]" />
      </div>
      <div className="p-4">
        <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-bold text-slate-900">{title}</h3>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1 font-medium text-amber-500">
            <Star size={12} fill="currentColor" /> {rating}
          </span>
          <span className="inline-flex items-center gap-1">
            <Users size={12} /> {students}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock3 size={12} /> {duration}
          </span>
        </div>
        <div className="mt-4 flex items-center justify-between gap-2">
          <p className="text-base font-bold text-slate-900">{price}</p>
          {onCtaClick ? (
            <button
              type="button"
              onClick={onCtaClick}
              className="inline-flex items-center gap-1 rounded-xl bg-[#0F3DDE] px-3 py-2 text-xs font-bold text-white shadow-sm shadow-blue-600/20 transition hover:bg-[#0C32B8]"
            >
              {cta} <ArrowRight size={12} />
            </button>
          ) : (
            <Link
              href={href}
              className="inline-flex items-center gap-1 rounded-xl bg-[#0F3DDE] px-3 py-2 text-xs font-bold text-white shadow-sm shadow-blue-600/20 transition hover:bg-[#0C32B8]"
            >
              {cta} <ArrowRight size={12} />
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}
