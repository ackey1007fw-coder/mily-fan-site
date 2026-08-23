# Activities Hub / Support Calendar 設計 — mily-fan-site

みりぃ（三橋莉子 / Mily）の確認済み情報を、Latest・profile・contest・配信・radioの
既存責務を壊さず、「活動単位」と「応援単位」で読めるようにするための確定設計。

- ルールの唯一の情報源は `AGENTS.md`。この文書は実装ルールを追加するものではない。
- このPRは設計文書だけを更新する。React、API、data、test、公開assetは変更しない。
- 新しい人物事実、審査日程、SHOWROOMイベント名・期間を追加しない。
- 本文のUI例に出る値は、既存dataから読む式または明示した例であり、新しい確定値ではない。

基準: 2026-08-22 / `main` = `889b23f9961f2bb5bfa0ab16b4e6d58ce6392c26`
（PR #49 squash merge commit。PR #49の変更まで反映済み）

---

## 1. 最新mainで確認した前提

### 1.1 PR #49反映済みの事実

- `src/data/news.ts` の2026-08-21 TikTok項目は、`@seasidecircle`による
  **湘南シーサイドサークル側の投稿**として記述されている。
- 本人個人TikTokは `src/data/socials.ts` の `@mily_chan36`。番組側の
  `@seasidecircle`とは別のidentityである。
- `NewsItem.sameDayOrder` と `sortNewsByDateDesc()` が導入済み。
  日付降順、同日は明示された `sameDayOrder` の大きい値を先にし、未指定同士は
  元配列順を維持する。id順にはしない。
- `src/data/tiktokRadioVideo.json` の1つのmanifest objectを
  `news.ts` と `galleryVideos.ts` が共有し、同じMP4とposterを参照している。

PR #49への追従条件やmerge待ちの回避策は、この設計には置かない。
PR #49の実装を現在のmainとして扱う。

### 1.2 現在のデータ配置

| 情報 | 現在の正本・取得元 | 現在の主な表示 |
| --- | --- | --- |
| MISS CIRCLEのentryと現在phase | `src/data/contest.ts` | `TodayDashboard` |
| プロフィール内の活動説明 | `src/data/profile.ts` | `/profile/` |
| 公開出演・イベント | `src/data/events.ts` | `Schedule`。現在配列は空 |
| SHOWROOM個別配信予定 | `/api/mily-schedule` + `src/data/streamSchedule.ts` fallback | `StreamSchedule`等 |
| ラジオ番組・週次放送枠 | `shared/radio-program.js` | banner、radio API |
| ラジオNOW ON AIR観測 | `/api/mily-radio-status` | realtime表示 |
| Latest | `src/data/news.ts` | `Latest`、Hero、portal feed |
| 本人SNS | `src/data/socials.ts` | Follow、Today |
| 主催者・番組・その他リンク | `src/data/links.ts` | Links |
| 確認済みの節目 | `src/data/highlights.ts` | `/profile/` |
| 独立動画 | 各manifest + `src/data/galleryVideos.ts` | Latest、Gallery、Story |

### 1.3 解消する不整合

`contest.ts` は `currentPhase.name = "3次審査進出"`、
`lastVerifiedAt = "2026-08-19"` を保持している。一方、`profile.ts` の
`miss-circle` activityはbodyとpointsに「二次審査進出」を保存しており、
`asOf = "2026-08-16"` のままである。

これは同じ「現在の審査段階」を2ファイルへ書いたために生じたstaleである。
実装Phase P2で、Profileから現在phase文字列を除去し、表示時に `contest.ts` を読む。

---

## 2. 設計原則

1. **1つの事実に1つの正本。** 別画面は正本を参照または導出する。
2. **Activityは活動identity。** 現在状態・期間・順位を保存しない。
3. **SupportEventは応援行動の期間・締切・イベント。** Activity identityや
   contest current phaseをコピーしない。
4. **既存のdomain正本を優先する。** contest、events、SHOWROOM API、radioの値を
   `supportEvents.ts` へ転記しない。
5. **ScheduleItemは表示用の導出型。** data fileとして保存しない。
6. **時刻依存状態は実行時に導出する。** `active`、`ongoing`、`now`、`ended`を
   静的dataへ保存しない。
