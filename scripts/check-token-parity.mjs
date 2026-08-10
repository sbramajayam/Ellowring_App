/**
 * FR-TOK-001 — Token parity check (Phase 6 §19 / §26)
 * Fails if design-tokens.ts values are missing from globals.css.
 *
 * Run: node scripts/check-token-parity.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cssPath = path.join(root, "frontend/src/app/globals.css");
const css = fs.readFileSync(cssPath, "utf8").toLowerCase();

const checks = [
  ["color.primary.600", "#2563eb"],
  ["color.primary.700", "#1d4ed8"],
  ["color.navy.950", "#0b1f3a"],
  ["color.secondary.red.500", "#ef4444"],
  ["color.secondary.yellow.500", "#f59e0b"],
  ["color.secondary.green.500", "#22c55e"],
  ["color.secondary.sky.500", "#0ea5e9"],
  ["color.secondary.purple.500", "#8b5cf6"],
  ["radius.md", "12px"],
  ["radius.xl", "24px"],
  ["spacing.6", "24px"],
  ["spacing.24", "96px"],
  ["shadow.focus", "rgba(37, 99, 235, 0.35)"],
  ["duration.base", "180ms"],
  ["ease.spring", "cubic-bezier(0.34, 1.56, 0.64, 1)"],
  ["font.plus-jakarta alias", "--font-plus-jakarta"],
  ["data-theme dark", '[data-theme="dark"]'],
];

let failed = 0;
for (const [name, value] of checks) {
  if (!css.includes(value.toLowerCase())) {
    console.error(`✗ Token mismatch: ${name} (${value}) not found in globals.css`);
    failed += 1;
  } else {
    console.log(`✓ ${name}`);
  }
}

if (failed > 0) {
  console.error(`\n${failed} token parity check(s) failed.`);
  process.exit(1);
}

console.log("\nAll token parity checks passed.");
