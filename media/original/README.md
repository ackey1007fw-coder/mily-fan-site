# media/original — 元素材（コミットしない）

ここは Google Drive 原本から**選定した**写真の置き場です。
jpg 実ファイルは gitignore 済みで、リポジトリに入れません。

## 流れ

```
Google Drive 原本 → 選定 → このディレクトリ → pnpm media:build
  → public/media/gallery/ → src/data/media.ts
```

手順の本体は `docs/MEDIA.md`。日常更新の判断は `docs/CONTENT-OPS.md`。

## 置いてよいもの

- オーナーが Drive 原本から選んだ、無改変の jpg
- ファイル名: `mily-bNN-NN-<slug>.jpg`（次バッチは b02 から）

## 禁止

- 本人 SNS からの自動ダウンロード
- 顔の AI 生成・置換・補正・塗り足し
- 既存ファイルの上書き・リネーム・再エンコード
- このディレクトリの jpg を git add すること
