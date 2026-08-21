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

| ID | 公開ファイル | 内容 | 掲載 |
| --- | --- | --- | --- |
| b07-01 | gallery/mily-b07-01-morning-story.mp4 | 2026-08-20 朝の Instagram Story。512×910。owner-provided | ✅ |
| b07-01 poster | gallery/mily-b07-01-morning-story-poster.jpg | 公開MP4の 4.5 秒地点の実フレーム。512×910 | ✅ |

確認済み:

- 受領日 / source date: 2026-08-20（owner-provided。オーナーが依頼時に直接提供）
- Instagram Story（恒久的な公開 permalink なし。表示は非リンクの `Instagram Story` label）
- 元素材は `media/original/mily-b07-01-morning-story.mp4`（gitignore 済み・無改変・コミットしない）
  sha256: `31ffbec448dd275cc2f2a09fd033c204532acef11a1686e197327ab3ba2a2a5b`
  （オーナー提供の handoff zip に添付された SHA256 と照合して一致を確認してから使用）
- 元素材の実測: 3,174,143 bytes / 512×910 / 5.100 秒 / 30fps / H.264 High / yuv420p /
  音声なし / creation_time 2026-08-19T23:43:39Z
- 公開MP4の実測: 1,005,126 bytes / **512×910** / 5.100 秒 / 30fps /
  H.264 **Constrained Baseline** / level 3.1 / yuv420p / 音声ストリームなし
- faststart 確認済み（`moov` offset 36 < `mdat` offset 1467）
- metadata 除去確認済み（`-map_metadata -1` / `-map_metadata:s:v -1` / `-map_chapters -1`。
  `creation_time` と `handler_name: "Core Media Video"` は残っていない。
  残るのは muxer 既定の `major_brand` / `minor_version` / `compatible_brands` / `encoder` /
  `language` / `handler_name: "VideoHandler"` のみ）
- **アップスケール・ダウンスケール・トリミング・引き伸ばしなし。** 元素材の 512×910 をそのまま維持
  （`-vf scale` を使っていない）。音声は元素材に無いため新規生成していない
- poster は公開MP4の実フレーム（4.5 秒）。AI 生成・顔加工・generative fill・outpainting なし。
  Instagram 閲覧画面のスクリーンショットからは作っていない
- AI 生成素材ではない。AI による加工も一切行っていない
- 文言・日付の確認に使った Instagram 閲覧画面のスクリーンショットは**確認資料のみ**。
  `public/` にも git にもコミットしていない（`scripts/morning-story-20260820.test.mjs` で検査）
- 元 Drive URL / 受け渡し URL は記録しない

### 素材差し替えの経緯

最初の受け渡しで作業環境に届いたファイルは 720×1280 / sha256 `4841b24b7428…` /
creation_time 2026-08-19T23:39:05Z で、オーナーが一次資料として指定した実測値と一致しなかった。
**両者が同じ動画かどうかは確認していない**（推測を記録しない）。
その後 zip 経由で sha256 `31ffbec448dd275c…` の元素材を受領し、照合が一致したため、
公開MP4と poster をこの元素材から作り直して差し替えた。
一致しなかったファイルからの派生は公開していない。

エンコードコマンド（再現用）:

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

## 素材台帳（batch b08 / 受領日 2026-08-20）

Latest の 2026-08-20「おはよう‼︎🌞 無理せず、今日も一緒に」X投稿専用の記事写真。
b06 と同じ扱いで、Drive Gallery（b02）にも `public/media/gallery/`（Gallery 掲載枠）にも
含めない。Latest のカード内で1ファイルだけ自己ホストする。

同じ元素材を **Latest と Gallery の2用途で掲載**している（意図的。別素材として扱わない）。
Latest は単体ファイル1枚、Gallery は既存フロー `pnpm media:build` の派生セット。

