# Drive Gallery — batch b02

2026-08-15〜16 にオーナーから受領した Google Drive 素材を、既存 Gallery に追加するための運用メモです。

**このリポジトリは public です。Drive の識別子（file ID / フォルダ ID）も、原本も、元ファイル名も
一切コミットしません。** 配信するのは metadata を除去した派生ファイルだけです。

```
Drive 原本（手元へダウンロード）
        ↓
media/drive-b02-original/        gitignored ローカル入力（コミットしない）
        ↓ sanitize               sharp / ffmpeg（EXIF・GPS・IPTC・XMP を除去）
public/media/drive-gallery/      committed static assets
        ↓
src/data/driveGalleryManifest.json   生成物。client が読むのはこれだけ
        ↓
src/data/driveGallery.ts → src/components/Gallery.tsx
```

| ファイル | 役割 |
| --- | --- |
| `scripts/drive-gallery-source.mjs` | build-only 台帳。**Drive 識別子を持たない**（id / kind / alt / 状態のみ）。`src/` から import 禁止 |
| `scripts/build-drive-gallery.mjs` | ローカル入力を sanitize し manifest を生成（`pnpm drive-gallery:build`） |
| `media/drive-b02-original/` | 原本と private な id 対応表。gitignore 済み |
| `src/data/driveGalleryManifest.json` | 生成物。ローカルパスと alt だけ |
| `src/data/driveGallery.ts` | client 側。Drive URL も識別子も持たない |

固定テストは `scripts/drive-gallery.test.mjs`。

## Drive 共有を Restricted へ変更

受領フォルダの一般アクセスは「リンクを知っている全員: 閲覧者」から
**「制限付き（Restricted）」** へ変更しました。

理由:

- このリポジトリは public であり、**過去の commit に受領フォルダ ID と個別 file ID が残っている**
- Viewer 共有のままだと、GitHub の履歴を読んだ第三者が **sanitize 前の原本へ到達できる**

過去 history から識別子を完全に消去することはできません。**Restricted へ変更することで、
履歴に残る識別子を無効化します。** これが唯一の実効的な緩和策です。

現在のコードは Drive へ一切アクセスしないため、Restricted 化による影響はありません。

## 受領数と登録数

| 区分 | Drive 実数 | Gallery 登録数 | 公開候補 |
| --- | --- | --- | --- |
| 写真 | 46 | 46 | 45 |
| 動画 | 12 | 11 | 11 |
| 合計 | 58 | 57 | 56 |

**登録 57 件 / 公開候補 56 件**です。登録されていても privacy hold の 1 件
（`mily-drive-b02-p01`）は sanitize されず、表示対象からも外れます。

動画 12 件のうち 1 組は**同一ファイルの二重アップロード**でした。両方をダウンロードして
SHA256 を比較し、完全一致を確認済みです。

```
SHA256: 2ddb087117106bba9f24535fa32bf07e03daf60a3153c74982c68d75a1dadd39
```

一致したため Gallery では 1 件に統合しています。初回登録から漏れていた動画 1 本
（`mily-drive-b02-v11` / 湘南シーサイドサークルの 10:00〜13:00 放送案内）も追加済みです。

## public repo に置くもの・置かないもの

置いてよいもの:

- sanitized derivatives（`public/media/drive-gallery/`）
- ローカルアセットのパス
- alt
- エントリ id
- 生成 manifest
- 重複の SHA256 evidence
- privacy / publication の状態

**置かないもの:**

- Drive file ID
- Drive フォルダ ID
- Google Drive の source URL（thumbnail / preview / viewer / download すべて）
- 原本ファイル名
- 原本そのもの

テストが tracked file を全走査し、Drive ホスト・フォルダ URL・Drive ID 形状のトークンが
1 件も無いことを固定します。

走査は**拡張子に依存しません**。`git ls-files` で全 tracked file を列挙し、git 自身と同じ
判定（先頭 8000 バイトに NUL があれば binary）で text/binary を分けます。固定拡張子の
allowlist だと `.xml` `.svg` `.webmanifest` や将来増えるテキストファイルを見落とすためです。
実装は `scripts/scan-tracked-text.mjs`。一時 git リポジトリを使った回帰テストで、
`.xml` / `.svg` / `.webmanifest` 内の疑似トークンを検出すること、binary を誤読しないこと、
`Access-Control-Allow-Origin` や SHA256、slug を誤検出しないことを固定しています。

