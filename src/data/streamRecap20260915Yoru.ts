import type { StreamRecap, StreamRecapImage } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildTranscriptionNote, RANKING_NOTE } from "./streamRecapRules.ts";

const approvedStills: StreamRecapImage[] = [
  {
    "src": "/media/live/mily-b124-01-peace-sign.jpg",
    "width": 640,
    "height": 360,
    "alt": "9月15日の夜配信、黒い水玉リボンとグレーのトップス姿のみりぃ。カメラに向けてピース",
    "caption": "0:04:00 カメラに向けてピース",
    "downloadName": "みりぃ_20260915夜_01.jpg"
  },
  {
    "src": "/media/live/mily-b124-02-cheek-show.jpg",
    "width": 640,
    "height": 360,
    "alt": "9月15日の夜配信、黒い水玉リボンとグレーのトップス姿のみりぃ。買ってきたチークを紹介",
    "caption": "0:06:10 買ってきたチークを紹介",
    "downloadName": "みりぃ_20260915夜_02.jpg"
  },
  {
    "src": "/media/live/mily-b124-03-bright-smile.jpg",
    "width": 640,
    "height": 360,
    "alt": "9月15日の夜配信、黒い水玉リボンとグレーのトップス姿のみりぃ。明るい笑顔でおしゃべり",
    "caption": "0:16:00 明るい笑顔でおしゃべり",
    "downloadName": "みりぃ_20260915夜_03.jpg"
  },
  {
    "src": "/media/live/mily-b124-04-ribbon-smile.jpg",
    "width": 640,
    "height": 360,
    "alt": "9月15日の夜配信、黒い水玉リボンとグレーのトップス姿のみりぃ。リボン姿でにっこり",
    "caption": "0:27:58 リボン姿でにっこり",
    "downloadName": "みりぃ_20260915夜_04.jpg"
  },
  {
    "src": "/media/live/mily-b124-05-side-ponytail.jpg",
    "width": 640,
    "height": 360,
    "alt": "9月15日の夜配信、黒い水玉リボンとグレーのトップス姿のみりぃ。髪にそっと手を添えて",
    "caption": "0:39:58 髪にそっと手を添えて",
    "downloadName": "みりぃ_20260915夜_05.jpg"
  },
  {
    "src": "/media/live/mily-b124-06-ribbon-closeup.jpg",
    "width": 640,
    "height": 360,
    "alt": "9月15日の夜配信、黒い水玉リボンとグレーのトップス姿のみりぃ。リボンに触れて笑顔",
    "caption": "0:49:00 リボンに触れて笑顔",
    "downloadName": "みりぃ_20260915夜_06.jpg"
  },
  {
    "src": "/media/live/mily-b124-07-relaxed-smile.jpg",
    "width": 640,
    "height": 360,
    "alt": "9月15日の夜配信、黒い水玉リボンとグレーのトップス姿のみりぃ。少し引いた画角でにっこり",
    "caption": "0:58:02 少し引いた画角でにっこり",
    "downloadName": "みりぃ_20260915夜_07.jpg"
  },
  {
    "src": "/media/live/mily-b124-08-chin-on-hand.jpg",
    "width": 640,
    "height": 360,
    "alt": "9月15日の夜配信、黒い水玉リボンとグレーのトップス姿のみりぃ。あごに手を添えた笑顔",
    "caption": "1:06:59 あごに手を添えた笑顔",
    "downloadName": "みりぃ_20260915夜_08.jpg"
  },
  {
    "src": "/media/live/mily-b124-09-wide-smile.jpg",
    "width": 640,
    "height": 360,
    "alt": "9月15日の夜配信、黒い水玉リボンとグレーのトップス姿のみりぃ。画面に向けた大きな笑顔",
    "caption": "1:22:00 画面に向けた大きな笑顔",
    "downloadName": "みりぃ_20260915夜_09.jpg"
  },
  {
    "src": "/media/live/mily-b124-10-closing-smile.jpg",
    "width": 640,
    "height": 360,
    "alt": "9月15日の夜配信、黒い水玉リボンとグレーのトップス姿のみりぃ。終盤の笑顔",
    "caption": "1:33:59 終盤の笑顔",
    "downloadName": "みりぃ_20260915夜_10.jpg"
  }
];

