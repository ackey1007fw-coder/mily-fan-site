# Drive Gallery — batch b02

2026-08-15〜16 にオーナーから受領した Google Drive 素材を、既存 Gallery に追加するための運用メモです。

実装は `src/data/driveGallery.ts`（台帳・公開ゲート・URL 生成・描画モデル）と
`src/components/Gallery.tsx`（描画）、固定テストは `scripts/drive-gallery.test.mjs`。

## 受領数と登録数

| 区分 | Drive 実数 | Gallery 登録数 | 公開候補 |
| --- | --- | --- | --- |
| 写真 | 46 | 46 | 45 |
| 動画 | 12 | 11 | 11 |
| 合計 | 58 | 57 | 56 |

**登録 57 件 / 公開候補 56 件**です。登録されていても privacy hold の 1 件
（`mily-drive-b02-p01`）は表示対象から外れます。詳細は「privacy hold」の節。

動画 12 件のうち 1 組は**同一ファイルの二重アップロード**でした。両方をダウンロードして
SHA256 を比較し、完全一致を確認済みです。

```
SHA256: 2ddb087117106bba9f24535fa32bf07e03daf60a3153c74982c68d75a1dadd39
```

一致したため Gallery では 1 件に統合しています（`mily-drive-b02-v10` のみ登録し、
もう一方の file id は登録しない）。テストが「統合されなかった側の file id が台帳に無いこと」を固定します。

2026-08-16 の再点検で、初回登録から漏れていた動画 1 本（`mily-drive-b02-v11` /
湘南シーサイドサークルの 10:00〜13:00 放送案内）を追加しました。

## フォルダ ID を持たない方針

このリポジトリは**受領フォルダの ID も URL も一切保持しません**。

- `src/` `scripts/` `docs/` `README.md` のどこにもフォルダ ID を書かない
- フォルダ URL を組み立てられるヘルパー（`folderId` / `folderUrl` を含む識別子）を作らない
- 台帳は個別 file id だけを持つ
- テストは実フォルダ ID をハードコードせず、「`/drive/folders/` を生成しないこと」
  「モジュールに `folder` を含む export が無いこと」で検証する

過去の commit からフォルダ ID を完全に消去できないことは認識しています。そのうえで
**このフォルダは今後「公開 Gallery 用の読み取り専用素材置き場」としてのみ扱います。**

- 新規素材の受領用・作業用フォルダとして再利用しない
- 今後の素材受領は別の非公開フォルダで行い、そのフォルダ ID もリポジトリに書かない
- 非公開素材・作業中素材をこの公開 Gallery フォルダへ追加しない

## 公開ゲート（publication gate）

`src/data/driveGallery.ts` の `driveGalleryPublication.state` がバッチ全体のゲートです。

```ts
export const driveGalleryPublication: DriveGalleryPublication = {
  state: "review",
};
```

- `state !== "published"` の間は `visibleDriveGallery()` が **常に空配列**を返す
- したがって誤って merge しても Drive Gallery は本番表示されない
- 個々のエントリに `published: true` を自動付与することはしない
- `review` → `published` は **Codex 最終レビューと権限確認のあと、専用の commit** で行う

`visibleDriveGallery()` は次の 3 条件を **すべて** 満たすエントリだけを返します。

1. `publication.state === "published"`
2. `contentVerified === true`
3. `privacyState === "approved"`

publish commit の前提条件:

1. Drive の一般アクセスが「リンクを知っている全員: 閲覧者」であること
2. `unverifiedDriveGallery()` が空であること（2026-08-16 時点で 0 件）
3. CI（typecheck / test / build / identity guard）が成功していること

### 既知の限界

公開ゲートが止めるのは**描画**です。`review` の間も個別 file id はリポジトリと
ビルド成果物（JS バンドル）に含まれます。このブランチを Vercel Preview へ deploy した
時点で file id は第三者が取得しうる状態になります。フォルダ ID はバンドルに含まれません。

## alt / タイトルの方針

- 連番（「写真 1」「動画 2」）は使わない
- 実際の内容を簡潔に、事実だけ書く。外見の価値判断はしない
- Drive の元ファイル名は公開しない（`sourceName` フィールド自体を持たない）
- 人物以外が写っている素材は、写っている物を説明する

- 画面に写ったテキスト（会話・書類・通知など）は alt へ転記しない

エントリごとの状態は 2 つのフィールドで管理します。

- `contentVerified` … その alt をファイルの中身から書いたか。`false` は publish 不可
- `privacyState` … プライバシー確認の結果。`hold` は publication が `published` でも非表示

### 内容確認の状況

**2026-08-16 に全 57 件の原本確認が完了しました。`unverifiedDriveGallery()` は 0 件です。**

