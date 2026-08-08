import type { NextConfig } from "next";

const repoName = "Ellowring_App";
const isGhPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  // EWebsite Apply/Login opens http://127.0.0.1:3000 — allow chunk loads in dev
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  // Avoid picking monorepo root (static export folders) as Turbopack root
  turbopack: {
    root: __dirname,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: isGhPages ? `/${repoName}` : "",
  },
  // GitHub project pages: https://sbramajayam.github.io/Ellowring_App/
  ...(isGhPages
    ? {
        basePath: `/${repoName}`,
        assetPrefix: `/${repoName}/`,
      }
    : {}),
};

export default nextConfig;
