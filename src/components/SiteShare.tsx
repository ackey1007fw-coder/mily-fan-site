import { useEffect, useState } from "react";
import { Copy, Share2 } from "lucide-react";
import {
  canUseWebShare,
  copyUrlToClipboard,
  facebookShareUrl,
  lineShareUrl,
  shareWithWebShare,
  siteSharePayload,
  xShareUrl,
} from "../lib/siteShare";
import { ExternalLink } from "./ExternalLink";

const SHARE = siteSharePayload();
const X_SHARE_HREF = xShareUrl(SHARE);
const LINE_SHARE_HREF = lineShareUrl(SHARE);
const FACEBOOK_SHARE_HREF = facebookShareUrl(SHARE);

const actionClassName =
  "inline-flex min-h-11 max-w-full items-center justify-center gap-1.5 rounded-full border border-sage/30 bg-paper-card px-4 py-2 text-sm font-semibold text-sage-deep hover:bg-sage-soft";

const COPY_SUCCESS = "URLをコピーしました";
const COPY_FAILURE = "コピーできませんでした";

export function SiteShare() {
  const [canNativeShare, setCanNativeShare] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    setCanNativeShare(canUseWebShare(SHARE));
  }, []);

  useEffect(() => {
    if (!status) {
      return;
    }

    const timer = window.setTimeout(() => setStatus(""), 4000);
    return () => window.clearTimeout(timer);
  }, [status]);

  const copyCanonicalUrl = async () => {
    try {
      const ok = await copyUrlToClipboard(SHARE.url);
      setStatus(ok ? COPY_SUCCESS : COPY_FAILURE);
    } catch {
      setStatus(COPY_FAILURE);
    }
  };

  const openShareMenu = async () => {
    const result = await shareWithWebShare(SHARE);
    if (result === "unsupported") {
      await copyCanonicalUrl();
    }
  };

  return (
    <section className="mb-8 max-w-full" aria-labelledby="site-share-heading">
      <h2 id="site-share-heading" className="text-sm font-semibold text-ink">
        このサイトをシェア
      </h2>
      <ul className="mt-3 flex flex-wrap gap-2">
        <li>
          <ExternalLink href={X_SHARE_HREF} className={actionClassName}>
            <span aria-hidden="true">X</span>
            <span className="sr-only">Xでこのサイトをシェア</span>
          </ExternalLink>
        </li>
        <li>
          <ExternalLink href={LINE_SHARE_HREF} className={actionClassName}>
            <span aria-hidden="true">LINE</span>
            <span className="sr-only">LINEでこのサイトをシェア</span>
          </ExternalLink>
        </li>
        <li>
          <ExternalLink href={FACEBOOK_SHARE_HREF} className={actionClassName}>
            <span aria-hidden="true">Facebook</span>
            <span className="sr-only">Facebookでこのサイトをシェア</span>
          </ExternalLink>
        </li>
      </ul>
      <div className="mt-2 flex flex-wrap gap-2">
        {canNativeShare ? (
          <button
            type="button"
            className={actionClassName}
            aria-label="共有メニューを開く"
            onClick={openShareMenu}
          >
            <Share2 aria-hidden="true" className="h-4 w-4 shrink-0" />
            共有する
          </button>
        ) : null}
        <button
          type="button"
          className={actionClassName}
          aria-label="このサイトのURLをコピー"
          onClick={copyCanonicalUrl}
        >
          <Copy aria-hidden="true" className="h-4 w-4 shrink-0" />
          URLをコピー
        </button>
      </div>
      <p
        role="status"
        aria-live="polite"
        className="mt-2 min-h-5 text-xs text-sage-deep"
      >
        {status}
      </p>
    </section>
  );
}
