import { patonExTwoDayTwo as guide } from "../data/patonExTwoDayTwo";
import { ExternalLink } from "./ExternalLink";

/** 日付付きの公式確認案内。未確認のTZから受付状態を推定しない。 */
export function PatonExTwoGuide() {
  return (
    <section id="paton-ex2-day2-guide" aria-labelledby="paton-ex2-day2-heading" className="scroll-mt-24 px-4 py-6">
      <div className="mx-auto max-w-3xl rounded-3xl border border-apricot/50 bg-paper-card p-5 shadow-card sm:p-6">
        <p className="text-xs font-semibold text-sage-deep">{guide.title}</p>
        <h2 id="paton-ex2-day2-heading" className="mt-2 text-2xl font-bold text-ink">10月5日のPaton・無料拍手の案内</h2>
        <p className="mt-3 text-sm leading-7 text-ink-muted">公式掲載期間：{guide.periodLabel}</p>
        <p className="mt-2 text-sm leading-7 text-ink">無料の「{guide.freeGift.name}」は{guide.freeGift.coins}コイン。ログインが必要です。</p>
        <ExternalLink href={guide.entrantUrl} className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full bg-sage px-5 py-3 text-center text-sm font-semibold text-white hover:bg-sage-deep">三橋莉子の公式ページで受付状況を確認</ExternalLink>
        <p className="mt-3 text-xs leading-6 text-ink-muted">「{guide.paidGift.name}」は{guide.paidGift.coins}コインの有料ギフトです。無料拍手とは別です。</p>
        <p className="mt-2 text-xs leading-6 text-ink-muted">10月5日分の案内です。タイムゾーンと無料拍手の日付切替時刻は未確認のため、受付中・受付終了をこのサイトでは判定していません。受付状況は公式画面をご確認ください。</p>
        <details className="mt-4 rounded-2xl bg-sage-soft/35 p-4">
          <summary className="min-h-11 cursor-pointer font-semibold text-sage-deep">無料拍手の確認手順・注意点</summary>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm leading-7 text-ink-muted">
            <li>公式ページで本人名と、この回の受付状況を確認します。</li>
            <li>受付中ならログインし、「ギフト」の「{guide.freeGift.name}」（{guide.freeGift.coins}コイン）を確認します。</li>
            <li>応援する際は本人名・アイテム・0コイン表示を送信前に確認してください。</li>
          </ol>
          <p className="mt-3 text-sm leading-7 text-ink-muted">この本人リンクは10月5日分専用です。10月9日分や別の回に流用しないでください。MISS CIRCLEのWEB投票・SHOWROOMとは別の応援方法です。</p>
        </details>
        <p className="mt-4 text-xs leading-6 text-ink-muted">確認日：2026年10月5日 · <ExternalLink href={guide.eventUrl} className="font-semibold text-sage-deep underline">Paton公式イベント案内</ExternalLink> · ファン制作の非公式案内</p>
      </div>
    </section>
  );
}
