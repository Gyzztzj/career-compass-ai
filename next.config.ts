import type { NextConfig } from "next";

/**
 * 配置Next.js应用
 */
const isElectronBuild = process.env.NEXT_OUTPUT === "export";

const nextConfig: NextConfig = {
  reactCompiler: true,
  ...(isElectronBuild && {
    output: "export",
    distDir: "export",
    assetPrefix: "./",
    images: {
      unoptimized: true,
    },
  }),
};

export default nextConfig;
