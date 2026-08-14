export const site = {
  repoName: "milly-fan-site",
  repoFullName: "ackey1007fw-coder/milly-fan-site",
  displayTitle: "みりぃ ファンサイト",
  shortTitle: "みりぃ",
  description:
    "みりぃ（三橋莉子）さんの活動情報を、確認できた範囲だけまとめるファン制作の非公式サイトです。公式・公認・本人運営ではありません。",
  locale: "ja_JP",
  language: "ja",
  /**
   * Planned public origin after Vercel is connected in a later phase.
   * This v1 does not create or deploy a Vercel project.
   */
  siteUrl: "https://milly-fan-site.vercel.app",
  ogImagePath: "/og.png",
  themeColor: "#f6f3ee",
} as const;

export type Site = typeof site;
