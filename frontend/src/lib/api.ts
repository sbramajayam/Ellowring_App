const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4001/api/v1";

type ApiEnvelope<T> = {
  success?: boolean;
  data?: T;
  message?: string;
  error?: string | { message?: string };
};

export async function api<T = unknown>(
  path: string,
  options: RequestInit & { token?: string | null } = {},
): Promise<T> {
  const { token, headers, ...rest } = options;
  const res = await fetch(`${API_BASE}${path.startsWith("/") ? path : `/${path}`}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    cache: "no-store",
  });
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

export { API_BASE };
