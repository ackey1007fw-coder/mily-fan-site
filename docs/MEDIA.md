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

## 素材台帳（batch b03 / 受領日 2026-08-17）

Drive Gallery（b02）とは別の独立動画。Latest と Gallery が同じ公開派生を共有する。

| ID | 公開ファイル | 内容 | 掲載 |
| --- | --- | --- | --- |
| b03-01 | mily-b03-01-morning-ohayo.mp4 | 2026-08-17 朝の Instagram Story。720×1280。owner-provided | ✅ |
| b03-01 poster | mily-b03-01-morning-ohayo-poster.jpg | 公開MP4の約6.9秒実フレーム。720×1280 | ✅ |

確認済み:

- source date: 2026-08-17
- provenance: owner-provided
- Instagram Story（公開permalinkなし。表示は非リンクlabel）
- posterは公開MP4の実フレーム。AI生成・顔補正なし
- metadata除去済み
- 元Drive URLは記録しない

## 素材台帳（batch b05 / 受領日 2026-08-19）

同じ元素材から、記事用の1枚と Gallery 用の派生セットを作っている。
記事側は STORY `/stories/second-round-result-2026/` 専用のフルサイズ1枚、
Gallery 側は `pnpm media:build` の通常フロー（480 / 960 / 1600 × jpg / webp）。
Drive Gallery（b02）には含めない。

| ID | 公開ファイル | 内容 | 掲載 |
| --- | --- | --- | --- |
| b05-01（記事） | stories/second-round-result-2026/mily-second-round-result-autumn-leaf.jpg | 夜の並木道で落ち葉を持つ本人写真。1152×2048。owner-provided | ✅ |
| b05-01（Gallery） | gallery/mily-b05-01-autumn-leaf-{480,960,1600}.{jpg,webp} | 上と同じ元素材の通常派生 | ✅ |

Gallery 派生のメモ:

- 元素材が 1152px 幅のため、`-1600` は拡大されず **1152×2048** のまま出力される
  （`build-media.mjs` の `withoutEnlargement`）。`media.ts` の `width` / `height` は
  実寸の 1152×2048 を記録する。
- 縦写真なので `media.ts` の `aspect: "1152 / 2048"` を指定し、Gallery タイル既定の
  4/3 へ切り抜かない。既存の横写真は `aspect` を持たないため表示は従来どおり。

確認済み:

- provenance: owner-provided（オーナーが依頼時に直接提供）
- 元素材は `media/original/mily-b05-01-autumn-leaf.jpg`（gitignore 済み・無改変）
  sha256 先頭12桁: `6d615b2b7354`
- 公開派生は sharp で再エンコードのみ（品質82 / progressive）。**トリミング・回転・拡縮なし**
- EXIF / GPS / IPTC / XMP は派生に残っていない（生成後に確認）
- AI 生成・AI 加工・顔加工なし。縦構図をそのまま使用
- 撮影日・撮影者・公開投稿URLは未確認のため記録しない（推測しない）

## 素材台帳（batch b06 / 受領日 2026-08-19）

Latest の 2026-08-19「体調回復」朝の投稿専用の記事写真。Drive Gallery（b02）にも
`public/media/gallery/`（Gallery 掲載枠）にも含めない。Latest のカード内で1ファイルだけ自己ホストする。

| ID | 公開ファイル | 内容 | 掲載 |
| --- | --- | --- | --- |
| b06-01 | media/news/mily-b06-01-recovery-morning.jpg | ウインクしてピースする朝の自撮り。1162×2048。owner-provided | ✅ |

確認済み:

- provenance: owner-provided（オーナーが依頼時に直接提供）
- 元素材は `media/original/mily-b06-01-recovery-morning.jpg`（gitignore 済み・無改変）
  sha256 先頭12桁: `1a0fec17a8da`
- 公開ファイルは元素材の**バイト単位で同一のコピー**。再エンコード・トリミング・回転・拡縮なし
  （元素材に EXIF / GPS / IPTC / XMP が無いことを確認済みのため、再圧縮せずそのまま置く）
- 残っているのは JFIF ヘッダと ICC カラープロファイルのみ（個人情報なし）
- AI 生成・AI 加工・顔加工なし。1162:2048 の縦構図をそのまま表示（`object-contain` 相当・トリミングなし）
- 出典は本人X投稿（2026-08-19）。撮影者は未確認のため記録しない

