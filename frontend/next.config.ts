import type { NextConfig } from "next";

const repoName = "Ell-web-app";
const isGhPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  // GitHub project pages: https://sbramajayam.github.io/Ell-web-app/
  ...(isGhPages
    ? {
        basePath: `/${repoName}`,
        assetPrefix: `/${repoName}/`,
      }
    : {}),
};

export default nextConfig;
