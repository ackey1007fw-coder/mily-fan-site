# Activities Hub / Support Calendar 設計 — mily-fan-site

みりぃ（三橋莉子 / Mily）の活動が増え、情報が Latest・profile・contest・
streamSchedule・radio に分散している。この設計は **新しい情報を増やさず**、
すでに確認済みの情報を「活動単位」「応援単位」で読める構造へ整理する。

- ルールの唯一の情報源は `AGENTS.md`。この文書はそれに従う設計案であり、ルールではない。
- **この文書は設計フェーズの成果物。実装は含まない。**
- 日常更新の手順は `docs/CONTENT-OPS.md`、写真・動画は `docs/MEDIA.md`。

調査時点: 2026-08-21 / `main` = `4cdd1e3`（PR #48 まで反映）

> **この文書に出てくる日付・状態について**
> 本文中の型定義やUI案に出てくる値のうち、`記入例` と明示したものは
> **確認済みの事実ではなく、形を示すためのダミー**である。
> 実装時は一次ソースで確認できた値だけを入れること。未確認なら
> `state: "date-pending"` のまま置く（推測して埋めない）。

---

## A. 現状分析

### A-1. いま情報がどこに分散しているか

| 事実の種類 | 現在の置き場 | 表示先 | 問題 |
| --- | --- | --- | --- |
| MISS CIRCLE の現在の審査段階 | `src/data/contest.ts` (`currentPhase`) | `TodayDashboard` のみ | 活動ページが無いので、ここ以外から参照されない |
| MISS CIRCLE の活動説明 | `src/data/profile.ts` `activities[]` の `miss-circle` | `/profile/` のみ | **`contest.ts` と状態が二重管理になっている（A-3参照）** |
| ラジオ番組の事実・放送枠 | `shared/radio-program.js`（単一 source of truth） | `ActivityBanner` / `/api/mily-radio-status` | 良い形。ただし「活動」としての入口が無い |
| ラジオ活動の説明 | `profile.ts` `activities[]` の `radio` | `/profile/` のみ | 番組リンク・番組SNSは `links.ts` にあり、繋がっていない |
| SHOWROOM 配信予定 | `/api/mily-schedule`（自動） + `src/data/streamSchedule.ts`（手入力fallback） | `StreamSchedule` / `TodayDashboard` / `ActivityBanner` | 良い形。ただし「イベント期間」は表現できない |
| ライブ配信活動の説明 | `profile.ts` `activities[]` の `showroom` | `/profile/` のみ | id が `showroom`（プラットフォーム名）。MixChannel も `socials.ts` にあり、カテゴリ名として既に狭い |
| CAMPUS GIRLS | `profile.ts` `activities[]` + `highlights.ts` | `/profile/` のみ | 結果は `highlights.ts`、説明は `profile.ts` に分かれている |
| 過去の節目 | `src/data/highlights.ts` | `/profile/` | 活動との紐付けが無い |
| 出演・イベント予定 | `src/data/events.ts` | `Schedule`（**現在 events は空 → 非表示**） | 型が `startAt: string` 必須で、**「日程未公表」を表現できない** |
| 日々の出来事 | `src/data/news.ts`（15件想定 / PR #49 後） | `Latest` / `portal-feed.json` | 活動との紐付けが無い |
| 写真・動画 | `media.ts` / `galleryVideos.ts` / `driveGallery` | `Gallery` / `Latest` / `/stories/` | 活動との紐付けが無い |
| 本人SNS | `src/data/socials.ts` | `Socials` / `TodayDashboard` | 良い形 |
| 番組・主催者リンク | `src/data/links.ts`（FM番組・FMスタッフ・@seasidecircle・ENTRY 734） | `#links` | **本人SNSと番組SNSが正しく分離済み**（設計19の前提は既に満たされている） |

### A-2. 再利用できるもの（新規に作らない）

1. **`shared/radio-program.js`** — 番組名・曜日・放送枠・URL の単一 source of truth。
   `schedulePhase()` / `msUntilNextPhaseChange()` が既にあり、カレンダーの
   ラジオ枠はここから**導出**できる。日程を別ファイルに書き写さない。
2. **`src/lib/bannerState.ts`** — 「断定しない」判定ロジックの既存の型。
   `now` を引数で受ける純粋関数、`stateLabel` で色に頼らず状態を伝える、
   API のスナップショットではなく時刻から再導出する、という3つの原則が
   すでに実装されている。**Support / Calendar はこの規約をそのまま踏襲する。**
3. **`src/lib/useStreamSchedule.ts`** — `/api/mily-schedule` 取得の集約フック。
   モジュールスコープ共有・5分TTL・失敗はキャッシュしない・SHOWROOMドメイン検証済み。
   Support Calendar もこのフックを使う（新しい fetch を足さない）。
4. **`src/data/contest.ts`** — `start: string | null` / `end: string | null` で
   **すでに「日程未公表」を第一級で扱っている**。設計12が求める考え方の実例。
5. **`src/data/events.ts` の日時ユーティリティ** — `isValidDateOnly` /
   `isValidDateTime` / `parseEventStartInstant` / `tokyoCalendarYear` は
   そのまま Support Calendar でも使える。**再実装しない。**
6. **`profile.ts` の `activities[]` 分類** — `radio` / `showroom` / `miss-circle` /
   `campus-girls` の4分類は、今回ほしいカテゴリとほぼ一致している（10章の想定どおり）。
7. **`src/components/TodayDashboard.tsx`** — **「今日のみりぃ」は既に存在する。**
   設計8のためにコンポーネントを新設せず、これを拡張する。
8. **`ExternalLink`** — `rel="noopener noreferrer"` と「新しいタブで開きます」の
   sr-only を集約済み。外部CTAは必ずこれを通す。

### A-3. いま実際に重複／不整合しているもの

いずれも**この設計で解消することが目的**である。

1. **MISS CIRCLE の審査段階が2箇所にある（実害あり）**
   - `contest.ts` … `currentPhase.name = "3次審査進出"`（`lastVerifiedAt: 2026-08-19`）
   - `profile.ts` `activities[].miss-circle` … `points: ["ENTRY 734", "Bブロック", "二次審査進出"]`、
     `body` も「二次審査へ進出」、`asOf: "2026-08-16"`
   → **`/profile/` は現在も「二次審査進出」と表示している。**
   同じ事実を2箇所に書いたことによる stale の実例。片方を「参照」に変えるべき根拠。
2. **ENTRY URL のハードコードが4箇所**
   `contest.entryUrl` があるにもかかわらず、`Support.tsx` / `StreamSchedule.tsx` /
   `MobileActionDock.tsx` / `Hero.tsx` が
   `https://2026.misscircle.jp/entry/734` を直書きしている
   （`scripts/support-links.test.mjs` がこれを固定している）。
   コンテストが 2027 になったときに4箇所を直す必要がある。
3. **CAMPUS GIRLS の説明と結果が分離**
   `profile.ts`（説明）と `highlights.ts`（審査員賞・2nd STAGE）が相互参照していない。
4. **SHOWROOM = ライブ配信カテゴリ、という前提のずれ**
   `profile.ts` の activity id は `showroom` だが eyebrow は `LIVE STREAM`。
   一方 `socials.ts` には MixChannel（別のライブ配信プラットフォーム）もある。
   `socials.ts` には「コンテスト用ルームのため終了後に変わる可能性あり」という
   コメントもある。**カテゴリ名にプラットフォーム名を使うと将来ずれる。**

### A-4. 足りない構造