| ID | 公開ファイル | 用途 | 内容 | 掲載 |
| --- | --- | --- | --- | --- |
| b08-01（Latest） | media/news/mily-b08-01-do-what-you-can-morning.jpg | Latest カード内 | 室内の鏡の前でスマートフォンを持つミラーセルフィー。1538×2048。owner-provided | ✅ |
| b08-01（Gallery） | gallery/mily-b08-01-do-what-you-can-morning-{480,960,1600}.{jpg,webp} | Gallery タイル | 上と同じ元素材の通常派生 | ✅ |

確認済み:

- provenance: owner-provided（オーナーが依頼時に直接提供。SNSから取得していない）
- 元素材は `media/original/mily-b08-01-do-what-you-can-morning.jpg`（gitignore 済み・無改変・コミットしない）
  sha256: `c080c0d782b1c786d26570ef1961033ea8e5f7c9812a7fddbcbc958ff7993ddb`
- 実測値（作業環境に届いたファイルを `file` と sharp で再確認したもの。オーナー申告の
  1538×2048 と一致）: 191,281 bytes / **1538×2048** / JPEG progressive / 8bit / 3ch / sRGB
- **公開ファイルは元素材のバイト単位で同一のコピー**（sha256 一致）。再エンコード・
  トリミング・回転・拡縮・アップスケールなし。b06 と同じ判断で、画質劣化を避けるため
  派生を作らずそのまま置いた
- メタデータ判断の根拠: JPEG のマーカーを走査した結果、含まれるセグメントは
  `APP0(JFIF)` / `DQT` / `SOF2` / `DHT` / `SOS` のみ。**EXIF / GPS / IPTC / XMP / ICC /
  COM はいずれも無い**（sharp の `metadata()` でも `exif` / `iptc` / `xmp` / `icc` が
  すべて undefined、`orientation` も undefined）。除去すべきプライバシーメタデータが
  無いため、安全な派生を作る必要はなかった
- AI 生成・AI 補正・顔加工・generative fill・outpainting なし。
  1538:2048 の縦構図をそのまま表示（`object-contain` 相当・トリミングなし）
- 出典は本人X投稿 `https://x.com/mily_chan36/status/2090242507586322892`（2026-08-20 / 約10:00 JST）
- 撮影者（credit）は未確認のため記録しない
- 動画アーカイブ（`galleryVideos.ts`）・`/stories/` へは複製しない
- 元 Drive URL / 受け渡し URL は記録しない

### Gallery 掲載の追記（2026-08-20）

Latest 掲載（上記）に加えて、**同じ owner-provided 元素材から Gallery 用派生を追加**した。
SNS から再取得しておらず、X の画像 URL も hotlink していない。新しい batch は作らず、
同一素材として `src/data/media.ts` の `mily-b08-01` で表現する。

| 項目 | 値 |
| --- | --- |
| batch | b08（新規 batch を作らず既存 b08 を Gallery にも展開） |
| provenance | owner-provided |
| 元素材 | `media/original/mily-b08-01-do-what-you-can-morning.jpg`（gitignore 済み・無改変・コミットしない） |
| Latest 用公開パス | `public/media/news/mily-b08-01-do-what-you-can-morning.jpg`（**変更なし・維持**） |
| Gallery 用公開パス | `public/media/gallery/mily-b08-01-do-what-you-can-morning-{480,960,1600}.{jpg,webp}` |
| 元画像実測 | **1538×2048**（JPEG progressive / sRGB / 191,281 bytes） |
| 一次出典 | 本人X投稿 `https://x.com/mily_chan36/status/2090242507586322892` |
| `sourceDate` | `2026-08-20`（一次出典で確認済み） |
| `credit` | `null`（撮影者は未確認。推測して埋めない） |

Gallery 派生のメモ:

- 生成は既存フローの `pnpm media:build` のみ。独自手順・独自ルールは追加していない
- 元素材が 1538px 幅のため、`-1600` は拡大されず **1538×2048** のまま出力される
  （`build-media.mjs` の `withoutEnlargement`）。`media.ts` の `width` / `height` は
  実寸の 1538×2048 を記録する
