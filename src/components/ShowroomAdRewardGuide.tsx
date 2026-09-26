import { showroomAdReward as guide } from "../data/showroomAdReward";
import { socials } from "../data/socials";
import { SECTION_ANCHOR_OFFSET } from "../lib/navigation";
import { ExternalLink } from "./ExternalLink";

const primary = "inline-flex min-h-11 max-w-full items-center justify-center rounded-full bg-sage px-5 py-3 text-center text-sm font-semibold text-white hover:bg-sage-deep";
const secondary = "inline-flex min-h-11 max-w-full items-center justify-center rounded-full border border-sage/30 bg-paper px-5 py-3 text-center text-sm font-semibold text-sage-deep hover:bg-sage-soft";

export function ShowroomAdRewardTeaser() {
  return (
    <div className="mt-6 rounded-2xl border border-apricot/40 bg-apricot-soft/30 p-4 sm:p-5" data-ad-reward-teaser>
      <h3 className="text-base font-bold text-ink"><span className="inline-block">広告で、</span><span className="inline-block">無料の応援をプラス。</span></h3>
      <p className="mt-2 text-sm leading-7 text-ink-muted">
        広告視聴の抽選で、ギフトなどを獲得するチャンス。集めたら、みりぃの配信で贈って応援しよう。
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <ExternalLink href={guide.url} className={primary}>広告を見て応援アイテムを集める</ExternalLink>
        <a href={guide.guidePath} className={secondary}>はじめての方へ・やり方を見る</a>
      </div>
      <p className="mt-3 text-xs leading-6 text-ink-muted">SHOWROOM公式へ移動します。できるときだけ、あなたのペースで。</p>
    </div>
  );
}

export function ShowroomAdRewardGuide() {
  const room = socials.find((social) => social.platform === "showroom" && social.confirmed);
  return (
    <section id="showroom-ad-reward" aria-labelledby="ad-reward-title" className={`${SECTION_ANCHOR_OFFSET} px-4 py-8 sm:py-10`}>
      <div className="mx-auto max-w-3xl rounded-3xl border border-sage/20 bg-paper-card p-5 shadow-card sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage-deep">Free support / SHOWROOM</p>
        <h2 id="ad-reward-title" className="mt-3 text-2xl font-bold leading-relaxed text-ink sm:text-3xl"><span className="inline-block">広告で、</span><span className="inline-block">無料の応援をプラス。</span></h2>
        <p className="mt-4 text-sm leading-7 text-ink-muted">
          「課金は難しいけれど、みりぃを応援したい」。そんなときの選択肢が、SHOWROOMの広告視聴ボーナス抽選です。
          広告を見ることで、ギフトやShow Goldなどが当たる抽選に参加できます。
        </p>
        <p className="mt-4 rounded-2xl bg-sage-soft/45 p-4 text-sm leading-7 text-sage-deep">
          <strong>集める → 配信で贈る、で応援に。</strong><br />
          広告を見るだけでは、みりぃへ自動でギフトは贈られません。獲得したアイテムを配信で使うところまでが流れです。
        </p>
        <ol className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3" aria-label="広告視聴から応援までの3ステップ">
          {guide.steps.map((step, index) => (
            <li key={step.title} className="min-w-0 rounded-2xl border border-sage/15 bg-paper p-4">
              <span className="text-xs font-bold tracking-widest text-sage-deep">STEP {index + 1}</span>
              <h3 className="mt-2 text-base font-bold leading-7 text-ink">{step.title}</h3>
              <p className="mt-2 text-sm leading-7 text-ink-muted">{step.body}</p>
            </li>
          ))}
        </ol>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <ExternalLink href={guide.url} className={primary}>広告を見て応援アイテムを集める</ExternalLink>
          {room ? <ExternalLink href={room.url} className={secondary}>みりぃの配信ルームへ</ExternalLink> : null}
        </div>
        <p className="mt-3 text-xs leading-6 text-ink-muted">ボタンはSHOWROOM公式を新しいタブで開きます。このサイトで広告の再生・抽選・ギフト送信は行いません。</p>
        <div className="mt-6 divide-y divide-sage/15 border-y border-sage/15">
          {guide.faqs.map((faq) => (
            <details key={faq.question} className="py-1">
              <summary className="cursor-pointer px-1 py-3 text-sm font-semibold leading-7 text-sage-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage">{faq.question}</summary>
              <p className="px-1 pb-4 text-sm leading-7 text-ink-muted">{faq.answer}</p>
            </details>
          ))}
        </div>
        <p className="mt-5 text-xs leading-6 text-ink-muted">
          景品・数量は抽選のため一定ではありません。アイテムの期限やイベントへの反映条件は、公式画面で確認してください。
          無理な課金や長時間の視聴は必要ありません。
        </p>
        <p className="mt-3 text-xs leading-6 text-ink-muted">
          出典：<ExternalLink href={guide.sourceUrl} className="font-semibold text-sage-deep underline underline-offset-2">{guide.sourceLabel}</ExternalLink>
          <span className="ml-2">確認日：<time dateTime={guide.verifiedAt}>{guide.verifiedAt}</time>（日本時間）</span>
        </p>
      </div>
    </section>
  );
}
