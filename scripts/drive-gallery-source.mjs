/** Build-only source registry for Gallery batch b02.
 *
 * THIS MODULE MUST NEVER BE IMPORTED FROM src/. It holds the individual Drive
 * file ids, which are build inputs only: the browser never talks to Google.
 * scripts/build-drive-gallery.mjs reads this, downloads each registered file,
 * strips its metadata and writes sanitized derivatives plus a generated
 * manifest that the client actually renders.
 *
 * Rules:
 * - individual file ids only; no folder id, no folder URL, no folder listing
 * - no Drive file names
 * - `privacyState: "hold"` is never downloaded and never published
 * - `contentVerified: false` is never downloaded and never published
 */

/** @typedef {"photo" | "video"} DriveSourceKind */
/** @typedef {"approved" | "hold"} DriveSourcePrivacyState */

/**
 * @typedef {object} DriveSourceEntry
 * @property {string} id
 * @property {DriveSourceKind} kind
 * @property {string} fileId
 * @property {string} alt
 * @property {boolean} contentVerified
 * @property {DriveSourcePrivacyState} privacyState
 */

/** Publication gate for the whole batch. Flip to "published" only after the
 *  owner confirms Drive sharing is read-only and every alt is verified.
 *  While "review", the ingest makes no network request at all. */
export const driveGalleryPublication = { state: "review" };

/** Output basename for an entry: "mily-drive-b02-p02" -> "mily-b02-p02". */
export function outputSlug(id) {
  return id.replace(/^mily-drive-/, "mily-");
}

