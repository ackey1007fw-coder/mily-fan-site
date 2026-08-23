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

掲載ゲートを通過したオーナー提供・掲載承認済み素材は、原則としてサイトへ掲載する。
非掲載を初期値にせず、Story / Latest / NEWS / Gallery 等のどの掲載面が適切かを先に判断する。
Gallery向きでない素材でも、Story / NEWS向きならその掲載面で扱う。

掲載しない場合は、素材台帳、PR本文、または最終報告に具体的な理由を記録する。主な理由は次のとおり。

- プライバシー上の問題
- 識別可能な第三者情報
- 出典 / 権利が未確認
- 既存公開素材との重複
- 公開用として不足する品質
- 文脈に合う掲載面がない
- 互換性・変換失敗などの技術的問題

「安全なので載せない」を理由にせず、問題がある場合は該当するゲート項目を具体的に示す。
原則掲載であっても、出典・権利・プライバシー・第三者情報・公開派生の品質確認は省略しない。

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

- この項目は一般メディアの掲載原則に対する追加安全条件であり、以下を満たした場合だけ公開できる。
- 公開Story permalinkがない場合、素材受け渡し用のDrive URLを `sourceUrl`、caption、metadata、frontend dataへ残さない。表示は `Instagram Story` の非リンクlabelとする。
- owner-providedのクリーンな元動画をgitignored領域へ無改変で保存し、H.264 / AAC / `+faststart`、metadata除去済みの公開MP4を作る。
- posterは公開MP4の実フレーム候補を複数比較して選ぶ。AI生成・顔補正・塗り足しはしない。
- LatestとGalleryへ同じ投稿を出す場合、公開MP4 1本とposter 1枚を共有する。用途別コピーは作らない。
- Instagram UIを含む閲覧画面スクリーンショットは原則としてコメント確認資料に限り、
  公開assetやGalleryへ入れない。`docs/CONTENT-OPS.md` の限定例外をすべて満たし、
  当該画像のオーナー承認がある節目Storyだけは、記事内限定で公開できる。
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
一致しなかったファイルからの派生は公開していない。

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

## 素材台帳（batch b12 / 受領日・source date 2026-08-21）

本人Instagramの2026-08-21朝の「OHAYO!」Storyに使われた、オーナー直接提供の
短尺動画。Storyには恒久的な公開permalinkがないため、表示は非リンクの
`Instagram Story` labelとする。Instagramプロフィールへの導線は関連リンクであり、
Storyの出典として扱わない。

Latest と Gallery（動画アーカイブ）が同じ公開MP4・poster・manifest objectを共有する。
Drive Gallery（b02）・`/stories/`・`highlights.ts`・`contest.ts`・`events.ts`には含めない。

| ID | 公開ファイル | 内容 | 掲載 |
| --- | --- | --- | --- |
| b12-01 | `gallery/mily-b12-01-morning-ohayo-story.mp4` | 黒縁メガネのフェイスフィルターと「OHAYO!」の文字が表示された短い縦型自撮り動画。720×1280。owner-provided | ✅ Latest / Gallery |
| b12-01 poster | `gallery/mily-b12-01-morning-ohayo-story-poster.jpg` | 公開MP4の3.4秒地点の実フレーム。720×1280 | ✅ Latest / Gallery |

### 元素材の実測

- provenance: `owner-provided`（オーナー指定の受け渡しファイル。SNSから取得していない）
- 元素材は `media/original/5A997264-4F9F-4656-A3D9-65AABAFFDCB0.mp4` に受領時の名前のまま
  無改変で保管（gitignore済み・コミットしない）
- sha256: `a098302330a074fea5ca3aaf3a5bda826353d4bcb90be1ad357339626b770abf`
- 5,448,933 bytes / H.264 **High** / level 3.1 / **720×1280** / 30fps /
  123 frames / 4.100000秒 / yuv420p
- 音声: **HE-AAC** / 44,100 Hz / stereo / 52,972 bps / 4.014127秒
- 元metadata: format・video・audioの`creation_time: 2026-08-20T21:45:55Z`、
  `handler_name: "Core Media Video" / "Core Media Audio"`
- 依頼時の参考値（size・sha256・映像・音声仕様）と作業環境で受領したファイルの実測値は一致
- 元Drive URL / 受け渡しURL / Drive file IDは公開情報・tracked textとして記録しない

### 音声の扱い — 削除した

元素材にはHE-AAC / 44.1kHz / stereoの音声ストリームが含まれるが、再配信権を
確認できないため、公開派生はvideo-only（無音）とした。

