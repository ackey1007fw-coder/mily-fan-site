import assert from 'node:assert/strict';
import { test } from 'node:test';
import { injectVercelWebAnalytics } from '../src/lib/vercelWebAnalytics.ts';

const scriptPath = '/_vercel/insights/script.js';

function scriptCount(html) {
  return html.split(scriptPath).length - 1;
}

test('injects exactly one Web Analytics script into an independent HTML entry', () => {
  const page = '<!doctype html>\n<html>\n<body>\n  <main>profile</main>\n</body>\n</html>';
  const result = injectVercelWebAnalytics(page);
  assert.equal(scriptCount(result), 1);
  assert.match(result, /window\.va = window\.va \|\| function/);
  assert.match(result, /<script defer src="\/_vercel\/insights\/script\.js"><\/script>/);
  assert.ok(result.indexOf(scriptPath) < result.indexOf('</body>'));
});

test('does not duplicate analytics already present in the home HTML', () => {
  const home = '<body>\n<script>window.va = window.va || function() {};</script>\n<script defer src="/_vercel/insights/script.js"></script>\n</body>';
  assert.equal(injectVercelWebAnalytics(home), home);
  assert.equal(scriptCount(injectVercelWebAnalytics(home)), 1);
});

test('is idempotent for secondary pages', () => {
  const secondary = '<body>\n<div id="root"></div>\n</body>';
  const once = injectVercelWebAnalytics(secondary);
  const twice = injectVercelWebAnalytics(once);
  assert.equal(twice, once);
  assert.equal(scriptCount(twice), 1);
});

test('does not rewrite fragments with no closing body tag', () => {
  assert.equal(injectVercelWebAnalytics('<p>Hello</p>'), '<p>Hello</p>');
});