- 実測した派生: 480×639 / 960×1278 / 1538×2048（jpg・webp とも）。
  高さはいずれも縦横比どおりの値で、**トリミング・引き伸ばし・アップスケールなし**
- 縦写真なので `media.ts` に `aspect: "1538 / 2048"` を指定し、Gallery タイル既定の
  4/3 へ切り抜かない。既存の横写真は `aspect` を持たないため表示は従来どおり
- sharp が既定でメタデータを落とすため、派生に **EXIF / GPS / IPTC / XMP / ICC は残っていない**
  （生成後に全6ファイルで確認済み）
- **AI 生成・AI 補正・顔加工・generative fill・outpainting なし。** 派生は元素材の単純な縮小で、
  回帰テストが元素材からの再縮小と画素比較して検証する
  （`scripts/gallery-20260820-morning-photo.test.mjs`）
- Latest 用の公開ファイルは Gallery 追加後も**元素材とバイト単位で同一のまま**（差し替えていない）

## 素材台帳（batch b09 / 受領日 2026-08-20 / source date 2026-08-19）

2026-08-19 の「2次審査通過」を報告した Instagram Story 動画。b03 / b07 と同じく
Drive Gallery（b02）には含めない独立動画で、**STORY 記事
`/stories/second-round-result-2026/` と Gallery の動画アーカイブが同じ公開MP4と
poster を共有する**（用途別コピーを作らない）。

この Story は既存の記事・X投稿・写真を**補強する一次資料**として足したもので、
news item の新規追加も、既存X投稿の複製も、b05-01 写真の再追加もしていない。

| ID | 公開ファイル | 内容 | 掲載 |
| --- | --- | --- | --- |
| b09-01 | gallery/mily-b09-01-second-round-story.mp4 | 2026-08-19 の2次審査通過報告 Instagram Story。512×910。owner-provided | ✅ |
| b09-01 poster | gallery/mily-b09-01-second-round-story-poster.jpg | 公開MP4の **5.0 秒地点**の実フレーム。512×910 | ✅ |

確認済み:

- provenance: **owner-provided**（オーナーが依頼時に直接提供。SNSから取得していない）
- 表示は非リンクの `Instagram Story` label。**source date: 2026-08-19**
- 元素材は `media/original/mily-b09-01-second-round-story.mp4`
  （gitignore 済み・無改変・コミットしない）
  sha256: `f426810ca76b2c8a9a6d10212853e67a4e20de172565bbf60285fc8ffa3f63f1`

### 元素材の実測値

オーナー提供の handoff zip 同梱 `SHA256SUMS.txt` / `METADATA.txt` と照合し、
**一致を確認してから**使用した。

| 項目 | 実測値 |
| --- | --- |
| size | 6,835,350 bytes |
| video | H.264 **High** / level 3.1 / **512×910** / **30fps** / yuv420p / `has_b_frames` 2 / 571 frames |
| video duration | 19.033333 秒 |
| audio | **HE-AAC** / 48,000 Hz / stereo / 53,395 bps / 19.921667 秒 |
| container duration | 19.921667 秒 |
| 元 metadata | `creation_time` 2026-08-20T03:15:15Z / `handler_name: "Core Media Video" / "Core Media Audio"` |

### 素材受け渡しの経緯

最初の受け渡しで作業環境に届いたファイルは sha256 `d37cbfb2827fad6e…` /
912,910 bytes / **720×1280** / **1fps** で、オーナーが一次資料として指定した実測値と
一致しなかった。**元素材に対する拡大（512→720）にあたるため、このファイルからの
派生は作らず公開もしていない**（b07 と同じ判断）。
その後 zip 経由で sha256 `f426810c…` の元素材を受領し、`sha256sum -c` と ffprobe の
両方で一致を確認したうえで、公開MP4と poster をこの元素材だけから作った。

