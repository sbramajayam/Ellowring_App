"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Pencil, Star, Trash2, Users, Clock3 } from "lucide-react";
import clsx from "clsx";
import type { ReactNode } from "react";

export type MarketplaceCardProps = {
  title: string;
  eyebrow?: string;
  imageUrl?: string | null;
  imageGradient?: string;
  rating?: string;
  students?: string;
  duration?: string;
  price?: string;
  href?: string;
  cta?: string;
  className?: string;
  onCtaClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  deleteBusy?: boolean;
  footer?: ReactNode;
};

export function MarketplaceCard({
  title,
  eyebrow = "Program",
  imageUrl,
  imageGradient = "from-[#0F3DDE] via-[#2563EB] to-[#60A5FA]",
  rating = "4.8",
  students = "50+",
  duration = "6 months",
  price = "₹0",
  href = "#",
  cta = "Enroll →",
  className,
  onCtaClick,
  onEdit,
  onDelete,
  deleteBusy,
  footer,
}: MarketplaceCardProps) {
  const hasImage = Boolean(imageUrl && String(imageUrl).trim());

  return (
    <motion.article
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className={clsx(
        "flex flex-col overflow-hidden rounded-[20px] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.08)] ring-1 ring-slate-100/80",
        className,
      )}
    >
      <div className={clsx("relative h-[148px] overflow-hidden bg-gradient-to-br sm:h-[160px]", imageGradient)}>
        {hasImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={String(imageUrl)}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : null}
        <div
          className={clsx(
            "absolute inset-0",
            hasImage
              ? "bg-gradient-to-t from-black/35 via-black/5 to-transparent"
              : "bg-[radial-gradient(circle_at_88%_12%,rgba(255,255,255,0.35),transparent_42%)]",
          )}
        />
        <span className="absolute left-3.5 top-3.5 rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.06em] text-white backdrop-blur-sm">
          {eyebrow}
        </span>
      </div>

      <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
        <h3 className="line-clamp-2 min-h-[2.75rem] font-display text-[16px] font-extrabold leading-snug tracking-tight text-[#0B1F3A]">
          {title}
        </h3>

        <div className="mt-3 flex flex-wrap items-center gap-x-3.5 gap-y-1.5 text-[12px] text-slate-500">
          <span className="inline-flex items-center gap-1 font-semibold text-[#F59E0B]">
            <Star size={13} fill="currentColor" /> {rating}
          </span>
          <span className="inline-flex items-center gap-1 font-medium">
            <Users size={13} className="text-slate-400" /> {students}
          </span>
          <span className="inline-flex items-center gap-1 font-medium">
            <Clock3 size={13} className="text-slate-400" /> {duration}
          </span>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <p className="text-[20px] font-extrabold tracking-tight text-[#0B1F3A]">{price}</p>
          {onCtaClick ? (
            <button
              type="button"
              onClick={onCtaClick}
              className="inline-flex items-center gap-1 rounded-full bg-[#0F3DDE] px-4 py-2.5 text-[12px] font-bold text-white shadow-[0_8px_18px_rgba(15,61,222,0.28)] transition hover:bg-[#0C32B8]"
            >
              {cta.includes("→") ? cta : (
                <>
                  {cta} <ArrowRight size={13} />
                </>
              )}
            </button>
          ) : (
            <Link
              href={href}
              className="inline-flex items-center gap-1 rounded-full bg-[#0F3DDE] px-4 py-2.5 text-[12px] font-bold text-white shadow-[0_8px_18px_rgba(15,61,222,0.28)] transition hover:bg-[#0C32B8]"
            >
              {cta.includes("→") ? cta : (
                <>
                  {cta} <ArrowRight size={13} />
                </>
              )}
            </Link>
          )}
        </div>

        {(onEdit || onDelete || footer) && (
          <div className="mt-3.5 flex gap-2 border-t border-slate-100 pt-3.5">
            {footer}
            {onEdit ? (
              <button
                type="button"
                onClick={onEdit}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[#EFF6FF] py-2.5 text-xs font-bold text-[#0F3DDE] hover:bg-blue-100"
              >
                <Pencil size={13} /> Edit
              </button>
            ) : null}
            {onDelete ? (
              <button
                type="button"
                disabled={deleteBusy}
                onClick={onDelete}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-rose-50 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-100 disabled:opacity-60"
              >
                <Trash2 size={13} /> Delete
              </button>
            ) : null}
          </div>
        )}
      </div>
    </motion.article>
  );
}

export function trackCoverImage(trackOrKey: string, seed = "1"): string {
  const map: Record<string, string> = {
    neet: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
    jee: "https://images.unsplash.com/photo-1509228468518-180dd4862904?auto=format&fit=crop&w=800&q=80",
    competitive: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80",
    course: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
  };
  const key = trackOrKey.toLowerCase();
  if (map[key]) return map[key];
  return `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80&sig=${encodeURIComponent(seed)}`;
}
