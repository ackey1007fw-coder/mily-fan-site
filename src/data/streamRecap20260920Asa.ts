import type { StreamRecap, StreamRecapImage } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildRankingNote, buildTranscriptionNote } from "./streamRecapRules.ts";

const stills: StreamRecapImage[] = [
  { src: "/media/live/mily-b134-01-morning.jpg", width: 640, height: 360, alt: "早朝の自然な表情のみりぃ", caption: "0:03:40 早朝の自然な表情", downloadName: "みりぃ_20260920朝_01.jpg" },
  { src: "/media/live/mily-b134-02-morning.jpg", width: 640, height: 360, alt: "朝の会話を楽しむみりぃ", caption: "0:24:10 会話を楽しむ朝", downloadName: "みりぃ_20260920朝_02.jpg" },
  { src: "/media/live/mily-b134-03-morning.jpg", width: 640, height: 360, alt: "カメラに向かって話すみりぃ", caption: "0:34:18 「歌と笑顔のみりぃ」", downloadName: "みりぃ_20260920朝_03.jpg" },
  { src: "/media/live/mily-b134-04-morning.jpg", width: 640, height: 360, alt: "自己紹介をするみりぃ", caption: "1:02:50 自己紹介トーク", downloadName: "みりぃ_20260920朝_04.jpg" },
  { src: "/media/live/mily-b134-05-morning.jpg", width: 640, height: 360, alt: "歌う前に話すみりぃ", caption: "1:12:14 歌う前のひととき", downloadName: "みりぃ_20260920朝_05.jpg" },
  { src: "/media/live/mily-b134-06-morning.jpg", width: 640, height: 360, alt: "歌っているみりぃ", caption: "1:14:20 歌唱中の表情", downloadName: "みりぃ_20260920朝_06.jpg" },
  { src: "/media/live/mily-b134-07-morning.jpg", width: 640, height: 360, alt: "髪をピンで留めたみりぃ", caption: "1:18:18 ピン留めみりぃ", downloadName: "みりぃ_20260920朝_07.jpg" },
  { src: "/media/live/mily-b134-08-morning.jpg", width: 640, height: 360, alt: "朝配信で笑顔のみりぃ", caption: "1:22:28 朝の笑顔", downloadName: "みりぃ_20260920朝_08.jpg" },
  { src: "/media/live/mily-b134-09-morning.jpg", width: 640, height: 360, alt: "楽しそうに話すみりぃ", caption: "1:32:20 楽しそうなトーク", downloadName: "みりぃ_20260920朝_09.jpg" },
  { src: "/media/live/mily-b134-10-morning.jpg", width: 640, height: 360, alt: "終盤にお礼を伝えるみりぃ", caption: "1:52:25 終盤のお礼", downloadName: "みりぃ_20260920朝_10.jpg" },
];

