import type { StreamRecap, StreamRecapImage } from "./streamRecaps.ts";
import {
  AUTO_TRANSCRIPT_MATERIAL_NOTE,
  buildTranscriptionNote,
  RANKING_NOTE_WITHOUT_RANGE,
} from "./streamRecapRules.ts";

const approvedStills: StreamRecapImage[] = [
  { src: "/media/live/mily-b121-01-opening-smile.jpg", width: 640, height: 360, alt: "9月15日の朝配信、笑顔で話すみりぃ", caption: "笑顔で朝枠スタート", downloadName: "みりぃ_20260915朝_01.jpg" },
  { src: "/media/live/mily-b121-02-hair-arrange.jpg", width: 640, height: 360, alt: "9月15日の朝配信、髪を整えるみりぃ", caption: "髪を整えながらメイクへ", downloadName: "みりぃ_20260915朝_02.jpg" },
  { src: "/media/live/mily-b121-03-eye-makeup.jpg", width: 640, height: 360, alt: "9月15日の朝配信、目元のメイクを進めるみりぃ", caption: "目元のメイクを進行中", downloadName: "みりぃ_20260915朝_03.jpg" },
  { src: "/media/live/mily-b121-04-compact-makeup.jpg", width: 640, height: 360, alt: "9月15日の朝配信、コンパクトを手にメイクするみりぃ", caption: "鏡を見ながら丁寧に", downloadName: "みりぃ_20260915朝_04.jpg" },
  { src: "/media/live/mily-b121-05-big-smile.jpg", width: 640, height: 360, alt: "9月15日の朝配信、メイクの途中で大きく笑うみりぃ", caption: "メイクの合間に大きな笑顔", downloadName: "みりぃ_20260915朝_05.jpg" },
  { src: "/media/live/mily-b121-06-lip-makeup.jpg", width: 640, height: 360, alt: "9月15日の朝配信、口元のメイクをするみりぃ", caption: "口元も仕上げへ", downloadName: "みりぃ_20260915朝_06.jpg" },
  { src: "/media/live/mily-b121-07-eye-detail.jpg", width: 640, height: 360, alt: "9月15日の朝配信、カメラ近くで目元を整えるみりぃ", caption: "目元を細かくチェック", downloadName: "みりぃ_20260915朝_07.jpg" },
  { src: "/media/live/mily-b121-08-mascara.jpg", width: 640, height: 360, alt: "9月15日の朝配信、マスカラを塗るみりぃ", caption: "マスカラで仕上げ", downloadName: "みりぃ_20260915朝_08.jpg" },
  { src: "/media/live/mily-b121-09-finished-smile.jpg", width: 640, height: 360, alt: "9月15日の朝配信、メイクを仕上げて笑顔を見せるみりぃ", caption: "仕上がりを確かめて笑顔", downloadName: "みりぃ_20260915朝_09.jpg" },
  { src: "/media/live/mily-b121-10-closing-wave.jpg", width: 640, height: 360, alt: "9月15日の朝配信、終盤に手を振るみりぃ", caption: "終盤は笑顔で手振り", downloadName: "みりぃ_20260915朝_10.jpg" },
];

