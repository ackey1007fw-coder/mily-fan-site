# みりぃ ファンサイト — エージェント向けガイド

このリポジトリ（`ackey1007fw-coder/mily-fan-site`）は、みりぃ（三橋莉子）さんの**ファン制作・非公式サイト**です。
公式・公認・本人運営ではありません。年号付きの専用サイトにもしません。2027年以降も同じ repo で続けます。

他のファンサイトの人物情報・写真・ニュース・イベント・SNS・プロフィールをコピーしないでください。みりぃは別人物・別プロジェクトです。

このファイルが**全ツール共通の唯一のルール置き場**です。Claude Code / Codex / Cursor などどのエージェントで作業しても、ここに従ってください。ツールごとの補足ファイル（`CLAUDE.md` など）はここへのポインタに留め、ルール本文をコピーして分岐させないでください。ルールを変えるときはこのファイルだけを更新します。

## 作業前チェック

1. `git remote -v` が `mily-fan-site` を指していること。
2. `src/data/profile.ts` の `displayName` が **みりぃ**、`legalName` が **三橋莉子** であること。
3. 英語表記は必ず **Mily / mily**。これは本人が使用している公開identity（Instagram **@mily_chan36**）であり、一般英単語の綴りではない。spellcheck・lint・AIの推測より本人の公開表記を優先し、「typoかもしれない」という判断で l を重ねた表記へ"修正"しない。l を重ねた表記の方が誤りで、guard が全ファイルを検査して検出する。
4. 別人物の名前や別サイトの URL が入っていたら、編集せず止まって報告する。

## リポジトリ運用

- GitHub: `ackey1007fw-coder/mily-fan-site`
- 通常運用では `main` へ直接 push しない。
- `main` から作業ブランチを切り、PR にする。
- マージ方式の指定がなければ **squash merge**。
- Vercel で本番公開済み（https://mily-fan-site.vercel.app/）。`main` への merge は本番に反映されるため、CI とオーナー確認を経てから merge する。
- `@codex review` はオーナーが投稿する。エージェントは投稿しない。
- 接続エラーをレビュー成功として扱わない。

### マージしてよい条件

1. 対象が `mily-fan-site`、base が `main`、head が作業ブランチ。
2. PR が Draft ではなく、競合がなく、マージ可能。
3. CI（install / typecheck / test / build / identity guard）が成功。
4. 未解決のレビュー指摘がない。
5. 追加した事実に出典がある。未確認情報は載せていない。

次の変更はオーナー確認が必要です。

- プロフィール事実の追加・変更
- SNS / 外部リンクの追加
- 本人写真の追加・差し替え
- 本番公開・ドメイン設定

## セットアップ

```bash
git clone https://github.com/ackey1007fw-coder/mily-fan-site.git
cd mily-fan-site
pnpm install
pnpm dev
```

パッケージマネージャは **pnpm**。`npm install` で lockfile を作り直さない。

## 技術スタック

- React
- TypeScript
- Vite
- pnpm
- GitHub Actions
- Vercel（本番公開済み: https://mily-fan-site.vercel.app/）

## データの場所

- `src/data/profile.ts` … 確認できた最小限のプロフィール
- `src/data/events.ts` … 出演・配信・イベント。年をまたいで同じ配列に追加する
- `src/data/news.ts` … 最新情報。新しいものを配列の先頭へ
- `src/data/media.ts` … 写真・動画のマニフェスト（運用手順は `docs/MEDIA.md`）
- `src/data/socials.ts` … 確認できた本人 SNS のみ
- `src/data/links.ts` … その他リンク
- `src/data/highlights.ts` … 年をまたげるハイライト
- `src/data/site.ts` … サイト名・説明・予定 origin

日常更新の手順・テンプレートは `docs/CONTENT-OPS.md`。写真の受け入れフローは `docs/MEDIA.md`。

未確認の項目は空のままにする。空より間違った値の方が悪い。

## メディア（写真・動画）の扱い

詳細な手順とインベントリは `docs/MEDIA.md`。要点:

- 元素材は `media/original/`（gitignore 済み・コミットしない）。**元ファイルを上書き・リネーム・再エンコードしない。**
- 公開用派生は `pnpm media:build` で `public/media/gallery/` に生成する（EXIF / GPS / IPTC は自動で除去される）。
- 生成スクリプトは既存ファイルを**上書きせず停止**する。内容を変えるときは新しいファイル名にする（公開済みファイル名は不変）。
- ファイル名は `mily-bNN-NN-<slug>` 形式。日付が未確認のうちはファイル名に日付を入れない（捏造しない）。
- 掲載は `src/data/media.ts` の `published: true` のみ。出典 URL・投稿日・撮影者が未確認の項目は `null` のまま残す（推測して埋めない）。
- 本人の顔の AI 生成・置換・加工、生成塗り足し、SNS からの自動取得は禁止。

## 配信予定の自動取得

- `/api/mily-schedule`（Vercel Function）が毎回 ENTRY 734 ページ起点で SHOWROOM room を自動解決し、AGE schedule JSON から配信予定を返す。**room ID をコードに直書きしない・推測しない。**
- 候補 room は SHOWROOM プロフィール API のルーム名（みりぃ / 三橋 / Mily）で本人検証してから採用。複数一致は曖昧として不採用。
- 環境変数 `MILY_SHOWROOM_ROOM_ID` / `MILY_SCHEDULE_URL` は自動解決失敗時の任意フォールバック（必須の手入力値ではない）。
- 手入力 fallback は `src/data/streamSchedule.ts`。**未確認の配信時刻を書かない。** 空なら配信予定セクションは非表示。
- 解決チェーンの実環境検証は Actions の「Probe stream schedule」を workflow_dispatch で実行（`scripts/probe-schedule.mjs`）。

## FMラジオ放送状態

- `/api/mily-radio-status` が Asia/Tokyo で「湘南シーサイドサークル」の放送日・時間帯を返す。確認済み枠は日曜 10:00–13:00。
- FMトップ（https://fm-smw.jp/）の NOW ON AIR を実行時取得し、番組名が明確に一致したときだけ `onAirConfirmed: true`。
- 取得失敗・HTML変更・曖昧な場合は `onAirConfirmed: null`。別番組または NOT ON AIR が読めた場合は `false`。false と unavailable を混ぜない。
- 時間帯や NOW ON AIR だけでは `milyAppearanceConfirmed` を true にしない。毎週本人が3時間出演しているとは断定しない。
- 確認済み事実は `src/data/radio.ts`。未確認の出演者・コーナー・例外放送を推測して足さない。

## 絶対ルール

- 「公式」「公認」「本人運営」と誤認させる表現を使わない。
- 未確認情報を推測して書かない。
- 本人 SNS から画像を自動取得しない。
- 実在する本人の顔を AI 生成しない。
- 他サイトの画像を流用しない。
- 外部リンクは `https:` / `http:` のみ。`rel="noopener noreferrer"` を付ける。

## 品質ゲート

PR 前に次を通す。

```bash
pnpm typecheck
pnpm test
pnpm build
pnpm guard
```
