import { contest } from "../data/contest.ts";
import { profile } from "../data/profile.ts";
import { socials } from "../data/socials.ts";
import { canonicalUrl, profileUrl, site } from "../data/site.ts";

export const homePageMetadata = {
  title: "三橋莉子（みりぃ）非公式ファンサイト｜ミスサークル2026応援",
  description:
    "三橋莉子（みりぃ / Mily）さんの非公式ファンサイトです。MISS CIRCLE CONTEST 2026（ミスサークル）ENTRY 734 の応援、配信予定、写真をまとめています。ファン運営であり、本人運営ではありません。",
  canonical: canonicalUrl(),
} as const;

const PERSON_ID = `${canonicalUrl()}#person`;
const WEBSITE_ID = `${canonicalUrl()}#website`;

export function homePageStructuredData(): {
  "@context": string;
  "@graph": Array<Record<string, unknown>>;
} {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        name: `${site.displayTitle}（非公式）`,
        alternateName: [
          "三橋莉子（みりぃ）非公式ファンサイト",
          "みりぃ 非公式ファンサイト",
        ],
        url: homePageMetadata.canonical,
        inLanguage: site.language,
        description: homePageMetadata.description,
        about: { "@id": PERSON_ID },
      },
      {
        "@type": "Person",
        "@id": PERSON_ID,
        name: profile.publicName,
        alternateName: [profile.displayName, "Mily", "ミリー"],
        url: profileUrl(),
        description:
          "MISS CIRCLE CONTEST 2026（ミスサークル）ENTRY 734。この人物情報はファン制作の非公式ファンサイトに掲載しており、本人運営ではありません。",
        sameAs: [...socials.map((social) => social.url), contest.entryUrl],
      },
    ],
  };
}