### 公開MP4の実測値

| 項目 | 実測値 |
| --- | --- |
| path | `public/media/gallery/mily-b09-01-second-round-story.mp4` |
| sha256 | `d90d27a077daf396b3367bf938758c0e73d3767d373f13f5537849f201a47dae` |
| size | 487,137 bytes |
| video | H.264 **Constrained Baseline** / level 3.1 / **512×910** / **30fps** / yuv420p / `has_b_frames` 0 / 571 frames |
| duration | 19.034 秒 |
| audio | **ストリームなし**（下記「音声の扱い」） |
| faststart | ✅ `moov` offset 36 < `mdat` offset 3147 |

- **アップスケール・ダウンスケール・トリミング・引き伸ばしなし。** 元素材の
  512×910 / 30fps をそのまま維持している（`-vf scale` を使っていない）
- AI 生成・AI 加工・顔補正・generative fill・outpainting は一切なし
- metadata 除去確認済み（`-map_metadata -1` / `-map_metadata:s:v -1` / `-map_chapters -1`。
  `creation_time` と `handler_name: "Core Media Video"` は残っていない。残るのは muxer 既定の
  `major_brand` / `minor_version` / `compatible_brands` / `encoder` / `language` /
  `handler_name: "VideoHandler"` のみ）

### 音声の扱い — 削除した

元素材には HE-AAC / 48kHz / stereo の音声がある。公開前に確認したところ、
**19.9 秒間を通して連続した音声**が入っていた（実測: mean_volume −17.3 dB /
max_volume −4.6 dB、−50dB を 1 秒以上下回る無音区間なし）。

**この音源の権利関係・再配信権を確認できないため、公開派生は video-only（無音）にした。**
視覚内容（本人のメッセージ文・表情・画面表示）の保存を目的として音声を除去している。

音源の由来・種類・権利者・楽曲名は確認できていないため、**推測して記録しない**。

### poster

- 公開MP4の **5.0 秒地点の実フレーム**から抽出（AI 生成 poster 禁止）
- 抽出候補として 0.3 / 1.0 / 2.5 / 5.0 / 8.0 / 12.0 / 16.0 / 18.8 秒を実際に書き出して比較し、
  本文テキスト・本人の表情・画面下部のリンクステッカー表示がいずれも自然に読める
  5.0 秒を採用した（ほぼ静止Storyのため各時点の差は小さい）
- sha256: `48ced4349af7151e42fb32b60612a296f4a85d8b228676572571d578a6a77a2c` / 57,559 bytes / 512×910
- EXIF / IPTC / XMP / ICC なし（生成後に sharp で確認）
- Instagram 閲覧画面のスクリーンショットからは作っていない

### Story共有URLの扱い

確認時に参照した Instagram Story の共有 URL は**一時的なもの**であり、
`sourceUrl` / frontend data / caption / metadata / コード / docs の
**どこにも恒久 source として保存していない**。表示は非リンクの `Instagram Story` label のみ。
回帰テスト `scripts/second-round-story-video.test.mjs` が、commit 対象の全ファイルを
走査して Story 共有 URL が残っていないことを検査する。

### 既存素材との関係

- Story の**背景写真は既存の b05-01 と同じ落ち葉の写真**（元素材 sha256 先頭12桁
  `6d615b2b7354`）。すでに STORY と Gallery に掲載済みのため、
  **今回あらためて写真を追加・複製・再生成していない**
- STORY 記事と Gallery は `src/data/secondRoundStoryVideo.json` の 1 オブジェクトを共有し、
  **公開MP4 1本 / poster 1枚**だけを参照する
- Drive Gallery（b02）には混ぜていない
- 元 Drive URL / 受け渡し URL は記録しない

エンコードコマンド（再現用）:

