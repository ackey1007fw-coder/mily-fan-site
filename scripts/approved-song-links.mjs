// Owner-requested original-song links, verified against the artists/label channels.
// Removing only these exact URLs lets existing private-archive checks keep running.
const approved = new Set([
  "https://www.youtube.com/watch?v=aRDURmIYBZ4",
  "https://www.youtube.com/watch?v=Rlk3i0sEQR8",
  "https://www.youtube.com/watch?v=MDZSdjLqiGA",
  "https://www.youtube.com/watch?v=gU5oN0KVofU",
]);

export function withoutApprovedSongLinks(source) {
  return source.replace(/https?:\/\/[^\s"'<>()[\]]+/g, (url) => approved.has(url) ? "[approved song link]" : url);
}