7. **未確認は未確認のまま。** 日付の存在自体が確認済みでないものを作らない。
8. **関連表示も既存の順序関数を使う。** NEWSの独自sortを画面ごとに作らない。

---

## 3. Single Source of Truth

### 3.1 Data ownership表

| 情報 | Single Source of Truth | 他画面・導出先 | 禁止するコピー |
| --- | --- | --- | --- |
| MISS CIRCLE contest identity / entry | `src/data/contest.ts` | Profile、Activities、SupportのCTA | `activities.ts` / `supportEvents.ts`への名称・entry URL複製 |
| MISS CIRCLE current phase | `contest.ts` `currentPhase` | Profile、Activities、Supportが参照 | Profile activity、Activity、SupportEventへのphase文字列複製 |
| MISS CIRCLE公式phase日程 | `contest.ts` `currentPhase.start/end` | `supportCalendar.ts` がCalendar itemへ導出 | `supportEvents.ts`への同じstart/end複製 |
| Profileの恒久的な活動説明 | `src/data/profile.ts` | `/profile/` | current phase、current rank、期間の混入 |
| Activity identity / navigation | `src/data/activities.ts` | Activities Hub、各活動ページ、nav | current state、start/endの混入 |
| 独立した応援期間・締切 | `src/data/supportEvents.ts` | NOW、Support Calendar、活動ページ | contest/events/API/radioが既に持つ日程の転記 |
| 公開出演・一般イベント日程 | `src/data/events.ts` | Schedule、Support Calendar | `supportEvents.ts`への同じstart/end複製 |
| SHOWROOM個別配信予定 | `/api/mily-schedule`。確認済み手入力fallbackのみ `src/data/streamSchedule.ts` | Today、Live Activity、Support Calendar | events/supportEventsへの個別枠転記 |
| SHOWROOM実ライブ状態 | `/api/mily-live` | banner、Today、NOW | `active` / `live`文字列の保存 |
| Radio weekly slot | `shared/radio-program.js` | Radio Activity、Calendar、radio API | Activity/SupportEventへの曜日・時刻複製 |
| Radio now on air | `/api/mily-radio-status` | Radio Activity、banner、NOW | 静的dataへの放送中状態の保存 |
| NEWS本文と順序 | `src/data/news.ts` + `sortNewsByDateDesc()` | Latest、Hero、Activities | activityページ独自sort、別の同日順序 |
| 本人personal social | `src/data/socials.ts` | Follow、Today、Activities | 番組・主催者アカウントの混入 |
| 番組・主催者・外部導線 | `src/data/links.ts` | Links、Activities | `socials.ts`への番組アカウント混入 |
| 確認済みの節目 | `src/data/highlights.ts` | Profile、Activities | current stateとしての再保存 |
| PR #49 TikTok media | `src/data/tiktokRadioVideo.json` + typed wrapper | NEWSとGalleryが同じobjectを参照 | 用途別manifest / MP4 / poster複製 |
| Support Calendar表示行 | `src/lib/supportCalendar.ts` の導出結果 | `/support/` | `src/data/schedule.ts`等への保存 |

### 3.2 MISS CIRCLE日程は案Aを採用

**案A: `contest.ts` がMISS CIRCLE固有の公式日程を保持し、Supportはそこから導出する。**

理由:

- 現在の `ContestPhase` が既に `name`、`start`、`end`、`source` を同じobjectで持つ。
- phase identityと公式phase日程を同じ一次ソース・確認日で更新できる。
- `supportEvents.ts` へ同じ期間を作らなければ、更新先は1か所で済む。
- 現在の `start/end = null` も「日程未確認」を正しく表せており、移行のための
  新しい事実や仮日付が不要である。

将来、current phase以外の投票期間・結果発表予定など複数のMISS CIRCLE公式日程を
保持する必要が生じた場合も、`contest.ts` にcontest-ownedなschedule collectionを
追加する。`supportEvents.ts` に同じ日付を置かない。

`supportCalendar.ts` は `contest.ts` 用adapterを持ち、`start/end` があるときだけ
日付軸へ展開する。`null` の場合は `contest.currentPhase.name` と `source` から
「日程発表待ち」を導出するが、日付を作らない。

---

## 4. データモデル

### 4.1 Activity — identity / navigationのみ

