import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdir,writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { radioEpisode20260927 as recap } from '../src/data/radioEpisode20260927.ts';
import { radioMusicEpisodes,radioMusicPlaylist } from '../src/data/radioMusic.ts';
const tools=process.env.PLAYWRIGHT_MODULE_ROOT;assert.ok(tools);
const engines=await import(pathToFileURL(join(tools,'playwright/index.mjs')).href);
const output=join(process.env.SONG_CATALOG_ARTIFACT_DIR||'qa-artifacts','radio-20260927');
await mkdir(output,{recursive:true});
const origin='http://127.0.0.1:4178';
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','4178','--strictPort'],{stdio:'ignore'});
const rows=[];
try{
 let ready=false;for(let i=0;i<100;i++){try{ready=(await fetch(origin)).ok;}catch{}if(ready)break;await new Promise(r=>setTimeout(r,100));}assert.ok(ready);
 const songData=radioMusicEpisodes.find(x=>x.id===recap.id);
 for(const [engine,width,height] of [['chromium',320,850],['webkit',390,844],['chromium',1440,1000]]){
  const browser=await engines[engine].launch({headless:true});
  try{
   const page=await browser.newPage({viewport:{width,height}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.route('**/*',route=>new URL(route.request().url()).origin===origin?route.continue():route.fulfill({status:204,body:''}));
   for(const route of ['/activities/radio/','/activities/radio/music/']){
    await page.goto(origin+route,{waitUntil:'networkidle'});
    const musicPage=route.endsWith('/music/');
    const songs=musicPage?page.locator(`#music-${recap.id}`):page.locator(`section[aria-labelledby="${recap.id}-songs"]`);
    const links=songs.getByRole('link',{name:'YouTubeで聴く'});assert.equal(await links.count(),15);
    for(let i=0;i<15;i++){assert.equal(await links.nth(i).getAttribute('href'),songData.songs[i].youtubeUrl);assert.equal(await links.nth(i).getAttribute('target'),'_blank');assert.match(await links.nth(i).getAttribute('rel'),/noopener/);assert.ok((await links.nth(i).boundingBox()).height>=44);}
    if(musicPage){
     const playlist=page.getByRole('link',{name:'YouTube再生リストを開く'});assert.equal(await playlist.count(),1);assert.equal(await playlist.getAttribute('href'),radioMusicPlaylist.url);assert.equal(await playlist.getAttribute('target'),'_blank');assert.match(await playlist.getAttribute('rel'),/noreferrer/);assert.ok((await playlist.boundingBox()).height>=44);
     assert.match(await songs.innerText(),/2020年版/);assert.match(await songs.innerText(),/2012-Mix/);
     await page.locator('main > header').screenshot({path:join(output,`${engine}-${width}-music-playlist.png`)});
    }else{
     const hi=page.locator(`section[aria-labelledby="${recap.id}-mily-highlights"]`);assert.equal(await hi.locator('li').count(),15);assert.match(await hi.innerText(),/君からLINE/);assert.match(await hi.innerText(),/丸い月/);
     const outer=hi.locator('xpath=ancestor::section[1]');assert.match(await outer.innerText(),/全編を人手で逐語校正したものではありません/);
     await outer.getByText('主なコーナーとタイムスタンプを見る',{exact:true}).click();assert.equal(await outer.locator('details[open] li').count(),15);
     await hi.screenshot({path:join(output,`${engine}-${width}-highlights.png`)});
    }
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));assert.deepEqual(errors,[]);
    rows.push({engine,width,route,status:'passed',songs:15,errors:[...errors]});
   }
  }finally{await browser.close();}
 }
}finally{server.kill('SIGTERM');await writeFile(join(output,'results.json'),JSON.stringify({head:process.env.PR_HEAD_SHA||null,results:rows},null,2));}
console.log(JSON.stringify(rows));
