import type { StreamRecap, StreamRecapImage } from "./streamRecaps";

const RANKING_NOTE =
  "配信終了時に、13位から1位までランキングを読み上げました。個人名は掲載していません。";

const LUNCH_STILL_W = 1280;
const LUNCH_STILL_H = 720;

const gachiLunchCover: StreamRecapImage = {
  src: "/media/live/mily-b53-01-close-smile.svg",
  width: LUNCH_STILL_W,
  height: LUNCH_STILL_H,
  alt: "三次初日の昼配信で、黒のドット柄トップスとベージュのシュシュのみりぃが画面に寄って笑っている",
  caption: "エンディング近くの笑顔。サムネイル",
};

const gachiLunchStills: StreamRecapImage[] = [
  {
    src: "/media/live/mily-b53-02-ouen-board.svg",
    width: LUNCH_STILL_W,
    height: LUNCH_STILL_H,
    alt: "三次初日の昼配信で、応援方法の紙を持ち笑顔のみりぃ。紙には1日1回WEB投票、キラキラ星100個、指定ギフトと書かれている",
    caption: "応援方法の紙",
    downloadName: "みりぃ_三次初日昼_02_応援ボード.jpg",
  },
  gachiLunchCover,
  {
    src: "/media/live/mily-b53-03-finger-hearts.svg",
    width: LUNCH_STILL_W,
    height: LUNCH_STILL_H,
    alt: "三次初日の昼配信で、黒のドット柄トップスのみりぃが両手で指ハートを作っている",
    caption: "指ハート",
    downloadName: "みりぃ_三次初日昼_03_指ハート.jpg",
  },
  {
    src: "/media/live/mily-b53-04-big-smile.svg",
    width: LUNCH_STILL_W,
    height: LUNCH_STILL_H,
    alt: "三次初日の昼配信で、黒のドット柄トップスのみりぃが大きく笑っている",
    caption: "大きな笑顔",
    downloadName: "みりぃ_三次初日昼_04_笑顔.jpg",
  },
];

export const streamRecap20260903Lunch: StreamRecap = {
  id: "2026-09-03-lunch-gachi-showroom",
  date: "2026-09-03",
  dateLabel: "2026.09.03（木）",
  theme: "三次初日の昼配信",
  broadcastLabel: "14:40頃〜 約40分",
  platformLabel: "SHOWROOM",
  summary:
    "MISS CIRCLE CONTEST 三次審査1日目の昼枠。朝のあと外出してから、メイクした状態で配信しました。応援方法の紙を見せ、いちばんお願いしたいのは1日1回のWEB投票とキラキラ星100個、と話しています。目標は三次通過とアバター権。夜枠は21:00〜21:50。",
  image: gachiLunchCover,
  gallery: gachiLunchStills,
  highlights: [
    {
      timestamp: "0:01:20",
      title: "メイクして戻ってきた昼枠",
      body: "朝枠のあと外に出て、戻ってからフルメイクで配信しました。内容の詳細は言わないで、と念を押しています。メイクのときは盛れる、という話になりました。",
    },
    {
      timestamp: "0:03:20",
      title: "応援方法の紙",
      body: "印刷した紙を見せました。1日1回のWEB投票、キラキラ星100個、指ハート・祝い花・パネルくまなどの指定ギフト、の順です。看板はまだ足りない、夜枠で画面が変わるかも、とも話しています。",
    },
    {
      timestamp: "0:08:30",
      title: "通過とアバター権",
      body: "今の目標は三次審査を通過すること、そしてアバター権を獲得すること。ブロック1位は今回狙わないが、油断はしないので配信は多め、と説明しました。",
      quote: "私の今の目標としては三次審査を通過することです",
    },
    {
      timestamp: "0:19:20",
      title: "15時の100キラ",
      body: "枠の途中で15時になり、キラキラ星100個をお願いしました。15時以降でも夜でも投げられる、と伝えています。",
    },
    {
      timestamp: "0:32:20",
      title: "トマトの栄養素",
      body: "ファンネームはトマトが好きだからではなく、あだ名のリコからリコピンへつながっている、と改めて話しました。今月70人を目指しています。",
    },
  ],
  goals: [
    { item: "三次通過", target: "最優先", statusThen: "1日目" },
    { item: "WEB投票", target: "毎日1回", statusThen: "バナーから案内" },
    { item: "キラキラ星100", target: "大事", statusThen: "15時に呼びかけ" },
    { item: "アバター権", target: "獲得", statusThen: "未獲得" },
    { item: "トマトの栄養素", target: "70人", statusThen: "呼びかけ継続" },
  ],
  ranking: [RANKING_NOTE],
  timeline: [
    { timestamp: "0:00:00", label: "暑い・お腹空いた。メイクして帰宅" },
    { timestamp: "0:01:20", label: "外出から戻った話。詳細は言わない" },
    { timestamp: "0:03:20", label: "応援方法の紙。投票と100キラ" },
    { timestamp: "0:08:30", label: "三次通過とアバター権" },
    { timestamp: "0:16:10", label: "15時の100キラ予告" },
    { timestamp: "0:19:20", label: "15時。キラキラ100のお願い" },
    { timestamp: "0:29:30", label: "パーソナルカラーはブルベ夏" },
    { timestamp: "0:32:20", label: "トマトの栄養素の由来" },
    { timestamp: "0:35:30", label: "長時間枠をどこかでやりたい" },
    { timestamp: "0:37:40", label: "ランキング読み上げ" },
    { timestamp: "0:38:50", label: "夜は21:00〜21:50。投票はバナーから" },
  ],
  nextNote:
    "同日 21:00〜21:50 が夜枠として案内されました。長く話したいので、どこかのタイミングで枠を組み替えるかもしれない、とも話しています。WEB投票はバナーから。",
  sourceLabel: "2026年9月3日 SHOWROOM昼配信（動画確認・オーナー提供）",
  verifiedAt: "2026-09-04",
  transcriptionNote:
    "動画の音声をもとに整文しています。固有名詞やコメント名は掲載していません。録音音声・画面録画・全文文字起こしは掲載していません。サムネイルとスクショは録画の実フレームです。表示用にLanczosで拡大していますが、顔の生成・補正はしていません。フォロワー数や目標の数字は配信時点の記録です。",
};
