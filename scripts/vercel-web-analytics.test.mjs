import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { runInNewContext } from "node:vm";
import { injectVercelWebAnalytics } from "../src/lib/vercelWebAnalytics.ts";

const loaderPath = "/mily-analytics-loader.js";
const insightsPath = "/_vercel/insights/script.js";
const loaderSource = readFileSync(new URL("../public/mily-analytics-loader.js", import.meta.url), "utf8");
const homeSource = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const dataLabSource = readFileSync(new URL("../data-lab/index.html", import.meta.url), "utf8");

function tagCount(html) {
  return (html.match(/<script defer src="\/mily-analytics-loader\.js"><\/script>/g) || []).length;
}

function makeBrowser(protocol, initialScripts = []) {
  const added = [];
  const scripts = [...initialScripts];
  const window = { location: { protocol } };
  const document = {
    querySelector(selector) {
      if (selector !== 'script[src="' + insightsPath + '"]') return null;
      return scripts.find((script) => script.src === insightsPath) ?? null;
    },
    createElement(tagName) {
      return { tagName };
    },
    head: {
      appendChild(script) {
        added.push(script);
        scripts.push(script);
      },
    },
  };
  return {
    added,
    window,
    run() {
      runInNewContext(loaderSource, { window, document });
    },
  };
}

test("injects a single first-party external loader into independent pages", () => {
  for (const input of [
    "<!doctype html>\n<html><body>\n<main>Profile</main>\n</body></html>",
    dataLabSource,
  ]) {
    const html = injectVercelWebAnalytics(input);
    assert.equal(tagCount(html), 1);
    assert.ok(html.includes(loaderPath));
    assert.equal(html.includes("data-mily-analytics-loader"), false);
    assert.equal(html.includes(insightsPath), false);
  }
});

test("CSP-protected data lab needs no unsafe-inline exception", () => {
  const csp = /<meta http-equiv="Content-Security-Policy" content="([^"]+)"/;
  const before = dataLabSource.match(csp)?.[1];
  const after = injectVercelWebAnalytics(dataLabSource).match(csp)?.[1];
  assert.ok(before?.includes("script-src 'self'"));
  assert.equal(after, before);
  assert.equal(tagCount(injectVercelWebAnalytics(dataLabSource)), 1);
});

test("HOME uses the same external loader with no legacy inline bootstrap", () => {
  assert.equal(tagCount(homeSource), 1);
  assert.equal(homeSource.includes(insightsPath), false);
  assert.equal(homeSource.includes("window.va = window.va"), false);
  assert.equal(injectVercelWebAnalytics(homeSource), homeSource);
});

test("injection is idempotent on HTML without a preinstalled loader", () => {
  const input = "<body>\n<div id=\"root\"></div>\n</body>";
  const once = injectVercelWebAnalytics(input);
  assert.equal(injectVercelWebAnalytics(once), once);
  assert.equal(tagCount(once), 1);
});

test("HTTP local preview does not load remote Vercel script", () => {
  const browser = makeBrowser("http:");
  browser.run();
  assert.equal(browser.added.length, 0);
  assert.equal(browser.window.va, undefined);
});

test("HTTPS loads the Vercel script once and queues events", () => {
  const browser = makeBrowser("https:");
  browser.run();
  assert.equal(browser.added.length, 1);
  assert.equal(browser.added[0].tagName, "script");
  assert.equal(browser.added[0].src, insightsPath);
  assert.equal(browser.added[0].async, true);
  browser.window.va("test-event", { field: "value" });
  assert.equal(browser.window.vaq.length, 1);
  browser.run();
  assert.equal(browser.added.length, 1);
});

test("HTTPS reuses an existing Vercel insights script", () => {
  const browser = makeBrowser("https:", [{ src: insightsPath }]);
  browser.run();
  assert.equal(browser.added.length, 0);
  assert.equal(typeof browser.window.va, "function");
});

test("leaves HTML fragments without a closing body tag unchanged", () => {
  const fragment = "<p>Hello</p>";
  assert.equal(injectVercelWebAnalytics(fragment), fragment);
});
