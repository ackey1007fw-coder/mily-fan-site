const FORBIDDEN_PERSONS = [
  "吉井優花子",
  "吉井 優花子",
  "夏凪里季",
  "夏凪 里季",
];

const OFFICIAL_CLAIM_RE =
  /(?<!非)公式(?:サイト|アカウント|ポータル)|公認|本人運営/;

const DATE_ONLY_RE = /^\d{4}-\d{2}-\d{2}$/;
const DATETIME_RE =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;

const EVENT_KINDS = new Set(["appearance", "stream", "event", "other"]);
const SOCIAL_PLATFORMS = new Set([
  "x",
  "instagram",
  "youtube",
  "tiktok",
  "showroom",
  "other",
]);

export function isSafeHttpUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function collectStrings(value) {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(collectStrings);
  if (value && typeof value === "object") {
    return Object.values(value).flatMap(collectStrings);
  }
  return [];
}

function assertUniqueIds(items, label, errors) {
  const seen = new Set();
  for (const item of items) {
    if (!item.id || typeof item.id !== "string") {
      errors.push(`${label} item is missing id`);
      continue;
    }
    if (seen.has(item.id)) {
      errors.push(`${label} duplicate id: ${item.id}`);
    }
    seen.add(item.id);
  }
}

function assertNoPersonMixup(item, label, errors) {
  const text = collectStrings(item).join("\n");
  for (const name of FORBIDDEN_PERSONS) {
    if (text.includes(name)) {
      errors.push(`${label} "${item.id ?? "?"}" mixes in another person: ${name}`);
    }
  }
}

function assertNoOfficialClaim(item, label, errors) {
  const text = collectStrings(item).join("\n");
  if (OFFICIAL_CLAIM_RE.test(text)) {
    errors.push(`${label} "${item.id ?? "?"}" must not claim official status`);
  }
}

function assertConfirmedUrl(url, label, id, errors) {
  if (!url || !isSafeHttpUrl(url)) {
    errors.push(`${label} "${id}" needs a confirmed http(s) URL`);
  }
}

export function verifyNews(items) {
  const errors = [];
  assertUniqueIds(items, "news", errors);
  for (const item of items) {
    if (!item.title || !item.body) {
      errors.push(`news "${item.id ?? "?"}" is missing title or body`);
    }
    if (!DATE_ONLY_RE.test(item.date ?? "")) {
      errors.push(`news "${item.id ?? "?"}" date must be YYYY-MM-DD`);
    }
    assertConfirmedUrl(item.source, "news", item.id ?? "?", errors);
    if (item.url) assertConfirmedUrl(item.url, "news", item.id ?? "?", errors);
    assertNoPersonMixup(item, "news", errors);
    assertNoOfficialClaim(item, "news", errors);
  }
  return errors;
}

export function verifyEvents(items) {
  const errors = [];
  assertUniqueIds(items, "events", errors);
  for (const item of items) {
    if (!item.title) errors.push(`events "${item.id ?? "?"}" is missing title`);
    if (item.timezone !== "Asia/Tokyo") {
      errors.push(`events "${item.id ?? "?"}" timezone must be Asia/Tokyo`);
    }
    if (!EVENT_KINDS.has(item.kind)) {
      errors.push(`events "${item.id ?? "?"}" has an invalid kind`);
    }
    if (!DATE_ONLY_RE.test(item.startAt ?? "") && !DATETIME_RE.test(item.startAt ?? "")) {
      errors.push(`events "${item.id ?? "?"}" startAt must be date-only or datetime`);
    }
    if (
      item.endAt &&
      !DATE_ONLY_RE.test(item.endAt) &&
      !DATETIME_RE.test(item.endAt)
    ) {
      errors.push(`events "${item.id ?? "?"}" endAt must be date-only or datetime`);
    }
    assertConfirmedUrl(item.source, "events", item.id ?? "?", errors);
    if (item.url) assertConfirmedUrl(item.url, "events", item.id ?? "?", errors);
    assertNoPersonMixup(item, "events", errors);
    assertNoOfficialClaim(item, "events", errors);
  }
  return errors;
}

export function verifySocials(items) {
  const errors = [];
  assertUniqueIds(items, "socials", errors);
  for (const item of items) {
    if (item.confirmed !== true) {
      errors.push(`socials "${item.id ?? "?"}" must be confirmed`);
    }
    if (!item.label) errors.push(`socials "${item.id ?? "?"}" is missing label`);
    if (!SOCIAL_PLATFORMS.has(item.platform)) {
      errors.push(`socials "${item.id ?? "?"}" has an invalid platform`);
    }
    assertConfirmedUrl(item.url, "socials", item.id ?? "?", errors);
    assertNoPersonMixup(item, "socials", errors);
    assertNoOfficialClaim(item, "socials", errors);
  }
  return errors;
}

export function verifyLinks(items) {
  const errors = [];
  assertUniqueIds(items, "links", errors);
  for (const item of items) {
    if (!item.label) errors.push(`links "${item.id ?? "?"}" is missing label`);
    assertConfirmedUrl(item.url, "links", item.id ?? "?", errors);
    assertNoPersonMixup(item, "links", errors);
    assertNoOfficialClaim(item, "links", errors);
  }
  return errors;
}

export function verifyHighlights(items) {
  const errors = [];
  assertUniqueIds(items, "highlights", errors);
  for (const item of items) {
    if (!item.title) errors.push(`highlights "${item.id ?? "?"}" is missing title`);
    if (!Number.isInteger(item.year)) {
      errors.push(`highlights "${item.id ?? "?"}" needs a year`);
    }
    assertConfirmedUrl(item.source, "highlights", item.id ?? "?", errors);
    assertNoPersonMixup(item, "highlights", errors);
    assertNoOfficialClaim(item, "highlights", errors);
  }
  return errors;
}

export function verifyFacts(items) {
  const errors = [];
  for (const item of items) {
    const id = item.label ?? "?";
    if (!item.label || !item.value) {
      errors.push(`profile fact "${id}" is missing label or value`);
    }
    assertConfirmedUrl(item.source, "profile fact", id, errors);
    assertNoPersonMixup(item, "profile fact", errors);
    assertNoOfficialClaim(item, "profile fact", errors);
  }
  return errors;
}

export function verifyAllContent({ news, events, socials, links, highlights, facts }) {
  return [
    ...verifyNews(news),
    ...verifyEvents(events),
    ...verifySocials(socials),
    ...verifyLinks(links),
    ...verifyHighlights(highlights),
    ...verifyFacts(facts),
  ];
}
