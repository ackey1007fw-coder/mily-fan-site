# 日常更新ガイド — mily-fan-site

Cursor Agent が、確認済みの公開情報だけをデータファイルへ足すための手順です。
サイトのルール本体は `AGENTS.md`。写真の詳細は `docs/MEDIA.md`。ここには日常更新の手順とテンプレートだけを置きます。

このファイルのコード例は**ドキュメント用**です。実在しないダミーを `src/data/` へコピーしないでください。

---

## いま載っているもの（2026-08-15 監査）

事実は書き換えず、現状の棚卸しです。空欄は未確認のため意図的に空です。

| ファイル | 掲載 | 出典 | メモ |
| --- | --- | --- | --- |
| `news.ts` | 1件。21歳誕生日（2026-08-02） | Instagram `.../p/DbiY3PHk1c8/` | 本文は投稿の要約。未確認の推測なし |
| `events.ts` | **空** | — | 予定セクションは非表示。配信予定は別系統 |
| `media.ts` | 写真6枚（すべて `published: true`） | 誕生日5枚は上記 Instagram。ネックレスは `owner-provided` | `sourceDate` / `credit` は未確認のため `null` |
| `socials.ts` | X / Instagram / TikTok / SHOWROOM | ENTRY 734 実ページで確認済み | SHOWROOM はコンテスト用ルーム。終了後に変わる可能性あり |
| `links.ts` | ENTRY 734、FMスタッフ、Mily個別ページ、湘南シーサイドサークル | 各 URL | SNS は `socials.ts` 側。重複して足さない |
| `profile.ts` | 公表名、活動名、生年月日、出身、大学・学年、サークル、趣味、特技、ファンネーム、活動・嗜好 | `profileSources` の一次情報台帳 | 変動項目には `asOf` を付け、各項目を `sourceIds` で出典へ結び付ける |
| `highlights.ts` | MISS CIRCLE、CAMPUS GIRLS、SHOWROOM開始の確認済み3件 | 主催者・本人・SHOWROOM | 結果未確定の順位や掲載権は入れない |
| `radio.ts` | 湘南シーサイドサークル 日曜 10:00–13:00 | タイムテーブル / スタッフ / 番組ページ | 本人出演の断定はしない。NOW ON AIR は API が実行時取得 |

維持する公開情報（消さない）:

- MISS CIRCLE CONTEST 2026 **ENTRY 734**
- SHOWROOM / X / Instagram / TikTok
- FM湘南マジックウェイブ（Mily / 湘南シーサイドサークル）
- 本人写真（ギャラリー派生ファイル）
- 配信予定の自動取得
- FMラジオ放送状態の自動取得（`/api/mily-radio-status`）
- **Mily / mily** 表記（l を重ねない）
- 非公式であることの明示

重複ではないもの:

- 誕生日 news とギャラリー写真は同じ Instagram 投稿を出典にしている（お知らせと写真で役割が違う）
- プロフィール事実と `links.ts` の FM / コンテスト URL（事実と導線）

未確認のまま残す（推測して埋めない）:

- 全メディアの `sourceDate` / `credit`
- `mily-b01-06`（ネックレス）の公開投稿 URL
- 出演・イベント（`events.ts` は空で正しい）
- 所属事務所、商業音源、現在順位、フォロワー数など不存在・変動を伴う情報

---

## 更新の振り分け

| やりたいこと | 書く場所 | 書かない場所 |
| --- | --- | --- |
| SNS投稿の要約 | `src/data/news.ts` | `events.ts`（日時付きの出演でないなら） |
| 出演・イベント・公開収録 | `src/data/events.ts` | 配信予定の自動取得を止めて手入力しない |
| 通常の SHOWROOM 配信時刻 | 原則なにもしない（自動取得） | `events.ts` にも `streamSchedule.ts` にも推測で書かない |
| 写真 | Drive → `media/original/` → `pnpm media:build` → `media.ts` | SNS から自動ダウンロードしない |
| SNS URL の追加・変更 | オーナー確認後に `socials.ts` | 未確認アカウントを足さない |
| FM の番組名・ページ変更 | オーナー確認後に `profile.ts` / `links.ts` | スタッフページを読んで推測で肩書を足さない |
| プロフィール事実 | オーナー確認後に `profile.ts` と `profileSources` | 空欄を埋めるために検索結果だけを採用しない |

---

## SNS投稿を news へ追加するとき

