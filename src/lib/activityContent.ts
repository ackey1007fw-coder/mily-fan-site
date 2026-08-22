import {
  activities,
  type Activity,
  type ActivityId,
} from "../data/activities.ts";
import { highlights, type Highlight } from "../data/highlights.ts";
import { links } from "../data/links.ts";
import { news, sortNewsByDateDesc, type NewsItem } from "../data/news.ts";
import { profileSources } from "../data/profile.ts";
import { socials } from "../data/socials.ts";
import { stories, type Story } from "../data/stories.ts";
import {
  selectActivityMedia,
  type ActivityMediaItem,
} from "./activityMedia.ts";

export type ActivityResourceKind =
  | "personal-social"
  | "related-link"
  | "source";

export type ActivityResource = {
  id: string;
  kind: ActivityResourceKind;
  label: string;
  url: string;
  note?: string;
};

function requiredById<T extends { id: string }>(
  records: T[],
  id: string,
  relation: string,
): T {
  const record = records.find((item) => item.id === id);
  if (!record) throw new Error(`Missing ${relation} relation: ${id}`);
  return record;
}

export function activityById(activityId: ActivityId): Activity {
  return requiredById(activities, activityId, "Activity");
}

export function selectActivityNews(
  activityId: ActivityId,
  items: NewsItem[] = news,
  limit = 3,
): NewsItem[] {
  return sortNewsByDateDesc(items)
    .filter((item) => item.activityIds?.includes(activityId))
    .slice(0, limit);
}

export function selectActivityHighlights(activityId: ActivityId): Highlight[] {
  const activity = activityById(activityId);
  return activity.relatedHighlightIds.map((id) =>
    requiredById(highlights, id, "highlight"),
  );
}

export function selectActivityStories(activityId: ActivityId): Story[] {
  const activity = activityById(activityId);
  return activity.relatedStorySlugs.map((slug) => {
    const story = stories.find((item) => item.slug === slug);
    if (!story) throw new Error(`Missing story relation: ${slug}`);
    if (!story.published) throw new Error(`Unpublished story relation: ${slug}`);
    return story;
  });
}

export function selectActivityResources(activityId: ActivityId): ActivityResource[] {
  const activity = activityById(activityId);
  const candidates: ActivityResource[] = [
    ...activity.relatedSocialIds.map((id) => {
      const social = requiredById(socials, id, "personal social");
      return {
        id: social.id,
        kind: "personal-social" as const,
        label: social.label,
        url: social.url,
        note: "本人の確認済みSNS・配信プロフィール",
      };
    }),
    ...activity.relatedLinkIds.map((id) => {
      const link = requiredById(links, id, "related link");
      return {
        id: link.id,
        kind: "related-link" as const,
        label: link.label,
        url: link.url,
        note: link.note,
      };
    }),
    ...activity.sourceIds.map((id) => {
      const source = profileSources[id];
      if (!source) throw new Error(`Missing source relation: ${id}`);
      return {
        id: source.id,
        kind: "source" as const,
        label: source.title,
        url: source.url,
        note: `${source.publisher} / ${source.verifiedAt}確認`,
      };
    }),
  ];

  const seenUrls = new Set<string>();
  return candidates.filter((resource) => {
    if (seenUrls.has(resource.url)) return false;
    seenUrls.add(resource.url);
    return true;
  });
}

export type ActivityPageContent = {
  activity: Activity;
  news: NewsItem[];
  highlights: Highlight[];
  stories: Story[];
  media: ActivityMediaItem[];
  resources: ActivityResource[];
};

export function selectActivityPageContent(
  activityId: ActivityId,
): ActivityPageContent {
  return {
    activity: activityById(activityId),
    news: selectActivityNews(activityId),
    highlights: selectActivityHighlights(activityId),
    stories: selectActivityStories(activityId),
    media: selectActivityMedia(activityId),
    resources: selectActivityResources(activityId),
  };
}
