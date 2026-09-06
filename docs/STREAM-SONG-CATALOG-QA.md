# 曲一覧の検証・収集引き継ぎ（PR #191）

この文書は PR #191 の作業記録と再現手順です。ルールの正本は `AGENTS.md`、配信メモの手順は `docs/LIVE-STREAM-RECAP.md`、楽曲出典の記録は `docs/CONTENT-OPS.md`。この文書はそれらを変更しません。

## 担当を戻すとき

- 対象は `ackey1007fw-coder/mily-fan-site` の PR #191、既存 branch `jipi/stream-song-catalog-20260906`。
- PR の最新 head・Conversation・未コミット変更を確認してから担当を切り替える。同じ branch / ファイルを並行編集しない。別 branch で同じ機能を再実装しない。
- オーナーの明示指示により Draft を維持し、Ready 化・merge・main への直接 push はしない。
- 開始 head は `e17ea24`。2026-09-07 の参照 main は `03346fb`（#192）。曲データの正本は merged #185 / #190 を含む各配信の `songs`。検索一覧用の第二の手入力マスターを作らない。
- `docs/AI_HANDOFF.md` / `docs/DECISION_LOG.md` / `docs/AI_PROJECT_MEMORY_SKILL.md` は確認時の main に存在しない。Project Memory は新設していない。

## ブラウザ検証

`scripts/stream-song-catalog.browser.mjs` は実際の `pnpm build` 出力を Vite preview で起動し、Playwright で操作する。HTML やコンポーネントを模倣したテスト用の別実装ではない。

`.github/workflows/ci.yml` は従来の install / typecheck / test / build / guard の後にブラウザ検証を実行する。ブラウザ用 Playwright 1.61.1 は runner の一時領域に固定版をインストールし、アプリの package.json / lockfile は変更しない。テスト失敗を無視せず CI を失敗させる。

| 環境 | viewport | 確認対象 |
| --- | --- | --- |
| Chromium desktop | 1280 × 900 | PC 2列表示 |
| Chromium mobile | 390 × 844 | スマートフォン相当 1列表示 |
| WebKit mobile | 390 × 844 | 別エンジンのスマートフォン相当表示 |
| Chromium narrow | 320 × 740 | 狭幅での折り返し・横 overflow |

各環境で次を操作する（8グループ、合計32グループ）。

1. 初期件数・新しい順・横 overflow の検査と一覧のスクリーンショット。
2. 曲名・アーティスト文字列・全角英字と複数語の検索。
3. アーティスト絞り込み、曲名順と新しい順の切り替え。
4. 0件表示と「検索条件をクリア」による検索語・アーティストの解除。
5. 原曲・参考伴奏のリンクが既存データと一致し、新規タブ属性と説明を持つこと。
6. キーボードで配信一覧を展開し、配信へ移動。移動先を閉じて同一 hash を再クリックしたときも再展開すること。
7. 新しいページ読み込みで配信への直リンクが対象カードを開くこと。
8. RADIO には曲一覧を出さず、実行中のページ例外がないこと。

### 証跡の読み方

CI の `song-catalog-browser-<run id>` artifact に `report.json` と4環境の PNG を保存する（保持7日）。失敗時は実行済みグループと failure PNG を記録する。report の `head` が PR head、`commit` が実際に checkout した commit（pull_request 実行時は合成 merge commit）である。古い head の成功を現 head の成功として扱わない。