/** @type {DriveSourceEntry[]} */
export const driveGallerySource = [
  {
    id: "mily-drive-b02-p01",
    kind: "photo",
    fileId: "15mJln0TawgXBhMdwjvAH9c-JmOOjagen",
    alt: "喫茶店のカウンター席でノートパソコンを開いているBeReal写真",
    contentVerified: true,
    privacyState: "hold",
  },
  {
    id: "mily-drive-b02-p02",
    kind: "photo",
    fileId: "1nSY1Ita1Qd8JgEIxTC67WN3kpIn1r1bf",
    alt: "具材を選ぶ飲食店で、野菜などを入れたボウルを手にしている様子",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p03",
    kind: "photo",
    fileId: "1GwIaJaaVH4a3p7Sag-QkzV34Yd8II2W6",
    alt: "飲食店で大きな麺料理の器を両手で持つみりぃさん",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p04",
    kind: "photo",
    fileId: "1vwsymU09O8b7JmcJQye6AHPNisqw7uDK",
    alt: "飲食店のテーブルで麺料理を前に笑うみりぃさん",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p05",
    kind: "photo",
    fileId: "1QomdecFKM-YHvmCmrSeNSkgbDkgQ4ipd",
    alt: "青いキャップと紺色のジャージ姿で、屋外に立つみりぃさん",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p06",
    kind: "photo",
    fileId: "1XPa8nBM5M0aAIKwvNuPwzg2KZsDd551F",
    alt: "青いキャップと紺色のジャージ姿で、帽子のつばに手を添えて立つみりぃさん",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p07",
    kind: "photo",
    fileId: "1CXJ31A14QyIt8sE-8JIb3h0RpGstTZYo",
    alt: "青いキャップとダウンジャケット姿で、衣料品売り場の前で服を手に取るみりぃさん",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p08",
    kind: "photo",
    fileId: "1i9HzEYc2G1zYzXevhxMGO37r1n3-hRg2",
    alt: "カフェのカウンター席で、ノートパソコンとノートを開いて作業するBeReal写真",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p09",
    kind: "photo",
    fileId: "1gg0BrXS0qi1kU6EENH05dXO4JTPjcG9l",
    alt: "飲食店で大きな麺料理を前に、カメラを見るみりぃさん",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p10",
    kind: "photo",
    fileId: "1BiGT84RirHiqZXECOI0xBEJ24o8ZvdS-",
    alt: "飲食店のテーブルで麺料理を前に、手元を見るみりぃさん",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p11",
    kind: "photo",
    fileId: "1dci-XApsoy9mZCl5EUaRA9QrYCOedPqW",
    alt: "カフェのテーブルに広げた英語のプリントとメニュー",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p12",
    kind: "photo",
    fileId: "1XR5hF30ST0XslV_Ug-j2Ti7Fak9HWFal",
    alt: "ノートパソコンでニュース記事を開き、水のボトルを置いた机",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p13",
    kind: "photo",
    fileId: "1TAE5CchA-oZne04Z8Ec0umWA5-GYZPYD",
    alt: "ノートパソコンと書き込んだノートを広げた勉強机（自撮りの小窓つき）",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p14",
    kind: "photo",
    fileId: "1t9f0SfNlXWAdmo7N42UptwAvADLdIEhP",
    alt: "自習スペースの木の机に並べたノートパソコン・ノート・プリントと飲み物",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p15",
    kind: "photo",
    fileId: "1xxvHXV8X7Y77Vy5dtNxErw6swFNUiVeO",
    alt: "キャップとパーカー姿で自習スペースに着いたみりぃさん（机にはノートパソコンとプリント）",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p16",
    kind: "photo",
    fileId: "1kOpnhpq3pXPpySomlsdZ4TVujdVbhalf",
    alt: "机に並んだマスキングテープ・ペン・カフェオーレの紙パックとデジタル時計",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p17",
    kind: "photo",
    fileId: "1AGvkAGXTDAVCMfJYcHOceAVUhcs3oCrE",
    alt: "ノートパソコンのキーボードの横に開いた英単語帳",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p18",
    kind: "photo",
    fileId: "1ljwP-du24LjNI_haziuz_mP6WxK2cKue",
    alt: "タブレットにベートーヴェンの資料を表示した勉強机と文具",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p19",
    kind: "photo",
    fileId: "1lDfynh4Rg0zBzHUyrzx0n085RG7Sp-8S",
    alt: "国際関係の用語を書き込んだルーズリーフとボールペン",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p20",
    kind: "photo",
    fileId: "1FB9pGilf__JN0q_nvHXSQA_DGzMKIkzD",
    alt: "タブレットにショパンの資料を表示した机とリングノート",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p21",
    kind: "photo",
    fileId: "1NR_dCXli-RcJhT0zr6dgiapu1LuDjQFx",
    alt: "2次関数の教科書とタブレットの手書きノートを並べた勉強机",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p22",
    kind: "photo",
    fileId: "1GEgggZ309GX9hR-LzNNCo9CS13LDAdcQ",
    alt: "夕暮れの海の写真を表示したタブレットと2冊のリングノート",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p23",
    kind: "photo",
    fileId: "1EE-h7ucCWtTX1hl0HcHxZaT8QDoS4fxG",
    alt: "赤ペンで丸つけをした漢字の問題集",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p24",
    kind: "photo",
    fileId: "1tHqVo-BKzmg35-uWno8nXGpgIyDpsbUF",
    alt: "フットサルのコート図とルールを書き込んだ手書きノート",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p25",
    kind: "photo",
    fileId: "1dGHTN70k2mzAYp7uXBOGPxIvzYGZcB32",
    alt: "アプリのホーム画面を開いたタブレットと文具を置いた机",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p26",
    kind: "photo",
    fileId: "1INEtqv1Zo3cqg7SjSkEMO0OhoFyUl9qe",
    alt: "色ペンを並べた国語のプリントとタブレットの本文表示",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p27",
    kind: "photo",
    fileId: "1NFcrsJE_wNd-ggpyAMYVqwKAFs-6if5i",
    alt: "関数のグラフを書いたノートとタブレット、数学の教科書",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p28",
    kind: "photo",
    fileId: "1Pd0Vhzd3YwiXWWmz5axLOn4EnVnsWz8C",
    alt: "抹茶ラテのボトルを置いて、マーカーを引いた政治・経済の参考書",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p29",
    kind: "photo",
    fileId: "13U4ZrSCTvWv_CjSiUhpFoPiknoY70U8X",
    alt: "英単語帳を手に持って開いたところ（自撮りの小窓つき）",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p30",
    kind: "photo",
    fileId: "1rPncAwzXNXJ3Q3k27mHqabrE048VmT7J",
    alt: "英語の勉強メモを書いたルーズリーフと腕時計・ペン",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p31",
    kind: "photo",
    fileId: "1mVHBCIS8Zg1gHw-a64hG9dNvX_iaLQnE",
    alt: "薄暗い部屋で開いた英単語帳のページ",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p32",
    kind: "photo",
    fileId: "1N1OBEatPjJlVG6MJv_gOr-mDjX3U2_Bf",
    alt: "物理基礎の加速度の公式を書いたリングノート",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p33",
    kind: "photo",
    fileId: "1NxM-Hj1Rvswlac2XoTak0ynrFY3cOMAP",
    alt: "窓辺で英単語帳を手に持って開いたところ",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p34",
    kind: "photo",
    fileId: "1KlWnOUfrPdV8MHLlj4MbDJQSPdZ2EEDc",
    alt: "照明の下で参考書を見開きにして手に持ったところ",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p35",
    kind: "photo",
    fileId: "1nn8r92n7pgTXSP1M0CBJduR9hl8KkNvZ",
    alt: "蛍光ペンを並べた国語のプリントとタブレットの文書",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p36",
    kind: "photo",
    fileId: "1q7Wfu-Ex-X7KKE_hbCDur19fPYv1TQuF",
    alt: "キャップ姿で花束を持ち、ピースサインをするみりぃさんとバースデープレート",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p37",
    kind: "photo",
    fileId: "18JaQazARzuBAm6pWET0DkLC2p_TE6z9-",
    alt: "腕時計とペンを添えた英語の勉強メモ（別アングル）",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p38",
    kind: "photo",
    fileId: "1kPTc8AtS_JoYupNZIB9SG8vrQHpD20O6",
    alt: "フットサルの戦術を図解した手書きノート（別アングル）",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p39",
    kind: "photo",
    fileId: "10DO4MQMvM4ywAR_sgqlRHnIw-uHQsUiJ",
    alt: "夜のイチョウ並木で、イチョウの落ち葉を顔の前にかざすみりぃさん",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p40",
    kind: "photo",
    fileId: "15UWR9PG6EWNbcjve9kf5kt_80T7lpyyI",
    alt: "2つの花束と「Happy Birthday」と書かれたバースデープレート",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p41",
    kind: "photo",
    fileId: "1KcQY5IU609PLEgfk2ZnVk4n5PfRD0nsc",
    alt: "水色の包みの花束を抱えて立つみりぃさん",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p42",
    kind: "photo",
    fileId: "1n2nSU6-g-e6cSZXnzltm09lDaz835Ueu",
    alt: "花束を抱えて笑うみりぃさん",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p43",
    kind: "photo",
    fileId: "1b_qcLW6WqVzxgiegcN8FHsi5QSVWTqyL",
    alt: "ギフトボックスに入ったネックレスとショップの紙袋",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p44",
    kind: "photo",
    fileId: "1PnK8PD4Zqz9Zlq1u7hwUBlevUqxMf0cV",
    alt: "花束を持ってカメラに向かって表情をつくるみりぃさん",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p45",
    kind: "photo",
    fileId: "1qJlOc3rJYHv1--Fxg159l2ZM2-3koIlC",
    alt: "花束を肩に抱えて立つみりぃさんの全身",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p46",
    kind: "photo",
    fileId: "13IIL8T0w4wbouL6WtNBi2cK8vdJICJ9t",
    alt: "白い背景でファーのベストを着て腕を組むみりぃさん",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-v01",
    kind: "video",
    fileId: "1En1SlMRb9sjZHu7CLncIowopiKXbwl8d",
    alt: "IKEAでの移動や食事を、時刻表示とともにまとめた1日の縦動画",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-v02",
    kind: "video",
    fileId: "16U67BF5lcHH22rwVx6kzXocFRJibIvfc",
    alt: "授業・移動・夜の食事を、時刻表示とともにまとめた1日の縦動画",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-v03",
    kind: "video",
    fileId: "1OYI5Cv0frvKTPlHm75CpGaFJYMLMJpDp",
    alt: "カフェでノートパソコンとノートを広げ、勉強する様子を「Study time」と表示した縦動画",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-v04",
    kind: "video",
    fileId: "1SS3vNeUinVFpa4gl9pm8XhWYtHjjwyD0",
    alt: "通学・移動・買い物を、時刻表示とともにまとめた1日の縦動画",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-v05",
    kind: "video",
    fileId: "1unD-yKtP8tXQ2t4DFZofHQtEF62co2RM",
    alt: "机でプリントやノートに書き込みながら、勉強する手元を映した縦動画",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-v06",
    kind: "video",
    fileId: "1StqV8JTbJY67PIpPk7aFdCZZYqa7gdHA",
    alt: "ピンクのキャップでマイクの前に座り、テーマ「部活動」を紹介する縦動画",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-v07",
    kind: "video",
    fileId: "1vokzkXO7htHnAypw1QbAxK6R8gZYslmr",
    alt: "「おはよう」の挨拶とラジオ放送の予告を表示した短い自撮り動画",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-v08",
    kind: "video",
    fileId: "143Q5mOfSUNz7WOb53aQ-E1K6UJ55TvuL",
    alt: "「おはよう〜！」と挨拶し、本日の投票案内を表示する自撮り動画",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-v09",
    kind: "video",
    fileId: "1yb-k263WGAog6dRGGvPlZrtLPUqs1tYO",
    alt: "ジャケット姿で「OHAYO!」と表示して呼びかける自撮り動画",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-v10",
    kind: "video",
    fileId: "11cYNJfbBBrNFHxh3m_Ap0ZeUNgtoQvZd",
    alt: "車内でキャップをかぶり「OHAYO!」と表示して挨拶する縦動画",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-v11",
    kind: "video",
    fileId: "1h6d2n47nJX1isjQFyzoFngNk1gzS3kOl",
    alt: "湘南シーサイドサークルの10:00〜13:00放送を、バレーボール風の映像とともに案内する縦動画",
    contentVerified: true,
    privacyState: "approved",
  },
];

/** Entries the ingest is allowed to download and publish. */
export function publishableSource(items = driveGallerySource) {
  return items.filter(
    (item) => item.contentVerified && item.privacyState === "approved",
  );
}

/** Entries still waiting for an owner-confirmed description. */
export function unverifiedSource(items = driveGallerySource) {
  return items.filter((item) => !item.contentVerified);
}

/** Entries held back by privacy review. Registered, never downloaded. */
export function privacyHoldSource(items = driveGallerySource) {
  return items.filter((item) => item.privacyState === "hold");
}
