import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const EXPECTED = {
  branch: "main",
  displayName: "みりぃ",
  legalName: "三橋莉子",
  packageName: "mily-fan-site",
  titleIncludes: "みりぃ",
  repoName: "mily-fan-site",
  siteUrl: "https://mily-fan-site.vercel.app",
};

export const FORBIDDEN = [
  "yukako-schedule-2026",
  "riri-schedule-2026",
  "mako-schedule-2026",
  "吉井優花子",
  "吉井 優花子",
  "夏凪里季",
  "夏凪 里季",
];

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const SCAN_EXTENSIONS = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".mjs",
  ".cjs",
  ".json",
  ".html",
  ".md",
  ".yml",
  ".yaml",
  ".css",
  ".webmanifest",
  ".xml",
  ".txt",
  ".svg",
]);
const SKIP_DIRS = new Set(["node_modules", "dist", ".git", ".vercel"]);
const SKIP_FILES = new Set([
  "check-site-identity.mjs",
  "content-invariants.mjs",
  "content-invariants.test.mjs",
  "site-identity.test.mjs",
]);

export async function collectFiles(dir = root) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }

  const files = [];
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(fullPath)));
      continue;
    }
    if (SKIP_FILES.has(entry.name)) continue;
    if (SCAN_EXTENSIONS.has(path.extname(entry.name))) files.push(fullPath);
  }
  return files;
}

function readRelative(relative) {
  return readFile(path.join(root, relative), "utf8");
}

function spellingScanText(relative, content) {
  const normalized = relative.replaceAll("\\", "/");
  if (normalized === "AGENTS.md") {
    return content.replaceAll("millyではない", "");
  }
  return content;
}

export async function checkIdentity(branch = (process.argv[2] || "").trim()) {
  if (branch && branch !== EXPECTED.branch) {
    console.log(
      `site-guard: "${branch}" is not the protected branch (${EXPECTED.branch}); skipping.`,
    );
    return 0;
  }

  const errors = [];

  const profile = await readRelative("src/data/profile.ts");
  const html = await readRelative("index.html");
  const pkg = JSON.parse(await readRelative("package.json"));

  if (pkg.name !== EXPECTED.packageName) {
    errors.push(`package.json name is "${pkg.name}", expected "${EXPECTED.packageName}".`);
  }

  if (typeof pkg.name === "string" && /milly/i.test(pkg.name)) {
    errors.push(`package.json name uses the misspelling "milly" instead of "mily".`);
  }

  const siteSrc = await readRelative("src/data/site.ts");
  if (!siteSrc.includes(`repoName: "${EXPECTED.repoName}"`)) {
    errors.push(`site.ts must set repoName to "${EXPECTED.repoName}".`);
  }
  if (!siteSrc.includes(`repoFullName: "ackey1007fw-coder/${EXPECTED.repoName}"`)) {
    errors.push(`site.ts must set repoFullName to "ackey1007fw-coder/${EXPECTED.repoName}".`);
  }
  if (!siteSrc.includes(`siteUrl: "${EXPECTED.siteUrl}"`)) {
    errors.push(`site.ts must set siteUrl to "${EXPECTED.siteUrl}".`);
  }

  const agents = await readRelative("AGENTS.md");
  if (!agents.includes("**mily**（millyではない）")) {
    errors.push('AGENTS.md must keep the spelling rule "mily（millyではない）".');
  }
  if (agents.includes("milly-fan-site")) {
    errors.push("AGENTS.md must not use the misspelling milly-fan-site.");
  }

  if (!profile.includes(`displayName: "${EXPECTED.displayName}"`)) {
    errors.push(`profile.ts must set displayName to "${EXPECTED.displayName}".`);
  }

  if (!profile.includes(`legalName: "${EXPECTED.legalName}"`)) {
    errors.push(`profile.ts must set legalName to "${EXPECTED.legalName}".`);
  }

  const titleMatch = html.match(/<title>([^<]*)<\/title>/);
  const title = titleMatch ? titleMatch[1] : "";
  if (!title.includes(EXPECTED.titleIncludes)) {
    errors.push(`index.html title does not include "${EXPECTED.titleIncludes}" (title="${title}").`);
  }
  if (!title.includes("非公式")) {
    errors.push(`index.html title must include "非公式".`);
  }

  if (!html.includes("公式・公認・本人運営ではありません")) {
    errors.push("index.html must keep the unofficial disclaimer.");
  }

  const files = await collectFiles(root);
  for (const filePath of files) {
    const content = await readFile(filePath, "utf8").catch(() => "");
    const relative = path.relative(root, filePath);
    for (const value of FORBIDDEN) {
      if (content.includes(value)) {
        errors.push(
          `Forbidden sibling-site or official-claim signal "${value}" found in ${relative}.`,
        );
      }
    }
    const spellingText = spellingScanText(relative, content);
    if (/milly/i.test(spellingText)) {
      errors.push(
        `Forbidden misspelling "milly" found in ${relative}; this repository uses "mily".`,
      );
    }
  }

  if (errors.length > 0) {
    console.error("\nSite identity mismatch: this repository is the mily fan site only.");
    for (const error of errors) console.error(`  - ${error}`);
    return 1;
  }

  console.log(
    `site-guard: identity ok (${EXPECTED.displayName} / ${EXPECTED.legalName} / ${EXPECTED.repoName}).`,
  );
  return 0;
}

function isDirectRun() {
  const invoked = process.argv[1] ? path.resolve(process.argv[1]) : "";
  return invoked === fileURLToPath(import.meta.url);
}

if (isDirectRun()) {
  process.exit(await checkIdentity());
}
