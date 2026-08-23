import { secondRoundStoryVideo } from "./secondRoundStoryVideo.ts";
import { campusGirlsSecondStageResultImage } from "./campusGirlsSecondStageResultImage.ts";
import { campusGirlsSecondStageInstagramStoryImage } from "./campusGirlsSecondStageInstagramStoryImage.ts";
import { seasideCircleMusicalSpecialVideo } from "./seasideCircleMusicalSpecialVideo.ts";

export const storySources = {
  "pre-final-message": {
    id: "pre-final-message",
    label: "最終配信前に届けられた本人メッセージ",
  },
  "completion-message": {
    id: "completion-message",
    label: "2次審査完走後に届けられた本人メッセージ",
  },
  "final-stream-video": {
    id: "final-stream-video",
    label: "最終配信時に届けられた本人動画",
  },
  "x-2026-08-18-radio": {
    id: "x-2026-08-18-radio",
    label: "本人X投稿（2026年8月18日）",
    url: "https://x.com/Mily_chan36/status/2089721650522820667",
  },
  // 受け渡し用のGoogle Docs URLは持たせず、非リンクのlabelとして出す。
  "broadcast-transcript-2026-08-23": {
    id: "broadcast-transcript-2026-08-23",
    label:
      "2026年8月23日 湘南シーサイドサークル 生放送アーカイブ文字起こし（オーナー提供）",
  },
  // 恒久的な公開permalinkがない番組Instagram Story。推測URLは持たせない。
  "program-instagram-story-2026-08-23": {
    id: "program-instagram-story-2026-08-23",
    label: "湘南シーサイドサークル Instagram Story（2026年8月23日）",
  },
  "x-2026-08-19-second-round-result": {
    id: "x-2026-08-19-second-round-result",
    label: "本人X投稿（2026年8月19日）",
    url: "https://x.com/Mily_chan36/status/2089996508691390948",
  },
  "x-2026-08-22-campus-girls-second-stage-result": {
    id: "x-2026-08-22-campus-girls-second-stage-result",
    label: "本人X投稿（2026年8月22日）",
    url: "https://x.com/mily_chan36/status/2090988000813654232",
  },
  // 恒久的な公開permalinkがないStory。プロフィールURLで代用しない。
  "instagram-story-2026-08-22-campus-girls-second-stage-result": {
    id: "instagram-story-2026-08-22-campus-girls-second-stage-result",
    label: "Instagram Story（2026年8月22日）",
  },
  // 恒久的な公開permalinkがないStory。URLは持たせず、非リンクのlabelとして出す。
  "instagram-story-2026-08-19-second-round-result": {
    id: "instagram-story-2026-08-19-second-round-result",
    label: "本人Instagram Story（2026年8月19日）",
  },
  "misscircle-2026-third-round-post": {
    id: "misscircle-2026-third-round-post",
    label: "MISS CIRCLE CONTEST 公式発表（2026年8月19日）",
    url: "https://x.com/circle_contest/status/2089986551346573523",
  },
  "misscircle-2026-third-round-list": {
    id: "misscircle-2026-third-round-list",
    label: "MISS CIRCLE CONTEST 2026 三次審査進出者一覧",
    url: "https://2026.misscircle.jp/list/3",
  },
  "misscircle-2026-entry-734": {
    id: "misscircle-2026-entry-734",
    label: "MISS CIRCLE CONTEST 2026 ENTRY 734 プロフィール",
    url: "https://2026.misscircle.jp/entry/734",
  },
} as const;

export type StorySourceId = keyof typeof storySources;

export type StoryMedia =
  | {
      id: string;
      kind: "image";
      src: string;
      alt: string;
      caption: string;
      /** Intrinsic size, when known. Reserves space so tall photos do not shift the layout. */
      width?: number;
      height?: number;
    }
  | {
      id: string;
      kind: "video";
      src: string;
      /** Poster taken from a real frame of that MP4, when one exists. */
      poster?: string;
      width: number;
      height: number;
      label: string;
      caption: string;
    };

export type StoryBlock =
  | {
      type: "paragraph";
      text: string;
      sourceIds: StorySourceId[];
    }
  | {
      type: "quote";
      paragraphs: string[];
      sourceIds: StorySourceId[];
    }
  | {
      type: "media";
      mediaId: string;
      sourceIds: StorySourceId[];
    };

export type StorySection = {
  id: string;
  title: string;
  blocks: StoryBlock[];
};

export type Story = {
  slug: string;
  href: string;
  title: string;
  cardTitle: string;
  eyebrow: string;
  lead: string;
  cardDescription: string;
  date: string;
  dateLabel: string;
  /** Optional short label shown on the card, e.g. a confirmed milestone. */
  badge?: string;
  published: boolean;
  sourceIds: StorySourceId[];
  leadMediaId: string | null;
  media: StoryMedia[];
  sections: StorySection[];
};

