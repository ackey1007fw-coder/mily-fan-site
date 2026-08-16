# media/drive-b02-original — Drive バッチ b02 の原本（コミットしない）

Google Drive で受領した b02 の**原本置き場**です。実ファイルも id 対応表も
gitignore 済みで、リポジトリには入りません。

このリポジトリは public です。**原本・Drive file ID・Drive フォルダ ID・元ファイル名を
コミットしないでください。** 受領フォルダは Restricted に変更済みです。

## 流れ

```
Drive 原本（手元にダウンロード）
  → このディレクトリ
  → pnpm drive-gallery:build
  → public/media/drive-gallery/（sanitized derivatives）
  → src/data/driveGalleryManifest.json
```

ネットワークアクセスはありません。取り込みはこのローカル入力だけを読みます。

## 置き方

エントリ id は `scripts/drive-gallery-source.mjs`（file ID を持たない台帳）にあります。
原本とエントリの対応は次のどちらかで指定します。

### A. private manifest（元ファイル名を保ちたいとき）

`sources.json` を置きます。このファイルも gitignore 済みです。

```json
{
  "mily-drive-b02-p02": "7D748F76-....jpg",
  "mily-drive-b02-v06": "1CD4FADB-....mp4"
}
```

### B. slug 名で置く

対応表なしで、`outputSlug(id)` の名前にして置きます。

```
mily-b02-p02.jpg
mily-b02-v06.mp4
```

拡張子は問いません（`.jpg` `.jpeg` `.png` `.heic` `.mp4` `.mov` など）。

## 置く必要がないもの

- `mily-drive-b02-p01` … privacy hold。手元にあっても構いませんが、取り込み対象外です。
  sanitize されず、`public/media/drive-gallery/` にも manifest にも出ません。

公開候補は **写真 45 点 + 動画 11 本 = 56 件**です。

## 禁止

- 原本・`sources.json` を git add すること
- Drive file ID / フォルダ ID をリポジトリへ書くこと
- 顔の AI 生成・置換・補正・塗り足し
- 原本の上書き・再エンコード（派生は `public/media/drive-gallery/` にだけ作る）
