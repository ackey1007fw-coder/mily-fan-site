import { readFile, unlink } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "dist");
const config = JSON.parse(await readFile(path.join(root, "vercel.json"), "utf8"));
const held = config.rewrites.filter(route => route.destination === "/api/mily-b252-media-unavailable");
if (held.length !== 16) throw new Error("Expected the 16 b252 media URLs");

// Vercel checks static files before rewrites. Keep the source files unchanged,
// but omit these copies from the build so the exact URLs reach the 410 handler.
for (const { source } of held) {
  if (!/^\/media\/(?:live|live-clips)\/mily-b252-[a-z0-9-]+\.(?:jpg|mp4)$/.test(source)) {
    throw new Error("Unexpected media path in the b252 privacy hold");
  }
  const target = path.resolve(output, source.slice(1));
  if (!target.startsWith(output + path.sep)) throw new Error("Media path escaped dist");
  await unlink(target).catch(error => {
    if (error.code !== "ENOENT") throw error;
  });
}
console.log("Withheld 16 b252 media files from the build; source media unchanged.");