export const streamRecap20260915Yoru: StreamRecap = {
  id: "2026-09-15-yoru-showroom",
  date: "2026-09-15",
  dateLabel: "2026.09.15（火）",
  theme: "夜のコスメ紹介とありがとう",
  broadcastLabel: "22:01頃〜 約97分",
  platformLabel: "SHOWROOM",
  summary: "買ってきたチークや愛用リップ、ハイライトを紹介しながら、コメントと楽しくおしゃべり。嵐の曲を短く口ずさみ、応援や出会いへの感謝、アバター権の達成とこれからの目標を話しました。",
  image: approvedStills[5],
  gallery: approvedStills,
  galleryZip: { src: "/media/live/mily-b124-night-stills.zip", filename: "みりぃ_20260915夜_スクショ10枚.zip", label: "10枚まとめて保存" },
  songs: [
    { title: "A・RA・SHI", artist: "嵐", timestamp: "0:50:00", youtubeUrl: "https://www.youtube.com/watch?v=evCrxxtslVU" },
    { title: "Love so sweet", artist: "嵐", timestamp: "0:56:19", youtubeUrl: "https://www.youtube.com/watch?v=EAgACSowE5k" },
  ],
  highlights: [
    {
      timestamp: "0:04:45",
      title: "買ってきたコスメを紹介",
      body: "気に入る色を選んで買ってきたコスメを紹介。チークをその場で試し、廃番だと思っていた愛用リップを見つけられた喜びも話しました。",
    },
    {
      timestamp: "0:22:37",
      title: "褒め言葉で日本語講座",
      body: "褒め言葉の助詞を使い分ける、みりぃ流の日本語講座。コメントにツッコミを入れながら、テンポよく言葉遊びを楽しみました。",
    },
    {
      timestamp: "0:25:18",
      title: "歌を広めてくれる応援へ",
      body: "自分の歌唱を短く編集して紹介してくれる応援に感謝。活動を広めてもらえる喜びと、ルームをもっと大きくしたい思いを話しました。",
    },
    {
      timestamp: "0:36:01",
      title: "挑戦を通じて出会えた人たち",
      body: "コンテストに挑戦してよかったのは、応援する人や同じ挑戦をする仲間に出会えたことだと振り返りました。自分自身もこのルームが楽しいと話しました。",
    },
    {
      timestamp: "0:44:27",
      title: "ハイライトもその場で",
      body: "買ってきたハイライトも紹介し、その場で光り方を試しました。コスメを試す時間と、コメントとのおしゃべりが続きました。",
    },
    {
      timestamp: "0:50:00",
      title: "好きなドラマと嵐の曲",
      body: "嵐の曲や好きなドラマの話で盛り上がりました。トークの合間には、A・RA・SHIとLove so sweetをそれぞれ短く口ずさむ場面もありました。",
    },
    {
      timestamp: "1:13:25",
      title: "目標と応援のお願い",
      body: "アバター制作権を獲得できたことを喜び、フォローやファン参加、推薦コメントでの応援を呼びかけました。これからも自分磨きを頑張りたいと話しました。",
    },
    {
      timestamp: "1:32:24",
      title: "ランキングと次の朝配信",
      body: "終盤は13位から1位までのライブランキングを読み上げて感謝。配信時点では、翌9月16日の朝7:30から配信したいと案内しました。",
    },
  ],
  goals: [
    { item: "ルーム", target: "もっと大きく", statusThen: "広めてくれる応援に感謝" },
    { item: "アバター権", target: "獲得", statusThen: "達成を振り返る" },
    { item: "フォロワー", target: "300人", statusThen: "目標を再確認" },
    { item: "ファン", target: "70人", statusThen: "目標へ頑張る" },
    { item: "ファンマーク", target: "5人", statusThen: "目標を再確認" },
  ],
  ranking: [RANKING_NOTE],
  timeline: [
    { timestamp: "0:00:03", label: "夜のあいさつと来訪への感謝" },
    { timestamp: "0:04:45", label: "コスメの購入品紹介へ" },
    { timestamp: "0:05:37", label: "新しく買ったチークを試す" },
    { timestamp: "0:07:38", label: "愛用リップを見つけた喜び" },
    { timestamp: "0:22:37", label: "褒め言葉の日本語講座" },
    { timestamp: "0:25:18", label: "歌を紹介してくれる応援に感謝" },
    { timestamp: "0:28:03", label: "ルームを大きくしたい思い" },
    { timestamp: "0:36:01", label: "コンテストでの出会いを振り返る" },
    { timestamp: "0:38:35", label: "テンポのよいボケとツッコミ" },
    { timestamp: "0:44:27", label: "ハイライトの光り方を試す" },
    { timestamp: "0:50:00", label: "A・RA・SHIを短く口ずさむ" },
    { timestamp: "0:56:19", label: "Love so sweetを短く口ずさむ" },
    { timestamp: "1:11:24", label: "リボンのネイルを紹介" },
    { timestamp: "1:13:25", label: "達成した目標と次の目標を確認" },
    { timestamp: "1:32:24", label: "ライブランキングを読み上げ" },
    { timestamp: "1:34:15", label: "翌朝7:30からの配信を案内" },
  ],
  nextNote: "配信時点では、翌9月16日7:30から朝配信をしたいと案内していました。",
  sourceLabel: "2026年9月15日 SHOWROOM夜配信（オーナー提供録画を確認）",
  verifiedAt: "2026-09-16",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は録画の実フレーム10枚を掲載しています。",
    extra: "録画開始記録22:00:30、メディア実測5804.103秒から表示を22:01頃・約97分に丸めています。これは保存録画の範囲で、配信全編の完全収録を保証しません。自動文字起こし1929区間を全体確認し、確定できない固有名詞・数値・歌唱曲は掲載していません。録画の実フレーム78候補を比較し、本人以外やコメント欄が写らない10枚を確認しました。",
  }),
};
