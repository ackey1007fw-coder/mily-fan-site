# みりぃ ファンサイト — エージェント向けガイド

このリポジトリ（`ackey1007fw-coder/milly-fan-site`）は、みりぃ（三橋莉子）さんの**ファン制作・非公式サイト**です。
公式・公認・本人運営ではありません。年号付きの専用サイトにもしません。2027年以降も同じ repo で続けます。

他のファンサイトの人物情報・写真・ニュース・イベント・SNS・プロフィールをコピーしないでください。みりぃは別人物・別プロジェクトです。

## 作業前チェック

1. `git remote -v` が `milly-fan-site` を指していること。
2. `src/data/profile.ts` の `displayName` が **みりぃ**、`legalName` が **三橋莉子** であること。
3. パッケージ名の spelling は **milly**（`mily` ではない）。
4. 別人物の名前や別サイトの URL が入っていたら、編集せず止まって報告する。

## リポジトリ運用

- GitHub: `ackey1007fw-coder/milly-fan-site`
- 通常運用では `main` へ直接 push しない。
- `main` から作業ブランチを切り、PR にする。
- マージ方式の指定がなければ **squash merge**。
- この v1 では Vercel 本番公開・独自ドメイン・本人写真公開を行わない。
- `@codex review` はオーナーが投稿する。エージェントは投稿しない。
- 接続エラーをレビュー成功として扱わない。

### マージしてよい条件

1. 対象が `milly-fan-site`、base が `main`、head が作業ブランチ。
2. PR が Draft ではなく、競合がなく、マージ可能。
3. CI（install / typecheck / test / build / identity guard）が成功。
4. 未解決のレビュー指摘がない。
5. 追加した事実に出典がある。未確認情報は載せていない。

次の変更はオーナー確認が必要です。

- プロフィール事実の追加・変更
- SNS / 外部リンクの追加
- 本人写真の追加
- 本番公開・ドメイン設定

## セットアップ

```bash
git clone https://github.com/ackey1007fw-coder/milly-fan-site.git
cd milly-fan-site
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
- Vercel（次フェーズで接続。v1 では本番公開しない）

## データの場所

- `src/data/profile.ts` … 確認できた最小限のプロフィール
- `src/data/events.ts` … 出演・配信・イベント。年をまたいで同じ配列に追加する
- `src/data/news.ts` … 最新情報。新しいものを配列の先頭へ
- `src/data/socials.ts` … 確認できた本人 SNS のみ
- `src/data/links.ts` … その他リンク
- `src/data/highlights.ts` … 年をまたげるハイライト
- `src/data/site.ts` … サイト名・説明・予定 origin

未確認の項目は空のままにする。空より間違った値の方が悪い。

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
