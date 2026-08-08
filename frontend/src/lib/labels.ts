/** Safe display label for API fields that may be string | number | `{ name|title }` | nested. */
export function labelOf(value: unknown, fallback = ""): string {
  if (value == null) return fallback;
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (typeof value !== "object") return fallback;
  const obj = value as Record<string, unknown>;
  for (const key of ["name", "title", "label", "code", "slug"]) {
    const v = obj[key];
    if (typeof v === "string" || typeof v === "number") return String(v);
  }
  return fallback;
}

/** Nested path helper: labelOfPath(row, "university.country") */
export function labelOfPath(row: unknown, path: string, fallback = ""): string {
  if (row == null) return fallback;
  const parts = path.split(".");
  let cur: unknown = row;
  for (const part of parts) {
    if (cur == null || typeof cur !== "object") return fallback;
    cur = (cur as Record<string, unknown>)[part];
  }
  return labelOf(cur, fallback);
}

export function moneyOf(value: unknown, fallback = "—"): string {
  if (value == null || value === "") return fallback;
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return fallback;
  return n.toLocaleString("en-IN");
}
