import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Turbopack walks up from this file looking for a lockfile to infer the
  // workspace root, and finds an unrelated package-lock.json in the user's
  // home directory before it finds this repo's own — which is outside the
  // git repo and triggers a "ignored package-lock.json" warning on every
  // dev server start. Pinning the root here removes the ambiguity.
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