```ts
// src/data/activities.ts

export type ActivityId =
  | "miss-circle"
  | "radio"
  | "live-stream"
  | "campus-girls";

export type Activity = {
  id: ActivityId;
  label: string;
  eyebrow: string;
  title: string;
  summary: string;
  route:
    | "/activities/miss-circle/"
    | "/activities/radio/"
    | "/activities/live/"
    | "/activities/campus-girls/";
  sourceIds: ProfileSourceId[];
  relatedSocialIds: string[];
  relatedLinkIds: string[];
  relatedHighlightIds: string[];
  relatedStorySlugs: string[];
};
```

Activityに含めないもの:

- `currentPhase` / `statusLabel` / `progressLabel`
- `currentRank`
- `active` / `ongoing` / `now` / `currentEvent`
- `start` / `end` / deadline
- SHOWROOMの次回枠、ラジオの次回放送時刻
- NEWSやGalleryの増加に合わせて毎回更新する `newsIds` / `galleryIds`

Activities Hubの状態表示はActivity recordからではなく、activity idに応じた
selectorが正本を読む。

| Activity | 状態・日程の参照元 |
| --- | --- |
| `miss-circle` | `contest.currentPhase` |
| `radio` | `shared/radio-program.js` + `/api/mily-radio-status` |
| `live-stream` | `/api/mily-schedule`、`/api/mily-live`、該当SupportEvent |
| `campus-girls` | current stateは未保存。確認済み履歴は`highlights.ts` |

### 4.2 SupportEvent — 正本が他にない応援期間だけ

SupportEventは「ファンが応援行動を取るための、確認済みの期間・締切・イベント」を
表す。Support UIの対象にはSHOWROOMイベント期間、投票期間、審査期間、応援締切、
公開出演予定、結果発表予定が含まれる。

ただし「Support UIに出すこと」と「`supportEvents.ts` が日程の正本になること」は
同義ではない。MISS CIRCLE審査期間は `contest.ts`、公開出演予定は `events.ts` から
SupportEvent相当の表示へ変換する。保存するSupportEventは、既存の正本がない
独立した応援期間だけである。

ただし、このファイルがすべてのCalendar sourceを置き換えるわけではない。

- MISS CIRCLE公式phase日程は `contest.ts`。
- 公開出演予定は、`AGENTS.md` が指定する `events.ts`。
- SHOWROOM個別配信枠は `/api/mily-schedule`。
- radio週次枠は `shared/radio-program.js`。

これらはCalendarへ直接adapterで渡し、SupportEventへコピーしない。

```ts
// src/data/supportEvents.ts

export type SupportEventKind =
  | "vote"
  | "deadline"
  | "stream-event"
  | "support-campaign"
  | "result";

export type SupportEventSchedule =
  | {
      // 期間もの。終了が確認できたものだけがこの形を名乗れる。
      state: "confirmed-period";
      start: string;
      end: string;
      allDay: boolean;
      timezone: "Asia/Tokyo";
    }
  | {
      // 締切・結果発表など、長さを持たない時点。endを作らない。
      state: "confirmed-instant";
      at: string;
      allDay: boolean;
      timezone: "Asia/Tokyo";
    }
  | {
      // イベントの存在は一次ソースで確認済みだが、日付が未公表の場合だけ使う。
      state: "date-pending";
    };

export type SupportEvent = {
  id: string;
  activityId: ActivityId;
  kind: SupportEventKind;
  title: string;
  note?: string;
  schedule: SupportEventSchedule;
  ctaLinkId?: string;
  source: string;
  verifiedAt: string;
  priority?: number;
};
```

SupportEventに含めないもの:

- Activityのtitle / summary / routeのコピー
- contest current phaseやcurrent rank
- `active` / `ongoing` / `ended`
- 別の正本にあるstart/end
- 未確認のCTA URL。既存の `links.ts` / `socials.ts` をid参照する

`date-pending` はイベントの存在自体が一次ソースで確認済みの場合だけ使う。
単なる予想や「例年ある」はrecordを作らない。

**`end` を optional にしない理由。** `end?` を許すと、`deadline` や `result` のように
長さを持たない項目が「開始済みで終了時刻なし」となり、`displayStatus()` から
「終了した」と判定できず、過ぎた締切がNOWに残り続ける。かといって既定の長さを
補うのは確認していない期間の捏造になる。そこで **期間ものは `end` 必須、時点ものは
`at` のみ** に型で分け、どちらでもないもの（終了が未公表の期間）は
`confirmed-period` を名乗れないので `date-pending` として扱う。

