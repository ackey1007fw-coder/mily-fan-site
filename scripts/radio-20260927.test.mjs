import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { describe,it } from 'node:test';
import { radioEpisodes } from '../src/data/radioEpisodes.ts';
import { radioEpisode20260927 as recap } from '../src/data/radioEpisode20260927.ts';
import { radioMusicEpisodes,radioMusicPlaylist } from '../src/data/radioMusic.ts';
const music=radioMusicEpisodes.find(x=>x.id===recap.id);
describe('September 27 kawaii radio archive',()=>{
 it('adds a source-bounded recap without replacing historical episodes',()=>{
  assert.equal(radioEpisodes.find(item=>item.date==='2026-09-27'),recap); assert.equal(recap.date,'2026-09-27');
  assert.equal(recap.milyHighlights.length,15); assert.equal(recap.timeline.length,15);
  assert.equal(recap.listenerMessages.length,4);
  assert.deepEqual(recap.presenters,['みりぃ（パーソナリティ）','マナティ（ディレクター）']);
  assert.match(recap.transcriptionNote,/全編を人手で逐語校正したものではありません/);
  assert.match(recap.transcriptionNote,/放送時刻や楽曲カット版/);
  assert.match(recap.nextEpisodeNote,/放送時点/);
  assert.ok(recap.milyHighlights.some(x=>x.quote?.includes('君からLINE')&&x.quote?.includes('丸い月')));
  assert.doesNotMatch(JSON.stringify(recap),/drive\.google|C:\\|\.ogg|\.part|youtu\.be|youtube\.com|夏目漱石/);
 });
 it('publishes exactly the 15 in-program songs and marks two version differences',()=>{
  assert.ok(music);assert.equal(music.songs.length,15);
  assert.equal(music.songs[0].title,'好きすぎて滅！');
  assert.equal(music.songs[14].title,'最上級にかわいいの！');
  assert.equal(new Set(music.songs.map(x=>x.youtubeUrl)).size,15);
  assert.ok(music.songs.every(x=>/^https:\/\/www\.youtube\.com\/watch\?v=[\w-]{11}$/.test(x.youtubeUrl)));
  assert.match(music.songs[6].youtubeVersionNote,/2020年版/);
  assert.match(music.songs[10].youtubeVersionNote,/同一のミックスとは断定/);
  assert.doesNotMatch(JSON.stringify(music),/John Denver|Country Roads/);
 });
 it('uses the owner-created song playlist without exposing private recordings',async()=>{
  assert.equal(radioMusicPlaylist.url,'https://www.youtube.com/playlist?list=PLD69UVBfxh5g');
  const page=await readFile(new URL('../src/RadioMusicPage.tsx',import.meta.url),'utf8');
  assert.match(page,/ExternalLink href=\{radioMusicPlaylist.url\}/);
  assert.match(page,/YouTube再生リストを開く/);
  assert.doesNotMatch(page,/トーク版\.mp4|MilyRadio-[0-9]{8}-private/);
 });
});