const radioStory: Story = {
  slug: "2026-08-18-radio",
  href: "/stories/2026-08-18-radio/",
  title: "「元気なみりぃに会いにきてね」——8月18日のラジオ配信",
  cardTitle: "「元気なみりぃに会いにきてね」——8月18日のラジオ配信",
  eyebrow: "ラジオ配信の記録",
  lead:
    "8月18日、体は本調子ではないなかでもラジオ配信を届けてくれたみりぃ。見に来てくれた人へのお礼と、翌日の配信について、本人のXに投稿がありました。",
  cardDescription:
    "体は本調子ではないなかでもラジオ配信を届けてくれた夜。見に来てくれた人へのお礼と、「元気なみりぃに会いにきてね」という言葉。",
  date: "2026-08-18",
  dateLabel: "2026.08.18",
  published: true,
  sourceIds: ["x-2026-08-18-radio"],
  leadMediaId: null,
  media: [],
  sections: [
    {
      id: "thanks",
      title: "ラジオ配信、ありがとうございました",
      blocks: [
        {
          type: "paragraph",
          text: "8月18日、みりぃはラジオ配信を届けてくれました。体は本調子ではないなかでも、見に来てくれた人へのお礼を本人の言葉で残しています。",
          sourceIds: ["x-2026-08-18-radio"],
        },
        {
          type: "quote",
          paragraphs: [
            "大元は元気なのに、体だけが追いつかない状況下のラジオ配信ありがとうございました🥲🙌🏻🩵",
          ],
          sourceIds: ["x-2026-08-18-radio"],
        },
      ],
    },
    {
      id: "self-care",
      title: "体調管理は自分で",
      blocks: [
        {
          type: "paragraph",
          text: "本人も、体調管理を意識していると書いています。",
          sourceIds: ["x-2026-08-18-radio"],
        },
        {
          type: "quote",
          paragraphs: ["体調管理はね？自分でしていかないと。"],
          sourceIds: ["x-2026-08-18-radio"],
        },
      ],
    },
    {
      id: "next-stream",
      title: "翌日の配信は夜になる予定",
      blocks: [
        {
          type: "paragraph",
          text: "8月19日の配信は夜になる予定で、時間は当日改めて伝えるとしています。",
          sourceIds: ["x-2026-08-18-radio"],
        },
        {
          type: "quote",
          paragraphs: [
            "明日の配信時間はまた明日伝えるよ〜！\nちなみに夜になると思う🥺",
          ],
          sourceIds: ["x-2026-08-18-radio"],
        },
        {
          type: "paragraph",
          text: "最後は、この言葉でした。",
          sourceIds: ["x-2026-08-18-radio"],
        },
        {
          type: "quote",
          paragraphs: ["元気なみりぃに会いにきてね~‼︎"],
          sourceIds: ["x-2026-08-18-radio"],
        },
      ],
    },
  ],
};