1. **「参加中のイベント」を表現する型が無い。**
   `events.ts` の `FanEvent` は `startAt` 必須・`status` 無し・
   「発表待ち」を持てない。`streamSchedule.ts` の `StreamSlot` は
   `date` + `time` だけで期間を持てない。
2. **活動という第一級の概念が無い。** `profile.ts` の `activities[]` は
   プロフィール事実の一部で、id は安定しているが「今の状態」を持つ責務ではない。
3. **NEWS / Gallery から活動への逆引きが無い。**
4. **`/activities` `/support` に対応するルートが無い。**
5. **カレンダー表示（時系列の期間ビュー）が無い。** `Schedule.tsx` は
   年ごとのリストで、しかも `events` が空なので現在は非表示。

---

## B. 推奨IA（サイトマップ）

```
/                                     トップ
├─ ActivityBanner                     いま（既存・変更なし）
├─ #today       今日のみりぃ           既存 TodayDashboard を拡張
├─ #support     今のみりぃを応援する    Support.tsx を差し替え（コンパクトなハブカード）
│                                       └→ /support/ へ
├─ #activities  みりぃの活動           新設（4カテゴリのカード列のみ）
│                                       └→ /activities/ へ
├─ #stream      配信予定               既存・変更なし
├─ #latest      最新情報               既存・変更なし
├─ #stories     STORY                 既存・変更なし
├─ #gallery     ギャラリー             既存・変更なし
└─ #links       リンク                 既存・変更なし

/activities/                          Activities Hub「みりぃの活動」
├─ /activities/miss-circle/           👑 MISS CIRCLE
├─ /activities/radio/                 📻 RADIO
├─ /activities/live/                  📡 LIVE STREAM
├─ /activities/campus-girls/          🎓 CAMPUS GIRLS
└─ （その他の活動 = /activities/ 内のセクション。専用ルートは作らない）

/support/                             Support Hub「今のみりぃを応援する」
├─ 今日のみりぃ（サマリー）
├─ NOW — 応援中（進行中カード）
├─ 応援カレンダー（アジェンダ）
└─ 日程発表待ち（日付軸の外）

/profile/                             既存・変更なし（活動セクションから /activities/ へ導線を足すのみ）
/stories/<slug>/                      既存・変更なし
```

### 3層の役割分担

| 層 | 問い | ルート | データ |
| --- | --- | --- | --- |
| **Latest** | 何が起きた？ | `/#latest` | `news.ts`（時系列） |
| **Activities** | みりぃは何をしている？ | `/activities/…` | `activities.ts`（活動軸） |
| **Support** | 今日は何を応援すればいい？ | `/support/` | `supportEvents.ts` + 動的API（時間軸） |

**Latest は変更しない。** 既存の NEWS 運用（`docs/CONTENT-OPS.md`）はそのまま。

---

## C. 推奨データモデル

### C-1. 結論：3モデルのうち **2つだけを保存し、1つは導出する**

> **Activity と SupportEvent は保存する。ScheduleItem は保存しない（導出型にする）。**

理由：

1. カレンダーに載る項目の**出所が3系統ある**。
   - 静的な確認済み期間（審査期間・投票期間・イベント期間）→ 保存が必要
   - `/api/mily-schedule` 由来の SHOWROOM 配信予定 → **実行時に取得される**
   - ラジオ放送枠 → `shared/radio-program.js` の**曜日+時刻から導出できる**

   後者2つを `schedule.ts` に書き写すと、設計9が禁じている「同じ情報のコピー」に
   なるうえ、`AGENTS.md` の「未確認の配信時刻を書かない」「room ID を直書きしない」
   にも抵触しやすくなる。
2. ScheduleItem は本質的に**ビューの都合の型**（日付・終日フラグ・並び順）であり、
   事実ではない。事実（SupportEvent）と表示（ScheduleItem）を分けたほうが、
   同じ SupportEvent を「NOW カード」「カレンダー行」「活動ページの日程」の
   3通りに描き分けられる。
3. `bannerState.ts` が既に同じ形をしている（保存された状態ではなく、
   `now` から純粋関数で表示状態を導出する）。**リポジトリの既存の書き方に合わせる。**

したがって新規ファイルは次の3つ。

```
src/data/activities.ts        Activity（保存・約5件）
src/data/supportEvents.ts     SupportEvent（保存・確認済みの期間/状態のみ）
src/lib/supportCalendar.ts    ScheduleItem を導出する純粋関数（保存しない）
```

`src/data/schedule.ts` は**作らない**。

### C-2. Activity

```ts
// src/data/activities.ts

/** 活動カテゴリ。profile.ts の activities[].eyebrow と対応させる。 */
export type ActivityId =
  | "miss-circle"
  | "radio"
  | "live-stream"
  | "campus-girls";

export type Activity = {
  id: ActivityId;
  /** URL セグメント。id と分けるのは live-stream → /activities/live/ のため。 */
  slug: string;
  /** 色に頼らないための絵文字ラベル。必ず label とセットで使う。 */
  icon: string;
  /** 一覧・バッジ用の短いラベル（日本語） */
  label: string;
  /** 既存デザインの eyebrow 表記（英字） */
  eyebrow: string;
  title: string;
  summary: string;
  /**
   * 現在の状態を短く表す確認済みの語。
   * 例: "三次審査進出"。**日付や「今日」を含めない**（時刻依存の文字列を作らない）。
   * 出所が contest.ts など別データにある場合は、ここではなく参照先から取る。
   */
  statusLabel: string | null;
  /** statusLabel を確認した一次ソースURL。statusLabel が null なら null。 */
  statusSource: string | null;
  /** statusLabel を確認した日 "YYYY-MM-DD" */
  statusVerifiedAt: string | null;
  /** 関連する外部リンク（本人SNS/番組/主催者）。実体は socials.ts / links.ts を参照。 */
  socialIds: string[];   // socials.ts の SocialLink.id
  linkIds: string[];     // links.ts の SiteLink.id
  /** 既存の出典台帳への参照。profile.ts の profileSources のキー。 */
  sourceIds: ProfileSourceId[];
  /** 既存 highlights.ts の id。過去の節目を活動ページから引く。 */
  highlightIds: string[];
  /** 既存 stories.ts の slug。 */
  storySlugs: string[];
};
```

**含めないもの（意図的）**

- `newsIds` / `galleryIds` — **持たせない。** 逆向き（NEWS 側が `activityIds` を持つ）に
  する。1つの活動に紐づく NEWS は今後いくらでも増えるため、活動側に配列を持つと
  NEWS を1件足すたびに `activities.ts` も編集することになり、
  PR #49 のような日次更新PRと必ず衝突する。
- `start` / `end` — 活動は期間を持たない。期間は SupportEvent の責務。

### C-3. SupportEvent

