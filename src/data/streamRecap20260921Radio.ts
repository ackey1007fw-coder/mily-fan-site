import type { StreamRecap } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildRankingNote, buildTranscriptionNote } from "./streamRecapRules.ts";

export const streamRecap20260921Radio: StreamRecap = {
  id: "2026-09-21-radio-showroom",
  date: "2026-09-21",
  dateLabel: "2026.09.21（月）",
  theme: "夜のラジオとおしゃべり",
  broadcastLabel: "21:30頃〜 約36分",
  platformLabel: "SHOWROOM",
  summary: "ラジオ形式で、声で届けた約36分のおしゃべり。応援のお願いやご飯前のひとコマ、イベントを見て抱いた目標などを話し、終盤はランキングと翌朝の配信案内で締めくくりました。",
  highlights: [
    {
      timestamp: "0:00:54",
      title: "声で楽しませたい",
      body: "ラジオパーソナリティの経験に触れ、ラジオでもみんなを楽しませたいという気持ちで配信していると話しました。",
      socialClip: {
        "title": "ラジオも楽しませちゃうぞ",
        "sourceTimestamp": "0:02:32",
        "durationSeconds": 9.6,
        "links": [
          {
            "platform": "youtube",
            "url": "https://www.youtube.com/watch?v=2gdXjtTRd4I"
          },
          {
            "platform": "tiktok",
            "url": "https://www.tiktok.com/@ackeytan_/video/7688109201851256085"
          },
          {
            "platform": "instagram",
            "url": "https://www.instagram.com/reel/DdkKnRVjsCF/"
          },
          {
            "platform": "x",
            "url": "https://x.com/ackey_RiRi_supp/status/2102154237576622255"
          }
        ]
      },
    },
    {
      timestamp: "0:01:11",
      title: "無理のない範囲で応援を",
      body: "参加したイベントに触れ、手持ちのシルバーギフトでの応援を呼びかけました。集める大変さにも触れ、無理にお願いするものではないと伝えています。",
    },
    {
      timestamp: "0:06:05",
      title: "夜だけの短いおしゃべり",
      body: "この日は夜だけの配信になったことを説明。短めの時間ながら、もっとみんなと話していたかったと語りました。",
    },
    {
      timestamp: "0:09:25",
      title: "ご飯前のひとコマ",
      body: "夜ご飯を食べる前で、お腹がとてもすいているという話題へ。配信中にお腹の音が聞こえてしまうかもしれない、とおちゃめに話しました。",
      socialClip: {
        "title": "お腹の音も聞こえちゃう？",
        "sourceTimestamp": "0:09:25",
        "durationSeconds": 23.1,
        "links": [
          {
            "platform": "youtube",
            "url": "https://www.youtube.com/watch?v=9_QswQA5Pjk"
          },
          {
            "platform": "tiktok",
            "url": "https://www.tiktok.com/@ackeytan_/video/7688109338547752210"
          },
          {
            "platform": "instagram",
            "url": "https://www.instagram.com/reel/DdkKrBWDMnf/"
          },
          {
            "platform": "x",
            "url": "https://x.com/ackey_RiRi_supp/status/2102154298779947322"
          }
        ]
      },
    },
    {
      timestamp: "0:12:41",
      title: "ランウェイへの憧れ",
      body: "イベントでランウェイを歩く姿を見て、自分も歩きたい、みんなに見てもらえる存在になりたいと思ったと話し、これからも頑張りたいと伝えました。",
    },
    {
      timestamp: "0:26:30",
      title: "良いところを見つけてもらう喜び",
      body: "自分の性格や良いところを受け止めて応援してもらえることが、とても嬉しいと話しました。",
    },
    {
      timestamp: "0:33:49",
      title: "ランキングと翌朝の案内",
      body: "13位から1位までランキングを読み上げて感謝。翌朝にも配信し、詳しい時刻は後でファンルームに知らせると案内しました。",
    },
  ],
  goals: [],
  ranking: [buildRankingNote(13, 1)],
  timeline: [
    { timestamp: "0:00:19", label: "ラジオ形式でのあいさつ" },
    { timestamp: "0:00:54", label: "声で楽しませたいという気持ち" },
    { timestamp: "0:01:11", label: "シルバーギフトの応援について" },
    { timestamp: "0:02:32", label: "ラジオでも楽しませたいと語る" },
    { timestamp: "0:06:05", label: "夜だけの短い配信について" },
    { timestamp: "0:09:25", label: "夜ご飯前のお腹の話" },
    { timestamp: "0:12:41", label: "ランウェイを見て抱いた目標" },
    { timestamp: "0:26:30", label: "良いところを見つけてもらう喜び" },
    { timestamp: "0:33:49", label: "13位から1位までランキング読み上げ" },
    { timestamp: "0:35:06", label: "翌朝の配信時刻は後で案内" },
    { timestamp: "0:35:31", label: "最後のあいさつ" },
  ],
  nextNote: "配信時点では、翌朝にも配信し、詳しい時刻は後でファンルームに知らせると案内していました。",
  sourceLabel: "2026年9月21日 SHOWROOM夜ラジオ配信（オーナー提供録画・録画範囲の自動文字起こし確認）",
  verifiedAt: "2026-09-22",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は掲載していません。",
    extra: "ラジオ形式の回です。録画開始記録21:29:52、メディア実測2134.746秒から、表示を21:30頃・約36分に丸めています。録画範囲全体を18分割し、自動文字起こし817区間を確認しました。採用した短尺の前後と終盤は別モデルでも確認しています。全編の手動聴取・逐語校正ではなく、配信全編の完全収録は保証しません。時刻は録画先頭からの目安です。SNSの短尺は配信の原音に文字と波形を合わせたファン編集で、字幕はトークの要約です。",
  }),
};
