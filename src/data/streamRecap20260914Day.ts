import type { StreamRecap, StreamRecapImage } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildRankingNote, buildTranscriptionNote } from "./streamRecapRules.ts";

const approvedStills: StreamRecapImage[] = [
  { src: "/media/live/mily-b118-01-opening-smile.jpg", width: 640, height: 360, alt: "9月14日の昼配信、リボンのようなヘアバンド姿で笑顔を見せるみりぃ", caption: "ゆったり始まった昼のロング配信", downloadName: "みりぃ_20260914昼_01.jpg" },
  { src: "/media/live/mily-b118-02-bright-talk.jpg", width: 640, height: 360, alt: "9月14日の昼配信、カメラに向かって明るく話すみりぃ", caption: "明るい表情でトーク", downloadName: "みりぃ_20260914昼_02.jpg" },
  { src: "/media/live/mily-b118-03-hand-on-chest.jpg", width: 640, height: 360, alt: "9月14日の昼配信、胸元に手を添えて話すみりぃ", caption: "じっくり言葉を届ける時間", downloadName: "みりぃ_20260914昼_03.jpg" },
  { src: "/media/live/mily-b118-04-playful-gesture.jpg", width: 640, height: 360, alt: "9月14日の昼配信、頬の近くで指先を動かすみりぃ", caption: "トークの合間のひとコマ", downloadName: "みりぃ_20260914昼_04.jpg" },
  { src: "/media/live/mily-b118-05-double-wave.jpg", width: 640, height: 360, alt: "9月14日の昼配信、両手を上げてカメラに向かうみりぃ", caption: "両手を上げてリアクション", downloadName: "みりぃ_20260914昼_05.jpg" },
  { src: "/media/live/mily-b118-06-chin-talk.jpg", width: 640, height: 360, alt: "9月14日の昼配信、あご元に手を添えて話すみりぃ", caption: "のんびり続くロングトーク", downloadName: "みりぃ_20260914昼_06.jpg" },
  { src: "/media/live/mily-b118-07-late-smile.jpg", width: 640, height: 360, alt: "9月14日の昼配信、後半に笑顔を見せるみりぃ", caption: "後半も笑顔で", downloadName: "みりぃ_20260914昼_07.jpg" },
  { src: "/media/live/mily-b118-08-tinsagu-singing-smile.jpg", width: 640, height: 360, alt: "9月14日の昼配信、てぃんさぐぬ花を歌うみりぃ", caption: "「てぃんさぐぬ花」をフル歌唱", downloadName: "みりぃ_20260914昼_08_てぃんさぐぬ花.jpg" },
  { src: "/media/live/mily-b118-09-shimanchu-singing-smile.jpg", width: 640, height: 360, alt: "9月14日の昼配信、島人ぬ宝を歌うみりぃ", caption: "「島人ぬ宝」を歌唱", downloadName: "みりぃ_20260914昼_09_島人ぬ宝.jpg" },
  { src: "/media/live/mily-b118-10-closing-look.jpg", width: 640, height: 360, alt: "9月14日の昼配信、終盤にカメラを見つめるみりぃ", caption: "終盤までたっぷりトーク", downloadName: "みりぃ_20260914昼_10.jpg" },
];

