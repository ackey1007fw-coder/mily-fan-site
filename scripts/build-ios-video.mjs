import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const partsDir = path.join(root, "scripts/assets/mily-b04-ios");
const mediaDir = path.join(root, "public/media/gallery");
const output = path.join(mediaDir, "mily-b04-01-morning-showroom-ios.mp4");

const EXPECTED_BYTES = 16872;
const EXPECTED_SHA256 = "a9c0eaf05b6725ef9045f502668655c2a7e5d4107ab9542a9a09c14e1c62720f";
const PARTS = ["part-00.b64", "part-01.b64", "part-02.b64"];

// The first published 8/18 derivative was damaged during binary handoff and
// cannot be decoded reliably by iOS/WebKit. The replacement was encoded from
// the owner-provided original as H.264 Constrained Baseline / yuv420p / 15 fps
// with +faststart. To keep the public repository text-safe, its bytes are stored
// as short wrapped base64 chunks and reconstructed deterministically at build.
const encodedParts = await Promise.all(
  PARTS.map((name) => readFile(path.join(partsDir, name), "utf8")),
);
const encoded = encodedParts.join("").replace(/\s+/g, "");
const bytes = Buffer.from(encoded, "base64");

if (bytes.length !== EXPECTED_BYTES) {
  throw new Error(
    `iOS video payload size mismatch: expected ${EXPECTED_BYTES}, got ${bytes.length}`,
  );
}

const digest = createHash("sha256").update(bytes).digest("hex");
if (digest !== EXPECTED_SHA256) {
  throw new Error(`iOS video payload sha256 mismatch: ${digest}`);
}

if (bytes.subarray(4, 8).toString("ascii") !== "ftyp") {
  throw new Error("iOS video payload is not an MP4 ftyp file");
}
const moov = bytes.indexOf(Buffer.from("moov"));
const mdat = bytes.indexOf(Buffer.from("mdat"));
if (moov < 0 || mdat < 0 || moov > mdat) {
  throw new Error("iOS video payload is missing faststart ordering");
}

await mkdir(mediaDir, { recursive: true });
await writeFile(output, bytes);
console.log(`Built iOS-compatible video: ${path.relative(root, output)}`);
