# 日常更新ガイド — mily-fan-site

Cursor Agent が、確認済みの公開情報だけをデータファイルへ足すための手順です。
サイトのルール本体は `AGENTS.md`。写真の詳細は `docs/MEDIA.md`。ここには日常更新の手順とテンプレートだけを置きます。

このファイルのコード例は**ドキュメント用**です。実在しないダミーを `src/data/` へコピーしないでください。

---

## いま載っているもの（2026-08-26 監査）

事実は書き換えず、現状の棚卸しです。空欄は未確認のため意図的に空です。

| ファイル | 掲載 | 出典 | メモ |
| --- | --- | --- | --- |
| `news.ts` | 31件。8月26日未明の26日10:00〜11:00配信案内（本人X。テキストNEWS＋出典リンクのみ。夜は希望の表現のため枠としては未掲載）、8月25日のMixch「自信のないあなたへ」（本人X投稿と直後のリプライ。Mixch本編CTAを主導線、X原投稿を出典導線として掲載。CAMPUS GIRLS関連NEWSとして既存Activityから参照。画像・動画は自己ホストしていない）、8月25日朝の「やる気、元気、勇気でたぞ」STORY CTA（本人X。本投稿＋11:40変更追記を出典。アーカイブ本文は `/stories/2026-08-25-motivation/`）、8月24日の湘南シーサイドサークル「Yes!東京」踊ってみた（番組Instagram。恒久permalink未確認のため非リンクlabel＋プロフィール関連リンク。b25動画をLatest / NEWS / Galleryで共有）、8月24日のCAMPUS GIRLS 2027 予選A Final STAGE案内（本人X。8月26日にPatonの三橋莉子（みりぃ）ページへの投票導線と、8月26日の本人XによるPaton直接案内を同じNEWSへ追加。b26-01人物写真を代表画像、b26-02 Paton出場者ページ画像を同じカードの2枚目に掲載。8月24日の元投稿も出典リンクとして維持）、8月24日朝の初メイク配信（同じNEWSに本人X投稿とInstagram Storyの内容を統合。b24-01 SHOWROOM横長画面を代表画像、オーナーが当該掲載面を明示承認した無加工b24-02 Story画像をHOME Latestと`/news/`の同じカードの2枚目に掲載。Gallery / `/stories/` には公開していない。恒久permalinkのないStory URLは作っていない）、8月24日未明の夜枠・ラジオお礼と朝配信案内（同じNEWSにSHOWROOMファンルーム本文、Instagram Story動画、本人X投稿を統合。Fan Roomスクリーンショットは非公開）、8月23日の本人Instagram「龍みたいな雲」投稿、8月23日の湘南シーサイドサークル「真夏のミュージカル特集」放送記録（同じNEWSに放送後お礼の番組Instagram Story動画、STORY記事CTA、FM湘南マジックウェイブの放送後X投稿を同居。新しいNEWSは作っていない）、8月23日朝のSHOWROOMファンルーム2件、8月23日未明の地震直後FanRoom（同じNEWSにInstagram Story動画をmediaとして統合）、8月22日の夜枠お礼・翌8月23日の配信予定を伝えたX投稿、8月22日夜・夕方のファンルーム2件、8月22日のCAMPUS GIRLS審査員賞・予選ファイナル進出、8月21日のラジオDJ・ミスコンについてのTikTok投稿、「急遽なガンダ」X投稿、SHOWROOMファンルーム更新、配信へのお礼・次枠・投稿時点順位を伝えたInstagram Story、朝の「OHAYO!」Story・SHOWROOM配信案内X投稿、8/20以前の既存項目 | 通常のTikTok / X投稿は本人または本人が登場する公開投稿URL。FanRoomと公開permalinkのないStoryは非リンク表示。番組Instagram Storyと生放送アーカイブ文字起こしは非リンク表示。InstagramプロフィールはStoryの出典ではなく関連リンク。8/26配信案内NEWS・8/25 Mixch NEWS・8/25 motivation NEWS・8/24朝メイクNEWS・8/24未明NEWS・Final STAGE案内NEWSの外部sourceは本人X投稿。Final STAGE案内NEWSは8月24日の案内をprimary source、8月26日の直接案内をadditional sourceとして持ち、関連URLはPaton本人ページ。b26の2枚は当該NEWS専用でGallery / `/stories/` には追加しない。8/25 Mixch NEWSの関連URLはMixch本編。8/23ラジオNEWSの外部sourceは局公式の放送後X投稿。8/24踊ってみたNEWSの外部permalinkは未確認 | 投稿内容・動画説明文の確認済み範囲を要約。配信案内はアーカイブ表現。同じ内容の追記は既存NEWSへ統合し、`additionalSources` で複数の確認済みpermalinkを保持する。時間依存の順位は投稿時点の記録。同日は `sameDayOrder` の大きい項目を先にし、未指定同士は source-array 順を維持する。id 昇順にはしない |
| `contest.ts` | `currentPhase` は 2026-08-19 時点で「3次審査進出」 | 三次審査進出者一覧 `https://2026.misscircle.jp/list/3` | 三次審査の日程・審査方法は未公表。`start` / `end` は null のまま |
| `supportEvents.ts` | CAMPUS GIRLS 2027 予選A FinalSTAGEのPaton投票期間（2026-08-26 18:00〜2026-09-01 23:59 JST） | Patonイベント詳細・三橋莉子（みりぃ）出場者ページ | 投票CTAは期間中のみホーム、Support、Calendar、Activity、NEWSへ表示。境界時刻は開いている画面でも自動再評価し、終了後のホームはENTRY 734導線へ戻る。本文と一次出典は履歴として残す |
| `events.ts` | **空** | — | 予定セクションは非表示。配信予定は別系統 |
| `media.ts` | 写真18枚（すべて `published: true`） | 誕生日5枚、マンゴーかき氷5枚（b10）、龍みたいな雲3枚（b20）は各Instagram投稿。8/23 湘南シーサイドサークル公式X写真2枚（b22）・ネックレス・落ち葉（b05-01）・8/20 朝の写真（b08-01）は `owner-provided` | b22 / b20 は一次出典と `sourceDate: 2026-08-23` を記録。b08-01 と b10 は一次出典と `sourceDate: 2026-08-20` を記録。未確認の `sourceDate` / `credit` は `null`。正方形・縦写真は `aspect` で切り抜きを避ける |
| `galleryVideos.ts` | 独立動画12本（b25 = 8/24 湘南シーサイドサークル「Yes!東京」踊ってみた、b23 = 8/24 夜枠お礼・朝配信Story、b21 = 8/23 湘南シーサイドサークル放送後お礼Story、b19 = 8/23 湘南シーサイドサークル Instagram Story、b18 = 8/23 地震後Story、b15 = 8/21 TikTok、b13 = 8/21 イベントStory、b12 = 8/21 朝Story、b11 = 8/21 朝のX投稿、b07 = 8/20 朝Story、b09 = 8/19 2次審査通過Story、b03 = 8/17 朝Story。すべて `published: true`。新しい順） | owner-provided。b15はTikTok公開投稿URL、b11は本人X投稿URL、b25 / b21 / b19は番組Instagram（b25はpermalink未確認の非リンク、b21 / b19はStory非リンク）、その他StoryはInstagram Story（非リンク） | b25 は Latest / NEWS + Gallery、b23 は Latest / NEWS + Gallery、b21 は Latest / NEWS + Gallery + STORY closing、b19 は Gallery + STORY lead。b18 は既存地震NEWSと、b15 / b13 / b12 / b11 / b07 / b03 は Latest と、b09 は STORY 記事 `/stories/second-round-result-2026/` と、それぞれ同じ MP4・poster を共有。FanRoom画像とDrive Gallery（b02）は含めない |
| `socials.ts` | X / Instagram / TikTok / SHOWROOM / MixChannel | X〜SHOWROOMは ENTRY 734 実ページ。MixChannelは本人プロフィール `https://mixch.tv/u/10114673` | SHOWROOM はコンテスト用ルーム。終了後に変わる可能性あり |
| `links.ts` | ENTRY 734、CAMPUS GIRLS Paton投票、FMスタッフ、Mily個別ページ、湘南シーサイドサークル | 各 URL | SNS は `socials.ts` 側。重複して足さない |
| `profile.ts` | 公表名、活動名、生年月日、出身、MBTI、大学・学年、サークル、趣味、特技、ファンネーム、活動・嗜好 | `profileSources` の一次情報台帳。MBTIは本人MixChannel | 変動項目には `asOf` を付け、各項目を `sourceIds` で出典へ結び付ける。MBTIから性格を推測しない |
| `highlights.ts` | MISS CIRCLE（挑戦 / 2次審査通過・三次審査進出）、CAMPUS GIRLS（1st / 2nd STAGE審査員賞）、SHOWROOM開始の確認済み5件 | 主催者・本人・SHOWROOM | 結果未確定の順位や掲載権は入れない |
| `radio.ts` | 湘南シーサイドサークル 日曜 10:00–13:00 | タイムテーブル / スタッフ / 番組ページ | 本人出演の断定はしない。NOW ON AIR は API が実行時取得 |