音声の内容・由来・種類・権利者・楽曲名は確認できていないため、推測して記録しない。

### 公開MP4

- sha256: `21879d25f68724dc03fd44f2759049c01b76be24227dd0507f9c5c5fcf23a80d`
- 1,427,878 bytes / H.264 **Constrained Baseline** / level 3.1 / **720×1280** /
  30fps / 123 frames / 4.100000秒 / yuv420p / `has_b_frames` 0 /
  音声ストリームなし
- 元素材の縦横比・画素数・fpsを維持。アップスケール・ダウンスケール・トリミング・
  引き伸ばしなし（`-vf scale`を使っていない）
- `+faststart` 確認済み（`moov` offset 36 < `mdat` offset 1362）
- metadata除去確認済み（`-map_metadata -1` / `-map_metadata:s:v -1` /
  `-map_chapters -1`）。元の`creation_time`と`Core Media Video / Audio`は残っていない。
  残るのはmuxer既定のbrand / encoder / language / `VideoHandler`のみ
- AI生成・AI加工・顔補正・generative fill・outpaintingなし

エンコードコマンド（再現用）:

```
ffmpeg -i media/original/5A997264-4F9F-4656-A3D9-65AABAFFDCB0.mp4 \
  -map 0:v:0 -an \
  -map_metadata -1 -map_metadata:s:v -1 -map_chapters -1 \
  -c:v libx264 -profile:v baseline -level 3.1 -crf 23 -preset slow \
  -pix_fmt yuv420p -movflags +faststart \
  public/media/gallery/mily-b12-01-morning-ohayo-story.mp4
```

### poster

- 公開MP4の0.6 / 1.5 / 2.5 / 3.4秒地点から候補を抽出して比較し、正面に近く、
  瞬きや強いモーションブラーがなく、「OHAYO!」と縦構図が安定した3.4秒地点を採用
- 公開MP4の実フレームから生成。AI生成・顔加工・塗り足しなし
- sha256: `3a89a6cca53464d6653df7e22d51cfbe775328162a55ed208cb619ba12205bcd`
- 67,192 bytes / 720×1280 JPEG / EXIF・IPTC・XMP・ICCなし
- Instagram UIを含む確認用スクリーンショットからは作っておらず、確認資料も
  `public/`・Gallery・gitへ含めない
- `src/data/morningOhayo20260821.json` の1オブジェクトをLatest / Galleryで共有し、
  用途別のMP4・posterコピーは作っていない

poster生成コマンド（再現用）:

```
ffmpeg -ss 3.4 -i public/media/gallery/mily-b12-01-morning-ohayo-story.mp4 \
  -frames:v 1 -q:v 4 -map_metadata -1 \
  public/media/gallery/mily-b12-01-morning-ohayo-story-poster.jpg
```

## 素材台帳（batch b13 / 受領日・source date 2026-08-21）

同じ受領セットの2素材を用途別に管理する。b13-01はSHOWROOMファンルームの
Latest専用crop画像で、Galleryには掲載しない。b13-02はInstagram Storyの
Latest / Gallery共有動画。どちらもowner-providedで、AI生成・AI加工は行っていない。

| ID | 公開ファイル | 内容 | 掲載 |
| --- | --- | --- | --- |
| b13-01 | `news/mily-b13-01-fanroom-next-slot.jpg` | 09:17「みりぃからの連絡💌」カードだけを切り出した画像。443×313 | ✅ Latestのみ / Gallery禁止 |
| b13-02 | `gallery/mily-b13-02-event-story.mp4` | 配信へのお礼・次枠14:00・投稿時点順位・イベント参加理由を表示したInstagram Story。720×1280 | ✅ Latest / Gallery |
| b13-02 poster | `gallery/mily-b13-02-event-story-poster.jpg` | 公開MP4の10.0秒地点の実フレーム。720×1280 | ✅ Latest / Gallery |

### b13-01 SHOWROOMファンルーム画像

- provenance: `owner-provided`（オーナー提供スクリーンショット。SNSから取得していない）
- 生スクリーンショットは
  `media/original/8C35FA05-8AB0-427B-8238-F097183EA5F2.jpeg` に受領バイトを
  変えず保管（gitignore済み・コミットしない）
- 元画像実測: **109,264 bytes / 588×1280 JPEG / sRGB**
- 元画像sha256: `eca2478248f7465137f0224ec25d225c4a2bba84344c85fcbe62825fb03ccbf6`
- 事前に示された706×1536とは実寸が異なる。両者を同一解像度とは扱わず、
  実際に受領した588×1280を公開派生の基準にした
