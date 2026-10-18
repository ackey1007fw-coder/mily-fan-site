export * from "../../src/lib/activityMedia.ts";
import {selectActivityMedia as currentSelect, type ActivityMediaSources} from "../../src/lib/activityMedia.ts";
import type {ActivityId} from "../../src/data/activities.ts";
import {news} from "./news-before-b183.ts";

export function selectActivityMedia(id: ActivityId, sources: ActivityMediaSources={}) {
  return currentSelect(id,{...sources,newsItems:sources.newsItems ?? news});
}
