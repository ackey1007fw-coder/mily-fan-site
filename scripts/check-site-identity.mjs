import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const EXPECTED = {
  branch: "main",
  displayName: "みりぃ",
  publicName: "三橋莉子",
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

// "Mily" / "mily" is 本人の公開表記 (Instagram @mily_chan36) — a proper
// noun, not a typo, so spellcheckers and AI judgement must not "fix" it.
// The doubled-l variant is the actual misspelling; scan every text file
// for it as a standalone token.
const MISSPELLING_RE = /\bmilly\b/i;

const PUBLIC_SURFACE_ROOTS = new Set([
  "activities",
  "gallery",
  "news",
  "profile",
  "public",
  "shared",
  "src",
  "stories",
  "support",
]);

export function isPublicSurface(relative) {
  const normalized = relative.replaceAll("\\", "/");
  if (normalized === "index.html") return true;
  return PUBLIC_SURFACE_ROOTS.has(normalized.split("/")[0]);
}

export function claimsApprovalStatus(content) {
  // Public pages intentionally say neither approved nor unapproved. Require a
  // site subject and an approval assertion in the same sentence so unrelated
  // facts such as「このイベントは大学公認です」remain valid.
  const siteSubject =
    /(?:当|本|この)(?:非公式)?(?:ファン)?(?:サイト|ページ)|みりぃ(?:の)?(?:ファン)?サイト|ファンサイト/;
  const approvalAssertion =
    /(?:非公認(?:です|である|では(?:ありません|ない)|とされて(?:います|いる))?|公認(?:です|である|済み|では(?:ありません|ない)|され(?:て(?:います|いる|いません|いない|おります|おり)|ました|ませんでした)|を(?:受け(?:た|ました|ています|ている|ていません|ていない|ております|ており)|得(?:た|ました|ています|ている|ていません|ていない)|いただ(?:いた|いています|いている|いていません|いていない|きました))))/;
  const approvalSiteModifier =
    /(?:(?:本人(?:の|から)?|みりぃ(?:さん)?(?:の|から)?)(?:非)?公認(?:の)?(?:非公式)?(?:ファン)?サイト|(?:非)?公認(?:の)?みりぃ(?:の)?ファンサイト)/;

  return content
    .replace(/\s+/g, " ")
    .split(/[。！？]/)
    .some(
      (sentence) =>
        approvalSiteModifier.test(sentence) ||
        (siteSubject.test(sentence) && approvalAssertion.test(sentence)),
    );
}

export function decodePublicText(value) {
  return value
    .replace(/\\u\{([0-9a-f]+)\}/gi, (_, hex) =>
      String.fromCodePoint(Number.parseInt(hex, 16)),
    )
    .replace(/\\u([0-9a-f]{4})/gi, (_, hex) =>
      String.fromCharCode(Number.parseInt(hex, 16)),
    )
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) =>
      String.fromCodePoint(Number.parseInt(hex, 16)),
    )
    .replace(/&#([0-9]+);/g, (_, decimal) =>
      String.fromCodePoint(Number.parseInt(decimal, 10)),
    )
    .replace(/\\[nrt]/g, " ");
}

export function publicTextSegments(content, relative) {
  const normalizedPath = relative.replaceAll("\\", "/");
  const extension = path.extname(normalizedPath);
  const segments = [];
  const quoted = /(["'`])((?:\\.|(?!\1)[\s\S])*?)\1/g;
  const textNode = />([^<>{}]+)</g;
  const renderedBlock =
    /<(p|h[1-6]|li|dt|dd|figcaption|blockquote|button|a|span)\b[^>]*>([\s\S]*?)<\/\1>/gi;

  for (const match of content.matchAll(quoted)) {
    segments.push(decodePublicText(match[2]));
  }
  for (const match of content.matchAll(textNode)) {
    segments.push(decodePublicText(match[1]));
  }
  for (const match of content.matchAll(renderedBlock)) {
    segments.push(
      decodePublicText(
        match[2]
          .replace(/\{\s*site\.displayTitle\s*\}/g, "ファンサイト")
          .replace(/\{\s*(["'`])([\s\S]*?)\1\s*\}/g, "$2")
          .replace(/<[^>]+>/g, "")
          .replace(/\{[^{}]*\}/g, ""),
      ),
    );
  }

  if ([".md", ".txt"].includes(extension)) {
    segments.push(decodePublicText(content));
  }

  return segments;
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

  if (typeof pkg.name === "string" && MISSPELLING_RE.test(pkg.name)) {
    errors.push(`package.json name doubles the "l"; the public identity is "mily".`);
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
  if (!agents.includes("mily-fan-site")) {
    errors.push("AGENTS.md must reference mily-fan-site.");
  }
  if (!agents.includes("@mily_chan36")) {
    errors.push("AGENTS.md must keep the @mily_chan36 identity reference.");
  }

  if (!profile.includes(`displayName: "${EXPECTED.displayName}"`)) {
    errors.push(`profile.ts must set displayName to "${EXPECTED.displayName}".`);
  }

  if (!profile.includes(`publicName: "${EXPECTED.publicName}"`)) {
    errors.push(`profile.ts must set publicName to "${EXPECTED.publicName}".`);
  }

  const titleMatch = html.match(/<title>([^<]*)<\/title>/);
  const title = titleMatch ? titleMatch[1] : "";
  if (!title.includes(EXPECTED.titleIncludes)) {
    errors.push(`index.html title does not include "${EXPECTED.titleIncludes}" (title="${title}").`);
  }
  if (!title.includes("非公式")) {
    errors.push(`index.html title must include "非公式".`);
  }

  if (!html.includes("ファン運営の非公式サイト") || !html.includes("本人運営ではありません")) {
    errors.push("index.html must keep the unofficial disclaimer.");
  }

  const files = await collectFiles(root);
  for (const filePath of files) {
    const content = await readFile(filePath, "utf8").catch(() => "");
    const relative = path.relative(root, filePath);
    if (
      isPublicSurface(relative) &&
      publicTextSegments(content, relative).some(claimsApprovalStatus)
    ) {
      errors.push(
        `Public surface ${relative} must not make a claim about approval status.`,
      );
    }
    for (const value of FORBIDDEN) {
      if (content.includes(value)) {
        errors.push(
          `Forbidden sibling-site or official-claim signal "${value}" found in ${relative}.`,
        );
      }
    }
    if (MISSPELLING_RE.test(content)) {
      errors.push(
        `Misspelled identity (doubled "l") found in ${relative}; the public identity is "mily" (@mily_chan36).`,
      );
    }
  }

  if (errors.length > 0) {
    console.error("\nSite identity mismatch: this repository is the mily fan site only.");
    for (const error of errors) console.error(`  - ${error}`);
    return 1;
  }

  console.log(
    `site-guard: identity ok (${EXPECTED.displayName} / ${EXPECTED.publicName} / ${EXPECTED.repoName}).`,
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
