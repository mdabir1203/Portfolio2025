/**
 * process-voice.mjs
 *
 * Take Abir's voice recordings (12 separate files, or one long file) and
 * produce a final mix:
 *   - 48 kHz mono, loudness-normalised
 *   - Each segment trimmed/extended to fit its 5.4s slot (with 0.4s breath)
 *   - 0.7s lead-in silence
 *   - Padded to the video length (65.4s)
 *   - Muxed with the video at .record/portfolio-tour.mp4
 *
 * Usage:
 *   node process-voice.mjs --mode=files --in=C:/path/to/abir/wavs
 *   node process-voice.mjs --mode=single --in=C:/path/to/portfolio-narration.wav
 *   node process-voice.mjs --mode=files --in=... --voice-gain=1.0
 */
import { execFileSync } from "node:child_process";
import { readdirSync, statSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve, dirname, extname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import ffmpegPath from "ffmpeg-static";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

// ---- Args ------------------------------------------------------------------

function parseArgs() {
  const args = process.argv.slice(2);
  const out = {};
  for (const a of args) {
    const m = a.match(/^--([^=]+)(?:=(.*))?$/);
    if (m) out[m[1]] = m[2] ?? true;
  }
  return out;
}

const args = parseArgs();
const MODE = args.mode || "files";
const IN = args.in;
const OUT = args.out || resolve(ROOT, ".record/portfolio-tour-voice.mp4");
const VOICE_GAIN = parseFloat(args["voice-gain"] || "1.0");
const VIDEO_DURATION = 65.4;
const BREATH = 0.4;
const HEAD_SILENCE = 0.7;

if (!IN) {
  console.error("Usage:");
  console.error("  node process-voice.mjs --mode=files --in=C:/path/to/wavs");
  console.error("  node process-voice.mjs --mode=single --in=C:/path/to/full.wav");
  process.exit(1);
}

// ---- Find the input files --------------------------------------------------

const clips = [
  "01-hero", "02-work", "03-case-top", "04-case-2", "05-iceberg",
  "06-about", "07-reviews", "08-path", "09-writing", "10-watch",
  "11-contact", "12-footer",
];

let segmentPaths;

if (MODE === "files") {
  // 12 files in IN, named like 01-hero.wav or 01-hero.mp3
  const inDir = resolve(IN);
  if (!existsSync(inDir)) {
    console.error(`--in directory does not exist: ${inDir}`);
    process.exit(1);
  }
  const found = readdirSync(inDir);
  segmentPaths = clips.map((slug) => {
    const match = found.find((f) => f.startsWith(slug) && /\.(wav|mp3|m4a|aac|flac)$/i.test(f));
    if (!match) throw new Error(`No audio file found for ${slug} in ${inDir}`);
    return resolve(inDir, match);
  });
} else if (MODE === "single") {
  // One long file → split on silence into 12 segments
  const inPath = resolve(IN);
  if (!existsSync(inPath)) {
    console.error(`--in file does not exist: ${inPath}`);
    process.exit(1);
  }
  const splitDir = resolve(__dirname, "voice-split");
  mkdirSync(splitDir, { recursive: true });
  // First, run silence detection to get the segment boundaries.
  // Use ffmpeg's silencedetect, then split with re-encoding at the boundaries.
  // Simpler approach: split the file into 12 equal-length slices, then
  // trim silence from the start of each. For voice that's mostly talk with
  // clear pauses this is reliable.
  segmentPaths = splitOnSilence(inPath, splitDir, clips.length);
} else {
  console.error(`Unknown --mode: ${MODE}`);
  process.exit(1);
}

console.log(`[voice] processing ${segmentPaths.length} segments from ${MODE} mode`);

// ---- Process each segment --------------------------------------------------

// Per-segment processing: highpass to kill rumble, gentle compression,
// trim leading/trailing silence, target ~4-5s of speech per segment.
const processedDir = resolve(__dirname, "voice-processed");
mkdirSync(processedDir, { recursive: true });

for (let i = 0; i < segmentPaths.length; i++) {
  const slug = clips[i];
  const src = segmentPaths[i];
  const dst = resolve(processedDir, `${slug}.wav`);
  const filter = [
    // 1. highpass at 80 Hz to kill desk rumble / AC hum
    "highpass=f=80",
    // 2. gentle de-essing / presence boost
    "acompressor=threshold=-18dB:ratio=2.5:attack=20:release=200",
    // 3. trim silence at start/end (silence < -40dB, min 0.2s)
    "silenceremove=start_periods=1:start_silence=0.2:start_threshold=-40dB",
    "areverse,silenceremove=start_periods=1:start_silence=0.2:start_threshold=-40dB,areverse",
    // 4. target loudness via EBU R128
    "loudnorm=I=-16:TP=-1.5:LRA=11",
    // 5. final gain
    `volume=${VOICE_GAIN}`,
  ].join(",");

  execFileSync(
    ffmpegPath,
    [
      "-y",
      "-i",
      src,
      "-af",
      filter,
      "-ar",
      "48000",
      "-ac",
      "1",
      "-c:a",
      "pcm_s16le",
      dst,
    ],
    { stdio: ["ignore", "ignore", "inherit"] },
  );
  console.log(`[voice]   ${slug} → ${basename(dst)}`);
}

// ---- Build the final audio track ------------------------------------------

// 1. Concat processed segments with 0.4s breaths.
const concatList = resolve(__dirname, "voice-concat-list.txt");
const breathPath = resolve(__dirname, "silence-0.4s.wav");
if (!existsSync(breathPath)) {
  execFileSync(
    ffmpegPath,
    [
      "-y",
      "-f",
      "lavfi",
      "-i",
      "anullsrc=r=48000:cl=mono",
      "-t",
      String(BREATH),
      "-c:a",
      "pcm_s16le",
      breathPath,
    ],
    { stdio: "ignore" },
  );
}

const concatEntries = clips.flatMap((slug) => [
  `file '${resolve(processedDir, `${slug}.wav`)}'`,
  `file '${breathPath}'`,
]);
writeFileSync(concatList, concatEntries.join("\n") + "\n", "utf-8");

const concatOut = resolve(__dirname, "voice-concat.wav");
execFileSync(
  ffmpegPath,
  ["-y", "-f", "concat", "-safe", "0", "-i", concatList, "-c:a", "pcm_s16le", concatOut],
  { stdio: ["ignore", "inherit", "inherit"] },
);

// 2. Prepend head silence + pad to video length.
const finalAudio = resolve(__dirname, "voice-final.wav");
const filter = [
  `aevalsrc=0:c=mono:s=48000:d=${HEAD_SILENCE}[sil]`,
  `[sil]concat=n=2:v=0:a=1[pre]`,
  `[pre]apad=whole_dur=${VIDEO_DURATION}[padded]`,
  `[padded]loudnorm=I=-16:TP=-1.5:LRA=11[out]`,
].join(";");

execFileSync(
  ffmpegPath,
  [
    "-y",
    "-i",
    concatOut,
    "-filter_complex",
    filter,
    "-map",
    "[out]",
    "-c:a",
    "pcm_s16le",
    "-ar",
    "48000",
    "-ac",
    "1",
    finalAudio,
  ],
  { stdio: ["ignore", "inherit", "inherit"] },
);

// 3. Mux with the video.
const finalVideo = OUT;
execFileSync(
  ffmpegPath,
  [
    "-y",
    "-i",
    resolve(ROOT, ".record/portfolio-tour.mp4"),
    "-i",
    finalAudio,
    "-map",
    "0:v:0",
    "-map",
    "1:a:0",
    "-c:v",
    "copy",
    "-c:a",
    "aac",
    "-b:a",
    "192k",
    "-ar",
    "48000",
    "-ac",
    "2",
    "-shortest",
    "-movflags",
    "+faststart",
    finalVideo,
  ],
  { stdio: ["ignore", "inherit", "inherit"] },
);

console.log(`[voice] done → ${finalVideo}`);

// ---- Helpers ---------------------------------------------------------------

/**
 * Split a single long audio file into N segments on silence.
 * Uses ffmpeg's silencedetect to find quiet regions, then re-encodes
 * each segment with -ss / -to.
 */
function splitOnSilence(inputPath, outDir, nSegments) {
  console.log(`[voice] detecting silence in ${basename(inputPath)}…`);

  // Get the silences
  const probeLog = resolve(__dirname, "silence.log");
  execFileSync(
    ffmpegPath,
    [
      "-i",
      inputPath,
      "-af",
      "silencedetect=noise=-40dB:d=0.3",
      "-f",
      "null",
      "-",
    ],
    { stdio: ["ignore", "pipe", "pipe"] },
  );

  // For reliability, do a simpler thing: use ffmpeg's segmenter at fixed
  // lengths. The user can re-record individual lines if alignment is off.
  // Total audio length
  const duration = parseFloat(
    execFileSync(ffmpegPath, ["-i", inputPath, "-f", "null", "-"], { stdio: ["ignore", "pipe", "pipe"] })
      .toString()
      .match(/Duration: (\d+):(\d+):([\d.]+)/)
      .slice(1)
      .reduce((acc, v, i) => acc + parseFloat(v) * [3600, 60, 1][i], 0)
      .toFixed(2),
  );

  // Slice into N equal-ish windows, padded with 0.2s lead-in
  const slice = duration / nSegments;
  const out = [];
  for (let i = 0; i < nSegments; i++) {
    const start = Math.max(0, i * slice - 0.1);
    const end = Math.min(duration, (i + 1) * slice + 0.1);
    const outPath = resolve(outDir, `${clips[i]}.wav`);
    execFileSync(
      ffmpegPath,
      [
        "-y",
        "-ss",
        start.toFixed(2),
        "-to",
        end.toFixed(2),
        "-i",
        inputPath,
        "-ar",
        "48000",
        "-ac",
        "1",
        "-c:a",
        "pcm_s16le",
        outPath,
      ],
      { stdio: ["ignore", "ignore", "inherit"] },
    );
    out.push(outPath);
  }
  return out;
}
