import type { StreamRecapSocialClip } from "../data/streamRecaps";

const labels = { youtube: "YouTube", tiktok: "TikTok", instagram: "リール", x: "X" };

export function StreamSocialClipLinks({ clip, id }: { clip: StreamRecapSocialClip; id: string }) {
  return (
    <div id={id} className="mt-4 rounded-2xl border border-sage/20 bg-paper-card p-4">
      <p className="text-xs font-semibold tracking-wide text-sage-deep">自己紹介・トーク</p>
      <p className="mt-2 text-base font-bold leading-relaxed text-ink">{clip.title}</p>
      <p className="mt-1 text-xs leading-5 text-ink-muted">
        録画内 {clip.sourceTimestamp}頃から・約{Math.round(clip.durationSeconds)}秒
      </p>
      <p className="mt-2 text-xs leading-6 text-ink-muted">
        みりぃ本人の声と表情を、応援アカウントの投稿で。各SNSを新しいタブで開きます。
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {clip.links.map((link) => (
          <a
            key={link.platform}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${clip.title}を${labels[link.platform]}で見る（新しいタブ）`}
            className="inline-flex min-h-11 items-center rounded-full bg-sage px-4 py-2 text-sm font-bold text-white hover:bg-sage-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sage"
          >
            {labels[link.platform]}で見る ↗
          </a>
        ))}
      </div>
    </div>
  );
}