## 取り込み（ローカル入力）

原本は手元にダウンロードして `media/drive-b02-original/` へ置きます。置き方は
そのディレクトリの README を参照してください（private な `sources.json` で
元ファイル名を保つ方法と、slug 名で置く方法の 2 通り）。

```bash
pnpm drive-gallery:build
```

**ネットワークアクセスはありません。** 匿名 Drive ダウンロードの実装は撤去しました。

将来 authenticated な Drive 取り込みを導入する場合は、GitHub Secrets などの
private credentials 経由とし、**public repository には秘密情報を置きません。**

## 公開ゲート（publication gate）

`scripts/drive-gallery-source.mjs` の `driveGalleryPublication.state` がバッチ全体のゲートです。

```js
export const driveGalleryPublication = { state: "review" };
```

ゲートは 2 段で効きます。

1. **ビルド時** — `state !== "published"` なら取り込みは**原本を 1 つも読まず**、
   空の manifest を書いて終了する。派生ファイルも作らない。
2. **クライアント** — 生成された manifest 自身が `publicationState` を持ち、
   `visibleDriveGallery()` はそれが `"published"` でなければ空配列を返す。

sanitize 対象は次の 3 条件を **すべて** 満たすエントリだけです。

1. `driveGalleryPublication.state === "published"`
2. `contentVerified === true`
3. `privacyState === "approved"`

publish commit の手順:

1. 原本を `media/drive-b02-original/` へ置く
2. `driveGalleryPublication.state` を `"published"` にする
3. `pnpm drive-gallery:build`（56 件を sanitize）
4. `public/media/drive-gallery/` と `src/data/driveGalleryManifest.json` をコミット
   （**原本と `sources.json` はコミットしない**）
5. CI（typecheck / test / build / identity guard）が成功することを確認

派生ファイルは `public/media/gallery` と同じくコミットします。deploy を再現可能にし、
Vercel 側に ffmpeg も原本も不要にするためで、`pnpm build` は取り込みを行いません。

### 既存派生の再検証（増分運用）

派生ファイルが既に揃っているエントリは再生成せず再利用しますが、
**「一度 sanitize した」ことを信頼の根拠にしません。**

`validatePhotoDerivatives()` / `validateVideoDerivatives()` を
**初回 sanitize 直後と既存派生の再利用時の両方**で通します。安全ルールを
二重実装せず、乖離しないようにするためです。

写真（480 / 960 / 1600 の jpg・webp 計 6 ファイル）:

- 全ファイルが存在する
- sharp で正常に decode できる
- EXIF / IPTC / XMP が無い
- 幅が各要求サイズを超えない
- 各派生の実幅が **trusted attestation** の `min(要求幅, 原本幅)` と一致する
- 高さがアスペクト比から導かれる値と一致する（丸め誤差 1px まで許容）
- 同じ幅の jpg と webp の寸法が一致する
- manifest の寸法は**実ファイルから**取得する

動画（mp4 + poster jpg）:

- 両ファイルが存在する
- ffprobe が成功する
- video codec が h264
- audio があれば codec が aac
- container tags が allowlist のみ（`leftoverTags()` が空）
- **全 stream の tags が allowlist のみ**（`streamTagViolations()` が空）
- faststart（moov が mdat より前）
- 幅が `VIDEO_MAX_WIDTH` 以下
- poster が sharp で decode でき、EXIF / IPTC / XMP を持たない

1 つでも満たさなければ **fail closed**。manifest には載せません。

#### metadata の allowlist

denylist ではなく **allowlist** です。未知の tag は失敗であって通過ではありません。
許可する key は、この ffmpeg build が sanitize 済みファイルへ自分で書き込むものだけで、
実 fixture の ffprobe 出力で確認しています。

| 対象 | 許可する key |
| --- | --- |
| container | `major_brand` / `minor_version` / `compatible_brands` / `encoder` |
| stream | `language` / `handler_name` / `encoder` |

`handler_name` は許可 key の中で唯一、端末由来の文字列（`Core Media Video` など）を
運びうるため、値も muxer の既定値（`VideoHandler` / `SoundHandler` / `DataHandler` / 空）に
限定します。`encoder` は `Lavc` 始まり、`language` は 3 文字コードのみ許可します。

#### trusted source attestation（写真）

