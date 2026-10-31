const host = document.getElementById("observation-charts");
const status = document.getElementById("chart-status");
const NS = "http://www.w3.org/2000/svg";
const origin = Date.parse("2026-10-31T14:45:00+09:00");
const axisEnd = Date.parse("2026-10-31T15:25:00+09:00");
const GAP_START = "2026-10-31T14:53:08.485+09:00";
const GAP_END = "2026-10-31T14:57:00.945+09:00";
const LAST = "2026-10-31T15:21:26.341+09:00";
const x = time => 65 + (Date.parse(time) - origin) / (axisEnd - origin) * 680;
function element(tag, attrs = {}, text = "") {
  const node = document.createElementNS(NS, tag);
  for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, String(value));
  if (text) node.textContent = text;
  return node;
}
async function render() {
  const response = await fetch("/data-lab/data/mily-noon-20261031-aggregate.json");
  if (!response.ok) throw new Error("Data unavailable");
  const data = await response.json();
  if (data.liveId !== 23626331 || data.session !== "noon" || !Array.isArray(data.observations) || data.observations.length !== 183) throw new Error("Wrong snapshot");
  const points = data.observations;
  if (points.some(p => !p.atJst.startsWith("2026-10-31T") || !Number.isFinite(Date.parse(p.atJst)))) throw new Error("Invalid timestamp");
  if (data.lastValidOnline.atJst !== LAST || points.at(-1).atJst !== LAST) throw new Error("Invalid last observation");
  const gap = (data.quality.gaps || [])[0];
  if (!gap || gap.startJst !== GAP_START || gap.endJst !== GAP_END) throw new Error("Gap mismatch");
  const fragment = document.createDocumentFragment();
  for (const [metric, title, maximum, step] of [["stars", "きら星の画面表示", 3000, 500], ["visits", "総訪問の画面表示", 150, 50], ["comments", "コメントの画面表示", 300, 100]]) {
    const section = document.createElement("section");
    section.className = "chart-section";
    section.id = "chart-" + metric;
    const heading = document.createElement("h2"); heading.textContent = title;
    const wrap = document.createElement("div"); wrap.className = "plot-wrap";
    wrap.tabIndex = 0; wrap.setAttribute("aria-label", title + "のグラフ。小さい画面では横にスクロールできます。");
    const svg = element("svg", { viewBox: "0 0 800 300", role: "img", "aria-label": title + "。観測点のみ。14時53分から14時57分は欠測、15時21分以後は未取得" });
    svg.append(element("title", {}, title), element("desc", {}, "観測点は結ばず、欠測や未取得は0にしません。15時25分は表示範囲の端で、放送終了ではありません。"));
    const y = value => 245 - value / maximum * 190;
    svg.append(element("rect", { x: x(GAP_START), y: 30, width: x(GAP_END) - x(GAP_START), height: 215, class: "gap" }), element("text", { x: (x(GAP_START) + x(GAP_END)) / 2, y: 48, "text-anchor": "middle" }, "欠測"));
    svg.append(element("rect", { x: x(LAST), y: 30, width: 745 - x(LAST), height: 215, class: "unknown" }), element("text", { x: (x(LAST) + 745) / 2, y: 48, "text-anchor": "middle" }, "未取得"));
    for (let value = 0; value <= maximum; value += step) {
      svg.append(element("line", { x1: 65, y1: y(value), x2: 745, y2: y(value), class: "grid" }), element("text", { x: 52, y: y(value) + 5, "text-anchor": "end" }, value.toLocaleString("ja-JP")));
    }
    for (let minute = 0; minute <= 40; minute += 5) {
      const total = 45 + minute;
      svg.append(element("text", { x: 65 + minute / 40 * 680, y: 280, "text-anchor": "middle" }, (14 + Math.floor(total / 60)) + ":" + String(total % 60).padStart(2, "0")));
    }
    for (const point of points) {
      const value = point[metric];
      if (value === null) continue;
      if (!Number.isFinite(value) || value < 0 || value > maximum || Date.parse(point.atJst) > Date.parse(LAST)) throw new Error("Invalid value");
      const dot = element("circle", { "data-series": metric, "data-at": point.atJst, "data-value": value, cx: x(point.atJst), cy: y(value), r: 3.2, class: "dot" });
      dot.append(element("title", {}, point.atJst.slice(11, 19) + " / " + value.toLocaleString("ja-JP")));
      svg.append(dot);
    }
    wrap.append(svg);
    const note = document.createElement("p"); note.className = "muted";
    note.textContent = "点の間・欠測区間・15:21:26以後は補間していません。15:25は横軸の表示端で、配信終了時刻ではありません。";
    section.append(heading, wrap, note); fragment.append(section);
  }
  host.replaceChildren(fragment);
  host.dataset.ready = "true";
  status.textContent = "183観測点から3つのグラフを表示しました。総訪問の未取得19点と欠測区間は補っていません。";
}
if (host && status) render().catch(() => {
  host.replaceChildren();
  status.textContent = "グラフのデータを読み込めませんでした。注記と匿名CSV・JSONで確認できます。";
});
