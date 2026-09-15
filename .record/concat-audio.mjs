/**
 * Build the final narration track:
 *  - concat 12 narrated segments with a 0.4s breath between each
 *    (matches the 0.6s visual crossfade; the breath gives the listener time)
 *  - add 0.7s leading silence (matches the 1.5s head fade-in's start of speech)
 *  - pad the end to the exact video duration (65.4s)
 *  - normalise loudness with the loudnorm filter
 *  - export as AAC
 */
import { execFileSync } from "node:child_process";
import { writeFileSync, readFileSync, existsSync, unlinkSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import ffmpegPath from "ffmpeg-static";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const clips = [
  "01-hero", "02-work", "03-case-top", "04-case-2", "05-iceberg",
  "06-about", "07-reviews", "08-path", "09-writing", "10-watch",
  "11-contact", "12-footer",
];

const VIDEO_DURATION = 65.4;
const BREATH = 0.4;       // pause between segments
const HEAD_SILENCE = 0.7; // silence at the very start

// Build a concat demuxer list with absolute paths.
const listPath = resolve(__dirname, "audio-list.txt");
writeFileSync(
  listPath,
  clips
    .flatMap((c) => [
      `file '${resolve(ROOT, `.record/narration/${c}.mp3`)}'`,
      `file '${resolve(__dirname, "silence-0.4s.wav")}'`,
    ])
    .join("\n") + "\n",
  "utf-8",
);

// Generate the silence WAV via ffmpeg (48000 Hz mono is what the video expects).
const silencePath = resolve(__dirname, "silence-0.4s.wav");
if (!existsSync(silencePath)) {
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
      silencePath,
    ],
    { stdio: "inherit" },
  );
}

// Concat all narrations + breaths in one ffmpeg pass.
// Then prepend head silence and pad to video length.
const concatOut = resolve(__dirname, "narration-concat.wav");
execFileSync(
  ffmpegPath,
  [
    "-y",
    "-f",
    "concat",
    "-safe",
    "0",
    "-i",
    listPath,
    "-c:a",
    "pcm_s16le",
    concatOut,
  ],
  { stdio: "inherit" },
);

// Now: prepend 0.7s of silence, then pad to VIDEO_DURATION, then loudnorm.
const finalAudio = resolve(ROOT, ".record/portfolio-tour-audio.wav");
const filter = [
  // Add 0.7s at the start
  `aevalsrc=0:c=mono:s=48000:d=${HEAD_SILENCE}[silence]`,
  `[silence]concat=n=2:v=0:a=1[pre]`,
  // Pad to the video length
  `[pre]apad=whole_dur=${VIDEO_DURATION}[padded]`,
  // Loudness normalisation (EBU R128) — keeps the voice consistent across segments
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
  { stdio: "inherit" },
);

console.log("[audio] narration track built:", finalAudio);