維持する公開情報（消さない）:

- MISS CIRCLE CONTEST 2026 **ENTRY 734**
- SHOWROOM / X / Instagram / TikTok / MixChannel
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

- `media.ts` の写真の `sourceDate` / `credit`（朝Story動画の `sourceDate` は確認済み）
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

## メディア掲載の上位方針

- オーナーから提供された、または掲載を明示承認された確認済みの画像・動画は、`docs/MEDIA.md` の掲載ゲートを通過する限り、原則として掲載候補とする。
- 非掲載を初期値にせず、Story / Latest / NEWS / Gallery のどこへ載せるのが文脈上適切かを先に判断する。
- NEWSを文章だけで終わらせず、内容に合う確認済みメディアがあれば自己ホストの公開派生を利用する。節目Storyでも、確認済みの画像・動画を積極的に使用する。
- Gallery向きでない結果グラフィックや記録資料でも、Story / NEWS向きならその掲載面で使う。Galleryへ無理に展開しない。
- 非掲載は例外とし、掲載しない場合はプライバシー・第三者情報・出典 / 権利・重複・品質・掲載面・技術上の問題など、具体的な理由をPR本文または最終報告へ残す。
- 原則掲載であっても、出典・権利・プライバシー・第三者情報・公開派生の品質確認は省略しない。

