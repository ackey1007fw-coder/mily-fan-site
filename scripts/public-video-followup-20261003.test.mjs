import assert from 'node:assert/strict';
import {test} from 'node:test';
import {streamRecap20261002Night as night} from '../src/data/streamRecap20261002Night.ts';
import {streamRecap20261003Asa as morning} from '../src/data/streamRecap20261003Asa.ts';
import {tiktokCampusMakeupVideo as video} from '../src/data/tiktokCampusMakeupVideo.ts';
import {news} from '../src/data/news.ts';
import {selectGalleryEntries} from '../src/lib/galleryItems.ts';
import {verifyNews} from './content-invariants.mjs';

test('published talk links match the correct source slots without private delivery URLs',()=>{
 for(const [recap,url] of [[night,'https://www.instagram.com/reel/DeA6JODFNPd/'],[morning,'https://www.instagram.com/reel/DeA6ilVjsal/']]){
  const clips=recap.highlights.flatMap(x=>x.socialClip?[x.socialClip]:[]);
  assert.equal(clips.length,1);assert.deepEqual(clips[0].links,[{platform:'instagram',url}]);
  assert.doesNotMatch(recap.transcriptionNote,/原音の検品待ち/);
  assert.match(recap.transcriptionNote,/要約.*逐語字幕ではありません/);
  assert.doesNotMatch(JSON.stringify(recap),/drive\.google|file:\/\/|C:\\Users/);
 }
});

test('campus makeup keeps unknown post date distinct from editorial confirmation and appears once',()=>{
 assert.equal(video.sourceDate,null);assert.equal(video.postId,'7692016046542228756');
 const item=news.find(x=>x.media===video);assert.equal(item.date,'2026-10-03');
 assert.match(item.body,/10月3日に投稿内容を確認/);assert.match(item.body,/投稿日は未確認/);
 assert.equal(item.message.text,'大学に行く時はとにかくメイク薄い💄');
 assert.deepEqual(verifyNews([item]),[]);
 assert.ok(verifyNews([{...item,dateBasis:undefined}]).length);
 assert.equal(selectGalleryEntries().filter(x=>x.key===video.id).length,1);
});