- 元画像にはEXIF / IPTCが含まれていたため、生スクリーンショットは非公開とし、
  公開cropをsharpで再エンコードしてmetadataを除去した
- crop: `left: 73 / top: 808 / width: 443 / height: 313`。706×1536用の確認済み候補を
  受領画像の実寸へ正規化し、09:17「みりぃからの連絡💌」カードだけが残ることを目視確認
- cropに残るのはカードのlabel・09:17・みりぃ本人の投稿本文だけ。他ファン名・
  他ファンコメント・オーナー自身のコメント・入力UI・前後の投稿カードは含めない
- 公開画像: 22,606 bytes / 443×313 JPEG / sha256
  `b23050a7714939a00c5d1f80b8a60f875d31d9d4a2969e9909527c76b2c8a9ff`
- 公開画像はEXIF / IPTC / XMP / ICCなし。決定的cropとJPEG再エンコードのみで、
  文字改変・AI生成・生成塗り足し・顔加工なし
- Latest / NEWS専用。`media.ts`・Gallery写真・`galleryVideos.ts`・Drive Gallery・
  `/stories/`には追加しない

cropコマンド相当（再現用）:

```
sharp(source)
  .extract({ left: 73, top: 808, width: 443, height: 313 })
  .jpeg({ quality: 82, progressive: true })
```

### b13-02 Instagram Story 元素材の実測

- provenance: `owner-provided`（指定の受け渡しファイル。SNSから取得していない）
- Instagram Story / source date: `2026-08-21` / 恒久permalinkなし
- 元素材は `media/original/51A32589-0C2D-443A-BAD1-A3076FA3C98C.mp4` に
  受領時の名前のまま無改変で保管（gitignore済み・コミットしない）
- sha256: `0f56cfb7d68a248f1a109a7a09aa1a5ae2ded95f9d8b62c5d7a95dcb1e8504ba`
- 613,963 bytes / H.264 **High** / level 3.1 / **720×1280** / **1fps** /
  20 frames / 20.000000秒 / yuv420p
- 音声: **HE-AAC** / 44,100 Hz / stereo / 56,636 bps / 19.919796秒
- 元metadata: format・video・audioの`creation_time: 2026-08-21T02:04:08Z`、
  `handler_name: "Core Media Video" / "Core Media Audio"`
- 依頼時の参考値（size・sha256・映像・音声仕様）と実ファイルの実測値は一致
- 受け渡し用Drive URL / file IDは公開情報・tracked textとして保持しない

### b13-02 音声の扱い — 削除した

元素材には音声ストリームが含まれるが、再配信権を確認できないため、
公開派生はvideo-only（無音）とした。音声の内容・由来・種類・権利者・楽曲名は
確認できていないため、推測して記録しない。

### b13-02 公開MP4

- sha256: `33b87f9c7f27761861cbc8e5689290b0f140e19c8e20274abca54e2ea5a50d61`
- 378,608 bytes / H.264 **Constrained Baseline** / level 3.1 / **720×1280** /
  **1fps** / 20 frames / 20.000000秒 / yuv420p / `has_b_frames` 0 /
  音声ストリームなし
- 元素材の画素数・縦横比・1fps・20秒を維持。crop・scale・引き伸ばし・
  アップスケール・fps水増しなし
- `+faststart`確認済み（`moov` offset 36 < `mdat` offset 935）
- metadata除去確認済み。元の`creation_time`と`Core Media Video / Audio`は残っていない。
  残るのはmuxer既定のbrand / encoder / language / `VideoHandler`のみ
- AI生成・AI加工・顔補正・generative fill・outpaintingなし

エンコードコマンド（再現用）:

```
ffmpeg -i media/original/51A32589-0C2D-443A-BAD1-A3076FA3C98C.mp4 \
  -map 0:v:0 -an \
  -map_metadata -1 -map_metadata:s:v -1 -map_chapters -1 \
  -c:v libx264 -profile:v baseline -level 3.1 -crf 23 -preset slow \
  -pix_fmt yuv420p -movflags +faststart \
  public/media/gallery/mily-b13-02-event-story.mp4
```

### b13-02 poster / 共有範囲

- 公開MP4の5.0 / 10.0 / 15.0秒地点を比較。ほぼ静止したStoryカードで差がないため、
  10.0秒地点を採用
- 公開MP4の実フレームから生成。AI生成・顔加工・文字改変・塗り足しなし
- 137,554 bytes / 720×1280 JPEG / sha256
  `3011127663a1b30d73f0b09063d3a66fe6234d8a9686305b2fa576978b33d099`
