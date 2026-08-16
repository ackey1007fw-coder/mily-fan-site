# Drive Gallery — batch b02

2026-08-15〜16 にオーナーから受領した Google Drive 素材を、既存 Gallery に追加するための運用メモです。

## 受領数

- 写真: 46点
- 動画: 11エントリ
- 動画のうち同名・同サイズで完全重複している1エントリは表示上1件に統合
- Gallery登録数: 写真46点 + 動画10本 = 56件

受領フォルダのURLは公開UIにもこの文書にも保存しません。個別ファイルIDだけを `src/data/driveGallery.ts` で管理します。

## 公開方法

- 写真: Google Drive の個別 thumbnail endpoint を lazy-load
- 拡大: 個別ファイルの viewer を新規タブで開く
- 動画: 個別ファイルの Drive preview player を iframe で lazy-load
- フォルダ一覧へのリンクは出さない
- 動画を自動再生しない
- 既存 `src/data/media.ts` / `public/media/gallery` の写真は変更しない

## merge前の必須ゲート

**Google Drive の「一般的なアクセス」は必ず `リンクを知っている全員: 閲覧者 (Viewer)` にする。**

2026-08-16 の受領時監査では、一般アクセスが `anyone: writer` になっていた。この状態では個別ファイルIDをサイトへ公開すると第三者が編集権を得る可能性があるため、**Viewerへの変更を確認するまでこのGallery PRをmainへmergeしない。**

確認方法:

1. Driveで受領フォルダを開く
2. 「共有」
3. 「一般的なアクセス」→「リンクを知っている全員」
4. 権限を「閲覧者」にする
5. サイト側で写真表示・動画再生を確認してからmerge

## コンテンツ方針

- 今回のb02はオーナーから「フォルダ内の写真・動画をギャラリーで見られるようにする」と明示指示を受けた owner-provided バッチ
- 顔のAI生成・置換・美顔補正はしない
- 撮影日や場所はファイルから推測して表示しない
- ファイル名は訪問者へ表示しない
- Drive上の完全重複は1件へ統合する
- 本人SNS素材の追加取得については2026-08-16にオーナーから明示許可あり。ただし本人アカウントと確認できる投稿に限り、出典URLを保持して別バッチとして扱う

## 変更箇所

- `src/data/driveGallery.ts` — 受領ファイル台帳、個別Drive URL生成
- `src/components/Gallery.tsx` — 写真/動画表示
- `scripts/drive-gallery.test.mjs` — 件数・URL・UI安全条件
