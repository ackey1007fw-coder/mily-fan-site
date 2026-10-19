import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');

test('Support keeps its skip link before the glitter entry and header', () => {
  const source = read('src/SupportPage.tsx');
  const component = source.slice(source.indexOf('export default function SupportPage()'));
  const skip = component.indexOf('href="#support-main"');
  const entry = component.indexOf('<ShowGlitterEntry />');
  const header = component.indexOf('<Header />');
  assert.ok(skip >= 0 && entry > skip && header > entry);
  assert.equal((component.match(/<ShowGlitterEntry \/>/g) || []).length, 1);
});

test('No glitter link is inserted before SupportPage at the React root', () => {
  const root = read('src/support-main.tsx');
  assert.ok(!root.includes('ShowGlitterEntry'));
  assert.ok(root.includes('<SupportPage />'));
});
