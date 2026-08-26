/**
 * 2026-08-26 の本人Instagram Story。配信への感謝を書いた縦長グラフィック。
 * HOME Latest / /news/ 専用。Gallery と /stories/ には展開しない。
 * 元素材相当の公開JPEGは metadata 除去のみ。表示は Gallery と同じ
 * 480 / 960 / 1600 の jpg+webp 派生を srcset で出す（構図のクロップはしない）。
 * 恒久permalinkはないため sourceUrl は持たない。
 */
const BASE = "/media/news/mily-b27-03-morning-stream-thanks";
const WIDTHS = [480, 960, 1600] as const;

function srcSetFor(format: "jpg" | "webp"): string {
  return WIDTHS.map((width) => `${BASE}-${width}.${format} ${width}w`).join(", ");
}

/** Metadata-stripped full still. Kept as an immutable published file; not the NEWS `src`. */
export const morningStreamThanksSourceSrc =
  "/media/news/mily-b27-03-morning-stream-thanks.jpg";

export const morningStreamThanksInstagramStoryImage = {
  id: "mily-b27-03-morning-stream-thanks",
  kind: "image" as const,
  src: `${BASE}-1600.jpg`,
  srcSet: srcSetFor("jpg"),
  webpSrcSet: srcSetFor("webp"),
  sizes: "(min-width: 640px) 24rem, 100vw",
  width: 1600,
  height: 2844,
  alt: "配信への感謝と、明日からも前向きに頑張れそうという気持ちを白い背景に書いたみりぃのInstagram Story",
  caption:
    "2026年8月26日の本人Instagram Story。その日の配信に来てくれたことへの感謝と、応援を無駄にしないという言葉が書かれている。",
  provenance: "owner-provided",
  sourceDate: "2026-08-26",
} as const;