- EXIF / IPTC / XMP / ICCなし
- `src/data/eventStory20260821.json` の1オブジェクトをLatest / Galleryで共有し、
  公開MP4 1本・poster 1枚だけを参照する
- StoryのInstagramプロフィール導線はNewsの関連リンクであり、manifestの
  `sourceUrl`やStoryの出典ではない
- `events.ts`・`streamSchedule.ts`・配信予定API・`contest.ts`・`highlights.ts`・
  `/stories/`・Drive Galleryには追加しない

poster生成コマンド（再現用）:

```
ffmpeg -ss 10.0 -i public/media/gallery/mily-b13-02-event-story.mp4 \
  -frames:v 1 -q:v 4 -map_metadata -1 \
  public/media/gallery/mily-b13-02-event-story-poster.jpg
```

## 素材台帳（batch b14 / 受領日・source date 2026-08-21）

本人Xの2026-08-21「急遽なガンダ」投稿に添付された、オーナー直接提供の縦写真。
Latest / NEWS専用の自己ホスト画像として扱い、Gallery・Gallery動画・`/stories/`には追加しない。

一次出典: https://x.com/mily_chan36/status/2090722156162478273

| ID | 公開ファイル | 内容 | 掲載 |
| --- | --- | --- | --- |
| b14-01 | `news/mily-b14-01-ganda-before-night-stream.jpg` | 黒いキャップとマスク姿で青空と太陽を背にした縦写真。写真内に昼枠配信と23:00からの配信についての文字を表示。720×1280。owner-provided | ✅ Latestのみ / Galleryには追加しない |

確認済み:

- provenance: `owner-provided`（オーナーが依頼時に直接提供。SNSから取得していない）
- 元素材は `media/original/mily-b14-01-ganda-before-night-stream.jpg`
  （gitignore済み・受領バイトを変えず保管・コミットしない）
- 元素材の実測: **130,379 bytes / JPEG / 720×1280 / sRGB / sha256
  `c41bb38ed42cbdf1133583f904c78475c1d683cef6ac3d1727327fde080c9a3e`**
- 依頼時の参考値（272,462 bytes / 864×1536 / sha256 `db8d7b463bbb…`）とは一致しない。
  同一ファイルとは推測せず、作業環境で実際に受領した720×1280ファイルを基準にした
- 元素材にはEXIF（138 bytes）とIPTC（54 bytes）が存在。orientationは1で、GPSタグ・
  XMP・ICCは検出されていない。公開前にsharpでJPEG再エンコードし、metadataを除去した
- 公開ファイルの実測: **92,816 bytes / JPEG progressive / 720×1280 / sRGB / sha256
  `3d821f2bdee3b1c0d46ed834d31a168c03199285012d87bb53f308ff0cbcb5dc`**
- 公開ファイルはEXIF / GPS / IPTC / XMP / ICC / orientation / commentなし
- 再エンコードはsharpのJPEG quality 82 / progressiveのみ。**crop・scale・rotate・
  アップスケール・縦横比変更・写真内文字の改変なし**。720:1280の縦構図をそのまま使用
- 元画像と公開画像の同位置画素を比較した平均絶対差は1.0313（8bit / channel）。
  metadata除去以外の構図変更がないことを確認した
- AI生成・AI補正・顔加工・顔置換・generative fill・outpaintingなし
- `src/data/media.ts`・`src/data/galleryVideos.ts`・`src/data/stories.ts`には追加していない
- 撮影者は未確認のため記録しない。X画像URL・受け渡しURLは公開情報へ残さない

## 素材台帳（batch b15 / 受領日・source date 2026-08-21）

2026-08-21のTikTok通常投稿に使われた、オーナー直接提供の短尺動画。
LatestとGallery（動画アーカイブ）が同じ公開MP4・poster・manifest objectを共有する。
Drive Gallery（b02）・`/stories/`・`events.ts`・`profile.ts`・`highlights.ts`には含めない。

一次出典: https://www.tiktok.com/@seasidecircle/video/7676407054466174229

| ID | 公開ファイル | 内容 | 掲載 |
| --- | --- | --- | --- |
| b15-01 | `gallery/mily-b15-01-tiktok-radio-misscircle.mp4` | 室内でカメラに向かい、手でポーズを取りながら表情を変える短い縦型動画。720×1280。owner-provided | ✅ Latest / Gallery |
| b15-01 poster | `gallery/mily-b15-01-tiktok-radio-misscircle-poster.jpg` | 公開MP4の5.5秒地点の実フレーム。720×1280 | ✅ Latest / Gallery |

