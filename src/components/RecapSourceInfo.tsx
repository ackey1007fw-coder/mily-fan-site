import { recapSourceDisclosure } from '../lib/recapSourceDisclosure';

export function RecapSourceInfo({ sourceLabel, transcriptionNote, verifiedAt, medium, imageTimes = false }: {
  sourceLabel: string;
  transcriptionNote: string;
  verifiedAt: string;
  medium?: string;
  imageTimes?: boolean;
}) {
  const disclosure = recapSourceDisclosure(sourceLabel, transcriptionNote);
  return (
    <div className="mt-4 rounded-2xl border border-sage/15 bg-paper px-4 py-3" data-recap-source>
      <p className="text-xs leading-5 text-ink-muted">出典：{disclosure.source}{medium && !disclosure.source.includes(medium) ? `（${medium}）` : ''}。</p>
      <p className="text-xs leading-5 text-ink-muted">{disclosure.material}{imageTimes ? '画像の時刻は録画内の目安です。' : ''}</p>
      <details className="mt-2" data-recap-verification>
        <summary className="min-h-11 cursor-pointer py-3 text-xs font-semibold text-sage-deep focus:outline-none focus-visible:ring-2 focus-visible:ring-sage">出典・確認状況</summary>
        <div className="space-y-1 text-xs leading-5 text-ink-muted">
          {disclosure.verification.filter(text => !imageTimes || text !== '画像の時刻は録画内の目安です。').map(text => <p key={text}>{text}</p>)}
          <p>記録の確認日：{verifiedAt.replace(/-/g, '.')}</p>
        </div>
      </details>
    </div>
  );
}
