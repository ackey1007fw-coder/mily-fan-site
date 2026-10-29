# AI_HANDOFF — mily-fan-site

> 最終更新: 2026-10-18（Claude Code が、これまでの制作・運用の全体を次のAIへ引き継ぐために作成）
> 読む順番: `AGENTS.md` → `README.md` → **このファイル** → `docs/DECISION_LOG.md` → `docs/AI_PROJECT_MEMORY_SKILL.md` → 対象コード・テスト

このファイルは「いまの状態」のセーブデータです。ルール本体は `AGENTS.md`。ここはルールを追加・緩和しません。

---

## 1. このプロジェクトは何か

- みりぃ（三橋莉子）さんを応援する、**ファン制作・非公式サイト**。本人運営・公認ではない。
- 英語表記は必ず **Mily / mily**（本人の公開identity。l を重ねた綴りは誤りで、guard が検出する）。
- 年号付きの専用サイトにしない。2027年以降も同じrepoで続ける。
- オーナー: 「あっきー」。サイトは「ファン / サポーターとして応援している立場」を常に保つ。

| 項目 | 値 |
| --- | --- |
| repo | `ackey1007fw-coder/mily-fan-site`（public） / base `main` |
| 本番 | https://mily-fan-site.vercel.app/ （`main` merge → Vercel 自動デプロイ） |
| stack | React / TypeScript / Vite（マルチページ入力） / Tailwind / pnpm / Vercel Functions / GitHub Actions |
| 関連 | 非公開の素材台帳・SNS運用・改善案件は、オーナーの Notion「mily-fan-site Engineering Board」。公開repoへは転記しない |
| 姉妹プロジェクト | 他の人物の応援サイトは**別repo・別人物**。名前・URL・データをこのrepoへ書かない（guard が検出する） |

## 2. いま公開されているもの（ページ地図）

| パス | 中身 | 主なデータ |
| --- | --- | --- |
| `/` | Hero / 今日の動き / 応援導線 / Latest / Gallery / 予定 / プロフィール要約 / リンク | `news.ts` `media.ts` `events.ts` `streamSchedule.ts` |
| `/news/` `/gallery/` `/stories/` | 最新情報・写真動画・Story の一覧 | `news.ts` `media.ts` `galleryVideos.ts` `stories.ts` |
| `/profile/` | 一次情報の出典つき詳細プロフィール | `profile.ts`（出典台帳・`asOf`） |
| `/support/` | 投票・応援方法の案内 | `contest.ts` `supportEvents.ts` ほか |
| `/activities/live/` | **LIVE STREAM**：SHOWROOM等の配信メモ（各回1ファイル） | `streamRecaps.ts` + `streamRecapYYYYMMDD*.ts` |
| `/activities/radio/`・`/activities/radio/music/` | FM「湘南シーサイドサークル」の放送回と確認済みオンエア楽曲 | `radio.ts` `radioEpisodes.ts` `radioMusic.ts` |
| `/activities/miss-circle/`・`/activities/campus-girls/` | コンテスト活動の記録 | `contest.ts` `activities.ts` |
| `/data-lab/` | **MILY SIGNAL**：匿名・集計のみの配信データ分析（noindex） | `data-lab/` HTML + `public/data-lab/data/*.json`（`docs/DATA-LAB.md`） |

API（Vercel Functions, ESM）:
- `/api/mily-schedule` … ENTRY 734 起点で SHOWROOM room を**自動解決**して配信予定を返す。room ID を直書きしない。
- `/api/mily-radio-status` … FM の放送状態。取れないときは `null`（false と混ぜない）。
- `/api/mily-live` … 配信状態。

Actions: `ci.yml`（typecheck / test / build / guard）、`watch-public-sources.yml`（毎日 09:10 JST に公開情報との差分を**Issueで知らせるだけ**。データは自動更新しない）、`probe-schedule.yml`（手動の解決チェーン検証）。

## 3. 現在地点（2026-10-18 時点）

- MISS CIRCLE CONTEST 2026（ENTRY 734）: **4次審査突破・セミファイナル進出**（2026-10-15 確認、`contest.ts`）。応援導線は Hero / Support / モバイルドックにある。審査日程・投票方法は**その都度公式で確認**し、過去の案内は過去時制に直す。
- LIVE STREAM: ほぼ毎日（朝・昼・夜）の配信メモを継続中。最新は 10/18 朝。写真はオーナー承認済みの実フレームのみ（batch 番号 `bNNN` で `docs/MEDIA.md` に台帳化。最新 b229）。
- MILY SIGNAL（`/data-lab/`）: 10/12 公開。以後、各配信の匿名集計・欠測可視化・前回比較を追加中。`noindex,nofollow,noarchive` を維持。
- Web Analytics: 全HTMLページで計測、データラボのCSPにも対応済み（#503 / #504）。SNS → サイト流入の計測・導線改善は Notion 側で案件管理中。
- ラジオ: 日曜 10:00–13:00 の確認済み枠。放送回レポートとオンエア楽曲を継続掲載。

