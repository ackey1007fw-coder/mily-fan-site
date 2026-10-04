import { DatabaseSync } from 'node:sqlite';

export const SITE_ORIGIN = 'https://mily-fan-site.vercel.app';

export function publicationUrl(value) {
  const url = new URL(value, SITE_ORIGIN);
  if (url.origin !== SITE_ORIGIN || url.username || url.password || url.search) {
    throw new Error('Only canonical public site URLs are eligible');
  }
  return url.href;
}

// This is an outbox protocol, not a new detector or a posting adapter.
export class PublicationOutbox {
  constructor(path) {
    this.db = new DatabaseSync(path);
    this.db.exec(`PRAGMA busy_timeout=1000;
      CREATE TABLE IF NOT EXISTS notices (
        event_kind TEXT NOT NULL, content_id TEXT NOT NULL, platform TEXT NOT NULL,
        url TEXT NOT NULL, title TEXT NOT NULL, state TEXT NOT NULL,
        claimed_at TEXT, completed_at TEXT, permalink TEXT, reason TEXT,
        PRIMARY KEY(event_kind,content_id,platform), UNIQUE(event_kind,url,platform)
      ) STRICT;`);
  }

  close() { this.db.close(); }

  seedExisting(items) {
    const insert = this.db.prepare(`INSERT OR IGNORE INTO notices
      (event_kind,content_id,platform,url,title,state) VALUES ('site_publication',?,'threads',?,?,'baseline')`);
    this.db.exec('BEGIN IMMEDIATE');
    try {
      for (const item of items) insert.run(item.id, publicationUrl(item.url), item.title);
      this.db.exec('COMMIT');
    } catch (error) { this.db.exec('ROLLBACK'); throw error; }
  }

  claim(item, proof, now = new Date().toISOString()) {
    const url = publicationUrl(item.url);
    const at = Date.parse(now), checked = Date.parse(proof?.checkedAt);
    if (!item.id || !item.title || !Number.isFinite(at) || !['article','video','important'].includes(item.kind)) throw new Error('Invalid publication');
    if (proof?.url !== url || proof?.httpStatus !== 200 || proof?.contentVisible !== true ||
        proof?.contentId !== item.id || !Number.isFinite(checked) || checked > at || at - checked > 300000) {
      throw new Error('Fresh public rendering evidence is required');
    }
    const result = this.db.prepare(`INSERT OR IGNORE INTO notices
      (event_kind,content_id,platform,url,title,state,claimed_at)
      VALUES ('site_publication',?,'threads',?,?,'claimed',?)`).run(item.id,url,item.title,now);
    return result.changes === 1;
  }

  finish(id, result, now = new Date().toISOString()) {
    if (!['success','failed','unknown'].includes(result.state)) throw new Error('Invalid result');
    if (result.state === 'success') {
      const url = new URL(result.permalink);
      if (url.protocol !== 'https:' || !['www.threads.com','www.threads.net','threads.com','threads.net'].includes(url.hostname) ||
          !url.pathname.includes('/post/') || url.username || url.password) throw new Error('Real Threads permalink required');
    }
    const update = this.db.prepare(`UPDATE notices SET state=?,completed_at=?,permalink=?,reason=?
      WHERE event_kind='site_publication' AND content_id=? AND platform='threads' AND state='claimed'`);
    if (update.run(result.state,now,result.permalink ?? null,result.reason ?? null,id).changes !== 1) throw new Error('Unclaimed or completed notice');
  }

  get(id) { return this.db.prepare("SELECT * FROM notices WHERE event_kind='site_publication' AND content_id=? AND platform='threads'").get(id); }
}

export function notificationCopy(item) {
  const url = publicationUrl(item.url);
  // No unverified account mention or inferred contest condition is inserted.
  const text = `みりぃファンサイトを更新しました。\n${item.title}\nファン運営・非公式のご案内です。`;
  return { text, url, manualXUrl: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}` };
}
