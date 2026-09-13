import { canonicalUrl, radioMusicUrl, site } from "../data/site.ts";

export const radioMusicPageMetadata = {
  title: "ラジオで流れた楽曲 | みりぃ ファンサイト（非公式）",
  description:
    "FM湘南マジックウェイブ『湘南シーサイドサークル』で確認できたオンエア楽曲とYouTubeへの導線をまとめるファン制作・非公式アーカイブ。",
  canonical: radioMusicUrl(),
} as const;

export function radioMusicPageStructuredData(): object {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "湘南シーサイドサークル オンエア楽曲",
    description: radioMusicPageMetadata.description,
    url: radioMusicPageMetadata.canonical,
    inLanguage: site.language,
    isPartOf: {
      "@type": "WebSite",
      name: `${site.displayTitle}（非公式）`,
      url: canonicalUrl(),
    },
  };
}
