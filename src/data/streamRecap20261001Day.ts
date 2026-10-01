import type { StreamRecap } from "./streamRecaps.ts";
import {
  AUTO_TRANSCRIPT_MATERIAL_NOTE,
  RANKING_NOTE_WITHOUT_RANGE,
  buildTranscriptionNote,
} from "./streamRecapRules.ts";

export const streamRecap20261001Day: StreamRecap = {
  id: "2026-10-01-day-showroom",
  date: "2026-10-01",
  dateLabel: "2026.10.01（木）",
  theme: "昼の言葉遊びと応援への感謝",
  broadcastLabel: "15:04頃〜 約50分",
  platformLabel: "SHOWROOM",
  summary: "ラジオ形式の昼配信。トマトにまつわる話や好きな曲、漢字の読みなど、コメントから話題が広がりました。メッセージへの思いにも触れ、応援への感謝を伝えました。",
  highlights: [
    {
      timestamp: "0:00:22",
      title: "昼のラジオ配信",
      body: "この昼はラジオ形式で配信しました。コメントに応えながら、おしゃべりが始まりました。",
    },
    {
      timestamp: "0:06:41",
      title: "トマトにまつわる話",
      body: "名前とリコピンを結びつけた話から、トマトの話題が広がりました。",
    },
    {
      timestamp: "0:08:20",
      title: "好きな曲と得意な曲",
      body: "トマトの話から、好きな曲や得意な曲の話へ。コメントに応えながらおしゃべりが続きました。",
    },
    {
      timestamp: "0:16:40",
      title: "メッセージへの思い",
      body: "メッセージに気持ちを込めていることや、応援を受け取る喜びについて話しました。",
    },
    {
      timestamp: "0:20:40",
      title: "漢字をめぐる言葉遊び",
      body: "漢字や歴史に出てくる言葉の読みをめぐるやりとりがありました。読み方を考えたり、コメントに返したりする中で、言葉遊びが続きます。",
    },
    {
      timestamp: "0:26:51",
      title: "みんなのよりどころ",
      body: "言葉遊びの途中には、みんなのよりどころになる場所について話す場面もありました。",
    },
    {
      timestamp: "0:32:43",
      title: "応援を力にして",
      body: "ファンレベルが上がる喜びに触れ、10月も応援の輪を広げていこうと呼びかけました。終盤は集まってくれた人たちに感謝を伝えました。",
    },
  ],
  goals: [],
  ranking: [RANKING_NOTE_WITHOUT_RANGE],
  timeline: [
    { timestamp: "0:00:22", label: "ラジオ形式でのあいさつ" },
    { timestamp: "0:06:41", label: "トマトと名前の話" },
    { timestamp: "0:08:20", label: "好きな曲と得意な曲" },
    { timestamp: "0:16:40", label: "メッセージへの思い" },
    { timestamp: "0:20:40", label: "漢字と歴史の言葉" },
    { timestamp: "0:26:51", label: "よりどころになる場所" },
    { timestamp: "0:32:43", label: "10月の応援の呼びかけ" },
    { timestamp: "0:46:41", label: "ランキングとお礼" },
    { timestamp: "0:49:06", label: "夜の案内と締めくくり" },
  ],
  nextNote: "配信時点では、同日夜にも配信する予定だと案内していました。",
  sourceLabel: "2026年10月1日 SHOWROOM昼配信（保存録画・自動文字起こし確認）",
  verifiedAt: "2026-10-01",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は掲載していません。",
    extra: "原音の手動聴取・逐語校正は未実施です。時刻は録画先頭からの目安です。配信で使われた画像と歌唱曲は確定していません。",
  }),
};
