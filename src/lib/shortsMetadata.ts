import { canonicalUrl, shortsUrl, site } from "../data/site.ts";

export const shortsPageMetadata = {
  title: "みりぃのショート動画 | みりぃ ファンサイト（非公式）",
  description: "みりぃ（三橋莉子 / Mily）さんの公開済みSHOWROOM切り抜き35本。朝の声、笑顔、かわいい仕草を配信日から探せるファン編集・非公式アーカイブ。",
  canonical: shortsUrl(),
} as const;

export function shortsPageStructuredData(): object {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "みりぃのショート動画",
    description: shortsPageMetadata.description,
    url: shortsPageMetadata.canonical,
    inLanguage: site.language,
    isPartOf: {
      "@type": "WebSite",
      name: site.displayTitle + "（非公式）",
      url: canonicalUrl(),
    },
  };
}
