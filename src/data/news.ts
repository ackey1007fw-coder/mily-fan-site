/**
 * Latest updates. Keep this empty rather than filling unverified items.
 * The UI sorts a copy by date, then optional sameDayOrder. Unranked same-day
 * items keep their source-array order without inventing publication times.
 * How to add an item: docs/CONTENT-OPS.md
 *
 * - source: optional confirmed 出典 URL（「出典を見る」）
 * - sourceLabel: optional label. Without source, it renders as non-link text.
 * - url: optional. Only when it differs from source（「関連リンク」）
 * - ctaLabel: optional. href is url ?? source
 */
import type { ActivityId } from "./activities.ts";
import {
  eventStory20260821,
  morningOhayo20260821,
  morningStoryVideo,
  morningStory20260820,
} from "./morningStoryVideo.ts";
import { morningShowroomRunwayVideo } from "./morningShowroomRunwayVideo.ts";
import { tiktokRadioVideo } from "./tiktokRadioVideo.ts";
import { campusGirlsSecondStageResultImage } from "./campusGirlsSecondStageResultImage.ts";
import { earthquakeSafetyStoryVideo } from "./earthquakeSafetyStoryVideo.ts";
import { nightThanksMorningStreamStoryVideo } from "./nightThanksMorningStreamStoryVideo.ts";
import { seasideCircleMusicalSpecialThanksVideo } from "./seasideCircleMusicalSpecialThanksVideo.ts";
import { morningMakeupShowroomImage } from "./morningMakeupShowroomImage.ts";

export type NewsVideoMedia = {
  kind: "video";
  src: string;
  poster: string;
  width: number;
  height: number;
  alt: string;
};

/** Self-hosted still image that belongs to the post itself, not the Gallery. */
export type NewsImageMedia = {
  kind: "image";
  src: string;
  width: number;
  height: number;
  alt: string;
};

export type NewsMedia = NewsVideoMedia | NewsImageMedia;

export type NewsMessage = {
  label?: string;
  text: string;
};

export type NewsItem = {
  id: string;
  /** Display date, ISO `YYYY-MM-DD`. */
  date: string;
  /** Explicit editorial order within the same date. Higher values appear first. */
  sameDayOrder?: number;
  /** Explicit Activity relations only. Absence means deliberately unclassified. */
  activityIds?: ActivityId[];
  title: string;
  body: string;
  source?: string;
  sourceLabel?: string;
  url?: string;
  ctaLabel?: string;
  media?: NewsMedia;
  message?: NewsMessage;
};