## 素材台帳（batch b07 / 受領日 2026-08-20）

2026-08-20 朝の Instagram Story 動画。b03 と同じく Latest と Gallery（動画アーカイブ）が
同じ公開派生を共有する独立動画で、Drive Gallery（b02）には含めない。

**状態: 元素材の同一性が未確認のため差し替え待ち。** 現在ブランチにある公開派生は、
オーナーが一次資料として指定したファイルから作られていない。オーナー指示により
この派生の使用は中止扱いで、正しい元素材を受領し次第、再生成して差し替える。

| ID | 公開ファイル | 内容 | 掲載 |
| --- | --- | --- | --- |
| b07-01 | gallery/mily-b07-01-morning-story.mp4 | 2026-08-20 朝の Instagram Story。owner-provided | ⏸ 差し替え待ち |
| b07-01 poster | gallery/mily-b07-01-morning-story-poster.jpg | 公開MP4の 4.5 秒地点の実フレーム | ⏸ 差し替え待ち |

### 元素材の同一性が未確認

オーナーが一次資料として指定した実測値と、作業セッションに届いたファイルの実測値が
一致していない。**両者が同じ動画かどうかは確認できていないため、推測を書かない。**

| 項目 | オーナー指定の一次資料 | セッションに届いたファイル |
| --- | --- | --- |
| 解像度 | 512×910 | 720×1280 |
| sha256 | `31ffbec448dd275cc2f2a09fd033c204532acef11a1686e197327ab3ba2a2a5b` | `4841b24b742811cf6a21c43d2e7aef22f38825800368ced2abf65ff2a881432b` |
| creation_time | 2026-08-19T23:43:39Z | 2026-08-19T23:39:05Z |
| size | — | 6,942,827 bytes |
| duration | 5.100 秒 | 5.100 秒 |
| fps | 30 | 30 |
| codec / profile | H.264 High | H.264 High |
| pixel format | yuv420p | yuv420p |
| 音声 | なし | なし |

2 回のアップロードで届いたファイルはバイト単位で同一（どちらも sha256 `4841b24b7428…`）で、
いずれもオーナー指定の実測値と一致しない。

### 差し替え時に満たすこと

正しい元素材（sha256 `31ffbec448dd275c…` / 512×910 / creation_time 2026-08-19T23:43:39Z）を
`media/original/mily-b07-01-morning-story.mp4`（gitignore 済み・無改変）へ置き、そこから再生成する。

- 512×910 を維持。アップスケール・ダウンスケール・トリミング・引き伸ばしなし（`-vf scale` を使わない）
- H.264 Baseline 系（Constrained Baseline）/ yuv420p / `+faststart`（moov < mdat）
- 元素材に音声が無いため、音声トラックを新規生成しない
- metadata 除去（`creation_time` / `handler_name: "Core Media Video"` を残さない）
- poster は再生成後の公開MP4の実フレームから作る。AI 生成・顔加工・generative fill・outpainting なし
- `src/data/morningStory20260820.json` の `width` / `height` を 512 / 910 にする

再生成コマンド:

```
ffmpeg -i media/original/mily-b07-01-morning-story.mp4 \
  -map 0:v:0 -an \
  -map_metadata -1 -map_metadata:s:v -1 -map_chapters -1 \
  -c:v libx264 -profile:v baseline -level 3.1 -crf 23 -preset slow \
  -pix_fmt yuv420p -movflags +faststart \
  public/media/gallery/mily-b07-01-morning-story.mp4

ffmpeg -i public/media/gallery/mily-b07-01-morning-story.mp4 -ss 4.5 -frames:v 1 -q:v 4 \
  public/media/gallery/mily-b07-01-morning-story-poster.jpg
```

### 差し替え対象にならない確認済み事項

- 受領日 / source date: 2026-08-20（owner-provided。オーナーが依頼時に直接提供）
- Instagram Story（恒久的な公開 permalink なし。表示は非リンクの `Instagram Story` label）
- 元素材は `media/original/` に無改変で保管し、commit しない（gitignore 済み）
- AI 生成素材ではない。AI による加工も一切行っていない
- 文言・日付の確認に使った Instagram 閲覧画面のスクリーンショットは**確認資料のみ**。
  `public/` にも git にもコミットしていない（`scripts/morning-story-20260820.test.mjs` で検査）
- 元 Drive URL / 受け渡し URL は記録しない