const secondRoundStory: Story = {
  slug: "second-round-2026",
  href: "/stories/second-round-2026/",
  title:
    "「一緒に絶景観に行こう！！」——みりぃ、初めてのガチイベで2次審査を完走",
  cardTitle: "「一緒に絶景観に行こう」——2次審査を走り切った夜",
  eyebrow: "MISS CIRCLE CONTEST 2026｜2次審査の記録",
  lead:
    "8月1日、SHOWROOM配信を始めたみりぃ。8月16日、初めての「ガチイベ」として向き合った2次審査を完走。「配信を切りたくない」と思えた最終日と、応援への感謝、「自信を持つこと」への一歩。",
  cardDescription:
    "「配信を切りたくない」と思えた最終日。8月1日の配信開始から、2次審査完走後に届けた感謝と「自信を持つこと」への一歩をたどります。",
  date: "2026-08-16",
  dateLabel: "2026.08.16",
  published: true,
  sourceIds: ["pre-final-message", "completion-message", "final-stream-video"],
  leadMediaId: "final-stream-video",
  media: [
    {
      id: "final-stream-video",
      kind: "video",
      src: "/media/stories/second-round-2026/mily-second-round-final-message.mp4",
      width: 720,
      height: 1280,
      label: "最終配信時に届けられた本人メッセージ動画",
      caption: "最終配信時に届けられた本人メッセージ動画。",
    },
    {
      id: "pre-final-message",
      kind: "image",
      src: "/media/stories/second-round-2026/mily-second-round-final-stream-message-public.png",
      alt: "8月1日からの配信と2次審査期間を振り返る、最終配信前のみりぃのメッセージ",
      caption:
        "2次審査最終日。8月1日に始めた配信や、期間中の出逢いを振り返りながら、最後の配信を知らせた。",
    },
    {
      id: "completion-message",
      kind: "image",
      src: "/media/stories/second-round-2026/mily-second-round-complete-message-public.png",
      alt: "2次審査の完走と応援への感謝、自信を持つことへの一歩を伝えるみりぃのメッセージ",
      caption:
        "2次審査を走り終えたあと、みりぃが届けた感謝と「自信を持つこと」への言葉。",
    },
  ],
  sections: [
    {
      id: "showroom-start",
      title: "8月1日、SHOWROOM配信スタート",
      blocks: [
        {
          type: "paragraph",
          text: "2次審査への挑戦をきっかけに、みりぃがSHOWROOM配信を始めたのは8月1日。",
          sourceIds: ["pre-final-message"],
        },
        {
          type: "paragraph",
          text: "何もわからないところから、配信で出逢った人たちに教わりながら、8月16日の最終日まで毎日配信を続けました。",
          sourceIds: ["pre-final-message"],
        },
        {
          type: "paragraph",
          text: "配信を始めるまでのことを、本人はこう振り返っています。",
          sourceIds: ["pre-final-message"],
        },
        {
          type: "quote",
          paragraphs: [
            "ずーーーっと配信するか悩んでいた私ですが、2次審査に挑戦して、配信を始めてよかった。",
          ],
          sourceIds: ["pre-final-message"],
        },
        {
          type: "paragraph",
          text: "8月8日に投票が始まり、8月9日以降の配信では、初日からルームに来ていた人たちに加えて、2次審査の期間中に新しく出逢えた人もいました。",
          sourceIds: ["pre-final-message"],
        },
        {
          type: "paragraph",
          text: "最終配信を前に届けたのは、こんなひと言でした。",
          sourceIds: ["pre-final-message"],
        },
        {
          type: "quote",
          paragraphs: ["最後まで、一緒に楽しみましょう〜😽✨"],
          sourceIds: ["pre-final-message"],
        },
        {
          type: "media",
          mediaId: "pre-final-message",
          sourceIds: ["pre-final-message"],
        },
      ],
    },
    {
      id: "final-stream",
      title: "「配信を切りたくない」と思えた最終日",
      blocks: [
        {
          type: "paragraph",
          text: "8月16日の最終配信。",
          sourceIds: ["final-stream-video"],
        },
        {
          type: "paragraph",
          text: "画面いっぱいのアバターに囲まれながら、みりぃは「8/16（日） 2次イベントありがとう♡」と書いたホワイトボードを手にしていました。",
          sourceIds: ["final-stream-video"],
        },
        {
          type: "paragraph",
          text: "配信を終えたあとに届けられた動画には、こんな言葉が残されています。",
          sourceIds: ["final-stream-video"],
        },
        {
          type: "quote",
          paragraphs: [
            "ほんっとうに皆様のおかげ。",
            "私、初めは配信することすら迷っていたんです。\nだからこんなに「配信を切りたくない」と思える日が来るとは思ってもいませんでした。",
          ],
          sourceIds: ["final-stream-video"],
        },
        {
          type: "paragraph",
          text: "始めるかどうかを迷っていた配信が、いつの間にか「切りたくない」と思える時間になっていました。",
          sourceIds: ["final-stream-video"],
        },
        {
          type: "quote",
          paragraphs: [
            "みなさんが暖かく迎え入れてくれて、応援してくれたおかげで楽しく配信することができています🥺💗",
          ],
          sourceIds: ["final-stream-video"],
        },
      ],
    },
    {
      id: "second-round-complete",
      title: "みんなのおかげで「2次完走」",
      blocks: [
        {
          type: "paragraph",
          text: "最終配信を終えたあと、みりぃから改めて感謝のメッセージが届きました。",
          sourceIds: ["completion-message"],
        },
        {
          type: "quote",
          paragraphs: [
            "みんなのおかげで無事に2次完走することができたよ🥺🫶🏻🩵\n本当にありがとう！！！！",
          ],
          sourceIds: ["completion-message"],
        },
        {
          type: "paragraph",
          text: "今回の2次審査は、本人が「初めてのガチイベ」と書いた挑戦でした。",
          sourceIds: ["completion-message"],
        },
        {
          type: "paragraph",
          text: "配信のことを周りに教えてもらいながら、最後までやり切ることができたと振り返っています。",
          sourceIds: ["completion-message"],
        },
        {
          type: "paragraph",
          text: "動画の中にも、毎日の投票への感謝が記されています。",
          sourceIds: ["final-stream-video"],
        },
        {
          type: "quote",
          paragraphs: [
            "投票を毎日してくださった皆様、\n本当にありがとうございます🗳️‼",
          ],
          sourceIds: ["final-stream-video"],
        },
      ],
    },
    {
      id: "confidence",
      title: "「自信を持つこと」へ、一歩前進",
      blocks: [
        {
          type: "paragraph",
          text: "2次審査を通して、みりぃが目標にしていたことの一つが「自信を持つこと」でした。",
          sourceIds: ["completion-message"],
        },
        {
          type: "quote",
          paragraphs: [
            "目標にしていた『自信を持つこと』も、一歩前進できたよ🥺✨",
          ],
          sourceIds: ["completion-message"],
        },
        {
          type: "media",
          mediaId: "completion-message",
          sourceIds: ["completion-message"],
        },
        {
          type: "paragraph",
          text: "応援に背中を押され、「自分ならできる」と信じ続けられたから、最後まで前を向いて頑張ることができた。",
          sourceIds: ["completion-message"],
        },
        {
          type: "paragraph",
          text: "最後は、この言葉でした。",
          sourceIds: ["completion-message"],
        },
        {
          type: "quote",
          paragraphs: ["一緒に絶景観に行こう！！\n下剋上よっ🔥"],
          sourceIds: ["completion-message"],
        },
      ],
    },
  ],
};

