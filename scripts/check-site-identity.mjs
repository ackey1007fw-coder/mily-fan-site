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
  ".jsx",
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
  "api",
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
  if (
    normalized === "index.html" ||
    normalized === "README.md" ||
    normalized === "vite.config.ts"
  ) {
    return true;
  }
  return PUBLIC_SURFACE_ROOTS.has(normalized.split("/")[0]);
}

export function claimsApprovalStatus(content) {
  // Public pages intentionally say neither approved nor unapproved. Bind the
  // subject and assertion grammatically so an unrelated fact in the same
  // sentence (e.g. an approved event) remains valid.
  const siteSubject =
    String.raw`(?:(?:当|本|この|弊)(?:非公式)?(?:ファン)?(?:ウェブサイト|ホームページ|サイト|ページ)|みりぃ(?:の)?\s*(?:ファン)?サイト|ファンサイト)`;
  const approvalAssertion =
    String.raw`(?:(?:非|未)公認(?:サイト)?(?:です|である|でございます|では(?:ありません|ない|ございません)|じゃ(?:ない|ありません)|でない(?:です)?|とされて(?:います|いる))|公認(?:(?:が)?(?:あります|ありません|ある|ない)|(?:あり|なし)(?:です)?|(?:サイト)?(?:です|である|でございます|済み|では(?:ありません|ない|ございません)|じゃ(?:ない|ありません)|でない(?:です)?|され(?:た|て(?:います|いる|いません|いない|おります|おり)|ました|ませんでした)|を(?:受け(?:た|ました|ています|ている|ていません|ていない|ております|ており)|得(?:た|ました|ています|ている|ていません|ていない|ております|ており)|取得(?:した|しました|しています|している|していません|していない|しております|しており)|いただ(?:いた|いています|いている|いていません|いていない|きました)))))`;
  const approver =
    String.raw`(?:(?:本人|みりぃ(?:さん)?|三橋莉子(?:さん)?)(?:に|から|の)?)?`;
  const requiredApprover =
    String.raw`(?:本人|みりぃ(?:さん)?|三橋莉子(?:さん)?)(?:に|から|の)?`;
  const siteFirst = new RegExp(
    String.raw`${siteSubject}\s*(?:は|が|を|も|については|では)?\s*${approver}\s*${approvalAssertion}`,
  );
  const approvalFirst = new RegExp(
    String.raw`(?:${approver}\s*(?:${approvalAssertion}|(?:非|未)?公認の)\s*(?:非公式)?(?:ファン)?(?:サイト|ページ)|${requiredApprover}\s*(?:非|未)?公認\s*(?:非公式)?ファンサイト)`,
  );

  const normalized = content
    .replace(/[」』）】)、)]/g, "")
    .replace(/\s+/g, " ");
  const englishClaim =
    /(?:this|the)\s+(?:(?:fan\s+site\s+(?:(?:(?:is|was)\s+(?:not\s+)?|(?:isn't|wasn't)\s+)(?:approved|unapproved)|(?:(?:has|had)\s+(?:not\s+)?|(?:hasn't|hadn't)\s+)been\s+approved))|(?:is\s+an?\s+)(?:(?:not\s+)?approved|unapproved)\s+fan\s+site)|mily(?:[- ]approved\s+fan\s+site|\s+(?:has\s+)?approved\s+(?:this|the)\s+fan\s+site)/i;

  return (
    englishClaim.test(normalized) ||
    normalized
    .split(/[。！？]/)
    .some((sentence) => siteFirst.test(sentence) || approvalFirst.test(sentence))
  );
}

function decodeCodePoint(value, radix) {
  const codePoint = Number.parseInt(value, radix);
  if (
    !Number.isInteger(codePoint) ||
    codePoint < 0 ||
    codePoint > 0x10ffff ||
    (codePoint >= 0xd800 && codePoint <= 0xdfff)
  ) {
    return "\uFFFD";
  }
  return String.fromCodePoint(codePoint);
}

