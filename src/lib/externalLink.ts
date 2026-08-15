const ALLOWED_PROTOCOLS = new Set(["http:", "https:"]);

export function isSafeHttpUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ALLOWED_PROTOCOLS.has(parsed.protocol);
  } catch {
    return false;
  }
}

export function toSafeHref(url: string): string | null {
  return isSafeHttpUrl(url) ? url : null;
}