### 元素材の実測

- provenance: `owner-provided`（オーナー指定の受け渡しファイル。SNSから取得していない）
- 元素材は `media/original/` に受領時の名前のまま無改変で保管
  （gitignore済み・コミットしない。ランダムな受領時名はtracked textへ記録しない）
- sha256: `40af17f54b7d254d7e337a41cf86d6ec7309985725a928ae0fc0929620b3d50f`
- 1,339,785 bytes / H.264 **High** / level 3.1 / **720×1280** / 30fps /
  337 frames / video 11.233984秒 / container 11.238000秒 / yuv420p
- 音声: **HE-AACv2** / 44,100 Hz / stereo / 64,146 bps / 11.237007秒
- chapterなし。元metadataにはTikTok由来の`aigc_info` / `comment` / `vid_md5`と
  muxer既定のbrand / encoder / language / handlerが存在
- 依頼時の参考値512×910とは解像度が異なる。実際に受領した720×1280のファイルを
  公開派生の基準とし、参考値へ合わせる縮小や別ファイルとの同一視はしていない
- 素材受け渡し用URL / file IDは公開情報・tracked textとして記録しない

### 音声の扱い — 削除した

元素材にはHE-AACv2 / 44.1kHz / stereoの音声ストリームがあるが、音声の内容・由来・
権利者と再配信権を確認できないため、公開派生はvideo-only（無音）とした。
楽曲・BGM・本人音声のいずれかは推測して記録しない。

### 公開MP4

- sha256: `c88244c0ea987840c5525d4a00fee6739d3eac5ba6b5a66389b56e05b2b52266`
- 2,564,584 bytes / H.264 **Constrained Baseline** / level 3.1 / **720×1280** /
  30fps / 337 frames / 11.233984秒（container 11.234000秒）/ yuv420p /
  `has_b_frames` 0 / 音声ストリームなし
- 元素材の画素数・9:16の縦横比・30fps・映像フレーム数を維持。
  crop・scale・引き伸ばし・アップスケール・fps水増しなし
- `+faststart`確認済み（`moov` offset 36 < `mdat` offset 2255）
- metadata除去確認済み（`-map_metadata -1` / `-map_metadata:s:v -1` /
  `-map_chapters -1`）。元の`aigc_info` / `comment` / `vid_md5`は残っていない。
  残るのはmuxer / encoder既定のbrand / encoder / language / `VideoHandler`のみ
- AI生成・AI加工・顔補正・generative fill・outpaintingなし

エンコードコマンド（再現用）:

```
ffmpeg -i media/original/<受領時ファイル名>.mp4 \
  -map 0:v:0 -an \
  -map_metadata -1 -map_metadata:s:v -1 -map_chapters -1 \
  -c:v libx264 -profile:v baseline -level 3.1 -crf 23 -preset slow \
  -pix_fmt yuv420p -movflags +faststart \
  public/media/gallery/mily-b15-01-tiktok-radio-misscircle.mp4
```

### poster / 共有範囲

- 2.0 / 5.5 / 9.5秒地点を比較。2.0秒は視線が下向き、9.5秒は動きが大きいため、
  正面に近く表情と手元が安定している5.5秒地点を採用
- 公開MP4の実フレームから生成。AI生成・顔加工・塗り足しなし
- 41,483 bytes / 720×1280 JPEG / sha256
  `d212e6675cbbf52c133086372569a500c9b54ea2b25e2c13f754a708a255805a`
- EXIF / IPTC / XMP / ICCなし。TikTok閲覧画面のスクリーンショットからは作っていない
- `src/data/tiktokRadioVideo.json` の1オブジェクトをLatest / Galleryで共有し、
  公開MP4 1本・poster 1枚だけを参照する

poster生成コマンド（再現用）:

```
ffmpeg -ss 5.5 -i public/media/gallery/mily-b15-01-tiktok-radio-misscircle.mp4 \
  -frames:v 1 -q:v 4 -map_metadata -1 \
  public/media/gallery/mily-b15-01-tiktok-radio-misscircle-poster.jpg
```

## 素材台帳（batch b16 / 受領日・source date 2026-08-22）

CAMPUS GIRLS 2027 予選A 2nd STAGE審査員賞の結果グラフィックと、
同日に本人が投稿したInstagram Story画像。結果グラフィックはStory / Latestで共有し、
Instagram Story画像はオーナーの当該画像に対する明示承認に基づき、節目Storyの記事内だけで
公開する。どちらもGalleryには追加しない。