## 4. 未完了・次にやること

- 古い Open / Draft PR（fallback・文言修正・実験など）が積み上がっている。本数・番号は変わるので**着手時に GitHub で確認**し、同じファイルを触るPRがないか見る。古いものは内容を確認してオーナーに整理（close / 統合）を提案する。勝手に close しない。
- セミファイナル以降の審査日程・投票導線の更新（公式発表を待って反映）。
- MILY SIGNAL の一般公開（noindex 解除）はオーナー判断待ち。`docs/DATA-LAB.md` の条件を満たすまで外さない。
- SNS展開（X / Instagram / TikTok / YouTube）の公開実画面確認は、`docs/CONTENT-OPS.md`「SNS表紙・送信・公開確認の恒久チェック」の4状態で管理する。

## 5. 日々の更新の型（いちばん多い仕事）

1. 依頼された素材・投稿を受け取る（チャット添付 / オーナー指定の原本）。X / Instagram はスクレイピングしない。
2. 出典URL・日時・本人性・公開範囲を確認。分からない値は `null` / 空欄のまま。
3. 写真・動画は `media/original/`（コミットしない）→ `pnpm media:build` → `public/media/gallery/mily-bNN-NN-<slug>`。EXIF/GPS は自動除去。**既存ファイルは上書きしない**（変えるなら新しい名前）。
4. データを追加（NEWS は `news.ts`、配信メモは新しい `streamRecapYYYYMMDD*.ts` を作り `streamRecaps.ts` に時系列で登録）。
5. `docs/CONTENT-OPS.md` / `docs/MEDIA.md` に受入記録を追記（batch 番号・承認範囲・確認日）。
6. 品質ゲート → PR → CI green → `AGENTS.md`「マージしてよい条件」を current head で満たせば squash merge → 本番確認。

```bash
pnpm install --frozen-lockfile
pnpm typecheck && pnpm test && pnpm build && pnpm guard
git diff --check                      # 未ステージの変更
git diff --cached --check             # ステージ済みの変更
git diff --check origin/main...HEAD   # コミット済みのPR差分（最新のbaseを取得後）
```

## 6. ハマりどころ（実際に踏んだもの）

- **公開済みのメディアURLを変えない**。差し替え時に旧URLを消すと NEWS・SNS からのリンクが壊れる（#412 で復旧）。変更が必要なら新ファイル + `vercel.json` の redirect。
- **承認済みの背景・表示を「整理」のつもりで消さない**（#411 / #416 / #418 で復旧）。触る前に、その要素を入れたPRと承認範囲を読む。
- 配信メモは**元動画を見たのか、提供レポート・文字起こしだけなのか**を区別して書く。未視聴で「動画確認済み」と書かない。
- 引用の「」は原文どおりのときだけ。本人の感情・意図を推測で書かない（#405 系で何度も修正）。
- 写真がない回に、別の回の写真を流用しない（#417）。テキストだけで成立させる。
- 審査日程の「日本時間」注記などは、確認できた日程に限る（タイムゾーンを仮定しない）。
- テストは多い（`scripts/*.test.mjs` / `*.browser.mjs`）。落ちたらテストを弱めず、原因を直す。

## 7. 変更禁止・要オーナー確認

`AGENTS.md`「次の変更はオーナー確認が必要です」が正本。特に: プロフィール事実、SNS / 外部リンクの追加、本人写真の追加・差し替え、本番・ドメイン設定、`AGENTS.md` 自体、運用ルール、Codexレビュー委任ポリシー。

## 8. 心構え（このサイトを作ってきた精神）

- **主役はみりぃ**。サイトは、みりぃの表情・声・挑戦が伝わるための舞台。華やかさは「安全に使える実素材の豊かさ」で作る（photo-forward）。水増し・AI生成・流用で飾らない。
- **事実に誠実**。確認できたことだけを、出典つきで。分からないことは空欄にする勇気を持つ。
- **本人への敬意と長期的な信頼**。短期の反応より、本人が見ても安心できるサイトであること。私的な関係・DM・推測を公開面に一切持ち込まない。
- **ファンの目線で書く**。レポート調・AI要約調ではなく、短く温度のある文。ただし感情の代弁はしない。
- **壊さない・上書きしない**。他AIの作業、公開済みURL、承認済みの表示を守る。差分は最小。
- **検証してから「できた」と言う**。CI・本番・公開実画面を区別して報告する。

## 9. 反省と改善（次のAIへの申し送り）

