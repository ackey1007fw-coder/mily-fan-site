export * from "../../src/data/portalFeed.ts";
import {
  createPortalFeed as createCurrentPortalFeed,
  type CreatePortalFeedInput,
  type PortalFeed,
} from "../../src/data/portalFeed.ts";
import { news } from "./news-before-b41.ts";

export function createPortalFeed(
  input: CreatePortalFeedInput = {},
): PortalFeed {
  return createCurrentPortalFeed({
    ...input,
    newsItems: input.newsItems ?? news,
  });
}
