/** Build-only entry registry for Gallery batch b02.
 *
 * THIS MODULE MUST NEVER BE IMPORTED FROM src/.
 *
 * It deliberately holds **no Drive file id, no Drive folder id and no original
 * file name**. This repository is public, so any Drive identifier committed
 * here would be a public route to the unsanitized originals. The receiving
 * Drive folder is Restricted, which retires the identifiers that appear in this
 * branch's earlier commits.
 *
 * The ingest reads its originals from a gitignored local directory
 * (`media/drive-b02-original/`, see its README) and matches them to these
 * entries by id. Nothing here reaches the browser: the client renders only the
 * generated manifest of sanitized derivatives.
 *
 * Rules:
 * - no Drive identifiers, no original file names
 * - `privacyState: "hold"` is never sanitized and never published
 * - `contentVerified: false` is never sanitized and never published
 */

/** @typedef {"photo" | "video"} DriveSourceKind */
/** @typedef {"approved" | "hold"} DriveSourcePrivacyState */

/**
 * @typedef {object} DriveSourceEntry
 * @property {string} id
 * @property {DriveSourceKind} kind
 * @property {string} alt
 * @property {boolean} contentVerified
 * @property {DriveSourcePrivacyState} privacyState
 */

/** Publication gate for the whole batch. Flip to "published" only after every
 *  alt is verified and the owner has approved publication. While "review", the
 *  ingest reads nothing and writes an empty manifest. */
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
    alt: "喫茶店のカウンター席でノートパソコンを開いているBeReal写真",
    contentVerified: true,
    privacyState: "hold",
  },
  {
    id: "mily-drive-b02-p02",
    kind: "photo",
    alt: "具材を選ぶ飲食店で、野菜などを入れたボウルを手にしている様子",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p03",
    kind: "photo",
    alt: "飲食店で大きな麺料理の器を両手で持つみりぃさん",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p04",
    kind: "photo",
    alt: "飲食店のテーブルで麺料理を前に笑うみりぃさん",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p05",
    kind: "photo",
    alt: "青いキャップと紺色のジャージ姿で、屋外に立つみりぃさん",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p06",
    kind: "photo",
    alt: "青いキャップと紺色のジャージ姿で、帽子のつばに手を添えて立つみりぃさん",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p07",
    kind: "photo",
    alt: "青いキャップとダウンジャケット姿で、衣料品売り場の前で服を手に取るみりぃさん",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p08",
    kind: "photo",
    alt: "カフェのカウンター席で、ノートパソコンとノートを開いて作業するBeReal写真",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p09",
    kind: "photo",
    alt: "飲食店で大きな麺料理を前に、カメラを見るみりぃさん",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p10",
    kind: "photo",
    alt: "飲食店のテーブルで麺料理を前に、手元を見るみりぃさん",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p11",
    kind: "photo",
    alt: "カフェのテーブルに広げた英語のプリントとメニュー",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p12",
    kind: "photo",
    alt: "ノートパソコンでニュース記事を開き、水のボトルを置いた机",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p13",
    kind: "photo",
    alt: "ノートパソコンと書き込んだノートを広げた勉強机（自撮りの小窓つき）",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p14",
    kind: "photo",
    alt: "自習スペースの木の机に並べたノートパソコン・ノート・プリントと飲み物",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p15",
    kind: "photo",
    alt: "キャップとパーカー姿で自習スペースに着いたみりぃさん（机にはノートパソコンとプリント）",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p16",
    kind: "photo",
    alt: "机に並んだマスキングテープ・ペン・カフェオーレの紙パックとデジタル時計",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p17",
    kind: "photo",
    alt: "ノートパソコンのキーボードの横に開いた英単語帳",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p18",
    kind: "photo",
    alt: "タブレットにベートーヴェンの資料を表示した勉強机と文具",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p19",
    kind: "photo",
    alt: "国際関係の用語を書き込んだルーズリーフとボールペン",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p20",
    kind: "photo",
    alt: "タブレットにショパンの資料を表示した机とリングノート",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p21",
    kind: "photo",
    alt: "2次関数の教科書とタブレットの手書きノートを並べた勉強机",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p22",
    kind: "photo",
    alt: "夕暮れの海の写真を表示したタブレットと2冊のリングノート",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p23",
    kind: "photo",
    alt: "赤ペンで丸つけをした漢字の問題集",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p24",
    kind: "photo",
    alt: "フットサルのコート図とルールを書き込んだ手書きノート",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p25",
    kind: "photo",
    alt: "アプリのホーム画面を開いたタブレットと文具を置いた机",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p26",
    kind: "photo",
    alt: "色ペンを並べた国語のプリントとタブレットの本文表示",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p27",
    kind: "photo",
    alt: "関数のグラフを書いたノートとタブレット、数学の教科書",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p28",
    kind: "photo",
    alt: "抹茶ラテのボトルを置いて、マーカーを引いた政治・経済の参考書",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p29",
    kind: "photo",
    alt: "英単語帳を手に持って開いたところ（自撮りの小窓つき）",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p30",
    kind: "photo",
    alt: "英語の勉強メモを書いたルーズリーフと腕時計・ペン",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p31",
    kind: "photo",
    alt: "薄暗い部屋で開いた英単語帳のページ",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p32",
    kind: "photo",
    alt: "物理基礎の加速度の公式を書いたリングノート",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p33",
    kind: "photo",
    alt: "窓辺で英単語帳を手に持って開いたところ",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p34",
    kind: "photo",
    alt: "照明の下で参考書を見開きにして手に持ったところ",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p35",
    kind: "photo",
    alt: "蛍光ペンを並べた国語のプリントとタブレットの文書",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p36",
    kind: "photo",
    alt: "キャップ姿で花束を持ち、ピースサインをするみりぃさんとバースデープレート",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p37",
    kind: "photo",
    alt: "腕時計とペンを添えた英語の勉強メモ（別アングル）",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p38",
    kind: "photo",
    alt: "フットサルの戦術を図解した手書きノート（別アングル）",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p39",
    kind: "photo",
    alt: "夜のイチョウ並木で、イチョウの落ち葉を顔の前にかざすみりぃさん",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p40",
    kind: "photo",
    alt: "2つの花束と「Happy Birthday」と書かれたバースデープレート",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p41",
    kind: "photo",
    alt: "水色の包みの花束を抱えて立つみりぃさん",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p42",
    kind: "photo",
    alt: "花束を抱えて笑うみりぃさん",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p43",
    kind: "photo",
    alt: "ギフトボックスに入ったネックレスとショップの紙袋",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p44",
    kind: "photo",
    alt: "花束を持ってカメラに向かって表情をつくるみりぃさん",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p45",
    kind: "photo",
    alt: "花束を肩に抱えて立つみりぃさんの全身",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-p46",
    kind: "photo",
    alt: "白い背景でファーのベストを着て腕を組むみりぃさん",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-v01",
    kind: "video",
    alt: "IKEAでの移動や食事を、時刻表示とともにまとめた1日の縦動画",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-v02",
    kind: "video",
    alt: "授業・移動・夜の食事を、時刻表示とともにまとめた1日の縦動画",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-v03",
    kind: "video",
    alt: "カフェでノートパソコンとノートを広げ、勉強する様子を「Study time」と表示した縦動画",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-v04",
    kind: "video",
    alt: "通学・移動・買い物を、時刻表示とともにまとめた1日の縦動画",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-v05",
    kind: "video",
    alt: "机でプリントやノートに書き込みながら、勉強する手元を映した縦動画",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-v06",
    kind: "video",
    alt: "ピンクのキャップでマイクの前に座り、テーマ「部活動」を紹介する縦動画",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-v07",
    kind: "video",
    alt: "「おはよう」の挨拶とラジオ放送の予告を表示した短い自撮り動画",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-v08",
    kind: "video",
    alt: "「おはよう〜！」と挨拶し、本日の投票案内を表示する自撮り動画",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-v09",
    kind: "video",
    alt: "ジャケット姿で「OHAYO!」と表示して呼びかける自撮り動画",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-v10",
    kind: "video",
    alt: "車内でキャップをかぶり「OHAYO!」と表示して挨拶する縦動画",
    contentVerified: true,
    privacyState: "approved",
  },
  {
    id: "mily-drive-b02-v11",
    kind: "video",
    alt: "湘南シーサイドサークルの10:00〜13:00放送を、バレーボール風の映像とともに案内する縦動画",
    contentVerified: true,
    privacyState: "approved",
  },
];

/** Entries the ingest is allowed to sanitize and publish. */
export function publishableSource(items = driveGallerySource) {
  return items.filter(
    (item) => item.contentVerified && item.privacyState === "approved",
  );
}

/** Entries still waiting for an owner-confirmed description. */
export function unverifiedSource(items = driveGallerySource) {
  return items.filter((item) => !item.contentVerified);
}

/** Entries held back by privacy review. Registered, never sanitized. */
export function privacyHoldSource(items = driveGallerySource) {
  return items.filter((item) => item.privacyState === "hold");
}
