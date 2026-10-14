import type { StreamRecap } from "./streamRecaps.ts";
import { buildTranscriptionNote } from "./streamRecapRules.ts";

// 2026-10-14 夜 SHOWROOM。録画メタデータのみを確認した暫定レポート。
// 配信内容、個別の盛り上がり、星・訪問・コメントの有効画面値は未確認。
// この日までに終了した四次審査と合算しない。数値の未取得は0ではない。
export const streamRecap20261014Night: StreamRecap = {
  id: "2026-10-14-night-showroom",
  date: "2026-10-14",
  dateLabel: "2026.10.14（水）",
  theme: "夜の配信を記録しました",
  broadcastLabel: "録画開始22:02頃〜 約68分",
  platformLabel: "SHOWROOM",
  summary:
    "10月14日夜のみりぃのSHOWROOM配信は、保存録画が確認できました。今回の配信内容や会話の見どころはまだ音声照合できていません。きら星・訪問・コメントの夜枠の数値も確認できていないため、推測で補わず、確認済みの録画記録を先に公開しています。",
  highlights: [
    {
      timestamp: "0:00:00",
      title: "10月14日夜の配信を保存",
      body:
        "22:02頃に録画処理が始まりました。これは保存処理の開始時刻であり、SHOWROOM上の正確な配信開始時刻を確定するものではありません。",
    },
    {
      timestamp: "1:08:09",
      title: "約68分の保存映像",
      body:
        "録画ファイルの存在と再生時間を確認しました。途中に通信エラーが記録されているため、全区間を欠けなく保存できたとは断定していません。トークの詳細は映像・音声の確認後に追記します。",
    },
  ],
  goals: [],
  ranking: [],
  timeline: [
    { timestamp: "0:00:00", label: "22:02頃 録画処理開始" },
    { timestamp: "1:08:09", label: "保存映像の末尾（録画終了確認は23:12頃）" },
  ],
  nextNote: "",
  sourceLabel: "2026年10月14日 夜のSHOWROOM配信（保存録画のメタデータ確認）",
  verifiedAt: "2026-10-14",
  transcriptionNote: buildTranscriptionNote({
    material:
      "保存録画のファイル・開始終了処理・映像の再生時間だけを確認しました。音声の聞き取り、発言内容の検証、全文文字起こしはまだ行っていません。",
    stills: "静止画・音声・録画全編は掲載していません。",
    extra:
      "夜配信のきら星・訪問・コメントについて有効なオンライン画面の計測記録が確認できず、すべて未取得です。昼配信の数値を流用したり、0件と表示したりしません。四次審査は10月12日に終了しており、この枠は別集計です。映像の通信欠落可能性があるため完全録画とは断定しません。",
  }),
};
