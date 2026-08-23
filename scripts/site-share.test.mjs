import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { canonicalUrl, site } from "../src/data/site.ts";
import {
  canUseWebShare,
  copyUrlToClipboard,
  facebookShareUrl,
  lineShareUrl,
  shareWithWebShare,
  siteSharePayload,
  xShareUrl,
} from "../src/lib/siteShare.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function read(relative) {
  return readFile(path.join(root, relative), "utf8");
}

const UNTOUCHED_HOME_FILES = [
  "src/App.tsx",
  "src/components/Header.tsx",
  "src/components/Hero.tsx",
  "src/components/TodayDashboard.tsx",
  "src/components/Support.tsx",
  "src/components/Latest.tsx",
  "src/components/MobileActionDock.tsx",
  "src/lib/navigation.ts",
];

describe("site share payload", () => {
  it("uses the site.ts canonical URL and public site copy", () => {
    const payload = siteSharePayload();

    assert.equal(payload.url, canonicalUrl());
    assert.equal(payload.url, "https://mily-fan-site.vercel.app/");
    assert.equal(payload.title, site.displayTitle);
    assert.equal(payload.text, site.description);
    assert.match(payload.text, /みりぃ（三橋莉子 \/ Mily）/);
    assert.match(payload.text, /ファン制作の非公式サイトです/);
    assert.match(payload.text, /公式・公認・本人運営ではありません/);
  });

  it("does not hardcode the public origin in the share helpers or UI", async () => {
    const lib = await read("src/lib/siteShare.ts");
    const ui = await read("src/components/SiteShare.tsx");

    assert.match(lib, /canonicalUrl\(\)/);
    assert.match(lib, /site\.displayTitle/);
    assert.match(lib, /site\.description/);
    assert.doesNotMatch(lib, /https:\/\/mily-fan-site\.vercel\.app/);
    assert.doesNotMatch(ui, /https:\/\/mily-fan-site\.vercel\.app/);
    assert.match(ui, /siteSharePayload\(\)/);
    assert.match(ui, /xShareUrl\(/);
    assert.match(ui, /lineShareUrl\(/);
    assert.match(ui, /facebookShareUrl\(/);
  });
});

describe("SNS share URLs", () => {
  it("encodes the X Web Intent text and canonical URL", () => {
    const payload = siteSharePayload();
    const href = xShareUrl(payload);
    const parsed = new URL(href);

    assert.equal(parsed.protocol, "https:");
    assert.ok(parsed.hostname === "twitter.com" || parsed.hostname === "x.com");
    assert.match(parsed.pathname, /\/intent\/(?:tweet|post)/);
    assert.equal(parsed.searchParams.get("text"), payload.text);
    assert.equal(parsed.searchParams.get("url"), payload.url);
    assert.ok(href.includes(encodeURIComponent(payload.text)));
    assert.ok(href.includes(encodeURIComponent(payload.url)));
    assert.doesNotMatch(href, /https:\/\/mily-fan-site\.vercel\.app\//);
  });

  it("encodes the LINE share URL", () => {
    const payload = siteSharePayload();
    const href = lineShareUrl(payload);
    const parsed = new URL(href);

    assert.equal(parsed.protocol, "https:");
    assert.equal(parsed.hostname, "social-plugins.line.me");
    assert.equal(parsed.searchParams.get("url"), payload.url);
    assert.ok(href.includes(encodeURIComponent(payload.url)));
    assert.doesNotMatch(href, /https:\/\/mily-fan-site\.vercel\.app\//);
  });

  it("encodes the Facebook sharer URL", () => {
    const payload = siteSharePayload();
    const href = facebookShareUrl(payload);
    const parsed = new URL(href);

    assert.equal(parsed.protocol, "https:");
    assert.equal(parsed.hostname, "www.facebook.com");
    assert.match(parsed.pathname, /sharer/);
    assert.equal(parsed.searchParams.get("u"), payload.url);
    assert.ok(href.includes(encodeURIComponent(payload.url)));
    assert.doesNotMatch(href, /https:\/\/mily-fan-site\.vercel\.app\//);
  });

  it("does not invent an Instagram web share endpoint", async () => {
    const lib = await read("src/lib/siteShare.ts");
    const ui = await read("src/components/SiteShare.tsx");

    assert.doesNotMatch(lib, /instagram\.com\/(?:share|sharer)/i);
    assert.doesNotMatch(ui, /instagram\.com\/(?:share|sharer)/i);
    assert.doesNotMatch(lib, /instagram:\/\//i);
    assert.doesNotMatch(ui, /instagram:\/\//i);
    assert.doesNotMatch(ui, /href=\{[^}]*instagram/i);
  });
});

describe("Instagram Stories / DM hint", () => {
  it("explains Stories and DM as an OS share-sheet option", async () => {
    const ui = await read("src/components/SiteShare.tsx");

    assert.match(
      ui,
      /InstagramストーリーズやDMで共有したい場合は、対応端末の「共有する」から選べます/,
    );
    assert.match(
      ui,
      /表示される共有先は端末・OS・インストール済みアプリによって異なります/,
    );
    assert.doesNotMatch(ui, /必ずInstagram/);
    assert.doesNotMatch(ui, /直接共有できます/);
  });

  it("shows the hint only with the native share button", async () => {
    const ui = await read("src/components/SiteShare.tsx");
    const nativeBlocks = [
      ...ui.matchAll(/\{canNativeShare \? \(([\s\S]*?)\) : null\}/g),
    ].map((match) => match[1]);

    assert.ok(nativeBlocks.length >= 2, "native share and its hint must share canNativeShare");
    assert.ok(
      nativeBlocks.some((block) => block.includes("共有メニューを開く")),
      "the share button stays behind canNativeShare",
    );
    assert.ok(
      nativeBlocks.some((block) => block.includes("InstagramストーリーズやDM")),
      "the hint must render only when Web Share is available",
    );

    const withoutNativeShare = ui.replace(
      /\{canNativeShare \? \([\s\S]*?\) : null\}/g,
      "",
    );
    assert.doesNotMatch(withoutNativeShare, /InstagramストーリーズやDM/);
    assert.match(withoutNativeShare, /このサイトのURLをコピー/);
  });
});

describe("Web Share API", () => {
  it("is invoked only when shareWithWebShare is called", async () => {
    let calls = 0;
    const shareApi = {
      share: async () => {
        calls += 1;
      },
    };

    assert.equal(calls, 0);
    assert.equal(canUseWebShare(siteSharePayload(), shareApi), true);
    assert.equal(calls, 0);

    const result = await shareWithWebShare(siteSharePayload(), shareApi);
    assert.equal(result, "shared");
    assert.equal(calls, 1);
  });

  it("stays safe when Web Share API is missing", async () => {
    const payload = siteSharePayload();

    assert.equal(canUseWebShare(payload, undefined), false);
    assert.equal(canUseWebShare(payload, {}), false);
    assert.equal(await shareWithWebShare(payload, undefined), "unsupported");
    assert.equal(await shareWithWebShare(payload, {}), "unsupported");
  });

  it("treats user cancellation as cancelled, not a thrown failure", async () => {
    const result = await shareWithWebShare(siteSharePayload(), {
      share: async () => {
        throw Object.assign(new Error("dismissed"), { name: "AbortError" });
      },
    });

    assert.equal(result, "cancelled");
  });

  it("wires native share to a user click and hides the button when unsupported", async () => {
    const ui = await read("src/components/SiteShare.tsx");

    assert.match(ui, /canUseWebShare\(/);
    assert.match(ui, /shareWithWebShare\(/);
    assert.match(ui, /onClick=\{openShareMenu\}/);
    assert.match(ui, /aria-label="共有メニューを開く"/);
    assert.ok(
      ui.indexOf("const openShareMenu") < ui.indexOf("shareWithWebShare(SHARE)"),
      "native share must run from the user-triggered handler",
    );
    assert.equal(
      ui.split("shareWithWebShare(").length - 1,
      1,
      "native share must have exactly one call site",
    );
    for (const effect of ui.matchAll(/useEffect\(([\s\S]*?)\), \[[^\]]*\]\);/g)) {
      assert.doesNotMatch(effect[1], /shareWithWebShare/);
    }
    assert.match(ui, /canNativeShare \? \(/);
  });
});

describe("URL copy", () => {
  it("copies the provided URL through the Clipboard API", async () => {
    const writes = [];
    const ok = await copyUrlToClipboard("https://mily-fan-site.vercel.app/", {
      writeText: async (text) => {
        writes.push(text);
      },
    });

    assert.equal(ok, true);
    assert.deepEqual(writes, ["https://mily-fan-site.vercel.app/"]);
  });

  it("falls back when Clipboard API is unavailable or blocked", async () => {
    const viaMissingApi = await copyUrlToClipboard(
      "https://example.test/",
      undefined,
      () => true,
    );
    assert.equal(viaMissingApi, true);

    const viaThrownApi = await copyUrlToClipboard(
      "https://example.test/",
      {
        writeText: async () => {
          throw new Error("blocked");
        },
      },
      () => true,
    );
    assert.equal(viaThrownApi, true);

    const failed = await copyUrlToClipboard(
      "https://example.test/",
      undefined,
      () => {
        throw new Error("no execCommand");
      },
    );
    assert.equal(failed, false);
  });

  it("restores the previously focused control after execCommand fallback", async () => {
    const lib = await read("src/lib/siteShare.ts");
    const start = lib.indexOf("export function copyWithExecCommand");
    const end = lib.indexOf("export async function copyUrlToClipboard");
    const fn = lib.slice(start, end);

    assert.match(fn, /const previous =\s*document\.activeElement instanceof HTMLElement/);
    assert.ok(
      fn.indexOf("const previous") < fn.indexOf("textarea.focus()"),
      "the active element must be captured before the temporary textarea is focused",
    );
    assert.ok(
      fn.indexOf("textarea.remove()") < fn.indexOf("previous.focus"),
      "focus must be restored after the temporary textarea is removed",
    );
    assert.match(fn, /previous\.isConnected/);
    assert.match(fn, /previous\.focus\(\{ preventScroll: true \}\)/);
  });

  it("exposes an accessible copy control and live status", async () => {
    const ui = await read("src/components/SiteShare.tsx");

    assert.match(ui, /aria-label="このサイトのURLをコピー"/);
    assert.match(ui, /copyUrlToClipboard\(/);
    assert.match(ui, /URLをコピーしました/);
    assert.match(ui, /id="site-share-status"/);
    assert.match(ui, /aria-live="polite"/);
    assert.match(ui, /role="status"/);
    assert.doesNotMatch(ui, /\balert\(/);
  });
});

describe("footer placement and home isolation", () => {
  it("renders share controls from Footer without changing App.tsx", async () => {
    const footer = await read("src/components/Footer.tsx");
    const app = await read("src/App.tsx");

    assert.match(footer, /import \{ SiteShare \} from "\.\/SiteShare"/);
    assert.match(footer, /<SiteShare \/>/);
    assert.ok(
      footer.indexOf("<SiteShare />") <
        footer.indexOf("ファン制作の非公式サイト"),
      "share controls belong above the unofficial disclaimer",
    );
    assert.match(footer, /ファン制作の非公式サイト/);
    assert.match(footer, /公式・公認・本人運営ではありません/);
    assert.match(footer, /応援アーカイブへ戻る/);
    assert.match(footer, /\{profile\.displayName\}/);
    assert.ok(
      footer.indexOf("公式・公認・本人運営ではありません") <
        footer.indexOf("応援アーカイブへ戻る"),
    );
    assert.doesNotMatch(app, /SiteShare|siteShare|このサイトをシェア|navigator\.share/);
    assert.match(app, /<Footer \/>/);
  });

  it("does not modify the home integration surfaces", async () => {
    for (const relative of UNTOUCHED_HOME_FILES) {
      const source = await read(relative);
      assert.doesNotMatch(
        source,
        /SiteShare|siteShare|このサイトをシェア/,
        `${relative} must stay outside the share change`,
      );
    }
  });

  it("does not add dependencies, remote images, or tracking scripts", async () => {
    const pkg = JSON.parse(await read("package.json"));
    const ui = await read("src/components/SiteShare.tsx");
    const lib = await read("src/lib/siteShare.ts");
    const footer = await read("src/components/Footer.tsx");

    assert.deepEqual(Object.keys(pkg.dependencies).sort(), [
      "@vitejs/plugin-react-swc",
      "lucide-react",
      "react",
      "react-dom",
    ]);
    assert.equal(pkg.dependencies["react-share"], undefined);

    for (const source of [ui, lib, footer]) {
      assert.doesNotMatch(source, /<script[\s\S]*src=/i);
      assert.doesNotMatch(source, /platform\.(?:twitter|x)\.com/i);
      assert.doesNotMatch(source, /connect\.facebook\.net/i);
      assert.doesNotMatch(source, /d\.line-cdn\.net/i);
      assert.doesNotMatch(source, /<img[\s\S]*src="https?:/i);
    }
  });

  it("wraps on small screens instead of scrolling sideways", async () => {
    const ui = await read("src/components/SiteShare.tsx");

    assert.match(ui, /flex-wrap/);
    assert.match(ui, /min-h-11/);
    assert.match(ui, /min-w-11/);
    assert.match(ui, /max-w-full/);
    assert.doesNotMatch(ui, /overflow-x-auto/);
    assert.doesNotMatch(ui, /whitespace-nowrap/);
    assert.doesNotMatch(ui, /w-screen/);
  });

  it("gives each share action a clear accessible name", async () => {
    const ui = await read("src/components/SiteShare.tsx");

    assert.match(ui, /Xでこのサイトをシェア/);
    assert.match(ui, /LINEでこのサイトをシェア/);
    assert.match(ui, /Facebookでこのサイトをシェア/);
    assert.match(ui, /共有メニューを開く/);
    assert.match(ui, /このサイトのURLをコピー/);
  });
});