Instagram Story閲覧スクリーンショットには、以下の固有の追加安全条件を適用する。一般メディアの掲載ゲートを通過しただけでは公開しない。

---

## SNS投稿を news へ追加するとき

1. 本人の確認済みアカウント（`socials.ts` にあるもの）の投稿であること。
2. 投稿を開き、日付・本文を一次ソースで確認する。スクショや転載記事だけを出典にしない。
3. `id` は `YYYY-MM-DD-短い英語slug`。一度使った id は再利用しない。
4. `date` は投稿日の `YYYY-MM-DD`（JST）。分からなければ追加しない。
5. `source` は恒久的な投稿 URL がある場合に設定し、「出典を見る」に使う。一時的なStoryで公開permalinkがない場合だけ、後述の例外手順で `source` を省略する。
6. `url` は `source` と違う関連ページがあるときだけ。同じ URL は書かない。
7. `ctaLabel` は任意。リンク先は `url ?? source`。
8. 本文は投稿の言い換えに留める。本人が書いていない抱負・予定を足さない。
9. 表示は日付降順。同日は `sameDayOrder` の大きい項目を先にし、未指定同士は source-array 順を維持する。投稿時刻が確認できない項目を id で時刻順に見立てない。id 昇順にはしない。配列の先頭に足すとレビューしやすいが、並び順だけに頼らない。

同じ投稿を何度も news にしない。写真を載せる話なら `media.ts`（オーナー確認必須）。

### 公開permalinkがない一時的なInstagram Story

- この項目は、上記の一般メディア掲載原則に対するStory閲覧スクリーンショット固有の追加条件である。
- Story閲覧スクリーンショットはデフォルトでは非掲載とし、文言確認資料だけに使う。省略記号より先を補完しない。
- ただし、**その素材と掲載面についてオーナーが明示承認した場合**は、Latest / NEWS / Gallery / `/stories/` 等のうち承認された面だけへ自己ホストできる。`/stories/` 記事の作成を必須条件にしない。crop / mask の要否も素材ごとの承認と安全確認に基づき、固定条件にしない。
- 承認を別素材・別掲載面へ自動流用しない。別Storyも別素材として扱い、Latest / NEWS / Gallery / `/stories/` の各面を明示的に区別する。
- 公開permalinkがない一時Storyでは、推測したStory URLやDriveの受け渡しURLを `source`、manifest、caption、metadataへ残さない。Story自体をNEWSの出典として示す場合は、`source` を省略し `sourceLabel: "Instagram Story"` を非リンクで表示する。プロフィールURLは出典として代用しない。
- 公開前に、本人が公開したStoryであること、投稿日・表示文・掲載面の承認範囲、DM・非公開情報・通知・第三者情報・端末情報の有無を素材ごとに確認し、判断を台帳へ記録する。
- 同じローカル派生をLatestとGalleryの両方に出す場合、MP4とposterをそれぞれ1ファイルだけ作り、両方から同じpathを参照する。
- 日常の朝投稿はLatest + Galleryで扱う。節目を文章で残すサイト機能の `/stories/` へは追加しない。
- 本人Instagramプロフィールへの導線を付ける場合は、canonical URL
  `https://www.instagram.com/mily_chan36` を `url` の関連リンクとして使い、
  `ctaLabel: "Instagramプロフィールを見る"` を設定できる。プロフィールはStoryの
  出典ではないため、`source` やmanifestの `sourceUrl` へ入れない。

### SHOWROOMファンルーム投稿

- SHOWROOMファンルーム投稿はLatest / NEWS用途とし、Gallery・`media.ts`・
  `galleryVideos.ts`・Drive Gallery・`/stories/`へ追加しない。