const secondRoundResultStory: Story = {
  slug: "second-round-result-2026",
  href: "/stories/second-round-result-2026/",
  title: "MISS CIRCLE CONTEST 2026 2次審査通過！三次審査進出へ",
  cardTitle: "2次審査通過！三次審査進出へ",
  eyebrow: "MISS CIRCLE CONTEST 2026｜2次審査通過",
  badge: "2次審査通過",
  lead:
    "三橋莉子さんが「MISS CIRCLE CONTEST 2026」の2次審査を通過し、三次審査への進出を報告しました。8月8日から16日まで行われた2次審査を、WEB投票やSHOWROOMでの応援とともに完走。「一緒に絶景観に行きましょう」という言葉で、次の挑戦へ向かいます。",
  cardDescription:
    "2次審査を通過し、三次審査へ。毎日の投票とSHOWROOMでの応援に感謝を伝えた、8月19日の報告です。",
  date: "2026-08-19",
  dateLabel: "2026.08.19",
  published: true,
  sourceIds: [
    "x-2026-08-19-second-round-result",
    "instagram-story-2026-08-19-second-round-result",
    "misscircle-2026-third-round-post",
    "misscircle-2026-third-round-list",
    "misscircle-2026-entry-734",
  ],
  leadMediaId: "second-round-result-photo",
  media: [
    {
      id: "second-round-result-photo",
      kind: "image",
      src: "/media/stories/second-round-result-2026/mily-second-round-result-autumn-leaf.jpg",
      width: 1152,
      height: 2048,
      alt: "MISS CIRCLE CONTEST 2026の2次審査通過を報告した三橋莉子さん",
      caption: "夜の並木道で、大きな落ち葉を手にした一枚。",
    },
    {
      // Gallery の動画アーカイブと同じマニフェストを参照するので、記事側に
      // 用途別の MP4 / poster コピーができない。
      id: "second-round-result-story-video",
      kind: "video",
      src: secondRoundStoryVideo.src,
      poster: secondRoundStoryVideo.poster,
      width: secondRoundStoryVideo.width,
      height: secondRoundStoryVideo.height,
      label: "2次審査の通過を報告した本人のInstagram Story動画",
      caption:
        "2026年8月19日のInstagram Story。背景は上の一枚と同じ写真で、応援へのお礼とこれからについてのメッセージが重ねられている。",
    },
  ],
  sections: [
    {
      id: "second-round-result",
      title: "2次審査を通過し、三次審査へ",
      blocks: [
        {
          type: "paragraph",
          text: "三橋莉子さんが「MISS CIRCLE CONTEST 2026」の2次審査を通過し、三次審査への進出を報告しました。",
          sourceIds: [
            "x-2026-08-19-second-round-result",
            "misscircle-2026-third-round-post",
          ],
        },
        {
          type: "paragraph",
          text: "ENTRY 734として挑戦していた2次審査は、8月8日から16日まで。WEB投票やSHOWROOMを通じて多くの応援を受けながら、審査期間を完走しました。",
          sourceIds: [
            "misscircle-2026-entry-734",
            "x-2026-08-19-second-round-result",
          ],
        },
        {
          type: "paragraph",
          text: "主催者が公開している三次審査進出者の一覧にも、名前が掲載されています。",
          sourceIds: [
            "misscircle-2026-third-round-list",
            "misscircle-2026-third-round-post",
          ],
        },
      ],
    },
    {
      id: "thanks",
      title: "毎日の投票とSHOWROOMでの応援に",
      blocks: [
        {
          type: "paragraph",
          text: "投稿では、毎日の投票やSHOWROOMで応援してくれた皆さんへの感謝が、まっすぐな言葉で伝えられています。",
          sourceIds: ["x-2026-08-19-second-round-result"],
        },
        {
          type: "quote",
          paragraphs: [
            "2次審査通過✨\n毎日投票してくださったり、SRで応援してくださったおかげです🌈",
          ],
          sourceIds: ["x-2026-08-19-second-round-result"],
        },
      ],
    },
    {
      id: "instagram-story",
      title: "Instagram Storyでも通過を報告",
      blocks: [
        {
          type: "paragraph",
          text: "同じ日、本人のInstagram Storyでも2次審査の通過が報告されました。毎日の投票やSHOWROOMでの応援へのお礼と、これから越えていく壁について、本人の言葉がそのまま残されています。",
          sourceIds: ["instagram-story-2026-08-19-second-round-result"],
        },
        {
          type: "media",
          mediaId: "second-round-result-story-video",
          sourceIds: ["instagram-story-2026-08-19-second-round-result"],
        },
        {
          type: "paragraph",
          text: "Storyの終盤には、この言葉がありました。",
          sourceIds: ["instagram-story-2026-08-19-second-round-result"],
        },
        {
          type: "quote",
          paragraphs: ["私と一緒に美しい景色を観に行きましょう。絶対に。"],
          sourceIds: ["instagram-story-2026-08-19-second-round-result"],
        },
      ],
    },
    {
      id: "next-stage",
      title: "一歩ずつ、次のステージへ",
      blocks: [
        {
          type: "paragraph",
          text: "これから続いていく挑戦についても、本人の言葉が残されています。",
          sourceIds: ["x-2026-08-19-second-round-result"],
        },
        {
          type: "quote",
          paragraphs: [
            "これからも乗り越えるべき壁はたくさんあります。皆さんと一緒に一歩ずつ乗り越えていきたいです。",
          ],
          sourceIds: ["x-2026-08-19-second-round-result"],
        },
        {
          type: "paragraph",
          text: "最後は、この言葉でした。",
          sourceIds: ["x-2026-08-19-second-round-result"],
        },
        {
          type: "quote",
          paragraphs: [
            "皆さんが「応援してよかった」と思える人間に\nなってみせます。一緒に絶景観に行きましょう✊🏻🔥",
          ],
          sourceIds: ["x-2026-08-19-second-round-result"],
        },
        {
          type: "paragraph",
          text: "またひとつ次のステージへ進んだ、みりぃさん。これから続いていく挑戦も、一歩ずつ一緒に応援していきましょう。",
          sourceIds: ["x-2026-08-19-second-round-result"],
        },
      ],
    },
  ],
};

