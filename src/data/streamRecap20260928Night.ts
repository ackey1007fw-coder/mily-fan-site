import type { StreamRecap, StreamRecapImage } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildRankingNote, buildTranscriptionNote } from "./streamRecapRules.ts";

const gallery: StreamRecapImage[] = [
  {"src":"/media/live/mily-b172-01-thanks-smile-005345.jpg","width":640,"height":360,"alt":"赤い髪飾りを付け、カメラに向かって笑顔を見せるみりぃ","caption":"配信中の笑顔（録画内0:53:45）","downloadName":"mily-b172-01-thanks-smile-005345.jpg"},
];

export const streamRecap20260928Night: StreamRecap = {
  id: "2026-09-28-night-thanks",
  date: "2026-09-28",
  dateLabel: "2026.09.28（月）",
  theme: "夜の手書きで届けるありがとう",
  broadcastLabel: "20:00頃〜 約187分",
  platformLabel: "SHOWROOM",
  summary: "初めてのお礼配信は、手書きのボードと笑顔で三次審査の応援に感謝を届ける夜。スクショタイムを挟み、後半はいつものおしゃべりへ。手紙をもらう喜びも話しながら、約3時間を一緒に過ごしたみんなへお礼を伝えました。",
  image: gallery[0],
  gallery,
  galleryNote: "配信中の実スクショ1枚です。個人名・ポイントを含むお礼ボードは掲載していません。画像を保存できます。",
  highlights: [
    { timestamp: "0:01:13", title: "ゆっくり届けるお礼", body: "この日は時間をかけてお礼配信をしようと話してスタート。三次審査を応援してくれた人たちへ、感謝を伝える時間になりました。" },
    { timestamp: "0:47:25", title: "手書きのボードを掲げて", body: "用意したお礼ボードをカメラへ。書き込んだ言葉を見せながら、応援への思いを届けていました。" },
    { timestamp: "0:53:45", title: "ありがとうの笑顔", body: "ボードを見せる合間にはスクショタイムも。赤い髪飾りを付けたみりぃが、カメラに向かって笑顔を見せました。" },
    { timestamp: "1:30:55", title: "いつものおしゃべりへ", body: "お礼の時間を終えたあとは、みんなとのおしゃべりへ。初めてのお礼配信を振り返りながら、夜の配信が続きました。" },
    { timestamp: "2:40:01", title: "手紙がうれしいから", body: "手紙をもらうことが好きで、これまでの手紙も大切に残していると話しました。自分がうれしいから、みんなにも手紙を届けたいという思いを伝えました。" },
    { timestamp: "3:03:58", title: "一緒に過ごした夜に感謝", body: "お礼配信といつもの配信を続けてできたことを振り返り、みんなのおかげだと感謝。長い時間を一緒に過ごしてくれた人たちへ、おやすみのあいさつを届けました。" },
  ],
  goals: [],
  ranking: [buildRankingNote()],
  timeline: [
    { timestamp: "0:01:13", label: "ゆっくりお礼を届ける夜の始まり" },
    { timestamp: "0:47:25", label: "手書きボードをカメラへ" },
    { timestamp: "0:53:45", label: "笑顔のスクショタイム" },
    { timestamp: "1:02:26", label: "お礼ボードを掲げる" },
    { timestamp: "1:08:19", label: "カメラに向かって笑顔" },
    { timestamp: "1:30:55", label: "お礼の時間から通常のおしゃべりへ" },
    { timestamp: "2:40:01", label: "手紙をもらう喜びと届ける気持ち" },
    { timestamp: "3:02:01", label: "ランキングとお礼" },
    { timestamp: "3:03:58", label: "お礼配信を振り返る" },
    { timestamp: "3:05:55", label: "長い時間への感謝とおやすみ" },
  ],
  nextNote: "",
  sourceLabel: "2026年9月28日 SHOWROOM夜のお礼配信（保存録画・自動文字起こし・本人ファンルーム）",
  verifiedAt: "2026-09-29",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は録画内0:53:45の実フレーム1枚です。お礼ボードと画像一括保存は、個人名・ポイントの露出を防ぐため掲載していません。",
    extra: "録画開始記録20:00:33、メディア実測11191.703秒。94区間の自動文字起こしが完了し、主要場面の文字起こしと実フレーム10時点を確認しました。全編の手動聴取・逐語校正は未実施です。録画終了記録との差があり、完全な連続収録とは認定していません。時刻は録画先頭からの目安です。歌唱曲と短尺の原音確認は未完了のため、この版では掲載していません。",
  }),
};