| 反省 | 改善（いまの仕組み） |
| --- | --- |
| repo作成時に英語表記を誤った綴りで始めてしまった | `pnpm guard` が全テキストファイルの誤綴りを検出。AGENTS 作業前チェックに明記 |
| 「整理」で承認済みの表示や公開URLを消し、後から復旧PRが続いた | 公開ファイル名は不変、上書き禁止のビルドスクリプト、redirect で移行 |
| 配信メモで出典範囲を超えた描写・感情推測が混ざった | `docs/LIVE-STREAM-RECAP.md` の統一ルールと検証台帳（`RECAP-VERIFICATION-LEDGER.json`）、ブラウザテスト |
| SNS投稿で「API成功＝公開完了」と扱いかけた | 予約済み / 送信受理 / 公開実画面未確認 / 確認済み の4状態で管理 |
| Open/Draft PR が積み上がり、同じファイルの競合リスクが増えた | 着手前に Open PR を確認。不要PRの整理はオーナーに提案する（未解決の課題） |
| ルールが複数ファイルに分岐しかけた | `AGENTS.md` を唯一のルール置き場にし、`CLAUDE.md` 等はポインタだけ |

## 配信タイミングナビの引継ぎ

- 対象: `/data-lab/stream-timing/`。きら星・訪問・会話の候補カード、6指標、期間/曜日切替、曜日×時刻、標本数/幅/欠測、公開出典を表示。
- 再生成: `node scripts/build-stream-timing.mjs`。入力は既存公開JSON11件の明示一覧。元資料更新時に同じPRで生成JSONを更新し、固定スナップショット一致を検証する。自動収集・新しい常駐処理は追加しない。
- 必読: `docs/DATA-LAB.md` の計算法とDecision Logの判断境界。10分換算と予測、配信中の時計時刻と開始時刻の効果、有料ギフトとfree表示を混同しない。
- 品質: `scripts/stream-timing.test.mjs` と `scripts/stream-timing.browser.mjs`。CI/プレビュー/本番を別々に確認する。Native分析先との数値一致は、その担当による反映と読戻し後にのみ完了とする。
- 全体混雑・有料ギフト金額・正式イベントptは未接続。追加する場合は検証済みの集計と日時・定義・期間区分を先に確定する。


## 金グリッター進捗ボード（2026-10-19）

- `/data-lab/glitter/` と `/api/mily-glitter`。Lab・Supportから公式Classicタレント順位、週間最低ptとの差、日間条件、配信回数別試算を確認。
- 運用・データ契約は `docs/GLITTER-PROGRESS.md`。きら星／イベントptと混ぜず、順位境界は未確認。古い週・10分以上前・取得失敗を現在のゼロにしない。
- 既存Native分析先は別担当・別の実表示確認。公開APIからの最小数値共有のみ許容し、公開側から私的データを読み込まない。


## 2026-10-22 夜配信と朝のLIVE STREAM登録

- 夜のlive23588035をLIVE STREAMとMILY SIGNALの日付一覧・個別レポートに追加。写真10枚と原音トーク3本はb236の専用manifestを参照。朝は既存の公開済み記録を根拠に独立した文章記事を追加し、写真を流用していない。
- 夜の画面カウンター9項目・観測件数は原本の所在を今回照合できていないためnull／数値未確認。未収集・保存失敗・ゼロとは確定していない。将来原本を確保できた場合だけ追加検証して更新する。
- 本文は194区間のASRと該当箇所再ASR、写真は実フレームで照合。全編音声の手動聴取・逐語校正・全区間連続性は未確認。公式MVは曲目参照用で、新しい歌唱音源は自己ホストしない。既存の別作業PRの歌唱クリップ・SNS投稿状態は更新しない。
- この変更の公開成否はPRのcurrent-head CIとVercel本番・実画面の確認記録を正とする。Native分析Siteは別source・別公開receiptで管理し、こちらの公開repoへ私的導線を追加しない。

## 2026-10-27：3回のASR・第三者画面参考値追補

#547公開後の別工程。10/26夜の元メモとnull指標、18→435の留保を保持し、ASR追補とreferenceSnapshotを別記。保存観測・最終画面進行・offline receiptを区別し、verified_final=false、推移なし、時間帯比較対象外を維持。

10/25夜の長文は既存SIGNAL個別レポート設計で掲載、LIVEから導線を追加。本人依頼の同回顔中心クロップは130×200px原寸。公開済みJPEGとSHA256 d1d7ab9bfaeff6694ae1bf4da681275357b4f787e3ba93c3052b373761ad9ceeが一致し、目視検品済み。

原音未聴取・ASR秒とPTS未同期・全編無欠落未確認・歌唱未確定を維持。動画・SNS・録画・他PR・権限は変更しない。公開完了はcurrent-head CI/reviewとmerge・本番実表示の検収後に判定する。

## 2026-10-30｜10/29夜 live23619613 分析・LIVE追記
- 本branchは夜枠のみ。既存#552/#553/#554とNative同時編集は行わない。
- SIGNAL個別レポート、日付別導線、匿名206点JSON/CSV、4図、冒頭・終盤ASRの非逐語LIVEメモを追加。
- メディアは未作成・未掲載。録画保護Resource Guardのheavy条件不成立のため抽出を実行していない。録画原本・収集器・他アプリを停止していない。実映像/原音検品後に写真と短尺を追加する残件。
- Native反映・最新head全CI・独立レビュー・ブラウザ検品・merge・本番反映は、それぞれ実証跡で判定。実装追加だけで公開完了と扱わない。
