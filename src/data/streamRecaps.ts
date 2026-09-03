/**
 * LIVE STREAM（/activities/live/）の配信メモ。
 *
 * 書き方・掲載可否・文字数などの統一ルールは docs/LIVE-STREAM-RECAP.md。
 * 数値と書式は scripts/stream-recaps.test.mjs が全カードを検査する。
 * どのエージェントが追記しても同じ形になるよう、共通文は下の定数と
 * buildTranscriptionNote() から組み立て、カードごとに書き下ろさない。
 */

export type StreamRecapHighlight = {
  timestamp: string;
  title: string;
  body: string;
  quote?: string;
};

export type StreamRecapGoal = {
  item: string;
  /** 目指す値・状態。「配信時点」の状態は statusThen へ。 */
  target: string;
  /** 配信時点の状態。UI側が「配信時点」と表示するので語を重ねない。 */
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
  /** 「朝／昼／夕／夜」で始める短い回タイトル。 */
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

/**
 * ランキングは順位だけを事実として残し、個人名は回を問わず載せない。
 * 読み上げた範囲は回ごとに違うので、確認できた範囲で組み立てる。
 * 読み上げがなかった回は `ranking: []` にする（読み上げた事実を作らない）。
 */
export function buildRankingNote(fromPlace: number, toPlace: number): string {
  return `配信終了時に、${fromPlace}位から${toPlace}位までランキングを読み上げました。個人名は掲載していません。`;
}

/** これまでに確認できた回はいずれも13位から1位まで。 */
export const RANKING_NOTE = buildRankingNote(13, 1);

/** 全カード共通の非掲載範囲。回ごとに言い換えない。 */
export const RECAP_WITHHOLD_NOTE =
  "録音音声・画面録画・全文文字起こしは掲載していません。視聴者の表示名・コメント画面も載せていません。";

/** 全カード共通の数字の扱い。 */
export const RECAP_FIGURES_NOTE = "フォロワー数や目標の数字は配信時点の記録です。";

/**
 * 注記は「素材 → 非掲載範囲 → 静止画 → 補足 → 数字」の順で必ず組み立てる。
 * 回ごとに違うのは material / stills / extra だけ。
 */
export function buildTranscriptionNote({
  material,
  stills,
  extra,
}: {
  material: string;
  stills: string;
  extra?: string;
}): string {
  return [material, RECAP_WITHHOLD_NOTE, stills, extra, RECAP_FIGURES_NOTE]
    .filter(Boolean)
    .join("");
}

export const VIDEO_MATERIAL_NOTE = "オーナー提供の動画の音声をもとに整文しています。";
export const TRANSCRIPT_MATERIAL_NOTE =
  "オーナー提供の自動文字起こしをもとに整理しています。固有名詞や数字には聞き取り誤りの可能性があります。";
export const SINGLE_STILL_NOTE = "静止画は録画の実フレームを1枚だけ掲載しています。";

const streamRecapRadioStill: StreamRecapImage = {
  src: "/media/live/mily-b51-01-morning-radio-showroom.jpg",
  width: 640,
  height: 360,
  alt: "SHOWROOMラジオ配信で使われた静止画。室内の木の椅子に座り、白いトップスと黒いスカート、白い靴下で、右手を口元に当てているみりぃ。画面左上にSHOWROOM、左下にみりぃの文字",
  caption: "配信中に使われていた静止画",
};

const GACHI_STILL_W = 400;
const GACHI_STILL_H = 228;

const gachiMorningStills: StreamRecapImage[] = [
  {
    src: "/media/live/mily-b52-01-peace-smile.jpg",
    width: GACHI_STILL_W,
    height: GACHI_STILL_H,
    alt: "三次初日の朝配信で、ベージュのトップスのみりぃが右手でピースをしている",
    caption: "ベストショット。ピース",
    downloadName: "みりぃ_三次初日朝_01_ベスト_ピース.jpg",
  },
  {
    src: "/media/live/mily-b52-02-peace.jpg",
    width: GACHI_STILL_W,
    height: GACHI_STILL_H,
    alt: "三次初日の朝配信で、ベージュのトップスのみりぃが右手を開いて振っている",
    caption: "手を振る",
    downloadName: "みりぃ_三次初日朝_02_手を振る.jpg",
  },
  {
    src: "/media/live/mily-b52-03-peace-talk.jpg",
    width: GACHI_STILL_W,
    height: GACHI_STILL_H,
    alt: "三次初日の朝配信で、ベージュのトップスのみりぃが顔を上げて話している",
    caption: "顔を上げて話す",
    downloadName: "みりぃ_三次初日朝_03_顔を上げて.jpg",
  },
  {
    src: "/media/live/mily-b52-04-smile.jpg",
    width: GACHI_STILL_W,
    height: GACHI_STILL_H,
    alt: "三次初日の朝配信で、口元をゆるめて微笑んでいるみりぃ",
    caption: "微笑み",
    downloadName: "みりぃ_三次初日朝_04_微笑み.jpg",
  },
  {
    src: "/media/live/mily-b52-05-talk-smile.jpg",
    width: GACHI_STILL_W,
    height: GACHI_STILL_H,
    alt: "三次初日の朝配信で、少し笑って話しているみりぃ",
    caption: "話す笑顔",
    downloadName: "みりぃ_三次初日朝_05_話す笑顔.jpg",
  },
  {
    src: "/media/live/mily-b52-06-talk.jpg",
    width: GACHI_STILL_W,
    height: GACHI_STILL_H,
    alt: "三次初日の朝配信で、こちらを見て話しているみりぃ",
    caption: "話す",
    downloadName: "みりぃ_三次初日朝_06_話す.jpg",
  },
  {
    src: "/media/live/mily-b52-07-look.jpg",
    width: GACHI_STILL_W,
    height: GACHI_STILL_H,
    alt: "三次初日の朝配信で、まっすぐこちらを見て話しているみりぃ",
    caption: "こちらを見て話す",
    downloadName: "みりぃ_三次初日朝_07_見つめて.jpg",
  },
  {
    src: "/media/live/mily-b52-08-soft-smile.jpg",
    width: GACHI_STILL_W,
    height: GACHI_STILL_H,
    alt: "三次初日の朝配信で、やわらかく笑っているみりぃ",
    caption: "やわらかい笑顔",
    downloadName: "みりぃ_三次初日朝_08_やわらか笑顔.jpg",
  },
  {
    src: "/media/live/mily-b52-09-later.jpg",
    width: GACHI_STILL_W,
    height: GACHI_STILL_H,
    alt: "三次初日の朝配信の中盤、話しているみりぃ",
    caption: "配信の中盤",
    downloadName: "みりぃ_三次初日朝_09_中盤.jpg",
  },
  {
    src: "/media/live/mily-b52-10-board.jpg",
    width: GACHI_STILL_W,
    height: GACHI_STILL_H,
    alt: "三次初日の朝配信で、ホワイトボードの話をしているみりぃ",
    caption: "ホワイトボードの話のころ",
    downloadName: "みりぃ_三次初日朝_10_ボード.jpg",
  },
];

const LUNCH_STILL_W = 1280;
const LUNCH_STILL_H = 720;

const gachiLunchStills: StreamRecapImage[] = [
  {
    src: "/media/live/mily-b54-01-close-smile.jpg",
    width: LUNCH_STILL_W,
    height: LUNCH_STILL_H,
    alt: "三次初日の昼配信で、黒のドット柄トップスとベージュのシュシュのみりぃが画面に寄って笑っている",
    caption: "エンディング近くの笑顔",
    downloadName: "みりぃ_三次初日昼_01_寄りの笑顔.jpg",
  },
  {
    src: "/media/live/mily-b54-02-ouen-board.jpg",
    width: LUNCH_STILL_W,
    height: LUNCH_STILL_H,
    alt: "三次初日の昼配信で、応援方法の紙を持って笑っているみりぃ。紙には1日1回のWEB投票、キラキラ星100個、指定ギフトと書かれている",
    caption: "応援方法の紙",
    downloadName: "みりぃ_三次初日昼_02_応援ボード.jpg",
  },
];

/**
 * 2026年9月3日のSHOWROOM昼配信を、オーナー提供の動画で確認した配信メモ。
 * サムネイルと応援方法の紙は録画の実フレーム2枚。表示用にLanczosで拡大しているが、
 * 顔の生成・補正はしていない。LIVE STREAM の配信カード専用で、
 * Gallery の media.ts / galleryVideos.ts には載せない。
 */
export const streamRecap20260903Lunch: StreamRecap = {
  id: "2026-09-03-lunch-gachi-showroom",
  date: "2026-09-03",
  dateLabel: "2026.09.03（木）",
  theme: "昼の配信・三次初日",
  broadcastLabel: "14:40頃〜 約40分",
  platformLabel: "SHOWROOM",
  summary:
    "三次審査1日目の昼枠。朝のあと外出して、メイクした状態で戻ってきた回です。応援方法の紙を見せながら、1日1回のWEB投票とキラキラ星100個をいちばんお願いしたい、と話しました。目標は三次通過とアバター権。",
  image: gachiLunchStills[0],
  gallery: gachiLunchStills,
  highlights: [
    {
      timestamp: "0:01:20",
      title: "メイクして戻ってきた昼枠",
      body: "朝枠のあと外に出て、戻ってからメイクをした状態で配信しました。外出の中身は言わないでね、と念を押しています。メイクのときは盛れる、という話にもなりました。",
    },
    {
      timestamp: "0:03:20",
      title: "応援方法の紙",
      body: "印刷した紙を見せました。1日1回のWEB投票、キラキラ星100個、指ハートや祝い花などの指定ギフト、という順です。夜枠では画面が変わるかも、とも話しています。",
    },
    {
      timestamp: "0:08:30",
      title: "通過とアバター権",
      body: "今の目標は三次審査を通過すること、そしてアバター権を獲得すること。ブロック1位は今回狙わないが、油断はしないので配信は多めにする、と説明しました。",
      quote: "私の今の目標としては三次審査を通過することです",
    },
    {
      timestamp: "0:19:20",
      title: "15時の100キラ",
      body: "枠の途中で15時になり、キラキラ星100個をお願いしました。15時以降でも夜でも投げられる、と伝えています。数が集まるとうれしい、とも話しました。",
    },
    {
      timestamp: "0:32:20",
      title: "トマトの栄養素",
      body: "ファンネームはトマトが好きだからではなく、あだ名のリコからリコピンへつながっている、と改めて話しました。9月は70人を目指しています。",
    },
  ],
  goals: [
    { item: "三次通過", target: "最優先", statusThen: "三次1日目" },
    { item: "WEB投票", target: "毎日1回", statusThen: "紙で案内" },
    { item: "キラキラ星", target: "100個", statusThen: "15時に呼びかけ" },
    { item: "アバター権", target: "獲得", statusThen: "未獲得" },
    { item: "トマトの栄養素", target: "70人", statusThen: "呼びかけ継続" },
  ],
  ranking: [RANKING_NOTE],
  timeline: [
    { timestamp: "0:00:00", label: "暑い、お腹空いた。メイクして帰宅" },
    { timestamp: "0:01:20", label: "外出から戻った話。中身は言わない" },
    { timestamp: "0:03:20", label: "応援方法の紙。投票と100キラ" },
    { timestamp: "0:08:30", label: "三次通過とアバター権" },
    { timestamp: "0:16:10", label: "15時の100キラ予告" },
    { timestamp: "0:19:20", label: "15時。キラキラ星100個のお願い" },
    { timestamp: "0:29:30", label: "パーソナルカラーはブルベ夏" },
    { timestamp: "0:32:20", label: "トマトの栄養素の由来" },
    { timestamp: "0:35:30", label: "長い枠もどこかでやりたい" },
    { timestamp: "0:37:40", label: "ランキング読み上げ" },
    { timestamp: "0:38:50", label: "夜は21:00〜21:50。投票はバナーから" },
  ],
  nextNote:
    "同日 21:00〜21:50 が夜枠として案内されました。長く話したいので枠を組み替えるかもしれない、とも話しています。WEB投票はバナーから。",
  sourceLabel: "2026年9月3日 SHOWROOM昼配信（動画確認・オーナー提供）",
  verifiedAt: "2026-09-04",
  transcriptionNote: buildTranscriptionNote({
    material: VIDEO_MATERIAL_NOTE,
    stills:
      "静止画は録画の実フレームを2枚掲載しています。表示用にLanczosで拡大していますが、顔の生成・補正はしていません。",
  }),
};

/**
 * 2026年9月3日のSHOWROOM朝配信を、オーナー提供の動画で確認した配信メモ。
 * かわいい実フレームを10枚掲載する。コメント・視聴者表示・他出場者は写らないよう切り出している。
 * LIVE STREAM の配信カード専用で、Gallery の media.ts には載せない。
 */
export const streamRecap20260903: StreamRecap = {
  id: "2026-09-03-morning-gachi-showroom",
  date: "2026-09-03",
  dateLabel: "2026.09.03（木）",
  theme: "朝の配信・三次初日",
  broadcastLabel: "7:30頃〜 約30分",
  platformLabel: "SHOWROOM",
  summary:
    "MISS CIRCLE CONTEST 三次審査1日目の最初の朝配信。すっぴんで起きて、キラキラと12時からのWEB投票をお願いした回です。ファンネーム「トマトの栄養素」の由来や、昼枠はメイクして会うことも話しました。",
  image: gachiMorningStills[0], // 400px。カードでは元の幅のまま出し、640pxへ拡大しない
  gallery: gachiMorningStills,
  galleryZip: {
    src: "/media/live/mily-b52-gachi-morning-stills.zip",
    filename: "みりぃ_三次初日朝_かわいいスクショ10枚.zip",
    label: "10枚まとめて保存",
  },
  highlights: [
    {
      timestamp: "0:00:13",
      title: "キラキラが超大事",
      body: "三次初日の朝、来てくれた人へお礼を言いながら、キラキラが超大事だとくり返しお願いしました。",
      quote: "キラキラ超大事です",
    },
    {
      timestamp: "0:00:58",
      title: "WEB投票は12時から",
      body: "投票は当日12時から始まると案内しました。期間前に押すと時間外になるので、12時を過ぎてからお願いします、と伝えました。",
    },
    {
      timestamp: "0:05:21",
      title: "トマトの栄養素が3人に",
      body: "ファンネーム「トマトの栄養素」が、この朝の時点で3人になったと喜びました。9月は70人を目指すとも話しています。",
    },
    {
      timestamp: "0:09:43",
      title: "すっぴんの朝、昼はメイクして会う",
      body: "朝早くの枠はすっぴんで配信。14:40からの枠ではメイクをした状態で会う、と予告しました。",
      quote: "14時40分からは確実にメイクをしています",
    },
    {
      timestamp: "0:13:51",
      title: "莉子からリコピン、トマトの栄養素",
      body: "名前の莉子からリコピン、トマトの栄養素へつながるファンネームの由来を説明しました。キラキラとトマトで応援してほしい、という話です。",
    },
    {
      timestamp: "0:26:16",
      title: "着実に通過する。アバター権も",
      body: "目標はまず着実に三次を通過すること。キラキラと投票を忘れないでほしい、と締めくくりました。アバター権も獲得したいと話しています。",
      quote: "私の目標は、まずちゃんと着実に通過することです",
    },
  ],
  goals: [
    { item: "三次通過", target: "着実に", statusThen: "最優先" },
    { item: "WEB投票", target: "12時から毎日", statusThen: "開始前の案内" },
    { item: "キラキラ", target: "大事", statusThen: "朝から呼びかけ" },
    { item: "トマトの栄養素", target: "70人", statusThen: "この朝で3人" },
    { item: "アバター権", target: "獲得", statusThen: "未獲得" },
  ],
  ranking: [RANKING_NOTE],
  timeline: [
    { timestamp: "0:00:00", label: "三次初日の朝。キラキラのお願い" },
    { timestamp: "0:00:58", label: "WEB投票は12時から" },
    { timestamp: "0:05:21", label: "トマトの栄養素が3人に" },
    { timestamp: "0:07:32", label: "すっぴんの朝配信" },
    { timestamp: "0:09:43", label: "14:40からはメイクして会う" },
    { timestamp: "0:12:12", label: "ピースと笑顔" },
    { timestamp: "0:12:24", label: "トマトの栄養素70人目標" },
    { timestamp: "0:13:51", label: "莉子からリコピンのファンネーム" },
    { timestamp: "0:16:45", label: "ホワイトボードのペン" },
    { timestamp: "0:26:16", label: "着実に通過することが目標" },
    { timestamp: "0:27:01", label: "ランキング読み上げ" },
    { timestamp: "0:29:01", label: "アバター権を取りたい" },
  ],
  nextNote:
    "同日 14:40〜 はメイクして会うと案内されました。夜枠も、来やすい時間として待っていると話しています。WEB投票は12時から。",
  sourceLabel: "2026年9月3日 SHOWROOM朝配信（動画確認・オーナー提供）",
  verifiedAt: "2026-09-04",
  transcriptionNote: buildTranscriptionNote({
    material: VIDEO_MATERIAL_NOTE,
    stills:
      "静止画は録画の実フレームを10枚掲載しています。コメント・視聴者の表示名・他の出場者は写らないよう切り出しています。",
  }),
};

/**
 * 2026年9月2日のSHOWROOM朝配信を、オーナー提供の動画で確認した配信メモ。
 * 配信中の静止画は録画の実フレームを1枚だけ掲載し、朝と夜で同じ1枚を共有する。
 * LIVE STREAM の配信カード専用で、Gallery の media.ts には載せない
 * （NEWS専用JPEGと同じ。published Gallery 項目にしない）。
 */
export const streamRecap20260902: StreamRecap = {
  id: "2026-09-02-morning-showroom",
  date: "2026-09-02",
  dateLabel: "2026.09.02（水）",
  theme: "朝のラジオ配信",
  broadcastLabel: "9:02頃〜 約62分",
  platformLabel: "SHOWROOM",
  summary:
    "三次審査を翌日に控えた朝のラジオ配信。初見向けに自己紹介し、「みんなの太陽になりたい」という思いを語りました。花束や通学の話も交えながら、無理をしすぎず自分の本音と向き合う時間を届けた回です。",
  image: streamRecapRadioStill,
  highlights: [
    {
      timestamp: "0:06:41",
      title: "花束とドライフラワー",
      body: "7月後半にもらった花束を部屋に飾っていたものの、枯らしてしまったと話しました。贈るならドライフラワーにしてほしい、と冗談を交えました。",
      quote: "私にお花を渡したい時は全部ドライフラワーにしてから私にください",
    },
    {
      timestamp: "0:16:57",
      title: "初見向け自己紹介と「みんなの太陽」",
      body: "MISS CIRCLE CONTESTに出場中の三橋莉子と自己紹介。「みりぃ」と呼んでもらっていると案内し、翌日から三次審査が始まると話しました。誰かに自信を届けられる存在になりたいとも語りました。",
      quote: "みんなの太陽になりたい",
    },
    {
      timestamp: "0:27:09",
      title: "9月の目標",
      body: "アバター権の獲得、フォロワー300人、ファンマーク5人などを目標に設定。ファンマークがなくても応援してくれる人がいると分かっているので、無理に求めたくないとも話しました。",
    },
    {
      timestamp: "0:30:59",
      title: "無理をしすぎず、体調と相談",
      body: "三次審査へ気合を入れつつ、無理が過ぎると上手くいかなくなるので体調と相談したいと話しました。通学に約2時間かかることや、電車で動画編集・読書・英単語の勉強をすることも紹介しました。",
    },
    {
      timestamp: "0:43:38",
      title: "将来と本音を見つめ直す",
      body: "アナウンサーの勉強をしながら、将来について一度立ち止まり、本当にやりたいことや覚悟を見つめ直していると語りました。配信は自分の本心を探る時間でもあると話しました。",
    },
    {
      timestamp: "0:50:18",
      title: "未完成の作品として",
      body: "自分の人生の歩みを一緒に追いかけてほしい、まだ未完成でこれから作り上がっていく作品として見てほしいと呼びかけました。",
      quote: "一つの作品として私を見てほしい",
    },
    {
      timestamp: "0:52:20",
      title: "みんなと見に行きたい景色",
      body: "三次審査では楽しめる配信にし、もっと自分を知ってもらいたいと話した上で、みんなと一緒にいい景色を見に行きたいと語りました。",
      quote: "みんなと一緒にいい景色を見に行きます。絶景を。みんなが涙する景色を見に行きます",
    },
    {
      timestamp: "1:00:05",
      title: "初見リスナーを歓迎",
      body: "終盤に訪れた初見リスナーを歓迎。うれしさで泣きそうと話し、次回は顔出し配信でも会いたいと案内しました。",
      quote: "なんか今ね、うれしくて本当に泣きそう",
    },
  ],
  goals: [
    { item: "アバター権", target: "獲得", statusThen: "未獲得" },
    { item: "フォロワー", target: "300人", statusThen: "251人" },
    { item: "ファンマーク", target: "5人", statusThen: "2人" },
  ],
  ranking: [RANKING_NOTE],
  timeline: [
    { timestamp: "0:00:00", label: "朝のラジオ配信。寝具や花束の話からスタート" },
    { timestamp: "0:06:41", label: "花束を枯らしてしまった話。ドライフラワー希望" },
    { timestamp: "0:16:57", label: "初見向け自己紹介。三次審査と自信の話" },
    { timestamp: "0:18:55", label: "みんなの太陽になりたいという思い" },
    { timestamp: "0:27:09", label: "9月の目標と応援への考え方" },
    { timestamp: "0:30:59", label: "体調と相談しながら三次審査へ" },
    { timestamp: "0:33:22", label: "通学時間と電車での過ごし方" },
    { timestamp: "0:41:30", label: "毎日配信を始めて33日目" },
    { timestamp: "0:43:38", label: "将来と自分の本音を見つめ直す話" },
    { timestamp: "0:50:18", label: "未完成の作品として見てほしいという思い" },
    { timestamp: "0:52:20", label: "みんなと一緒に見に行きたい景色" },
    { timestamp: "0:57:26", label: "ランキング読み上げと次回配信の案内" },
    { timestamp: "1:00:05", label: "初見リスナーを歓迎。顔出し配信も案内" },
    { timestamp: "1:02:01", label: "今日も一日頑張ろうと締めくくり" },
  ],
  nextNote:
    "配信内では、同日 14:40〜の短め枠（お昼またぎ・投げ逃げ歓迎）と、夜枠もやるつもり、と案内されました。夜枠の時刻は未確定のままです。",
  sourceLabel: "2026年9月2日 SHOWROOM朝配信（動画確認・オーナー提供）",
  verifiedAt: "2026-09-03",
  transcriptionNote: buildTranscriptionNote({
    material: VIDEO_MATERIAL_NOTE,
    stills: SINGLE_STILL_NOTE,
    extra: "固有名詞・コメント名・一部の目標数値は聞き取りが不明瞭なため掲載していません。",
  }),
};

/**
 * 2026年9月2日のSHOWROOM夜配信を、オーナー提供の文字起こしから
 * 照合した配信メモ。顔出しなしラジオの静止画は朝と同じ実フレーム1枚を載せる。
 */
export const streamRecap20260902Night: StreamRecap = {
  id: "2026-09-02-night-showroom",
  date: "2026-09-02",
  dateLabel: "2026.09.02（水）",
  theme: "夜のラジオ配信・三次前日",
  broadcastLabel: "21:13頃〜 約74分",
  platformLabel: "SHOWROOM",
  summary:
    "三次前日の夜ラジオ。二次審査での無理を反省し、翌9月3日の朝・昼・夜のタイムテーブルを発表しました。投票とキラ星が最優先で、ブロック1位は今回のタイミングではない、と話した回です。",
  image: streamRecapRadioStill,
  highlights: [
    {
      timestamp: "0:10:00",
      title: "三次通過が絶対。投票が何より大事",
      body: "ブロック1位は今回のタイミングではない。通過と毎日の投票、アバター権を優先すると話した回です。",
      quote: "三次は通過しなくてはいけない。絶対に",
    },
    {
      timestamp: "0:29:00",
      title: "9/3は朝・昼・夜",
      body: "7:30〜8:00、14:40〜15:20、21:00〜21:50。寝坊したらスーツ謝罪会見、というネタもありました。",
    },
    {
      timestamp: "0:59:00",
      title: "日本ザル・海くん",
      body: "熊本の動物園にいるおじいちゃんザルの話。他の部屋では聞けない話、と紹介しました。",
    },
  ],
  goals: [
    { item: "三次通過", target: "絶対", statusThen: "最優先" },
    { item: "アバター権", target: "獲得", statusThen: "未獲得" },
    { item: "投票", target: "毎日", statusThen: "来れなくても投票を" },
    { item: "キラ星", target: "大事", statusThen: "無理しなくていい" },
    { item: "トマトの栄養素", target: "70人", statusThen: "今夜2人目" },
  ],
  ranking: [RANKING_NOTE],
  timeline: [
    { timestamp: "0:00:00", label: "挨拶。22:30から会議。SHOWROOMは3時切り替え" },
    { timestamp: "0:06:00", label: "トマト／鼻声。体調は鼻以外問題なし" },
    { timestamp: "0:10:00", label: "三次の目標。投票とキラ星" },
    { timestamp: "0:16:00", label: "スーツ謝罪会見。二次の無理の反省" },
    { timestamp: "0:22:00", label: "ピンチ。別の面接連絡を翌日へ振替" },
    { timestamp: "0:29:00", label: "9/3タイムテーブル発表" },
    { timestamp: "0:50:00", label: "白いハート／ピンクハート" },
    { timestamp: "0:59:00", label: "日本ザル・海くん" },
    { timestamp: "1:06:00", label: "歌のプレイリスト練習中" },
    { timestamp: "1:09:00", label: "ランキング。おつみりん。翌朝7:30〜" },
  ],
  nextNote:
    "翌朝 7:30〜8:00 が三次最初の枠。14:40〜15:20、21:00〜21:50 も案内されました。",
  sourceLabel: "2026年9月2日 SHOWROOM夜配信 文字起こし（オーナー提供）",
  verifiedAt: "2026-09-03",
  transcriptionNote: buildTranscriptionNote({
    material: TRANSCRIPT_MATERIAL_NOTE,
    stills: SINGLE_STILL_NOTE,
  }),
};

/** 新しい配信メモを先頭へ。同じ日は開始時刻の遅い枠を先に置く。 */
export const streamRecaps: StreamRecap[] = [
  streamRecap20260903Lunch,
  streamRecap20260903,
  streamRecap20260902Night,
  streamRecap20260902,
];