```
ffmpeg -i media/original/mily-b09-01-second-round-story.mp4 \
  -map 0:v:0 -an \
  -map_metadata -1 -map_metadata:s:v -1 -map_chapters -1 \
  -c:v libx264 -profile:v baseline -level 3.1 -crf 23 -preset slow \
  -pix_fmt yuv420p -movflags +faststart \
  public/media/gallery/mily-b09-01-second-round-story.mp4

ffmpeg -i public/media/gallery/mily-b09-01-second-round-story.mp4 -ss 5.0 -frames:v 1 -q:v 4 \
  public/media/gallery/mily-b09-01-second-round-story-poster.jpg
```

## 素材台帳（batch b10 / 受領日・source date 2026-08-20）

本人Instagramのマンゴーかき氷投稿に使われた、オーナー直接提供の写真5枚。
Latest は b10-05 のメタデータ除去済み派生1枚、Gallery は5枚すべてを掲載する。
Drive Gallery（b02）・Gallery動画・`/stories/` には含めない。

一次出典: https://www.instagram.com/p/DcQqmIwk1_l/

| ID | 元ファイル | sha256（先頭12桁） | 内容 | 掲載 |
| --- | --- | --- | --- | --- |
| b10-01 | `mily-b10-01-mango-kakigori-closeup.jpg` | `7735df750fda` | マンゴーをのせたかき氷のクローズアップ | ✅ Gallery |
| b10-02 | `mily-b10-02-mango-kakigori-spoon.jpg` | `d622140bcd7d` | スプーンを手にかき氷を見つめるみりぃ | ✅ Gallery |
| b10-03 | `mily-b10-03-mango-kakigori-looking-down.jpg` | `1e4ccc97a839` | かき氷を前に目を閉じるみりぃ | ✅ Gallery |
| b10-04 | `mily-b10-04-mango-kakigori-expression.jpg` | `bc3f6e5bb8a5` | かき氷を前にスプーンを持つみりぃ | ✅ Gallery |
| b10-05 | `mily-b10-05-mango-kakigori-front.jpg` | `acb2fed12861` | かき氷とともにカメラを見るみりぃ | ✅ Latest / Gallery |

確認済み:

- provenance: `owner-provided`（オーナーが掲載用素材として直接提供。SNSから取得していない）
- 5枚とも元素材は `media/original/` に無改変で保管（gitignore済み・コミットしない）
- 元素材はすべて 960×1280 JPEG。EXIF / IPTC を含むため、公開用は既存の
  `pnpm media:build` で再エンコードしてメタデータを除去した
- Gallery は各写真につき 480 / 960 / 1600 × JPG / WebP。元素材幅が960pxのため
  `-1600` は `withoutEnlargement` により 960×1280 のまま（アップスケールなし）
- Latest 代表画像は b10-05 の `-1600.jpg` と同一内容の公開派生を
  `public/media/news/mily-b10-05-mango-kakigori-front.jpg` で使用。実寸 960×1280
- 公開画像に EXIF / GPS / IPTC / XMP / ICC は残っていない
- トリミング・引き伸ばし・生成塗り足し・AI生成・顔加工・顔置換なし
- `sourceDate`: `2026-08-20`（オーナー確認済み）。撮影者は未確認のため `credit: null`
- 全5枚に `aspect: "960 / 1280"` を設定し、Galleryの4:3既定枠へ切り抜かない
- 公開ファイル名は新規batch b10を使用し、既存batch・連番と衝突しない

## 素材台帳（batch b11 / 受領日・source date 2026-08-21）

本人Xの2026-08-21朝のSHOWROOM配信案内に添付された、オーナー直接提供の短尺動画。
Latest と Gallery（動画アーカイブ）が同じ公開MP4・poster・manifest objectを共有する。
Drive Gallery（b02）・`/stories/`・`highlights.ts`・`contest.ts`・`events.ts`には含めない。

一次出典: https://x.com/Mily_chan36/status/2090557839492460779

