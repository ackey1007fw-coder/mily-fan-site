/** Repository-wide scan for Drive identifiers.
 *
 * Extension-independent on purpose: an allowlist of "text" extensions silently
 * skips .xml, .svg, .webmanifest and whatever the repository grows next. This
 * enumerates every tracked file and uses git's own binary heuristic (a NUL byte
 * in the first 8000 bytes) to decide what to read.
 */
import { readFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";

const run = promisify(execFile);

/** git treats a blob as binary when a NUL appears in its first 8000 bytes. */
export const BINARY_SNIFF_BYTES = 8000;

export function isProbablyBinary(buffer) {
  return buffer.subarray(0, BINARY_SNIFF_BYTES).includes(0);
}

export const DRIVE_HOST_PATTERN = /drive\.(google|usercontent\.google)\.com/;
export const DRIVE_FOLDER_PATTERN = /drive\.google\.com\/drive\/folders|\/drive\/folders\//;

/** Drive ids are long, opaque and mixed-case with digits. Slugs, SCREAMING_CASE
 *  constants, header names and hex digests are none of those. */
const ID_CANDIDATE = /[A-Za-z0-9_-]{25,}/g;
const PUBLIC_GOOGLE_FORM_URL =
  /https:\/\/docs\.google\.com\/forms\/d\/e\/[A-Za-z0-9_-]+\/viewform(\?[^\s"'<>)]*)?/g;

export function looksLikeDriveId(token) {
  return /[A-Z]/.test(token) && /[a-z]/.test(token) && /[0-9]/.test(token);
}

export function findDriveIds(text) {
  // Published Google Forms use an opaque public form id with the same shape as
  // a Drive id. Exempt only the canonical public /forms/d/e/.../viewform URL;
  // the same token anywhere else, and every Drive host/path, remains blocked.
  const withoutPublicGoogleForms = text.replace(
    PUBLIC_GOOGLE_FORM_URL,
    (_url, query = "") => query,
  );
  return (withoutPublicGoogleForms.match(ID_CANDIDATE) ?? []).filter(
    looksLikeDriveId,
  );
}

/** Files whose content is legitimately full of id-shaped tokens. */
const ID_SHAPE_EXEMPT = new Set(["pnpm-lock.yaml"]);

export async function listTrackedFiles(root) {
  const { stdout } = await run("git", ["ls-files", "-z"], {
    cwd: root,
    maxBuffer: 1024 * 1024 * 32,
  });
  return stdout.split("\0").filter(Boolean);
}

/**
 * Read every tracked text file.
 * @returns {Promise<{files: {file: string, text: string}[], skippedBinary: string[]}>}
 */
export async function readTrackedTextFiles(root) {
  const tracked = await listTrackedFiles(root);
  const files = [];
  const skippedBinary = [];

  for (const file of tracked) {
    let buffer;
    try {
      buffer = await readFile(path.join(root, file));
    } catch {
      continue; // deleted from the worktree but still in the index
    }
    if (isProbablyBinary(buffer)) {
      skippedBinary.push(file);
      continue;
    }
    files.push({ file, text: buffer.toString("utf8") });
  }

  return { files, skippedBinary };
}

/**
 * Scan a repository for anything that could route a reader back to the Drive
 * originals.
 * @param {string} root
 * @param {{knownIds?: string[]}} [options] extra literal ids to look for
 * @returns {Promise<{scanned: number, skippedBinary: string[], findings: object[]}>}
 */
export async function scanForDriveIdentifiers(root, { knownIds = [] } = {}) {
  const { files, skippedBinary } = await readTrackedTextFiles(root);
  const findings = [];

  for (const { file, text } of files) {
    if (DRIVE_HOST_PATTERN.test(text)) {
      findings.push({ file, kind: "drive-host" });
    }
    if (DRIVE_FOLDER_PATTERN.test(text)) {
      findings.push({ file, kind: "drive-folder" });
    }
    for (const id of knownIds) {
      if (text.includes(id)) findings.push({ file, kind: "known-id" });
    }
    if (ID_SHAPE_EXEMPT.has(path.basename(file))) continue;
    for (const token of findDriveIds(text)) {
      findings.push({ file, kind: "id-shape", token });
    }
  }

  return { scanned: files.length, skippedBinary, findings };
}
