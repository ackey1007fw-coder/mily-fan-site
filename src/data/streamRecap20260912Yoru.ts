import type { StreamRecap, StreamRecapImage } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildRankingNote, buildTranscriptionNote } from "./streamRecapRules.ts";

const approvedStills: StreamRecapImage[] = [
  { src: "/media/live/mily-b113-01-hands-together-smile.jpg", width: 640, height: 360, alt: "9月12日の夜配信、手を合わせて笑顔を見せるみりぃ", caption: "手を合わせた冒頭の笑顔", downloadName: "みりぃ_20260912夜_01.jpg" },
  { src: "/media/live/mily-b113-02-pointing-pose.jpg", width: 640, height: 360, alt: "9月12日の夜配信、両手で指さしポーズをするみりぃ", caption: "両手で指さしポーズ", downloadName: "みりぃ_20260912夜_02.jpg" },
  { src: "/media/live/mily-b113-03-goal-board.jpg", width: 640, height: 360, alt: "9月12日の夜配信、目標ボードを持って紹介するみりぃ", caption: "目標ボードを紹介", downloadName: "みりぃ_20260912夜_03.jpg" },
  { src: "/media/live/mily-b113-04-hands-together.jpg", width: 640, height: 360, alt: "9月12日の夜配信、手を合わせてにっこり笑うみりぃ", caption: "手を合わせてにっこり", downloadName: "みりぃ_20260912夜_04.jpg" },
  { src: "/media/live/mily-b113-05-bright-smile.jpg", width: 640, height: 360, alt: "9月12日の夜配信、カメラに向けて明るい笑顔を見せるみりぃ", caption: "カメラに向けた明るい笑顔", downloadName: "みりぃ_20260912夜_05.jpg" },
  { src: "/media/live/mily-b113-06-board-cheek.jpg", width: 640, height: 360, alt: "9月12日の夜配信、目標ボードに頬を寄せるみりぃ", caption: "ボードに頬を寄せて", downloadName: "みりぃ_20260912夜_06.jpg" },
  { src: "/media/live/mily-b113-07-standing-pose.jpg", width: 640, height: 360, alt: "9月12日の夜配信、立った姿でカメラを見つめるみりぃ", caption: "立ち姿でカメラを見つめて", downloadName: "みりぃ_20260912夜_07.jpg" },
  { src: "/media/live/mily-b113-08-soft-smile.jpg", width: 640, height: 360, alt: "9月12日の夜配信、終盤にやわらかな笑顔を見せるみりぃ", caption: "終盤のやわらかな笑顔", downloadName: "みりぃ_20260912夜_08.jpg" },
  { src: "/media/live/mily-b113-09-fingertips-pose.jpg", width: 640, height: 360, alt: "9月12日の夜配信、指先を合わせたポーズのみりぃ", caption: "指先を合わせて", downloadName: "みりぃ_20260912夜_09.jpg" },
  { src: "/media/live/mily-b113-10-small-pose.jpg", width: 640, height: 360, alt: "9月12日の夜配信、指先で小さなポーズを作るみりぃ", caption: "指先で小さなポーズ", downloadName: "みりぃ_20260912夜_10.jpg" },
];

