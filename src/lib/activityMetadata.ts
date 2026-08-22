import { canonicalUrl, activitiesUrl, activityUrl, site } from "../data/site.ts";
import {
  activityByRoute,
  isActivitiesHubRoute,
} from "./activityRoute.ts";

export type ActivityPageMetadata = {
  title: string;
  description: string;
  canonical: string;
  breadcrumbLabel: string;
};

export function activityPageMetadata(pathname: string): ActivityPageMetadata {
  if (isActivitiesHubRoute(pathname)) {
    return {
      title: "みりぃの活動｜Activities｜ファン制作・非公式サイト",
      description:
        "MISS CIRCLE、ラジオ、ライブ配信、CAMPUS GIRLSでのみりぃ（三橋莉子 / Mily）さんの活動を、確認済み情報からたどるファン制作の非公式ページです。",
      canonical: activitiesUrl(),
      breadcrumbLabel: "Activities",
    };
  }

  const activity = activityByRoute(pathname);
  if (!activity) {
    throw new Error(`Unknown Activity route: ${pathname}`);
  }

  return {
    title: `${activity.label}｜みりぃの活動｜ファン制作・非公式サイト`,
    description: `${activity.summary} みりぃ（三橋莉子 / Mily）さんを応援する、ファン制作の非公式活動ページです。`,
    canonical: activityUrl(activity.route),
    breadcrumbLabel: activity.label,
  };
}

export function activityPageStructuredData(pathname: string): object {
  const metadata = activityPageMetadata(pathname);
  const detail = activityByRoute(pathname);
  const breadcrumbs = [
    {
      "@type": "ListItem",
      position: 1,
      name: "ホーム",
      item: canonicalUrl(),
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Activities",
      item: activitiesUrl(),
    },
  ];

  if (detail) {
    breadcrumbs.push({
      "@type": "ListItem",
      position: 3,
      name: detail.label,
      item: activityUrl(detail.route),
    });
  }

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
        itemListElement: breadcrumbs,
      },
    ],
  };
}
