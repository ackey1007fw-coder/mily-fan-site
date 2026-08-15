/**
 * Builds web derivatives for gallery photos.
 *
 * Input:  media/original/  (untouched source files, never committed)
 * Output: public/media/gallery/<name>-<width>.{jpg,webp}
 *
 * Rules enforced here:
 * - never overwrite an existing output file (rename the source instead)
 * - never upscale
 * - metadata (EXIF / GPS / IPTC) is dropped: sharp strips it unless
 *   withMetadata() is called, which this script never does
 */
import { readdir, mkdir, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_DIR = path.join(root, "media/original");
const OUTPUT_DIR = path.join(root, "public/media/gallery");
export const DERIVATIVE_WIDTHS = [480, 960, 1600];
const NAME_RE = /^milly-b\d{2}-\d{2}(-[a-z0-9]+)+\.(jpg|jpeg)$/;

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  let sources;
  try {
    sources = (await readdir(SOURCE_DIR)).filter((name) => /\.jpe?g$/i.test(name));
  } catch {
    console.error(`media:build — no ${path.relative(root, SOURCE_DIR)} directory found.`);
    process.exit(1);
  }

  const badNames = sources.filter((name) => !NAME_RE.test(name));
  if (badNames.length > 0) {
    console.error("media:build — source filenames must match milly-bNN-NN-<slug>.jpg:");
    for (const name of badNames) console.error(`  - ${name}`);
    process.exit(1);
  }

  await mkdir(OUTPUT_DIR, { recursive: true });

  for (const name of sources) {
    const sourcePath = path.join(SOURCE_DIR, name);
    const base = name.replace(/\.jpe?g$/i, "");
    const meta = await sharp(sourcePath).metadata();
    console.log(`${name}  ${meta.width}x${meta.height}`);

    for (const width of DERIVATIVE_WIDTHS) {
      for (const format of ["jpg", "webp"]) {
        const outPath = path.join(OUTPUT_DIR, `${base}-${width}.${format}`);
        if (await exists(outPath)) {
          console.error(
            `media:build — refusing to overwrite ${path.relative(root, outPath)}. ` +
              "Published filenames are immutable; use a new name for changed content.",
          );
          process.exit(1);
        }

        const pipeline = sharp(sourcePath)
          .rotate()
          .resize({ width, withoutEnlargement: true });
        if (format === "jpg") {
          await pipeline.jpeg({ quality: 82, mozjpeg: true }).toFile(outPath);
        } else {
          await pipeline.webp({ quality: 78 }).toFile(outPath);
        }
        console.log(`  -> ${path.relative(root, outPath)}`);
      }
    }
  }

  console.log("media:build — done.");
}

await main();