```ts
// src/data/supportEvents.ts

export type SupportEventType =
  | "contest-round"    // 審査（一次/二次/三次…）
  | "vote"             // 投票期間
  | "stream-event"     // 配信イベント（SHOWROOMイベント等）
  | "broadcast"        // 単発の放送・出演
  | "appearance"       // 公開イベント・出演
  | "result";          // 結果発表

/**
 * 日程の状態。**判別可能ユニオンにするのが要点。**
 * "date-pending" のとき start に触れられないことを型で保証する。
 * （`start: string | null` だと、null チェックを忘れて表示に出せてしまう）
 */
export type SupportEventSchedule =
  | {
      state: "confirmed";
      /** "YYYY-MM-DD" または "YYYY-MM-DDTHH:mm:ss+09:00"（events.ts の検証関数を再利用） */
      start: string;
      /** 省略時は単日/単発 */
      end?: string;
      /** 時刻が未公表で日付だけ確認できている場合 true */
      allDay: boolean;
      timezone: "Asia/Tokyo";
    }
  /** 参加・進出は確認済みだが、日程が未公表 */
  | { state: "date-pending" }
  /** 開催予告のみで、実施自体が未確定 */
  | { state: "unannounced" };

export type SupportEvent = {
  id: string;
  activityId: ActivityId;
  title: string;
  /** 一覧で1行に収まる短い補足。無ければ省略。 */
  note?: string;
  type: SupportEventType;
  schedule: SupportEventSchedule;
  /**
   * 進行状況のうち **時刻から導出できないもの** だけを持つ。
   * 例: "三次審査進出"（＝この審査に進んだことは確認済み）。
   * 「開催中」「終了」は保存しない（下記 C-5 で導出する）。
   */
  progressLabel?: string;
  /** 応援導線。無ければ CTA を出さない。 */
  cta?: {
    label: string;
    /** https: のみ。ExternalLink 経由で描画する。 */
    url: string;
  };
  /** この項目のすべての主張を確認できる一次ソースURL（必須） */
  source: string;
  /** source を確認した日 "YYYY-MM-DD"（必須） */
  verifiedAt: string;
  /**
   * 同日・同状態のときの表示順。小さいほど上。
   * 未指定は 100。**日付の代わりに使わない。**
   */
  priority?: number;
};
```

**`confirmed` を名乗る条件**（`AGENTS.md` の「未確認情報を推測して書かない」の具体化）

- 一次ソース（主催者 / FM公式 / SHOWROOM / 本人SNS）に**その日付が書かれている**こと。
- 「二次最終日」のような表記から締切日を推定して `end` に入れない
  （`contest.ts` に既にある既存判断をそのまま踏襲する）。
- 「例年この時期」「たぶんこの日」は不可。→ `state: "date-pending"`。

### C-4. ScheduleItem（導出型・保存しない）

```ts
// src/lib/supportCalendar.ts

export type ScheduleSource = "support-event" | "showroom-api" | "radio-program";

export type ScheduleItem = {
  key: string;
  /** JSTの日付 "YYYY-MM-DD"。日付軸に載るものだけが持つ。 */
  date: string;
  /** "HH:mm"。終日なら null。 */
  startTime: string | null;
  endTime: string | null;
  allDay: boolean;
  /** 期間ものの何日目か（"8/20〜8/26" の途中の日に出すため）。単日なら null。 */
  span: { start: string; end: string } | null;
  activityId: ActivityId;
  title: string;
  note?: string;
  origin: ScheduleSource;
  /** 静的な確認済み項目のみ。API由来には無い。 */
  source?: string;
  cta?: { label: string; url: string };
};

/** 日付軸に載せられないもの。カレンダーの下に別枠で出す。 */
export type PendingItem = {
  key: string;
  activityId: ActivityId;
  title: string;
  reason: "date-pending" | "unannounced";
  progressLabel?: string;
  source: string;
  cta?: { label: string; url: string };
};

export type SupportCalendar = {
  days: { date: string; items: ScheduleItem[] }[];
  pending: PendingItem[];
};

export function buildSupportCalendar(input: {
  supportEvents: SupportEvent[];
  /** useStreamSchedule() の結果をそのまま渡す（新しい fetch を足さない） */
  streamSlots: StreamSlot[];
  /** shared/radio-program.js から導出する放送枠を含めるか */
  includeRadio: boolean;
  now: number;      // ← 必ず引数。Date.now() を関数内で呼ばない
  daysAhead: number;
}): SupportCalendar;
```

**設計上の要点**

- `state: "date-pending"` / `"unannounced"` の項目は **`days` に一切入れない。**
  日付が無いものを日付軸に置くと、必ずどこかの日に置くことになり、捏造になる。
  必ず `pending` へ振り分ける。
- ラジオ放送枠は `radioProgram.weekday` / `scheduledStart` / `scheduledEnd` から
  `daysAhead` 分だけ**その場で展開**する。`supportEvents.ts` に毎週の日曜を書かない。
- SHOWROOM API 由来の枠は `date` + `time` しか持たない（`api/mily-schedule.js` の
  `normalizeSlot` の出力がそう）。したがって `endTime` は **null 固定**。
  終了時刻を推定しない。
- 重複排除は `useStreamSchedule` の既存規約に合わせる（同じ `date`+`time` は
  静的側を優先）。

### C-5. 表示状態は導出する（設計8・12への回答）

```ts
export type DisplayStatus =
  | "live"           // 期間内（開始 <= now <= 終了）
  | "upcoming"       // これから
  | "ended"          // 終了済み
  | "date-pending"   // 進出・参加は確認済み、日程未公表
  | "unannounced";   // 発表待ち

export function displayStatus(event: SupportEvent, now: number): DisplayStatus;

/** 色に頼らないラベル。DisplayStatus と 1:1。 */
export const STATUS_LABEL: Record<DisplayStatus, string> = {
  live: "開催中",
  upcoming: "予定",
  ended: "終了",
  "date-pending": "日程発表待ち",
  unannounced: "発表待ち",
};
```

- **「開催中」「終了」は保存しない。** `now` から毎回導出する。
  → 設計8の「現在時刻依存の情報を静的な文字列でハードコードしない」を型で担保する。
- `progressLabel`（"三次審査進出"）は時刻に依存しないので保存してよい。
- `displayStatus` が `"date-pending"` でも `progressLabel` は表示できる。
  → 設計12の「start: null / end: null でも『三次審査進出』は表示できる」を満たす。

### C-6. 既存 profile.ts / contest.ts との関係

**`profile.ts` を巨大なCMSにしない**（設計10）ための責務分離：

| 内容 | 置き場 | 理由 |
| --- | --- | --- |
| 「ラジオで活動している」という**プロフィール事実** | `profile.ts` `activities[]`（現状維持） | 変わらない事実 |
| 「今どの審査段階か」という**状態** | `contest.ts`（既存） | 既に第一級で扱えている |
| 「活動カテゴリの identity・入口・関連リンク」 | `activities.ts`（新規） | ルーティングと導線の責務 |
| 「いつからいつまで」 | `supportEvents.ts`（新規） | 期間の責務 |

**A-3-1 の二重管理の解消**（Phase 1 に含める）：
`profile.ts` の `miss-circle` activity から状態語（`"二次審査進出"`）を外し、
`/profile/` の該当箇所は `contest.currentPhase.name` を参照する形にする。
`profile.ts` からは活動の**性質**（ENTRY 734 / Bブロック）だけを残す。
これで「二次」と「三次」が同時に表示される現在の不整合が消える。

---

## D. データフロー

