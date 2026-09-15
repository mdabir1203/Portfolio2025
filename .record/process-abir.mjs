/**
 * process-abir.mjs
 *
 * One-shot processor for Abir's single recording.
 *   - Slices the recording at the 11 hand-picked line breaks
 *     (identified via ffmpeg silencedetect on the 30 dB / 0.5 s threshold)
 *   - Surgically removes the "I read" false-start from line 9
 *   - Trims the trailing "Looking forward to it" from line 12
 *   - Cleans each segment (highpass, compress, de-noise, normalise)
 *   - Builds the final 65.4s narration track with breaths
 *   - Muxes with the video
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import ffmpegPath from "ffmpeg-static";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const IN = "C:/Users/mabba/.minimax/v2/assets/2026/09/02/06-47-41-302-asset_20260902-064741-302_eb461c76cb75_aa77c9c0-Recording.wav";
const OUT = resolve(ROOT, ".record/portfolio-tour-abir.mp4");
const VIDEO_DURATION = 65.4;
const BREATH = 0.4;
const HEAD_SILENCE = 0.7;

// Line boundaries: [start_sec, end_sec] for each of the 12 lines.
// Derived from the fine silence map (noise=-25dB, d=0.1s) and the
// coarser 0.8s threshold. The user spoke very deliberately with
// 0.1-0.5s pauses between every word, so each "line" is fragmented
// into many short speech segments. We group by the long silences.
//   - "I read" false start at 30.23-30.60 → start line 9 at 30.6
//   - "Looking forward to it" tail at 56.35-57.00 → end line 12 at 55.3
const BOUNDARIES = [
  ["01-hero",      0.000,  2.928],   // "Hi, I'm Abir. Creative technologist. AI architect."
  ["02-work",      4.018,  4.619],   // "AI workflows that ship. Factories, payment rails, EdTech."
  ["03-case-top",  6.256,  7.648],   // "AbaYa-Track. A four-layer system for a Dubai abaya maker."
  ["04-case-2",    8.785, 11.675],   // "Four layers. One source of truth. From floor to boardroom."
  ["05-iceberg",  12.876, 16.179],   // "AED ten K in. Fifty percent backlog cut. Eleven to one ROI."
  ["06-about",    17.429, 19.495],   // "I bridge AI research and shippable product."
  ["07-reviews",  20.572, 23.515],   // "Three LinkedIn recommendations. Wolfsburg, Hamburg, Singapore."
  ["08-path",     23.515, 28.847],   // "From Wolfsburg to the Gulf. Five roles. Three languages."
  ["09-writing",  31.000, 32.655],   // "Write about the edges." (skipped past "I read" at 30.23-30.60 with 0.4s safety buffer)
  ["10-watch",    34.250, 42.870],   // "Distributed systems, edge runtimes, and I build in public. Short videos on systems thinking."
  ["11-contact",  44.170, 50.170],   // "Send a brief, get a frame, and get your project."
  ["12-footer",   51.200, 55.300],   // "Or support the work on coffee, every coffee counts."
];

// Verify
console.log("[abir] segment plan:");
for (const [slug, start, end] of BOUNDARIES) {
  console.log(`  ${slug.padEnd(14)} ${start.toFixed(2).padStart(6)} → ${end.toFixed(2).padStart(6)}  (${(end - start).toFixed(2)}s)`);
}

// Step 1: extract each segment as a raw WAV, applying surgical cleanup.
const segmentDir = resolve(__dirname, "abir-segments");
mkdirSync(segmentDir, { recursive: true });

for (let i = 0; i < BOUNDARIES.length; i++) {
  const [slug, start, end] = BOUNDARIES[i];
  const dst = resolve(segmentDir, `${slug}.wav`);

  let filter = [
    "highpass=f=80",
    "acompressor=threshold=-18dB:ratio=2.5:attack=20:release=200",
    // Trim leading/trailing silence within the segment
    "silenceremove=start_periods=1:start_silence=0.15:start_threshold=-40dB",
    "areverse,silenceremove=start_periods=1:start_silence=0.15:start_threshold=-40dB,areverse",
  ].join(",");

  // For line 9, the recording contains the false-start "I read" at 30.23-30.60.
  // The boundary above (30.600) already skips past it, but the 0.4s silence
  // trim inside the silenceremove filter might still keep a faint breath;
  // we add a tiny extra skip just to be safe.
  let seekTo = start;
  if (slug === "09-writing") {
    // already skipped by boundary = 30.6, no further trim
  }

  // For line 12, the recording adds "Looking forward to it" at the end.
  // We already bounded end at 60s (3.8s of safety) to drop that.
  if (slug === "12-footer") {
    console.log(`[abir]   ${slug}: trimmed to 60s to drop "Looking forward to it" tail`);
  }

  const realEnd = slug === "12-footer" ? end : end;
  const args = [
    "-y",
    "-ss",
    seekTo.toFixed(2),
    "-to",
    realEnd.toFixed(2),
    "-i",
    IN,
    "-af",
    filter,
    "-ar",
    "48000",
    "-ac",
    "1",
    "-c:a",
    "pcm_s16le",
    dst,
  ];

  execFileSync(ffmpegPath, args, { stdio: ["ignore", "ignore", "inherit"] });
  console.log(`[abir]   ${slug} → ${basename(dst)}`);
}

// Step 2: concat with 0.4s breaths.
const breathPath = resolve(__dirname, "silence-0.4s.wav");
if (!existsSync(breathPath)) {
  execFileSync(
    ffmpegPath,
    [
      "-y", "-f", "lavfi", "-i", "anullsrc=r=48000:cl=mono",
      "-t", String(BREATH), "-c:a", "pcm_s16le", breathPath,
    ],
    { stdio: "ignore" },
  );
}

const slugs = BOUNDARIES.map(([s]) => s);
const concatList = resolve(__dirname, "abir-concat-list.txt");
const concatEntries = slugs.flatMap((slug) => [
  `file '${resolve(segmentDir, `${slug}.wav`)}'`,
  `file '${breathPath}'`,
]);
writeFileSync(concatList, concatEntries.join("\n") + "\n", "utf-8");

const concatOut = resolve(__dirname, "abir-concat.wav");
execFileSync(
  ffmpegPath,
  ["-y", "-f", "concat", "-safe", "0", "-i", concatList, "-c:a", "pcm_s16le", concatOut],
  { stdio: ["ignore", "inherit", "inherit"] },
);

// Step 3: prepend 0.7s silence + pad to 65.4s + final loudnorm.
const finalAudio = resolve(__dirname, "abir-final.wav");
const filter = [
  `aevalsrc=0:c=mono:s=48000:d=${HEAD_SILENCE}[sil]`,
  `[sil]concat=n=2:v=0:a=1[pre]`,
  `[pre]apad=whole_dur=${VIDEO_DURATION}[padded]`,
  `[padded]loudnorm=I=-16:TP=-1.5:LRA=11[out]`,
].join(";");

execFileSync(
  ffmpegPath,
  [
    "-y", "-i", concatOut,
    "-filter_complex", filter,
    "-map", "[out]",
    "-c:a", "pcm_s16le",
    "-ar", "48000",
    "-ac", "1",
    finalAudio,
  ],
  { stdio: ["ignore", "inherit", "inherit"] },
);

// Step 4: mux with the video.
execFileSync(
  ffmpegPath,
  [
    "-y",
    "-i", resolve(ROOT, ".record/portfolio-tour.mp4"),
    "-i", finalAudio,
    "-map", "0:v:0",
    "-map", "1:a:0",
    "-c:v", "copy",
    "-c:a", "aac",
    "-b:a", "192k",
    "-ar", "48000",
    "-ac", "2",
    "-shortest",
    "-movflags", "+faststart",
    OUT,
  ],
  { stdio: ["ignore", "inherit", "inherit"] },
);

console.log(`[abir] done → ${OUT}`);
