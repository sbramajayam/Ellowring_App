const FALLBACK_API = "http://localhost:4001/api/v1";

/** Dead quick-tunnel hosts that still appear in stale GitHub Pages caches */
const DEAD_API_HOSTS = ["wheels-fossil-surge-elimination.trycloudflare.com"];

/** Current public demo API (Cloudflare quick tunnel → local Nest on :4001) */
const LIVE_PAGES_API = "https://metallica-for-dual-bubble.trycloudflare.com/api/v1";

function sanitizeApiBase(raw: string): string {
  const base = raw.replace(/\/$/, "");
  if (DEAD_API_HOSTS.some((h) => base.includes(h))) {
    return LIVE_PAGES_API;
  }
  return base;
}

/** Runtime override (public/runtime-config.js) wins over build-time env. */
export function getApiBase(): string {
  if (typeof window !== "undefined") {
    const runtime = (window as Window & { __ELLOWRING_API_URL__?: string })
      .__ELLOWRING_API_URL__;
    if (runtime && typeof runtime === "string" && runtime.trim()) {
      return sanitizeApiBase(runtime.trim());
    }
  }
  return sanitizeApiBase(process.env.NEXT_PUBLIC_API_URL || FALLBACK_API);
}

type ApiEnvelope<T> = {
  success?: boolean;
  data?: T;
  message?: string;
  error?: string | { message?: string };
};

export async function checkApiHealth(): Promise<{
  ok: boolean;
  base: string;
  detail: string;
}> {
  const base = getApiBase();
  try {
    const res = await fetch(`${base}/health`, {
      method: "GET",
      cache: "no-store",
      mode: "cors",
    });
    if (!res.ok) {
      return { ok: false, base, detail: `Health returned HTTP ${res.status}` };
    }
    return { ok: true, base, detail: "API reachable" };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Network error";
    return {
      ok: false,
      base,
      detail:
        msg === "Failed to fetch"
          ? `Cannot reach API (${base}). Backend or tunnel is down / blocked by the browser.`
          : msg,
    };
  }
}

export async function api<T = unknown>(
  path: string,
  options: RequestInit & { token?: string | null } = {},
): Promise<T> {
  const { token, headers, ...rest } = options;
  const base = getApiBase();
  const url = `${base}${path.startsWith("/") ? path : `/${path}`}`;

  let res: Response;
  try {
    res = await fetch(url, {
      ...rest,
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      cache: "no-store",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Network error";
    if (msg === "Failed to fetch") {
      throw new Error(
        `Cannot reach API at ${base}. Start the backend (npm run dev:api) and hard-refresh this page.`,
      );
    }
    throw err instanceof Error ? err : new Error(String(err));
  }

  const json = (await res.json().catch(() => ({}))) as ApiEnvelope<T> & T;
  if (!res.ok) {
    const msg =
      (typeof json.error === "object" && json.error?.message) ||
      (typeof json.error === "string" ? json.error : undefined) ||
      json.message ||
      "Request failed";
    throw new Error(msg);
  }
  if (
    json &&
    typeof json === "object" &&
    "success" in json &&
    (json as ApiEnvelope<T>).success === true &&
    "data" in json
  ) {
    return (json as ApiEnvelope<T>).data as T;
  }
  return json as T;
}

export { getApiBase as API_BASE_FN };
/** @deprecated use getApiBase() — kept for older imports */
export const API_BASE = process.env.NEXT_PUBLIC_API_URL || FALLBACK_API;
