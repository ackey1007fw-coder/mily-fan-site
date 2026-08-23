import {
  canonicalUrl,
  galleryUrl,
  newsUrl,
  site,
  storiesIndexUrl,
} from "../data/site.ts";
import {
  GALLERY_ARCHIVE_ROUTE,
  NEWS_ARCHIVE_ROUTE,
  STORIES_ARCHIVE_ROUTE,
} from "./homePortal.ts";

export type ArchivePageMetadata = {
  title: string;
  description: string;
  canonical: string;
  breadcrumbLabel: string;
};

const archives = {
  [NEWS_ARCHIVE_ROUTE]: {
    title: "みりぃの最新情報｜NEWS｜ファン制作・非公式サイト",
    description:
      "みりぃ（三橋莉子 / Mily）さんの確認済みの近況とお知らせをまとめる、ファン制作の非公式NEWSページです。",
    canonical: newsUrl(),
    breadcrumbLabel: "最新情報",
  },
  [STORIES_ARCHIVE_ROUTE]: {
    title: "みりぃのSTORY｜読み物｜ファン制作・非公式サイト",
    description:
      "みりぃ（三橋莉子 / Mily）さんの本人の言葉と、その日の記録を読む、ファン制作の非公式STORY一覧です。",
    canonical: storiesIndexUrl(),
    breadcrumbLabel: "STORY",
  },
  [GALLERY_ARCHIVE_ROUTE]: {
    title: "みりぃのギャラリー｜写真と動画｜ファン制作・非公式サイト",
    description:
      "みりぃ（三橋莉子 / Mily）さんの確認済みの写真と動画をまとめる、ファン制作の非公式ギャラリーです。",
    canonical: galleryUrl(),
    breadcrumbLabel: "ギャラリー",
  },
} as const;

export function archivePageMetadata(
  pathname: string,
): ArchivePageMetadata | null {
  const normalized = pathname.endsWith("/") ? pathname : `${pathname}/`;
  return archives[normalized as keyof typeof archives] ?? null;
}

export function archivePageStructuredData(pathname: string): object | null {
  const metadata = archivePageMetadata(pathname);
  if (!metadata) return null;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: metadata.breadcrumbLabel,
        description: metadata.description,
        url: metadata.canonical,
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
            name: metadata.breadcrumbLabel,
            item: metadata.canonical,
          },
        ],
      },
    ],
  };
}
