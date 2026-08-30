export type RadioEpisodeHighlight = {
  timestamp: string;
  title: string;
  body: string;
  quote?: string;
};

export type RadioEpisodeMessage = {
  timestamp: string;
  title: string;
  body: string;
};

export type RadioEpisodeTimelineItem = {
  timestamp: string;
  label: string;
};

export type RadioEpisode = {
  id: string;
  date: string;
  dateLabel: string;
  theme: string;
  broadcastLabel: string;
  presenters: string[];
  summary: string;
  milyHighlights: RadioEpisodeHighlight[];
  listenerMessages: RadioEpisodeMessage[];
  timeline: RadioEpisodeTimelineItem[];
  nextEpisodeNote: string;
  sourceLabel: string;
  verifiedAt: string;
  transcriptionNote: string;
};

/**
 * 2026年8月30日の生放送アーカイブ文字起こしを、オーナー提供の
 * 行ごと版・段落校正版・統合版で照合した放送メモ。
 * 録音音声・全文文字起こし・非公開のDrive URLは公開しない。
 */
export const radioEpisode20260830: RadioEpisode = {
  id: "2026-08-30-movie-special",
  date: "2026-08-30",
  dateLabel: "2026.08.30（日）",
  theme: "映画特集",
  broadcastLabel: "10:00〜13:00 生放送",
  presenters: ["師匠", "みりぃ", "カズボー"],
  summary:
    "もこの21歳の誕生日を祝うオープニングから始まり、映画をテーマに3時間。江の島に伝わる「天女と五頭龍」の朗読、夏に見た作品、即興演技やディベート、胸キュン選手権、新コーナー「今日の一句」まで、映画と湘南を行き来しながらにぎやかに届けた回です。",
  milyHighlights: [
    {
      timestamp: "0:45:24",
      title: "主演するなら、SF・超能力もの",
      body:
        "普段の生活ではできない、空を飛ぶ・超能力を使うといった体験を映画の世界で演じてみたいとトーク。CGと対話する自分も見てみたいと、ヒーローものへの好奇心を語りました。",
    },
    {
      timestamp: "1:20:03",
      title: "高校時代の吹奏楽部を即興トーク",
      body:
        "お試し企画「潜めワード」で、高校時代に吹奏楽部のキャプテンを務めた経験を紹介。メンバーが自分の役割を客観視し、堅実に役割を果たしていたことを、指定語を自然に交えてまとめて勝利しました。",
    },
    {
      timestamp: "1:30:18",
      title: "『あの星が降る丘で、君とまた出会いたい。』",
      body:
        "この夏に見たおすすめ映画として紹介。上映開始からエンドロールまで涙が止まらなかったこと、現代と戦時中の価値観を交えて違いを伝える作品の重みを語りました。",
    },
    {
      timestamp: "2:21:54",
      title: "胸キュン選手権は、まっすぐな安心感",
      body:
        "怖いお化け屋敷の後で泣く相手へ贈る言葉を即興で披露。高校生らしい爽やかさと、少し強がりながら寄り添う雰囲気が評価され、勝者に選ばれました。",
      quote:
        "怖がってる君を見るたびに、守りたい気持ちが強くなる。いつでも俺が隣にいるよ。",
    },
    {
      timestamp: "2:35:24",
      title: "人生で印象深い映画は『君の名は。』",
      body:
        "約10年前に映画館で見た作品として、今も変わらず美しいと感じる色彩と情景を紹介。前の方の席で首を痛めながら見た記憶まで、映画館での体験と一緒に振り返りました。",
    },
    {
      timestamp: "2:48:51",
      title: "「今日の一句」でも勝利",
      body:
        "雨が止んだ後の大磯町をテーマに、人の呼吸が聞こえるほどの静けさと、穏やかな海を一句に。情景と意図が評価されました。",
      quote: "雨上がり　街の吐息や　波静か",
    },
  ],
  listenerMessages: [
    {
      timestamp: "0:49:23",
      title: "『ズートピア』1・2から考えたこと",
      body:
        "ラジオネーム「栄養素のアッキーさん」から、偏見や差別、先住民の歴史、社会の中のバリアと重ねて作品を見たメッセージ。師匠は自身の卒業論文のテーマと重なると紹介し、みりぃは話を踏まえてもう一度見返したいと話しました。",
    },
    {
      timestamp: "2:56:43",
      title: "『永遠の0』と、生きて帰る強さ",
      body:
        "同じラジオネームから、戦うこと以上に「大切な人との約束を守るため、生きることを諦めない姿」が心に残ったというメッセージ。平和な日常の尊さや、『ラーゲリより愛を込めて』との共通点へ話が広がりました。",
    },
  ],
  timeline: [
    { timestamp: "0:02:01", label: "映画特集スタート／もこの誕生日をお祝い" },
    { timestamp: "0:19:01", label: "湘南のすすめ：江の島「天女と五頭龍」" },
    { timestamp: "0:31:10", label: "この夏に見た映画" },
    { timestamp: "0:43:09", label: "妄想会議：映画の主演をするなら" },
    { timestamp: "0:49:23", label: "メッセージ：『ズートピア』1・2" },
    { timestamp: "1:04:43", label: "目指せアクター：お題「急いで」" },
    { timestamp: "1:15:25", label: "お試し新コーナー「潜めワード」" },
    { timestamp: "1:30:18", label: "みりぃのおすすめ映画" },
    { timestamp: "1:41:44", label: "ガチンコディベート：カラオケ採点アリ／ナシ" },
    { timestamp: "2:04:23", label: "これ好きこれ知って：喫茶店巡り" },
    { timestamp: "2:16:37", label: "ドキドキ胸キュン選手権：お化け屋敷" },
    { timestamp: "2:33:38", label: "人生で一番印象深い映画" },
    { timestamp: "2:44:11", label: "新コーナー「今日の一句」" },
    { timestamp: "2:56:36", label: "エンディング／『永遠の0』メッセージ" },
  ],
  nextEpisodeNote:
    "番組内では、次回は師匠・カズボーと研修生3人で、テーマは「8月の思い出」と案内されました。",
  sourceLabel: "2026年8月30日 生放送アーカイブ文字起こし（オーナー提供）",
  verifiedAt: "2026-08-30",
  transcriptionNote:
    "行ごとの自動文字起こし・段落校正版・統合版を照合して要約しています。固有名詞や細かな発言には聞き取り誤りの可能性があります。楽曲・交通情報はタイムラインから省略し、録音音声と全文文字起こしは掲載していません。",
};
