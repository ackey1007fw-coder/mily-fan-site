import { createHash } from "node:crypto";
import { gunzipSync } from "node:zlib";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const assetDir = path.join(root, "scripts/assets/mily-b39-paton-day3");
const outputDir = path.join(root, "public/media/gallery");

const assets = [
  {
    label: "video",
    parts: ["video.part.00.b64", "video.part.01.b64"],
    gzipBytes: 18_604,
    gzipSha256: "5aad4f7cc149b2d8105fa690939ff14c4adaead862150de30b1ca0fec71bb9a8",
    output: "mily-b39-01-paton-vote-day-3-story.mp4",
    outputBytes: 24_372,
    outputSha256: "d7c5d3c7b0f2382e2c6d1872c23d088bbcbce8792fd2dceac81cea6749608bb5",
    kind: "mp4",
  },
  {
    label: "poster",
    parts: ["poster.part.00.b64"],
    gzipBytes: 7_083,
    gzipSha256: "7e094941cfd4bf02968a78e0294b0c1dbc50c9a7f200e593be6aaf7ef70d8070",
    output: "mily-b39-01-paton-vote-day-3-story-poster.jpg",
    outputBytes: 7_142,
    outputSha256: "60a0079fa98bee0f693d764311ee3ad534a8b8288a23314069b3d1bc96fd5d48",
    kind: "jpeg",
  },
];

function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

await mkdir(outputDir, { recursive: true });

for (const asset of assets) {
  const encodedParts = await Promise.all(
    asset.parts.map((name) => readFile(path.join(assetDir, name), "utf8")),
  );
  const encoded = encodedParts.join("").replace(/\s+/g, "");
  const compressed = Buffer.from(encoded, "base64");

  if (compressed.length !== asset.gzipBytes) {
    throw new Error(
      `${asset.label} gzip payload size mismatch: expected ${asset.gzipBytes}, got ${compressed.length}`,
    );
  }
  const compressedDigest = sha256(compressed);
  if (compressedDigest !== asset.gzipSha256) {
    throw new Error(`${asset.label} gzip payload sha256 mismatch: ${compressedDigest}`);
  }

  const bytes = gunzipSync(compressed);
  if (bytes.length !== asset.outputBytes) {
    throw new Error(
      `${asset.label} output size mismatch: expected ${asset.outputBytes}, got ${bytes.length}`,
    );
  }
  const digest = sha256(bytes);
  if (digest !== asset.outputSha256) {
    throw new Error(`${asset.label} output sha256 mismatch: ${digest}`);
  }

  if (asset.kind === "mp4") {
    if (bytes.subarray(4, 8).toString("ascii") !== "ftyp") {
      throw new Error("Paton Story video payload is not an MP4 ftyp file");
    }
    const moov = bytes.indexOf(Buffer.from("moov"));
    const mdat = bytes.indexOf(Buffer.from("mdat"));
    if (moov < 0 || mdat < 0 || moov >= mdat) {
      throw new Error("Paton Story video payload is missing faststart ordering");
    }
  } else if (
    bytes[0] !== 0xff ||
    bytes[1] !== 0xd8 ||
    bytes.at(-2) !== 0xff ||
    bytes.at(-1) !== 0xd9
  ) {
    throw new Error("Paton Story poster payload is not a complete JPEG file");
  }

  const outputPath = path.join(outputDir, asset.output);
  await writeFile(outputPath, bytes);
  console.log(`Built Paton Story ${asset.label}: ${path.relative(root, outputPath)}`);
}
