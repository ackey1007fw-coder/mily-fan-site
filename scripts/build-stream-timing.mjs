import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { buildDataset } from '../public/data-lab/assets/timing-core.mjs';
export const INPUTS = [
  'mily-comment-velocity-history-20261010-16',
  'mily-morning-20261014-aggregate', 'mily-morning-20261015-aggregate',
  'mily-morning-20261016-aggregate', 'mily-morning-20261017-aggregate',
  'mily-morning-20261018-aggregate', 'mily-night-20261014-aggregate',
  'mily-night-20261015-aggregate', 'mily-night-20261016-aggregate',
  'mily-night-20261017-aggregate', 'mily-noon-20261014-aggregate',
  'mily-night-20261020-aggregate', 'mily-morning-20261021-aggregate'
];
const ROOT=fileURLToPath(new URL('../',import.meta.url));
export function generate() {
  return buildDataset(INPUTS.map(name=>{
    const path='/data-lab/data/'+name+'.json';
    const bytes=readFileSync(resolve(ROOT,'public'+path));
    return {path,sha256:createHash('sha256').update(bytes).digest('hex'),data:JSON.parse(bytes.toString('utf8'))};
  }));
}
export function serialized() { return JSON.stringify(generate(),null,2)+'\n'; }
if(process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const dest=resolve(ROOT,'public/data-lab/data/mily-stream-timing.json');
  const output=serialized();
  if(process.argv.includes('--check')) {
    if(readFileSync(dest,'utf8')!==output) throw new Error('Timing snapshot is stale: run node scripts/build-stream-timing.mjs');
    console.log('Timing snapshot matches the published source files.');
  } else {
    writeFileSync(dest,output,'utf8');
    console.log('Updated public/data-lab/data/mily-stream-timing.json from '+INPUTS.length+' public source files.');
  }
}