### 4.3 既存 `events.ts` との境界

公開出演、登壇、公開収録などは引き続き `events.ts` が正本である。
同じ出演を「応援にも関係する」という理由で `supportEvents.ts` へ複製しない。
Support Calendarは `FanEvent` を直接 `ScheduleItem` へ変換する。

将来、1つの出演に応援CTAだけを補足したくなった場合は、日程を写さず
`FanEvent.id`を参照する小さなrelationを検討する。参照先の必要が実証される前に
フィールドを追加しない。

**ただし `FanEvent` はActivityを示せない。** 現在の `FanEvent` に活動を指す項目はなく、
`EventKind` も `appearance` / `stream` / `event` / `other` の4値で、MISS CIRCLE・radio・
live stream・CAMPUS GIRLSのどれかを識別できない。したがってadapterは
`ScheduleItem.activityId` を埋められない。**titleやvenueからActivityを推測しない。**

- `ScheduleItem.activityId` は `ActivityId | null` とし、fan event由来は既定で `null`。
  `null` の行はactivity iconやbadgeを出さず、`events.ts` の情報だけで描く。
- 特定の出演を明示的に活動へ結び付けたくなった時点で、`FanEvent` へ
  optionalな `activityId?: ActivityId` を足す。`events.ts` は `AGENTS.md` が挙げる
  データファイルなので、この追加はオーナー確認のうえ別PRで行う。
- P5でこのsourceを接続する時点で `events` が空なら、adapterとtestだけ用意して
  実データでの分類判断は保留する。

### 4.4 ScheduleItem — 導出型、保存禁止

```ts
// src/lib/supportCalendar.ts

export type ScheduleOrigin =
  | "contest"
  | "support-event"
  | "fan-event"
  | "showroom-schedule"
  | "radio-program";

export type ScheduleItem = {
  key: string;
  date: string;
  startTime: string | null;
  endTime: string | null;
  allDay: boolean;
  span: { start: string; end: string } | null;
  activityId: ActivityId;
  title: string;
  note?: string;
  origin: ScheduleOrigin;
  source?: string;
  cta?: { label: string; url: string };
};

export type PendingSupportItem = {
  key: string;
  activityId: ActivityId;
  title: string;
  reason: "date-pending";
  source: string;
  cta?: { label: string; url: string };
};

export function buildSupportCalendar(input: {
  contest: Contest;
  supportEvents: SupportEvent[];
  fanEvents: FanEvent[];
  streamSlots: StreamSlot[];
  includeRadio: boolean;
  now: number;
  daysAhead: number;
}): {
  days: { date: string; items: ScheduleItem[] }[];
  pending: PendingSupportItem[];
};
```

導出規約:

- MISS CIRCLEは `contest.currentPhase.start/end` からのみ生成する。
- `start/end = null` のcontest phaseは日付軸へ入れず、pendingへ送る。
- SHOWROOM API枠は確認できる終了時刻がないため `endTime = null`。推定しない。
- radioは `radioProgram.weekday/scheduledStart/scheduledEnd` から表示範囲内だけ展開する。
- `events.ts` は既存日時validatorを再利用する。
- `date-pending` は日付軸に入れない。
- `src/data/schedule.ts` やCalendar JSONを新設しない。
- `now` は必ず引数で受け、テストで固定できるようにする。

### 4.5 現在状態の導出

保存してよいのは確認済みの事実と期間であり、表示時点の状態ではない。

```ts
type DisplayStatus = "live" | "upcoming" | "ended" | "date-pending";

function displayStatus(
  schedule: SupportEventSchedule,
  now: number,
): DisplayStatus;
```

境界の定義（テストで固定する）:

| schedule | `upcoming` | `live` | `ended` |
| --- | --- | --- | --- |
| `confirmed-period` | `now < start` | `start <= now <= end` | `end < now` |
| `confirmed-instant`（時刻あり） | `now < at` | なし | `at <= now` |
| `confirmed-instant`（`allDay`） | その日の開始前 | JSTのその日の間 | 翌日0:00以降 |
| `date-pending` | — | — | — （常に `date-pending`） |