export const streamRecap20260920Asa: StreamRecap = {
  id: "2026-09-20-asa-showroom",
  date: "2026-09-20",
  dateLabel: "2026.09.20（日）",
  theme: "朝の歌と努力の原点",
  broadcastLabel: "5:30頃〜 約113分",
  platformLabel: "SHOWROOM",
  summary: "歌やラジオが好きという自己紹介から「weeeek」の歌唱へ。配信を始めた頃の不安、高校の吹奏楽で一番下からキャプテンになった経験を振り返り、「努力は報われる」と四次審査への思いを語った朝配信です。",
  image: stills[7],
  gallery: stills,
  galleryZip: {
    src: "/media/live/mily-b134-morning-stills.zip",
    filename: "みりぃ_20260920朝_スクショ10枚.zip",
    label: "10枚まとめて保存",
  },
  songs: [
    {
      title: "weeeek",
      artist: "NEWS",
      timestamp: "1:12:59",
      youtubeUrl: "https://www.youtube.com/watch?v=bYAvL803fAE",
    },
  ],
  highlights: [
    {
      timestamp: "0:34:17",
      title: "「歌と笑顔のみりぃ」",
      body: "初めて来た人にも届くように、自分を「歌と笑顔のみりぃ」と紹介。フォローして次の配信でも会おうと、明るく呼びかけました。",
    },
    {
      timestamp: "1:02:51",
      title: "好きなことを自己紹介",
      body: "歌が大好きで、おしゃべりやラジオも好きだと改めて自己紹介。早朝ならではの自然体も含めて知ってほしいと話しました。",
    },
    {
      timestamp: "1:12:14",
      title: "昨日歌いたかった曲へ",
      body: "前日の配信で歌いたかった曲があると話し、「weeeek」の歌唱へ。朝の空気を切り替えるような一曲になりました。",
    },
    {
      timestamp: "1:30:32",
      title: "配信が本当に楽しい",
      body: "終わる時間が近づいても、配信をやめるのが惜しいと話すみりぃ。配信することも、みんなと話すことも楽しいと伝えました。",
      clip: {
        src: "/media/live-clips/mily-b134-11-stream-joy.mp4",
        poster: "/media/live-clips/mily-b134-11-stream-joy-poster.jpg",
        width: 640,
        height: 360,
        durationSeconds: 16.1,
        sourceTimestamp: "1:30:32",
      },
      socialClip: {
        title: "配信が本当に楽しい",
        sourceTimestamp: "1:30:32",
        durationSeconds: 16.1,
        links: [
          { platform: "youtube", url: "https://www.youtube.com/watch?v=OnYV7IlyXyA" },
          { platform: "tiktok", url: "https://www.tiktok.com/t/7687477989990305040" },
          { platform: "instagram", url: "https://www.instagram.com/reel/DdfyYOpDuVi/" },
          { platform: "x", url: "https://x.com/ackey_RiRi_supp/status/2101537299720769828" },
        ],
      },
    },
    {
      timestamp: "1:32:29",
      title: "配信を始めた頃の不安",
      body: "始めたばかりの頃は配信が怖く、涙を流したこともあったと回想。それでも温かく迎えてもらい、今は配信を楽しめていると振り返りました。",
    },
    {
      timestamp: "1:34:40",
      title: "一歩踏み出す勇気",
      body: "最初は配信ボタンを押すこと自体が大きな一歩だったと振り返り、踏み出したからこそ見えたものがあると話しました。",
    },
    {
      timestamp: "1:35:58",
      title: "一番下からキャプテンへ",
      body: "高校の吹奏楽では周囲との実力差に悔しさを感じたところから、練習や掃除、挨拶などを積み重ね、最後は投票と推薦でキャプテンになった経験を語りました。",
    },
    {
      timestamp: "1:48:42",
      title: "「努力は報われる」を胸に",
      body: "望んだ形と違っても努力は別の形で報われると語り、最後までやり切ってファイナルへ進みたいという思いを伝えました。",
    },
  ],
  goals: [
    { item: "四次審査", target: "ファイナル", statusThen: "最後までやり切る" },
  ],
  ranking: [buildRankingNote(13, 1)],
  timeline: [
    { timestamp: "0:00:00", label: "早朝の挨拶" },
    { timestamp: "0:34:17", label: "歌と笑顔のみりぃ" },
    { timestamp: "1:02:51", label: "好きなことを自己紹介" },
    { timestamp: "1:12:14", label: "歌いたかった曲の話" },
    { timestamp: "1:12:59", label: "weeeekを歌唱" },
    { timestamp: "1:18:17", label: "ピン留めみりぃ" },
    { timestamp: "1:30:32", label: "配信が楽しいという思い" },
    { timestamp: "1:32:29", label: "配信を始めた頃の振り返り" },
    { timestamp: "1:34:40", label: "一歩踏み出す勇気" },
    { timestamp: "1:35:58", label: "高校の吹奏楽の経験" },
    { timestamp: "1:44:05", label: "キャプテンになった話" },
    { timestamp: "1:48:42", label: "努力と四次審査への思い" },
    { timestamp: "1:49:22", label: "ランキングのお礼" },
    { timestamp: "1:51:01", label: "同日昼枠の可能性を案内" },
    { timestamp: "1:52:21", label: "朝配信のお礼と挨拶" },
  ],
  nextNote: "配信時点では、同日14〜15時頃に外出前まで配信できる可能性があり、友人の体調にもよるため改めて連絡すると案内していました。",
  sourceLabel: "2026年9月20日 SHOWROOM朝配信（オーナー提供録画・対応動画の自動字幕確認）",
  verifiedAt: "2026-09-20",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は録画の実フレーム10枚を掲載しています。",
    extra: "対応する動画の日本語自動字幕2,272区間を確認し、録画実フレームと照合しました。全編の手動聴取ではありません。録画開始記録5:30:26、実測6779.600秒から表示を5:30頃・約113分に丸めています。時刻は録画先頭からの目安です。確認できた歌唱は1曲で、歌唱映像はサイトには掲載していません。見どころには本人自身の言葉だけで成立する短いトーク抜粋1本を掲載しています。",
  }),
};
