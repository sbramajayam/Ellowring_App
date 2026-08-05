import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line bg-forest text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4 md:px-6">
        <div className="md:col-span-2">
          <div className="font-display text-3xl font-bold">
            Ellow<span className="text-sun">ring</span>
          </div>
          <p className="mt-3 max-w-md text-leaf/90">
            From 11th Standard to First Job — everything in one AI-powered Education, Career & Hiring
            ecosystem.
          </p>
          <p className="mt-4 text-sm text-leaf/70">Learn. Prepare. Build. Get Hired.</p>
        </div>
        <div>
          <h4 className="font-display text-lg font-semibold">Explore</h4>
          <div className="mt-4 flex flex-col gap-2 text-sm text-leaf/85">
            <Link href="/coaching">Coaching</Link>
            <Link href="/career-guidance">Career Guidance</Link>
            <Link href="/colleges">Colleges</Link>
            <Link href="/courses">Courses</Link>
            <Link href="/jobs">Jobs</Link>
          </div>
        </div>
        <div>
          <h4 className="font-display text-lg font-semibold">Partners</h4>
          <div className="mt-4 flex flex-col gap-2 text-sm text-leaf/85">
            <Link href="/partner">Partner With Us</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            <a href="mailto:hello@ellowring.com">hello@ellowring.com</a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-leaf/60">
        © {new Date().getFullYear()} Ellowring Software Solutions. Built for India&apos;s next generation.
      </div>
    </footer>
  );
}
