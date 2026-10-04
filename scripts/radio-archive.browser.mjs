import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { radioMusicEpisodes } from '../src/data/radioMusic.ts';
import { radioEpisodes } from '../src/data/radioEpisodes.ts';

const engines = await import(pathToFileURL(join(process.env.PLAYWRIGHT_MODULE_ROOT, 'playwright/index.mjs')).href);
const output = join(process.env.SONG_CATALOG_ARTIFACT_DIR, 'radio-archive');
await mkdir(output, { recursive: true });
const origin = 'http://127.0.0.1:4176';
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', '4176', '--strictPort'], { stdio: 'ignore' });
const results = [];
try {
  let ready = false;
  for (let i = 0; i < 100; i++) {
    try { ready = (await fetch(origin)).ok; } catch {}
    if (ready) break;
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  assert.ok(ready, 'Built site starts');
  for (const [engine, width, height] of [['chromium', 320, 800], ['webkit', 390, 844], ['chromium', 1440, 1000]]) {
    const browser = await engines[engine].launch({ headless: true });
    try {
      const page = await browser.newPage({ viewport: { width, height } });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      for (const route of ['/activities/radio/', '/activities/radio/music/']) {
        await page.goto(origin + route, { waitUntil: 'networkidle' });
        const isMusic = route.endsWith('/music/');
        if (!isMusic) {
          for (const recap of radioEpisodes.filter(item => !radioMusicEpisodes.some(music => music.id === item.id))) {
            const unknownSongs = page.locator(`section[aria-labelledby="${recap.id}-songs"]`);
            assert.equal(await unknownSongs.count(), 1, "既存の曲目確認中の案内を表示する");
            assert.match(await unknownSongs.innerText(), /曲目は確認中/);
            assert.equal(await unknownSongs.getByRole('link', { name: 'YouTubeで聴く' }).count(), 0, "未確認の曲リンクを作らない");
            assert.equal(await page.locator(`section[aria-labelledby="${recap.id}-mily-highlights"]`).count(), 1, "曲目未確認でも放送メモは表示する");
          }
        }
        const episodes = isMusic ? radioMusicEpisodes : radioEpisodes.flatMap(recap => {
          const music = radioMusicEpisodes.find(item => item.id === recap.id);
          return music ? [music] : [];
        });
        for (const episode of episodes) {
          assert.ok(episode, 'Every recap has a song list');
          const section = isMusic ? page.locator(`[id="music-${episode.id}"]`) : page.locator(`section[aria-labelledby="${episode.id}-songs"]`);
          await section.waitFor();
          const links = section.getByRole('link', { name: 'YouTubeで聴く' });
          assert.equal(await links.count(), episode.songs.length, episode.id);
          for (let i = 0; i < episode.songs.length; i++) {
            const link = links.nth(i);
            assert.equal(await link.getAttribute('href'), episode.songs[i].youtubeUrl);
            assert.equal(await link.getAttribute('target'), '_blank');
            assert.match(await link.getAttribute('rel'), /noopener/);
            assert.match(await link.getAttribute('rel'), /noreferrer/);
            assert.ok((await link.boundingBox()).height >= 44, 'Touch target at least 44px');
          }
        }
        if (!isMusic) {
          const recap = radioEpisodes.find(item => item.date === '2026-09-13');
          const highlights = page.locator(`section[aria-labelledby="${recap.id}-mily-highlights"]`);
          assert.equal(await highlights.locator('li').count(), 11);
          assert.ok((await highlights.innerText()).length > 2000, 'Detailed recap is rendered');
          const historicalSection = highlights.locator('xpath=ancestor::section[1]');
          await historicalSection.getByText('主なコーナーとタイムスタンプを見る', { exact: true }).click();
          assert.equal(await historicalSection.locator('details[open] li').count(), 17);
          await highlights.screenshot({ path: join(output, `${engine}-${width}-highlights.png`) });
        }
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${route}: no horizontal overflow at ${width}px`);
        assert.deepEqual(errors, []);
        results.push({ engine, width, route, status: 'passed' });
      }
    } finally { await browser.close(); }
  }
} finally {
  server.kill('SIGTERM');
  await writeFile(join(output, 'results.json'), JSON.stringify(results, null, 2));
}
console.log(JSON.stringify(results));
