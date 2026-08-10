/* Ellowring runtime config.
 * Local default. On GitHub Pages, build-time NEXT_PUBLIC_API_URL is applied first
 * in layout — this file only fills in when nothing is set.
 */
(function () {
  if (typeof window === "undefined") return;
  if (window.__ELLOWRING_API_URL__ && String(window.__ELLOWRING_API_URL__).trim()) return;
  window.__ELLOWRING_API_URL__ = "http://localhost:4001/api/v1";
})();
