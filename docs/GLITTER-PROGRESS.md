# 金グリッター進捗ボード

## 入口と正本

- 公開ページ：`/data-lab/glitter/`。ViteのHTML入力。Labの先頭ボタンとSupportの既存金グリッターガイドから案内する。noindex/nofollow/noarchiveを保つ。
- 公開読取JSON：`/api/mily-glitter`。本人の公式Classicタレント順位・ptと数値の差だけを返す。入力URL・roomをクエリで受け付けない。
- 本人の解決は既存`resolveMilyRoom`（ENTRY734→本人検証）を再利用し、room IDは実装に固定しない。genre103が公式一覧のtalentであることを照合。
- 読取元： https://www.showroom-live.com/ranking のタレント／日間・週間選択時に実際に観測した公開API。`/api/genre_ranking/103/{daily|weekly}/{YYYYMMDD}?page=N&count=20`。
- ルール： https://campaign.showroom-live.com/award2024/ 。日間4,000pt＋上位約20%、週間40,000pt＋上位約10%を別条件として扱う。42,000ptは既存Supportガイドと同じファン提案。

## データ契約v1

トップ：schemaVersion=1、genre{id:103,name:タレント}、本人確認済みroomId、generatedAt、sourceUrl、weekly、daily。
各期間：state(ok/unavailable/not-listed)、periodStart/periodEnd(YYYY-MM-DD、JST)、observedAt(ISO)、points、rank、listedCount、nextRank、nextRankPoints、gapToNextRank、cutoffRank=null、rankCondition=unverified。未確認の数値はnull。

ポイントはClassicジャンルランキングのpointだけ。is_bonus_eligibleは月間等のボーナス表示であり、現週の金獲得判定には流用しない。is_rankedもポイント条件の代わりにしない。2026-10-19の実観測では4,000pt未満の行にもtrueがあり、掲載83ルーム全件がtrueだった。掲載数から上位10%の公式境界を推定しない。

直上順位との差は、直上の同順位群のptに並ぶ差。プラス1での順位達成は保証せず、他ルーム名・写真・rawレスポンスは公開しない。

## 時刻・失敗・負荷

週は月曜始まりのJST。日付跨ぎの取得は未確認へ倒す。日間・週間は独立に検証。観測10分以上前、違う期間、未来時刻、型不一致・本人不一致は現在値にしない。発見できない検索予算切れをnot-listedにしない。明示終端まで全件確認できたときだけnot-listedを使うが、数値は0にしない。

最大10ページ・各3.5秒タイムアウト・期間検索15秒の開始予算、重複／逆順／途中の掲載数変化を不採用。本人発見後は不要な全件収集をしない。サーバー成功キャッシュ5分、失敗30秒、inflight共有。CDNの残TTLは元の観測から減らし、JST日付を越えない。

画面表示中に約5分ごと再取得し、非表示では新しい通信をしない。手動取得も共有キャッシュのため直前と同じ結果の場合がある。通信失敗時に直近10分未満の確認値を残す場合は再取得失敗と明記。公式側の反映遅延は不明で、取得時刻と同一視しない。新規常駐収集・課金サービス・既存録画設定変更はない。

## 数値計算・検証

残り=max(0,目標-週間pt)、日平均=ceil(残り/今日を含む残日数)。配信回数は本人の公式予定と区別した1〜99の手入力仮定。1配信目安=ceil(残り/回数)。日間4,000条件は独立。未確認では試算もしない。

共有純粋ロジック：public/data-lab/assets/glitter-model.js。既存src/lib/showGlitter.tsの閾値とテストで整合させる。API・UI・時刻境界・未取得・数値型・ページネーション・公開データ最小化の単体テストとブラウザ検査を実施する。CI/プレビュー/本番表示はそれぞれ独立に確認する。

Native分析先は既存担当がこの公開APIを読むだけ。公開側から非公開分析先へ接続せず、URL・個別視聴者・生ログ・認証情報を共有JSONや公開repoに置かない。Native側の実装・数値一致・実表示はその担当の証拠がそろうまで未完了。
