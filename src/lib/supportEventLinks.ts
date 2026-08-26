import type { SiteLink } from "../data/links.ts";
import type { SupportEvent } from "../data/supportEvents.ts";
import { displayStatus } from "./supportCalendar.ts";

/**
 * SupportEvent が所有するリンクは、確認済み期間中だけ行動導線として表示する。
 * SupportEvent と無関係な常設リンクはそのまま表示できる。
 */
export function isSupportEventLinkActive(input: {
  linkId: string;
  supportEvents: SupportEvent[];
  now: number;
}): boolean {
  if (!Number.isFinite(input.now)) {
    throw new Error("now must be a finite timestamp");
  }

  const owners = input.supportEvents.filter(
    ({ ctaLinkId }) => ctaLinkId === input.linkId,
  );
  if (owners.length === 0) return true;
  return owners.some(
    ({ schedule }) => displayStatus(schedule, input.now) === "live",
  );
}

export function isSupportEventUrlActive(input: {
  url: string;
  links: SiteLink[];
  supportEvents: SupportEvent[];
  now: number;
}): boolean {
  const link = input.links.find(({ url }) => url === input.url);
  if (!link) return true;
  return isSupportEventLinkActive({
    linkId: link.id,
    supportEvents: input.supportEvents,
    now: input.now,
  });
}
