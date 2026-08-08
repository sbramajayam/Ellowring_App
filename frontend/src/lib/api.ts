const FALLBACK_API = "http://localhost:4001/api/v1";

/** Runtime override (public/runtime-config.js) wins over build-time env. */
export function getApiBase(): string {
  if (typeof window !== "undefined") {
    const runtime = (window as Window & { __ELLOWRING_API_URL__?: string })
      .__ELLOWRING_API_URL__;
    if (runtime && typeof runtime === "string" && runtime.trim()) {
      return runtime.replace(/\/$/, "");
    }
  }
  return (process.env.NEXT_PUBLIC_API_URL || FALLBACK_API).replace(/\/$/, "");
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
        `Cannot reach API at ${base}. Keep the local backend + Cloudflare tunnel running, then hard-refresh.`,
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
