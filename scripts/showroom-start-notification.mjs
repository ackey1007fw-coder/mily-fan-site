import { DatabaseSync } from 'node:sqlite';

export const MILY_ROOM_ID = 573253;
export const MILY_ROOM_URL = 'https://www.showroom-live.com/r/circle2026_0734';

// Consumes the existing sky_hub state/event format. It never polls or starts a detector.
export function liveStartEligible(event, state, endedEvents, now = Date.now()) {
  const eventAt = Date.parse(event?.at), checkedAt = Number(state?.checked_epoch) * 1000;
  return Number.isFinite(now) && event?.kind === 'showroom_live_started' && event?.source === 'mily' &&
    event.room_id === MILY_ROOM_ID && state?.room_id === MILY_ROOM_ID && state.live === true &&
    Number.isSafeInteger(event.live_id) && event.live_id > 0 && state.live_id === event.live_id &&
    Number.isFinite(eventAt) && eventAt <= now && now - eventAt <= 90000 &&
    Number.isFinite(checkedAt) && checkedAt <= now && now - checkedAt <= 30000 &&
    Array.isArray(endedEvents) && !endedEvents.some(end => end.kind === 'showroom_live_ended' &&
      end.room_id === MILY_ROOM_ID && end.previous_live_id === event.live_id && Date.parse(end.at) >= eventAt);
}

export class LiveStartOutbox {
  constructor(path) {
    this.db = new DatabaseSync(path);
    this.db.exec(`PRAGMA busy_timeout=1000;
      CREATE TABLE IF NOT EXISTS live_start_notices (
        room_id INTEGER NOT NULL, live_id INTEGER NOT NULL, platform TEXT NOT NULL,
        state TEXT NOT NULL, claimed_at TEXT NOT NULL, completed_at TEXT, permalink TEXT, reason TEXT,
        PRIMARY KEY(room_id,live_id,platform)
      ) STRICT;`);
  }
  close() { this.db.close(); }
  claim(event, state, endedEvents, now = Date.now()) {
    if (!liveStartEligible(event,state,endedEvents,now)) return false;
    return this.db.prepare(`INSERT OR IGNORE INTO live_start_notices
      (room_id,live_id,platform,state,claimed_at) VALUES (?,?,'threads','claimed',?)`)
      .run(MILY_ROOM_ID,event.live_id,new Date(now).toISOString()).changes === 1;
  }
  get(liveId) { return this.db.prepare("SELECT * FROM live_start_notices WHERE room_id=? AND live_id=? AND platform='threads'").get(MILY_ROOM_ID,liveId); }
  finish(liveId, result, now = new Date().toISOString()) {
    if (!['success','failed','unknown'].includes(result.state)) throw new Error('Invalid result');
    if (result.state === 'success') {
      const url = new URL(result.permalink);
      if (url.protocol !== 'https:' || !['www.threads.com','www.threads.net','threads.com','threads.net'].includes(url.hostname) ||
          !url.pathname.includes('/post/') || url.username || url.password) throw new Error('Real Threads permalink required');
    }
    const update=this.db.prepare(`UPDATE live_start_notices SET state=?,completed_at=?,permalink=?,reason=?
      WHERE room_id=? AND live_id=? AND platform='threads' AND state='claimed'`);
    if(update.run(result.state,now,result.permalink ?? null,result.reason ?? null,MILY_ROOM_ID,liveId).changes!==1)throw new Error('Unclaimed or completed start notice');
  }
}

export function liveStartCopy() {
  const text = 'みりぃ（三橋莉子）さんがSHOWROOMで配信を開始しました。\nファン運営・非公式のご案内です。';
  return {text,url:MILY_ROOM_URL,manualXUrl:`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(MILY_ROOM_URL)}`};
}
