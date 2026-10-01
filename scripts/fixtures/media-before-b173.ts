export * from "../../src/data/media.ts";
import { media as currentMedia } from "../../src/data/media.ts";

/** Historical Gallery assertions written before the September 29 photo set. */
export const media = currentMedia.filter(({ id }) => !id.startsWith("mily-b173-"));
