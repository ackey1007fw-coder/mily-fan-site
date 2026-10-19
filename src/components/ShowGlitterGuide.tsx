import { useState } from "react";
import { SECTION_ANCHOR_OFFSET } from "../lib/navigation";
import { parseOfficialPoints, planShowGlitterWeek, SHOW_GLITTER } from "../lib/showGlitter";

const weekMilestones = [
  ["月", "6,000"], ["火", "12,000"], ["水", "18,000"], ["木", "24,000"],
  ["金", "30,000"], ["土", "36,000"], ["日", "42,000"],
] as const;

const sources = [
  { name: "SHOWROOM公式：SHOWグリッターの獲得条件・特典", href: "https://campaign.showroom-live.com/award2024/" },
  { name: "SHOWROOM公式：2025年6月からの有料ギフトボーナス変更", href: "https://note.com/showroom_note/n/n7b412397238d" },
  { name: "SHOWROOM：Classicジャンルランキング", href: "https://www.showroom-live.com/ranking" },
] as const;

const fieldClass = "mt-2 w-full rounded-2xl border border-sage/25 bg-white px-4 py-3 text-base text-ink shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage";

/** ファン制作の公開説明。ギフト額や実際の獲得順位は推定しない。 */
export function ShowGlitterGuide() {
  const [weeklyRaw, setWeeklyRaw] = useState("");
  const [dailyRaw, setDailyRaw] = useState("");
  const [daysRemaining, setDaysRemaining] = useState("7");
  const weeklyPoints = parseOfficialPoints(weeklyRaw);
  const dailyPoints = parseOfficialPoints(dailyRaw);
  const estimate = planShowGlitterWeek(weeklyPoints, Number(daysRemaining));
  const fmt = (n: number) => n.toLocaleString("ja-JP");

  return (
    <section id="show-glitter-guide" aria-labelledby="glitter-heading" className={SECTION_ANCHOR_OFFSET + " px-4 py-10 sm:py-14"}>
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="relative overflow-hidden rounded-[2rem] border border-amber-200 bg-gradient-to-br from-amber-100 via-paper-card to-sage-soft px-5 py-8 shadow-card sm:px-9 sm:py-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-800">Mily × Weekly Glitter · 非公式応援ガイド</p>
          <h2 id="glitter-heading" className="mt-3 text-3xl font-bold leading-tight text-ink sm:text-4xl">
            金グリッター、<br className="sm:hidden" />次の週も輝かせよう。<span aria-hidden="true"> ✨</span>
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-ink sm:text-base">
            みりぃ（三橋莉子）さんの初めての金グリッターを祝って、
            「獲得」「特典の継続」「応援のしかた」を一緒に確認できるページを作りました。
          </p>
          <p className="mt-3 text-xs leading-6 text-ink-muted">
            2026年10月19日のファンからの報告をきっかけに作成。初獲得時の公式順位・獲得ptは未照合です。
          </p>
          <a href="#glitter-howto" className="mt-5 inline-flex min-h-11 items-center rounded-full bg-amber-700 px-5 py-2 text-sm font-bold text-white hover:bg-amber-800">
            今週の具体策を見る ↓
          </a>
        </div>

        <p className="rounded-2xl border border-amber-300 bg-amber-50 px-5 py-4 text-sm font-bold text-amber-950"><a href="/data-lab/glitter/" className="inline-flex min-h-11 items-center underline underline-offset-4">🥇 今の公式pt・タレント順位・あと何pt？を進捗ボードで見る →</a></p>

        <div aria-labelledby="glitter-rules" className="space-y-4">
          <h3 id="glitter-rules" className="text-2xl font-bold text-ink">まずは「2つの条件」を覚えよう</h3>
          <p className="text-sm leading-7 text-ink-muted">SHOWROOMのClassicジャンルランキングでは、<strong>ポイントとジャンル内順位の両方</strong>を満たす必要があります。</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-sage/20 bg-paper-card p-5 shadow-card">
              <p className="text-xs font-bold tracking-wider text-sage-deep">毎日 · デイリーグリッター</p>
              <p className="mt-2 text-3xl font-bold tabular-nums text-ink">4,000<span className="ml-1 text-base">pt以上</span></p>
              <p className="mt-2 text-sm font-semibold text-ink">＋ 活動ジャンルで上位20％</p>
            </div>
            <div className="rounded-3xl border border-amber-300 bg-amber-50 p-5 shadow-card">
              <p className="text-xs font-bold tracking-wider text-amber-800">毎週 · 金グリッター（ウィークリー）</p>
              <p className="mt-2 text-3xl font-bold tabular-nums text-ink">40,000<span className="ml-1 text-base">pt以上</span></p>
              <p className="mt-2 text-sm font-semibold text-ink">＋ 活動ジャンルで上位10％</p>
            </div>
          </div>
          <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-7 text-amber-950">
            <strong>大事：</strong>40,000ptに届いても金グリッター確約ではありません。ランキングの境界順位は週によって動きます。
          </p>
        </div>

        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-5 sm:p-7" aria-labelledby="glitter-keep">
          <h3 id="glitter-keep" className="text-xl font-bold text-rose-950">今の金グリッター特典を活かすには？</h3>
          <p className="mt-3 text-sm leading-7 text-rose-950">
            SHOWROOM公式の案内では、<strong>ウィークリーグリッターの特典期間中、一度でもデイリーグリッターを獲得できないとウィークリー特典の対象外</strong>になります。
            毎日の「4,000pt以上＋ジャンル上位20％」を確認するのが重要です。
          </p>
          <p className="mt-3 text-xs leading-6 text-rose-900">
            これは特典の条件です。過去に週間称号を獲得した実績が消去されるという説明ではありません。無理な長時間配信や課金を推奨するものでもありません。
          </p>
        </div>

        <div id="glitter-howto" className="space-y-4 scroll-mt-28" aria-labelledby="glitter-plan">
          <h3 id="glitter-plan" className="text-2xl font-bold text-ink">次も獲得したい！1週間の作戦</h3>
          <p className="text-sm leading-7 text-ink-muted">
            月曜〜日曜に<strong>1日6,000ptペースなら7日で42,000pt</strong>。40,000pt条件より少し余裕を持たせた、ファン制作の目安です。
            ただし毎日4,000ptと順位、週間上位10％も別にチェック！
          </p>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-7" aria-label="曜日別の提案累積ポイント。毎日6,000pt増える場合の参考値">
            {weekMilestones.map(([day, total]) => (
              <div className="rounded-2xl border border-sage/15 bg-paper-card p-3 text-center" key={day}>
                <p className="text-xs font-semibold text-sage-deep">{day}</p>
                <p className="mt-1 text-sm font-bold tabular-nums text-ink">{total}</p>
                <p className="mt-1 text-[10px] text-ink-muted">累積pt</p>
              </div>
            ))}
          </div>
          <ol className="grid gap-4 sm:grid-cols-2">
            <li className="rounded-2xl border border-sage/15 bg-paper-card p-5">
              <h4 className="font-bold text-ink">1. 配信前：予定をわかりやすく</h4>
              <p className="mt-2 text-sm leading-7 text-ink-muted">無理のない配信時刻を決めて早めに告知。初めての人が入りやすいテーマもひと言添える。</p>
            </li>
            <li className="rounded-2xl border border-sage/15 bg-paper-card p-5">
              <h4 className="font-bold text-ink">2. 配信中：また来たくなる時間に</h4>
              <p className="mt-2 text-sm leading-7 text-ink-muted">コメントとの会話・参加型企画・初見さんへの歓迎を大切に。支援は無理のない無料ギフトや各種ミッションから。</p>
            </li>
            <li className="rounded-2xl border border-sage/15 bg-paper-card p-5">
              <h4 className="font-bold text-ink">3. 毎日：デイリー条件を確認</h4>
              <p className="mt-2 text-sm leading-7 text-ink-muted">公式ランキングで4,000ptと上位20％の両方を確認。ポイントを超えても順位が足りないことがあります。</p>
            </li>
            <li className="rounded-2xl border border-sage/15 bg-paper-card p-5">
              <h4 className="font-bold text-ink">4. 週末：ウィークリーを確認</h4>
              <p className="mt-2 text-sm leading-7 text-ink-muted">累積40,000pt以上とジャンル上位10％を確認。不足があれば体調や予定を優先したうえで追加枠を検討。</p>
            </li>
          </ol>
        </div>

        <div className="rounded-3xl border border-sage/25 bg-sage-soft/35 p-5 sm:p-7" aria-labelledby="glitter-calc">
          <h3 id="glitter-calc" className="text-xl font-bold text-ink">公式ポイントで、残りの目安を計算</h3>
          <p className="mt-2 text-sm leading-7 text-ink-muted">
            SHOWROOMの<strong>Classicジャンルランキングに表示されたpt</strong>を手入力する参考計算です。きら星・コメント・訪問の表示値やイベントポイントを入れないでね。
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <label className="block text-xs font-bold text-ink">今週の公式ランキングpt
              <input className={fieldClass} type="number" min="0" step="1" inputMode="numeric" value={weeklyRaw} onChange={(e) => setWeeklyRaw(e.target.value)} placeholder="例：15000" />
            </label>
            <label className="block text-xs font-bold text-ink">今日の公式ランキングpt
              <input className={fieldClass} type="number" min="0" step="1" inputMode="numeric" value={dailyRaw} onChange={(e) => setDailyRaw(e.target.value)} placeholder="例：3500" />
            </label>
            <label className="block text-xs font-bold text-ink">今週の残り日数（今日を含む）
              <select className={fieldClass} value={daysRemaining} onChange={(e) => setDaysRemaining(e.target.value)}>
                {[1,2,3,4,5,6,7].map((n) => <option key={n} value={String(n)}>{n}日</option>)}
              </select>
            </label>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2" role="status" aria-live="polite" aria-atomic="true">
            <div className="rounded-2xl bg-white p-4">
              <p className="text-xs font-semibold text-sage-deep">週間40,000ptまで</p>
              <p className="mt-2 text-2xl font-bold tabular-nums text-ink">{estimate ? fmt(estimate.remainingToMinimum) + "pt" : "未入力"}</p>
              <p className="mt-2 text-xs leading-6 text-ink-muted">{estimate ? "残り" + daysRemaining + "日で1日平均" + fmt(estimate.dailyAverageToMinimum) + "pt。42,000ptを目指す場合は平均" + fmt(estimate.dailyAverageToSuggested) + "pt。" : "公式週間ptを入力すると表示します。"}</p>
            </div>
            <div className="rounded-2xl bg-white p-4">
              <p className="text-xs font-semibold text-sage-deep">今日の4,000ptまで</p>
              <p className="mt-2 text-2xl font-bold tabular-nums text-ink">{dailyPoints === null ? "未入力" : fmt(Math.max(0, SHOW_GLITTER.dailyMin - dailyPoints)) + "pt"}</p>
              <p className="mt-2 text-xs leading-6 text-ink-muted">ポイントを満たしても、ジャンル上位20％の確認が必要です。</p>
            </div>
          </div>
          {estimate ? <div className="mt-4 h-2 overflow-hidden rounded-full bg-white" role="progressbar" aria-label="週間の最低ポイントへの進捗" aria-valuenow={Math.round(estimate.percentOfMinimum)} aria-valuemin={0} aria-valuemax={100}><div className="h-full rounded-full bg-amber-500 transition-all" style={{ width: String(estimate.percentOfMinimum) + "%" }} /></div> : null}
          <p className="mt-3 text-xs leading-6 text-ink-muted">この試算は端末内だけで計算します。入力は保存・送信しません。<strong>順位や獲得を判定するものではありません。</strong></p>
        </div>

        <div className="space-y-3 rounded-3xl border border-sage/20 bg-paper-card p-5 sm:p-7" aria-labelledby="glitter-benefit">
          <h3 id="glitter-benefit" className="text-xl font-bold text-ink">金グリッターのうれしい特典</h3>
          <p className="text-sm leading-7 text-ink-muted">
            2025年6月9日から、ウィークリーグリッター獲得者には対象の<strong>有料ギフトptの50％がボーナス加算</strong>されるルールです。
            「レインボースター」「大レインボースター」「レインボースター流星群」は対象外。ボーナスは<strong>ジャンル月間・年間ランキングのみ</strong>で、参加中イベントのpt・順位には反映されません。
          </p>
          <p className="text-xs leading-6 text-ink-muted">ギフト購入をお願いする趣旨ではありません。無理なく楽しめる応援を大切にしましょう。</p>
        </div>

        <div className="rounded-3xl bg-paper-card p-5 ring-1 ring-sage/15 sm:p-7" aria-labelledby="glitter-sources">
          <h3 id="glitter-sources" className="text-lg font-bold text-ink">公式ルールと確認先</h3>
          <ul className="mt-3 space-y-3">
            {sources.map(({name, href}) => <li key={href}><a className="inline-flex min-h-11 items-center text-sm font-semibold text-sage-deep underline underline-offset-4 hover:text-sage" href={href} target="_blank" rel="noopener noreferrer">{name} ↗</a></li>)}
          </ul>
          <p className="mt-3 text-xs leading-6 text-ink-muted">2026年10月19日時点で確認できたSHOWROOM公開案内をもとに作成。公式画面の最新表示や変更告知を優先してください。非公式ファン制作／本人運営・SHOWROOM公式の案内ではありません。</p>
        </div>
        <p className="text-center text-sm text-ink-muted">金グリッターは結果。これからも、みりぃらしい配信をみんなで楽しめますように。🍅✨</p>
      </div>
    </section>
  );
}
