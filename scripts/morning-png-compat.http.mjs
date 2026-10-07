import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {preview} from 'vite';

const manifest=JSON.parse(await readFile(new URL('./assets/morning-20261005-legacy-png.json',import.meta.url),'utf8'));
const server=await preview({logLevel:'silent',preview:{host:'127.0.0.1',port:0,strictPort:true}});
try{
 const {port}=server.httpServer.address();
 for(const asset of manifest.assets){
  const response=await fetch(`http://127.0.0.1:${port}${asset.url}`,{redirect:'manual'});
  assert.equal(response.status,200,asset.url);
  assert.match(response.headers.get('content-type')??'',/^image\/png(?:;|$)/i,asset.url);
  const bytes=Buffer.from(await response.arrayBuffer());
  assert.equal(bytes.length,asset.bytes,asset.url);
  assert.equal(createHash('sha256').update(bytes).digest('hex'),asset.sha256,asset.url);
 }
 console.log(JSON.stringify({passed:true,original_png_urls:manifest.assets.length,status:200,mime:'image/png',hashes_match:true}));
}finally{
 await new Promise((resolve,reject)=>server.httpServer.close(error=>error?reject(error):resolve()));
}
