#!/usr/bin/env node
/**
 * Captures the real, live Pack3D pouch — no photographer, no external
 * render pipeline, no Claude Design pass. Playwright drives an actual
 * Chromium browser against /capture/pack3d (a minimal, dedicated route —
 * see that page's own comment) and exports, per flavour:
 *
 *   1. capture-output/video/pack-360-<slug>.mp4 (h264) and .webm (vp9) —
 *      one seamless 15s turn at 30fps. Every frame is set *exactly* by
 *      writing the same `--pack-rotation` custom property Pack3D itself
 *      drives (via the `data-pack-cube` hook), then screenshotted, so the
 *      loop is perfectly even instead of a real-time screen recording that
 *      drops frames. Encoded with the ffmpeg Remotion already ships
 *      (`npx remotion ffmpeg`), which has libx264.
 *
 *   2. capture-output/frames/pack3d/<slug>/frame-NN.png — 36 frames, 10°
 *      apart, for Pack360's `frames` prop.
 *
 * Pack3D's own auto-rotate is paused the same way a prefers-reduced-motion
 * visitor pauses it, so nothing else writes to --pack-rotation meanwhile.
 *
 * Usage:
 *   node scripts/capture-pack-3d.mjs                 # dadi-masala
 *   node scripts/capture-pack-3d.mjs malai-mood ...  # any flavour slugs
 *
 * Starts its own `next dev` if nothing is already listening on PORT
 * (override with CAPTURE_PORT), and shuts it down again when done.
 */

import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "capture-output");
const PORT = process.env.CAPTURE_PORT || 3100;
const BASE_URL = `http://localhost:${PORT}`;

const SLUGS = process.argv.slice(2).length ? process.argv.slice(2) : ["dadi-masala"];
const STILL_COUNT = 36;
// Matches Pack3D's own AUTO_ROTATE_DEG_PER_SEC = 360/15 — one full turn.
const ROTATION_SECONDS = 15;
const FPS = 30;
const VIEWPORT = { width: 1080, height: 1080 };

async function waitForServer(url, timeoutMs = 30_000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      // not up yet
    }
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error(`Timed out waiting for ${url}`);
}

async function isServerRunning() {
  try {
    const res = await fetch(BASE_URL);
    return res.ok;
  } catch {
    return false;
  }
}

async function startDevServer() {
  console.log(`[capture] starting dev server on port ${PORT}...`);
  const proc = spawn("npx", ["next", "dev", "-p", String(PORT)], {
    cwd: ROOT,
    stdio: "pipe",
    detached: false,
  });
  proc.stdout?.on("data", (d) => process.stdout.write(`[next] ${d}`));
  proc.stderr?.on("data", (d) => process.stderr.write(`[next] ${d}`));
  await waitForServer(BASE_URL);
  console.log("[capture] dev server ready.");
  return proc;
}

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const proc = spawn(cmd, args, { cwd: ROOT, stdio: ["ignore", "ignore", "pipe"] });
    let err = "";
    proc.stderr.on("data", (d) => (err += d));
    proc.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} ${args.join(" ")}\n${err}`))));
  });
}

async function openPouch(browser, slug) {
  const context = await browser.newContext({ viewport: VIEWPORT, reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto(`${BASE_URL}/capture/pack3d?flavour=${slug}`);
  // The mesh only exists once Pack3D has measured the stage.
  await page.waitForSelector("[data-pack-cube] > div");
  // Let the panel SVGs decode and paint before the first frame.
  await page.waitForTimeout(1500);
  const shoot = async (deg, file) => {
    await page.evaluate((d) => {
      document.querySelector("[data-pack-cube]")?.style.setProperty("--pack-rotation", `${d}deg`);
    }, deg);
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
    await page.screenshot({ path: file });
  };
  return { context, shoot };
}

async function captureVideo(browser, slug) {
  const videoDir = path.join(OUT_DIR, "video");
  const tmpDir = path.join(OUT_DIR, ".tmp", slug);
  await rm(tmpDir, { recursive: true, force: true });
  await mkdir(tmpDir, { recursive: true });
  await mkdir(videoDir, { recursive: true });

  const total = ROTATION_SECONDS * FPS;
  console.log(`[capture] ${slug}: rendering ${total} frames...`);
  const { context, shoot } = await openPouch(browser, slug);
  // i / total, never reaching 360°, so frame 0 follows the last one seamlessly.
  for (let i = 0; i < total; i++) {
    await shoot((i * 360) / total, path.join(tmpDir, `f-${String(i).padStart(4, "0")}.png`));
  }
  await context.close();

  const input = ["-y", "-framerate", String(FPS), "-i", path.join(tmpDir, "f-%04d.png")];
  const base = path.join(videoDir, `pack-360-${slug}`);
  console.log(`[capture] ${slug}: encoding mp4 + webm...`);
  await run("npx", ["remotion", "ffmpeg", ...input, "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "18", "-movflags", "+faststart", `${base}.mp4`]);
  await run("npx", ["remotion", "ffmpeg", ...input, "-c:v", "libvpx-vp9", "-crf", "30", "-b:v", "0", "-pix_fmt", "yuv420p", `${base}.webm`]);
  await rm(path.join(OUT_DIR, ".tmp"), { recursive: true, force: true });
  console.log(`[capture] ${slug}: saved ${base}.mp4 / .webm`);
}

async function captureStills(browser, slug) {
  const framesDir = path.join(OUT_DIR, "frames", "pack3d", slug);
  await mkdir(framesDir, { recursive: true });
  console.log(`[capture] ${slug}: ${STILL_COUNT} stills...`);
  const { context, shoot } = await openPouch(browser, slug);
  for (let i = 0; i < STILL_COUNT; i++) {
    await shoot(i * (360 / STILL_COUNT), path.join(framesDir, `frame-${String(i).padStart(2, "0")}.png`));
  }
  await context.close();
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  let devServer = null;
  if (!(await isServerRunning())) {
    devServer = await startDevServer();
  } else {
    console.log(`[capture] reusing dev server already running on ${BASE_URL}`);
  }

  try {
    const browser = await chromium.launch();
    try {
      for (const slug of SLUGS) {
        await captureVideo(browser, slug);
        await captureStills(browser, slug);
      }
    } finally {
      await browser.close();
    }
  } finally {
    if (devServer) {
      console.log("[capture] stopping dev server...");
      devServer.kill();
    }
  }

  console.log(`[capture] done — see ${OUT_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
