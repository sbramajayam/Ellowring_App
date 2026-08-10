/* Ellowring runtime config.
 * Always applied last so GitHub Pages deploy can hot-fix the API tunnel
 * without depending only on the previous build-time embed.
 */
(function () {
  if (typeof window === "undefined") return;
  // Local default — overwritten on Pages by workflow-written out/runtime-config.js
  window.__ELLOWRING_API_URL__ = "http://localhost:4001/api/v1";
})();
