import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { news, sortNewsByDateDesc } from "../src/data/news.ts";
import { HOME_NEWS_LIMIT, ARCHIVE_LOAD_MORE_LABEL } from "../src/lib/homePortal.ts";
import { kawaiiRadioStoryVideo as video, kawaiiRadioMessageImage as image, RADIO_KAWAII_MESSAGE_FORM_URL, kawaiiRadioAdditionalVideos } from "../src/data/kawaiiRadioStoryVideo.ts";
import { radioProgram } from "../src/data/radio.ts";
import { radioAnniversaryStories } from "../src/data/radioAnniversaryStories.ts";
const item = news.find(item => item.id === "2026-09-27-radio-kawaii-story");
const tools = process.env.PLAYWRIGHT_MODULE_ROOT;
assert.ok(tools);
const engines = await import(pathToFileURL(join(tools, "playwright/index.mjs")).href);
const output = join(process.env.SONG_CATALOG_ARTIFACT_DIR || "qa-artifacts", "radio-story-20260927");
await mkdir(output, { recursive: true });
const origin = process.env.RADIO_STORY_ORIGIN || "http://127.0.0.1:4177";
const server = process.env.RADIO_STORY_ORIGIN ? null : spawn(process.execPath, ["node_modules/vite/bin/vite.js", "preview", "--host", "127.0.0.1", "--port", "4177", "--strictPort"], { stdio: "ignore" });
const results = [];
try {
  let ready = false;
  for (let i = 0; i < 100; i++) {
    try { ready = (await fetch(origin)).ok; } catch {}
    if (ready) break;
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  assert.ok(ready, "Built site starts");
  for (const [engine, width, height] of [["chromium",320,800],["webkit",390,844],["chromium",1440,1000]]) {
    const browser = await engines[engine].launch({ headless: true });
    try {
      const page = await browser.newPage({ viewport: { width, height } });
      const errors = []; page.on("pageerror", e => errors.push(e.message));
      await page.route("**/*", route => new URL(route.request().url()).origin === origin ? route.continue() : route.fulfill({status:204,body:""}));
      for (const route of ["/", "/news/", "/activities/radio/"]) {
        console.log(`Checking ${engine} ${width}px ${route}`);
        await page.goto(origin + route, { waitUntil: "networkidle" });
        const anniversaryCard = page.locator("li").filter({ has: page.getByText("湘南シーサイドサークル1周年📻 スタジオからのStory2本", { exact: true }) }).first();
        await anniversaryCard.waitFor();
        const anniversaryVideos = route === "/activities/radio/" ? radioAnniversaryStories.slice(0, 1) : radioAnniversaryStories;
        for (const entry of anniversaryVideos) {
          const player = (route === "/activities/radio/" ? page : anniversaryCard).locator(`video[src="${entry.src}"]`);
          assert.equal(await player.count(), 1);
          assert.equal(await player.getAttribute("preload"), "none");
          assert.equal(await player.getAttribute("autoplay"), null);
          assert.notEqual(await player.getAttribute("controls"), null);
          assert.notEqual(await player.getAttribute("playsinline"), null);
          await player.scrollIntoViewIfNeeded();
          await player.evaluate(async el => { el.muted = true; await el.play(); });
          await page.waitForFunction(el => el.currentTime > .1, await player.elementHandle());
          assert.deepEqual(await player.evaluate(el => ({ width: el.videoWidth, height: el.videoHeight, fit: getComputedStyle(el).objectFit })), { width: 512, height: 910, fit: "contain" });
          await player.evaluate(el => el.pause());
        }
        if (route !== "/activities/radio/") {
          assert.equal(await anniversaryCard.getByRole("link", { name: "ラジオを聴く（FM公式）" }).getAttribute("href"), radioProgram.listenUrl);
          assert.equal(await anniversaryCard.getByRole("link", { name: "番組にお便りを送る（FM公式）" }).getAttribute("href"), RADIO_KAWAII_MESSAGE_FORM_URL);
          await anniversaryCard.screenshot({ path: join(output, `${engine}-${width}-anniversary-${route.replaceAll("/", "_")}.png`) });
        }
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
        assert.deepEqual(errors, []);
        results.push({ engine, width, route, anniversaryVideosPlayed: anniversaryVideos.length, status: "passed" });
        const card = page.locator("li").filter({ has: page.getByText(item.title, { exact: true }) }).first();
        const onHome = sortNewsByDateDesc(news).slice(0,HOME_NEWS_LIMIT).some(n => n.id === item.id);
        if (route === "/" && !onHome) { results.push({engine,width,route,status:"passed",outsideHomeLimit:true}); continue; }
        if (route === "/news/") {
          const more = page.getByRole("button",{name:ARCHIVE_LOAD_MORE_LABEL,exact:true});
          for(let i=0; !(await card.count()) && await more.count() && i<news.length; i++) await more.click();
        }
        await card.waitFor();
        assert.match(await card.innerText(), /トークテーマは『かわいい』/);
        const isRadio = route === "/activities/radio/";
        // ActivitiesPage intentionally separates compact NEWS from lead related media.
        const v = (isRadio ? page : card).locator(`video[src="${video.src}"]`);
        assert.equal(await v.count(),1);
        assert.equal(await v.getAttribute("preload"),"none");
        assert.equal(await v.getAttribute("autoplay"),null);
        assert.notEqual(await v.getAttribute("controls"),null);
        assert.notEqual(await v.getAttribute("playsinline"),null);
        let state = null;
        if (isRadio) {
          assert.equal(await card.locator("video,img").count(),0,"Radio NEWS stays compact; video belongs to related media");
          assert.equal(await page.locator(`img[src="${image.src}"]`).count(),0,"Additional photo stays on HOME/NEWS only");
        } else {
          const photo = card.locator(`img[src="${image.src}"]`);
          assert.equal(await photo.count(),1);
          await photo.scrollIntoViewIfNeeded();
          await page.waitForFunction(img => img.complete && img.naturalWidth > 0, await photo.elementHandle());
          await photo.evaluate(img => img.decode());
          state = await photo.evaluate(img => ({width:img.naturalWidth,fit:getComputedStyle(img).objectFit,ratio:img.getBoundingClientRect().width/img.getBoundingClientRect().height}));
          assert.ok(state.width>0); assert.equal(state.fit,"contain");
          assert.ok(Math.abs(state.ratio-864/1536)<0.002);
        }
        await v.scrollIntoViewIfNeeded();
        await v.evaluate(async el => {el.muted=true; await el.play();});
        await page.waitForFunction(el => el.currentTime > .1, await v.elementHandle());
        await v.evaluate(el => el.pause());
        if (!isRadio) {
          assert.equal(await card.locator("video").count(), 3);
          for (const extra of kawaiiRadioAdditionalVideos) {
            const player = card.locator(`video[src="${extra.src}"]`);
            assert.equal(await player.count(), 1);
            await player.scrollIntoViewIfNeeded();
            await player.evaluate(async el => { el.muted = true; await el.play(); });
            await page.waitForFunction(el => el.currentTime > .1, await player.elementHandle());
            await player.evaluate(el => el.pause());
          }
        }
        for (const [label,url] of [["ラジオを聴く（FM公式）",radioProgram.listenUrl],["番組にお便りを送る（FM公式）",RADIO_KAWAII_MESSAGE_FORM_URL]]) {
          // ExternalLink adds a screen-reader-only new-tab notice to the accessible name.
          const link=card.getByRole("link",{name:label});
          assert.equal(await link.count(),1);
          assert.equal(await link.getAttribute("href"),url);
          assert.equal(await link.getAttribute("target"),"_blank");
          assert.match(await link.getAttribute("rel"),/noopener/);
        }
        assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
        assert.deepEqual(errors,[]);
        await card.screenshot({path:join(output,`${engine}-${width}-${route.replaceAll("/","_")||"home"}.png`)});
        if (isRadio) await v.screenshot({path:join(output,`${engine}-${width}-radio-related-video.png`)});
        results.push({engine,width,route,status:"passed",imageState:state,videoPlayed:true,compactRadioNews:isRadio});
      }
      await page.goto(origin + "/gallery/", { waitUntil: "networkidle" });
      const galleryPhoto = page.locator(`img[src="${image.src}"]`);
      assert.equal(await galleryPhoto.count(), 1);
      await galleryPhoto.scrollIntoViewIfNeeded();
      await page.waitForFunction(img => img.complete && img.naturalWidth > 0, await galleryPhoto.elementHandle());
      const ratio = await galleryPhoto.evaluate(img => img.getBoundingClientRect().width / img.getBoundingClientRect().height);
      assert.ok(Math.abs(ratio - 864 / 1536) < .002);
      await galleryPhoto.screenshot({path:join(output,`${engine}-${width}-gallery-photo.png`)});
      const more = page.getByRole("button", {name:ARCHIVE_LOAD_MORE_LABEL,exact:true});
      for (const entry of [video, ...kawaiiRadioAdditionalVideos, ...radioAnniversaryStories]) {
        const player = page.locator(`video[src="${entry.src}"]`);
        for (let i = 0; !(await player.count()) && await more.count() && i < 40; i++) await more.click();
        assert.equal(await player.count(), 1);
        await player.scrollIntoViewIfNeeded();
        assert.equal(await player.getAttribute("preload"), "none");
        await player.evaluate(async el => { el.muted = true; await el.play(); });
        await page.waitForFunction(el => el.currentTime > .1, await player.elementHandle());
        await player.evaluate(el => el.pause());
      }
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
      assert.deepEqual(errors, []);
      results.push({engine,width,route:"/gallery/",status:"passed",videosPlayed:5,photosLoaded:1});
    } finally { await browser.close(); }
  }
} finally {
  server?.kill("SIGTERM");
  await writeFile(join(output,"results.json"),JSON.stringify({head:process.env.PR_HEAD_SHA||null,results},null,2));
}
console.log(JSON.stringify(results));
