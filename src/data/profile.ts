/**
 * Public profile content must be tied to a first-party or organizer source.
 * Time-sensitive facts, vision, activities, and collections always carry an `asOf` date.
 */
export type ProfileSource = {
  id: string;
  title: string;
  publisher: string;
  url: string;
  verifiedAt: string;
};

export const profileSources = {
  missCircle: {
    id: "miss-circle-entry-734",
    title: "三橋莉子 ENTRY 734",
    publisher: "MISS CIRCLE CONTEST 2026",
    url: "https://2026.misscircle.jp/entry/734",
    verifiedAt: "2026-08-16",
  },
  missCircleSecond: {
    id: "miss-circle-second-stage",
    title: "二次審査進出者一覧",
    publisher: "MISS CIRCLE CONTEST 2026",
    url: "https://2026.misscircle.jp/list/2",
    verifiedAt: "2026-08-16",
  },
  showroom: {
    id: "showroom-profile",
    title: "三橋莉子 #ミスサークル2026 プロフィール",
    publisher: "SHOWROOM",
    url: "https://www.showroom-live.com/room/profile?room_id=573253",
    verifiedAt: "2026-08-16",
  },
  birthdayInstagram: {
    id: "instagram-21st-birthday",
    title: "21歳の誕生日投稿",
    publisher: "三橋莉子 本人Instagram",
    url: "https://www.instagram.com/p/DbiY3PHk1c8/",
    verifiedAt: "2026-08-16",
  },
  instagramProfile: {
    id: "instagram-mily-profile",
    title: "三橋莉子（みりぃ）プロフィール",
    publisher: "三橋莉子 本人Instagram",
    url: "https://www.instagram.com/mily_chan36/",
    verifiedAt: "2026-08-16",
  },
  fmProfile: {
    id: "fm-mily-profile",
    title: "Mily（ミリー）スタッフプロフィール",
    publisher: "FM湘南マジックウェイブ",
    url: "https://fm-smw.jp/staff/mily%EF%BC%88%E3%83%9F%E3%83%AA%E3%83%BC%EF%BC%89",
    verifiedAt: "2026-08-16",
  },
  fmProgram: {
    id: "fm-seaside-circle",
    title: "『湘南シーサイドサークル』番組ページ",
    publisher: "FM湘南マジックウェイブ",
    url: "https://fm-smw.jp/program/%E3%80%8E-%E6%B9%98%E5%8D%97%E3%82%B7%E3%83%BC%E3%82%B5%E3%82%A4%E3%83%89%E3%82%B5%E3%83%BC%E3%82%AF%E3%83%AB-%E3%80%8F%E3%80%80%EF%BC%83ssc",
    verifiedAt: "2026-08-16",
  },
  fmProgramInstagram: {
    id: "fm-program-mily-instagram",
    title: "Milyのパーソナリティ表記がある番組告知",
    publisher: "湘南シーサイドサークル Instagram",
    url: "https://www.instagram.com/seasidecircle/p/DbuTqbtyqzU/",
    verifiedAt: "2026-08-16",
  },
  campusGirlsAward: {
    id: "campus-girls-jury-award",
    title: "予選A 1st STAGE 審査員賞発表",
    publisher: "CAMPUS BOYS / GIRLS",
    url: "https://x.com/campusgirlsboys/status/2082346311865848187",
    verifiedAt: "2026-08-16",
  },
  campusGirlsSecond: {
    id: "campus-girls-second-stage",
    title: "2nd STAGE進出報告",
    publisher: "三橋莉子 本人X",
    url: "https://x.com/Mily_chan36/status/2082484779224842354",
    verifiedAt: "2026-08-16",
  },
} satisfies Record<string, ProfileSource>;

export type ProfileSourceId = keyof typeof profileSources;
export type ProfileFactSection = "identity" | "education" | "interest" | "skill";
export type ProfileStatus = "confirmed" | "time-sensitive";

export type ProfileFact = {
  id: string;
  section: ProfileFactSection;
  label: string;
  value: string;
  detail?: string;
  sourceIds: ProfileSourceId[];
  status: ProfileStatus;
  asOf?: string;
};

export type ProfileVision = {
  id: string;
  title: string;
  body: string;
  sourceIds: ProfileSourceId[];
  status: ProfileStatus;
  asOf?: string;
};

export type ProfileActivity = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  points: string[];
  sourceIds: ProfileSourceId[];
  status: ProfileStatus;
  asOf?: string;
};