export const news: NewsItem[] = [
  {
    id: "2026-08-24-campus-girls-final-stage-guide",
    date: "2026-08-24",
    sameDayOrder: 3,
    activityIds: ["campus-girls"],
    title: "CAMPUS GIRLS 2027 予選A Final STAGEへ📣✨",
    body: "8月24日、みりぃがCAMPUS GIRLS 2027 予選A Final STAGEの応援方法を案内しました。SNS審査は8月24日12:00〜8月30日12:00、Paton投票審査は8月26日18:00〜9月1日23:59。投票先の詳細は追って案内するとしています。また、CAMPUS GIRLSでは配信を行わないことも伝えています。画像ではFinal STAGE期間を8月24日12:00〜8月30日23:59と案内しています。",
    source: "https://x.com/mily_chan36/status/2091669951946121636",
    sourceLabel: "Xの投稿を見る",
  },
  {
    id: "2026-08-24-makeup-stream",
    date: "2026-08-24",
    sameDayOrder: 2,
    activityIds: ["live-stream"],
    title: "初メイク配信！朝からの応援ありがとう💄",
    body: "8月24日の朝、みりぃがSHOWROOMでメイク配信を行いました。Instagram Storyでは自身で「初メイク配信」と紹介しています。これまでは「完璧な状態でみんなの前に出たい」と思っていたものの、それでは皆と過ごせる時間が限られてしまい、皆の言う「無理する」ことにつながるのも嫌だったので断念し、今回の配信に至ったと伝えています。配信後のXでは、朝早くから来てくれた皆さんへの感謝とともに、コメントやキラ星、ギフトなどさまざまな形の応援を感じて「楽しかったよ〜」と振り返りました。次回は夜配信になる可能性があり、詳細は改めて案内するとのことです。",
    source: "https://x.com/mily_chan36/status/2091668215919444138",
    sourceLabel: "Xの投稿を見る",
    url: "https://www.instagram.com/mily_chan36",
    ctaLabel: "Instagramプロフィールを見る",
    media: morningMakeupShowroomImage,
    message: {
      label: "みりぃの投稿",
      text: `おはよう！朝配信ありがとう🥹✊🏻✨
ついにメイク配信してしまったｾﾞ🤦🏻‍♀️
朝早くだったのに来てもらえて、コメント、キラ星、ギフトいろんな形で応援してくれているのを感じて楽しかったよ〜🫶🏻❣️
次の配信は夜になるかと！また連絡しますねん♪
今日も暑い。溶けないように水分補給だね🫠
#ミスサー`,
    },
  },
  {
    id: "2026-08-24-night-thanks-morning-stream",
    date: "2026-08-24",
    sameDayOrder: 1,
    activityIds: ["live-stream", "radio"],
    title: "夜枠＆ラジオありがとう！朝は6:20〜☀️",
    body: "8月24日未明、みりぃがSHOWROOMファンルームとInstagram Storyで、夜枠へのお礼とラジオをたくさんの方に聴いてもらえたことへの感謝を届けました。みんなと話すことが楽しいこと、誰でも参加しやすいルームにしていきたいという思いも伝えています。8月24日の朝枠は6:20〜6:50で、最近の1日のスケジュールについて話す予定です。夜については改めて連絡すると案内しています。",
    source: "https://x.com/mily_chan36/status/2091561616307585262",
    sourceLabel: "Xの投稿を見る",
    media: nightThanksMorningStreamStoryVideo,
    message: {
      label: "みりぃからの連絡💌 · 00:57",
      text: `今日もありがとうございました😌🙏🏻✨

ラジオのことも知ってくれて、聴いてもらえて、嬉しいねぇ、愛されているねぇ、幸せだねぇ🥺🩵

明日は6:20〜6:50で配信します！
早く寝ないと私起きれないよ〜😭😭😭笑
起きるの頑張ります🤭

おやすみりぃ`,
    },
  },
  {
    id: "2026-08-23-dragon-cloud",
    date: "2026-08-23",
    sameDayOrder: 5,
    title: "龍みたいな雲に出会った日🐉",
    body: "友達と将来について語っていたとき、みりぃが空に龍のように見える雲を見つけて撮影しました。龍の形をした雲には「次のステージに進む準備が整った」「運気が大きく上がる」といった意味があるらしいと紹介。普段はこうしたことをあまり気にしないものの、悩むことも多かったタイミングで見られたことを嬉しく感じ、「いいことはちょっと信じてみる」と投稿しています。",
    source: "https://www.instagram.com/p/DcYbkvOk4Te/",
    sourceLabel: "Instagramの投稿を見る",
    media: {
      kind: "image",
      src: "/media/news/mily-b20-02-dragon-cloud-close.jpg",
      width: 1600,
      height: 1200,
      alt: "青空に龍のようにも見える白い雲が広がる様子",
    },
  },
  {
    id: "2026-08-23-seaside-circle-musical-special",
    date: "2026-08-23",
    sameDayOrder: 4,
    activityIds: ["radio"],
    title: "真夏のミュージカル特集🎭 清水美依紗さんを迎えた生放送",
    body: "8月23日の「湘南シーサイドサークル」は真夏のミュージカル特集。前半約2時間には清水美依紗さんをゲストに迎え、ミュージカルとの出会い、『レ・ミゼラブル』『ミス・サイゴン』、表現や夢への向き合い方までじっくりトークしました。12時台には、みりぃ自身が高校時代に『グレイテスト・ショーマン』と「This Is Me」から勇気をもらった思い出も語りました。放送後、番組公式Instagram Storyでは、リスナーへのお礼と清水美依紗さんへの出演への感謝も届けられました。",
    source: "https://x.com/fm_smw856/status/2091499993102524714",
    sourceLabel: "FM湘南マジックウェイブの放送後投稿を見る",
    url: "/stories/2026-08-23-musical-special/",
    ctaLabel: "真夏のミュージカル特集の放送記録を読む",
    media: seasideCircleMusicalSpecialThanksVideo,
  },
  {
    id: "2026-08-23-morning-showroom-fanroom",
    date: "2026-08-23",
    sameDayOrder: 3,
    activityIds: ["live-stream", "radio"],
    title: "朝枠ありがとう！次枠は22:30〜💄",
    body: "8月23日のSHOWROOMファンルームで、みりぃが朝配信へのお礼と新規フォロワーへの感謝を伝え、改めて自己紹介しました。次枠22:30〜を案内し、次はメイクした姿で配信すると伝えています。FMラジオへ向かう直前の投稿です。",
    sourceLabel: "SHOWROOMファンルーム",
    message: {
      label: "みりぃからの連絡💌 · 06:25",
      text: "朝配信遅れてごめんなさいー！！！\n\nきてくれたみんなありがとう😌🙏🏻✨\nそして、フォローしてくださった皆様もありがとう🤭✨\n\n改めて、みりぃです！\n\nまた次も来てくれたら嬉しいよ〜♪\n\n次は22:30〜ねー！絶対にメイクしてます😊いつもきてくれている方からすると久しぶりのメイクみりぃ💄だね！\n\n始めてくる方も大歓迎〜！\n\nでは、ラジオ行ってきますー！",
    },
  },
  {
    id: "2026-08-23-early-showroom-fanroom",
    date: "2026-08-23",
    sameDayOrder: 2,
    activityIds: ["live-stream", "radio"],
    title: "FMラジオ前のFan Room投稿📻",
    body: "8月23日のSHOWROOMファンルームで、みりぃがFMラジオ前にラジオ配信をしてから行こうかと、ファンルームで問いかけました。",
    sourceLabel: "SHOWROOMファンルーム",
    message: {
      label: "みりぃからの連絡💌 · 05:53",
      text: "FMラジオ前にラジオ配信して行っていいかしらね？笑",
    },
  },
  {
    id: "2026-08-23-earthquake-showroom-fanroom",
    date: "2026-08-23",
    sameDayOrder: 1,
    title: "地震直後、みんなの安全を気遣うみりぃ💌",
    body: "8月23日未明の地震直後、SHOWROOMファンルームでみりぃが「まずは身の安全を確保」と呼びかけました。その後も「皆さん無事かな？？」とファンを気遣い、自身も無事だと報告しています。Instagram Storyでも関東圏の皆さんの無事を気遣い、「まずは落ち着いて」「自分の身の安全の確保‼」と呼びかけています。",
    sourceLabel: "SHOWROOMファンルーム / Instagram Story",
    media: earthquakeSafetyStoryVideo,
    message: {
      label: "みりぃからの連絡💌 · 02:02〜02:19",
      text: `みりぃ · 02:02
地震だね、落ち着いて！！まずは身の安全を確保✊🏻😌

みりぃ · 02:18
皆さん無事かな？？

みりぃ · 02:19
みりぃは無事です、ありがとう🙌🏻🙌🏻`,
    },
  },
  {
    id: "2026-08-22-night-showroom-thanks",
    date: "2026-08-22",
    sameDayOrder: 3,
    activityIds: ["live-stream"],
    title: "夜枠ありがとう！8/23の配信予定もお知らせ📡✨",
    body: "8月22日の夜、みりぃがSHOWROOM配信へのお礼をXに投稿しました。あわせて、投稿時点で翌23日は朝5:40〜と夜22:30〜の2枠を予定していることを案内し、「おやすみりぃ」と締めくくっています。",
    source: "https://x.com/mily_chan36/status/2091166455224299641",
    sourceLabel: "Xの投稿を見る",
    media: {
      kind: "image",
      src: "/media/news/mily-b17-01-night-showroom-fireworks.jpg",
      width: 1206,
      height: 555,
      alt: "花火大会仕様のSHOWROOM配信画面で、中央にみりぃが映り、画面下部に視聴者のアバターが並んでいる様子",
    },
    message: {
      label: "みりぃの投稿",
      text: `夜枠ありがとうございました！！

明日は
朝☀️5:40〜
夜🌙22:30〜
の予定だよ🙇🏻‍♀️🙇🏻‍♀️🙇🏻‍♀️

おやすみりぃ

#ミスサー #ミスサークル #ミスサークルコンテスト #ミスサークルコンテスト2026`,
    },
  },
  {
    id: "2026-08-22-night-showroom-fanroom",
    date: "2026-08-22",
    sameDayOrder: 2,
    activityIds: ["live-stream"],
    title: "夜枠ありがとう！明日は朝5:40〜・夜22:30〜🌙",
    body: "8月22日のSHOWROOMファンルームで、みりぃが夜枠配信へのお礼を伝え、ルームの温かい空間への感謝と、これからも一緒にいろんな景色を見ていきたいという言葉を届けました。翌日の配信予定として朝5:40〜と夜22:30〜を案内しています。",
    sourceLabel: "SHOWROOMファンルーム",
    message: {
      label: "みりぃからの連絡💌 · 22:57",
      text: "夜枠ありがとうございました！！\n\n等身大の自分でいることができるのは、ルームにいる皆様全員が暖かく、リラックスできる空間を作ってくれているからです😭✨\n\nこれからもみんなと一緒にいろんな景色を見ていきたいよ🥺✊🏻🩵\n\n明日⬇️\n朝☀️5:40〜\n夜🌙22:30〜\n\nよろしくお願いします！",
    },
  },
  {
    id: "2026-08-22-evening-showroom-fanroom",
    date: "2026-08-22",
    sameDayOrder: 1,
    activityIds: ["live-stream"],
    title: "帰宅報告！20:30〜を目標に夜配信☔",
    body: "8月22日のSHOWROOMファンルームで、みりぃが帰宅報告とゲリラ豪雨への気遣いを伝え、食事とお風呂のあと、20:30〜に配信できるよう頑張りたいと伝えました。翌朝が早いため早めに休む予定も伝えています。",
    sourceLabel: "SHOWROOMファンルーム",
    message: {
      label: "みりぃからの連絡💌 · 18:17",
      text: "ただいま〜✨\n皆さんゲリラ豪雨大丈夫？？私はポツポツ降ってきたなぁぁぁくらいで家に着いてギリギリセーフだったよ🏠帰宅時間の皆さんお気をつけて〜😭🙌🏻\n\n今からご飯作って食べて、お風呂に入ってその後配信したいからぁ、、、🤔💭\n\n20:30〜\nできるように頑張ろうかなっ！\n\n明日の朝はめちゃくちゃ早いから、流石に早めに寝るように努める🥱",
    },
  },
  {
    id: "2026-08-22-campus-girls-second-stage-jury-award",
    date: "2026-08-22",
    activityIds: ["campus-girls"],
    title: "CAMPUS GIRLS 2027 審査員賞！予選ファイナル進出✨",
    body: "8月22日、みりぃがCAMPUS GIRLS 2027 予選A 2nd STAGEで審査員賞を受賞し、予選ファイナルへ進出することを報告しました。コンテストとの両立に難しさを感じながらも、チャンスへの感謝と「可能性を信じて、自分のできることを」という思いを届けています。",
    source: "https://x.com/mily_chan36/status/2090988000813654232",
    sourceLabel: "Xの投稿を見る",
    url: "/stories/campus-girls-2027-second-stage-jury-award/",
    ctaLabel: "審査員賞・予選ファイナル進出の記録を読む",
    media: campusGirlsSecondStageResultImage,
  },
  {
    id: "2026-08-21-tiktok-radio-misscircle",
    date: "2026-08-21",
    sameDayOrder: 1,
    activityIds: ["radio", "miss-circle"],
    title: "湘南シーサイドサークルのTikTokにみりぃが登場📻✨",
    body: "8月21日、湘南シーサイドサークルのTikTokに、みりぃの動画が投稿されました。番組TikTokに登場したみりぃが、ラジオDJとミスコンの両方を頑張る気持ちを伝えています。",
    source: tiktokRadioVideo.sourceUrl,
    sourceLabel: "湘南シーサイドサークルのTikTok投稿を見る",
    media: tiktokRadioVideo,
    message: {
      label: "湘南シーサイドサークルの投稿",
      text: "ラジオDJもミスコンも頑張らせていただくよ✌みりぃです^^",
    },
  },
  {
    id: "2026-08-21-after-afternoon-ganda",
    date: "2026-08-21",
    activityIds: ["live-stream"],
    title: "急遽のガンダで絶望！？23:00〜配信で心境トーク🤭",
    body: "8月21日のXで、みりぃが昼枠配信を見ていた方には通じるという写真を投稿。「急遽なガンダで絶望している」と笑いまじりに伝え、投稿では23:00〜の配信でこの時の心境を話すと案内しました。",
    source: "https://x.com/mily_chan36/status/2090722156162478273",
    sourceLabel: "Xの投稿を見る",
    media: {
      kind: "image",
      src: "/media/news/mily-b14-01-ganda-before-night-stream.jpg",
      width: 720,
      height: 1280,
      alt: "黒いキャップとマスク姿で、青空と太陽を背に見上げる構図のみりぃ。写真内に昼枠配信と23:00からの配信についての文字が表示されている",
    },
    message: {
      label: "みりぃの投稿",
      text: "昼枠配信見てくれた方には通じる写真。\n\n急遽なガンダで絶望してるみりぃ。笑笑笑\n\nどういうこと？？\nという方は23:00〜の配信でお待ちしております🛜\nこの時の心境お話ししますね🤭笑\n\n#ミスサー #ミスサークルコンテスト2026 #ミスサークル #ミスサークル2026 #ミスサー2026 #ミスコン",
    },
  },
  {
    id: "2026-08-21-afternoon-showroom-fanroom",
    date: "2026-08-21",
    activityIds: ["live-stream"],
    title: "朝枠ありがとう！次枠は14:00〜📡✨",
    body: "8月21日のSHOWROOMファンルームで、みりぃが朝の配信へのお礼と次枠14:00〜を案内しました。初めて来てくれた方やフォローしてくれた方への感謝とともに、これからもいろいろな一面を見つけてほしいと呼びかけています。",
    sourceLabel: "SHOWROOMファンルーム",
    media: {
      kind: "image",
      src: "/media/news/mily-b13-01-fanroom-next-slot.jpg",
      width: 443,
      height: 313,
      alt: "SHOWROOMファンルームで朝枠へのお礼と次枠14:00を案内した、みりぃからの連絡",
    },
    message: {
      label: "みりぃからの連絡💌",
      text: "みなさーん！朝枠ありがとう😭❣️\n【次枠】\n14:00〜\n跨ぎ配信するぜーっ！\n皆様、一緒に楽しもう？！✨",
    },
  },
  {
    id: "2026-08-21-event-story-next-slot",
    date: "2026-08-21",
    activityIds: ["live-stream"],
    title: "寝起き配信ありがとう！次枠14:00〜❤️‍🔥",
    body: "8月21日のInstagram Storyで、みりぃが寝起き配信へのお礼を伝え、次枠14:00〜を案内しました。Story投稿時点では「現在5位」と報告し、ランウェイをかけたイベントに挑戦する理由についても伝えています。",
    sourceLabel: eventStory20260821.sourceLabel,
    url: "https://www.instagram.com/mily_chan36",
    ctaLabel: "Instagramプロフィールを見る",
    media: eventStory20260821,
    message: {
      label: "みりぃのメッセージ",
      text: "寝起き配信ありがとうございました〜❣️\nまさかの現在5位🥹💙\n【次枠】\n14:00〜",
    },
  },
  {
    id: "2026-08-21-morning-ohayo-story",
    date: "2026-08-21",
    title: "OHAYO! 👓 8/21朝のInstagram Story",
    body: "8月21日の朝、みりぃから「OHAYO!」のひとコマが届きました。メガネのフェイスフィルターとともに届けられた、朝の短い動画です。",
    sourceLabel: morningOhayo20260821.sourceLabel,
    url: "https://www.instagram.com/mily_chan36",
    ctaLabel: "Instagramプロフィールを見る",
    media: morningOhayo20260821,
    message: {
      label: "みりぃのメッセージ",
      text: "OHAYO!",
    },
  },
  {
    id: "2026-08-21-morning-showroom-runway",
    date: "2026-08-21",
    activityIds: ["live-stream"],
    title: "朝7:00からSHOWROOM配信📡❤️‍🔥",
    body: "8月21日の朝、みりぃが7:00からのSHOWROOM配信を案内しました。投稿では、26日までランウェイをかけたイベントに参加していることを伝え、応援を呼びかけています。",
    source: morningShowroomRunwayVideo.sourceUrl,
    sourceLabel: "Xの投稿を見る",
    media: morningShowroomRunwayVideo,
    message: {
      label: "みりぃの投稿",
      text: "おはよ〜🔅\n今日も一緒に頑張ろうねん\n\n7:00〜SHOWROOMにて配信しますよっ！\n26日までガチイベ中で、ランウェイかけて配信しております🛜❤️‍🔥\n待ってる〜！\n\n応援よろしくお願いいたします🥺\n\n⬇️昨日の動画🎥\n#ミスサー #ミスサークルコンテスト2026 #ミスサークル #ミスサークルコンテスト",
    },
  },
  {
    id: "2026-08-20-mango-kakigori",
    date: "2026-08-20",
    title: "今年初のマンゴーかき氷🍧🥭",
    body: "今年初のかき氷を楽しんだことを、みりぃがInstagramで紹介しました。マンゴーのかき氷にヨーグルトとはちみつがかかり、コムハニーもトッピングされています。",
    source: "https://www.instagram.com/p/DcQqmIwk1_l/",
    sourceLabel: "Instagramの投稿を見る",
    media: {
      kind: "image",
      src: "/media/news/mily-b10-05-mango-kakigori-front.jpg",
      width: 960,
      height: 1280,
      alt: "マンゴーかき氷を前にスプーンを持ってカメラを見るみりぃ",
    },
  },
  {
    id: "2026-08-20-morning-message",
    date: "2026-08-20",
    title: "おはよう‼︎🌞 無理せず、今日も一緒に",
    body: "8月20日の朝、みりぃがXに投稿しました。「今日も自分のできることを無理せず」と伝え、「私もみんなと一緒に頑張るね」という言葉を届けています。",
    source: "https://x.com/mily_chan36/status/2090242507586322892",
    sourceLabel: "Xの投稿を見る",
    media: {
      kind: "image",
      src: "/media/news/mily-b08-01-do-what-you-can-morning.jpg",
      width: 1538,
      height: 2048,
      alt: "室内の鏡の前でスマートフォンを持って撮影するみりぃ",
    },
    message: {
      label: "みりぃの投稿",
      text: "おはよう‼︎🌞\n今日も自分のできることを無理せず。\n私もみんなと一緒に頑張るね🙂‍↕️\n#ミスサー #ミスサークルコンテスト #ミスサー2026 #ミスサークルコンテスト2026 #ミスサークル2026",
    },
  },
  {
    id: "2026-08-20-morning-story",
    date: "2026-08-20",
    title: "おはよう☀️ 今日も自分ができることを〜♪",
    body: "8月20日の朝、みりぃからInstagram Storyが届きました。「今日も自分ができることを〜♪」という言葉とともに、「おはよう」のひとコマです。",
    sourceLabel: morningStory20260820.sourceLabel,
    media: morningStory20260820,
    message: {
      label: "みりぃのメッセージ",
      text: "8/20 (木) 今日も自分ができることを〜♪",
    },
  },
  {
    id: "2026-08-19-second-round-result",
    date: "2026-08-19",
    activityIds: ["miss-circle"],
    title: "MISS CIRCLE CONTEST 2026 2次審査通過！三次審査進出へ✨",
    body: "みりぃが「MISS CIRCLE CONTEST 2026」の2次審査通過と、三次審査への進出を報告しました。毎日の投票やSHOWROOMでの応援への感謝とともに、「一緒に絶景観に行きましょう」とこれからの挑戦への言葉を届けています。",
    source: "https://x.com/Mily_chan36/status/2089996508691390948",
    sourceLabel: "Xの投稿を見る",
    url: "/stories/second-round-result-2026/",
    ctaLabel: "2次審査通過の記録を読む",
  },
  {
    id: "2026-08-19-well-rested-morning",
    date: "2026-08-19",
    title: "体調回復❤️‍🩹 元気に朝のごあいさつ☀️",
    body: "しっかり眠れて体調が回復したことを、みりぃが朝のX投稿で報告しました。心配してくれたみんなへのお礼と、「今日もみんなと一緒に頑張るぞぃ〜〜🍀」という言葉が届いています。",
    source: "https://x.com/Mily_chan36/status/2089841199280742669",
    sourceLabel: "Xの投稿を見る",
    media: {
      kind: "image",
      src: "/media/news/mily-b06-01-recovery-morning.jpg",
      width: 1162,
      height: 2048,
      alt: "ウインクしてピースするみりぃの自撮り。動物フィルターと朝のあいさつ文字入り",
    },
    message: {
      label: "みりぃの投稿",
      text: "おはよう〜☀️\n体調回復❤️‍🩹\nしっかり寝ました！！！\n\nみんな心配ありがとう🥹❣️\n今日もみんなと一緒に頑張るぞぃ〜〜🍀\n\n#ミスサー #ミスサークル #ミスサークルコンテスト #ミスサー2026 #ミスサークル2026 #ミスサークルコンテスト2026 #ミスコン",
    },
  },
  {
    id: "2026-08-18-evening-radio",
    date: "2026-08-18",
    activityIds: ["radio", "live-stream"],
    title: "ラジオ配信ありがとうございました",
    body: "体は本調子ではないなかでもラジオ配信を届けてくれたみりぃから、見に来てくれた人へのお礼が届きました。翌日の配信は夜になる予定で、時間は当日改めて伝えるとのこと。",
    source: "https://x.com/Mily_chan36/status/2089721650522820667",
    sourceLabel: "Xの投稿を見る",
    url: "/stories/2026-08-18-radio/",
    ctaLabel: "配信の記録を読む",
  },
  {
    id: "2026-08-18-morning-update",
    date: "2026-08-18",
    activityIds: ["live-stream"],
    title: "おはよう〜☀️ 10:50〜11:30配信予定",
    body: "「リビングで寝なかったよ😳（成長を感じるね）」から始まった朝の投稿。今日は大学の友達との予定の前に、10:50〜11:30まで配信予定。ビギナーイベントにも参加中です。",
    sourceLabel: "みりぃからの連絡💌",
    url: "https://www.showroom-live.com/r/circle2026_0734",
    ctaLabel: "SHOWROOMで応援する",
    media: {
      kind: "video",
      src: "/media/gallery/mily-b04-01-morning-showroom-ios.mp4",
      poster: "/media/gallery/mily-b04-01-morning-showroom-poster.jpg",
      width: 160,
      height: 284,
      alt: "朝の配信画面でピースをしながらウインクするみりぃの動画",
    },
    message: {
      label: "みりぃのメッセージ",
      text: "昨日は高校の友達。今日は大学の友達と予定があるから、【10:50〜11:30】まで配信しようかと思ってるよ〜‼️ ビギナーイベントも参加してみたの！！！ 気軽に遊びに来てね🍀✨ ぜひキラ星から応援お願いいたします🥺🙌🏻",
    },
  },
  {
    id: "2026-08-17-morning-story",
    date: "2026-08-17",
    title: "おはよう☀️ 朝のストーリー",
    body: "猫耳フィルターで「OHAYO!!」。みりぃから届いた朝のひとコマ。",
    sourceLabel: morningStoryVideo.sourceLabel,
    media: morningStoryVideo,
    message: {
      label: "みりぃのメッセージ",
      text: "8/17（月）今日からお仕事が始まる皆さん応援して…",
    },
  },
  {
    id: "2026-08-02-21st-birthday",
    date: "2026-08-02",
    title: "21歳の誕生日を迎えました",
    body: "21歳の誕生日。お祝いしてくれたみなさんへの感謝と、「考えていることを脳内に留めず行動に移す。」という21歳の抱負。",
    source: "https://www.instagram.com/p/DbiY3PHk1c8/",
    ctaLabel: "Instagramの投稿を見る",
  },
];

export function sortNewsByDateDesc(items: NewsItem[]): NewsItem[] {
  return items
    .map((item, sourceIndex) => ({ item, sourceIndex }))
    .sort((a, b) => {
      const byDate = b.item.date.localeCompare(a.item.date);
      if (byDate !== 0) return byDate;

      const bySameDayOrder =
        (b.item.sameDayOrder ?? 0) - (a.item.sameDayOrder ?? 0);
      if (bySameDayOrder !== 0) return bySameDayOrder;

      return a.sourceIndex - b.sourceIndex;
    })
    .map(({ item }) => item);
}
