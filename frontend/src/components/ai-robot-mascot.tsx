/** Decorative AI robot mascot matching Student Dashboard reference */
export function AiRobotMascot({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 220"
      className={className}
      aria-hidden
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="100" cy="208" rx="48" ry="8" fill="#93C5FD" opacity="0.45" />
      {/* Antenna */}
      <line x1="100" y1="28" x2="100" y2="48" stroke="#60A5FA" strokeWidth="4" strokeLinecap="round" />
      <circle cx="100" cy="22" r="8" fill="#FBBF24" />
      <circle cx="100" cy="22" r="4" fill="#FFF7ED" />
      {/* Ear pods */}
      <rect x="28" y="88" width="18" height="36" rx="9" fill="#3B82F6" />
      <rect x="154" y="88" width="18" height="36" rx="9" fill="#3B82F6" />
      {/* Head */}
      <rect x="48" y="48" width="104" height="92" rx="28" fill="url(#headGrad)" />
      <rect x="48" y="48" width="104" height="92" rx="28" fill="url(#headShine)" />
      {/* Face plate */}
      <rect x="62" y="72" width="76" height="48" rx="18" fill="#0F172A" />
      {/* Eyes */}
      <circle cx="82" cy="96" r="10" fill="#38BDF8" />
      <circle cx="118" cy="96" r="10" fill="#38BDF8" />
      <circle cx="85" cy="93" r="3.5" fill="#fff" />
      <circle cx="121" cy="93" r="3.5" fill="#fff" />
      {/* Smile */}
      <path d="M88 110 Q100 120 112 110" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
      {/* Body */}
      <rect x="58" y="142" width="84" height="52" rx="18" fill="url(#bodyGrad)" />
      <rect x="78" y="156" width="44" height="18" rx="9" fill="#1E40AF" />
      <circle cx="100" cy="165" r="4" fill="#93C5FD" />
      {/* Arms */}
      <rect x="36" y="148" width="20" height="36" rx="10" fill="#60A5FA" />
      <rect x="144" y="148" width="20" height="36" rx="10" fill="#60A5FA" />
      <defs>
        <linearGradient id="headGrad" x1="48" y1="48" x2="152" y2="140" gradientUnits="userSpaceOnUse">
          <stop stopColor="#60A5FA" />
          <stop offset="1" stopColor="#2563EB" />
        </linearGradient>
        <linearGradient id="headShine" x1="70" y1="48" x2="120" y2="90" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff" stopOpacity="0.35" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="bodyGrad" x1="58" y1="142" x2="142" y2="194" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3B82F6" />
          <stop offset="1" stopColor="#1D4ED8" />
        </linearGradient>
      </defs>
    </svg>
  );
}
