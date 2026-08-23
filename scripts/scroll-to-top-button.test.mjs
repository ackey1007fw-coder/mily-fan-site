import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function read(relative) {
  return readFile(path.join(root, relative), "utf8");
}

describe("ページ上部へ戻るボタン", () => {
  it("is rendered from App, after the mobile dock", async () => {
    const app = await read("src/App.tsx");

    assert.match(app, /import \{ ScrollToTopButton \} from ".\/components\/ScrollToTopButton";/);
    assert.match(app, /<ScrollToTopButton \/>/);
    assert.ok(
      app.indexOf("<MobileActionDock />") < app.indexOf("<ScrollToTopButton />"),
      "the button must render after the mobile dock",
    );
  });

  it("keeps the existing App content untouched", async () => {
    const app = await read("src/App.tsx");

    for (const tag of [
      "<Hero />",
      "<TodayDashboard />",
      "<Support />",
      "<Socials />",
      "<Footer />",
      "<MobileActionDock />",
    ]) {
      assert.ok(app.includes(tag), `${tag} must stay in App`);
    }
    assert.match(app, /<Latest/);
    assert.match(app, /<Stories/);
    assert.match(app, /<Gallery/);
    assert.doesNotMatch(app, /<StreamSchedule|<About|<Schedule/);
  });

  it("is an accessible button with a 44px+ tap target", async () => {
    const button = await read("src/components/ScrollToTopButton.tsx");

    assert.match(button, /type="button"/);
    assert.match(button, /aria-label="ページ上部へ戻る"/);
    // h-12 / w-12 = 48px, 最低 44x44px を満たす
    assert.match(button, /h-12 w-12/);
    assert.match(button, /aria-hidden="true"/);
  });

  it("hides itself at the top and fades in after ~600px", async () => {
    const button = await read("src/components/ScrollToTopButton.tsx");

    assert.match(button, /const SHOW_AFTER_PX = 600;/);
    assert.match(button, /window\.scrollY > SHOW_AFTER_PX/);
    assert.match(button, /invisible translate-y-2 opacity-0/);
    assert.match(button, /visible translate-y-0 opacity-100/);
    assert.match(button, /transition duration-300/);
  });

  it("scrolls to the top and respects prefers-reduced-motion", async () => {
    const button = await read("src/components/ScrollToTopButton.tsx");

    assert.match(button, /window\.scrollTo\(/);
    assert.match(button, /top: 0,/);
    assert.match(button, /\(prefers-reduced-motion: reduce\)/);
    assert.match(button, /"instant"/);
    assert.match(button, /"smooth"/);
    assert.match(button, /motion-reduce:transition-none/);
  });

  it("stays clear of the mobile action dock and the iOS safe area", async () => {
    const button = await read("src/components/ScrollToTopButton.tsx");

    assert.match(button, /fixed right-4/);
    assert.match(button, /bottom-\[calc\(6rem\+env\(safe-area-inset-bottom\)\)\]/);
    assert.match(button, /sm:bottom-6 sm:right-6/);
    // ドック(z-30) より上、ただしヘッダーの sticky 動作は壊さない
    assert.match(button, /z-40/);
  });

  it("leaves the mobile dock and the global smooth scrolling untouched", async () => {
    const dock = await read("src/components/MobileActionDock.tsx");
    const css = await read("src/index.css");

    assert.match(dock, /contest\.entryNumber\}を応援する/);
    assert.match(dock, /href=\{SUPPORT_HUB_ROUTE\}/);
    assert.match(dock, /fixed inset-x-0 bottom-0 z-30/);
    assert.match(css, /scroll-behavior: smooth;/);
  });
});
