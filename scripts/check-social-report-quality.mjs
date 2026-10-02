import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { streamRecaps } from "../src/data/streamRecaps.ts";
import { validateReportMedia, prepareSocialReport, PUBLICATION_STATES } from "./social-report-quality.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const json = async name => JSON.parse((await readFile(name, "utf8")).replace(/^\uFEFF/, ""));
try {
  const manifest = await json(path.join(root, "scripts/social-report-media.json"));
  const ledger = await json(path.join(root, "scripts/social-report-publications.json"));
  await validateReportMedia(manifest, { root, recaps: streamRecaps });
  if (!Array.isArray(ledger) || ledger.some(row => !PUBLICATION_STATES.includes(row.state))) throw new Error("Invalid publication state ledger");
  if (process.argv[2]) {
    const plan = await json(path.resolve(process.argv[2]));
    const payload = await prepareSocialReport(plan, { root, recaps: streamRecaps, manifest, ledger, fetchBytes: async url => {
      const result = await fetch(url, { signal: AbortSignal.timeout(10000) });
      if (!result.ok) throw new Error(`Media HTTP ${result.status}`);
      return Buffer.from(await result.arrayBuffer());
    } });
    process.stdout.write(JSON.stringify(payload, null, 2) + "\n");
  } else console.log("social-report: registered cover, original source pixels and publication states verified (no post/schedule API called)");
} catch (error) { console.error(`social-report: BLOCKED: ${error.message}`); process.exitCode = 1; }
