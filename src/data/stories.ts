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
} as const;

export type StorySourceId = keyof typeof storySources;

export type StoryMedia =
  | {
      id: string;
      kind: "image";
      src: string;
      alt: string;
      caption: string;
    }
  | {
      id: string;
      kind: "video";
      src: string;
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
  published: boolean;
  sourceIds: StorySourceId[];
  leadMediaId: string | null;
  media: StoryMedia[];
  sections: StorySection[];
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

export const stories: Story[] = [secondRoundStory];

export function visibleStories(): Story[] {
  return stories.filter((story) => story.published);
}

export function storyBySlug(slug: string): Story | undefined {
  return stories.find((story) => story.slug === slug && story.published);
}