`schedule` だけで判定できるのが要点で、`SupportEventKind` を渡す必要はない。
時点ものに長さを与えないので、過ぎた締切は必ず `ended` になりNOWから外れる。
日付のみ（`allDay`）の境界はJSTの暦日で判定し、`Intl` 経由で求める。

- `live/upcoming/ended` は上表とJSTの `now` から導出する。
- SHOWROOMの「配信中」は `/api/mily-live` が `live` を返したときだけ。
- radioの「放送中」は既存のfreshness判定と `onAirConfirmed === true` を満たすときだけ。
- 番組枠だけで本人出演中と断定しない。
- MISS CIRCLE current phase labelは `contest.currentPhase.name` を直接表示する。

---

## 5. NEWS / mediaの関連付け

### 5.1 NEWSの時系列は既存関数だけを使う

Activityページで関連NEWSを表示するときは、`NewsItem.activityIds?` をoptionalで追加し、
明示的に関連付けた項目だけを対象にする。

```ts
const relatedNews = sortNewsByDateDesc(news)
  .filter((item) => item.activityIds?.includes(activityId))
  .slice(0, 3);
```

禁止事項:

- Activityページ内にdate / `sameDayOrder` comparatorを再実装しない。
- id順、source URL順、配列indexだけの別ルールを作らない。
- source hostや本文keywordからActivityを自動推定しない。
- `sameDayOrder` をactivities側やrelation側へコピーしない。

`sameDayOrder` の正本は `news.ts`。Latest、Hero、Activitiesのすべてが
`sortNewsByDateDesc()` を使う。

### 5.2 GalleryはNEWSとSTORYのmediaから導出

Activityに関連する動画は、次の2経路から導出する。
media manifestや `galleryVideos.ts` にactivity分類を重複保存しない。

1. 明示的に紐づいたNewsItemの `media`
2. `Activity.relatedStorySlugs` が指すSTORYが参照しているmedia

**NEWS経路だけでは既存の動画を取りこぼす。** 例えば
`secondRoundStoryVideo`（b09）は `galleryVideos.ts` が公開し `stories.ts` が使うが、
対応する `2026-08-19-second-round-result` のNewsItemは `media` を持たず、
`url` で `/stories/second-round-result-2026/` を指しているだけである。
NEWSの `media` だけを見ると、このMISS CIRCLE動画がActivityページから静かに消える。

そこで導出は上記2経路の和とし、**同じmanifest objectは1件に畳む**（`id` で重複排除）。
`Activity.relatedStorySlugs` は既にある項目なので、新しいフィールドは足さない。
NewsItemへ後から `media` を足して辻褄を合わせることはしない
（既存の掲載単位とmanifest共有関係を変えてしまうため）。

PR #49のTikTok動画は次のobject identityを維持する。

```text
news item.media
      └──────────────► tiktokRadioVideo ◄────────────── galleryVideos item
                         │
                         └─ tiktokRadioVideo.json
                              ├─ MP4 1本
                              └─ poster 1枚
```

Activities実装で用途別manifest、MP4、posterを作らない。

---

## 6. Personal social / Radio program social

最新mainのschemaに合わせ、次の分離を維持する。

| ownership | 対象 | 保存先 | Activityからの参照 |
| --- | --- | --- | --- |
| Personal social | X、Instagram、TikTok `@mily_chan36`、SHOWROOM、MixChannel | `src/data/socials.ts` | `relatedSocialIds` |
| Radio / program | 湘南シーサイドサークル番組ページ、Instagram `@seasidecircle`、その他確認済み番組導線 | `src/data/links.ts` | `relatedLinkIds` |
| Program post source | PR #49のTikTok `@seasidecircle` 個別投稿 | `news.ts` / `tiktokRadioVideo.json` のsource | sourceとして表示 |

`socials.ts` のコメントとschemaは本人SNS専用で、`links.ts` は本人SNS以外の
番組・主催者リンクを既に保持している。このため新しい `programLinks.ts` は作らず、
現行の分離を採用する。

将来、`@seasidecircle` のTikTokプロフィール自体を恒常リンクとして追加する場合は、
一次ソース確認とオーナー確認後に `links.ts` へ追加する。PR #49の個別投稿URLから
プロフィール導線を自動生成せず、`socials.ts` へ混ぜない。

NEWSの `activityIds` は内容の関連分類であり、アカウントownershipではない。
どのActivityへ関連付けるかは明示的に決め、TikTok hostだけから推定しない。

