// A temporary privacy hold for the exact b252 URLs listed in vercel.json.
export default function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("CDN-Cache-Control", "no-store");
  res.setHeader("Vercel-CDN-Cache-Control", "no-store");
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("X-Robots-Tag", "noindex, nofollow, noarchive");
  res.statusCode = 410;
  res.end(req.method === "HEAD" ? undefined : "このメディアは現在確認中のため表示できません。\n");
}