派生同士だけを突き合わせると、**6 枚すべてを整合したアップスケール一式に差し替えた場合**に
原本幅を復元できません。そこで初回 sanitize 時に private 原本から
**oriented（EXIF orientation 反映後）な寸法**を測り、build-only の
`scripts/drive-gallery-attestation.json` に記録します。

```json
{ "entries": { "mily-drive-b02-p02": { "sourceWidth": 320, "sourceHeight": 426 } } }
```

Drive ID・元ファイル名・private path は含めません。寸法だけの非識別情報です。
client bundle にも載せません（表示に不要なため）。

再検証は各 slot について `expectedWidth = min(slotWidth, sourceWidth)` と比較するので、
原本 320px に対する 480 / 960 / 1600 のアップスケール一式は**必ず失敗**します。
初回 sanitize 直後と skip 再利用は同じ attestation を参照します。
attestation が無いエントリは「信頼できない」として fail closed です。

### fail closed

取り込みは次のいずれかで停止し、非ゼロ終了します。

- 入力が見つからない（どのエントリが欠けているかを列挙）
- `sources.json` が壊れている / 存在しないファイルを指している / ディレクトリを跨ぐ名前
- 同じ slug に複数の入力が一致する
- 画像・動画として読めない
- 派生ファイルが一部しか揃っていない（partial）
- sanitize 後、**または既存派生の再利用時**に上記の契約を満たさない

## alt / タイトルの方針

- 連番（「写真 1」「動画 2」）は使わない
- 実際の内容を簡潔に、事実だけ書く。外見の価値判断はしない
- 元ファイル名は公開しない（台帳にも manifest にも持たない）
- 生成 manifest には id / kind / alt / ローカルパスだけを入れる
- 人物以外が写っている素材は、写っている物を説明する
- 画面に写ったテキスト（会話・書類・通知など）は alt へ転記しない

エントリごとの状態は 2 つのフィールドで管理します。

- `contentVerified` … その alt をファイルの中身から書いたか。`false` は publish 不可
- `privacyState` … プライバシー確認の結果。`hold` は publication が `published` でも非表示

### 内容確認の状況

**2026-08-16 に全 57 件の原本確認が完了しました。`unverifiedSource()` は 0 件です。**

確認の経緯:

- 写真 34 件・動画 4 件 … 作業環境でファイルを取得して内容確認
- 写真 3 件（`p01` / `p11` / `p12`）… Drive が抽出したテキストと画像ラベル
- 写真 9 件（`p02`〜`p10`）・動画 6 件（`v01`〜`v05`, `v08`）… オーナーが原本を確認して内容を確定
- 動画 1 件（`v11`）… オーナーからの内容説明

学習素材（`p11`〜`p38`, `v03`, `v05` など）は教材・ノート・参考書・勉強風景として確認済みです。
**撮影日・学校名・所属・個人の推測情報は alt に書きません。**

### privacy hold

`privacyState: "hold"` のエントリは、publication が `published` でも sanitize されず表示もされません。

| エントリ | 種別 | 理由 |
| --- | --- | --- |
| `mily-drive-b02-p01` | 写真 | ノートパソコンの画面に個人の会話本文が読める状態で写っているため |

`p01` は内容確認済み（`contentVerified: true`）ですが、会話内容を公開 Gallery で拡散しうるため
hold としました。alt は「喫茶店のカウンター席でノートパソコンを開いているBeReal写真」とし、
**画面内の会話内容は alt へ転記していません。**

原本が `media/drive-b02-original/` にあっても取り込み対象外です。
`public/media/drive-gallery/` にも manifest にも現れないことをテストで固定しています。

hold を解除する場合は、原本側で画面をぼかすか別カットへ差し替えたうえで
`privacyState: "approved"` に変更してください。

### 確認済みで approved としたもの

- `mily-drive-b02-p39` … 夜のイチョウ並木の写真。背景の第三者の顔は**元画像ですでにぼかされて
  います**。無加工で識別可能ではないため hold 不要。
- `mily-drive-b02-p40` … バースデープレート。片方の名前は画像自体でぼかされており、見えている
  表記は本人の公開名と整合します。alt へ名前は転記していません。

## 表示方法

すべて自サイトの静的アセットです。Google への通信は発生しません。

写真（公開候補 45 点）:

