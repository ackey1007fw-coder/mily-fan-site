const host = document.getElementById("observation-charts");
const status = document.getElementById("chart-status");
const NS = "http://www.w3.org/2000/svg";
const origin = Date.parse("2026-10-30T05:00:00+09:00");
const axisEnd = Date.parse("2026-10-30T05:35:00+09:00");
const x = time => 65 + (Date.parse(time) - origin) / (axisEnd - origin) * 680;
function element(tag, attrs = {}, text = "") {
  const node = document.createElementNS(NS, tag);
  for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, String(value));
  if (text) node.textContent = text;
  return node;
}
async function render() {
  const response = await fetch("/data-lab/data/mily-morning1-20261030-aggregate.json");
  if (!response.ok) throw new Error("Data unavailable");
  const data = await response.json();
  if (data.liveId !== 23620568 || data.session !== "morning1" || !Array.isArray(data.observations) || data.observations.length !== 100) throw new Error("Wrong snapshot");
  const points = data.observations;
  if (points.some(p => !p.atJst.startsWith("2026-10-30T05:") || !Number.isFinite(Date.parse(p.atJst)))) throw new Error("Invalid timestamp");
  const last = data.lastValidOnline.atJst;
  if (last !== "2026-10-30T05:17:50.969+09:00" || points.at(-1).atJst !== last) throw new Error("Invalid last observation");
  const fragment = document.createDocumentFragment();
  for (const [metric, title, maximum, step] of [["stars", "きら星の画面表示", 2000, 500], ["visits", "総訪問の画面表示", 150, 50], ["comments", "コメントの画面表示", 80, 20]]) {
    const section = document.createElement("section");
    section.className = "chart-section";
    section.id = "chart-" + metric;
    const heading = document.createElement("h2"); heading.textContent = title;
    const wrap = document.createElement("div"); wrap.className = "plot-wrap";
    wrap.tabIndex = 0; wrap.setAttribute("aria-label", title + "のグラフ。小さい画面では横にスクロールできます。");
    const svg = element("svg", { viewBox: "0 0 800 300", role: "img", "aria-label": title + "。観測点のみ。5時17分以後は未取得" });
    svg.append(element("title", {}, title), element("desc", {}, "観測点は結ばず、欠測は0にしません。5時35分は表示範囲の端で、放送終了ではありません。"));
    const y = value => 245 - value / maximum * 190;
    svg.append(element("rect", { x: x(last), y: 30, width: 745 - x(last), height: 215, class: "unknown" }), element("text", { x: 600, y: 48, "text-anchor": "middle" }, "以後の数値は未取得"));
    for (let value = 0; value <= maximum; value += step) {
      svg.append(element("line", { x1: 65, y1: y(value), x2: 745, y2: y(value), class: "grid" }), element("text", { x: 52, y: y(value) + 5, "text-anchor": "end" }, value.toLocaleString("ja-JP")));
    }
    for (let minute = 0; minute <= 35; minute += 5) svg.append(element("text", { x: 65 + minute / 35 * 680, y: 280, "text-anchor": "middle" }, "5:" + String(minute).padStart(2, "0")));
    for (const point of points) {
      const value = point[metric];
      if (value === null) continue;
      if (!Number.isFinite(value) || value < 0 || value > maximum || Date.parse(point.atJst) > Date.parse(last)) throw new Error("Invalid value");
      const dot = element("circle", { "data-series": metric, "data-at": point.atJst, "data-value": value, cx: x(point.atJst), cy: y(value), r: 3.6, class: "dot" });
      dot.append(element("title", {}, point.atJst.slice(11, 19) + " / " + value.toLocaleString("ja-JP")));
      svg.append(dot);
    }
    wrap.append(svg);
    const note = document.createElement("p"); note.className = "muted";
    note.textContent = "点の間と終盤は補間していません。5:35は横軸の表示端で、配信終了時刻ではありません。";
    section.append(heading, wrap, note); fragment.append(section);
  }
  host.replaceChildren(fragment);
  host.dataset.ready = "true";
  status.textContent = "100観測点から3つのグラフを表示しました。初期の総訪問欠測と終盤は補っていません。";
}
if (host && status) render().catch(() => {
  host.replaceChildren();
  status.textContent = "グラフのデータを読み込めませんでした。下の表と注記、匿名CSV・JSONで確認できます。";
});
