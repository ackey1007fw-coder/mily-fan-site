# Mily Signal | データ分析ページ運用

## 入口と公開範囲

- ファンサイト内の独立した読み物ページ: `/data-lab/`
- 公開ファイル: `public/data-lab/index.html`、`assets/`、`data/`
- ナビゲーション: `src/lib/dataLabRoute.ts` → `src/lib/navigation.ts`
- HOMEの導線: `src/components/DataLabGateway.tsx` → `src/App.tsx`
- 外部の非公開分析システムとは**接続しない**。非公開URL・認証情報・個人別貢献記録・録画・コメント・DM・収集ログを公開コードへ持ち込まない。

## データ正本と根拠

2026-10-12にオーナーの個人Google Driveから取得した一般公開用ZIP（`MILY_SIGNAL_public_site_v1.zip`）を、最小限のリンク・タイトル変更のみ行って移植。学校Driveは不使用。オリジナルZIP自体は公開repoへ入れない。

- 公式進出者70人: https://2026.misscircle.jp/list/4
- 本人Entry 734: https://2026.misscircle.jp/entry/734
- SHOWROOM四次審査: https://www.showroom-live.com/event/circle2026_4th
- 外部予測の原投稿: https://x.com/thehillofreina/status/2109318846670839955

SHOWROOMイベント参加ルームは71、公式進出者プロフィールと照合できたのは70。Entry 1013は公式名簿にないため名簿へ混在させない。学年未記載の参加者を推測で補完しない。

データは2026-10-12 16:53 JSTの**固定スナップショット**。最新・ライブの値として表示しない。公式SR順位と第三者の独自予測は別指標であり、独自予測を公式合否の確定情報として扱わない。

## 公開安全条件と更新手順

- 個人が特定できる視聴者・貢献者データ、非公開分析Siteからのデータの持ち込みは禁止。
- 他者の原予測表画像・全行をコピーしない。要約と原投稿リンクのみ。
- 本人や出場者の写真、配信の録画・音声は今回のコーナーへ新規追加しない。
- まず `noindex,nofollow,noarchive` を維持し、オーナー確認・実ブラウザ検品・出典確認の後に一般公開・索引化する。
- 差分更新の際は取得日を明記し、前日のポイントで最新順位を上書きしない。
- 既存のLIVE STREAMやHOMEの公式投票導線を変更しない。
- CI: `pnpm typecheck`、`pnpm test`、`pnpm build`、`pnpm guard`。モバイル実表示は別途確認。

一般公開時にnoindexを外す場合は、ページの内容・出典・権利・表示検証を行い、必要に応じて公開サイトのsitemap追加も同時に検討する。
