/**
 * Photo from Mily's Instagram Story on the morning of 2026-11-14: a two-panel
 * car selfie collage she designed ("OHAYO :)").
 * Intake route: owner-designated story — the owner specified this exact
 * story on 2026-11-14 and asked for publication on NEWS and the Gallery.
 * The provenance master is the owner's supplied screen recording, kept
 * outside the repo. The published image is a clean full frame of that
 * recording (no phone UI), converted to JPEG with metadata stripped.
 * Story share URLs are temporary, so per the repo Story rules no URL is
 * recorded here; the display source is the non-link "Instagram Story" label.
 * The story's audio (a commercial song) is not published.
 */
const photo = {
  id: "mily-b265-01",
  kind: "photo" as const,
  basePath: "/media/gallery/mily-b265-01-20261114-story-ohayo-car",
  widths: [480, 960, 1600] as const,
  width: 720,
  height: 1280,
  alt: "車の中で少し横を向くみりぃ（上）と、ウインクして手書きの「OHAYO :)」を添えたみりぃ（下）の、2コマのセルフィー",
  caption:
    "2026年11月14日朝の本人Instagram Story。Hump Back「僕らは今日も車の中」のスタンプと、手書きの「OHAYO :)」。",
  provenance: "owner-provided" as const,
  sourceUrl: null,
  sourceDate: "2026-11-14",
  credit: null,
  aspect: "720 / 1280",
  published: true,
};

export const storyOhayoPhotos = [photo];

export const storyOhayoNewsImage = {
  kind: "image" as const,
  src: photo.basePath + "-1600.jpg",
  srcSet: photo.widths
    .map((target) => photo.basePath + "-" + target + ".jpg " + Math.min(target, photo.width) + "w")
    .join(", "),
  webpSrcSet: photo.widths
    .map((target) => photo.basePath + "-" + target + ".webp " + Math.min(target, photo.width) + "w")
    .join(", "),
  sizes: "(min-width: 640px) 24rem, 100vw",
  width: photo.width,
  height: photo.height,
  alt: photo.alt,
};
