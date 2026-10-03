import { RECAP_CLIP_WITHHOLD_NOTE, RECAP_FIGURES_NOTE, RECAP_WITHHOLD_NOTE } from '../data/streamRecapRules.ts';

const productionSentences = new Set(
  [RECAP_WITHHOLD_NOTE, RECAP_CLIP_WITHHOLD_NOTE, RECAP_FIGURES_NOTE]
    .flatMap(text => text.split('。').filter(Boolean)),
);

/** Original notes remain in the per-episode data and verification ledger. */
export function recapSourceDisclosure(sourceLabel: string, note: string) {
  const sentences = note.split('。').map(text => text.trim()).filter(Boolean);
  const first = sentences[0] ?? '';
  const material = first.includes('配信レポートと文字起こし抜粋')
    ? '提供レポートと文字起こし抜粋をもとにした要約です。'
    : first.includes('動画の音声')
      ? '提供動画をもとにした記録です。'
      : /自動字幕/.test(first)
        ? '保存された自動字幕をもとにした要約です。'
        : /自動文字起こし/.test(first)
          ? '自動文字起こしをもとにした要約です。'
          : first ? `${first}。` : '';
  const sourceScope = /全文|全体|分割/.test(first) ? [first.replace(/[\d,]+行/g, '').replace(/\s+/g, ' ')] : [];
  const verification = [...new Set([...sourceScope, ...sentences.slice(1)].filter(sentence => {
    if (productionSentences.has(sentence)) return false;
    if (/^静止画は/.test(sentence) && !/既存|表示写真|同じ画像|ではありません|未承認|未確認/.test(sentence)) return false;
    if (/^(顔[・の]|コメント・視聴者|表示用にLanczos|リスナーの個人名|録音音声と全文文字起こし)/.test(sentence)) return false;
    if (/^録画開始記録/.test(sentence)) return false;
    return true;
  }))].map(sentence => `${sentence}。`);
  return { source: sourceLabel.replace(/（[^）]*）/g, '').trim(), material, verification };
}

/** Keep mixed-image provenance at the gallery, but move processing details to the ledger. */
export function recapGalleryNote(note: string | undefined, count: number) {
  if (!note) return `この回の写真${count}枚です。各写真を保存できます。`;
  const description = note.split('。').filter(sentence => sentence && !/切り出|背景|顔.*生成|補正|EXIF|コメント.*(?:外|除)|^(?:画像の)?時刻は/.test(sentence)).join('。');
  return description ? `${description}。` : `この回の写真${count}枚です。各写真を保存できます。`;
}
