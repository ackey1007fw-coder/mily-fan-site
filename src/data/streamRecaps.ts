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

export type StreamRecap = {
  id: string;
  date: string;
  dateLabel: string;
  theme: string;
  broadcastLabel: string;
  platformLabel: string;
  summary: string;
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
 * 2026年9月2日のSHOWROOM朝配信を、オーナー提供の文字起こしから
 * 照合した配信メモ。録音音声・全文文字起こし・画面録画は公開しない。
 */
export const streamRecap20260902Morning: StreamRecap = {
  id: "2026-09-02-morning-showroom",
  date: "2026-09-02",
  dateLabel: "2026.09.02（火）",
  theme: "朝ラジオ配信",
  broadcastLabel: "9:02頃〜 約62分",
  platformLabel: "SHOWROOM",
  summary:
    "三次審査の配信審査を翌日に控え、鼻声気味のなか朝ラジオでトークした回です。布団でちゃんと寝て7時起きできたことを自画自賛しつつ、初見向けに自己紹介と「みんなの太陽」宣言。配信開始から33日目（8/1開始）の顔出しなし枠として、生活・通学・進路の話まで届けました。",
  highlights: [
    {
      timestamp: "0:14:00",
      title: "みんなの太陽になりたい",
      body:
        "ミスサークルコンテスト2026出場中の三橋莉子。みんなにはみりぃと呼んでほしいと自己紹介。配信を始めた理由は自分に自信がないから、自信があればもっと幸せを届けられるはず、という自己矛盾を話しました。変わらない目標は、みんなの太陽になること。",
      quote: "みんなの太陽になりたい、それは変わらず",
    },
    {
      timestamp: "0:27:00",
      title: "お化け屋敷は無理。絶叫系は大好き",
      body:
        "お化け屋敷は文化祭の友達運営でも入れないほど苦手で、絶叫系やジェットコースターは大好き、と対比して紹介。好きなお酒はウーロンハイ、おつまみは梅水晶。かきピーの最適解は種7：ピーナッツ3、と最近気づいた話も。",
    },
    {
      timestamp: "0:01:00",
      title: "布団で寝て、7時起き",
      body:
        "リビングではなく布団で寝られた日。リビングだと5:30〜6:00に起きてしまうので、ちゃんと布団で寝られたことを喜んでいました。真夏でも冬用のかけ布団と長袖、という寝方の話も。",
    },
    {
      timestamp: "0:06:00",
      title: "花は、ドライフラワーにしてから",
      body:
        "誕生日にもらった花束を枯らしてしまった反省から、今後花をくれる人にはドライフラワーにしてから渡してほしいとお願い。雑貨の方が似合うかもしれない、でも生花は別格で嬉しい、という正直な感想でした。顔と名前の一致は苦手で、文字で覚えるとも。",
    },
    {
      timestamp: "0:35:00",
      title: "日大まで片道約2時間",
      body:
        "学部ごとにキャンパスが分かれているので近いキャンパスには変えられない、と通学の話。湘南新宿ライン／東海道線で横浜から東京方面。一限だと帰宅ラッシュと重なりほぼ座れない。立っているときは本、座れたら寝る。読書時間はここで確保できている、と話しました。",
    },
    {
      timestamp: "0:45:00",
      title: "自分を、未完成の作品として",
      body:
        "アナウンサーの勉強は続けている一方で、今は立ち止まって「本当にこれがやりたかったのか」を見つめ直している段階、と進路の話。配信は本心に迫るための探求で、自分を未完成の作品として見てほしいと呼びかけました。三次では楽しめる配信と、自分をもっと知ってもらうことを重ねたい、と。",
      quote: "私の人生を一緒に追っていってみてほしい。一つの作品として",
    },
    {
      timestamp: "0:57:00",
      title: "この部屋の鍵",
      body:
        "エンディングで部屋のメタファーを披露。入ることはできるけど出ることはできない、意志が鍵、という話。ランキングを下から読み上げ、仕事中に来てくれた人への感謝を伝えて「おつみりん」「ばいびー」で締めました。",
      quote: "この部屋は入ることはできるけど出ることはできない",
    },
  ],
  goals: [
    {
      item: "アバ権",
      target: "獲得",
      statusThen: "未獲得。ヨダレ必須の寝トマト／みりぃアバ案",
    },
    {
      item: "フォロワー",
      target: "300人",
      statusThen: "251人",
    },
    {
      item: "トマトの栄養素",
      target: "70人",
      statusThen: "今月1人（月初のため）",
    },
    {
      item: "ファンマーク",
      target: "5人",
      statusThen: "2人",
    },
  ],
  ranking: [
    "13 ハルルン",
    "12 ヒロさん",
    "11 ヒロさん",
    "10 まこちゃん",
    "9 アムさん",
    "8 デンダイさん",
    "7 ヘッポコライダーさん",
    "6 たかちゃん",
    "5 ダズルさん",
    "4 ヤミクさん",
    "3 キサラギさん（初期アバ）",
    "2 あっきーさん（仕事中・初期アバ）",
    "1 ひげおやじさん",
  ],
  timeline: [
    { timestamp: "0:00:00", label: "朝の挨拶。「これ誰？」写真クイズ、画面人数の話" },
    { timestamp: "0:01:00", label: "布団で寝た／真夏でもかけ布団と長袖" },
    { timestamp: "0:06:00", label: "誕生日の花を枯らした話。ドライフラワー希望" },
    { timestamp: "0:09:00", label: "ラジオ配信の理由。配信審査は翌日〜12日" },
    { timestamp: "0:14:00", label: "初見向け自己紹介。自信・夢・みんなの太陽" },
    { timestamp: "0:27:00", label: "好きなお酒・おつまみ。9月目標の現状" },
    { timestamp: "0:35:00", label: "体調と睡眠。片道2時間の通学" },
    { timestamp: "0:45:00", label: "進路を見つめ直す。作品としての自分" },
    { timestamp: "0:57:00", label: "ランキング読み上げ。次枠案内。おつみりん" },
  ],
  nextNote:
    "配信内では、同日 14:40〜の短め枠（お昼またぎ・投げ逃げ歓迎）と、夜枠もやるつもり、と案内されました。夜枠の時刻は未確定のままです。",
  sourceLabel: "2026年9月2日 SHOWROOM朝配信 文字起こし（オーナー提供）",
  verifiedAt: "2026-09-02",
  transcriptionNote:
    "自動文字起こしを元に整理しています。固有名詞や数字、ランキング下位の表記には聞き取り誤りの可能性があります。録音音声・画面録画・全文文字起こしは掲載していません。フォロワー数や目標の数字は配信時点の記録です。",
};