export type ProfileCollection = {
  id: string;
  title: string;
  items: string[];
  note: string;
  sourceIds: ProfileSourceId[];
  status: ProfileStatus;
  asOf?: string;
  collapsed?: boolean;
};

export type Profile = {
  displayName: string;
  publicName: string;
  aliases: string[];
  summary: string;
  lastVerifiedAt: string;
  facts: ProfileFact[];
  vision: ProfileVision;
  activities: ProfileActivity[];
  collections: ProfileCollection[];
};

export const profile: Profile = {
  displayName: "みりぃ",
  publicName: "三橋莉子",
  aliases: ["Mily（ミリー）"],
  summary:
    "神奈川県出身、日本大学3年。ラジオパーソナリティとして声を届け、ライブ配信で人とつながり、大学生コンテストでは自ら新しい一歩を踏み出しています。話すこと・歌うこと・挑戦することを大切にする大学生です。",
  lastVerifiedAt: "2026-08-16",
  facts: [
    {
      id: "public-name",
      section: "identity",
      label: "公表名",
      value: "三橋莉子（みつはし りこ）",
      sourceIds: ["missCircle"],
      status: "confirmed",
    },
    {
      id: "activity-names",
      section: "identity",
      label: "活動名",
      value: "みりぃ / Mily（ミリー）",
      detail: "SHOWROOMでは「みりぃ」、本人Instagramでは「mily」、FM公式ページでは「Mily（ミリー）」。",
      sourceIds: [
        "showroom",
        "missCircle",
        "instagramProfile",
        "fmProgramInstagram",
        "fmProfile",
      ],
      status: "confirmed",
    },
    {
      id: "birthday",
      section: "identity",
      label: "生年月日",
      value: "2005年8月2日",
      detail: "2005年8月2日生まれ。",
      sourceIds: ["showroom", "birthdayInstagram"],
      status: "confirmed",
    },
    {
      id: "hometown",
      section: "identity",
      label: "出身地",
      value: "神奈川県",
      sourceIds: ["missCircle", "showroom"],
      status: "confirmed",
    },
    {
      id: "university",
      section: "education",
      label: "大学・学年",
      value: "日本大学 3年",
      sourceIds: ["missCircle"],
      status: "time-sensitive",
      asOf: "2026-08-16",
    },
    {
      id: "circle",
      section: "education",
      label: "所属サークル",
      value: "ラジオ研究",
      sourceIds: ["missCircle"],
      status: "time-sensitive",
      asOf: "2026-08-16",
    },
    {
      id: "hobby",
      section: "interest",
      label: "趣味",
      value: "ChatGPTとの英会話",
      sourceIds: ["missCircle"],
      status: "time-sensitive",
      asOf: "2026-08-16",
    },
    {
      id: "special-skill",
      section: "skill",
      label: "特技",
      value: "篠笛",
      sourceIds: ["missCircle"],
      status: "time-sensitive",
      asOf: "2026-08-16",
    },
    {
      id: "fan-name",
      section: "interest",
      label: "ファンネーム",
      value: "トマトの栄養素🍅",
      sourceIds: ["showroom"],
      status: "time-sensitive",
      asOf: "2026-08-16",
    },
  ],
  vision: {
    id: "vision",
    title: "一歩を踏み出すための「根拠のない自信、勇気」を届ける",
    body:
      "自己肯定感や自己効力感が低いと感じる人にも、一歩を踏み出すきっかけを渡せる人になることを将来の夢として掲げています。自分自身も挑戦を重ね、その姿を通して誰かの背中をそっと押そうとしています。",
    sourceIds: ["missCircle"],
    status: "time-sensitive",
    asOf: "2026-08-16",
  },
  activities: [
    {
      id: "radio",
      eyebrow: "RADIO",
      title: "湘南から、等身大の声を届ける",
      body:
        "FM湘南マジックウェイブ「湘南シーサイドサークル」の日曜パーソナリティ、Mily（ミリー）。",
      points: [
        "『湘南シーサイドサークル』の日曜パーソナリティ",
        "番組枠は日曜10:00〜13:00",
        "番組枠3時間＝本人の出演時間ではありません",
      ],
      sourceIds: [
        "missCircle",
        "instagramProfile",
        "fmProgramInstagram",
        "fmProfile",
        "fmProgram",
      ],
      status: "time-sensitive",
      asOf: "2026-08-16",
    },
    {
      id: "showroom",
      eyebrow: "LIVE STREAM",
      title: "人とのやり取りを楽しむライブ配信",
      body:
        "コンテスト用のSHOWROOMルームで、2026年8月1日に初配信。歌うこと・話すこと・挑戦することを好きなこととして紹介しています。",
      points: ["初配信は2026年8月1日", "ファンネームは「トマトの栄養素🍅」"],
      sourceIds: ["showroom"],
      status: "time-sensitive",
      asOf: "2026-08-16",
    },
    {
      id: "miss-circle",
      eyebrow: "MISS CIRCLE",
      title: "ENTRY 734として新しい一歩へ",
      body:
        "MISS CIRCLE CONTEST 2026に三橋莉子として出場。Bブロックから二次審査へ進出。",
      points: ["ENTRY 734", "Bブロック", "二次審査進出"],
      sourceIds: ["missCircle", "missCircleSecond"],
      status: "time-sensitive",
      asOf: "2026-08-16",
    },
    {
      id: "campus-girls",
      eyebrow: "CAMPUS GIRLS",
      title: "審査員賞で2nd STAGEへ",
      body:
        "CAMPUS GIRLS 2027の予選A・1st STAGEで審査員賞に選出され、本人も2nd STAGE進出を報告しています。",
      points: ["予選A 1st STAGE 審査員賞", "2nd STAGE進出"],
      sourceIds: ["campusGirlsAward", "campusGirlsSecond"],
      status: "time-sensitive",
      asOf: "2026-08-16",
    },
  ],
  collections: [
    {
      id: "music",
      title: "音楽との歩み",
      items: [
        "中学・高校の6年間は吹奏楽部",
        "担当楽器はトロンボーン",
        "大所帯の吹奏楽部でキャプテン",
        "現在の特技は篠笛",
      ],
      note: "中学・高校の吹奏楽部から、現在の特技・篠笛まで。",
      sourceIds: ["missCircle", "instagramProfile", "fmProgramInstagram", "fmProfile"],
      status: "time-sensitive",
      asOf: "2026-08-16",
    },
    {
      id: "interests",
      title: "趣味・好きなこと",
      items: [
        "ChatGPTとの英会話",
        "歌うこと",
        "話すこと",
        "挑戦すること",
        "ミュージカル鑑賞",
        "お笑い",
        "YouTube・TikTok・Instagram",
        "メイク",
        "ファッション",
      ],
      note: "英会話、歌、ミュージカル、お笑い、メイク、ファッションなど。",
      sourceIds: [
        "missCircle",
        "showroom",
        "instagramProfile",
        "fmProgramInstagram",
        "fmProfile",
      ],
      status: "time-sensitive",
      asOf: "2026-08-16",
    },
    {
      id: "food",
      title: "食の好み",
      items: [
        "おつまみ",
        "エビ",
        "タコ",
        "イカ",
        "カニ",
        "鮪の刺身は苦手",
        "サーモンは苦手",
        "パクチーは苦手",
      ],
      note: "好きなものと、ちょっと苦手なもの。",
      sourceIds: ["showroom"],
      status: "time-sensitive",
      asOf: "2026-08-16",
      collapsed: true,
    },
    {
      id: "inspirations",
      title: "好きな俳優・アーティスト・発信者",
      items: [
        "上白石萌音",
        "大森元貴",
        "あさぎーにょ",
        "かきぶちももの",
        "momoho",
        "KYOKA",
        "にょっき",
        "多田梨音",
        "田中陽菜",
        "GYUTAE",
        "コムドット やまと",
        "ニシコリユーダイド",
        "ニシコリジュンジ",
      ],
      note: "俳優、アーティスト、発信者。",
      sourceIds: ["missCircle", "instagramProfile", "fmProgramInstagram", "fmProfile"],
      status: "time-sensitive",
      asOf: "2026-08-16",
      collapsed: true,
    },
    {
      id: "episodes",
      title: "ちょっと意外な一面",
      items: [
        "FMプロフィールでの自己紹介は「大学生 兼 みんなの太陽」",
        "お化け屋敷は怖くて未体験",
        "文化祭でプリキュアになりきった思い出",
        "FM仲間から「キャプテンMily」と呼ばれることも",
        "大磯・二宮・中井の、静かでゆったりした場所がおすすめ",
      ],
      note: "自己紹介、思い出、おすすめの場所など。",
      sourceIds: [
        "showroom",
        "missCircle",
        "instagramProfile",
        "fmProgramInstagram",
        "fmProfile",
      ],
      status: "time-sensitive",
      asOf: "2026-08-16",
      collapsed: true,
    },
  ],
};