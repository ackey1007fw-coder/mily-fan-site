import type { StreamRecap, StreamRecapImage } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildTranscriptionNote } from "./streamRecapRules.ts";

export const morning20261025Gallery: StreamRecapImage[] = [
  {
    "src": "/media/live/mily-b238-01-20261025-morning-still.png",
    "width": 640,
    "height": 360,
    "alt": "カメラに向かって笑顔を見せるみりぃ",
    "caption": "録画内 0:55:01頃",
    "downloadName": "mily-b238-01-20261025-morning-still.png"
  },
  {
    "src": "/media/live/mily-b238-02-20261025-morning-still.png",
    "width": 640,
    "height": 360,
    "alt": "両手でピースを作るみりぃ",
    "caption": "録画内 0:55:13頃",
    "downloadName": "mily-b238-02-20261025-morning-still.png"
  },
  {
    "src": "/media/live/mily-b238-03-20261025-morning-still.png",
    "width": 640,
    "height": 360,
    "alt": "頬に手を添えてウインクするみりぃ",
    "caption": "録画内 0:55:25頃",
    "downloadName": "mily-b238-03-20261025-morning-still.png"
  },
  {
    "src": "/media/live/mily-b238-04-20261025-morning-still.png",
    "width": 640,
    "height": 360,
    "alt": "カメラの近くでウインクとピースをするみりぃ",
    "caption": "録画内 0:55:29頃",
    "downloadName": "mily-b238-04-20261025-morning-still.png"
  },
  {
    "src": "/media/live/mily-b238-05-20261025-morning-still.png",
    "width": 640,
    "height": 360,
    "alt": "首をかしげて笑顔でピースをするみりぃ",
    "caption": "録画内 0:55:37頃",
    "downloadName": "mily-b238-05-20261025-morning-still.png"
  },
  {
    "src": "/media/live/mily-b238-06-20261025-morning-still.png",
    "width": 640,
    "height": 360,
    "alt": "顔の横でピースを作ってウインクするみりぃ",
    "caption": "録画内 0:55:45頃",
    "downloadName": "mily-b238-06-20261025-morning-still.png"
  }
];

export const streamRecap20261025Asa: StreamRecap = {
  id: "2026-10-25-morning-showroom",
  date: "2026-10-25",
  dateLabel: "2026.10.25（日）",
  theme: "朝のメイクとエール",
  broadcastLabel: "録画開始5:37頃〜 約63分",
  platformLabel: "SHOWROOM",
  summary: "朝の支度やメイクをしながら、集まった人たちとおしゃべりした配信。次の審査や応援の話題にも触れ、ラジオへ向かう前に感謝を伝えました。",
  image: morning20261025Gallery[1],
  gallery: morning20261025Gallery,
  galleryZip: { src: "/media/live/mily-b238-07-20261025-morning-stills.zip", filename: "mily-b238-07-20261025-morning-stills.zip", label: "この回の写真6枚をまとめて保存" },
  highlights: [
    { timestamp: "0:00:02", title: "朝の挨拶と配信準備", body: "朝早くから集まった人たちへ挨拶し、カメラや配信の準備を進めました。" },
    { timestamp: "0:03:04", title: "肌寒い朝のおしゃべり", body: "冷え込む朝の話題を交え、コメントを通じてやり取りしました。" },
    { timestamp: "0:15:50", title: "メイクと表現の話", body: "メイクを進めながら、舞台や表現への関心にも話が広がりました。" },
    { timestamp: "0:35:50", title: "次の審査を見据えて", body: "コンテストの次の審査や投票について、視聴者と話しました。" },
    { timestamp: "0:55:10", title: "朝のスクショタイム", body: "メイクを終えた後、両手ピースやウインクなど、いろいろなポーズを見せてくれました。" },
    { timestamp: "0:59:58", title: "ラジオに向かう前に", body: "この後のラジオのお仕事に触れながら、出発前の時間を過ごしました。" },
    { timestamp: "1:02:00", title: "朝のありがとう", body: "集まった人たちへ感謝を伝え、朝の配信を締めくくりました。" },
  ],
  goals: [],
  ranking: [],
  timeline: [
    { timestamp: "0:00:02", label: "朝の挨拶と準備" },
    { timestamp: "0:03:04", label: "肌寒い朝の話" },
    { timestamp: "0:15:50", label: "メイク・表現の話題" },
    { timestamp: "0:35:50", label: "審査・投票について" },
    { timestamp: "0:55:10", label: "ピースとウインクのスクショタイム" },
    { timestamp: "0:59:58", label: "ラジオへ向かう前" },
    { timestamp: "1:02:00", label: "お礼と締めくくり" },
  ],
  nextNote: "",
  sourceLabel: "2026年10月25日 朝のSHOWROOM配信（保存録画メタデータ・自動文字起こし・通常閲覧画面参考値）",
  verifiedAt: "2026-10-25",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は同じ朝配信のスクショタイムの実フレーム6枚を掲載しています。",
    extra: "録画処理は5:37:35〜6:41:50、保存映像の実尺は62分53.772秒です。自動文字起こしは189処理チャンク、6:40:26まで。話題位置は録画開始基準の目安で、自動認識には誤りがあり逐語引用・全編手動聴取・逐語校正はしていません。通信エラー記録があり、全尺デコード・録画の完全な連続性・正式な配信開始終了は未確認です。通常閲覧画面の9指標は6:40:46に更新された最後の有効な参考値で、配信終了時の確定値や正式イベントptではありません。停止した画面の再保存を新しい実測と数えていません。写真はオーナー確認済みの6枚で、代表は両手ピースです。背景の付箋の文字だけをぼかし、顔・髪・手・身体の生成や補正は行っていません。",
  }),
};