- 個別の恒久permalinkがない場合は`source`を作らず、
  `sourceLabel: "SHOWROOMファンルーム"`を非リンク表示する。
- 他ユーザー名・コメント・入力UIを含む生スクリーンショットは公開しない。
- オーナー提供画像から、みりぃ本人の公開投稿カードだけを決定的な非AI cropで
  切り出して使える。ほかのファンの表示名・コメント・オーナー自身のコメントは、
  公開assetへ持ち込まない。

#### Fan Room公開時の原則

公開する本文・引用は、原則としてみりぃ本人の発言だけにする。ファンサイトの主役はみりぃであり、他のファンやオーナーを公開コンテンツへ載せない。

- 他のファンの表示名、ハンドル、コメント、アバター、個人を特定できる情報は公開しない。
- オーナー自身の発言についても同様に公開しない。
- 会話の背景説明が必要な場合は、「ファンへの返信」「皆さんを気遣った」など、個人を特定しない一般表現にする。
- スクリーンショットに第三者情報が含まれる場合、privacy-safe cropを確定できない限り公開しない。
- 元スクリーンショットに第三者が写っていることを理由に、その第三者の文章をテキストへ転記してよいことにはしない。
- 本人の言葉に存在しない内容を補完・創作しない。

### 投稿に写真が付いているとき

X / Instagram の通常投稿に写真が付いていて、オーナーから元ファイルを直接受け取った場合だけ、
Latest のカード内に1枚だけ自己ホストで出してよい。

- 公開ファイルは `public/media/news/mily-bNN-NN-<slug>.jpg`。台帳は `docs/MEDIA.md`（バッチ単位）。
- `news.ts` の `media` に `kind: "image"` として `src` / `width` / `height` / `alt` を書く。
  `width` / `height` は実寸。表示は縦横比を保った `object-contain` 相当で、トリミングしない。
- `alt` は状況の説明（外見の評価は書かない）。
- 通常のSNS投稿写真は Gallery（`media.ts`）へ自動的・無条件には追加しない。本人写真をオーナー確認済みでGallery掲載する場合は追加してよい。
- 縦写真をGalleryへ追加するときは、実画像の縦横比に対応する `MediaItem.aspect` を設定し、既定4:3への不自然なクロップを避ける。
- 外部の X / Instagram 画像 URL を直接参照しない。SNS から自動取得もしない。

### コンテスト結果など「節目」を扱うとき

通常のSNS紹介と分けて、次の3か所を同じ根拠で更新する。同じ本文を二重に持たない。

1. `src/data/stories.ts` に記事を追加し、`stories/<slug>/index.html` と
   `vite.config.ts` / `src/data/site.ts`（sitemap）/ `scripts/check-site-url.mjs` に
   ルートを登録する。本文・写真・出典はここだけに置く。
2. `src/data/news.ts` に要約1件を足し、`url` を `/stories/<slug>/` に向ける。
   本文はLatest用の短い要約に留め、記事本文を貼り直さない。
3. 確認済みの節目なら `src/data/highlights.ts` に1件、審査フェーズが動いたら
   `src/data/contest.ts` の `currentPhase` を一次ソース付きで更新する。

`Story` の `badge` は「2次審査通過」のような確認済みラベルだけに使う。未確認の
日程・審査方法・順位・得票数・ファイナル進出・グランプリは、どの場所にも書かない。

---

## イベントを events へ追加するとき

1. 本人が出演・登壇・公開収録するなど、確認できた予定だけ。
2. `source` は主催者または本人の一次発表 URL。
3. `listedAt` はサイトへ掲載した日を `YYYY-MM-DD` で書く。
4. `startAt` は日付だけ `YYYY-MM-DD`、時刻まで分かるとき `YYYY-MM-DDTHH:mm:ss+09:00`。
5. `timezone` は必ず `"Asia/Tokyo"`。
6. `kind` は `appearance` / `stream` / `event` / `other` のみ。
7. 終了時刻が確認できていなければ `endAt` を書かない。
8. 年をまたいでも同じ配列へ追加する。年別ファイルを作らない。
9. 通常の SHOWROOM 配信は `events.ts` に書かない（自動取得）。特別配信で主催発表がある場合のみ、出典付きで追加してよい。

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
- b02はDrive Galleryで使用済み。新しい独立素材は新しいbatch番号を使い、既存連番を再利用しない。
- 縦写真は `aspect`（例 `"1152 / 2048"`）を指定する。Galleryタイル既定の4/3へ切り抜かない。
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
  listedAt: "2026-08-19",
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

PR 本文に、一次ソース URL と「推測していないこと」を書く。`main` へ直接 push しない。
マージ可否と委任範囲は、ルール本体である `AGENTS.md` の「マージしてよい条件」と
「既定のマージ委任」に従う。
