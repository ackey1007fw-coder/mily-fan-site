export const site = {
  repoName: "mily-fan-site",
  repoFullName: "ackey1007fw-coder/mily-fan-site",
  displayTitle: "みりぃ ファンサイト",
  shortTitle: "みりぃ",
  description:
    "みりぃ（三橋莉子 / Mily）さんを応援する、ファン制作の非公式サイトです。公式・公認・本人運営ではありません。",
  locale: "ja_JP",
  language: "ja",
  /**
   * Public origin of the current Vercel deployment.
   */
  siteUrl: "https://mily-fan-site.vercel.app",
  ogImagePath: "/og.png",
  themeColor: "#f6f3ee",
} as const;

export type Site = typeof site;

export function siteOrigin(): string {
  return site.siteUrl.replace(/\/+$/, "");
}

export function canonicalUrl(): string {
  return `${siteOrigin()}/`;
}

export function profileUrl(): string {
  return `${siteOrigin()}/profile/`;
}

export function storyUrl(slug: string): string {
  return `${siteOrigin()}/stories/${slug}/`;
}

export function ogImageUrl(): string {
  const imagePath = site.ogImagePath.startsWith("/")
    ? site.ogImagePath
    : `/${site.ogImagePath}`;
  return `${siteOrigin()}${imagePath}`;
}

export function robotsTxt(): string {
  return `User-agent: *\nAllow: /\n\nSitemap: ${siteOrigin()}/sitemap.xml\n`;
}

export function sitemapXml(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${canonicalUrl()}</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${profileUrl()}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${storyUrl("second-round-2026")}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
`;
}
