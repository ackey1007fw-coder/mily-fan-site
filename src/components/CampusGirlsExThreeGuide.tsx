import { useTokyoNow } from "../lib/useTokyoNow";
import { ExternalLink } from "./ExternalLink";

const mixchEventUrl = "https://mixch.tv/live/event/24861";
const patonEventUrl = "https://paton.jp/event/detail/596";
const patonMilyUrl = "https://paton.jp/event/entrant/13990";
const organizerUrl = "https://www.campusboys.jp/campusgirls2027";

const voteDayStart = Date.parse("2026-10-27T00:00:00+09:00");
const voteDayEnd = Date.parse("2026-10-27T23:59:59.999+09:00");

/** 主催者資料の審査スケジュールを整理したファンサイト向け告知。
 * 配信終了(11/1)とPaton第3回(11/2)を混同しない。
 */
export function CampusGirlsExThreeGuide() {
  const now = useTokyoNow();
  const isPatonSecondVoteDay = now >= voteDayStart && now <= voteDayEnd;

  return (
    <section
      id="campus-girls-ex3-guide"
      aria-labelledby="campus-girls-ex3-guide-heading"
      className="scroll-mt-24 px-4 py-7"
    >
      <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-rose-200 bg-paper-card shadow-card">
        <div className="bg-gradient-to-r from-purple-100 via-pink-100 to-sky-100 px-5 py-6 sm:px-8">
          <p className="text-xs font-semibold tracking-[0.14em] text-purple-800">
            CAMPUS GIRLS 2027 · みりぃ応援情報
          </p>
          <h2 id="campus-girls-ex3-guide-heading" className="mt-2 text-2xl font-bold leading-relaxed text-ink sm:text-3xl">
            本選EX vol.3 審査・投票ガイド 💐
          </h2>
          <p className="mt-2 text-sm leading-7 text-ink-muted">
            配信・SNS・Patonはそれぞれ締切が違うので、日程をまとめたよ。
          </p>
        </div>
        <div className="grid min-w-0 gap-5 p-4 sm:grid-cols-[minmax(0,13rem)_minmax(0,1fr)] sm:p-6">
          <a
            href="/media/news/mily-b239-01-campus-girls-ex3-guide.svg"
            className="block min-w-0 self-start overflow-hidden rounded-2xl border border-purple-100 bg-purple-50 hover:ring-2 hover:ring-purple-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage"
            aria-label="審査日程の非公式要約画像を大きく表示"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/media/news/mily-b239-01-campus-girls-ex3-guide.svg"
              alt="CAMPUS GIRLS 2027 本選EX vol.3の配信審査、XのSNS審査、Paton投票日をまとめた案内図"
              className="block h-auto w-full object-contain"
              width={916}
              height={1320}
              loading="lazy"
              decoding="async"
            />
          </a>
          <div className="min-w-0">
            <ol className="space-y-3 text-sm leading-7">
              <li>
                <strong className="block text-base text-ink">① ミクチャ 配信・ムービー審査</strong>
                <span className="text-ink-muted">10/19(月) 12:00 〜 11/1(日) 23:59</span>
              </li>
              <li>
                <strong className="block text-base text-ink">② XでのSNS審査</strong>
                <span className="text-ink-muted">10/19(月) 12:00 〜 10/30(金) 12:00</span>
                <span className="block text-xs text-ink-muted">テーマ「応援してくれるファンに向けて」</span>
                <span className="block break-words text-xs text-ink-muted">#CAMPUSGIRLS2027 #キャンガル</span>
              </li>
              <li>
                <strong className="block text-base text-ink">③ Paton投票審査</strong>
                <span className="block text-ink-muted">第1回 10/21(水) 0:00〜23:59</span>
                <span className="block font-semibold text-rose-700">第2回 10/27(火) 0:00〜23:59</span>
                <span className="block text-ink-muted">第3回 11/2(月) 0:00〜23:59</span>
              </li>
            </ol>
            <p className="mt-4 rounded-xl bg-amber-50 px-3 py-2 text-xs leading-6 text-amber-900">
              第3回Paton投票は11/2。ミクチャ審査の11/1終了とは別の日です。
            </p>
            <div className="mt-4 flex flex-col gap-2">
              {isPatonSecondVoteDay ? (
                <ExternalLink
                  href={patonMilyUrl}
                  className="inline-flex min-h-11 items-center justify-center rounded-full bg-rose-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-rose-700"
                >
                  本日10/27 · Patonでみりぃを応援する
                </ExternalLink>
              ) : (
                <ExternalLink
                  href={patonEventUrl}
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-rose-300 bg-white px-4 py-3 text-center text-sm font-semibold text-rose-800 hover:bg-rose-50"
                >
                  Paton第2回の開催情報を見る（10/27分）
                </ExternalLink>
              )}
              <ExternalLink
                href={mixchEventUrl}
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-sage/25 bg-paper px-4 py-3 text-center text-sm font-semibold text-sage-deep hover:bg-sage-soft"
              >
                ミクチャのイベント情報
              </ExternalLink>
            </div>
            <p className="mt-3 text-xs leading-6 text-ink-muted">
              Patonのアイテム・投票方法・受付状況は公式画面を確認してね。
              順位やptは変動するため固定表示していません。
            </p>
          </div>
        </div>
        <p className="border-t border-purple-100 px-5 py-4 text-xs leading-6 text-ink-muted sm:px-8">
          主催者の審査案内をもとに制作した非公式の要約図です。元の案内画像・動画の転載ではありません。
          内容確認日：2026年10月27日。
          {" "}
          <ExternalLink href={organizerUrl} className="font-semibold text-sage-deep underline">
            大会情報
          </ExternalLink>
        </p>
      </div>
    </section>
  );
}
