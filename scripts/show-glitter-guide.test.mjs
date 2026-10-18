import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {SHOW_GLITTER, parseOfficialPoints, planShowGlitterWeek} from '../src/lib/showGlitter.ts';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = (p) => readFileSync(resolve(root,p),'utf8');

test('SHOWROOM daily and weekly minimums and percentile remain independent',()=>{
  assert.equal(SHOW_GLITTER.dailyMin,4000);
  assert.equal(SHOW_GLITTER.dailyTopPercent,20);
  assert.equal(SHOW_GLITTER.weeklyMin,40000);
  assert.equal(SHOW_GLITTER.weeklyTopPercent,10);
  assert.equal(SHOW_GLITTER.suggestedWeekly,42000);
});

test('missing and invalid official point entries are not zeros',()=>{
  for(const value of ['', ' ', '-1', '1.1', 'abc', '1e6', '9007199254740992']) {
    assert.equal(parseOfficialPoints(value),null);
  }
  assert.equal(parseOfficialPoints('0'),0);
  assert.equal(parseOfficialPoints('40'),40);
});

test('calculator is only a points estimate and handles minimums',()=>{
  assert.deepEqual(planShowGlitterWeek(15000,5),{
    remainingToMinimum:25000, dailyAverageToMinimum:5000,
    dailyAverageToSuggested:5400, percentOfMinimum:37.5,
  });
  assert.deepEqual(planShowGlitterWeek(40000,1),{
    remainingToMinimum:0, dailyAverageToMinimum:0,
    dailyAverageToSuggested:2000, percentOfMinimum:100,
  });
  assert.equal(planShowGlitterWeek(0,7)?.dailyAverageToMinimum,5715);
  assert.equal(planShowGlitterWeek(0,7)?.dailyAverageToSuggested,6000);
  assert.equal(planShowGlitterWeek(999999,1)?.percentOfMinimum,100);
});

test('invalid points and remaining days fail closed',()=>{
  for(const points of [null,-1,NaN,Infinity,1.5,Number.MAX_SAFE_INTEGER+1]) {
    assert.equal(planShowGlitterWeek(points,7),null);
  }
  for(const days of [0,-1,1.5,8]) assert.equal(planShowGlitterWeek(0,days),null);
});

test('public support guide is shareable, sourced and clearly nonofficial',()=>{
  const component=read('src/components/ShowGlitterGuide.tsx');
  const support=read('src/SupportPage.tsx');
  const home=read('src/components/Support.tsx');
  assert.match(component,/id="show-glitter-guide"/);
  assert.match(support,/<ShowGlitterGuide\s*\/>/);
  assert.match(home,/\/support\/#show-glitter-guide/);
  for(const phrase of ['4,000','40,000','20％','10％','デイリーグリッター',
    'ウィークリーグリッター','2025年6月9日','50％','ジャンル月間・年間','レインボースター']){
    assert.ok(component.includes(phrase),`missing: ${phrase}`);
  }
  assert.ok(component.includes('きら星・コメント・訪問の表示値やイベントポイントを入れない'));
  assert.ok(component.includes('未照合'));
  assert.ok(component.includes('非公式'));
  assert.ok(component.includes('入力は保存・送信しません'));
  assert.ok(!/localStorage|sessionStorage|fetch\(|console\./.test(component));
  assert.ok(!/録画|非公開DM|個別貢献ランキング|__DATA_LAB_/.test(component));
  assert.ok(component.includes('rel="noopener noreferrer"'));
  assert.ok(component.includes('https://campaign.showroom-live.com/award2024/'));
  assert.ok(component.includes('https://note.com/showroom_note/n/n7b412397238d'));
  assert.ok(component.includes('https://www.showroom-live.com/ranking'));
});
