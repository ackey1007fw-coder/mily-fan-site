import { socials } from "../data/socials.ts";
import { missCircleFourthRoundWebVote } from "../data/supportEvents.ts";
import { displayStatus } from "./supportCalendar.ts";

export type DailyVoteGuide = {
  dailyLabel: string;
  deadline: string;
  benefitNote: string;
  ruleNote: string;
  contacts: { id: string; label: string; url: string }[];
  announcement: { label: string; url: string };
  dailySource: { label: string; url: string };
};

/** 本人提供の投票方法・特典案内。主催者の投票ルールと混同しない。 */
export function fourthRoundDailyVote(now: number): DailyVoteGuide | null {
  const { schedule } = missCircleFourthRoundWebVote;
  if (schedule.state !== "confirmed-period" || displayStatus(schedule, now) !== "live") return null;
  const end = new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo", year: "numeric", month: "long", day: "numeric",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).format(new Date(schedule.end));
  return {
    dailyLabel: "本人の案内：毎日1日1回、WEB投票をお願いします",
    deadline: `${end}（日本時間）まで`,
    benefitNote: "12日まで毎日投票した方へ、本人から「コンプリートありがとう動画」（1人ずつ別の動画）の案内があります。報告先は後日案内とのこと。最新の本人案内をご確認ください。",
    ruleNote: "投票回数・手順は公式投票画面をご確認ください。特典の条件・報告方法は本人の案内をご確認ください。",
    contacts: socials.filter(({ id, confirmed }) => confirmed && (id === "x-mily-chan36" || id === "instagram-mily-chan36"))
      .map(({ id, platform, label, url }) => ({ id, label: platform === "x" ? `本人のXで最新案内を確認 ${label}` : `Instagramで本人に確認 ${label}`, url })),
    announcement: { label: "本人の連続投票特典の告知を見る", url: "https://x.com/Mily_chan36/status/2105843753768612039" },
    dailySource: { label: "本人の投票方法案内", url: "https://x.com/Mily_chan36/status/2105854169433464969" },
  };
}
