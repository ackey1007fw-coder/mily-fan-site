import type { NewsItem } from "../data/news.ts";
import { site } from "../data/site.ts";

export function newsPublicationUrl(item: Pick<NewsItem, "id" | "relatedUrl" | "publicationArticle">): string {
  if (item.publicationArticle) {
    const url = new URL(item.publicationArticle.url, site.siteUrl);
    if (url.origin !== site.siteUrl || url.search || url.username || url.password) throw new Error("Invalid publication article URL");
    return url.href;
  }
  return `${site.siteUrl}/news/#news-${encodeURIComponent(item.id)}`;
}

export function publicationShare(title: string, url: string) {
  const text = `みりぃファンサイトを更新しました。\n${title}\nファン運営・非公式のご案内です。`;
  return { text, url, manualXUrl: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}` };
}
