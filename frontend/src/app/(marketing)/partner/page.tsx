import Link from "next/link";

export default function PartnerPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 md:px-6">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-canopy">Partner With Us</p>
      <h1 className="mt-2 font-display text-4xl font-bold md:text-6xl">Grow inside the ring.</h1>
      <p className="mt-4 max-w-2xl text-lg text-slate">
        Colleges, companies, training institutes and channel partners can run admissions, coaching,
        hiring and referrals on Ellowring.
      </p>
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {[
          ["Colleges", "Publish programs, track admissions interest, host placement activity."],
          ["Companies / HR", "Post jobs, internships, live projects and manage applicants."],
          ["Training Partners", "Launch courses & coaching batches with enrollment analytics."],
          ["Channel Partners", "Earn commission with unique referral codes across regions."],
        ].map(([title, copy]) => (
          <div key={title} className="surface rounded-3xl p-6">
            <h2 className="font-display text-2xl font-bold text-forest">{title}</h2>
            <p className="mt-2 text-slate">{copy}</p>
          </div>
        ))}
      </div>
      <Link href="/register" className="btn-primary mt-10 inline-flex">
        Create partner account
      </Link>
    </div>
  );
}