export const streamRecap20260914Day: StreamRecap = {
  id: "2026-09-14-day-showroom",
  date: "2026-09-14",
  dateLabel: "2026.09.14（月）",
  theme: "昼のロングトークと沖縄うた",
  broadcastLabel: "14:32頃〜 約137分",
  platformLabel: "SHOWROOM",
  summary: "ベルのヘアバンド姿で大学・配信・アバターの話をたっぷり。三次審査を終え四次審査へ向けた思いを語り、終盤は沖縄の歌2曲をまとまって歌いました。",
  image: approvedStills[0],
  gallery: approvedStills,
  galleryZip: { src: "/media/live/mily-b118-day-stills.zip", filename: "みりぃ_20260914昼_スクショ10枚.zip", label: "10枚まとめて保存" },
  songs: [
    {
      title: "てぃんさぐぬ花",
      artist: "沖縄民謡（夏川りみ）",
      timestamp: "1:45:33",
      youtubeUrl: "https://www.youtube.com/watch?v=IJ6B4t-hxxY",
      youtubeVersionNote: "夏川りみのアーティストチャンネル掲載音源です。",
    },
    {
      title: "島人ぬ宝",
      artist: "BEGIN",
      timestamp: "1:56:05",
      youtubeUrl: "https://www.youtube.com/watch?v=hiK0oehes2c",
      youtubeVersionNote: "BEGINのアーティストチャンネル掲載ライブ映像です。",
    },
  ],
  highlights: [
    {
      timestamp: "0:00:35",
      title: "ベルのヘアバンドで開始",
      body: "前髪を上げるためにつけたベルのヘアバンドを紹介。休憩を挟んで少しゆっくりできたと話し、のんびりした昼配信が始まりました。",
    },
    {
      timestamp: "0:38:44",
      title: "ルームをもっと育てたい",
      body: "イベント経験はまだ多くないと振り返り、まずは多くの人にルームを見てもらうことが大事だと、これからの配信について話しました。",
    },
    {
      timestamp: "0:43:03",
      title: "四次審査へ向けて",
      body: "三次審査が先日終わったと伝え、これから四次審査に向けて頑張るところだと自己紹介。引き続きルームへ来てほしいと呼びかけました。",
    },
    {
      timestamp: "0:57:42",
      title: "「みりぃ」の由来",
      body: "コミュニティFMでラジオパーソナリティをしていて、そのときのラジオネームが「みりぃ」だと紹介しました。",
    },
    {
      timestamp: "1:07:39",
      title: "アバター権にありがとう",
      body: "みんなのおかげでアバター権を獲得できたと改めて感謝。今度は自分のアバターを配布するから来てほしいと話しました。",
    },
    {
      timestamp: "1:45:33",
      title: "沖縄民謡をフルで初挑戦",
      body: "「てぃんさぐぬ花」をフルで歌うのは初めてだと話しながら挑戦。以前一部を歌った思い出にも触れ、歌い切ったあとに感謝を伝えました。",
    },
    {
      timestamp: "1:56:05",
      title: "「島人ぬ宝」を歌唱",
      body: "続いてBEGIN「島人ぬ宝」を歌唱。途中でリクエストされた「19の春」は、覚えて今度歌うと次の楽しみに残しました。",
    },
    {
      timestamp: "2:12:35",
      title: "ランキングから次枠へ",
      body: "終盤は13位から1位までライブランキングを読み上げて感謝。このあと20時からもう一度配信すると案内して締めくくりました。",
    },
  ],
  goals: [
    { item: "四次審査", target: "次の審査へ", statusThen: "次の審査へ意欲" },
    { item: "アバター", target: "配布", statusThen: "獲得に感謝・配布予定" },
    { item: "19の春", target: "今後の歌唱", statusThen: "覚えて次回以降に歌う" },
  ],
  ranking: [buildRankingNote(13, 1, "during")],
  timeline: [
    { timestamp: "0:00:35", label: "ベルのヘアバンドを紹介してスタート" },
    { timestamp: "0:06:10", label: "大学やキャンパスの話で盛り上がる" },
    { timestamp: "0:16:50", label: "イベントや投票の話を振り返る" },
    { timestamp: "0:37:32", label: "イベント参加とルーム成長を相談" },
    { timestamp: "0:43:03", label: "三次審査終了、四次審査へ向けた思い" },
    { timestamp: "0:57:42", label: "ラジオネーム「みりぃ」の由来を紹介" },
    { timestamp: "1:07:39", label: "アバター権獲得に感謝、配布予定を案内" },
    { timestamp: "1:18:08", label: "過去のコンテスト系アバターを眺める" },
    { timestamp: "1:45:33", label: "「てぃんさぐぬ花」を歌い始める" },
    { timestamp: "1:49:44", label: "フル初挑戦を終えて歌の話" },
    { timestamp: "1:55:38", label: "「19の春」は覚えて今度歌うと約束" },
    { timestamp: "1:56:05", label: "BEGIN「島人ぬ宝」を歌唱" },
    { timestamp: "2:01:20", label: "長時間配信を振り返って終盤へ" },
    { timestamp: "2:12:35", label: "13位から1位のライブランキング読み上げ" },
    { timestamp: "2:15:55", label: "このあと20時から再配信すると案内" },
    { timestamp: "2:16:40", label: "感謝を伝えてエンディング" },
  ],
  nextNote: "配信時点では、同日20:00からもう一度配信すると案内していました。また、リクエストされた「19の春」は覚えて今度歌うと話していました。",
  sourceLabel: "2026年9月14日 SHOWROOM昼配信（オーナー提供録画2本を同一配信として照合）",
  verifiedAt: "2026-09-14",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は録画の実フレーム10枚を掲載しています。うち2枚は歌唱中のフレームです。",
    extra: "録画は14:32:19開始の5332.159秒と16:02:03開始の2889.925秒の2本で、録画メタデータ上は同一配信です。開始記録と尺には差があり、接続部分を含む欠落の有無は未確認です。メディア実測合計8222.084秒から表示は14:32頃・約137分に丸めています。これは確認できた録画の合計で、配信全体の長さや完全収録を意味しません。時刻は2本を連結した解析用音声の先頭からの目安です。自動文字起こし3,021区間をもとに話題を整理し、審査・歌唱・終盤は別モデルで再認識して照合しました。全編手動聴取は実施していません。録画全体を概観し、第三者やコメント欄が写らない実フレーム10枚を実寸確認しました。",
  }),
};
