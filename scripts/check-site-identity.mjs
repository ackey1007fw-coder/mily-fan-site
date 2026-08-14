import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const EXPECTED = {
  branch: "main",
  displayName: "みりぃ",
  legalName: "三橋莉子",
  packageName: "milly-fan-site",
  titleIncludes: "みりぃ",
  repoName: "milly-fan-site",
};

const FORBIDDEN = [
  "yukako-schedule-2026",
  "riri-schedule-2026",
  "mako-schedule-2026",
  "吉井優花子",
  "吉井 優花子",
  "夏凪里季",
  "夏凪 里季",
];

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SCAN_EXTENSIONS = new Set([
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
]);
const SKIP_DIRS = new Set(["node_modules", "dist", ".git", ".vercel"]);
const SKIP_FILES = new Set([
  "check-site-identity.mjs",
  "content-invariants.mjs",
  "content-invariants.test.mjs",
]);

const branch = (process.argv[2] || "").trim();

if (branch && branch !== EXPECTED.branch) {
  console.log(
    `site-guard: "${branch}" is not the protected branch (${EXPECTED.branch}); skipping.`,
  );
  process.exit(0);
}

async function collectFiles(dir) {
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

const errors = [];

const profile = await readRelative("src/data/profile.ts");
const html = await readRelative("index.html");
const pkg = JSON.parse(await readRelative("package.json"));

if (pkg.name !== EXPECTED.packageName) {
  errors.push(`package.json name is "${pkg.name}", expected "${EXPECTED.packageName}".`);
}

if (typeof pkg.name === "string" && /(^|[^l])mily([^l]|$)/.test(pkg.name)) {
  errors.push(`package.json name uses the misspelling "mily" instead of "milly".`);
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
  for (const value of FORBIDDEN) {
    if (content.includes(value)) {
      errors.push(
        `Forbidden sibling-site or official-claim signal "${value}" found in ${path.relative(root, filePath)}.`,
      );
    }
  }
}

if (errors.length > 0) {
  console.error("\nSite identity mismatch: this repository is the milly fan site only.");
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log(
  `site-guard: identity ok (${EXPECTED.displayName} / ${EXPECTED.legalName} / ${EXPECTED.repoName}).`,
);
