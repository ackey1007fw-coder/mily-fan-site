import test from 'node:test';
import assert from 'node:assert/strict';
import { watchGlitterFragment } from '../src/lib/glitterFragment.ts';
function fixture(hash = '#show-glitter-guide') {
  let id = 0;
  const frames = new Map(), events = new Map(), calls = [];
  const win = { location: { hash }, requestAnimationFrame(fn) { frames.set(++id, fn); return id; },
    cancelAnimationFrame(n) { frames.delete(n); }, addEventListener(n, fn) { events.set(n, fn); },
    removeEventListener(n) { events.delete(n); } };
  const doc = { getElementById(n) { assert.equal(n, 'show-glitter-guide'); return { scrollIntoView: o => calls.push(o) }; } };
  const tick = () => { const pending = [...frames.values()]; frames.clear(); for (const fn of pending) fn(); };
  return { win, doc, frames, events, calls, tick };
}
test('cold fragment waits for rendered DOM and scrolls exactly once', () => {
  const f = fixture(); const dispose = watchGlitterFragment(f.win, f.doc);
  assert.equal(f.calls.length, 0); f.tick(); assert.equal(f.calls.length, 0);
  f.tick(); assert.deepEqual(f.calls, [{ block: 'start', behavior: 'instant' }]);
  f.tick(); assert.equal(f.calls.length, 1); dispose();
});
test('plain Support and unrelated fragments are not forced to the guide', () => {
  for (const hash of ['', '#support-main', '#glitter-howto']) {
    const f = fixture(hash); const dispose = watchGlitterFragment(f.win, f.doc);
    f.tick(); f.tick(); assert.equal(f.calls.length, 0); dispose();
  }
});
test('hash navigation schedules alignment but input rerenders do not', () => {
  const f = fixture(''); const dispose = watchGlitterFragment(f.win, f.doc);
  f.win.location.hash = '#show-glitter-guide'; f.events.get('hashchange')();
  f.tick(); f.tick(); assert.equal(f.calls.length, 1);
  f.tick(); assert.equal(f.calls.length, 1); dispose();
});
test('cleanup cancels both animation frames for React StrictMode', () => {
  for (const firstTick of [false, true]) {
    const f = fixture(); const dispose = watchGlitterFragment(f.win, f.doc);
    if (firstTick) f.tick(); dispose(); f.tick(); f.tick();
    assert.equal(f.calls.length, 0); assert.equal(f.events.size, 0); assert.equal(f.frames.size, 0);
  }
});
test('a changed fragment or missing target is safe', () => {
  const f = fixture(); const dispose = watchGlitterFragment(f.win, f.doc);
  f.tick(); f.win.location.hash = '#support-main'; f.tick(); assert.equal(f.calls.length, 0); dispose();
  const g = fixture(); g.doc.getElementById = () => null;
  const stop = watchGlitterFragment(g.win, g.doc); g.tick(); g.tick(); assert.equal(g.calls.length, 0); stop();
});
