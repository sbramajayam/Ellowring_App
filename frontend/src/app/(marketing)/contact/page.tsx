export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 md:px-6">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-canopy">Contact</p>
      <h1 className="mt-2 font-display text-4xl font-bold md:text-6xl">Let&apos;s talk.</h1>
      <form className="mt-10 surface space-y-4 rounded-3xl p-6 md:p-8">
        <input className="input" placeholder="Full name" />
        <input className="input" placeholder="Email" type="email" />
        <textarea className="input min-h-32" placeholder="How can we help?" />
        <button className="btn-primary" type="button">
          Send message
        </button>
        <p className="text-sm text-slate">Or email hello@ellowring.com</p>
      </form>
    </div>
  );
}
