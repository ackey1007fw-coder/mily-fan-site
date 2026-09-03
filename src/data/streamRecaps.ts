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

export type StreamRecapRank = {
  place: number;
  name: string;
  note?: string;
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
  highlights: StreamRecapHighlight[];
  goals: StreamRecapGoal[];
  ranking: StreamRecapRank[];
  rankingNote: string;
  timeline: StreamRecapTimelineItem[];
  nextNote: string;
  sourceLabel: string;
  verifiedAt: string;
  transcriptionNote: string;
};

export function rankingByPlace(ranking: StreamRecapRank[]): StreamRecapRank[] {
  return [...ranking].sort((left, right) => left.place - right.place);
}

const RANKING_NOTE =
  "配信終了時に、13位から1位までランキングを読み上げました。個人名は掲載していません。";

/**
 * 2026年9月2日のSHOWROOM朝配信を、オーナー提供の文字起こしから
 * 照合した配信メモ。録音音声・全文文字起こし・画面録画は公開しない。
 * 配信中の静止画は録画の実フレームを1枚だけ掲載する。
 */
export const streamRecap20260902: StreamRecap = {
  id: "2026-09-02-morning-showroom",
  date: "2026-09-02",
  dateLabel: "2026.09.02（水）",
  theme: "朝ラジオ配信",
  broadcastLabel: "9:02頃〜 約62分",
  platformLabel: "SHOWROOM",
  summary:
    "三次前日の朝ラジオ。布団で7時起きできたことを喜びつつ、初見向けに「みんなの太陽」と自己紹介した顔出しなし枠です。",
  image: {
    src: "/media/live/mily-b51-01-morning-radio-showroom.jpg",
    width: 640,
    height: 360,
    alt: "SHOWROOM朝ラジオ配信で使われた静止画。室内の木の椅子に座り、白いトップスと黒いスカート、白い靴下で、右手を口元に当てているみりぃ。画面左上にSHOWROOM、左下にみりぃの文字",
    caption: "配信中に使われていた静止画",
  },
  highlights: [
    {
      timestamp: "0:14:00",
      title: "みんなの太陽になりたい",
      body: "自信がないから配信を始めた、という自己紹介。目標は変わらず、みんなの太陽になること。",
      quote: "みんなの太陽になりたい、それは変わらず",
    },
    {
      timestamp: "0:35:00",
      title: "通学時間と朝の混雑",
      body: "学部ごとにキャンパスが分かれているので通学に時間がかかる。朝の通学は混雑してほぼ座れない。立っているときは本、座れたら寝る。",
    },
    {
      timestamp: "0:45:00",
      title: "自分を、未完成の作品として",
      body: "アナウンスの勉強は続けつつ、今は進路を見つめ直している。三次では楽しめる配信と、自分をもっと知ってもらうことを重ねたい、と。",
      quote: "私の人生を一緒に追っていってみてほしい。一つの作品として",
    },
  ],
  goals: [
    { item: "アバ権", target: "獲得", statusThen: "未獲得" },
    { item: "フォロワー", target: "300人", statusThen: "251人" },
    { item: "トマトの栄養素", target: "70人", statusThen: "今月1人" },
    { item: "ファンマーク", target: "5人", statusThen: "2人" },
  ],
  ranking: [],
  rankingNote: RANKING_NOTE,
  timeline: [
    { timestamp: "0:00:00", label: "朝の挨拶。写真クイズ" },
    { timestamp: "0:01:00", label: "布団で寝た／かけ布団と長袖" },
    { timestamp: "0:06:00", label: "誕生日の花。ドライフラワー希望" },
    { timestamp: "0:09:00", label: "ラジオにした理由。配信審査は翌日〜" },
    { timestamp: "0:14:00", label: "初見向け自己紹介。みんなの太陽" },
    { timestamp: "0:27:00", label: "好きなお酒・おつまみ。9月目標" },
    { timestamp: "0:35:00", label: "体調と睡眠。通学時間と朝の混雑" },
    { timestamp: "0:45:00", label: "進路。作品としての自分" },
    { timestamp: "0:57:00", label: "ランキング。次枠案内。おつみりん" },
  ],
  nextNote:
    "同日 14:40〜の短め枠と、夜枠もやるつもり、と案内。夜の時刻は当時まだ未確定でした。",
  sourceLabel: "2026年9月2日 SHOWROOM朝配信 文字起こし（オーナー提供）",
  verifiedAt: "2026-09-02",
  transcriptionNote:
    "自動文字起こしを元に整理しています。固有名詞や数字には聞き取り誤りの可能性があります。録音音声・画面録画・全文文字起こしは掲載していません。配信中の静止画は録画の実フレームを1枚だけ掲載しています。フォロワー数や目標の数字は配信時点の記録です。",
};

/**
 * 2026年9月2日のSHOWROOM夜配信を、オーナー提供の文字起こしから
 * 照合した配信メモ。録音音声・全文文字起こし・画面録画は公開しない。
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
  ranking: [],
  rankingNote: RANKING_NOTE,
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
    "自動文字起こしを元に整理しています。固有名詞や数字には聞き取り誤りの可能性があります。録音音声・画面録画・全文文字起こしは掲載していません。フォロワー数や目標の数字は配信時点の記録です。",
};

/** 新しい配信メモを先頭へ。 */
export const streamRecaps: StreamRecap[] = [
  streamRecap20260902Night,
  streamRecap20260902,
];

