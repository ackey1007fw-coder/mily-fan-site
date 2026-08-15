import {
  isValidDateOnly,
  isValidEventTimestamp,
  parseEventEndInstant,
  parseEventStartInstant,
} from "../src/data/events.ts";

const FORBIDDEN_PERSONS = [
  "吉井優花子",
  "吉井 優花子",
  "夏凪里季",
  "夏凪 里季",
];

const EVENT_KINDS = new Set(["appearance", "stream", "event", "other"]);
const MEDIA_KINDS = new Set(["photo", "video"]);
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

function stripAllowedExternalOfficialReferences(text) {
  return text
    .replaceAll("非公式", "")
    .replaceAll("公式・公認・本人運営ではありません", "")
    .replaceAll("本人運営ではありません", "")
    .replaceAll("主催者公式サイト", "")
    .replaceAll("主催者公式", "")
    .replaceAll("イベント公式サイト", "")
    .replaceAll("本人公式サイト", "")
    .replaceAll("本人公式アカウント", "")
    .replaceAll("本人公式", "")
    .replaceAll("公式チケットページ", "")
    .replaceAll("公式チケット", "")
    .replaceAll("公式ホームページ", "")
    .replaceAll("公式HP", "")
    .replaceAll("公式ページ", "")
    .replaceAll("公式発表", "")
    .replaceAll("公式アカウント", "");
}

const THIS_SITE_SUBJECT =
  /(?:この|本|当)(?:非公式)?(?:ファン)?(?:サイト|ページ)/;
const THIS_SITE_OFFICIAL_CLAIM = new RegExp(
  `${THIS_SITE_SUBJECT.source}(?:は|が|こそ)(?:本人公式サイト|イベント公式サイト|主催者公式サイト|公式|公認|本人運営)`,
);

export function claimsThisSiteIsOfficial(text) {
  if (!text) return false;
  if (THIS_SITE_OFFICIAL_CLAIM.test(text)) return true;

  const remainder = stripAllowedExternalOfficialReferences(text);
  return (
    THIS_SITE_OFFICIAL_CLAIM.test(remainder) ||
    /(?<!非)公式ファンサイト/.test(remainder) ||
    /公認ファンサイト/.test(remainder) ||
    /このサイトは(?:公式|公認|本人運営)/.test(remainder) ||
    /本サイトは(?:公式|公認|本人運営)/.test(remainder) ||
    /本人運営/.test(remainder) ||
    /(?:^|[。．\n\s])公式です/.test(remainder) ||
    /(?:^|[。．\n\s])公認です/.test(remainder) ||
    /(?:^|[。．\n\s])公式サイトです/.test(remainder) ||
    /(?:^|[。．\n\s])公認サイトです/.test(remainder)
  );
}

function assertNoOfficialClaim(item, label, errors) {
  const text = collectStrings(item).join("\n");
  if (claimsThisSiteIsOfficial(text)) {
    errors.push(`${label} "${item.id ?? "?"}" must not claim this site is official`);
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
    if (!isValidDateOnly(item.date ?? "")) {
      errors.push(`news "${item.id ?? "?"}" date must be a real YYYY-MM-DD`);
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
    if (!isValidEventTimestamp(item.startAt ?? "")) {
      errors.push(`events "${item.id ?? "?"}" startAt must be a real date-only or datetime value`);
    }
    if (item.endAt && !isValidEventTimestamp(item.endAt)) {
      errors.push(`events "${item.id ?? "?"}" endAt must be a real date-only or datetime value`);
    }
    if (
      item.endAt &&
      isValidEventTimestamp(item.startAt ?? "") &&
      isValidEventTimestamp(item.endAt)
    ) {
      const startMs = parseEventStartInstant(item.startAt).getTime();
      const endMs = parseEventEndInstant(item.endAt).getTime();
      if (endMs < startMs) {
        errors.push(
          `events "${item.id ?? "?"}" endAt must not precede startAt (${item.startAt} → ${item.endAt})`,
        );
      }
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

const MEDIA_PROVENANCES = new Set(["owner-provided", "sns-post", "third-party"]);
const MEDIA_BASENAME_RE = /^mily-b\d{2}-\d{2}(-[a-z0-9]+)+$/;

export function verifyMedia(items) {
  const errors = [];
  assertUniqueIds(items, "media", errors);
  for (const item of items) {
    const id = item.id ?? "?";
    if (!MEDIA_KINDS.has(item.kind)) {
      errors.push(`media "${id}" has an invalid kind`);
    }
    if (!item.alt) {
      errors.push(`media "${id}" is missing alt text`);
    }
    if (typeof item.basePath !== "string" || !item.basePath.startsWith("/media/")) {
      errors.push(`media "${id}" basePath must live under /media/`);
    } else {
      const basename = item.basePath.split("/").pop() ?? "";
      if (!MEDIA_BASENAME_RE.test(basename)) {
        errors.push(
          `media "${id}" filename must match mily-bNN-NN-<slug> (got "${basename}")`,
        );
      }
    }
    if (
      !Array.isArray(item.widths) ||
      item.widths.length === 0 ||
      item.widths.some((w, i) => !Number.isInteger(w) || w <= 0 || (i > 0 && w <= item.widths[i - 1]))
    ) {
      errors.push(`media "${id}" widths must be ascending positive integers`);
    }
    if (!Number.isInteger(item.width) || !Number.isInteger(item.height)) {
      errors.push(`media "${id}" needs intrinsic width/height`);
    }
    if (!MEDIA_PROVENANCES.has(item.provenance)) {
      errors.push(`media "${id}" has an invalid provenance`);
    }
    if (item.sourceUrl !== null) {
      assertConfirmedUrl(item.sourceUrl, "media", id, errors);
    } else if (item.provenance === "sns-post") {
      errors.push(`media "${id}" claims sns-post provenance but has no sourceUrl`);
    }
    if (item.provenance === "third-party" && !item.credit) {
      errors.push(`media "${id}" is third-party but has no credit`);
    }
    if (item.sourceDate !== null && !isValidDateOnly(item.sourceDate ?? "")) {
      errors.push(`media "${id}" sourceDate must be null or a real YYYY-MM-DD`);
    }
    if (typeof item.published !== "boolean") {
      errors.push(`media "${id}" must set published explicitly`);
    }
    assertNoPersonMixup(item, "media", errors);
    assertNoOfficialClaim(item, "media", errors);
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

export function verifyAllContent({
  news,
  events,
  socials,
  links,
  highlights,
  facts,
  media = [],
}) {
  return [
    ...verifyNews(news),
    ...verifyEvents(events),
    ...verifySocials(socials),
    ...verifyLinks(links),
    ...verifyHighlights(highlights),
    ...verifyFacts(facts),
    ...verifyMedia(media),
  ];
}