| ID | 公開ファイル | 内容 | 掲載 |
| --- | --- | --- | --- |
| b11-01 | `gallery/mily-b11-01-morning-showroom-runway.mp4` | 金色のハート型フィルターを使った短い縦型自撮り動画。720×1280。owner-provided | ✅ Latest / Gallery |
| b11-01 poster | `gallery/mily-b11-01-morning-showroom-runway-poster.jpg` | 公開MP4の2.0秒地点の実フレーム。720×1280 | ✅ Latest / Gallery |

### 元素材の実測

- provenance: `owner-provided`（オーナー指定の受け渡しファイル。SNSから取得していない）
- 元素材は `media/original/0a502bbfb722d82ea97313483c8a377dd97c9e38.mp4` に受領時の名前のまま無改変で保管
  （gitignore済み・コミットしない）
- sha256: `cf893d157551cfbee6db08665c7ad1ec17f9e08f5810c0a6bf730cdddeca68d3`
- 515,287 bytes / **720×1280** / 4.266667秒 / 30fps / 128 frames /
  H.264 High / level 3.1 / yuv420p / 音声ストリームなし
- 元metadata: format `creation_time: 2026-08-20T21:53:30Z`、video
  `handler_name: Twitter-vork muxer`。公開派生では除去した
- 事前の参考値（512×910）とは解像度が異なる。両者を同一コピーとは推測せず、
  Driveから実際に受領した720×1280のファイルを公開派生の基準にした
- 元Drive URL / 受け渡しURLは記録しない

### 公開MP4

- sha256: `93e83d049891da39cba505eff6c34a52c61b1ea84c67d7af145b472b1a62c8c7`
- 887,714 bytes / **720×1280** / 4.267秒 / 30fps / 128 frames /
  H.264 **Constrained Baseline** / level 3.1 / yuv420p / `has_b_frames` 0 /
  音声ストリームなし
- 元素材の縦横比と画素数を維持。アップスケール・ダウンスケール・トリミング・
  引き伸ばしなし（`-vf scale`を使っていない）。音声は新規生成していない
- `+faststart` 確認済み（`moov` offset 36 < `mdat` offset 1362）
- metadata除去確認済み（`-map_metadata -1` / `-map_metadata:s:v -1` /
  `-map_chapters -1`）。元の`creation_time`と`Twitter-vork muxer`は残っていない。
  残るのはmuxer既定のbrand / encoder / language / `VideoHandler`のみ
- AI生成・AI加工・顔補正・generative fill・outpaintingなし

エンコードコマンド（再現用）:

```
ffmpeg -i media/original/0a502bbfb722d82ea97313483c8a377dd97c9e38.mp4 \
  -map 0:v:0 -an \
  -map_metadata -1 -map_metadata:s:v -1 -map_chapters -1 \
  -c:v libx264 -profile:v baseline -level 3.1 -crf 23 -preset slow \
  -pix_fmt yuv420p -movflags +faststart \
  public/media/gallery/mily-b11-01-morning-showroom-runway.mp4
```

### poster

- 公開MP4の0.8 / 2.0 / 3.2秒地点から候補を抽出して比較し、カメラに正面から近い
  自然な構図の2.0秒地点を採用
- 公開MP4の実フレームから生成。AI生成・顔加工・塗り足しなし
- sha256: `8557df5f6ff909034fbcbde2ead6be75633fe165754b0cbe6eb9c42398703278`
- 20,575 bytes / 720×1280 JPEG / EXIF・IPTC・XMP・ICCなし
- `src/data/morningShowroomRunwayVideo.json` の1オブジェクトをLatest / Galleryで共有し、
  用途別のMP4・posterコピーは作っていない

poster生成コマンド（再現用）:

```
ffmpeg -ss 2.0 -i public/media/gallery/mily-b11-01-morning-showroom-runway.mp4 \
  -frames:v 1 -q:v 4 -map_metadata -1 \
  public/media/gallery/mily-b11-01-morning-showroom-runway-poster.jpg
```
