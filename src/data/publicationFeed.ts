import { news, newsDisplayMedia } from "./news.ts";
import { stories } from "./stories.ts";
import { streamRecaps } from "./streamRecaps.ts";
import { radioEpisodes } from "./radioEpisodes.ts";
import { site } from "./site.ts";
import { newsPublicationUrl, publicationShare } from "../lib/publicationShare.ts";

export function createPublicationFeed() {
  const items = [
    ...streamRecaps.map(item => ({ id:`mily:recap:${item.id}`, kind:"article", title:item.theme, url:`${site.siteUrl}/activities/live/#recap-${item.id}` })),
    ...radioEpisodes.map(item => ({ id:`mily:radio:${item.id}`, kind:"article", title:item.theme, url:`${site.siteUrl}/activities/radio/#${item.id}-${item.milyHighlights.length ? "mily-highlights" : "songs"}` })),
    ...stories.filter(item => item.published).map(item => ({ id:`mily:story:${item.slug}`, kind:"article", title:item.title, url:new URL(item.href,site.siteUrl).href })),
    ...news.filter(item => item.publicationNotice === "important" || newsDisplayMedia(item).some(media => media.kind === "video" || ((media.kind === "tiktok" || media.kind === "mixch") && media.published))).map(item => ({ id:`mily:news:${item.id}`, kind:item.publicationNotice === "important" ? "important" : "video", title:item.title, url:newsPublicationUrl(item) })),
  ];
  return { version:1, eventKind:"site_publication", items:items.map(item => {
    const title = news.find(entry => entry.relatedUrl && newsPublicationUrl(entry) === item.url)?.title ?? item.title;
    return {...item,title,...publicationShare(title,item.url)};
  }) };
}
