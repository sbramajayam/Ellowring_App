/** Local Ellowring marketing website (EWebsite / Vite). Override for deployed site. */
export const WEBSITE_URL = (
  process.env.NEXT_PUBLIC_OLD_WEBSITE_URL || "http://localhost:5173"
).replace(/\/$/, "");

/** After app logout, open the website home (not /login). */
export function goToWebsiteHome() {
  if (typeof window === "undefined") return;
  window.location.replace(`${WEBSITE_URL}/`);
}
