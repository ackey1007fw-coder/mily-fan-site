import type { StreamRecap } from "./streamRecaps.ts";
import {
  AUTO_TRANSCRIPT_MATERIAL_NOTE,
  buildRankingNote,
  buildTranscriptionNote,
} from "./streamRecapRules.ts";

export const streamRecap20260814Day: StreamRecap = {
  id: "2026-08-14-day",
  date: "2026-08-14",
  dateLabel: "2026.08.14（金）",
  theme: "昼の歌と感謝",
  broadcastLabel: "11:31頃〜 約59分",
  platformLabel: "SHOWROOM",
  summary:
    "配信14日目、開始から2週間を迎えた昼枠。歌のリクエストを相談しながら2曲を歌い、応援への感謝や歌で元気を届けたい思いを話しました。",
  songs: [
    {
      title: "愛をこめて花束を",
      artist: "Superfly",
      timestamp: "0:26:13",
      youtubeUrl: "https://www.youtube.com/watch?v=gU5oN0KVofU",
      karaoke: { youtubeUrl: "https://www.youtube.com/watch?v=_8TmGHhPjAw", channel: "生音風カラオケ屋" },
    },
    {
      title: "生まれてはじめて",
      artist: "神田沙也加・松たか子",
      timestamp: "0:49:47",
      youtubeUrl: "https://www.youtube.com/watch?v=MDZSdjLqiGA",
      karaoke: { youtubeUrl: "https://www.youtube.com/watch?v=O3xpEoW_uao", channel: "生音風カラオケ屋" },
    },
  ],
  highlights: [
    {
      timestamp: "0:01:20",
      title: "配信14日目、2週間",
      body: "配信を始めて14日目、2週間続けられたことを振り返り、応援への感謝を伝えました。",
    },
    {
      timestamp: "0:05:20",
      title: "昼枠と夜枠を確認",
      body: "この昼枠は11:30〜12:30、次は22:30〜23:30の予定だと配信時点で案内しました。",
    },
    {
      timestamp: "0:21:20",
      title: "歌リクエストを相談",
      body: "昼の時間を生かして歌いたいと話し、知っている曲や歌ってほしい曲を相談しました。",
    },
    {
      timestamp: "0:26:13",
      title: "愛をこめて花束を",
      body: "「愛をこめて花束を」を歌い、終了後には歌うために練習していたことも明かしました。",
    },
    {
      timestamp: "0:33:00",
      title: "応援への思いを歌に",
      body: "応援してくれる皆さんへ届けたい気持ちで、この曲を選んだと話しました。",
    },
    {
      timestamp: "0:38:20",
      title: "次に歌いたい曲をメモ",
      body: "今後歌ってみたい曲のリクエストを受けながら、候補をメモしていきました。",
    },
    {
      timestamp: "0:49:47",
      title: "生まれてはじめて",
      body: "以前にも歌った「生まれてはじめて」を、改めて歌いました。",
    },
    {
      timestamp: "0:56:20",
      title: "歌で元気を届けたい",
      body: "歌で元気や勇気を届けられる存在になりたいと話し、終盤にランキングを読み上げました。",
    },
  ],
  goals: [],
  ranking: [buildRankingNote(13, 1)],
  timeline: [
    { timestamp: "0:01:20", label: "配信14日目・2週間を振り返る" },
    { timestamp: "0:05:20", label: "昼枠と夜22:30〜23:30を案内" },
    { timestamp: "0:16:20", label: "WEB投票へのお礼と定型文の話" },
    { timestamp: "0:21:20", label: "昼枠で歌う曲の相談を始める" },
    { timestamp: "0:26:13", label: "「愛をこめて花束を」を歌唱" },
    { timestamp: "0:30:20", label: "歌唱後の感想と練習の話" },
    { timestamp: "0:33:00", label: "応援してくれる皆さんへ届けたい曲だと説明" },
    { timestamp: "0:38:20", label: "今後歌いたい曲のリクエストをメモ" },
    { timestamp: "0:42:10", label: "もう1曲歌うか相談" },
    { timestamp: "0:47:30", label: "「生まれてはじめて」を歌う流れへ" },
    { timestamp: "0:49:47", label: "「生まれてはじめて」を歌唱" },
    { timestamp: "0:53:20", label: "歌唱後の感想を共有" },
    { timestamp: "0:55:10", label: "音楽経験と歌の練習について話す" },
    { timestamp: "0:56:20", label: "歌で元気を届けたいと話す" },
    { timestamp: "0:56:45", label: "終了時ランキング13位→1位を読み上げ" },
    { timestamp: "0:58:20", label: "次枠22:30〜23:30を案内して終了" },
  ],
  nextNote: "配信時点では、次の配信を22:30〜23:30に行う予定だと案内していました。",
  sourceLabel: "2026年8月14日 昼配信（オーナー提供録画の音声認識）",
  verifiedAt: "2026-09-14",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は掲載していません。",
    extra:
      "低負荷ASRを30/30区間まで完了し、自動文字起こし全966区間を全文テキスト確認しました。歌唱2曲は既存の区間確認と前後文脈を照合しています。開始時刻は録画内の目安です。",
  }),
};