```
                     ┌─ 一次ソース（確認済み公開情報のみ）─────────────────┐
                     │ MISS CIRCLE公式 / FM公式 / SHOWROOM / 本人SNS / 主催者 │
                     └──────────────┬───────────────────────────────────┘
                                    │ 人手で確認（docs/CONTENT-OPS.md）
        ┌───────────────────────────┼──────────────────────────────┐
        │                           │                              │
  ┌─────▼──────┐   ┌────────────────▼─────────┐   ┌────────────────▼────────┐
  │ 既存データ  │   │ activities.ts（新規）      │   │ supportEvents.ts（新規） │
  │ profile.ts │◄──┤ 活動の identity / 導線     │   │ 確認済みの期間と状態      │
  │ contest.ts │   │ sourceIds で既存台帳を参照 │   │ schedule: 判別ユニオン    │
  │ highlights │   └────────────┬─────────────┘   └────────────┬────────────┘
  │ socials    │                │                              │
  │ links      │                │                              │
  │ news       │                │                              │
  │ media      │                │                              │
  └─────┬──────┘                │                              │
        │                       │                              │
        │   ┌───────────────────┴──────────────────────────────┘
        │   │
        │   │  ┌─ 実行時取得（保存しない）──────────────────────┐
        │   │  │ /api/mily-schedule  → useStreamSchedule()      │
        │   │  │ /api/mily-radio-status → useMilyRealtimeStatus()│
        │   │  │ shared/radio-program.js → 放送枠を時刻から導出   │
        │   │  └───────────────────┬───────────────────────────┘
        │   │                      │
        │   ▼                      ▼
        │  ┌──────────────────────────────────────────────────┐
        └─►│ src/lib/supportCalendar.ts（純粋関数・now を引数） │
           │  buildSupportCalendar() / displayStatus()          │
           └───────┬──────────────┬───────────────┬────────────┘
                   │              │               │
         ┌─────────▼───┐  ┌───────▼──────┐  ┌─────▼──────────┐
         │ /support/    │  │ /activities/ │  │ トップページ     │
         │ NOW          │  │ 各活動ページ  │  │ #today / #support│
         │ カレンダー    │  │ の「今後の日程」│  │ #activities      │
         │ 日程発表待ち  │  │              │  │                  │
         └──────────────┘  └──────────────┘  └──────────────────┘
```

**一方向であることが重要。** UIはどこも `supportEvents.ts` を書き換えず、
同じ1件を3つのビューが読むだけ。**同じ事実のコピーはどこにも作らない。**

---

## E. UI 構成案（テキストワイヤーフレーム）

既存のデザイン言語（`max-w-3xl` / `rounded-3xl` / `border-sage/20` /
`bg-paper-card` / `shadow-card` / `min-h-11` のタップ領域）をそのまま使う。
**新しいデザインシステムは導入しない。**

### E-1. トップページ（モバイル / 375px想定）

```
┌───────────────────────────────┐
│ [●] 配信中  ただいまSHOWROOM…  │  ← ActivityBanner（既存・変更なし）
├───────────────────────────────┤
│ Header                        │  ← nav に「活動」「応援」を追加
├───────────────────────────────┤
│ Hero                          │  ← 既存・変更なし
├───────────────────────────────┤
│ ╭───────────────────────────╮ │
│ │ 今日のみりぃ  MISS CIRCLE… │ │  ← TodayDashboard（既存を拡張）
│ │ ENTRY 734  [三次審査進出]  │ │
│ │ ─────────────────────────  │ │
│ │ 👑 MISS CIRCLE 三次審査進出│ │  ← 追加行（activities/contest から導出）
│ │ 📡 SHOWROOM   イベント参加中│ │  ← supportEvents の live 件から
│ │ 📻 次回ラジオ  8/23(日)10:00 │ │  ← radio-program から導出
│ │ ─────────────────────────  │ │
│ │ [ENTRY 734を応援する      ] │ │
│ │ [SHOWROOMで見る          ] │ │
│ │ X  Instagram  TikTok       │ │
│ ╰───────────────────────────╯ │
├───────────────────────────────┤
│ 今のみりぃを応援する            │  ← Support.tsx を差し替え
│ ╭───────────────────────────╮ │
│ │ 🔥 NOW                     │ │
│ │ SHOWROOMイベント参加中      │ │
│ │ 〜 M月D日                  │ │  ← 日付は supportEvents から
│ │ [SHOWROOMを開く]           │ │
│ ╰───────────────────────────╯ │
│ ╭───────────────────────────╮ │
│ │ 👑 MISS CIRCLE             │ │
│ │ 三次審査進出                │ │
│ │ 日程：発表待ち              │ │  ← date-pending をそのまま表示
│ │ [MISS CIRCLEを見る]        │ │
│ ╰───────────────────────────╯ │
│ [ 応援カレンダーを見る →     ] │  ← /support/
├───────────────────────────────┤
│ みりぃの活動                   │  ← 新設セクション（カードのみ）
│ ╭─────────╮ ╭─────────╮      │
│ │👑 MISS   │ │📻 RADIO │      │  2列 grid（375pxで2列は成立する。
│ │  CIRCLE  │ │         │      │   タイトルが2行になっても崩れないよう
│ │三次審査進出│ │日曜10:00-│      │   固定高にしない）
│ ╰─────────╯ ╰─────────╯      │
│ ╭─────────╮ ╭─────────╮      │
│ │📡 LIVE   │ │🎓 CAMPUS│      │
│ │  STREAM  │ │  GIRLS  │      │
│ ╰─────────╯ ╰─────────╯      │
│ [ すべての活動を見る →       ] │  ← /activities/
├───────────────────────────────┤
│ 配信予定 / 最新情報 / STORY … │  ← 既存・変更なし
└───────────────────────────────┘
```

**トップに巨大なカレンダーは置かない**（設計15）。NOW カードは最大2件、
残りは `/support/` へ送る。

### E-2. `/support/` — Support Hub（モバイル）

```
┌───────────────────────────────┐
│ ← みりぃ ファンサイト           │  ← パンくず（Header 内）
│                               │
│ 今のみりぃを応援する            │  h1
│ 確認できた公開情報だけを載せています │
├───────────────────────────────┤
│ 今日のみりぃ                    │
│ 👑 MISS CIRCLE  三次審査進出    │
│ 📡 SHOWROOM    イベント参加中   │
│ 📻 次回ラジオ    M月D日(日) 10:00│
│ 🗳️ 投票        受付中           │  ← 確認できたときだけ出す
├───────────────────────────────┤
│ NOW — 応援中                   │
│ ╭───────────────────────────╮ │
│ │ 📡 LIVE STREAM  [開催中]   │ │  ← icon + label + 状態ラベル
│ │ SHOWROOM ○○イベント        │ │
│ │ M月D日 〜 M月D日            │ │
│ │ 出典を見る                  │ │
│ │ [SHOWROOMを開く          ] │ │
│ ╰───────────────────────────╯ │
│ ╭───────────────────────────╮ │
│ │ 👑 MISS CIRCLE [日程発表待ち]│ │
│ │ 三次審査                    │ │
│ │ 状態：三次審査進出           │ │
│ │ 日程：公式発表待ち           │ │
│ │ 出典を見る                  │ │
│ │ [MISS CIRCLEを見る       ] │ │
│ ╰───────────────────────────╯ │
├───────────────────────────────┤
│ 応援カレンダー                  │
│                               │
│ ── M月D日(金) 今日 ──          │  ← 今日を最初に見せる
│  ● 22:00  📡 SHOWROOM 配信予定 │
│  ▮ 終日   📡 ○○イベント (3/7日目)│
│                               │
│ ── M月D日(土) ──               │
│  ▮ 終日   📡 ○○イベント (4/7日目)│
│                               │
│ ── M月D日(日) ──               │
│  ● 10:00-13:00 📻 湘南シーサイド│
│     サークル 放送枠             │
│     ※番組枠3時間＝本人の出演    │
│       時間ではありません        │
│  ▮ 終日   📡 ○○イベント (5/7日目)│
│                               │
│ [ もっと見る ]                 │
├───────────────────────────────┤
│ 日程発表待ち                    │  ← 日付軸の外。ここが重要。
│ ・👑 MISS CIRCLE 三次審査       │
│    状態：三次審査進出            │
│    日程：公式発表待ち  出典を見る  │
├───────────────────────────────┤
│ ※日程は変更になる場合があります。 │
│ ※このサイトは非公式です。        │
└───────────────────────────────┘
```

