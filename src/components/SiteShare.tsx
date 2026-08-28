import { useEffect, useState } from "react";
import { Copy, Share2 } from "lucide-react";
import {
  canUseWebShare,
  copyUrlToClipboard,
  facebookShareUrl,
  lineShareUrl,
  shareWithWebShare,
  siteSharePayload,
  threadsShareUrl,
  xShareUrl,
} from "../lib/siteShare";
import { ExternalLink } from "./ExternalLink";

const SHARE = siteSharePayload();
const X_SHARE_HREF = xShareUrl(SHARE);
const LINE_SHARE_HREF = lineShareUrl(SHARE);
const FACEBOOK_SHARE_HREF = facebookShareUrl(SHARE);
const THREADS_SHARE_HREF = threadsShareUrl(SHARE);

const X_ICON_PATH =
  "M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z";
const LINE_ICON_PATH =
  "M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314";
const FACEBOOK_ICON_PATH =
  "M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z";
const THREADS_ICON_PATH =
  "M18.263 11.097c-.03-3.486-1.92-5.586-5.111-5.586-2.13 0-3.922.963-4.863 2.499l2.062 1.438c.535-.843 1.272-1.543 2.628-1.543 1.528 0 2.318.85 2.544 2.431a15 15 0 0 0-2.236-.173c-4.125 0-6.068 1.867-6.068 4.336s1.943 3.99 4.804 3.99c3.139 0 5.013-2.115 5.781-4.735.798.361 1.348 1.204 1.348 2.47 0 3.387-3.907 5.232-7.22 5.232-4.885 0-8.077-3.207-8.077-8.424 0-6.392 4.223-10.487 9.9-10.487 3.808 0 5.69 1.671 6.97 3.914l2.108-1.475C21.44 2.078 18.331 0 13.663 0 6.227 0 1.168 5.277 1.168 12.934c0 7 4.953 11.066 10.856 11.066 4.878 0 9.809-2.846 9.809-7.716 0-2.545-1.46-4.231-3.569-5.187m-6.33 4.855c-1.077 0-2.026-.512-2.026-1.453 0-1.483 1.822-1.934 3.606-1.934.678 0 1.34.045 1.927.173-.422 1.927-1.671 3.215-3.508 3.214Z";

const actionClassName =
  "inline-flex min-h-11 min-w-11 max-w-full shrink-0 items-center justify-center gap-1.5 rounded-full border border-sage/30 bg-paper-card px-4 py-2 text-sm font-semibold text-sage-deep hover:bg-sage-soft";
const socialActionClassName =
  "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-sage/30 bg-paper-card text-sage-deep hover:bg-sage-soft";

const COPY_SUCCESS = "URLをコピーしました";
const COPY_FAILURE = "コピーできませんでした";

type BrandIconProps = {
  path: string;
};

function BrandIcon({ path }: BrandIconProps) {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5 shrink-0"
      focusable="false"
      viewBox="0 0 24 24"
    >
      <path d={path} fill="currentColor" />
    </svg>
  );
}

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
          <ExternalLink href={X_SHARE_HREF} className={socialActionClassName}>
            <BrandIcon path={X_ICON_PATH} />
            <span className="sr-only">Xでこのサイトをシェア</span>
          </ExternalLink>
        </li>
        <li>
          <ExternalLink href={LINE_SHARE_HREF} className={socialActionClassName}>
            <BrandIcon path={LINE_ICON_PATH} />
            <span className="sr-only">LINEでこのサイトをシェア</span>
          </ExternalLink>
        </li>
        <li>
          <ExternalLink href={FACEBOOK_SHARE_HREF} className={socialActionClassName}>
            <BrandIcon path={FACEBOOK_ICON_PATH} />
            <span className="sr-only">Facebookでこのサイトをシェア</span>
          </ExternalLink>
        </li>
        <li>
          <ExternalLink href={THREADS_SHARE_HREF} className={socialActionClassName}>
            <BrandIcon path={THREADS_ICON_PATH} />
            <span className="sr-only">Threadsでこのサイトをシェア</span>
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
      {canNativeShare ? (
        <p className="mt-2 max-w-full text-xs leading-relaxed text-ink-muted">
          InstagramストーリーズやDMで共有したい場合は、対応端末の「共有する」から選べる場合があります。表示される共有先は端末・OS・インストール済みアプリによって異なります。
        </p>
      ) : null}
      <p
        id="site-share-status"
        role="status"
        aria-live="polite"
        className="mt-2 min-h-5 text-xs text-sage-deep"
      >
        {status}
      </p>
    </section>
  );
}