const campusGirlsSecondStageJuryAwardStory: Story = {
  slug: "campus-girls-2027-second-stage-jury-award",
  href: "/stories/campus-girls-2027-second-stage-jury-award/",
  title:
    "CAMPUS GIRLS 2027 予選A 2nd STAGE 審査員賞——予選ファイナル進出へ",
  cardTitle: "審査員賞を受賞——CAMPUS GIRLS 2027 予選ファイナルへ",
  eyebrow: "CAMPUS GIRLS 2027｜予選A 2nd STAGE",
  badge: "予選ファイナル進出",
  lead:
    "8月22日、みりぃ（三橋莉子）がCAMPUS GIRLS 2027 予選A 2nd STAGEで審査員賞を受賞し、予選ファイナルへの進出を報告しました。コンテストとの両立に難しさを感じながらも、「可能性を信じて、自分のできることを」と挑戦を続ける思いを届けています。",
  cardDescription:
    "予選A 2nd STAGEで審査員賞を受賞し、予選ファイナルへ。両立の難しさ、可能性を信じて進む思い、誰かの挑戦を後押ししたいという言葉を残した8月22日の記録です。",
  date: "2026-08-22",
  dateLabel: "2026.08.22",
  published: true,
  sourceIds: [
    "x-2026-08-22-campus-girls-second-stage-result",
    "instagram-story-2026-08-22-campus-girls-second-stage-result",
  ],
  leadMediaId: campusGirlsSecondStageResultImage.id,
  media: [
    campusGirlsSecondStageResultImage,
    campusGirlsSecondStageInstagramStoryImage,
  ],
  sections: [
    {
      id: "jury-award",
      title: "審査員賞を受賞、予選ファイナルへ",
      blocks: [
        {
          type: "paragraph",
          text: "8月22日、みりぃがCAMPUS GIRLS 2027 予選A 2nd STAGEで審査員賞を受賞し、予選ファイナルへ進出することを本人Xで報告しました。",
          sourceIds: ["x-2026-08-22-campus-girls-second-stage-result"],
        },
        {
          type: "paragraph",
          text: "結果グラフィックには、審査員賞の受賞者5名の一人として三橋莉子の名前と写真が掲載されています。",
          sourceIds: ["x-2026-08-22-campus-girls-second-stage-result"],
        },
      ],
    },
    {
      id: "balance",
      title: "両立の難しさの中で届いたチャンス",
      blocks: [
        {
          type: "paragraph",
          text: "本人はXで、両立に難しさを感じる中で得たチャンスへの感謝を伝えています。",
          sourceIds: ["x-2026-08-22-campus-girls-second-stage-result"],
        },
        {
          type: "quote",
          paragraphs: [
            "両立が難しいと感じている中、このようなチャンスをいただけたこと、とてもありがたく思います。",
          ],
          sourceIds: ["x-2026-08-22-campus-girls-second-stage-result"],
        },
        {
          type: "paragraph",
          text: "Instagram Storyでも、コンテストとの両立は難しく、思い通りにいかないこともあるという率直な思いを綴っています。何と何を両立しているかについては、投稿やStoryの中で具体名は示されていません。",
          sourceIds: [
            "instagram-story-2026-08-22-campus-girls-second-stage-result",
          ],
        },
      ],
    },
    {
      id: "believe",
      title: "「可能性を信じて」",
      blocks: [
        {
          type: "paragraph",
          text: "難しさについて記したあと、Instagram Storyでは次の言葉を続けています。",
          sourceIds: [
            "instagram-story-2026-08-22-campus-girls-second-stage-result",
          ],
        },
        {
          type: "quote",
          paragraphs: [
            "可能性を信じて、自分のできることをやれるだけやってみせます‼️",
          ],
          sourceIds: [
            "instagram-story-2026-08-22-campus-girls-second-stage-result",
          ],
        },
        {
          type: "media",
          mediaId: campusGirlsSecondStageInstagramStoryImage.id,
          sourceIds: [
            "instagram-story-2026-08-22-campus-girls-second-stage-result",
          ],
        },
      ],
    },
    {
      id: "encourage",
      title: "誰かが挑戦するきっかけに",
      blocks: [
        {
          type: "paragraph",
          text: "同じStoryには、自身の挑戦を見た誰かへ向けた言葉も残されています。",
          sourceIds: [
            "instagram-story-2026-08-22-campus-girls-second-stage-result",
          ],
        },
        {
          type: "quote",
          paragraphs: [
            "皆さんが何かに挑戦するきっかけの後押しになりますように。",
          ],
          sourceIds: [
            "instagram-story-2026-08-22-campus-girls-second-stage-result",
          ],
        },
      ],
    },
    {
      id: "preliminary-final",
      title: "予選ファイナルへ",
      blocks: [
        {
          type: "paragraph",
          text: "予選ファイナルへの進出を報告したX投稿を、次のステージへ向けた言葉で締めくくっています。",
          sourceIds: ["x-2026-08-22-campus-girls-second-stage-result"],
        },
        {
          type: "quote",
          paragraphs: ["もっとギア入れて頑張らせてください❣️✨"],
          sourceIds: ["x-2026-08-22-campus-girls-second-stage-result"],
        },
        {
          type: "paragraph",
          text: "またひとつ、みりぃの挑戦の記録が増えました。次のステージへ向かう本人の言葉を、この日の節目として残します。",
          sourceIds: [
            "x-2026-08-22-campus-girls-second-stage-result",
            "instagram-story-2026-08-22-campus-girls-second-stage-result",
          ],
        },
      ],
    },
  ],
};

