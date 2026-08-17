# メディア運用ガイド — mily-fan-site

写真・動画の受け入れから掲載までの手順と、受領済み素材の台帳です。
どのツール（Claude Code / Codex / Cursor）で作業しても、この手順に従ってください。
日常更新の振り分け（news / events / 配信予定）は `docs/CONTENT-OPS.md`。

## 受け入れフロー

```
Google Drive 原本
  → 選定（オーナー了承。SNSから自動取得しない）
  → media/original/   （無改変 jpg。gitignore 済み）
  → pnpm media:build
  → public/media/gallery/   （jpg / webp × 480 / 960 / 1600。コミットする）
  → src/data/media.ts       （マニフェスト。了承まで published: false）
```

1. Drive の原本フォルダから、掲載する枚だけを選ぶ。フォルダ URL はオーナーに確認する（ここには書かない）。
2. 選んだファイルを `media/original/` へ、命名規則どおりの**新しい**名前でコピーする。Drive 側の原本は動かさない。
3. `pnpm media:build` を実行する。既存の派生と同名ならスクリプトは**上書きせず停止**する。
4. `public/media/gallery/` の派生を確認し、`src/data/media.ts` に項目を足す。
5. オーナー確認が取れるまで `published: false`。了承後に `true`。

この流れを省略して SNS 画像を直接 `public/media/` に置かない。

## ディレクトリ構成

```
media/original/            元素材。無改変で保管。jpg は gitignore（README のみコミット）
public/media/gallery/      公開用派生（jpg / webp × 480 / 960 / 1600px）。コミットする
src/data/media.ts          マニフェスト。掲載可否・出典・alt を管理
```

- 元素材は**読み取り専用**として扱う。上書き・リネーム・再エンコード禁止。
- 派生の生成は `pnpm media:build`。出力先に同名ファイルがあると**上書きせず停止**する。
  内容を差し替えたいときは新しいファイル名（新しい連番）を使う。公開済みファイル名は URL 契約として不変。
- sharp が既定でメタデータを落とすため、派生に EXIF / GPS / IPTC は残らない（コミット前に確認済みであること）。

## ファイル命名

```
mily-b<batch 2桁>-<seq 2桁>-<slug>.jpg          … 元素材
mily-b<batch 2桁>-<seq 2桁>-<slug>-<width>.<ext> … 派生
```

- `Mily / mily` は本人の公開表記（Instagram @mily_chan36）。一般英単語ではないため、spellcheckで"修正"しない。l を重ねた表記の方が誤りで、guard（`pnpm guard`）が全ファイルで検出する。
- `<batch>` は受領バッチの連番。**受領順であり撮影日ではない。**
- 投稿日・撮影日が確認できるまで、ファイル名に日付を入れない（日付の捏造禁止）。
  確認できた日付は `src/data/media.ts` の `sourceDate` に記録する。
- 連番は一度使ったら欠番になっても再利用しない。

## 掲載のゲート

`src/data/media.ts` の各項目は次を満たすときだけ `published: true` にできる。

1. オーナーが掲載を了承している
2. `provenance` が明確（`owner-provided` / `sns-post` / `third-party`）
3. `sns-post` なら `sourceUrl` 必須、`third-party` なら `credit` 必須
4. `alt` が書かれている（外見の評価ではなく、状況の説明）
5. 写り込んだ第三者・個人情報・店舗特定要素の懸念が解消済み

`sourceUrl` / `sourceDate` / `credit` は**確認できた値だけ**を入れる。不明のうちは `null`（推測禁止）。

## 素材台帳（batch b01 / 受領日 2026-08-14〜15）

| ID | ファイル | sha256 (先頭12桁) | 内容 | 掲載 |
| --- | --- | --- | --- | --- |
| b01-01 | mily-b01-01-birthday-cake.jpg | edc5ed508820 | バースデーケーキと花束。人物なし | ✅ |
| b01-02 | mily-b01-02-bouquet-standing.jpg | 54c11a821928 | 花束を持つ立ち姿 | ✅ |
| b01-03 | mily-b01-03-bouquet-smile.jpg | c3793e62525b | 花束と緑のバッグ・笑顔 | ✅ Hero 兼用 |
| b01-04 | mily-b01-04-bouquet-pose.jpg | 8c6cc2fd9d04 | 花束とバッグ（b01-03の連写違い） | ✅ |
| b01-05 | mily-b01-05-bouquet-closeup.jpg | a5bb0d475f8b | 花束を抱えた寄り | ✅ |
| b01-06 | mily-b01-06-necklace-gift.jpg | 89fab42c4550 | Canal 4℃ のネックレス | ✅ |

### 掲載判断メモ

- **b01-01（ケーキ）**: 当初は①別の方の名前（画像上でマスク済み）、②第三者の腕・衣類の写り込み、③店舗ロゴの3点を懸念として保留したが、**2026-08-15 にオーナーが掲載を指示**したため公開。懸念は台帳に記録として残す。
- **b01-04**: 当初は b01-03 との重複を理由に非掲載としたが、main に取り込まれた5枚構成を巻き戻さない方針（2026-08-15 オーナー指示）により掲載。

### 出典の確認状況

- b01-01 / 02 / 03 / 04 / 05: 本人 Instagram の21歳誕生日投稿
  （https://www.instagram.com/p/DbiY3PHk1c8/）が出典として main に取り込まれたため
  `sns-post` として記録。**投稿日は一次ソースで再確認できていないため
  `sourceDate` は null のまま**（確認でき次第記入）。
- b01-06（ネックレス）: 出典未確認のまま `owner-provided` / null。判明したら反映。
- 撮影者（credit）は全素材で未確認。第三者撮影と判明した場合は credit を追記する。

## 禁止事項（再掲）

- 本人の顔の AI 生成・置換・補正、生成塗り足し（outpainting / generative fill）
- 本人 SNS からの画像・動画の自動取得
- 顔・体を不自然に切るトリミング（見せ方の調整は `focal` = object-position で行う）
- 元素材・公開済み派生の上書き

## 動画を受領したら（先行ルール）

- 元動画は `media/original/` に無改変で保管
- 公開用は H.264 mp4（1080p / 720p、`+faststart`、メタデータ除去）
- poster は**動画内の実フレーム**から作る（AI 生成 poster 禁止）
- `controls` / `playsInline` 必須、`preload="none"`、autoplay は原則オフ
- 短縮版を作る場合は元動画を残し、どの区間を切ったかをマニフェストに記録
- 変換実行前にオーナーへ方針を報告する

### 一時的なInstagram Story動画

- 公開Story permalinkがない場合、素材受け渡し用のDrive URLを `sourceUrl`、caption、metadata、frontend dataへ残さない。表示は `Instagram Story` の非リンクlabelとする。
- owner-providedのクリーンな元動画をgitignored領域へ無改変で保存し、H.264 / AAC / `+faststart`、metadata除去済みの公開MP4を作る。
- posterは公開MP4の実フレーム候補を複数比較して選ぶ。AI生成・顔補正・塗り足しはしない。
- LatestとGalleryへ同じ投稿を出す場合、公開MP4 1本とposter 1枚を共有する。用途別コピーは作らない。
- Instagram UIを含む閲覧画面スクリーンショットはコメント確認資料に限り、公開assetやGalleryへ入れない。
- 一時的な朝投稿はLatest + Galleryの対象であり、読み物の `/stories/` へ自動的に転記しない。
