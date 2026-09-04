import { streamRecap20260904Day } from "./streamRecap20260904Day.ts";
import { streamRecap20260903Night } from "./streamRecap20260903Night.ts";
import { streamRecap20260903 } from "./streamRecap20260903.ts";
import { streamRecap20260902 } from "./streamRecap20260902.ts";
import { streamRecap20260902Night } from "./streamRecap20260902Night.ts";

export type StreamRecapHighlight = {
  timestamp: string;
  title: string;
  body: string;
  quote?: string;
};

export type StreamRecapGoal = {
  item: string;
  target: string;
  statusThen: string;
};

export type StreamRecapTimelineItem = {
  timestamp: string;
  label: string;
};

export type StreamRecapImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption?: string;
  downloadName?: string;
};

export type StreamRecapGalleryZip = {
  src: string;
  filename: string;
  label: string;
};

export type StreamRecap = {
  id: string;
  date: string;
  dateLabel: string;
  theme: string;
  broadcastLabel: string;
  platformLabel: string;
  summary: string;
  image?: StreamRecapImage;
  gallery?: StreamRecapImage[];
  galleryZip?: StreamRecapGalleryZip;
  highlights: StreamRecapHighlight[];
  goals: StreamRecapGoal[];
  ranking: string[];
  timeline: StreamRecapTimelineItem[];
  nextNote: string;
  sourceLabel: string;
  verifiedAt: string;
  transcriptionNote: string;
};

export {
  streamRecap20260904Day,
  streamRecap20260903Night,
  streamRecap20260903,
  streamRecap20260902Night,
  streamRecap20260902,
};

/** 新しい配信メモを先頭へ。 */
export const streamRecaps: StreamRecap[] = [
  streamRecap20260904Day,
  streamRecap20260903Night,
  streamRecap20260903,
  streamRecap20260902Night,
  streamRecap20260902,
];