const seasideCircleMusicalSpecialStory: Story = {
  slug: "2026-08-23-musical-special",
  href: "/stories/2026-08-23-musical-special/",
  title: "2026.08.23 湘南シーサイドサークル｜真夏のミュージカル特集 放送記録",
  cardTitle: "真夏のミュージカル特集｜清水美依紗さんを迎えた特別回",
  eyebrow: "湘南シーサイドサークル｜放送記録",
  badge: "RADIO",
  lead:
    "8月23日の「湘南シーサイドサークル」は、3時間にわたる「真夏のミュージカル特集」。前半には清水美依紗さんをスペシャルゲストに迎え、舞台、表現、夢への向き合い方までじっくり語りました。後半では、みりぃ自身のミュージカル映画との思い出も届けられました。",
  cardDescription:
    "清水美依紗さんを迎えた真夏のミュージカル特集。表現や夢の話と、みりぃが高校時代に『グレイテスト・ショーマン』から受け取った勇気を残した3時間です。",
  date: "2026-08-23",
  dateLabel: "2026.08.23",
  published: true,
  sourceIds: [
    "broadcast-transcript-2026-08-23",
    "program-instagram-story-2026-08-23",
  ],
  leadMediaId: "seaside-circle-musical-special-story",
  media: [
    {
      id: "seaside-circle-musical-special-story",
      kind: "video",
      src: seasideCircleMusicalSpecialVideo.src,
      poster: seasideCircleMusicalSpecialVideo.poster,
      width: seasideCircleMusicalSpecialVideo.width,
      height: seasideCircleMusicalSpecialVideo.height,
      label: "スタジオでヘッドホンをつけた3人が映る、湘南シーサイドサークルのInstagram Story動画",
      caption:
        "湘南シーサイドサークルのInstagram Story。真夏のミュージカル特集と、ゲストの清水美依紗さんを案内する縦型動画です。",
    },
  ],
  sections: [
    {
      id: "start",
      title: "真夏のミュージカル特集、スタート",
      blocks: [
        {
          type: "paragraph",
          text: "2026年8月23日 10:00〜13:00、FM湘南マジックウェイブの「湘南シーサイドサークル」は「真夏のミュージカル特集」をお届けしました。パーソナリティは師匠とMily（みりぃ）、ディレクターはカズボー。前半約2時間のスペシャルゲストは、歌手でミュージカル俳優の清水美依紗さんでした。",
          sourceIds: [
            "broadcast-transcript-2026-08-23",
            "program-instagram-story-2026-08-23",
          ],
        },
        {
          type: "paragraph",
          text: "劇場へまだ行ったことがない人にも楽しんでもらうことを意識した3時間で、名曲や楽しみ方、表現者としての歩みが語られました。多くのリスナーから質問や応援メッセージも届きました。",
          sourceIds: ["broadcast-transcript-2026-08-23"],
        },
      ],
    },
    {
      id: "path-to-musical",
      title: "清水美依紗さんがミュージカルへ進んだきっかけ",
      blocks: [
        {
          type: "paragraph",
          text: "もともと歌手を目指していた清水美依紗さんは、当時足りないと感じていた表現力を広げるために、高校卒業後にニューヨークでミュージカルを学びました。現地でミュージカルそのものに惹かれていき、いまの活動につながったと番組内で話しています。",
          sourceIds: ["broadcast-transcript-2026-08-23"],
        },
        {
          type: "paragraph",
          text: "留学中は、世界の才能や英語環境に圧倒された経験もあったといいます。厳しい時期を乗り越えながら学び続け、そのときのことを「根性」という言葉で短く振り返っていました。",
          sourceIds: ["broadcast-transcript-2026-08-23"],
        },
      ],
    },
    {
      id: "miss-saigon",
      title: "『ミス・サイゴン』と作品を背負う責任",
      blocks: [
        {
          type: "paragraph",
          text: "転機のひとつとして語られたのが、留学中にワシントンD.C.で観た『ミス・サイゴン』です。音楽と物語、俳優の表現に強く心を動かされたと話していました。",
          sourceIds: ["broadcast-transcript-2026-08-23"],
        },
        {
          type: "paragraph",
          text: "今回、自身が作品に向き合うなかで歴史背景も学んでいること、ベトナム戦争を扱う作品として、単なる憧れの役ではなく責任を感じていることも、番組内で伝えられました。",
          sourceIds: ["broadcast-transcript-2026-08-23"],
        },
      ],
    },
    {
      id: "first-musical",
      title: "初めてのミュージカル、どう楽しむ？",
      blocks: [
        {
          type: "paragraph",
          text: "初めて劇場へ行く人向けに、番組では楽しみ方のポイントも紹介されました。拍手のタイミングを細かく気にしすぎなくてよいこと、心が動いたときに自然に楽しむこと、周囲への最低限の配慮は大切であること。作品のカラーを取り入れた服装など、観劇前から楽しむ方法もあると話しています。",
          sourceIds: ["broadcast-transcript-2026-08-23"],
        },
        {
          type: "paragraph",
          text: "作品によっては学生料金やU25などの設定があること、初心者にはディズニー系作品や『サウンド・オブ・ミュージック』なども入りやすいことも、一般的な紹介として触れられました。",
          sourceIds: ["broadcast-transcript-2026-08-23"],
        },
      ],
    },
    {
      id: "wicked",
      title: "おすすめ映画『ウィキッド』",
      blocks: [
        {
          type: "paragraph",
          text: "清水美依紗さんがおすすめのミュージカル映画として挙げたのは『ウィキッド』です。以前から作品自体が好きだったこと、音楽が大きな魅力であること、エルファバとグリンダの関係性も見どころだと話していました。",
          sourceIds: ["broadcast-transcript-2026-08-23"],
        },
        {
          type: "paragraph",
          text: "日本語版とオリジナル版、それぞれに魅力があるという紹介も、番組内で短く共有されました。",
          sourceIds: ["broadcast-transcript-2026-08-23"],
        },
      ],
    },
    {
      id: "aim-actor",
      title: "「目指せアクター」——“あのね”だけで表現",
      blocks: [
        {
          type: "paragraph",
          text: "番組コーナー「目指せアクター」では、お題の一言「あのね」を、内緒話、自慢話、言い訳、説教、告白などの設定で、声とイントネーションだけを使って表現しました。",
          sourceIds: ["broadcast-transcript-2026-08-23"],
        },
        {
          type: "paragraph",
          text: "清水美依紗さんによる実演もあり、声の高さ、間、息遣いなどで印象が変わることにメンバーが驚いていました。スタジオには「先生が現れた」と喜ぶ空気も、短く残っています。",
          sourceIds: ["broadcast-transcript-2026-08-23"],
        },
      ],
    },
    {
      id: "eponine",
      title: "『レ・ミゼラブル』エポニーヌ役の裏側",
      blocks: [
        {
          type: "paragraph",
          text: "清水美依紗さんが演じたエポニーヌについて、番組では役作りが深掘りされました。「悲しい役だから悲しく演じる」だけではない、という向き合い方が語られています。",
          sourceIds: ["broadcast-transcript-2026-08-23"],
        },
        {
          type: "paragraph",
          text: "悲しみに抗うこと、死に向かうのではなく生きようとすること、怒りや力強さも持っていること。有名な役だからこそ既存のイメージに縛られそうになった一方で、自分自身のルーツや個性を大切にすることを学んだ、と話していました。演じる人によってそれぞれのエポニーヌがある、という考えも紹介されました。",
          sourceIds: ["broadcast-transcript-2026-08-23"],
        },
      ],
    },
    {
      id: "on-my-own",
      title: "「On My Own」をどう捉えていたか",
      blocks: [
        {
          type: "paragraph",
          text: "「On My Own」についても、単なる「報われない恋の悲しい曲」だけではない、という見方が語られました。曲の中でエポニーヌ自身が自分の感情に気づいていき、「自分はマリウスを愛している」と発見していく曲として捉えていた、と清水美依紗さんは話しています。曲中で感情が変化していく、という捉え方でした。",
          sourceIds: ["broadcast-transcript-2026-08-23"],
        },
      ],
    },
    {
      id: "dreams",
      title: "夢を叶えるために大切なこと",
      blocks: [
        {
          type: "paragraph",
          text: "番組内でも特に印象的だったのが、夢を叶えるために大切なことについての話です。清水美依紗さんが挙げたのは、「やりたいことを人に言ってみること」という考えでした。",
          sourceIds: ["broadcast-transcript-2026-08-23"],
        },
        {
          type: "quote",
          paragraphs: ["やりたいことを人に言ってみること"],
          sourceIds: ["broadcast-transcript-2026-08-23"],
        },
        {
          type: "paragraph",
          text: "「こんなことをやってみたい」と人に話すと、それが人から人へ伝わることがある。思いがけない縁やチャンスにつながる場合もある、と話していました。必ず叶えなければならないと自分を追い込みすぎる必要はなく、挑戦が怖くなる経験をしながらも、挑戦は成長につながった、という趣旨でした。",
          sourceIds: ["broadcast-transcript-2026-08-23"],
        },
      ],
    },
    {
      id: "mily-reflection",
      title: "ゲストトークを終えたみりぃの振り返り",
      blocks: [
        {
          type: "paragraph",
          text: "清水美依紗さんが退出した12時台、メンバーが約2時間のゲストトークを振り返りました。みりぃは、自分も大学3年生で人生の岐路に立っていること、夢を追いながら活動し、実現してきた本人を目の前にして話を聞けたこと、今の自分に刺さる話がたくさんあったことを、番組内で語っています。",
          sourceIds: ["broadcast-transcript-2026-08-23"],
        },
        {
          type: "paragraph",
          text: "大学3年生としてこれからの道を考える時期にいるみりぃにとって、夢を追いながら挑戦を続けてきた本人から直接話を聞けたことは、強く心に残る時間になったようです。",
          sourceIds: ["broadcast-transcript-2026-08-23"],
        },
      ],
    },
    {
      id: "greatest-showman",
      title: "みりぃと『グレイテスト・ショーマン』",
      blocks: [
        {
          type: "paragraph",
          text: "12時台、みりぃが好きなミュージカル映画として紹介したのは『グレイテスト・ショーマン』でした。高校生の頃、吹奏楽で作品の楽曲を演奏する機会があり、「曲に出会ったのだから映画も見てみよう」と思って観た、と話しています。",
          sourceIds: ["broadcast-transcript-2026-08-23"],
        },
        {
          type: "paragraph",
          text: "当時のみりぃには、自分に自信を持てない時期があり、周りからどう見られるかを気にしていたこと、自分のやっていることに誇りを持てない気持ちもあったと振り返りました。作品を通して、周りの目よりも、もっと大切にするべきものがある、ということに気づかされた趣旨を語っています。",
          sourceIds: ["broadcast-transcript-2026-08-23"],
        },
      ],
    },
    {
      id: "this-is-me",
      title: "「This Is Me」にもらった勇気",
      blocks: [
        {
          type: "paragraph",
          text: "劇中の「This Is Me」にも強く惹かれたと、みりぃは話しました。高校へ行くのが少しつらいと感じる朝にも、『グレイテスト・ショーマン』の楽曲を聴きながら登校し、前向きになる勇気をもらっていたといいます。",
          sourceIds: ["broadcast-transcript-2026-08-23"],
        },
        {
          type: "paragraph",
          text: "みりぃ自身は、ただ強い人の歌というより、弱い部分を持ちながらも前を向こうとして自分に言い聞かせている面もあるのでは、と考えていた、と番組内で述べています。",
          sourceIds: ["broadcast-transcript-2026-08-23"],
        },
      ],
    },
    {
      id: "movies-and-next",
      title: "ミュージカルから映画へ",
      blocks: [
        {
          type: "paragraph",
          text: "番組終盤では、『グリース』、『魔法にかけられて』、『ダンスウィズミー』など、ミュージカル映画の話題がさらに広がりました。",
          sourceIds: ["broadcast-transcript-2026-08-23"],
        },
        {
          type: "paragraph",
          text: "次回テーマは「映画」。今回と同じメンバーで放送予定であることが、番組内で案内されました。",
          sourceIds: ["broadcast-transcript-2026-08-23"],
        },
      ],
    },
    {
      id: "closing",
      title: "真夏の3時間を閉じる",
      blocks: [
        {
          type: "paragraph",
          text: "清水美依紗さんから聞いた「表現」「挑戦」「夢」の話と、みりぃ自身の高校時代や今の思いが重なった、真夏のミュージカル特集となりました。",
          sourceIds: [
            "broadcast-transcript-2026-08-23",
            "program-instagram-story-2026-08-23",
          ],
        },
      ],
    },
  ],
};

export const stories: Story[] = [
  seasideCircleMusicalSpecialStory,
  campusGirlsSecondStageJuryAwardStory,
  secondRoundResultStory,
  radioStory,
  secondRoundStory,
];

export function visibleStories(): Story[] {
  return stories.filter((story) => story.published);
}

export function storyBySlug(slug: string): Story | undefined {
  return stories.find((story) => story.slug === slug && story.published);
}