### E-3. `/support/` — デスクトップ（≥1024px）

```
┌──────────────────────────────────────────────────────────┐
│ 今のみりぃを応援する                                        │
│ ┌─────────────────────────┬──────────────────────────────┐ │
│ │ 今日のみりぃ              │ NOW — 応援中                 │ │
│ │ 👑 三次審査進出           │ ╭──────────╮ ╭──────────╮   │ │
│ │ 📡 イベント参加中         │ │📡 開催中  │ │👑 発表待ち│   │ │
│ │ 📻 次回 M/D(日) 10:00    │ │…         │ │…         │   │ │
│ │ 🗳️ 投票 受付中           │ ╰──────────╯ ╰──────────╯   │ │
│ └─────────────────────────┴──────────────────────────────┘ │
│                                                            │
│ 応援カレンダー                    [ アジェンダ | 月表示 ]    │ ← 月表示は Phase 4b（任意）
│ ┌────────────────────────────────────────────────────────┐ │
│ │ アジェンダ（モバイルと同じ縦リスト。2カラムにしない）      │ │
│ └────────────────────────────────────────────────────────┘ │
│ 日程発表待ち                                                │
└──────────────────────────────────────────────────────────┘
```

**アジェンダをデスクトップでも既定にする根拠（設計16への回答）**

- サイト全体が `max-w-3xl`（768px）で統一されている。この幅に月間7列グリッドを
  入れると1セルが約100px弱になり、複数日にまたがるイベント帯と日本語タイトルが
  読めない。`max-w-3xl` を Support だけ広げると既存のデザイン言語から外れる。
- 載る項目が「毎週の放送枠 + 数件の配信予定 + 数件のイベント期間」であり、
  月グリッドの密度を必要とするほどの件数にならない。
- したがって **アジェンダ（時系列リスト）を全幅で既定**とし、
  月表示は Phase 4b の任意拡張に回す（実装しないまま完了してもよい）。

### E-4. `/activities/` — Activities Hub

```
┌───────────────────────────────┐
│ ← みりぃ ファンサイト           │
│ みりぃの活動                    │  h1
│ 活動ごとに、確認できた情報を      │
│ まとめています。                 │
├───────────────────────────────┤
│ ╭───────────────────────────╮ │
│ │ 👑 MISS CIRCLE             │ │
│ │ MISS CIRCLE CONTEST 2026   │ │
│ │ ENTRY 734 ／ 三次審査進出   │ │
│ │ 次の日程：発表待ち           │ │
│ │                        →   │ │
│ ╰───────────────────────────╯ │
│ ╭───────────────────────────╮ │
│ │ 📻 RADIO                   │ │
│ │ 湘南シーサイドサークル       │ │
│ │ FM湘南マジックウェイブ       │ │
│ │ 放送枠：日曜 10:00-13:00    │ │
│ │                        →   │ │
│ ╰───────────────────────────╯ │
│ ╭───────────────────────────╮ │
│ │ 📡 LIVE STREAM             │ │
│ │ SHOWROOM ／ MixChannel     │ │
│ │ 次の配信：M月D日 HH:MM      │ │
│ │                        →   │ │
│ ╰───────────────────────────╯ │
│ ╭───────────────────────────╮ │
│ │ 🎓 CAMPUS GIRLS            │ │
│ │ CAMPUS GIRLS 2027          │ │
│ │ 審査員賞 ／ 2nd STAGE進出   │ │
│ │                        →   │ │
│ ╰───────────────────────────╯ │
├───────────────────────────────┤
│ その他の活動                    │  ← 専用ルートは作らない
│ （確認できた活動が増えたらここに   │
│   追加されます）                 │
└───────────────────────────────┘
```

### E-5. `/activities/miss-circle/` — 活動詳細（共通レイアウト）

すべての活動ページは**同じ1つのコンポーネント**で描く（`ActivityPage`）。
セクションはデータが空なら丸ごと非表示（既存 `Schedule` / `StreamSchedule` と同じ規約）。

```
┌───────────────────────────────┐
│ ← みりぃの活動                  │  ← パンくず
│ 👑 MISS CIRCLE                 │  eyebrow
│ MISS CIRCLE CONTEST 2026       │  h1
│ ENTRY 734                      │
│ [三次審査進出]  出典を見る       │  ← contest.ts から。状態ラベル＋出典
├───────────────────────────────┤
│ 今後の日程                      │  ← supportEvents（この activityId のみ）
│ ・三次審査   日程：公式発表待ち   │
│ ・投票       受付中 / 期間未公表  │
├───────────────────────────────┤
│ 応援する                        │
│ [ENTRY 734ページを開く        ] │
│ [SHOWROOMで応援する          ] │  ← 関連活動への導線
├───────────────────────────────┤
│ これまでの歩み                   │  ← highlights.ts（highlightIds）
│ 2026-08-19 三次審査進出         │
│ 2026-xx-xx 二次審査進出         │
├───────────────────────────────┤
│ 関連する最新情報                 │  ← news.activityIds で絞り込み
│ （3件まで）  [ Latest で見る → ]│  ← 0件なら「Latest を見る」だけ出す
├───────────────────────────────┤
│ 関連する写真・動画               │  ← NEWS 経由で導出（G-3参照）
├───────────────────────────────┤
│ 関連リンク                      │  ← linkIds / socialIds
└───────────────────────────────┘
```

### E-6. RADIO ページの固有事項（設計14）

```
📻 RADIO
湘南シーサイドサークル ／ FM湘南マジックウェイブ

放送枠：日曜 10:00〜13:00        ← shared/radio-program.js
状態：  放送時間 / 放送中 / —     ← bannerState.ts の判定をそのまま使う
[ラジオを聴く]                    ← radioProgram.listenUrl

⚠ 番組枠3時間＝みりぃの出演時間ではありません。
   NOW ON AIR が確認できない場合は「放送中」と表示しません。

関連リンク
・湘南シーサイドサークル 番組ページ（FM公式）      ← links.ts
・湘南シーサイドサークル Instagram @seasidecircle ← links.ts（番組側）
・MilyのFMプロフィール                          ← links.ts
・みりぃ本人 TikTok @mily_chan36                ← socials.ts（本人）
```

**本人アカウントと番組アカウントを混ぜない**（設計19）。
- 本人 = `socials.ts`（`@mily_chan36`）→「みりぃのSNS」見出しの下
- 番組 = `links.ts`（`@seasidecircle`）→「番組の公式SNS」見出しの下

PR #49 が追加する TikTok 動画の出典は `@seasidecircle`（番組側アカウント）である。
merge 後、その NEWS に `activityIds: ["radio"]` を付ければ RADIO ページから
参照できる。**番組TikTokを `socials.ts` に移さない。**

### E-7. 色とアイコンの扱い（設計17）

既存のトークン（`sage` / `apricot` / `rose`）だけを使い、活動ごとに新色を足さない。
**色は補助であり、意味は必ず icon + テキストラベルで伝える。**

| 活動 | icon | label | 既存トークン |
| --- | --- | --- | --- |
| MISS CIRCLE | 👑 | MISS CIRCLE | `sage`（既存の応援導線と同系） |
| RADIO | 📻 | RADIO | `apricot`（既存 `ActivityBanner` のラジオ配色と一致） |
| LIVE STREAM | 📡 | LIVE STREAM | `sage-deep` |
| CAMPUS GIRLS | 🎓 | CAMPUS GIRLS | `ink-muted` |

状態も同様に、`STATUS_LABEL`（開催中 / 予定 / 終了 / 日程発表待ち / 発表待ち）を
必ずテキストで出す。`ActivityBanner` が既に `stateLabel` でこれをやっている。