本人X一次出典: https://x.com/mily_chan36/status/2090988000813654232

| ID | 公開ファイル | 内容 | 掲載 |
| --- | --- | --- | --- |
| b16-01 | `stories/campus-girls-2027-second-stage-jury-award/mily-b16-01-campus-girls-second-stage-jury-award.jpg` | CAMPUS GIRLS 2027 予選A 2nd STAGE審査員賞の結果グラフィック。受賞者5名の一人として三橋莉子を掲載。1280×862 | ✅ Story / Latest（1ファイルを共有） |
| b16-02 | `stories/campus-girls-2027-second-stage-jury-award/mily-b16-02-campus-girls-second-stage-instagram-story.jpg` | 審査員賞・予選ファイナル進出、挑戦への思い、公開結果投稿を表示した本人Instagram Story。720×1280 | ✅ 当該Story記事のみ / Latest・Gallery禁止 |

### b16-01 結果グラフィック

- provenance: `sns-post`
- source: 本人X投稿
  `https://x.com/mily_chan36/status/2090988000813654232`
- 公式CAMPUS BOYS / GIRLSの結果投稿URLは確実に確認できなかったため、推測で追加していない
- 元素材は
  `media/original/mily-b16-01-campus-girls-second-stage-jury-award.jpg`
  （gitignore済み・受領バイトを変えず保管・コミットしない）
- 元素材の実測: **150,012 bytes / JPEG / 1280×862 / sha256
  `a3006e79dce6178f7f2bd5fa9da0c4b12f75a7c0742d0dd4f27373cc6666f8b8`**
- 追加依頼時に「約2048×1380」と案内された再提供画像も、実際には前回と同じ
  **150,012 bytes / 1280×862 / 同一sha256**だった。高解像度版とは扱わず、
  現在の原本と公開派生を維持した
- 元素材にはEXIF（138 bytes）とIPTC（54 bytes）が存在。公開前にsharpで
  JPEG再エンコードし、metadataを除去した
- 公開ファイルの実測: **216,425 bytes / JPEG progressive / 1280×862 / sha256
  `73bc8e576e2da1bb265c67e759cbfd0764c9c8c8619792851edfbb1a8c656819`**
- 公開ファイルはEXIF / IPTC / XMP / ICCなし
- 再エンコードはsharpのJPEG quality 95 / progressive / 4:4:4のみ。
  **crop・scale・rotate・アップスケール・縦横比変更なし**。1280:862の横構図を維持した
- AI生成・AI補正・顔加工・人物削除・generative fill・outpaintingなし
- `src/data/campusGirlsSecondStageResultImage.ts` の1オブジェクトをStory / Latestで共有し、
  公開画像1枚だけを参照する
- `src/data/media.ts`・`src/data/galleryVideos.ts`には追加していない

### Instagram Storyスクリーンショット

- provenance: `owner-provided`（当該画像のStory記事掲載をオーナーが明示承認）
- source: `Instagram Story（2026年8月22日）` / 恒久permalinkなし・非リンク表示
- 元素材は
  `media/original/mily-b16-02-campus-girls-second-stage-instagram-story.jpg`
  （gitignore済み・受領バイトを変えず保管・コミットしない）
- 元素材の実測: **127,916 bytes / JPEG / 720×1280 / sha256
  `2324ae36cb81107c2cb05ab717bbd859e7b72702e371f0008f1faacdcd84d768`**
- 追加依頼時に「864×1536目安」と案内された再提供画像も、実際には前回と同じ
  **127,916 bytes / 720×1280 / 同一sha256**だった。実際の受領ファイルを原本とした
- 元素材にはEXIF（138 bytes）とIPTC（54 bytes）が存在。公開前にsharpで
  JPEG再エンコードし、metadataを除去した
- 公開ファイルの実測: **153,111 bytes / JPEG progressive / 720×1280 / sha256
  `4cf8b0fce3e1ac242c4d3c542701c6bbd8f6e62b6810b6bb0c910854ba07658f`**
- 公開ファイルはEXIF / IPTC / XMP / ICCなし
- 再エンコードはsharpのJPEG quality 95 / progressive / 4:4:4のみ。
  **crop・scale・rotate・アップスケール・縦横比変更・内容削除なし**
- AI生成・AI補正・顔加工・人物削除・generative fill・outpaintingなし
- DM・非公開情報・通知・第三者コメント・端末情報は含まれない。Story内に表示される
  受賞者名・公開アカウント名は、本人が共有した公開結果投稿の表示内容である
