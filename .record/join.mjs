/**
 * Concatenate the 12 portfolio clips into a single video with:
 *   - 0.6s crossfade between every pair (gentle dissolve, editorial)
 *   - 1.5s fade-in from black at the start
 *   - 1.5s fade-out to black at the end
 */
import { execFileSync } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import ffmpegPath from "ffmpeg-static";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const clips = [
  "01-hero",
  "02-work",
  "03-case-top",
  "04-case-2",
  "05-iceberg",
  "06-about",
  "07-reviews",
  "08-path",
  "09-writing",
  "10-watch",
  "11-contact",
  "12-footer",
];

const SEC = 6;
const FADE = 0.6;
const HEAD = 1.5;
const TAIL = 1.5;

// Build xfade offset for each transition.
let total = SEC;
const offsets = [];
for (let i = 1; i < clips.length; i++) {
  offsets.push(total - FADE);
  total += SEC - FADE;
}
const innerDuration = total;
const finalDuration = innerDuration + HEAD + TAIL;

// Build the filter graph: 11 xfade transitions, then a fade-in + fade-out.
let filter = "";
let prev = "0:v";
for (let i = 1; i < clips.length; i++) {
  const cur = `${i}:v`;
  const out = i === clips.length - 1 ? "vmerged" : `vx${i}`;
  filter += `[${prev}][${cur}]xfade=transition=fade:duration=${FADE}:offset=${offsets[i - 1].toFixed(3)}[${out}];`;
  prev = out;
}

// Final fade-in at the start and fade-out at the end.
filter += `[vmerged]fade=t=in:st=0:d=${HEAD}:alpha=1,fade=t=out:st=${(innerDuration + HEAD).toFixed(3)}:d=${TAIL}:alpha=1[vout]`;

const inputArgs = clips.flatMap((c) => [
  "-i",
  resolve(ROOT, `.record/clips/${c}.mp4`),
]);

const args = [
  "-y",
  ...inputArgs,
  "-filter_complex",
  filter,
  "-map",
  "[vout]",
  "-c:v",
  "libx264",
  "-preset",
  "slow",
  "-crf",
  "18",
  "-pix_fmt",
  "yuv420p",
  "-r",
  "24",
  "-movflags",
  "+faststart",
  resolve(ROOT, ".record/portfolio-tour.mp4"),
];

console.log(`[join] building portfolio-tour.mp4`);
console.log(`[join] inner = ${innerDuration.toFixed(2)}s, head/tail = ${HEAD}/${TAIL}s, final = ${finalDuration.toFixed(2)}s`);

execFileSync(ffmpegPath, args, { stdio: "inherit" });
console.log("[join] done");