---

## F. route 構造

### F-1. 前提：このサイトは MPA であり、react-router を使っていない

`vite.config.ts` の `rollupOptions.input` に物理 HTML を列挙する構成。
1ルート増やすごとに必要なもの：

1. `<route>/index.html`（約100行。canonical / OGP / JSON-LD / breadcrumb）
2. `src/<name>-main.tsx`（エントリ）
3. ページコンポーネント
4. `vite.config.ts` の `input` へ1行
5. `siteMetadataPlugin()` の canonical プレースホルダ置換
6. `src/data/site.ts` の `sitemapXml()` へ `<url>`
7. `public/sitemap.xml` の実ファイル
8. `scripts/check-site-url.mjs` のガード（ルートごとに直書きされている）

### F-2. 最終案

| ルート | 内容 | Phase |
| --- | --- | --- |
| `/activities/` | Activities Hub | 2 |
| `/activities/miss-circle/` | MISS CIRCLE | 2 |
| `/activities/radio/` | RADIO | 2 |
| `/activities/live/` | LIVE STREAM | 2 |
| `/activities/campus-girls/` | CAMPUS GIRLS | 2 |
| `/support/` | Support Hub + NOW + カレンダー + 発表待ち | 3–4 |

**`/activities/other` は作らない。** 「その他の活動」は `/activities/` 内の
セクションとして出し、十分な内容が集まった活動だけを個別ルートへ昇格させる。
空ページを作らないため。

### F-3. `/activities/showroom` vs `/activities/live` — **`/activities/live` を推奨**

| 観点 | `/activities/showroom` | `/activities/live` |
| --- | --- | --- |
| 既存の分類名 | `profile.ts` の id が `showroom` | `profile.ts` の eyebrow が `LIVE STREAM` |
| 将来 | `socials.ts` に「コンテスト用ルームのため終了後に変わる可能性あり」と明記あり | プラットフォームが変わってもURLが生きる |
| 網羅性 | MixChannel（`socials.ts` に確認済みで存在）を含められない | ライブ配信全体を含められる |
| SEO | 「SHOWROOM みりぃ」に強い | 弱い |
| リポジトリの方針 | — | `AGENTS.md`「年号付きの専用サイトにしない・2027年以降も同じ repo」と整合 |

→ **URL は `/activities/live/`、`ActivityId` は `live-stream`、`eyebrow` は
`LIVE STREAM` を採用。** ページ本文の見出しには「SHOWROOM」を明示して
検索性を確保する（URLの永続性と検索性を両立させる）。

### F-4. `/support` vs `/schedule` — **`/support` を推奨**

| 観点 | `/support` | `/schedule` |
| --- | --- | --- |
| ユーザーの問い | 「今日は何を応援すればいい？」 | 「いつ？」 |
| 既存サイト構造 | `navigation.ts` に「応援する」が既にある。`#support` アンカー済み | `#schedule`（`events.ts` のセクション）と衝突する |
| API名 | — | `/api/mily-schedule` と紛らわしい |
| 中身 | NOW / 今日のみりぃ / カレンダー / 発表待ち を全部含められる | カレンダーしか名乗れない |

→ **`/support/`。** カレンダーはその中の1セクション。
将来カレンダーが十分大きくなったら `/support/calendar/` へ切り出す余地を残す。
既存の `#schedule` セクション（`events.ts`）は**この設計では触らない**
（`events` は現在空で非表示。Phase 5 以降に統合を再検討する）。

### F-5. ルート追加コストを下げる小さな前提整備（Phase 1 に含める）

現在の `siteMetadataPlugin()` は `__STORY_SECOND_ROUND_CANONICAL__` のように
**1ルートにつき1つの固定プレースホルダ**を持つ。6ルート増やすとこれが6個増え、
`check-site-url.mjs` も同じだけ直書きが増える。

推奨：`site.ts` に

```ts
export function activityUrl(slug: string): string;   // /activities/<slug>/
export function activitiesUrl(): string;             // /activities/
export function supportUrl(): string;                // /support/
```

を足し、`sitemapXml()` を活動リストから生成する形へ変える。
プラグイン側も汎用プレースホルダ（`__CANONICAL__` を input ごとに解決）へ寄せる。
**これは既存ルートの出力を1文字も変えない**（既存テストが検知できる）。

### F-6. パンくず

`/profile/` の JSON-LD `BreadcrumbList` パターンをそのまま踏襲。

```
ホーム > みりぃの活動 > MISS CIRCLE
ホーム > 今のみりぃを応援する
```

---

## G. 既存データとの統合方針

### G-1. `/api/mily-schedule` との統合（設計13）

**壊さない。room ID を新しくハードコードしない。**

```
useStreamSchedule()  ← 既存フックをそのまま使う（新しい fetch を書かない）
   │  slots: StreamSlot[]（静的 streamSchedule.ts と自動取得のマージ済み）
   │  roomUrl: string | null（SHOWROOMドメイン検証済み）
   ▼
buildSupportCalendar({ streamSlots: slots, ... })
   │
   ├─ ScheduleItem { origin: "showroom-api", endTime: null, activityId: "live-stream" }
   └─ CTA の href は roomUrl を最優先（無ければ socials.ts の確認済みURL）
```

規約：

- **`supportEvents.ts` に個別の配信予定を書かない。** 配信予定はAPI由来。
  静的 fallback が必要なら既存の `streamSchedule.ts` を使う（新しい置き場を作らない）。
- `supportEvents.ts` が持つのは**イベント期間**（"○○イベント M/D〜M/D"）だけ。
  期間と個別の配信枠は別物なので二重にならない。
- 重複排除は既存の `upcomingSlots()` の規約（同じ `date`+`time` は手入力優先）に従う。
- API失敗時は SHOWROOM 由来の行が消えるだけで、静的な確認済み項目は残る。
  **「取得できなかった」を「予定が無い」と表示しない**（見出しは出したまま、
  該当セクションが空なら非表示にする既存規約に合わせる）。

### G-2. NEWS との関連付け（設計21）— **段階導入を推奨**

```ts
// src/data/news.ts の NewsItem に1フィールド追加（optional）
activityIds?: ActivityId[];
```

**一気に15件を手作業分類しない。** 理由：

1. `news.ts` は日次更新の主戦場で、`scripts/*.test.mjs` の多くが
   **配列の並び順を index 指定で固定している**（PR #49 は NEWS 1件の追加で
   8つのテストファイルを書き換えている）。大きな一括変更は衝突を招く。
2. 本文から活動を推測して分類すると、`AGENTS.md` の「未確認情報を推測して書かない」に
   触れる。分類は事実の主張になる。

段階導入：

| 段階 | やること |
| --- | --- |
| Phase 1 | `activityIds?: ActivityId[]` を**型に追加するだけ**（既存15件は未設定のまま）。並び順は1文字も変わらない |
| Phase 2 | 活動ページは「明示的な `activityIds`」＋「**出典URLのホストから確定できるもの**」で絞る |
| Phase 6（任意） | 残りをオーナー確認のうえ、少しずつ付ける |

**出典ホストからの補助解決**（推測ではなく、出典そのものが根拠）：

| 出典ホスト | 活動 |
| --- | --- |
| `2026.misscircle.jp` / `x.com/circle_contest` | `miss-circle` |
| `showroom-live.com` | `live-stream` |
| `fm-smw.jp` | `radio` |
| `x.com/campusgirlsboys` | `campus-girls` |

