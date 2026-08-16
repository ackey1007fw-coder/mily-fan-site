/** Build-time download of individual Drive files. Fail closed.
 *
 * Only ever addresses a single registered file id. There is no folder listing,
 * no folder id and no folder URL anywhere in this module.
 *
 * Google serves small public files straight from `drive.usercontent.google.com`
 * but answers large ones with an HTML virus-scan interstitial that carries a
 * `confirm` token in a form. We detect the interstitial explicitly and retry
 * once with the token rather than silently writing HTML to disk as if it were
 * media.
 */

const DOWNLOAD_ORIGIN = "https://drive.usercontent.google.com/download";

/** An HTML body where media was expected is always a failure, never content. */
const HTML_SNIFF = /^\s*(<!doctype html|<html)/i;

export class DriveFetchError extends Error {
  constructor(message) {
    super(message);
    this.name = "DriveFetchError";
  }
}

function downloadUrl(fileId, confirm) {
  const url = new URL(DOWNLOAD_ORIGIN);
  url.searchParams.set("id", fileId);
  url.searchParams.set("export", "download");
  if (confirm) url.searchParams.set("confirm", confirm);
  return url.toString();
}

/** Pull the confirm token out of Google's virus-scan interstitial. */
export function parseConfirmToken(html) {
  const named = html.match(/name="confirm"\s+value="([^"]+)"/i);
  if (named) return named[1];
  const query = html.match(/[?&]confirm=([^"&']+)/i);
  if (query) return query[1];
  return null;
}

export function expectedMimePrefix(kind) {
  return kind === "photo" ? "image/" : "video/";
}

/** Minimum plausible payload. Anything smaller is a truncated or error body. */
const MIN_BYTES = 4096;

/**
 * Download one registered Drive file.
 * @returns {Promise<{bytes: Buffer, contentType: string, usedConfirm: boolean}>}
 */
export async function downloadDriveFile(fileId, kind, { fetchImpl = fetch } = {}) {
  if (!/^[A-Za-z0-9_-]{10,}$/.test(fileId)) {
    throw new DriveFetchError(`unsafe file id: ${fileId}`);
  }

  let usedConfirm = false;
  let response = await fetchImpl(downloadUrl(fileId));

  if (!response.ok) {
    throw new DriveFetchError(
      `HTTP ${response.status} ${response.statusText} for ${fileId}`,
    );
  }

  let contentType = response.headers.get("content-type") ?? "";
  let bytes = Buffer.from(await response.arrayBuffer());

  // Large files answer with the interstitial instead of the payload.
  if (contentType.includes("text/html") || HTML_SNIFF.test(bytes.subarray(0, 64).toString("utf8"))) {
    const token = parseConfirmToken(bytes.toString("utf8"));
    if (!token) {
      throw new DriveFetchError(
        `${fileId}: Drive returned an HTML interstitial with no confirm token`,
      );
    }
    usedConfirm = true;
    response = await fetchImpl(downloadUrl(fileId, token));
    if (!response.ok) {
      throw new DriveFetchError(
        `HTTP ${response.status} ${response.statusText} for ${fileId} (confirmed)`,
      );
    }
    contentType = response.headers.get("content-type") ?? "";
    bytes = Buffer.from(await response.arrayBuffer());
  }

  if (HTML_SNIFF.test(bytes.subarray(0, 64).toString("utf8"))) {
    throw new DriveFetchError(`${fileId}: still HTML after confirm`);
  }

  const prefix = expectedMimePrefix(kind);
  if (!contentType.startsWith(prefix)) {
    throw new DriveFetchError(
      `${fileId}: expected ${prefix}* but Drive served "${contentType}"`,
    );
  }

  if (bytes.length < MIN_BYTES) {
    throw new DriveFetchError(
      `${fileId}: payload is only ${bytes.length} bytes`,
    );
  }

  return { bytes, contentType, usedConfirm };
}