export function decodePublicText(value) {
  return value
    .replace(/\$\{\s*site\.displayTitle\s*\}/g, "ファンサイト")
    .replace(/\$\{\s*(["'])((?:\\.|(?!\1)[\s\S])*?)\1\s*\}/g, "$2")
    .replace(/\{\s*site\.displayTitle\s*\}/g, "ファンサイト")
    .replace(/\\u\{([0-9a-f]+)\}/gi, (_, hex) => decodeCodePoint(hex, 16))
    .replace(/\\u([0-9a-f]{4})/gi, (_, hex) =>
      String.fromCharCode(Number.parseInt(hex, 16)),
    )
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => decodeCodePoint(hex, 16))
    .replace(/&#([0-9]+);/g, (_, decimal) => decodeCodePoint(decimal, 10))
    .replace(
      /&(nbsp|amp|lt|gt|quot|apos);/gi,
      (_, name) =>
        ({
          nbsp: " ",
          amp: "&",
          lt: "<",
          gt: ">",
          quot: '"',
          apos: "'",
        })[name.toLowerCase()],
    )
    .replace(/\\[nrt]/g, " ");
}

function decodeCssText(value) {
  return decodePublicText(value)
    .replace(/\\([0-9a-f]{1,6})\s?/gi, (_, hex) => decodeCodePoint(hex, 16))
    .replace(/\\(.)/g, "$1");
}

function renderedMarkupSegments(content) {
  const segments = [];
  const stack = [];
  const renderedContent = content.replace(
    /<!\[CDATA\[([\s\S]*?)\]\]>/g,
    "$1",
  );
  const tokens = renderedContent.match(/<[^>]*>|[^<]+/g) ?? [];

  const appendVisibleText = (value) => {
    if (stack.length === 0) return;
    const visible = decodePublicText(value)
      .replace(/\{\s*site\.displayTitle\s*\}/g, "ファンサイト")
      .replace(/\{\s*(["'`])([\s\S]*?)\1\s*\}/g, "$2")
      .replace(/\{[^{}]*\}/g, "");
    for (const frame of stack) frame.text += visible;
  };

  for (const token of tokens) {
    if (!token.startsWith("<")) {
      appendVisibleText(token);
      continue;
    }
    if (/^<!--/.test(token) || /^<![^-]/.test(token)) continue;

    if (token === "<>") {
      stack.push({ tag: "#fragment", text: "" });
      continue;
    }

    const closing = token.match(/^<\/([A-Za-z][\w:.-]*)\s*>$/);
    const fragmentClosing = token === "</>";
    if (closing || fragmentClosing) {
      const tag = fragmentClosing ? "#fragment" : closing[1].toLowerCase();
      const index = stack.findLastIndex((frame) => frame.tag === tag);
      if (index >= 0) {
        const [frame] = stack.splice(index, 1);
        segments.push(frame.text);
      }
      continue;
    }

    const opening = token.match(/^<([A-Za-z][\w:.-]*)\b/);
    if (opening && !/\/\s*>$/.test(token)) {
      stack.push({ tag: opening[1].toLowerCase(), text: "" });
    }
  }

  segments.push(...stack.map((frame) => frame.text));
  return segments;
}

function stripSourceComments(content) {
  let result = "";
  let index = 0;
  let quote = null;

  while (index < content.length) {
    const char = content[index];
    const next = content[index + 1];
    if (quote) {
      result += char;
      if (char === "\\") {
        result += next ?? "";
        index += 2;
        continue;
      }
      if (char === quote) quote = null;
      index += 1;
      continue;
    }
    if (char === '"' || char === "'" || char === "`") {
      quote = char;
      result += char;
      index += 1;
      continue;
    }
    if (char === "/" && next === "/" && content[index - 1] !== ":") {
      index += 2;
      while (index < content.length && content[index] !== "\n") index += 1;
      result += "\n";
      index += 1;
      continue;
    }
    if (char === "/" && next === "*") {
      index += 2;
      while (
        index < content.length &&
        !(content[index] === "*" && content[index + 1] === "/")
      ) {
        if (content[index] === "\n") result += "\n";
        index += 1;
      }
      index += 2;
      continue;
    }
    result += char;
    index += 1;
  }

  return result;
}

export function publicTextSegments(content, relative) {
  const normalizedPath = relative.replaceAll("\\", "/");
  const extension = path.extname(normalizedPath);
  const sourceContent = [
    ".ts",
    ".tsx",
    ".js",
    ".jsx",
    ".mjs",
    ".cjs",
  ].includes(extension)
    ? stripSourceComments(content)
    : content;
  const segments = [];
  const quoted = /(["'`])((?:\\.|(?!\1)[\s\S])*?)\1/g;
  const concatenatedQuoted =
    /(?:["'`](?:\\.|[^"'\\`])*["'`]\s*\+\s*)+["'`](?:\\.|[^"'\\`])*["'`]/g;
  const textNode = />([^<>{}]+)</g;
  const unquotedAttribute =
    /\b(?:content|aria-label|title|alt|description)=([^\s"'=`<>]+)/gi;
  const cssAdjacentContent =
    /content\s*:\s*((?:(?:["'])(?:\\.|[^"'\\])*(?:["'])\s*)+);/gi;

  for (const chain of sourceContent.matchAll(concatenatedQuoted)) {
    const joined = [...chain[0].matchAll(quoted)]
      .map((match) => decodePublicText(match[2]))
      .join("");
    segments.push(joined);
  }
  for (const match of sourceContent.matchAll(quoted)) {
    segments.push(decodePublicText(match[2]));
  }
  for (const match of sourceContent.matchAll(textNode)) {
    segments.push(decodePublicText(match[1]));
  }
  for (const match of sourceContent.matchAll(unquotedAttribute)) {
    segments.push(decodePublicText(match[1]));
  }
  if (extension === ".css") {
    for (const declaration of sourceContent.matchAll(cssAdjacentContent)) {
      segments.push(
        [...declaration[1].matchAll(quoted)]
          .map((match) => decodeCssText(match[2]))
          .join(""),
      );
    }
  }
  segments.push(...renderedMarkupSegments(sourceContent));

  if (extension === ".md") {
    segments.push(
      decodePublicText(content)
        .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
        .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
        .replace(/[*_~`]/g, ""),
    );
  }
  if (extension === ".txt") {
    segments.push(decodePublicText(content));
  }
  if ([".yml", ".yaml"].includes(extension)) {
    const lines = content.split(/\r?\n/);
    for (let index = 0; index < lines.length; index += 1) {
      const line = lines[index];
      const block = line.match(
        /^(\s*)[^#\s][^:]*:\s*([>|])(?:[1-9][+-]?|[+-][1-9]?|)\s*(?:#.*)?$/,
      );
      if (block) {
        const baseIndent = block[1].length;
        const blockLines = [];
        let cursor = index + 1;
        while (cursor < lines.length) {
          const next = lines[cursor];
          if (next.trim() === "") {
            blockLines.push("");
            cursor += 1;
            continue;
          }
          const indent = next.match(/^\s*/)[0].length;
          if (indent <= baseIndent) break;
          blockLines.push(next);
          cursor += 1;
        }
        const nonBlank = blockLines.filter((value) => value.trim() !== "");
        const contentIndent =
          nonBlank.length > 0
            ? Math.min(...nonBlank.map((value) => value.match(/^\s*/)[0].length))
            : baseIndent + 1;
        const separator = block[2] === ">" ? " " : "\n";
        segments.push(
          decodePublicText(
            blockLines.map((value) => value.slice(contentIndent)).join(separator),
          ),
        );
        index = cursor - 1;
        continue;
      }
      const scalar =
        line.match(/^\s*[^#\s][^:]*:\s*(?![>|]\s*$)(.*?)\s*(?:#.*)?$/)?.[1] ??
        line.match(/^\s*-\s+(.*?)\s*(?:#.*)?$/)?.[1];
      if (scalar) {
        const plain =
          line.match(/^(\s*)[^#\s][^:]*:\s*(.*?)\s*(?:#.*)?$/) ??
          line.match(/^(\s*)-\s+(.*?)\s*(?:#.*)?$/);
        if (plain && plain[2] !== "") {
          const baseIndent = plain[1].length;
          const continuation = [plain[2]];
          let cursor = index + 1;
          while (cursor < lines.length) {
            const next = lines[cursor];
            if (next.trim() === "") {
              continuation.push("");
              cursor += 1;
              continue;
            }
            const indent = next.match(/^\s*/)[0].length;
            if (indent <= baseIndent) break;
            continuation.push(next.trim());
            cursor += 1;
          }
          segments.push(decodePublicText(continuation.join(" ")));
          index = cursor - 1;
        } else {
          segments.push(decodePublicText(scalar));
        }
      }
    }
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
