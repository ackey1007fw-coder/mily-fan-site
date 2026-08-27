import { campusGirlsPatonVoteLink } from "./links.ts";

/**
 * 2026-08-27 本人XのCAMPUS GIRLS 2027 Paton投票方法案内。
 * 動画はX上で視聴する。自己ホストしない（X動画の自動取得禁止、
 * 画面内の他出場者・順位・オーナーサポーター名）。
 */
export const PATON_VOTE_HOW_TO_NEWS_ID = "2026-08-27-paton-vote-how-to";
export const PATON_VOTE_HOW_TO_X_URL =
  "https://x.com/mily_chan36/status/2092793734232748228";
export const PATON_VOTE_HOW_TO_ANCHOR_ID = "paton-vote-guide";
export const PATON_VOTE_HOW_TO_SOURCE_LABEL = "Xの投票方法動画を見る";
export const PATON_VOTE_HOW_TO_TITLE = "キャンガル2027 パトン投票方法🗳️✨";
export const PATON_VOTE_HOW_TO_CTA_LABEL = campusGirlsPatonVoteLink.label;
export const PATON_VOTE_HOW_TO_CTA_URL = campusGirlsPatonVoteLink.url;

export const patonVoteHowToSpokenMessage = [
  "キャンガルパトン投票のやり方",
  "まずはキャンパスガールズ2027をタップ",
  "そして私を見つけてタップ",
  "次に右下のギフトをタップ",
  "一日一回無料拍手を送信",
  "これで投票完了です",
  "応援コメントも待ってるよー",
  "九月一日までどうぞよろしくお願いいたします",
].join("\n");

export const patonVoteHowToSteps = [
  { step: 1, text: "キャンパスガールズ2027をタップ" },
  { step: 2, text: "三橋莉子（みりぃ）を見つけてタップ" },
  { step: 3, text: "右下のギフトをタップ" },
  { step: 4, text: "1日1回無料拍手を送信" },
] as const;