export const streamRecap20260915Asa: StreamRecap = {
  id: "2026-09-15-asa-showroom",
  date: "2026-09-15",
  dateLabel: "2026.09.15（火）",
  theme: "朝のメイクとイベント相談",
  broadcastLabel: "10:02頃〜 約45分",
  platformLabel: "SHOWROOM",
  summary: "友人との外出前にメイクをしながら、初アバターの申請や次に参加するイベントを相談。花火イベントも候補に挙げ、終盤はメイクを仕上げてライブランキングを読み上げました。",
  image: approvedStills[4],
  gallery: approvedStills,
  galleryZip: { src: "/media/live/mily-b121-morning-stills.zip", filename: "みりぃ_20260915朝_スクショ10枚.zip", label: "10枚まとめて保存" },
  highlights: [
    {
      timestamp: "0:00:46",
      title: "メイクしながら朝配信",
      body: "外出前の支度をしながらメイク配信をスタート。久しぶりに友人と出かける予定にも触れました。",
    },
    {
      timestamp: "0:02:59",
      title: "次のイベントを相談",
      body: "次に参加するイベントをまだ決めていないと話し、ゆるめのイベントも含めてどれにするかコメントと相談しました。",
    },
    {
      timestamp: "0:11:34",
      title: "初アバターの相談",
      body: "初めてのアバターで分からないことも多いと話し、申請や見せ方についてみんなとやり取りしました。",
    },
    {
      timestamp: "0:21:28",
      title: "ラジオ由来の無音センサー",
      body: "ラジオでは数秒の無音が気になるという話から、配信でも静かな時間が気になってしまうと明かしました。",
    },
    {
      timestamp: "0:27:28",
      title: "「今日も可愛い」で",
      body: "鏡を見たときの声かけの話から、「今日は」ではなく「今日も可愛い」にしようと楽しく言葉遊びしました。",
    },
    {
      timestamp: "0:35:59",
      title: "花火イベントも候補",
      body: "ポイントに応じて花火が出るイベントを話題にし、次の参加候補として内容を確認してみると話しました。",
    },
    {
      timestamp: "0:38:39",
      title: "メイクほぼ完成",
      body: "メイクがほぼ完成したと報告。このあとは友人とご飯を食べたり出かけたりすると話しました。",
    },
    {
      timestamp: "0:43:03",
      title: "ランキングから締めへ",
      body: "終盤はライブランキングを読み上げて感謝し、初アバターの申請もそろそろ進めると話して締めへ向かいました。",
    },
  ],
  goals: [
    { item: "イベント", target: "次の参加を決める", statusThen: "候補を相談" },
    { item: "アバター", target: "初回申請", statusThen: "申請を進める" },
  ],
  ranking: [RANKING_NOTE_WITHOUT_RANGE],
  timeline: [
    { timestamp: "0:00:46", label: "メイク配信スタート" },
    { timestamp: "0:01:57", label: "友人との外出前に支度" },
    { timestamp: "0:02:59", label: "次に参加するイベントを相談" },
    { timestamp: "0:08:21", label: "アバター申請の流れを相談" },
    { timestamp: "0:11:34", label: "初アバターについてトーク" },
    { timestamp: "0:18:22", label: "ラジオの話題へ" },
    { timestamp: "0:21:28", label: "数秒の無音が気になるという話" },
    { timestamp: "0:27:28", label: "『今日も可愛い』の言葉遊び" },
    { timestamp: "0:33:18", label: "イベント選びをあらためて相談" },
    { timestamp: "0:35:59", label: "花火イベントを候補に検討" },
    { timestamp: "0:38:39", label: "メイクがほぼ完成" },
    { timestamp: "0:41:50", label: "友人との外出予定を話す" },
    { timestamp: "0:43:03", label: "ライブランキングを読み上げ" },
    { timestamp: "0:43:58", label: "初アバター申請を進める話" },
    { timestamp: "0:44:50", label: "イベントは引き続き相談として締め" },
  ],
  nextNote: "",
  sourceLabel: "2026年9月15日 SHOWROOM朝配信（オーナー提供録画を確認）",
  verifiedAt: "2026-09-15",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は録画の実フレーム10枚を掲載しています。",
    extra: "録画開始記録10:01:42、メディア実測2703.616秒から表示は10:02頃・約45分に丸めています。これは確認できた録画範囲で、配信全体の開始・尺を保証しません。自動文字起こし971区間を1分単位で全体確認し、固有名詞や数値は聞き取りが不安定なものを掲載していません。全編手動聴取は実施していません。録画全体から150秒間隔で18候補を抽出し、本人以外やコメント欄が写らない実フレーム10枚を確認しました。",
  }),
};
