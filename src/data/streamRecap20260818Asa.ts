import type { StreamRecap } from "./streamRecaps.ts";
import { buildRankingNote, buildTranscriptionNote } from "./streamRecapRules.ts";

const captionMaterialNote =
  "保存済みの日本語自動字幕1115行を全文テキスト確認して整理しています。全編の手動聴取は行っておらず、本文は保存字幕の範囲で整理しています。";

export const streamRecap20260818Asa: StreamRecap = {
  id: "2026-08-18-morning-showroom",
  date: "2026-08-18",
  dateLabel: "2026.08.18（火）",
  theme: "朝の新人ミッションと交流",
  broadcastLabel: "10:52頃〜 約51分",
  platformLabel: "SHOWROOM",
  summary:
    "友人と出かける前の配信。新人ライバーミッションをきっかけに初訪問が増え、配信18日目の学びやラジオ活動を紹介しました。3000ポイント達成とトロフィー獲得を確認し、夜枠は時刻未定と案内しました。",
  highlights: [
    { timestamp: "0:01:54", title: "ラジオ研究と番組づくり", body: "ラジオが好きな仲間と番組やポッドキャストを作る活動を紹介し、自身のコミュニティFM出演にも触れました。" },
    { timestamp: "0:06:10", title: "配信はみんなと作るもの", body: "配信は視聴者と一緒に作っていくものだと感じ、試行錯誤しながら成長したいと話しました。" },
    { timestamp: "0:09:20", title: "配信18日目の自己紹介", body: "配信を始めて18日目で、まだ初心者なので優しく教えてほしいと初訪問の人へ自己紹介しました。" },
    { timestamp: "0:12:00", title: "学びながら一緒に前へ", body: "短い期間でもできることが増えたのは周囲のおかげだと感謝し、自分も学びながら一緒に頑張りたいと話しました。" },
    { timestamp: "0:20:01", title: "3000ポイントでトロフィー", body: "新人ライバーミッションの目標を達成し、3000ポイントでトロフィーを獲得したことを確認しました。" },
    { timestamp: "0:24:40", title: "もっと自信をつけて上へ", body: "MISS CIRCLE CONTESTに挑戦中で、次へ進みながら自信をつけて上を目指したいと話しました。" },
    { timestamp: "0:37:04", title: "タレント枠1位表示を確認", body: "SHOWROOMの表示を確認し、その時点でタレント枠1位になっていることに驚きました。" },
    { timestamp: "0:48:59", title: "ランキング読み上げ", body: "終盤に13位から1位までランキングを読み上げました。個人名は掲載しません。" },
  ],
  goals: [],
  ranking: [buildRankingNote(13, 1, "end")],
  timeline: [
    { timestamp: "0:00:30", label: "友人と出かける前の準備中に配信を開始" },
    { timestamp: "0:01:54", label: "ラジオ研究・番組制作の活動を紹介" },
    { timestamp: "0:03:22", label: "コミュニティFMでのラジオ出演を紹介" },
    { timestamp: "0:06:10", label: "配信をみんなと作っていきたいと話す" },
    { timestamp: "0:06:59", label: "次の審査までの応援について話す" },
    { timestamp: "0:09:20", label: "配信18日目の初心者として自己紹介" },
    { timestamp: "0:12:00", label: "18日間の学びと感謝を話す" },
    { timestamp: "0:20:01", label: "3000ポイント達成とトロフィー獲得を確認" },
    { timestamp: "0:24:40", label: "もっと自信をつけて上を目指したいと話す" },
    { timestamp: "0:28:52", label: "SNSやXも更新していきたいと話す" },
    { timestamp: "0:32:43", label: "次の審査向けにプロフィール表記を更新する話" },
    { timestamp: "0:37:04", label: "その時点のタレント枠1位表示を確認" },
    { timestamp: "0:38:14", label: "夜枠の時刻は未定でファンルーム案内と説明" },
    { timestamp: "0:48:59", label: "13位から1位までランキングを読み上げる" },
    { timestamp: "0:50:18", label: "夜も配信予定だが時刻未定と再案内して終了へ" },
  ],
  nextNote: "配信時点では夜も配信予定でしたが時刻は未定で、ファンルームを確認してほしいと案内していました。",
  sourceLabel: "2026年8月18日 朝配信（保存済み自動字幕確認）",
  verifiedAt: "2026-09-15",
  transcriptionNote: buildTranscriptionNote({
    material: captionMaterialNote,
    stills: "静止画は掲載していません。",
    extra:
      "保存字幕は録画のほぼ全域をカバーしていますが、全編の手動聴取とは区別しています。独立した歌唱場面は確認できなかったためsongsには登録していません。",
  }),
};
