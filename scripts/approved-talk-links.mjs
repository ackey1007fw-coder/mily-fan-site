// Exact successful public talk-post URLs. Temporary delivery URLs are never allowed.
export const approvedTalkLinks = [
  "https://www.youtube.com/watch?v=0JR37d8ZNdU",
  "https://www.tiktok.com/@ackeytan_/video/7687035295061069063",
  "https://www.instagram.com/reel/Ddctql9icAb/",
  "https://x.com/ackey_RiRi_supp/status/2101105579330769213",
  "https://www.youtube.com/watch?v=wMWy1Dmaq9E",
  "https://www.tiktok.com/@ackeytan_/video/7687035549944646929",
  "https://www.instagram.com/reel/Ddct1s_lHEK/",
  "https://x.com/ackey_RiRi_supp/status/2101106012770181423",
  "https://www.youtube.com/watch?v=OnYV7IlyXyA",
  "https://www.tiktok.com/t/7687477989990305040",
  "https://www.instagram.com/reel/DdfyYOpDuVi/",
  "https://x.com/ackey_RiRi_supp/status/2101537299720769828"
];
export function withoutApprovedTalkLinks(text) {
  return approvedTalkLinks.reduce((out, url) => out.replaceAll(url, ""), text);
}