1. 本人の確認済みアカウント（`socials.ts` にあるもの）の投稿であること。
2. 投稿を開き、日付・本文を一次ソースで確認する。スクショや転載記事だけを出典にしない。
3. `id` は `YYYY-MM-DD-短い英語slug`。一度使った id は再利用しない。
4. `date` は投稿日の `YYYY-MM-DD`（JST）。分からなければ追加しない。
5. `source` は投稿 URL（必須。「出典を見る」に使われる）。
6. `url` は `source` と違う関連ページがあるときだけ。同じ URL は書かない。
7. `ctaLabel` は任意。リンク先は `url ?? source`。
8. 本文は投稿の言い換えに留める。本人が書いていない抱負・予定を足さない。
9. 表示は日付降順。配列の先頭に足すとレビューしやすいが、並び順だけに頼らない。

同じ投稿を何度も news にしない。写真を載せる話なら `media.ts`（オーナー確認必須）。

---

## イベントを events へ追加するとき

1. 本人が出演・登壇・公開収録するなど、確認できた予定だけ。
2. `source` は主催者または本人の一次発表 URL。
3. `startAt` は日付だけ `YYYY-MM-DD`、時刻まで分かるとき `YYYY-MM-DDTHH:mm:ss+09:00`。
4. `timezone` は必ず `"Asia/Tokyo"`。
5. `kind` は `appearance` / `stream` / `event` / `other` のみ。
6. 終了時刻が確認できていなければ `endAt` を書かない。
7. 年をまたいでも同じ配列へ追加する。年別ファイルを作らない。
8. 通常の SHOWROOM 配信は `events.ts` に書かない（自動取得）。特別配信で主催発表がある場合のみ、出典付きで追加してよい。

空のままでセクションは非表示。プレースホルダー行は作らない。

---

## 写真を追加するとき

```
Google Drive 原本 → 選定 → media/original/ → pnpm media:build
  → public/media/gallery/ → src/data/media.ts
```

詳細は `docs/MEDIA.md`。要点:

- 原本は Drive。SNS から画像を自動取得しない。
- 顔の AI 生成・置換・補正・塗り足しは禁止。
- 次のバッチは **b02**（b01 の連番は再利用しない）。
- `published: true` にする前にオーナー確認。
- 公開済みファイル名は変えない。差し替えは新しい id。

---

## SNSリンクを変えるとき

オーナー確認が必要です。確認前に `socials.ts` を書き換えない。

- 追加: 本人の投稿や ENTRY 734 など一次ソースで URL を確認し、`confirmed: true` だけを載せる。
- 変更・削除: 旧 URL が 404 / 改名した根拠を PR に書く。
- SHOWROOM はコンテスト終了後にルームが変わる可能性あり。自動取得（`/api/mily-schedule`）は ENTRY 734 起点。room ID をコードに直書きしない。

---

## FM情報を更新するとき

オーナー確認が必要です。