---

## 7. Profile stale解消 — P2の具体策

P2では `profile.ts` の `miss-circle` activityを恒久的な説明へ変更する。

推奨形:

```ts
{
  id: "miss-circle",
  eyebrow: "MISS CIRCLE",
  title: "ENTRY 734として新しい一歩へ",
  body: "MISS CIRCLE CONTEST 2026にENTRY 734として挑戦。",
  points: ["ENTRY 734"],
  sourceIds: ["missCircle"],
  status: "confirmed",
}
```

- body / pointsから「二次審査進出」「三次審査進出」を除く。
- `currentPhase.name` をprofileへコピーしない。
- Bブロックや審査通過履歴は必要なら `highlights.ts` から「歩み」として表示し、
  現在状態に見えるProfile本文へ戻さない。
- `/profile/` のMISS CIRCLE cardに現在状態を出す場合、`ProfilePage.tsx` が
  `contest.currentPhase?.name`、`source`、`contest.lastVerifiedAt` を参照して描画する。
- current phaseがnullなら状態欄ごと非表示にし、Profile文から補完しない。

P2の回帰テスト:

- Profileの`miss-circle` body / pointsにcurrent phase語がない。
- Profile UIの状態欄が `contest.currentPhase` を参照する。
- `contest.currentPhase.name` をProfile dataへ複製していない。
- 既存のprofile source・identity・非公式表記のinvariantを維持する。

---

## 8. データフロー

```text
                           confirmed sources
                                  │
          ┌───────────────────────┼───────────────────────────┐
          │                       │                           │
          ▼                       ▼                           ▼
  activities.ts            domain sources              supportEvents.ts
  identity / route         contest.ts                   独立した応援期間
  relation ids             events.ts                    （他に正本なし）
          │                radio-program.js                    │
          │                /api/mily-schedule                  │
          │                /api/mily-radio-status              │
          │                       │                             │
          └───────────────┬───────┴─────────────────────────────┘
                          ▼
                 selectors / adapters
                 supportCalendar.ts
                 sortNewsByDateDesc()
                          │
             ┌────────────┼──────────────┐
             ▼            ▼              ▼
        /activities/   /support/      top sections
                                      Today / Support
```

UIはdataを書き換えない。同じ正本を各selectorが読む。表示用に生成した
ScheduleItemやDisplayStatusは永続化しない。

---

## 9. IA / UI

### 9.1 維持するroute

```text
/activities/
├─ /activities/miss-circle/
├─ /activities/radio/
├─ /activities/live/
└─ /activities/campus-girls/

/support/
├─ 今日のみりぃ
├─ NOW — 応援中
├─ Support Calendar
└─ 日程発表待ち
```

- `/activities/live/` はSHOWROOMだけでなくMixChannelを含められる安定した活動URL。
- `/support/` は「何を応援するか」を入口にし、Calendarはその一部とする。
- 「その他の活動」は `/activities/` 内に置き、内容がない専用routeを作らない。

### 9.2 Activities Hub

各cardはActivity identityを表示し、その下の状態行だけをdomain sourceから導出する。

```text
MISS CIRCLE   title/summary = activities.ts
               state       = contest.currentPhase

RADIO          title/summary = activities.ts
               weekly slot   = shared/radio-program.js
               now on air     = /api/mily-radio-status

LIVE STREAM    title/summary = activities.ts
               next slot     = /api/mily-schedule
               live state    = /api/mily-live
```

cardやActivity pageに `currentPhase` 等を静的文字列で持たせない。

このrepoはreact-routerではなくViteのMPA構成である。P3では各routeの物理HTML、
React entry、`vite.config.ts` input、canonical、sitemap、breadcrumb、URL guardを
同じ小PRで追加する。既存routeの出力やmetadataを巻き戻さない。

### 9.3 Support Hub / NOW

- 「今日のみりぃ」は既存 `TodayDashboard` を拡張する。
- MISS CIRCLE状態は `contest.currentPhase`、配信予定は既存hook、radio枠はsharedから読む。
- `NOW — 応援中` は、確認済み期間内のSupportEventまたはdynamic APIが
  現在進行中を示すものだけを出す。
