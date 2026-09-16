#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// scripts/deploy.mjs — streamlined Cloudflare Pages deploy
// ─────────────────────────────────────────────────────────────────────────────
//
// What this does:
//   1. Loads .env (if present) using Node 20.6+ built-in loader — no dotenv
//      dep needed.
//   2. Validates CLOUDFLARE_API_TOKEN + CLOUDFLARE_ACCOUNT_ID are set.
//   3. Optionally runs the production build (vite build + post-fixes).
//   4. Verifies dist/client/_worker.js + dist/client/server.js + wrangler.json
//      exist before talking to Cloudflare.
//   5. Wraps `wrangler pages deploy` with the API token + account id.
//
// Usage:
//   npm run deploy                # production deploy (after running build)
//   npm run deploy:build          # build + production deploy
//   npm run deploy:preview        # preview branch deploy (no build)
//   npm run deploy:check          # auth + config validation only
//
// Env vars required (see .env.example):
//   CLOUDFLARE_API_TOKEN  — Pages:Edit scoped API token
//   CLOUDFLARE_ACCOUNT_ID — 32-char Cloudflare account id
//   CLOUDFLARE_PROJECT_NAME (optional, defaults to portfolio2025)
// ─────────────────────────────────────────────────────────────────────────────

import { spawn } from "node:child_process";
import { existsSync, statSync } from "node:fs";
import { resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

// ── Load .env if present (Node 20.6+) ───────────────────────────────────────
const projectRoot = resolve(fileURLToPath(import.meta.url), "..", "..");
const envPath = join(projectRoot, ".env");
if (existsSync(envPath)) {
  try {
    // Node 22+ supports this natively. Older runtimes will throw and we fall
    // back to no-op (the user can `node --env-file=.env ...` themselves).
    process.loadEnvFile(envPath);
    console.log(`[deploy] loaded env from ${envPath}`);
  } catch (err) {
    // Silent — the user may have already set vars in their shell.
  }
}

// ── Args & mode ─────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const mode = argv[0] === "preview"
  ? "preview"
  : argv[0] === "check"
  ? "check"
  : argv[0] === "build"
  ? "build"
  : "production";

const PROJECT_NAME = process.env.CLOUDFLARE_PROJECT_NAME || "portfolio2025";
const DIST_DIR = join(projectRoot, "dist", "client");

// ── Pre-flight: required vars ───────────────────────────────────────────────
function requireEnv(names) {
  const missing = names.filter((n) => !process.env[n] || process.env[n].startsWith("replace-me"));
  if (missing.length) {
    console.error(`[deploy] missing or placeholder env vars: ${missing.join(", ")}`);
    console.error(`[deploy] copy .env.example to .env and fill them in.`);
    console.error(`[deploy] find them: Cloudflare dashboard → My Profile → API Tokens`);
    process.exit(2);
  }
}

// ── Pre-flight: build output ────────────────────────────────────────────────
function assertBuildArtifacts() {
  const required = [
    join(DIST_DIR, "_worker.js"),
    join(DIST_DIR, "server.js"),
    join(DIST_DIR, "wrangler.json"),
  ];
  const missing = required.filter((p) => !existsSync(p));
  if (missing.length) {
    console.error(`[deploy] build artifacts missing in dist/client/:`);
    for (const m of missing) console.error(`  - ${m}`);
    console.error(`[deploy] run \`npm run build\` first (or use \`npm run deploy:build\`).`);
    process.exit(3);
  }
  const workerSize = statSync(join(DIST_DIR, "_worker.js")).size;
  const serverSize = statSync(join(DIST_DIR, "server.js")).size;
  console.log(`[deploy] build artifacts OK`);
  console.log(`         _worker.js: ${(workerSize / 1024).toFixed(1)} KB`);
  console.log(`         server.js:  ${(serverSize / 1024).toFixed(1)} KB`);
}

// ── Run a child command, streaming output ───────────────────────────────────
function run(cmd, args, env = {}) {
  return new Promise((resolveP, rejectP) => {
    const proc = spawn(cmd, args, {
      cwd: projectRoot,
      stdio: "inherit",
      env: { ...process.env, ...env },
      shell: process.platform === "win32", // .cmd shim on Windows
    });
    proc.on("exit", (code) => {
      if (code === 0) resolveP();
      else rejectP(new Error(`${cmd} ${args.join(" ")} exited ${code}`));
    });
    proc.on("error", rejectP);
  });
}

async function runProductionBuild() {
  console.log(`[deploy] running production build…`);
  await run("npm.cmd", ["run", "build"]);
}

// ── Modes ───────────────────────────────────────────────────────────────────
async function checkMode() {
  requireEnv(["CLOUDFLARE_API_TOKEN", "CLOUDFLARE_ACCOUNT_ID"]);
  console.log(`[deploy] check mode — verifying auth + wrangler can talk to Cloudflare…`);
  try {
    await run(
      "npx.cmd",
      ["wrangler", "whoami"],
      {
        CLOUDFLARE_API_TOKEN: process.env.CLOUDFLARE_API_TOKEN,
        CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID,
      }
    );
    console.log(`[deploy] check PASS — token is valid, account is reachable.`);
  } catch {
    console.error(`[deploy] check FAIL — wrangler whoami exited non-zero.`);
    process.exit(1);
  }
}

async function productionMode() {
  requireEnv(["CLOUDFLARE_API_TOKEN", "CLOUDFLARE_ACCOUNT_ID"]);
  assertBuildArtifacts();
  console.log(`[deploy] deploying PRODUCTION → ${PROJECT_NAME}`);
  await run(
    "npx.cmd",
    [
      "wrangler",
      "pages",
      "deploy",
      DIST_DIR,
      "--project-name", PROJECT_NAME,
      "--branch", "main",
      "--commit-dirty=true",
    ],
    {
      CLOUDFLARE_API_TOKEN: process.env.CLOUDFLARE_API_TOKEN,
      CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID,
    }
  );
}

async function previewMode() {
  requireEnv(["CLOUDFLARE_API_TOKEN", "CLOUDFLARE_ACCOUNT_ID"]);
  assertBuildArtifacts();
  const branch = process.env.CLOUDFLARE_BRANCH || `preview-${Date.now().toString(36)}`;
  console.log(`[deploy] deploying PREVIEW branch → ${branch}`);
  await run(
    "npx.cmd",
    [
      "wrangler",
      "pages",
      "deploy",
      DIST_DIR,
      "--project-name", PROJECT_NAME,
      "--branch", branch,
    ],
    {
      CLOUDFLARE_API_TOKEN: process.env.CLOUDFLARE_API_TOKEN,
      CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID,
    }
  );
  console.log(`[deploy] preview URL: https://${branch}.${PROJECT_NAME}.pages.dev`);
}

async function buildMode() {
  requireEnv(["CLOUDFLARE_API_TOKEN", "CLOUDFLARE_ACCOUNT_ID"]);
  await runProductionBuild();
  assertBuildArtifacts();
  console.log(`[deploy] deploying PRODUCTION → ${PROJECT_NAME}`);
  await run(
    "npx.cmd",
    [
      "wrangler",
      "pages",
      "deploy",
      DIST_DIR,
      "--project-name", PROJECT_NAME,
      "--branch", "main",
      "--commit-dirty=true",
    ],
    {
      CLOUDFLARE_API_TOKEN: process.env.CLOUDFLARE_API_TOKEN,
      CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID,
    }
  );
}

// ── Dispatch ────────────────────────────────────────────────────────────────
(async () => {
  try {
    switch (mode) {
      case "check":
        await checkMode();
        break;
      case "production":
        await productionMode();
        break;
      case "preview":
        await previewMode();
        break;
      case "build":
        await buildMode();
        break;
      default:
        console.error(`[deploy] unknown mode: ${mode}`);
        process.exit(2);
    }
  } catch (err) {
    console.error(`[deploy] ${err.message}`);
    process.exit(1);
  }
})();
