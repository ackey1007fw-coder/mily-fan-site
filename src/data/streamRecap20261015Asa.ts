import type { StreamRecap } from "./streamRecaps.ts";
import {
  AUTO_TRANSCRIPT_MATERIAL_NOTE,
  buildRankingNote,
  buildTranscriptionNote,
} from "./streamRecapRules.ts";

// 2026-10-15朝SHOWROOM。録画保存receipt・同一録画の速報ASR(90チャンク)・匿名UI表示を照合。
// タイムスタンプは録画処理開始06:02:40 JSTを基準にした目安。原音全編の実聴・逐語校正なし。
// 録画処理区間は配信の確定開始・終了ではない。画像・個別視聴者・録画原本は非公開。
export const streamRecap20261015Asa: StreamRecap = {
  id: "2026-10-15-morning-showroom",
  date: "2026-10-15",
  dateLabel: "2026.10.15（木）",
  theme: "朝の挑戦と自信の話",
  broadcastLabel: "録画開始6:02頃〜 約30分",
  platformLabel: "SHOWROOM",
  summary:
    "録画開始6:02頃から約30分。発表資料やAI活用の試行錯誤、ファイナルを目指す思い、人と比べすぎず自分の歩みを認める話を届けた朝。終盤には応援への感謝を伝えました。",
  highlights: [
    {
      timestamp: "0:00:21",
      title: "朝の挨拶と資料づくり",
      body: "朝早くから来てくれた人たちに挨拶。前夜から発表の準備に取り組んでいた話をしながら、一日の始まりを迎えました。",
    },
    {
      timestamp: "0:04:27",
      title: "CanvaとAIの使い方",
      body: "発表資料の組み立てやCanva、AIによるサポートが話題に。試行錯誤しながら作る難しさを、リスナーと話しました。",
    },
    {
      timestamp: "0:11:20",
      title: "応援にまつわる夢の話",
      body: "最近見た夢の話から、いつも寄せられる応援へのうれしさが伝わる場面。朝のやり取りに温かさが広がります。",
    },
    {
      timestamp: "0:14:49",
      title: "ファイナルへの思い",
      body: "次に目指すファイナルについて語り、応援してくれるみんなと一緒に成長していきたいという気持ちを伝えました。",
    },
    {
      timestamp: "0:16:00",
      title: "人と比べすぎないこと",
      body: "ほかの人の活動が気になる気持ちにも触れつつ、自分の努力まで小さく見ないことについて考えを話しました。",
    },
    {
      timestamp: "0:20:20",
      title: "自信につながる一歩",
      body: "応援と日々の積み重ねによって、以前より自分の成長を実感できるようになったという話が続きました。",
    },
    {
      timestamp: "0:22:55",
      title: "読み間違いの思い出",
      body: "漢字を読み違えた話をきっかけに、リスナーとの気さくなおしゃべりに。真面目な話の間の軽やかな一場面です。",
    },
    {
      timestamp: "0:27:05",
      title: "朝の応援へありがとう",
      body: "配信終盤にはランキングを読み上げ、朝から立ち寄ってくれた人たちに感謝。最後までつながりを大切にする時間でした。",
      relatedLinks: [{ label: "MILY SIGNAL・10月15日朝の匿名分析", url: "/data-lab/#morning-20261015" }],
    },
  ],
  goals: [],
  ranking: [buildRankingNote(undefined, undefined, "during")],
  timeline: [
    { timestamp: "0:00:21", label: "朝の挨拶と前夜の資料準備" },
    { timestamp: "0:04:27", label: "Canva・AIと発表資料の話" },
    { timestamp: "0:07:00", label: "資料づくりの試行錯誤" },
    { timestamp: "0:09:35", label: "審査結果と次の挑戦の話" },
    { timestamp: "0:11:20", label: "応援にまつわる夢" },
    { timestamp: "0:14:49", label: "ファイナルを目指す思い" },
    { timestamp: "0:16:00", label: "周囲と比べてしまう気持ち" },
    { timestamp: "0:18:35", label: "自分の頑張りを認めること" },
    { timestamp: "0:20:20", label: "積み重ねから生まれる自信" },
    { timestamp: "0:22:55", label: "言葉の読み間違いを振り返る" },
    { timestamp: "0:26:40", label: "声や話し方をめぐる会話" },
    { timestamp: "0:27:05", label: "ランキング読み上げと感謝" },
    { timestamp: "0:29:27", label: "最後の挨拶と次回への言及" },
  ],
  nextNote:
    "配信時点では、夜にも配信する予定に触れました。時刻は自動文字起こしで確定できないため、現在の確定予定としては掲載しません。",
  sourceLabel:
    "2026年10月15日 朝のSHOWROOM配信（保存録画記録・速報自動文字起こし・匿名集計）",
  verifiedAt: "2026-10-15",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は掲載していません。",
    extra:
      "録画処理は6:02:40〜6:33:54頃で、保存映像の再生時間は約30分ですが、配信の確定開始・終了時刻ではありません。見どころの時刻は録画先頭からの目安です。映像の本人写真を独立して確認・掲載承認できていないため、別枠の写真は流用していません。きら星2,755・総訪問187・コメント195は6:31:08の最後の有効オンライン画面に残った確定前の参考値で、配信終了時の確定ギフト・ユニーク人数・イベントポイントではありません。録画の完全収録は保証できません。画面取得は途中で切断があり、配信終了の検証も未完了です。10月12日までの四次審査集計には加えません。",
  }),
};
