import assert from 'node:assert/strict';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';
import { injectVercelWebAnalytics } from '../src/lib/vercelWebAnalytics.ts';

const scriptPath = '/_vercel/insights/script.js';
function scriptCount(html) { return html.split(scriptPath).length - 1; }
function simulateBrowser(html, protocol) {
  const inserted = [];
  const matches = [...html.matchAll(/<script data-mily-analytics-loader>([\s\S]*?)<\/script>/g)];
  assert.equal(matches.length, 1);
  const window = { location: { protocol } };
  const document = {
    createElement: (tagName) => ({ tagName }),
    head: { appendChild: (element) => inserted.push(element) },
  };
  runInNewContext(matches[0][1], { window, document });
  return inserted;
}

test('inserts analytics once in secondary HTML entries', () => {
  const input = '<!doctype html>\n<html>\n<body>\n  <main>profile</main>\n</body>\n</html>';
  const output = injectVercelWebAnalytics(input);
  assert.equal(scriptCount(output), 1);
  assert.match(output, /window\.va = window\.va \|\| function/);
  assert.ok(output.indexOf(scriptPath) < output.indexOf('</body>'));
  assert.match(output, /data-mily-analytics-loader/);
});

test('replaces legacy home loader instead of adding a second one', () => {
  const input = '<body>\n<script>window.va = window.va || function() {};</script>\n<script defer src="/_vercel/insights/script.js"></script>\n</body>';
  const output = injectVercelWebAnalytics(input);
  assert.equal(scriptCount(output), 1);
  assert.doesNotMatch(output, /<script defer src="\/_vercel\/insights\/script\.js"/);
  assert.equal(output.split('window.va = ').length, 2);
  assert.equal(simulateBrowser(output, 'http:').length, 0);
});

test('injection is idempotent', () => {
  const input = '<body><div id="root"></div>\n</body>';
  const once = injectVercelWebAnalytics(input);
  assert.equal(injectVercelWebAnalytics(once), once);
  assert.equal(scriptCount(once), 1);
});

test('avoids requesting Vercel-only script from local HTTP previews', () => {
  const output = injectVercelWebAnalytics('<body>\n</body>');
  assert.equal(simulateBrowser(output, 'http:').length, 0);
});

test('loads one first-party script on HTTPS deployments', () => {
  const output = injectVercelWebAnalytics('<body>\n</body>');
  const scripts = simulateBrowser(output, 'https:');
  assert.equal(scripts.length, 1);
  assert.equal(scripts[0].tagName, 'script');
  assert.equal(scripts[0].src, scriptPath);
  assert.equal(scripts[0].defer, true);
});

test('leaves HTML fragments without a closing body tag unchanged', () => {
  const fragment = '<p>Hello</p>';
  assert.equal(injectVercelWebAnalytics(fragment), fragment);
});
