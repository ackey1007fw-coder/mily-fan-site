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

const RANKING_NOTE =
  "配信終了時に、13位から1位までランキングを読み上げました。個人名は掲載していません。";

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
    alt: "三次初日の朝配信で、ピースをしたままこちらを見ているみりぃ",
    caption: "ピース",
    downloadName: "みりぃ_三次初日朝_02_ピース.jpg",
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

/**
 * 2026年9月3日のSHOWROOM朝配信を、オーナー提供の動画で確認した配信メモ。
 * 録音音声・全文文字起こし・画面録画は公開しない。
 * かわいい実フレームを10枚掲載する。コメント・視聴者表示・他出場者は写らないよう切り出している。
 * LIVE STREAM の配信カード専用で、Gallery の media.ts には載せない。
 */
export const streamRecap20260903: StreamRecap = {
  id: "2026-09-03-morning-gachi-showroom",
  date: "2026-09-03",
  dateLabel: "2026.09.03（木）",
  theme: "三次初日の朝配信",
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
  transcriptionNote:
    "動画の音声をもとに整文しています。固有名詞やコメント名は掲載していません。録音音声・画面録画・全文文字起こしは掲載していません。かわいい実フレームを10枚掲載しています。コメント・視聴者の表示名・他の出場者は写らないよう切り出しています。フォロワー数や目標の数字は配信時点の記録です。",
};

/**
 * 2026年9月2日のSHOWROOM朝配信を、オーナー提供の動画で確認した配信メモ。
 * 録音音声・全文文字起こし・画面録画は公開しない。
 * 配信中の静止画は録画の実フレームを1枚だけ掲載する。朝と夜で同じ1枚を共有する。
 * LIVE STREAM の配信カード専用で、Gallery の media.ts には載せない
 * （NEWS専用JPEGと同じ。published Gallery 項目にしない）。
 */
export const streamRecap20260902: StreamRecap = {
  id: "2026-09-02-morning-showroom",
  date: "2026-09-02",
  dateLabel: "2026.09.02（水）",
  theme: "朝ラジオ配信",
  broadcastLabel: "9:02頃〜 約62分",
  platformLabel: "SHOWROOM",
  summary:
    "三次審査を翌日に控えた朝のラジオ配信。初見向けに三橋莉子（みりぃ）として自己紹介し、配信を始めた理由や「みんなの太陽になりたい」という思いを語りました。花束、通学、将来のことなど身近な話題を交えながら、三次審査に向けて無理をしすぎず、自分の本音と向き合う時間を届けた回です。",
  image: streamRecapRadioStill,
  highlights: [
    {
      timestamp: "0:06:41",
      title: "花束とドライフラワー",
      body:
        "7月後半にもらった花束を部屋に飾っていたものの、枯らしてしまったと話しました。花をもらうことは別格にうれしい一方、贈るならドライフラワーにしてほしいと冗談を交えました。",
      quote: "私にお花を渡したい時は全部ドライフラワーにしてから私にください",
    },
    {
      timestamp: "0:16:57",
      title: "初見向け自己紹介と「みんなの太陽」",
      body:
        "MISS CIRCLE CONTESTに出場中の三橋莉子と自己紹介。みんなには「みりぃ」と呼んでもらっていると案内し、翌日から三次審査が始まると話しました。配信を通じて自信をつけ、誰かに幸せや自信を届けられる存在になりたいという思いも語りました。",
      quote: "みんなの太陽になりたい",
    },
    {
      timestamp: "0:27:09",
      title: "9月の目標",
      body:
        "アバター権の獲得、フォロワー300人、ファンマーク5人などを目標に設定。ファンマークを付けていなくても応援してくれる人がいることを分かっているので、無理に求めたくないという気持ちも話しました。",
    },
    {
      timestamp: "0:30:59",
      title: "無理をしすぎず、体調と相談",
      body:
        "三次審査に向けて気合を入れつつも、無理が過ぎると上手くいかなくなるので、体調と相談して調整したいと話しました。通学に約2時間かかることや、電車で動画編集・読書・英単語の勉強をすることも紹介しました。",
    },
    {
      timestamp: "0:43:38",
      title: "将来と本音を見つめ直す",
      body:
        "アナウンサーの勉強をしながら、将来について一度立ち止まり、本当にやりたいことや覚悟を見つめ直していると語りました。配信は自分の本心を探る時間でもあると話しました。",
    },
    {
      timestamp: "0:50:18",
      title: "未完成の作品として",
      body:
        "自分の人生の歩みを一緒に追いかけてほしい、まだ未完成でこれから作り上がっていく作品として見てほしいと呼びかけました。",
      quote: "一つの作品として私を見てほしい",
    },
    {
      timestamp: "0:52:20",
      title: "みんなと見に行きたい景色",
      body:
        "三次審査では楽しめる配信にし、もっと自分を知ってもらいたいと話した上で、みんなと一緒にいい景色を見に行きたいと語りました。",
      quote: "みんなと一緒にいい景色を見に行きます。絶景を。みんなが涙する景色を見に行きます",
    },
    {
      timestamp: "1:00:05",
      title: "初見リスナーを歓迎",
      body:
        "終盤に訪れた初見リスナーを歓迎。うれしさで泣きそうと話し、次回は顔出し配信でも会いたいと案内しました。",
      quote: "なんか今ね、うれしくて本当に泣きそう",
    },
  ],
  goals: [
    {
      item: "アバター権",
      target: "獲得",
      statusThen: "配信時点では未獲得",
    },
    {
      item: "フォロワー",
      target: "300人",
      statusThen: "配信時点で251人",
    },
    {
      item: "ファンマーク",
      target: "5人",
      statusThen: "配信時点で2人",
    },
  ],
  ranking: [
    "配信終了時に、13位から1位までランキングを読み上げました。個人名は掲載していません。",
  ],
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
  transcriptionNote:
    "動画の音声をもとに整文しています。固有名詞・コメント名・一部の目標数値は聞き取りが不明瞭なため掲載していません。録音音声・画面録画・全文文字起こしは掲載していません。配信中の静止画は録画の実フレームを1枚だけ掲載しています。フォロワー数や目標の数字は配信時点の記録です。",
};

