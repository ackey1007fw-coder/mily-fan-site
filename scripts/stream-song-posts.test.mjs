import assert from 'node:assert/strict';
import { test } from 'node:test';
import { streamRecaps } from '../src/data/streamRecaps.ts';
import { streamSongPosts, songPostGroups } from '../src/data/streamSongPosts.ts';

test('published song posts resolve to exact performances and separate original links', () => {
  assert.equal(songPostGroups(streamRecaps).flatMap(g => g.songs).length, 13);
  assert.equal(streamSongPosts.reduce((n, p) => n + p.links.length, 0), 30);
  const seen = new Set();
  for (const post of streamSongPosts) {
    const key = post.recapId + '|' + post.songTitle;
    assert.ok(!seen.has(key)); seen.add(key);
    const song = streamRecaps.find(r => r.id === post.recapId)?.songs?.find(s => s.title === post.songTitle);
    assert.ok(song);
    assert.equal(new Set(post.links.map(l => l.platform)).size, post.links.length);
    for (const link of post.links) {
      const u = new URL(link.url);
      assert.equal(u.protocol, 'https:'); assert.notEqual(link.url, song.youtubeUrl);
      if (link.platform === 'youtube') {
        assert.equal(u.hostname, 'www.youtube.com'); assert.equal(u.pathname, '/watch');
        assert.match(u.searchParams.get('v'), /^[\w-]{11}$/);
      } else if (link.platform === 'tiktok') {
        assert.equal(u.hostname, 'www.tiktok.com'); assert.match(u.pathname, /^\/@ackeytan_\/video\/\d+$/);
      } else {
        assert.equal(u.hostname, 'www.instagram.com'); assert.match(u.pathname, /^\/reel\/[\w-]+\/$/);
      }
    }
  }
  assert.deepEqual(songPostGroups(streamRecaps, [{ recapId: 'missing', songTitle: 'missing', links: [] }]), []);
});