`contentVerified` は「その alt をファイルの中身から書いたか」を表します。全件 `true` です。

確認の経緯:

- 写真 34 件・動画 4 件 … 作業環境でファイルを取得して内容確認
- 写真 3 件（`p01` / `p11` / `p12`）… Drive が抽出したテキストと画像ラベル
- 写真 9 件（`p02`〜`p10`）・動画 6 件（`v01`〜`v05`, `v08`）… オーナーが原本を確認して内容を確定
- 動画 1 件（`v11`）… オーナーからの内容説明

学習素材（`p11`〜`p38`, `v03`, `v05` など）は教材・ノート・参考書・勉強風景として確認済みです。
**撮影日・学校名・所属・個人の推測情報は alt に書きません。** 原本から明確に見える学習内容を
一般的に説明するに留めます。

### privacy hold

`privacyState: "hold"` のエントリは、publication が `published` でも表示されません。

| エントリ | 種別 | 理由 |
| --- | --- | --- |
| `mily-drive-b02-p01` | 写真 | ノートパソコンの画面に個人の会話本文が読める状態で写っているため |

`p01` は内容確認済み（`contentVerified: true`）ですが、会話内容を公開 Gallery で拡散しうるため
hold としました。alt は「喫茶店のカウンター席でノートパソコンを開いているBeReal写真」とし、
**画面内の会話内容は alt へ転記していません。** テストが「`p01` が publication published でも
表示されないこと」を固定します。

hold を解除する場合は、原本側で画面をぼかすか別カットへ差し替えたうえで
`privacyState: "approved"` に変更してください。

### 確認済みで approved としたもの

- `mily-drive-b02-p39` … 夜のイチョウ並木の写真。背景の第三者の顔は**元画像ですでにぼかされて
  います**。無加工で識別可能ではないため hold 不要。
- `mily-drive-b02-p40` … バースデープレート。片方の名前は画像自体でぼかされており、見えている
  表記は本人の公開名と整合します。alt へ名前は転記していません。

## 表示方法

写真:

- Google Drive の thumbnail endpoint を `srcSet` で 320w / 640w / 960w 出し分け
- `sizes="(min-width: 640px) 220px, (min-width: 360px) 45vw, 90vw"`
- 320px 幅では 1 列、360px 以上で 2 列、640px 以上で 3 列
- 全端末に 1200px を要求する実装は廃止
- `loading="lazy"` / `decoding="async"` / `referrerPolicy="no-referrer"`
- 拡大は個別ファイルの Drive viewer を別タブで開く

動画:

- 個別ファイルの Drive preview player を `iframe` で lazy-load
- `sandbox="allow-scripts allow-same-origin allow-presentation"`
- autoplay 権限は与えない。`src` にも autoplay パラメータを付けない
- `referrerPolicy="no-referrer"` を維持
- iframe が動かない場合に備えて各カードに「Google Driveで動画を開く」fallback リンク
  （`ExternalLink` 経由 / `target="_blank"` / `rel="noopener noreferrer"` / 新規タブの SR 案内つき）

sandbox の値は本番相当環境で Drive player の実動作を確認していません（作業環境から
Google へ到達できないため）。player が動かない場合は不足権限だけを最小限で追加します。
fallback リンクはこのリスクを前提に置いています。

画像・iframe の読み込みが失敗しても、カードとページ全体は壊れません。

## プライバシー / Drive についての注意

- **Drive file ID は公開 URL の一部**です。Gallery 公開後は秘密情報として扱えません。
- Google Drive viewer / thumbnail / preview を使うと、閲覧者から Google へ通信が発生します。
  `referrerPolicy="no-referrer"` は referrer を送らないだけで、通信自体は止めません。
- 公開した素材は Google 側で閲覧・ダウンロードが可能です。
- 今後この公開 Gallery フォルダへ非公開素材や作業中素材を追加しません。
- 今後の素材受領は別の非公開フォルダで行います。
- 第三者が写り込んでいる素材や個人情報を含む素材は、掲載前にオーナー確認を取ります。
  確認の結果は `privacyState` に反映します（`hold` は表示されません）。
- 画面内のテキスト・実名・日付・所属は alt へ転記しません。

## 権限の確認状況

2026-08-16 時点でオーナーが一般アクセスを「リンクを知っている全員: 閲覧者」へ変更済みです。

変更後の再確認で得られた情報:

- フォルダ: `current_user_can_share = false`
- 確認した子動画: `current_user_can_share = false`

ただし Google Drive コネクタは permissions 一覧そのものを返さないため、
**全子ファイルの role 文字列までは独立して取得できていません。**
「全子ファイルの reader を API で確認済み」とは言えない状態です。

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