最初の成功は [CI #545](https://github.com/ackey1007fw-coder/mily-fan-site/actions/runs/34066830434)、head `2cb5b9f`。後続 commit の検証結果は PR Conversation を参照する。

これは **CI 内のビルド成果を実ブラウザで操作した結果**であり、次の確認とは別である。

- 保護された Vercel Preview そのものの操作。専用 fetch は共有 URL の生成に失敗した。
- iPhone / Android 実機での操作。mobile は viewport / touch のエミュレーションである。
- YouTube 外部プレイヤーの再生可否、地域・年齢・ログイン制限。
- 元動画の歌唱確認やプレイリスト全件調査。

CI のブラウザは外部通信を遮断する。非公開アーカイブや SNS へアクセスせず、外部フォントも取得しないため、スクリーンショットはこの条件での表示証跡である。

### 手元で再実行

Node / pnpm の版は package.json と CI を優先する。以下は POSIX 環境向け。成果物を public/ や git 管理下へ書き出さない。

```sh
pnpm install --frozen-lockfile
pnpm typecheck
pnpm test
pnpm build
pnpm guard
TOOLS_DIR="$(mktemp -d)"
EVIDENCE_DIR="$(mktemp -d)"
npm install --prefix "$TOOLS_DIR" --no-package-lock --ignore-scripts --no-audit --no-fund playwright@1.61.1
node "$TOOLS_DIR/node_modules/playwright/cli.js" install chromium webkit
PLAYWRIGHT_MODULE_ROOT="$TOOLS_DIR/node_modules" \
SONG_CATALOG_ARTIFACT_DIR="$EVIDENCE_DIR" \
PR_HEAD_SHA="$(git rev-parse HEAD)" \
node --disable-warning=ExperimentalWarning --experimental-strip-types scripts/stream-song-catalog.browser.mjs
```

Linux のブラウザ依存ライブラリが不足する場合は CI の `install --with-deps` 手順を参照する。既存の差分チェックも実行する。

## 収集状況（2026-09-07）

**全件収集は未完了。元プレイリストの内容・有効性・公開範囲・総本数を取得できていない。** 取得失敗を「プレイリストが空」「歌唱なし」「URLが無効」と読み替えない。

- 既存 main 由来の3配信4曲のみ。今回新たに元動画を視聴した件数は0、新たに追加した歌唱曲は0。
- `streamRecaps` の掲載済み12回はサイトの配信メモ数であり、指定プレイリストの本数でも調査完了数でもない。
- 既存4曲の根拠・確認方法は #185 / #190 と CONTENT-OPS を参照する。提供記録・歌唱区間の自動認識・公式情報の照合を、全編の手動聴取済みとは書かない。
- 今回は保存資料2件を再読した。9/5昼のレポートでは録画内0:22:40頃が「朝の歌を振り返る」場面と明記されており、昼の新規歌唱として追加しない。9/4夜の配信メモからも、新規歌唱を肯定できる根拠は増えていない。いずれも全編の歌唱なしを確認したという意味ではない。
- 原曲・カラオケの既存8 URL、allowlist、配信データ、画像、予定、NEWS、投票導線は今回の引き継ぎで変更していない。

## 次の収集手順

1. オーナー提供の元プレイリストを開ける環境で一覧を取得し、全ページ・非公開/削除/取得不能の項目を含む収録範囲を確定する。指定 URL の ID を推測補完しない。開けない場合は、その事実を残してオーナーへ URL の再共有または動画一覧を確認する。
2. オーナー管理の非公開作業領域で、動画ごとに調査台帳を作る。最低限「元の並び番号・非公開参照・配信日とその根拠・閲覧可能性・見た/聴いた区間・全文/部分/未調査・歌唱候補・確定曲・録画内開始時刻・未解決理由」を分ける。再生リストへの所属が未確認の保存資料は別枠にする。
3. 「資料の存在だけ確認」「レポートのみ確認」「自動文字起こしのみ確認」「映像/音声の一部確認」「全編確認」を区別する。タイトルへの言及、選曲相談、前回の振り返り、楽器演奏を歌唱に変換しない。歌唱なしは十分に確認した範囲だけで判断する。
4. 配信日・曲名・原曲アーティスト/版・歌唱開始の目安が確定したものだけ既存の各回 `songs` に追加する。まだ配信メモのない動画は、既存 StreamRecap 型と手順に沿って最小の確認済み本文を作り、空欄を推測で埋めない。
5. 新しい原曲 URL はアーティスト/レーベルの個別公式動画で照合し、オーナー確認と既存運用に従って出典台帳・厳密な allowlist・回帰テストを同時更新する。参考伴奏と本人の歌唱を混同しない。
6. 全体品質ゲート・ブラウザ検証を再実行し、確認できた動画数/未調査数/取得不能数/追加曲数を別々に報告する。全件数が不明なら網羅率を作らない。

元動画の URL / ID、認証情報、全文文字起こし、歌詞、視聴者情報は、この文書・public PR・CI の引数/ログ/artifact に置かない。公開側には集計と確認方法だけを残す。
