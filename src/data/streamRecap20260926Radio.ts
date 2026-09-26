import type { StreamRecap } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildRankingNote, buildTranscriptionNote } from "./streamRecapRules.ts";

export const streamRecap20260926Radio: StreamRecap = {
  id: "2026-09-26-morning-radio",
  date: "2026-09-26",
  dateLabel: "2026.09.26（土）",
  theme: "朝のラジオとおしゃべり",
  broadcastLabel: "7:05頃〜 約40分",
  platformLabel: "SHOWROOM",
  summary: "声で届けた朝のラジオ配信。画面にはドリンクを持つみりぃの写真を表示し、寝ている間に見た夢や配信のこれからを話しました。終盤には応援へのお礼を伝えました。",
  image: {
    src: "/media/live/mily-b164-01-morning-radio.jpg",
    width: 640,
    height: 360,
    alt: "朝のSHOWROOMラジオ配信で表示された、ドリンクのカップを持つみりぃの写真",
    caption: "配信画面に表示された写真",
  },
  highlights: [
    {
      timestamp: "0:02:55",
      title: "ラジオ配信の写真",
      body: "ラジオ形式の画面に使う写真について話しました。配信画面にはドリンクを持つみりぃの写真が表示されていました。",
    },
    {
      timestamp: "0:10:35",
      title: "夢の中にも配信",
      body: "眠っている間に見た夢の話へ。いくつも見た夢に、配信やコンテストに関わる場面が出てきたと話しました。",
    },
    {
      timestamp: "0:15:26",
      title: "声でつながる朝",
      body: "途中から来た人にも朝のラジオ形式を伝えながら、コメントをきっかけにおしゃべりを続けました。",
    },
    {
      timestamp: "0:26:28",
      title: "これからの届け方を相談",
      body: "今後の活動をどう届けていくか考え、みんなからの意見も聞いてみたいと話しました。最後は自分で判断したいという思いも伝えています。",
    },
    {
      timestamp: "0:34:21",
      title: "寝落ちの話で笑い合う",
      body: "ほかの配信を見ながら寝落ちしてしまうことがある、という朝らしい話題でも盛り上がりました。",
    },
    {
      timestamp: "0:36:40",
      title: "応援へのお礼",
      body: "終盤は13位から1位までランキングを読み上げて感謝。今夜と翌日の配信にも触れて締めくくりました。",
    },
  ],
  goals: [],
  ranking: [buildRankingNote(13, 1)],
  timeline: [
    { timestamp: "0:00:05", label: "朝のあいさつとラジオ形式" },
    { timestamp: "0:02:55", label: "画面に使った写真の話" },
    { timestamp: "0:10:35", label: "配信やコンテストにまつわる夢" },
    { timestamp: "0:15:26", label: "ラジオ形式のおしゃべり" },
    { timestamp: "0:26:28", label: "これからの活動について相談" },
    { timestamp: "0:34:21", label: "寝落ちの話" },
    { timestamp: "0:36:40", label: "ランキングとお礼" },
    { timestamp: "0:37:19", label: "今夜と翌日の配信にも言及" },
  ],
  nextNote: "配信時点では、今夜と翌日にも配信すると話していました。詳しい時刻はこの回で確認できていません。",
  sourceLabel: "2026年9月26日 SHOWROOM朝ラジオ配信（保存録画・自動文字起こし確認）",
  verifiedAt: "2026-09-26",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は同じ録画の実フレームを1枚だけ掲載しています。",
    extra: "録画開始記録07:05:43、メディア実測2379.541秒。録画音声全体の自動文字起こし672区間を確認し、画面の4時点を照合しました。全編の手動聴取・逐語校正ではなく、録画開始前の有無も未確認です。時刻は録画先頭からの目安です。今回の確認範囲で歌唱曲は確定していません。",
  }),
};