- `public/media/drive-gallery/mily-b02-pNN-{480,960,1600}.{jpg,webp}`
- `<picture>` + `srcSet` / `sizes="(min-width: 640px) 220px, (min-width: 360px) 45vw, 90vw"`
- 320px 幅では 1 列、360px 以上で 2 列、640px 以上で 3 列
- `loading="lazy"` / `decoding="async"` / `width` `height` 指定でレイアウトシフトを防ぐ
- 向き補正あり、アスペクト比維持、アップスケールなし、crop なし、顔加工なし、AI なし

動画（公開候補 11 本）:

- `public/media/drive-gallery/mily-b02-vNN.mp4`（H.264 / AAC / `+faststart`）
- container / per-stream / chapters すべての metadata コピーを明示的に無効化
  （`-map_metadata -1` `-map_metadata:s:v -1` `-map_metadata:s:a -1` `-map_chapters -1`）
- `scale='min(720,iw)':-2` — アスペクト比維持、アップスケールなし、crop なし
- `<video controls playsInline preload="none" poster="...">`
- **autoplay しない**
- poster は sanitize 済み MP4 の実フレームから生成（AI 生成しない）

Drive の iframe / thumbnail / viewer リンクはすべて撤去しました。「Google Drive で開く」
fallback も廃止しています（原本へ到達させないため）。

## sanitize の検証

匿名 Drive ネットワーク probe は撤去しました。代わりに `pnpm test` が**ローカル fixture**で
実際に sanitize を実行し、次を検証します。原本も Drive 識別子も CI に置きません。

- EXIF / GPS / IPTC / XMP が除去されること（除去前の fixture が実際に metadata を持つことも確認）
- 除去後のバイト列に元の説明文字列が残らないこと
- 小さい原本をアップスケールしないこと
- H.264 / AAC で出力されること
- container metadata（geotag / comment）が残らないこと
- `+faststart`（moov が mdat より前）
- poster が実フレームであること
- 読めない入力で fail closed すること
- **video / audio stream の metadata が除去されること**（stream tag を持てる
  Matroska fixture へ秘密値を注入し、sanitize 後に全 stream から消えることを確認）
- stream tag を注入した既存 MP4 が validator で failure になること

既存派生の再利用についても実行テストがあります。

- 正常な既存派生 → 再利用に成功し、寸法を実ファイルから読む
- 1 ファイルだけ EXIF 付きへ差し替え → failure
- 要求幅を超える（アップスケールされた）派生 → failure
- 壊れた・欠けた派生 → failure
- 不許可 metadata 付き MP4 → failure
- video stream / audio stream に不許可 tag を持つ MP4 → failure
- faststart でない MP4 → failure
- 原本 320px の attestation に対する整合アップスケール一式 → failure
- 原本 320px の attestation に対する正常な派生 → pass
- attestation が無い既存派生 → failure
- 壊れた poster / metadata 付き poster → failure
- partial 出力 → 従来どおり failure

## プライバシー / Drive についての注意

- 受領フォルダは **Restricted** です。リンクを知っていても第三者は原本へ到達できません。
- 過去 commit に残る Drive 識別子は、Restricted 化によって無効です。
- **訪問者から Google への通信は発生しません。** 配信するのは自サイトの静的アセットだけです。
- 今後この Drive フォルダへ非公開素材や作業中素材を追加しません。
- 今後の素材受領は別の非公開フォルダで行い、その識別子もリポジトリに書きません。
- 第三者が写り込んでいる素材や個人情報を含む素材は、掲載前にオーナー確認を取ります。
  確認の結果は `privacyState` に反映します（`hold` は表示されません）。
- 画面内のテキスト・実名・日付・所属は alt へ転記しません。

## コンテンツ方針

- b02 はオーナーから「フォルダ内の写真・動画をギャラリーで見られるようにする」と明示指示を受けた
  owner-provided バッチ
- 顔の AI 生成・置換・美顔補正はしない
- 撮影日や場所をファイルから推測して表示しない
- ファイル名は訪問者へ表示しない
- Drive 上の完全重複は 1 件へ統合する
- 本人 SNS 素材の追加取得については 2026-08-16 にオーナーから明示許可あり。ただし本人アカウントと
  確認できる投稿に限り、出典 URL を保持して別バッチとして扱う
- 既存 `src/data/media.ts` / `public/media/gallery` の写真は変更しない