- 日程不明のcontest phaseを「開催中」にしない。`日程発表待ち`へ分離する。
- current rankや投稿時点rankをNOWへ持ち上げない。
- API取得失敗を「予定なし」「終了」に変換しない。

**現在の `useStreamSchedule()` は失敗と空を区別できない。** `fetchSchedule()` は
`.catch(() => EMPTY)` ですべての失敗を空へ畳み、hookは `slots` と `roomUrl` しか
返さない。手入力fallback（`streamSchedule.ts`）は空であることが正常なので、
呼び出し側からは「取得に失敗した」と「予定が無い」が同じに見える。このままでは
上の「取得失敗を『予定なし』に変換しない」を実装で満たせない。

P5で、既存の呼び出し側の戻り値を壊さずに availability を足す。

```ts
type ScheduleAvailability = "loading" | "ok" | "unavailable";

// 既存の slots / roomUrl はそのまま。availability を追加するだけ。
useStreamSchedule(): { slots: StreamSlot[]; roomUrl: string | null; availability: ScheduleAvailability };
```

- 成功のみキャッシュする既存の規約は変えない（失敗はキャッシュしない）。
- `unavailable` のときは配信枠の行を出さず、**セクションを消さずに**
  「配信予定を取得できませんでした」と出す。`ok` かつ0件のときだけ従来どおり非表示。
- 静的な確認済み項目（contest / supportEvents / events / radio枠）は
  `unavailable` でもそのまま残す。
- `/api/mily-radio-status` 側は既存の `onAirConfirmed: null`（unavailable）が
  同じ役割を果たしているので変更しない。

### 9.4 Support Calendar

入力は次の5系統。

1. `contest.ts` の確認済みMISS CIRCLE公式日程
2. `supportEvents.ts` の独立した応援期間
3. `events.ts` の確認済み公開出演
4. `/api/mily-schedule` と既存fallbackをmergeした配信枠
5. `shared/radio-program.js` から展開したradio枠

モバイルはアジェンダを既定にする。サイトの `max-w-3xl` と情報密度では、月7列より
縦の時系列が読みやすい。デスクトップもアジェンダを既定にし、月表示は別PRの任意拡張。

日付のない項目はCalendarの日付軸へ置かず、下部の「日程発表待ち」に出す。

### 9.5 UI共通規約

- 既存の色tokenとcard表現を使う。新しいdesign systemを導入しない。
- iconは `aria-hidden`、意味は必ず文字labelで伝える。
- CTAは既存 `ExternalLink` を使う。
- ラジオ番組枠と本人出演時間を同一視しない。
- 空sectionは非表示。確認できない情報をplaceholderで埋めない。
- トップに巨大なCalendarを置かず、NOW最大2件と `/support/` 導線に留める。
- トップはポータル。NEWS / STORY / Gallery / 配信詳細 / 長いAbout / 公開Scheduleの本体は
  Hub または archive（`/news/` `/stories/` `/gallery/` `/support/` `/profile/`）へ移す。
  ホームには preview と入口だけを置き、コンテンツ量が増えてもホームの高さがほぼ増えない
  構造にする。

---

## 10. 実装Phase

1PRを巨大にせず、次の6PRへ分割する。

| Phase | 内容 | 主な変更 | UI |
| --- | --- | --- | --- |
| **P1** | Activity / Support data foundation | `activities.ts`、`supportEvents.ts`、`supportCalendar.ts`、domain adapters、ownership/schema test | なし |
| **P2** | Profile stale解消 | `profile.ts` の恒久説明化、Profile UIが`contest.ts`を参照、回帰test | Profileの不整合だけ解消 |
| **P3** | Activities Hub | `/activities/` + 4詳細route、Activity selector、optional `NewsItem.activityIds`、既存NEWS sorter利用 | 新route |
| **P4** | Support Hub + NOW | `/support/`、今日のみりぃ、NOW、pending。Calendar本体はまだ接続しない | 新route |
| **P5** | Support Calendar | 5系統adapterを接続、mobile agenda、pending分離 | `/support/`のみ |
| **P6** | Compact fan portal | ホームをポータル化。Today / Support / Activities の入口、Latest / STORY / Gallery の preview、route中心navigation。詳細は Hub / archive へ | トップ短縮・オーナー確認 |

