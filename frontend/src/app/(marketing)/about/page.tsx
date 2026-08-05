import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-14 md:px-6">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-canopy">About</p>
      <h1 className="mt-2 font-display text-4xl font-bold md:text-6xl">Ellowring Software Solutions</h1>
      <p className="mt-6 text-lg text-slate">
        We are building India&apos;s most trusted Education, Career & Hiring ecosystem by connecting
        Students, Colleges, Companies, Training Partners and Channel Partners through one AI-powered
        platform.
      </p>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <div className="surface rounded-3xl p-6">
          <h2 className="font-display text-xl font-bold">Vision</h2>
          <p className="mt-2 text-slate">From 11th Standard to First Job — Everything in One Platform.</p>
        </div>
        <div className="surface rounded-3xl p-6">
          <h2 className="font-display text-xl font-bold">Mission</h2>
          <p className="mt-2 text-slate">
            Make learning-to-hiring continuous, transparent and opportunity-rich for every student.
          </p>
        </div>
      </div>
      <Link href="/partner" className="btn-primary mt-10 inline-flex">
        Partner with us
      </Link>
    </div>
  );
}
