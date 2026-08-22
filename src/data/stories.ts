import { secondRoundStoryVideo } from "./secondRoundStoryVideo.ts";
import { campusGirlsSecondStageResultImage } from "./campusGirlsSecondStageResultImage.ts";

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
  media: [campusGirlsSecondStageResultImage],
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

export const stories: Story[] = [
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