順序は **P1 → P2 → P3 → P4 → P5 → P6**。
P2をP1と分けることで、Profile事実変更のオーナー確認と、data foundationのreviewを
独立させる。P3のNEWS分類はoptionalかつ明示付与だけにし、一括分類しない。

月間Calendarや既存NEWSの追加分類は、必要性と出典を確認してから別PRにする。

---

## 11. 実装時のtest / guard

### P1で追加するtest

| test | 保証する内容 |
| --- | --- |
| `scripts/activities.test.mjs` | id/route一意、relation id実在、Activityに状態・順位・日程fieldがない |
| `scripts/support-events.test.mjs` | source/verifiedAt必須、日付validator、Activity/current phase field禁止、既存domain日程の複製禁止、`confirmed-period` は `end` 必須・`end >= start`、`confirmed-instant` は `end` を持たない |
| `scripts/support-calendar.test.mjs` | ScheduleItemが導出のみ、contest日程はcontestから読む、null日付をCalendarに置かない、JST境界、API空でも安全、fan event由来の `activityId` が `null`（推測しない）、STORY経路を含めたmedia導出が同一manifestを重複させない |
| `displayStatus` の境界（上記test内） | 過ぎた `confirmed-instant` が `ended` になりNOWへ残らない。`allDay` の時点はJST暦日で切り替わる |
| schedule availability（上記test内） | `unavailable` と「`ok` かつ0件」を取り違えない。`unavailable` で静的項目が消えない |

### 後続Phaseで維持・拡張するtest

- `scripts/about.test.mjs` / profile invariant: P2の恒久説明とcontest参照。
- `scripts/news.test.mjs`: `sameDayOrder` と `sortNewsByDateDesc()` の唯一の順序規約。
- `scripts/tiktok-radio-misscircle-20260821.test.mjs`: program post ownershipと
  Latest/Galleryの同一manifest object、MP4、poster共有。
- `scripts/support-links.test.mjs`: personal socialとprogram linkの分離、確認済みCTA。
- `scripts/radio-status.test.mjs` / realtime tests: weekly slotの単一正本、
  freshなNOW ON AIR判定、本人出演の非推定。
- `scripts/events.test.mjs`: 公開出演日程の正本を維持。
- route追加時はcanonical、sitemap、JSON-LD、非公式表記を既存testへ追加。

各Phaseで必ず実行する。

```bash
pnpm typecheck
pnpm test
pnpm build
pnpm guard
git diff --check
```

---

## 12. リスクと禁止事項

| リスク | 対策 |
| --- | --- |
| MISS CIRCLE phaseのstale | current phaseは`contest.ts`だけ。Profile/Activity/Supportは参照 |
| MISS CIRCLE日程の二重管理 | 案A。公式日程は`contest.ts`だけ、Calendar adapterで導出 |
| SupportEventとeventsの重複 | 公開出演は`events.ts`から直接導出。SupportEventへ転記しない |
| 時刻依存表示のstale | active/ongoing/endedを保存せず、JSTのnowとAPIから導出 |
| NEWS同日順の分岐 | `sortNewsByDateDesc()`だけを使い、sameDayOrderを他modelへコピーしない |
| personal/program SNS混同 | `socials.ts`は本人だけ、番組は`links.ts`、投稿URLはsource |
| PR #49 mediaの複製 | `tiktokRadioVideo` object、MP4、posterをそのまま共有 |
| API障害時の誤断定 | unknownをnone/offlineへ変換しない。静的な確認済み項目だけ残す |
| 未公表日程の捏造 | null/date-pendingを日付軸へ入れない。新しい外部事実を推測しない |
| 過ぎた締切がNOWに残る | 時点ものは `confirmed-instant`。期間ものは `end` 必須。既定の長さを補わない |
| API失敗を「予定なし」と誤表示 | `useStreamSchedule()` に availability を足し、`unavailable` と0件を区別する |
| Activity動画の取りこぼし | NEWSの `media` と `relatedStorySlugs` 経由のSTORY mediaの和で導出する |
| fan eventのActivity誤推定 | `FanEvent` にactivityは無い。`activityId` は `null` のままにし、title/venueから推測しない |
| 巨大PR | P1〜P6を責務とUI境界で分割 |

PR #50では `docs/ACTIVITIES-SUPPORT-DESIGN.md` 以外を変更しない。
Draftのまま設計確定で停止し、merge・publish・`@codex review` 投稿は行わない。