- `src/data/campusGirlsSecondStageInstagramStoryImage.ts` を当該Story本文だけから参照し、
  lead image・NEWS / Latest・Portal Feed・`media.ts`・`galleryVideos.ts`へ展開しない
- InstagramプロフィールURLを出典として代用していない
- 依頼者の訂正により今回は動画素材なし。公開MP4・poster・動画manifestは作成していない

## 素材台帳（batch b17 / 受領日・source date 2026-08-22）

本人Xの2026-08-22夜のSHOWROOM配信お礼投稿に添付された、オーナー直接提供の横長SHOWROOM公開配信画面スクリーンショット。
Latest / NEWS専用の自己ホスト画像として扱い、Gallery・Gallery動画・Drive Gallery・`/stories/`・`highlights.ts`には追加しない。

一次出典: https://x.com/mily_chan36/status/2091166455224299641

| ID | 公開ファイル | 内容 | 掲載 |
| --- | --- | --- | --- |
| b17-01 | `news/mily-b17-01-night-showroom-fireworks.jpg` | 花火大会仕様のSHOWROOM公開配信画面。中央にみりぃ、画面下部に視聴者アバター・表示名が並ぶ横長画像。1206×555。owner-provided | ✅ Latestのみ / Galleryには追加しない |

確認済み:

- provenance: `owner-provided`（オーナーが依頼時に直接提供。SNSから自動取得していない）
- source date: `2026-08-22` / 一次出典は上記本人X投稿
- 元素材は `media/original/mily-b17-01-night-showroom-fireworks.jpg`
  （gitignore済み・受領バイトを変えず保管・コミットしない）
- 元素材の実測: **132,220 bytes / JPEG progressive / 1206×555 / sRGB / sha256
  `3409acb7c306f579561b77d96f3ee9f6df8be71cd5166b9e22340e6b1adde903`**
- 公開ファイル `public/media/news/mily-b17-01-night-showroom-fireworks.jpg` は元素材と
  **バイト単位で同一**（132,220 bytes / 同一sha256）。EXIF / GPS / IPTC / XMP / ICC /
  orientation / comment が存在しないことを確認済みのため、不要な再エンコードはしていない
- **crop・resize・rotate・アップスケール・縦横比変更・AI生成・AI補正・顔加工・
  generative fill・outpaintingなし**。1206:555の横構図をそのまま使用
- プライバシー・第三者表示の確認: DM・非公開メッセージ・電話番号・メール・住所・
  端末固有情報は含まれない。画面下部の視聴者アバター・表示名は、みりぃ本人がX投稿に
  添付して公開したSHOWROOM画面の表示内容であり、オーナーの掲載指示に基づき無改変で記録する。
  新しい第三者情報は付加していない
- 画像内の「現在48位」は公開画面の表示として画像に残すが、NEWS本文・`contest.ts`・
  `highlights.ts`・配信予定データへは転記しない
- Xの外部画像URLはhotlinkせず、自己ホスト画像だけを参照する
- `src/data/media.ts`・`src/data/galleryVideos.ts`・`src/data/stories.ts`・
  `src/data/highlights.ts`には追加していない。Latest / NEWS専用

## 素材台帳（2026-08-23 未明のSHOWROOMファンルーム / 公開cropなし）

地震直後のFan Roomやり取り（NEWS id `2026-08-23-earthquake-showroom-fanroom`）は
Latest / NEWSのテキスト記録のみ。公開cropは作っていない。

- 依頼時に示されたフルスクリーンショットには、みりぃとオーナー以外のファンの
  表示名・アバター・コメントが含まれる
- この作業環境では元素材の実バイトを再取得できず、第三者情報を目視で除外した
  privacy-safe cropを確定できなかった
- フルスクリーンショットを `public/` や git に入れない
- Gallery / `media.ts` / `galleryVideos.ts` / Drive Gallery / `/stories/` へ展開しない
- 新しいbatch番号は未使用のまま残す（決め打ちしない）

## 素材台帳（batch b18 / 受領日・source date 2026-08-23）

2026-08-23の地震後に投稿されたInstagram Story動画。owner-providedの縦型動画で、
既存の地震NEWS（id `2026-08-23-earthquake-showroom-fanroom`）と Gallery が
同じ公開MP4・poster・manifest objectを共有する。Fan Roomスクリーンショット
（上記の非公開判断）とは別素材。Drive Gallery（b02）・`/stories/`・
`events.ts`・`streamSchedule.ts`には含めない。新しい地震NEWSは作っていない。