`x.com/Mily_chan36` や `instagram.com/mily_chan36` のような**本人アカウント由来の
投稿は、ホストからは活動を決められない**。これらは明示的な `activityIds` が
無い限り、どの活動ページにも出さない（Latest では従来どおり全件出る）。

活動ページで該当NEWSが0件のときは、空リストを出さず
「最新情報は Latest で見る →」だけを出す。

### G-3. Gallery との関連付け（設計22）— **NEWS 経由で導出する**

**media 側に `activityId` / `tag` を足さない。** 理由：

1. `media.ts` / `galleryVideos.ts` / 各 `*.json` マニフェストは**メディアPRの
   主戦場**で、sha256・寸法・fps までテストで固定されている
   （`scripts/tiktok-radio-misscircle-20260821.test.mjs` 参照）。
   分類フィールドを足すと毎回のメディアPRと衝突する。
2. 独立動画は既に **NEWS と同じ manifest オブジェクトを共有**している
   （`news.media === tiktokRadioVideo`）。つまり関係は既に存在する。

```
Activity  ──activityIds──►  NewsItem  ──.media──►  GalleryVideoItem
                                                    （同一オブジェクト参照）
```

導出関数（保存しない）：

```ts
// src/lib/activityMedia.ts
export function activityMedia(activityId: ActivityId, items: NewsItem[]): NewsMedia[];
```

**新しいフィールド0個・重複登録0件**で「RADIO の動画」「MISS CIRCLE の動画」が出せる。

NEWS に紐づかないメディア（Drive Gallery の `b02` バッチ、`media.ts` の写真）は
この方法では引けない。それが実際に必要になった時点で、
`media.ts` に optional な `activityIds?: ActivityId[]` を足すか判断する
（**今は足さない**。使われない分類フィールドを先に作らない）。

### G-4. `profile.ts` との統合（設計10）

| 変更 | 内容 |
| --- | --- |
| **足す** | `ProfileActivity` に `activityId?: ActivityId`（`/profile/` から `/activities/<slug>/` へリンクするためだけの1フィールド） |
| **外す** | `miss-circle` activity の `points` / `body` から審査段階の状態語を外す（A-3-1 の解消） |
| **足さない** | 期間・日程・イベント・活動履歴。これらは `supportEvents.ts` / `highlights.ts` の責務 |

`profile.ts` は今後も「変わらないプロフィール事実」の置き場に留める。

### G-5. `contest.ts` との統合

`contest.ts` は**そのまま残す**（既に「未公表を第一級で扱う」実例になっている）。
`activities.ts` の `miss-circle` は `contest.ts` を参照する形にし、
状態文字列を `activities.ts` に**コピーしない**。

```ts
// activities.ts では statusLabel を null にして、UI 側で contest から解決する
{ id: "miss-circle", statusLabel: null, statusSource: null, ... }
// ActivityPage: contest.currentPhase?.name ?? null
```

三次審査の期間が公表されたら、`contest.currentPhase.start/end` を埋め、
同時に `supportEvents.ts` の該当項目を `state: "confirmed"` へ変える。
**この2箇所は役割が違う**（`contest` = コンテストの現在段階、
`supportEvents` = カレンダーに載る期間）が、更新手順は `docs/CONTENT-OPS.md` に
1つの節としてまとめる（更新漏れ防止）。

---

## H. migration plan（既存を壊さない手順）

### H-0. 大原則

- **既存データファイルの削除・移動をしない。** 追加と参照だけで進める。
- **既存ルートの出力バイトを変えない。** 変えたら `check-site-url.mjs` /
  `site-url.test.mjs` / `initial-content.test.mjs` が検知する。
- 各PRで `pnpm typecheck` / `pnpm test` / `pnpm build` / `pnpm guard` を通す。

### H-1. 段階

| 段階 | 作業 | 既存への影響 |
| --- | --- | --- |
| M1 | `activities.ts` / `supportEvents.ts` / `supportCalendar.ts` を**追加のみ**。どのコンポーネントからも import しない | なし（UIは1pxも変わらない） |
| M2 | `NewsItem.activityIds?` を optional で追加。既存15件は未設定 | なし（並び順不変・テスト不変） |
| M3 | `ProfileActivity.activityId?` を optional で追加 | なし |
| M4 | `site.ts` に `activityUrl()` / `supportUrl()` を追加し、`sitemapXml()` を生成式へ。**出力文字列は現状と同一**にする | なし（既存テストが同一性を保証） |
| M5 | `profile.ts` の `miss-circle` から状態語を外し、`/profile/` を `contest.currentPhase` 参照へ | **`/profile/` の表示が「二次審査進出」→「三次審査進出」に変わる（＝バグ修正）**。`scripts/about.test.mjs` の該当アサーションを更新 |
| M6 | 新ルートを追加（既存 HTML は触らない） | なし |
| M7 | トップページ統合。`Support.tsx` を差し替え | **`scripts/support-links.test.mjs` が `Support.tsx` に ENTRY URL 直書きを要求している**。新 Support カードにも ENTRY 734 導線を残せば通る。残さない設計にするなら同テストの更新が必要（要オーナー確認） |

### H-2. 触ってはいけないもの

- `api/mily-schedule.js` / `api/mily-live.js` / `api/mily-radio-status.js` / `server/mily-showroom.js`
- `shared/radio-program.js`（事実の追加はここだけで行う。読むのは自由）
- `public/media/**`（公開済みファイル名は不変）
- `src/data/media.ts` / `driveGalleryManifest.json` / 各メディア `*.json`

### H-3. 追加が必要なテスト（Phase ごと）

| テスト | 内容 |
| --- | --- |
| `scripts/activities.test.mjs` | `ActivityId` と `slug` の一意性、`sourceIds` が `profileSources` に実在、`linkIds`/`socialIds` が実在、`highlightIds` が実在 |
| `scripts/support-events.test.mjs` | `source` と `verifiedAt` が必須で実在、`activityId` が実在、`confirmed` の `start`/`end` が `isValidEventTimestamp` を通る、`end >= start` |
| `scripts/support-calendar.test.mjs` | `date-pending`/`unannounced` が `days` に**絶対に入らない**、同日並び順、期間の展開、API失敗（空配列）でも落ちない、`now` 固定での `displayStatus` |
| `scripts/site-url.test.mjs`（既存に追記） | 新ルートの canonical / sitemap / OGP |

---

## I. risks

