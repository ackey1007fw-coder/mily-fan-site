import type { StreamRecap, StreamRecapImage } from "./streamRecaps";

const RANKING_NOTE =
  "配信終了時に、13位から1位までランキングを読み上げました。個人名は掲載していません。";

const streamRecapRadioStill: StreamRecapImage = {
  src: "/media/live/mily-b51-01-morning-radio-showroom.jpg",
  width: 640,
  height: 360,
  alt: "SHOWROOMラジオ配信で使われた静止画。室内の木の椅子に座り、白いトップスと黒いスカート、白い靴下で、右手を口元に当てているみりぃ。画面左上にSHOWROOM、左下にみりぃの文字",
  caption: "配信中に使われていた静止画",
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
    "三次前日の夜ラジオ。二次の無理を反省して明朝からのタイムテーブルを発表。投票とキラ星が最優先で、ブロック1位は今は狙わない、と話しました。",
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
    { timestamp: "1:09:00", label: "ランキング。おつみりん。明朝7:30〜" },
  ],
  nextNote:
    "配信時点では、翌9月3日 7:30〜8:00 が三次最初の枠と案内していました。同日 14:40〜15:20、21:00〜21:50 の案内もありました。",
  sourceLabel: "2026年9月2日 SHOWROOM夜配信 文字起こし（オーナー提供）",
  verifiedAt: "2026-09-03",
  transcriptionNote:
    "自動文字起こしを元に整理しています。固有名詞や数字には聞き取り誤りの可能性があります。録音音声・画面録画・全文文字起こしは掲載していません。配信中の静止画は録画の実フレームを1枚だけ掲載しています。フォロワー数や目標の数字は配信時点の記録です。",
};
