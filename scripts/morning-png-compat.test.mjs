import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';

const manifest=JSON.parse(readFileSync(new URL('./assets/morning-20261005-legacy-png.json',import.meta.url),'utf8'));
const signature=Buffer.from([137,80,78,71,13,10,26,10]);

test('October 5 compatibility inventory retains all eight previously published PNG URLs',()=>{
 assert.equal(manifest.sourceCommit,'e9f190879f96fda58102b8b5dc363d12245d9172');
 assert.deepEqual(manifest.assets.map(asset=>asset.url),Array.from({length:8},(_,i)=>`/media/live/mily-b192-0${i+1}-20261005-morning-privacy-still.png`));
});

for(const asset of manifest.assets){
 test(`published URL ${asset.url} retains its original PNG bytes`,()=>{
  const bytes=readFileSync(new URL(`../public${asset.url}`,import.meta.url));
  assert.equal(bytes.length,asset.bytes);
  assert.equal(createHash('sha256').update(bytes).digest('hex'),asset.sha256);
  assert.ok(bytes.subarray(0,8).equals(signature));
  assert.equal(bytes.readUInt32BE(16),asset.width);
  assert.equal(bytes.readUInt32BE(20),asset.height);
 });
}