| # | リスク | 対策 |
| --- | --- | --- |
| 1 | **同じ情報の二重管理** | 状態は1箇所（`contest.ts`）、期間は1箇所（`supportEvents.ts`）。活動側は参照のみ。`activities.ts` に `newsIds`/`galleryIds` を持たせない（逆向きにする）。A-3-1 は M5 で解消 |
| 2 | **stale schedule** | 「開催中/終了」は保存せず `now` から導出。`verifiedAt` を全 SupportEvent に必須化し、UIに出典と確認日を出す。過ぎた項目は既定で畳む |
| 3 | **未確認情報の混入** | `schedule` を判別ユニオンにし、`date-pending` では型上 `start` を読めなくする。「発表待ち」を正式な表示状態にして、埋める動機自体を無くす |
| 4 | **動的APIと静的dataの混在** | `ScheduleItem.origin` で出所を必ず区別。API由来には `source`/`endTime` を持たせない（無い情報を作らない）。API失敗時は行が消えるだけで静的項目は残る |
| 5 | **same-day order** | 明示ルール：日付昇順 → ①時刻あり（開始時刻昇順）→ ②終日 → ③期間の途中日 → 同着は `priority` 昇順 → 同着は `id` 昇順。`news.ts` の「同日は id 昇順」という既存規約と揃える。テストで固定する |
| 6 | **SSR / timezone** | このサイトに SSR は無い（各ルート client-side render）。`Date.now()` はクライアントのローカル時計。すべての日付処理を `Intl.DateTimeFormat({ timeZone: "Asia/Tokyo" })` 経由にする（`bannerState.tokyoToday()` / `useStreamSchedule.todayKey()` の既存パターンを再利用）。`buildSupportCalendar` は `now` を必ず引数で受ける |
| 7 | **ビルド時の焼き込み** | `portal-feed.json` は `generateBundle` で焼かれる。**カレンダーを同じやり方で焼かない**（CDNに古い「今日」が残る）。カレンダーは必ず実行時計算 |
| 8 | **mobile calendar UX** | 月グリッドを既定にしない（E-3の根拠）。アジェンダ既定。`overflow-x` を出さない（`App.tsx` に `overflow-x-hidden` あり）。今日/NOW を最上部に置く。タップ領域 `min-h-11` を維持 |
| 9 | **external source availability** | FM の NOW ON AIR / SHOWROOM API は落ちうる。既存の「失敗を偽の状態に変換しない」規約（`onAirConfirmed: null`、`clearOnError: true`）をそのまま踏襲。落ちても静的な確認済み情報だけで `/support/` は成立する |
| 10 | **「番組放送中」＝「本人出演中」の誤断定** | `bannerState.ts` の既存判定（fresh な `onAirConfirmed === true` のときだけ「放送中」）をそのまま使う。RADIO ページに「番組枠3時間＝本人の出演時間ではありません」を常時表示（`profile.ts` に既にある文言） |
| 11 | **MPA のルート追加コスト** | F-5 の前提整備を Phase 1 に入れる。1ルートあたり HTML 約100行は残るが、canonical/sitemap/ガードの直書きは減らせる |
| 12 | **`news.ts` テストの脆さ** | Phase 1–2 では `news.ts` に**型のフィールドを1つ足すだけ**にとどめ、配列の中身と並び順を変えない。値の付与は独立PRへ |
| 13 | **PR #49 との衝突** | `news.ts` / `galleryVideos.ts` / `docs/CONTENT-OPS.md` / `docs/MEDIA.md` / `scripts/*.test.mjs` を今回一切触らない。この設計文書（新規ファイル）のみをコミット |
| 14 | **`support-links.test.mjs` が UI を固定している** | `Support.tsx` は ENTRY URL 直書きを、`MobileActionDock.tsx` / `Hero.tsx` も同様に固定されている。Phase 5 で差し替える際は、ENTRY 734 導線を残すか、同テストの更新をオーナー確認のうえ行う |
| 15 | **`events.ts`（`#schedule`）との重複懸念** | `events` は現在空で非表示。今回は触らない。SupportEvent が定着したあとで、`events.ts` を SupportEvent へ寄せるか別責務として残すかを再検討する（この設計では決めない） |
| 16 | **絵文字アイコンの読み上げ** | 絵文字は `aria-hidden="true"` にし、意味はテキストラベルで持つ（既存 `ActivityBanner` の `<span aria-hidden="true">` パターンに合わせる） |

---

## J. 実装 Phase 分割（PR案）

1PRを大きくしない。各PRで4つの品質ゲートを通す。

| PR | タイトル案 | 内容 | 変更ファイル数の目安 | UI変化 |
| --- | --- | --- | --- | --- |
| **P1** | `feat: activities / support のデータ基盤を追加` | `activities.ts` / `supportEvents.ts` / `supportCalendar.ts` / `activityMedia.ts` を追加。`NewsItem.activityIds?`・`ProfileActivity.activityId?` を optional 追加。`site.ts` に URL ヘルパー。テスト3本 | 新規7・変更3 | **なし** |
| **P2** | `fix: /profile/ の MISS CIRCLE 審査段階を contest.ts 参照にする` | A-3-1 の二重管理を解消（M5） | 変更2・テスト1 | `/profile/` が「三次審査進出」に |
| **P3** | `feat: Activities Hub と各活動ページを追加` | `/activities/` + 4ルート。`ActivityPage` 共通コンポーネント。sitemap / canonical / breadcrumb | 新規12前後 | 新ルートのみ |
| **P4** | `feat: Support Hub と NOW を追加` | `/support/` の「今日のみりぃ」「NOW — 応援中」まで。カレンダーはまだ載せない | 新規4・変更2 | 新ルートのみ |
| **P5** | `feat: 応援カレンダー（アジェンダ）を追加` | `/support/` にカレンダー＋「日程発表待ち」。`useStreamSchedule` / radio 導出を接続 | 新規2・変更1 | `/support/` のみ |
| **P6** | `feat: トップページに応援ハブと活動導線を追加` | `Support.tsx` 差し替え、`#activities` セクション追加、`TodayDashboard` 拡張、`navigation.ts`、`MobileActionDock` | 変更6前後 | **トップページが変わる（要オーナー確認）** |
| **P7**（任意） | `chore: 既存NEWSに activityIds を付与` | 出典ホストから確定できるものを中心に段階付与 | 変更1・テスト数本 | 活動ページの関連NEWSが増える |
| **P8**（任意） | `feat: デスクトップの月間カレンダー表示` | アジェンダ⇄月表示の切り替え | 新規1・変更1 | `/support/` のみ |

**ご希望の Phase 1–5 との対応**

| ご希望 | 本案 | 差分の理由 |
| --- | --- | --- |
| Phase 1 データ基盤 | **P1** | 同じ |
| — | **P2 を追加** | 実装前に既存の二重管理（二次/三次）を潰しておかないと、活動ページが最初から不整合を映す |
| Phase 2 Activities Hub + 各ページ | **P3** | 同じ |
| Phase 3 Support Hub + NOW | **P4** | 同じ |
| Phase 4 Support Calendar | **P5** | 同じ |
| Phase 5 トップページ統合 | **P6** | 同じ。ただし `support-links.test.mjs` の扱いにオーナー確認が要る |
| — | **P7 / P8 を任意で追加** | 分類の一括作業と月表示は本体から切り離す |

**推奨する着手順は P1 → P2 → P3。** P2 は P1 と独立に先行してもよい
（現在 `/profile/` に見えている不整合の修正なので、単独でも価値がある）。

---

## K. この設計が守っているルール（`AGENTS.md` 対応表）

| ルール | 対応 |
| --- | --- |
| 未確認情報を推測して書かない | `date-pending` / `unannounced` を第一級の状態にし、埋める必要を無くした |
| 空より間違った値の方が悪い | 判別ユニオンで、未確認時に `start` を型として読めなくした |
| すべての事実に出典 | `SupportEvent.source` / `verifiedAt` を必須。`Activity.sourceIds` は既存 `profileSources` を参照 |
| room ID を直書きしない・推測しない | カレンダーは `useStreamSchedule()` 経由のみ。`supportEvents.ts` に配信予定を書かない |
| `/api/mily-schedule` を壊さない | API・server・shared を一切変更しない |
| `/api/mily-radio-status` を壊さない | 同上。放送状態は `bannerState.ts` の既存判定を再利用 |
| 「番組放送中」≠「みりぃ出演中」 | RADIO ページに注記を常時表示。`milyAppearanceConfirmed` が true でない限り出演を断定しない |
| 「公式」と誤認させない | 全ページに既存 Footer の非公式表記。`/support/` にも注記 |
| 外部リンクは `ExternalLink` 経由 | すべての CTA に適用 |
| 本人SNSと番組SNSを混同しない | `socials.ts`（本人）と `links.ts`（番組）を別見出しで表示 |