恒久的な公開permalinkがないため、表示は非リンクの `Instagram Story` label。
受け渡し用URL / file IDは公開情報・tracked textとして記録しない。

| ID | 公開ファイル | 内容 | 掲載 |
| --- | --- | --- | --- |
| b18-01 | `gallery/mily-b18-01-earthquake-safety-story.mp4` | 地震後、関東圏の人たちの無事を気遣い、落ち着いて身の安全を確保するよう呼びかける縦型動画。720×1280。owner-provided | ✅ Latest / Gallery |
| b18-01 poster | `gallery/mily-b18-01-earthquake-safety-story-poster.jpg` | 公開MP4の8.0秒地点の実フレーム。720×1280 | ✅ Latest / Gallery |

### 元素材の実測

- provenance: `owner-provided`（オーナー指定の受け渡しファイル。SNSから取得していない）
- Instagram Story / source date: `2026-08-23` / 恒久permalinkなし
- 元素材は `media/original/mily-b18-01-earthquake-safety-story.mp4` に
  受領バイトを変えず保管（gitignore済み・コミットしない）
- sha256: `29a6202b7c646e230797ddcb75d75eec865ccd3fa9e838c1d08043884a03de18`
- 19,976,089 bytes / H.264 **High** / level 3.1 / **720×1280** / 30fps /
  819 frames / **27.300000秒** / yuv420p / `has_b_frames` 2
- 音声ストリームなし。chapterなし
- 元metadata: format・videoの`creation_time: 2026-08-22T23:20:49.000000Z`、
  `handler_name: "Core Media Video"`
- 公開派生ではmetadataを除去した。投稿時刻は推測して記録しない

### 公開MP4

- sha256: `c80e2d99cce5e5c9e5cfd0ec8e565938fbb5bec81d78900010c69ef4ead0d130`
- 1,524,443 bytes / H.264 **Constrained Baseline** / level 3.1 / **720×1280** /
  30fps / 819 frames / 27.300000秒 / yuv420p / `has_b_frames` 0 /
  音声ストリームなし
- 元素材の画素数・縦横比・30fps・映像フレーム数を維持。
  crop・scale・引き伸ばし・アップスケール・fps水増しなし（`-vf scale`を使っていない）
- 音声トラックは元素材に無いため追加・生成していない
- `+faststart`確認済み（`moov` offset 36 < `mdat` offset 4158）
- metadata除去確認済み（`-map_metadata -1` / `-map_metadata:s:v -1` /
  `-map_chapters -1`）。元の`creation_time`と`Core Media Video`は残っていない。
  残るのはmuxer既定のbrand / encoder / language / `VideoHandler`のみ
- AI生成・AI加工・顔補正・generative fill・outpainting・テロップ削除・短縮なし

エンコードコマンド（再現用）:

```
ffmpeg -i media/original/mily-b18-01-earthquake-safety-story.mp4 \
  -map 0:v:0 -an \
  -map_metadata -1 -map_metadata:s:v -1 -map_chapters -1 \
  -c:v libx264 -profile:v baseline -level 3.1 -crf 23 -preset slow \
  -pix_fmt yuv420p -movflags +faststart \
  public/media/gallery/mily-b18-01-earthquake-safety-story.mp4
```

### poster / 共有範囲

- 公開MP4の4.0 / 5.0 / 6.0 / 8.0 / 13.6 / 16.0 / 20.0 / 24.0秒地点を比較。
  4〜6秒と中盤・20秒前後は手元のノートに視線が落ちているため、
  顔が安定して見え、テロップが読める8.0秒地点を採用
- 公開MP4の実フレームから生成。AI生成・顔加工・塗り足しなし
- 46,811 bytes / 720×1280 JPEG / sha256
  `8051dc985cf9e19a5f61476530dd8d3d210ba06368212d31c08bbdd00571edfa`
- EXIF / IPTC / XMP / ICCなし
- `src/data/earthquakeSafetyStoryVideo.json` の1オブジェクトをLatest / Galleryで共有し、
  公開MP4 1本・poster 1枚だけを参照する
- InstagramプロフィールURLをStoryの出典として代用していない
- 受け渡し用URL / file IDは公開情報へ残さない

poster生成コマンド（再現用）:

```
ffmpeg -ss 8.0 -i public/media/gallery/mily-b18-01-earthquake-safety-story.mp4 \
  -frames:v 1 -q:v 4 -map_metadata -1 \
  public/media/gallery/mily-b18-01-earthquake-safety-story-poster.jpg
```