- 見るページ: [スタッフ一覧](https://fm-smw.jp/staff)、[Mily 個別](https://fm-smw.jp/staff/mily%EF%BC%88%E3%83%9F%E3%83%AA%E3%83%BC%EF%BC%89)、[湘南シーサイドサークル](https://fm-smw.jp/program/%E3%80%8E-%E6%B9%98%E5%8D%97%E3%82%B7%E3%83%BC%E3%82%B5%E3%82%A4%E3%83%89%E3%82%B5%E3%83%BC%E3%82%AF%E3%83%AB-%E3%80%8F%E3%80%80%EF%BC%83ssc)
- 公開表記は **Mily（ミリー）**。ファンサイトの呼びは **みりぃ**。どちらも消さない。
- 番組名・URL・担当の記載が一次ソースで変わったときだけ、`profile.ts` の該当 fact と `links.ts` を同じ根拠で直す。
- 放送時刻・コーナー名・共演者は、スタッフページに無いなら書かない。

---

## 詳細プロフィールを更新するとき

プロフィール本文は `src/data/profile.ts`、節目は `src/data/highlights.ts`、表示は専用の `/profile/` ページです。

1. 本人、主催者、放送局、配信プラットフォームの一次ページを開いて内容を確認する。
2. 新しい出典は `profileSources` に `id / title / publisher / url / verifiedAt` を登録する。
3. 各事実・将来像・活動・コレクションから `sourceIds` で出典へ結び付ける。存在しない id や出典なしはCIで拒否される。
4. 大学・学年、所属、趣味、ファンネーム、将来像、活動、Favoritesなど変わり得る内容は `time-sensitive` とし、`asOf` を必ず付ける。
5. 生年月日は固定情報として保存しても、年齢を固定文字列で書かない。
6. フォロワー数、現在順位、配信予定、審査中の結果はプロフィールへ固定しない。
7. 「所属事務所なし」「音源なし」「論争なし」など不存在を推測して埋めない。
8. 活動名は **Mily / mily**。l を重ねた表記へ変更しない。
9. FM由来の内容は、本人Instagramの公開identity、MISS CIRCLEのFM活動記載、番組側のMily表記、FMプロフィールをセットで出典化し、FMページ単独で氏名を推測しない。

プロフィール事実の追加・変更は、一次情報をPR本文へ列挙し、オーナー確認を受けてから公開します。

---

## 配信予定

原則、手で書かない。

- 自動取得: `/api/mily-schedule`（ENTRY 734 → SHOWROOM room 解決 → AGE schedule）
- 失敗時の空 fallback: `src/data/streamSchedule.ts`（空なら非表示）
- 未確認の時刻を fallback に書かない。
- 検証は Actions の「Probe stream schedule」（`scripts/probe-schedule.mjs`）。

---

## FMラジオ放送状態

原則、出演中かどうかは手で書かない。

- 自動判定: `/api/mily-radio-status`（日曜 10:00–13:00 + FMトップの NOW ON AIR）
- 確認済み事実: `src/data/radio.ts`
- NOW ON AIR の番組名一致だけを `onAirConfirmed: true` にする。取得失敗は `null`。
- 時間帯だけでは「Mily本人出演中」と書かない。

---

## オーナー確認が必須

`AGENTS.md` の確認項目に加え、日常更新では次も止める。

- プロフィール事実の追加・変更
- SNS / 外部リンクの追加・変更・削除
- 本人写真の追加・差し替え・非掲載化
- FM の担当・番組事実の変更
- `streamSchedule.ts` への手入力
- 本番公開・ドメイン設定

確認なしで進めてよい（ただし出典必須・未確認は載せず）:

- 本人確認済み SNS の投稿を、投稿 URL 付きで `news.ts` に要約する
- 主催者または本人の一次発表がある出演を `events.ts` に追加する

迷ったら追加しない。空より間違った値の方が悪い。

触らないもの（別 PR / 大規模 UI）:

- `src/App.tsx`、Hero、Support、StreamSchedule、TodayDashboard、contest 関連のレイアウト

---

## 更新テンプレート

以下は形の見本です。日付・URL・文言を、確認した一次ソースに置き換えてから `src/data/` へ入れる。このままコミットしない。

### news

```ts
{
  id: "2026-08-20-showroom-thanks",
  date: "2026-08-20",
  title: "配信へのお礼を投稿しました",
  body: "本人のX投稿で、配信に来てくれた人へのお礼が書かれています。投稿に無い内容は足しません。",
  source: "https://x.com/Mily_chan36/status/REPLACE_WITH_REAL_ID",
  ctaLabel: "Xの投稿を見る",
}
```

- `source` 必須。`url` は出典と違うページがあるときだけ。
- 実在しない status ID を本番に残さない。

### event

```ts
{
  id: "2026-09-01-ssc-public",
  title: "湘南シーサイドサークル 公開収録",
  startAt: "2026-09-01T19:00:00+09:00",
  timezone: "Asia/Tokyo",
  kind: "appearance",
  venue: "確認できた会場名",
  source: "https://fm-smw.jp/REPLACE_WITH_REAL_ANNOUNCEMENT",
  url: "https://fm-smw.jp/REPLACE_WITH_DETAIL_IF_DIFFERENT",
  notes: "一次発表に書かれている範囲だけ。",
}
```

- 時刻不明なら `startAt: "2026-09-01"`（日付のみ）。
- `events` が1件以上になるとスケジュール節とナビが表に出る。

### media

```ts
{
  id: "mily-b02-01",
  kind: "photo",
  basePath: "/media/gallery/mily-b02-01-confirmed-slug",
  widths: [480, 960, 1600],
  width: 1600,
  height: 1200,
  alt: "状況が分かる説明（外見の評価は書かない）",
  caption: "確認できたキャプションがあれば",
  provenance: "sns-post",
  sourceUrl: "https://www.instagram.com/p/REPLACE_WITH_REAL_POST/",
  sourceDate: null,
  credit: null,
  published: false,
}
```

- 派生ファイルを `pnpm media:build` で作ってからマニフェストを足す。
- オーナー了承まで `published: false`。了承後に `true`。
- `sns-post` なら `sourceUrl` 必須。`third-party` なら `credit` 必須。不明な日付は `null`。

---

## PR 前

```bash
pnpm typecheck
pnpm test
pnpm build
pnpm guard
```

PR 本文に、一次ソース URL と「推測していないこと」を書く。`main` へ直接 push しない。マージはオーナー。
