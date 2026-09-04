import type { StreamRecap, StreamRecapImage } from "./streamRecaps";

const RANKING_NOTE =
  "配信終了時にランキングを読み上げました。個人名は掲載していません。";

const STILL_W = 400;
const STILL_H = 228;

const morningStills: StreamRecapImage[] = [
  {
    src: "/media/live/mily-b53-01-cheek-tilt.svg",
    width: STILL_W,
    height: STILL_H,
    alt: "三次2日目の朝配信で、みりぃが両手を頬に当てて首をかしげている。ヘアピン、灰色のトップス、ノーメイク",
    caption: "ベストショット。頬に手",
    downloadName: "みりぃ_三次2日目朝_01_ベスト_頬に手.jpg",
  },
  {
    src: "/media/live/mily-b53-02-clasp-smile.svg",
    width: STILL_W,
    height: STILL_H,
    alt: "三次2日目の朝配信で、みりぃが両手を胸の前で組んで笑っている",
    caption: "手を組んだ笑顔",
    downloadName: "みりぃ_三次2日目朝_02_手組み笑顔.jpg",
  },
  {
    src: "/media/live/mily-b53-03-close-smile.svg",
    width: STILL_W,
    height: STILL_H,
    alt: "三次2日目の朝配信で、カメラに寄って笑っているみりぃ",
    caption: "寄りの笑顔",
    downloadName: "みりぃ_三次2日目朝_03_寄りの笑顔.jpg",
  },
  {
    src: "/media/live/mily-b53-04-suit-board.svg",
    width: STILL_W,
    height: STILL_H,
    alt: "みりぃがホワイトボードを持っている。ボードには「夜 スーツ配信」「22:30〜23:40」と書いてある",
    caption: "夜のスーツ配信ボード",
    downloadName: "みりぃ_三次2日目朝_04_スーツボード.jpg",
  },
  {
    src: "/media/live/mily-b53-05-suit-board-pose.svg",
    width: STILL_W,
    height: STILL_H,
    alt: "みりぃが夜のスーツ配信ボードを持ち、頬にペンを当てている",
    caption: "ボードとポーズ",
    downloadName: "みりぃ_三次2日目朝_05_ボードポーズ.jpg",
  },
];

/**
 * 2026年9月4日のSHOWROOM朝配信を、オーナー提供の動画で確認した配信メモ。
 * 録音音声・全文文字起こし・画面録画は公開しない。
 * かわいい実フレームを5枚掲載する。コメント・視聴者表示は写っていない。
 * LIVE STREAM の配信カード専用で、Gallery の media.ts には載せない。
 */
export const streamRecap20260904Morning: StreamRecap = {
  id: "2026-09-04-morning-gachi-showroom",
  date: "2026-09-04",
  dateLabel: "2026.09.04（金）",
  theme: "三次2日目の朝配信",
  broadcastLabel: "7:12頃〜 約31分",
  platformLabel: "SHOWROOM",
  summary:
    "MISS CIRCLE CONTEST 三次審査2日目の朝枠。ノーメイクの短い朝配信で、WEB投票とキラキラをお願いしました。ホワイトボードで、夜はスーツ配信、22:30〜23:40と案内しています。夜はメイクする予定、とも話していました。",
  image: morningStills[0],
  gallery: morningStills,
  highlights: [
    {
      timestamp: "0:00:02",
      title: "おはよう。朝は短め",
      body: "三次2日目の朝。用事があるので朝枠は短めにして、夜の方が来やすい、と話して開きました。",
    },
    {
      timestamp: "0:03:52",
      title: "二度寝して起きた朝",
      body: "本当は6時頃に起きていたのに二度寝した、と話していました。朝はペンを買いに行きたい用事もあるので、長い話は夜に回したいという流れです。",
    },
    {
      timestamp: "0:14:04",
      title: "WEB投票とキラキラ",
      body: "今日やってほしいことは、WEB投票とキラキラだと案内しました。投票はウェブからも、プロフィールからもできると伝えています。",
    },
    {
      timestamp: "0:22:49",
      title: "夜を長くする",
      body: "昼は来にくい時間でもあるので、夜の枠を伸ばそうという話になりました。朝・昼は短め、夜は長く、という方針です。",
    },
    {
      timestamp: "0:25:48",
      title: "夜はスーツ配信",
      body: "ホワイトボードに「夜 スーツ配信 22:30〜23:40」と書いて見せました。夜はこの配信のためだけにメイクするかも、と話しています。",
      quote: "夜 スーツ配信 22:30〜23:40",
    },
    {
      timestamp: "0:30:08",
      title: "おつみり、夜ね",
      body: "お昼はキュッと短くして、その代わり夜を伸ばしましょう、と締めました。おつみり、夜ね。",
    },
  ],
  goals: [
    { item: "三次通過", target: "着実に", statusThen: "継続" },
    { item: "WEB投票", target: "毎日1回", statusThen: "朝から呼びかけ" },
    { item: "キラキラ", target: "大事", statusThen: "朝から呼びかけ" },
    { item: "夜枠", target: "22:30〜23:40 スーツ", statusThen: "ボードで案内" },
  ],
  ranking: [RANKING_NOTE],
  timeline: [
    { timestamp: "0:00:00", label: "三次2日目の朝。短めのあいさつ" },
    { timestamp: "0:03:52", label: "二度寝。6時起きのつもりだった" },
    { timestamp: "0:14:04", label: "WEB投票とキラキラのお願い" },
    { timestamp: "0:22:49", label: "夜を長くする相談" },
    { timestamp: "0:25:48", label: "夜はメイクする予定" },
    { timestamp: "0:26:40", label: "スーツ配信ボード 22:30〜23:40" },
    { timestamp: "0:28:30", label: "ランキング読み上げ" },
    { timestamp: "0:30:08", label: "昼は短く夜は長く。おつみり" },
    { timestamp: "0:30:59", label: "夜ね" },
  ],
  nextNote:
    "本人ボードの表記では、同日 22:30〜23:40 がスーツ配信です。夜はメイクする予定。WEB投票とキラキラは継続。サイト予定表の夜枠終了は 23:30 のままなので、ボード時刻との差は予定表側の更新判断になります。",
  sourceLabel: "2026年9月4日 SHOWROOM朝配信（動画確認・オーナー提供）",
  verifiedAt: "2026-09-04",
  transcriptionNote:
    "動画の音声をもとに整文しています。固有名詞やコメント名は掲載していません。録音音声・画面録画・全文文字起こしは掲載していません。かわいい実フレームを5枚掲載しています。コメント・視聴者の表示名は写っていません。",
};
