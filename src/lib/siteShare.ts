import { canonicalUrl, site } from "../data/site.ts";

export type SiteSharePayload = {
  title: string;
  text: string;
  url: string;
};

export type WebShareResult = "shared" | "cancelled" | "unsupported";

type WebShareApi = {
  share?: (data: SiteSharePayload) => Promise<void>;
  canShare?: (data: SiteSharePayload) => boolean;
};

type ClipboardWriter = {
  writeText: (text: string) => Promise<void>;
};

/**
 * Public share payload for the fan site itself.
 * Title / text / URL come from `site` + `canonicalUrl()` only.
 */
export function siteSharePayload(): SiteSharePayload {
  return {
    title: site.displayTitle,
    text: site.description,
    url: canonicalUrl(),
  };
}

export function xShareUrl(payload: SiteSharePayload = siteSharePayload()): string {
  const text = encodeURIComponent(payload.text);
  const url = encodeURIComponent(payload.url);
  return `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
}

export function lineShareUrl(
  payload: SiteSharePayload = siteSharePayload(),
): string {
  return `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(payload.url)}`;
}

export function facebookShareUrl(
  payload: SiteSharePayload = siteSharePayload(),
): string {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(payload.url)}`;
}

export function canUseWebShare(
  payload: SiteSharePayload = siteSharePayload(),
  shareApi: WebShareApi | undefined = globalThis.navigator,
): boolean {
  if (!shareApi || typeof shareApi.share !== "function") {
    return false;
  }

  if (typeof shareApi.canShare !== "function") {
    return true;
  }

  try {
    return shareApi.canShare(payload) === true;
  } catch {
    return true;
  }
}

function isAbortError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    error.name === "AbortError"
  );
}

/**
 * Opens the OS share sheet. Call only from a user gesture.
 * Does not run at module load or on mount.
 */
export async function shareWithWebShare(
  payload: SiteSharePayload = siteSharePayload(),
  shareApi: WebShareApi | undefined = globalThis.navigator,
): Promise<WebShareResult> {
  if (!shareApi || typeof shareApi.share !== "function") {
    return "unsupported";
  }

  try {
    await shareApi.share(payload);
    return "shared";
  } catch (error) {
    if (isAbortError(error)) {
      return "cancelled";
    }
    return "unsupported";
  }
}

export function copyWithExecCommand(text: string): boolean {
  if (typeof document === "undefined") {
    return false;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.setAttribute("aria-hidden", "true");
  textarea.style.position = "fixed";
  textarea.style.top = "0";
  textarea.style.left = "0";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  textarea.setSelectionRange(0, text.length);

  try {
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    textarea.remove();
  }
}

export async function copyUrlToClipboard(
  url: string,
  clipboard: ClipboardWriter | undefined = globalThis.navigator?.clipboard,
  fallback: (text: string) => boolean = copyWithExecCommand,
): Promise<boolean> {
  try {
    if (clipboard && typeof clipboard.writeText === "function") {
      await clipboard.writeText(url);
      return true;
    }
  } catch {
    // Clipboard API can be missing or blocked; try the fallback.
  }

  try {
    return fallback(url) === true;
  } catch {
    return false;
  }
}
