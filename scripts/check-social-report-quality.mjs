import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { streamRecaps } from "../src/data/streamRecaps.ts";
import { validateReportMedia, prepareSocialReport, prepareReplacement, validatePublicationLedger, sha256 } from "./social-report-quality.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const json = async name => JSON.parse((await readFile(name, "utf8")).replace(/^\uFEFF/, ""));
try {
  const args = process.argv.slice(2);
  const seenOptions = new Set();
  for (let i = 1; i < args.length; i++) {
    if (!["--owner-decision", "--ledger", "--media", "--prepare-replacement"].includes(args[i]) || seenOptions.has(args[i])) throw new Error("Unknown or repeated preflight option");
    seenOptions.add(args[i]);
    if (args[i] !== "--prepare-replacement") { if (!args[i + 1] || args[i + 1].startsWith("--")) throw new Error("Missing preflight option file"); i++; }
  }
  const option = name => { const index = args.indexOf(name); if (index < 0) return undefined; if (!args[index + 1] || args[index + 1].startsWith("--")) throw new Error(`Missing ${name} file`); return path.resolve(args[index + 1]); };
  const ownerPath = option("--owner-decision"), ledgerPath = option("--ledger");
  const manifest = await json(option("--media") ?? path.join(root, "scripts/social-report-media.json"));
  const ledger = await json(ledgerPath ?? path.join(root, "scripts/social-report-publications.json"));
  await validateReportMedia(manifest, { root, recaps: streamRecaps });
  await validatePublicationLedger(ledger, { root, recaps: streamRecaps });
  if (args[0] && !args[0].startsWith("--")) {
    const plan = await json(path.resolve(args[0]));
    const ownerDecision = ownerPath ? await json(ownerPath) : undefined;
    if (ownerDecision) {
      if (typeof ownerDecision.messageId !== "string" || !ownerDecision.messageId.trim()) throw new Error("Private owner message ID required");
      ownerDecision.messageIdDigest = sha256(ownerDecision.messageId);
    }
    const context = { root, recaps: streamRecaps, manifest, ledger, ownerDecision, fetchBytes: async url => {
      const result = await fetch(url, { signal: AbortSignal.timeout(10000) });
      if (!result.ok) throw new Error(`Media HTTP ${result.status}`);
      return Buffer.from(await result.arrayBuffer());
    } };
    const payload = await (args.includes("--prepare-replacement") ? prepareReplacement : prepareSocialReport)(plan, context);
    if (context.ownerDecision) console.error(`social-report: ${context.ownerDecision.note}`);
    process.stdout.write(JSON.stringify(payload, null, 2) + "\n");
  } else { if (args.length) throw new Error("Plan file required with options"); console.log("social-report: registered cover, original source pixels and publication states verified (no post/schedule API called)"); }
} catch (error) { console.error(`social-report: BLOCKED: ${error.message}`); process.exitCode = 1; }
