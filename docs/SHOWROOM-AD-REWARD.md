# 広告視聴ボーナス抽選の案内

- 依頼範囲: 2026-09-27、指定URLへの導線と初心者向け説明をHOME / Supportに追加。
- 操作先: https://www.showroom-live.com/lottery/ad_reward/2
- 出典: https://www.showroom-live.com/lottery/list（2026-09-27確認）。広告視聴でShow Gold、レインボースター、星ギフトが当たる。公式記載の利用枠は03:00〜14:55 / 15:00〜翌02:55、各最大6回、計12回。
- 回数・景品等は確認時点の条件。利用時の公式画面を優先する注記と確認日を表示。
- 広告視聴・獲得だけで本人へ自動送信されると誤解させず、「獲得→配信で贈る」を説明。Show Gold購入を伴う別の抽選へ案内しない。
- 特定の当選額、確率、イベント換算率、全員同じ賞品、無期限を保証しない。
- 外部リンクのみ。広告埋め込み、自動視聴、自動抽選、自動ギフト、追跡や新規常駐なし。本人写真・既存予定・サイト全体のサイズ設定は変更しない。
- 表示は `src/components/ShowroomAdRewardGuide.tsx`、条件・出典は `src/data/showroomAdReward.ts`、回帰検査は `scripts/showroom-ad-reward.test.mjs`。
- ローカル/CI/表示/公開の検証結果はPRへ別途記録する。この文書自体は検証完了の主張ではない。
