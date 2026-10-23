import type { StreamRecap } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildRankingNote, buildTranscriptionNote } from "./streamRecapRules.ts";

export const streamRecap20261023Asa: StreamRecap = {
  id: "2026-10-23-morning-showroom",
  date: "2026-10-23",
  dateLabel: "2026.10.23（金）",
  theme: "朝の時間違いと感謝",
  broadcastLabel: "録画開始6:30頃〜 約52分",
  platformLabel: "SHOWROOM",
  summary: "予定していた朝の配信時間を取り違えたことを話し、寝起きやメイクの話題で交流。初めて来た人への挨拶や、次の審査に向けた思い、応援への感謝を届けました。",
  highlights: [
    { timestamp: "0:00:36", title: "朝の配信時間を振り返る", body: "予定していた時間を勘違いしたことを話し、朝から集まってくれた人たちにお礼を伝えました。" },
    { timestamp: "0:09:34", title: "メイクと素顔の話", body: "寝起きの自分とメイクをしたときの自分について、コメントを読みながらおしゃべりしました。" },
    { timestamp: "0:38:50", title: "初めて来た人への挨拶", body: "初めて訪れた人やフォローしてくれた人にも感謝し、また来てほしいと呼びかけました。" },
    { timestamp: "0:42:53", title: "次の審査へ向けて", body: "セミファイナルの先も目指したいという思いを語り、これからも見守ってほしいと伝えました。" },
    { timestamp: "0:48:40", title: "次は夜に会おう", body: "この朝は早めに区切ることを話し、次は夜の配信を予定していると案内しました。時間の確定はできていません。" },
    { timestamp: "0:49:44", title: "ランキングとありがとう", body: "ランキングを読み上げながら、朝の応援とコメントにお礼を伝えました。" },
    { timestamp: "0:52:14", title: "一日の始まりにエール", body: "最後は来てくれた人たちに感謝し、一日を頑張ろうと送り出しました。" },
  ],
  goals: [{ item: "審査", target: "次のステージへ", statusThen: "意欲を語りました" }],
  ranking: [buildRankingNote()],
  timeline: [
    { timestamp: "0:00:36", label: "配信時間の勘違いと挨拶" },
    { timestamp: "0:09:34", label: "寝起きとメイクの話題" },
    { timestamp: "0:38:50", label: "初めて来た人との交流" },
    { timestamp: "0:42:53", label: "次の審査への意気込み" },
    { timestamp: "0:48:40", label: "夜の配信について" },
    { timestamp: "0:49:44", label: "ランキングとお礼" },
    { timestamp: "0:52:14", label: "締めくくりの挨拶" },
  ],
  nextNote: "配信時点では、次はこの日の夜に配信する意向を案内していました。正確な時刻は未確認です。",
  sourceLabel: "2026年10月23日 朝のSHOWROOM配信（保存録画メタデータ・自動文字起こし参照）",
  verifiedAt: "2026-10-23",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は掲載していません。",
    extra: "録画処理は6:30:16〜7:23:28、保存映像の実尺は52分28.245秒です。自動文字起こしは157処理チャンク、7:22:44まで記録しています。時刻は録画開始を基準とした話題位置の目安です。自動認識に誤りがあり、本人の発言を逐語引用していません。全編の手動聴取・映像の全尺デコード・連続性は未確認です。きら星・訪問・コメント等の画面数値は確認できる原記録を今回照合できていないため、成果を0とは扱いません。",
  }),
};