export const streamRecap20260912Yoru: StreamRecap = {
  "id": "2026-09-12-yoru-showroom",
  "date": "2026-09-12",
  "dateLabel": "2026.09.12（土）",
  "theme": "夜の達成と8曲のありがとう",
  "broadcastLabel": "20:40頃〜 約133分",
  "platformLabel": "SHOWROOM",
  "summary": "SHOWROOM審査の最終枠に8曲を歌い、アバター権達成をみんなで喜んだ夜です。三次審査の通過は結果待ちとして、最後までの応援に感謝し、自分のペースで次へ進む思いを話しました。",
  image: approvedStills[4],
  gallery: approvedStills,
  galleryZip: { src: "/media/live/mily-b113-night-stills.zip", filename: "みりぃ_20260912夜_スクショ10枚.zip", label: "10枚まとめて保存" },
  "songs": [
    {
      "title": "明日はきっといい日になる",
      "artist": "高橋優",
      "timestamp": "0:09:01",
      "youtubeUrl": "https://www.youtube.com/watch?v=cpIa89_rZoA",
      "youtubeVersionNote": "オモクリ監督エディットバージョン（Short size）です。"
    },
    {
      "title": "ちっぽけな勇気",
      "artist": "FUNKY MONKEY BABYS",
      "timestamp": "0:22:21",
      "youtubeUrl": "https://www.youtube.com/watch?v=FKXBSuN-nQo"
    },
    {
      "title": "かわいいだけじゃだめですか？",
      "artist": "CUTIE STREET",
      "timestamp": "0:32:56",
      "youtubeUrl": "https://www.youtube.com/watch?v=jZqTz1G8G04",
      karaoke: { youtubeUrl: "https://www.youtube.com/watch?v=YYGsvfQcDIg", channel: "CUTIE STREET" }
    },
    {
      "title": "生まれてはじめて",
      "artist": "神田沙也加・松たか子",
      "timestamp": "0:52:22",
      "youtubeUrl": "https://www.youtube.com/watch?v=MDZSdjLqiGA",
      karaoke: { youtubeUrl: "https://www.youtube.com/watch?v=O3xpEoW_uao", channel: "生音風カラオケ屋" }
    },
    {
      "title": "ケセラセラ",
      "artist": "Mrs. GREEN APPLE",
      "timestamp": "0:59:01",
      "youtubeUrl": "https://www.youtube.com/watch?v=Jy-QS27q7lA"
    },
    {
      "title": "超最強",
      "artist": "超ときめき♡宣伝部",
      "timestamp": "1:15:53",
      "youtubeUrl": "https://www.youtube.com/watch?v=PwlB-rXk1gM",
      karaoke: { youtubeUrl: "https://www.youtube.com/watch?v=Wuyx1pDlDvg", channel: "カラオケ歌っちゃ王" }
    },
    {
      "title": "明日も",
      "artist": "SHISHAMO",
      "timestamp": "1:22:13",
      "youtubeUrl": "https://www.youtube.com/watch?v=zhCtzmDWsN0"
    },
    {
      "title": "ありがとう",
      "artist": "いきものがかり",
      "timestamp": "1:34:08",
      "youtubeUrl": "https://www.youtube.com/watch?v=VZBU8LvZ91Q"
    }
  ],
  "highlights": [
    {
      "timestamp": "0:01:23",
      "title": "最終枠の緊張と笑顔",
      "body": "SHOWROOM審査の最終枠を迎え、緊張していると話しました。集まったみんなに感謝し、最後は明るく歌って過ごしたいと伝えました。"
    },
    {
      "timestamp": "0:18:40",
      "title": "まずは今できることから",
      "body": "三次審査通過とアバター権獲得の二つを目標に掲げました。ファイナルを目指す思いを持ちながら、まずは今できることを着実に進めたいと話しました。"
    },
    {
      "timestamp": "0:32:56",
      "title": "かわいい歌で気持ちを上げて",
      "body": "緊張を和らげようと「かわいいだけじゃだめですか？」を歌いました。コメントへの反応や振りを交え、歌を通じてみんなと楽しみました。"
    },
    {
      "timestamp": "0:52:22",
      "title": "得意な歌をのびやかに",
      "body": "得意な曲として「生まれてはじめて」を披露しました。歌うことが大好きだと話し、表現を褒めるコメントにお礼を伝えました。"
    },
    {
      "timestamp": "0:58:38",
      "title": "高校時代を支えてくれた歌",
      "body": "高校時代に支えられた曲として「ケセラセラ」を選びました。歌の合間にも応援へ感謝を伝え、みんなと最後まで頑張る思いを話しました。"
    },
    {
      "timestamp": "1:05:26",
      "title": "みんなで喜んだアバター権",
      "body": "アバター権の達成を報告し、一人ひとりの応援に感謝しました。アバターを使った撮影会への期待を話し、次は三次審査通過を目指すと伝えました。"
    },
    {
      "timestamp": "1:34:08",
      "title": "ありがとうを歌に込めて",
      "body": "リクエストされた、いきものがかり「ありがとう」を歌いました。審査期間を走りきれたのはみんなのおかげだと、繰り返し感謝を伝えました。"
    },
    {
      "timestamp": "2:08:34",
      "title": "これからも自分のペースで",
      "body": "周りと比べてしまうときにも、一度立ち止まり、自分のペースに戻して頑張りたいと話しました。応援してもらえることを当たり前と思わず進む決意で締めくくりました。"
    }
  ],
  "goals": [
    {
      "item": "アバター権",
      "target": "獲得",
      "statusThen": "達成を報告"
    },
    {
      "item": "三次審査",
      "target": "通過",
      "statusThen": "結果待ち"
    },
    {
      "item": "WEB投票",
      "target": "最終日まで",
      "statusThen": "翌日も協力を依頼"
    }
  ],
  "ranking": [buildRankingNote(13, 1, "during")],
  "timeline": [
    {
      "timestamp": "0:09:01",
      "label": "明日はきっといい日になるの歌唱"
    },
    {
      "timestamp": "0:18:40",
      "label": "二つの目標と今できること"
    },
    {
      "timestamp": "0:22:21",
      "label": "ちっぽけな勇気の歌唱"
    },
    {
      "timestamp": "0:32:56",
      "label": "かわいいだけじゃだめですか？の歌唱"
    },
    {
      "timestamp": "0:52:22",
      "label": "生まれてはじめての歌唱"
    },
    {
      "timestamp": "0:59:01",
      "label": "ケセラセラの歌唱"
    },
    {
      "timestamp": "1:05:26",
      "label": "アバター権達成の報告"
    },
    {
      "timestamp": "1:15:53",
      "label": "超最強の歌唱"
    },
    {
      "timestamp": "1:20:12",
      "label": "SHOWROOM審査を終えて"
    },
    {
      "timestamp": "1:22:13",
      "label": "明日もの歌唱"
    },
    {
      "timestamp": "1:30:04",
      "label": "13位から1位の読み上げ"
    },
    {
      "timestamp": "1:34:08",
      "label": "ありがとうの歌唱"
    },
    {
      "timestamp": "2:01:48",
      "label": "恩送りの思い"
    },
    {
      "timestamp": "2:03:51",
      "label": "翌朝の配信案内"
    },
    {
      "timestamp": "2:08:34",
      "label": "自分のペースで進む決意"
    },
    {
      "timestamp": "2:12:16",
      "label": "応援への感謝と締めくくり"
    }
  ],
  "nextNote": "配信時点では、翌9月13日6:00〜6:30のメイク配信と、朝からのラジオを案内していました。WEB投票も翌日が最終日と呼びかけていました。",
  "sourceLabel": "2026年9月12日 SHOWROOM夜配信（オーナー提供録画・自動文字起こし）",
  "verifiedAt": "2026-09-13",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は録画の実フレーム10枚を掲載しています。",
    extra: "確認用音声約2時間13分の自動文字起こしを全文照合しました。複数録画の重複を照合した統合記録の先頭からの目安です。全編手動聴取と録画の完全性の検証は未実施です。21:59はSHOWROOM審査の締切で、配信終了時刻ではありません。歌唱動画は利用条件確認のため掲載していません。録画全体を概観し、第三者やコメント欄が写らない実フレーム10枚を選定し、オーナーの掲載承認を確認しています。",
  }),
};
