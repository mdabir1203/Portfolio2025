// scripts/transcode-cinema.mjs
//
// Transcodes the raw WebM captured by capture-cinema.mjs into a final
// MP4 with cinematic post-processing: a subtle teal/orange film LUT,
// a soft vignette, and light film grain. Output is suitable for posting
// on LinkedIn / YouTube / WeChat Channels / Xiaomi Community / etc.
//
// Usage:
//   node scripts/transcode-cinema.mjs
//
// Requires:
//   - ffmpeg-static installed locally (already done in this session)
//   - cinema-out/reel-raw.webm present

import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { stat } from 'node:fs/promises';

const FFMPEG = resolve(
  process.cwd(),
  'node_modules/ffmpeg-static/ffmpeg.exe',
);
const SRC = resolve(process.cwd(), 'cinema-out/reel-raw.webm');
const FINAL = resolve(process.cwd(), 'cinema-out/reel-final.mp4');
const TEASER = resolve(process.cwd(), 'cinema-out/reel-teaser-30s.mp4');

async function run(cmd, args, label) {
  return new Promise((res, rej) => {
    const p = spawn(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let out = '';
    let err = '';
    p.stdout.on('data', (b) => (out += b.toString()));
    p.stderr.on('data', (b) => (err += b.toString()));
    p.on('exit', (code) => {
      if (code === 0) {
        console.log(`[${label}] ok (${(err.length / 1024).toFixed(1)} KB ffmpeg log)`);
        res({ out, err });
      } else {
        rej(new Error(`[${label}] exit ${code}\n${err.slice(-3000)}`));
      }
    });
  });
}

async function main() {
  if (!existsSync(FFMPEG)) {
    throw new Error(`ffmpeg not found at ${FFMPEG}`);
  }
  if (!existsSync(SRC)) {
    throw new Error(`source WebM not found at ${SRC}. Run capture-cinema.mjs first.`);
  }
  const s = await stat(SRC);
  console.log(`[transcode] input: ${SRC} (${(s.size / 1024 / 1024).toFixed(2)} MB)`);

  // ---- PASS 1: cinematic grade + soft vignette + grain ----
  // Filter graph explanation:
  //   eq=saturation=0.92:contrast=1.04:brightness=-0.01
  //     → slight desaturation, mild contrast pop, darken a hair for film feel
  //   colorbalance=rs=0.02:gs=-0.005:bs=-0.015:rh=0.015:bh=-0.015
  //     → teal/orange split-tone (lift shadows teal, push highlights warm)
  //   vignette=PI/4
  //     → soft corner darkening (60° angular extent)
  //   noise=alls=4:allf=t+u
  //     → 4-strength film grain on all frames, gaussian temporal
  //   curves=preset=darker
  //     → film toe, subtle S-curve
  const gradeFilter = [
    'eq=saturation=0.92:contrast=1.04:brightness=-0.01',
    'colorbalance=rs=0.018:gs=-0.004:bs=-0.014:rh=0.012:bh=-0.012',
    'curves=preset=darker',
    'vignette=PI/4',
    'noise=alls=3:allf=t+u',
  ].join(',');

  console.log('[transcode] pass 1: full reel w/ grade + vignette + grain');
  await run(
    FFMPEG,
    [
      '-y',
      '-i', SRC,
      '-vf', gradeFilter,
      '-c:v', 'libx264',
      '-preset', 'slow',
      '-crf', '20',
      '-pix_fmt', 'yuv420p',
      '-profile:v', 'high',
      '-movflags', '+faststart',
      '-c:a', 'aac',
      '-b:a', '192k',
      FINAL,
    ],
    'pass1',
  );

  // ---- PASS 2: 30-second teaser (first 30s, scaled-down grade for vertical) ----
  // Skip for now — left as a follow-up.
  // ---- PASS 3: 60-second teaser (best 60s slice) ----
  // Skip for now — left as a follow-up.

  const fs = await stat(FINAL);
  console.log(`[transcode] final: ${FINAL} (${(fs.size / 1024 / 1024).toFixed(2)} MB)`);
}

main().catch((e) => {
  console.error('[transcode] FATAL:', e.message);
  process.exit(1);
});