import { canonicalUrl, site, supportUrl } from "../data/site.ts";

export const supportPageMetadata = {
  title: "みりぃを応援する｜Support｜ファン運営・非公式サイト",
  description:
    "みりぃ（三橋莉子 / Mily）さんの今できる応援、今日の確認済み予定、日程発表待ちの情報をまとめる、ファン運営の非公式Supportページです。",
  canonical: supportUrl(),
  breadcrumbLabel: "Support",
} as const;

export function supportPageStructuredData(): object {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: supportPageMetadata.breadcrumbLabel,
        description: supportPageMetadata.description,
        url: supportPageMetadata.canonical,
        inLanguage: site.language,
        isPartOf: {
          "@type": "WebSite",
          name: `${site.displayTitle}（非公式）`,
          url: canonicalUrl(),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "ホーム",
            item: canonicalUrl(),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Support",
            item: supportUrl(),
          },
        ],
      },
    ],
  };
}