/**
 * 2026年9月2日のSHOWROOM夜配信を、オーナー提供の文字起こしから
 * 照合した配信メモ。録音音声・全文文字起こし・画面録画は公開しない。
 * 顔出しなしラジオの静止画は朝と同じ実フレーム1枚を載せる。
 */
export const streamRecap20260902Night: StreamRecap = {
  id: "2026-09-02-night-showroom",
  date: "2026-09-02",
  dateLabel: "2026.09.02（水）",
  theme: "夜ラジオ配信",
  broadcastLabel: "21:13頃〜 約74分",
  platformLabel: "SHOWROOM",
  summary:
    "三次前日の夜ラジオ。二次の無理を反省して翌朝からのタイムテーブルを発表。投票とキラ星が最優先で、ブロック1位は今は狙わない、と話しました。",
  image: streamRecapRadioStill,
  highlights: [
    {
      timestamp: "0:10:00",
      title: "三次通過が絶対。投票が何より大事",
      body: "ブロック1位は今回のタイミングではない。通過と毎日の投票、アバ権を優先する回です。",
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
      body: "熊本の動物園のおじいちゃんザル。他の部屋では聞けない話、と紹介しました。",
    },
  ],
  goals: [
    { item: "三次通過", target: "絶対", statusThen: "最優先" },
    { item: "アバ権", target: "獲得", statusThen: "未獲得" },
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
  transcriptionNote:
    "自動文字起こしを元に整理しています。固有名詞や数字には聞き取り誤りの可能性があります。録音音声・画面録画・全文文字起こしは掲載していません。配信中の静止画は録画の実フレームを1枚だけ掲載しています。フォロワー数や目標の数字は配信時点の記録です。",
};

/** 新しい配信メモを先頭へ。 */
export const streamRecaps: StreamRecap[] = [
  streamRecap20260903,
  streamRecap20260902Night,
  streamRecap20260902,
];
