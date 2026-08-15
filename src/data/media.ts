/**
 * Photos and later videos. Keep this empty rather than adding unverified media.
 * Local photo files live in /public/media and must start with `mily-`.
 */
export type MediaKind = "photo" | "video";

export type MediaItem = {
  id: string;
  kind: MediaKind;
  src: string;
  alt: string;
  caption?: string;
  source: string;
  featured?: boolean;
};

const BIRTHDAY_POST = "https://www.instagram.com/p/DbiY3PHk1c8/";

export const media: MediaItem[] = [
  {
    id: "birthday-21-01",
    kind: "photo",
    src: "/media/mily-birthday-21-01.jpg",
    alt: "花束を持って笑うみりぃの写真。21歳の誕生日投稿より",
    caption: "21歳の誕生日投稿より",
    source: BIRTHDAY_POST,
    featured: true,
  },
  {
    id: "birthday-21-02",
    kind: "photo",
    src: "/media/mily-birthday-21-02.jpg",
    alt: "花束を持ったみりぃの写真",
    caption: "花束を持って",
    source: BIRTHDAY_POST,
  },
  {
    id: "birthday-21-03",
    kind: "photo",
    src: "/media/mily-birthday-21-03.jpg",
    alt: "花束を持ったみりぃのクローズアップ",
    caption: "21歳の誕生日投稿より",
    source: BIRTHDAY_POST,
  },
  {
    id: "birthday-21-04",
    kind: "photo",
    src: "/media/mily-birthday-21-04.jpg",
    alt: "花束とバッグを持ったみりぃの写真",
    caption: "花束を持って",
    source: BIRTHDAY_POST,
  },
  {
    id: "birthday-21-05",
    kind: "photo",
    src: "/media/mily-birthday-21-05.jpg",
    alt: "Happy Birthday & Riko と書かれたプレートと花束",
    caption: "誕生日のテーブル",
    source: BIRTHDAY_POST,
  },
];

export function featuredPhoto(items: MediaItem[] = media): MediaItem | undefined {
  return items.find((item) => item.kind === "photo" && item.featured);
}

export function visibleMedia(items: MediaItem[] = media): MediaItem[] {
  return [...items];
}
