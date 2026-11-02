import { DAILY_STREAM_ENTRIES, groupByBroadcastDate, observationPoints, lastObservedValue, METRICS, SLOT_LABELS } from "./daily-archive-core.js";

const host = document.getElementById("daily-stream-groups");
if (host) {
  const metricButtons = [...document.querySelectorAll("[data-daily-metric]")];
  const numberFormat = new Intl.NumberFormat("ja-JP");
  const timeFormat = new Intl.DateTimeFormat("ja-JP", { timeZone: "Asia/Tokyo", hour: "2-digit", minute: "2-digit" });
  const dayFormat = new Intl.DateTimeFormat("ja-JP", { timeZone: "Asia/Tokyo", month: "long", day: "numeric", weekday: "short" });
  const cache = new Map();
  const cards = [];
  let metric = "stars";
  const svgNS = "http://www.w3.org/2000/svg";

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function svgElement(tag, attrs, text) {
    const node = document.createElementNS(svgNS, tag);
    for (const [name, value] of Object.entries(attrs)) node.setAttribute(name, String(value));
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function getData(entry) {
    if (!cache.has(entry.file)) {
      const path = "/data-lab/data/" + entry.file;
      cache.set(entry.file, fetch(path, { credentials: "omit" })
        .then((response) => {
          if (!response.ok) throw new Error("public snapshot unavailable");
          return response.json();
        })
        .then((data) => {
          const actualDate = data.dateJst ?? data.date_jst;
          const actualSlot = data.session ?? data.slot ?? (entry.slot === "morning" ? undefined : entry.slot);
          if (actualDate && actualDate !== entry.date) throw new Error("date mismatch");
          if (actualSlot && actualSlot !== entry.slot) throw new Error("slot mismatch");
          return data;
        })
        .catch(() => null));
    }
    return cache.get(entry.file);
  }
  function drawChart(svg, points, entry) {
    svg.replaceChildren();
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", entry.date + " " + SLOT_LABELS[entry.slot] + "の" + METRICS[metric] + "を" + points.length + "個の観測点で表示。点同士は結ばず、未観測時間を補いません。");
    const width = 480, left = 46, right = 462, top = 18, bottom = 139;
    const first = points[0].time, last = points.at(-1).time;
    const max = Math.max(1, ...points.map((point) => point.value));
    for (let i = 0; i <= 2; i += 1) {
      const y = bottom - (bottom - top) * i / 2;
      svg.append(svgElement("line", { x1: left, y1: y, x2: right, y2: y, stroke: "#3b5b68", "stroke-width": 1 }));
      svg.append(svgElement("text", { x: left - 7, y: y + 4, "text-anchor": "end", fill: "#cbdce3", "font-size": 11 }, numberFormat.format(Math.round(max * i / 2))));
    }
    for (const point of points) {
      const x = left + (right - left) * (point.time - first) / Math.max(1, last - first);
      const y = bottom - (bottom - top) * point.value / max;
      const circle = svgElement("circle", { cx: x, cy: y, r: 3.6, fill: "#ffb38f", stroke: "#153442", "stroke-width": 1.2 });
      circle.append(svgElement("title", {}, timeFormat.format(new Date(point.time)) + " · " + numberFormat.format(point.value)));
      svg.append(circle);
    }
    svg.append(svgElement("text", { x: left, y: 163, fill: "#cbdce3", "font-size": 12 }, timeFormat.format(new Date(first))));
    svg.append(svgElement("text", { x: right, y: 163, "text-anchor": "end", fill: "#cbdce3", "font-size": 12 }, timeFormat.format(new Date(last))));
  }
  function renderCard(card) {
    const { entry, data, value, chart, note } = card;
    if (data === undefined) return;
    const points = data ? observationPoints(data, metric, entry.date) : [];
    const last = data ? lastObservedValue(data, metric, entry.date) : null;
    const numericUnverified = data?.quality?.numericEvidenceStatus === "unverified" && !data?.referenceSnapshot;
    value.textContent = last === null ? (numericUnverified ? "未確認" : "未取得") : numberFormat.format(last);
    value.dataset.missing = String(last === null);
    chart.replaceChildren();
    if (points.length >= 2) {
      const svg = svgElement("svg", { viewBox: "0 0 480 178", class: "daily-plot" });
      drawChart(svg, points, entry);
      chart.append(svg);
      note.textContent = points.length + "個の時刻付き観測点。点の間と前後は補間していません。最終結果ではありません。";
    } else {
      chart.append(element("p", "daily-no-chart", data
        ? (numericUnverified ? "画面カウンターの原本を照合できていないため、推移グラフは表示できません。" : "この指標の時刻付き観測が2点未満のため、推移グラフは表示できません。")
        : "保存済みの匿名集計を読み込めません。各回のレポートを参照してください。"));
      note.textContent = data?.referenceSnapshot ? data.referenceSnapshot.note + " 最終画面進行（JST）: " + data.referenceSnapshot.lastScreenProgressAtJst + "。推移・時間帯比較には使いません。" : numericUnverified
        ? "原本の有無・観測件数・最終値は未確認です。数値を0として補いません。"
        : "欠測を0として描画しません。既存の各回レポートには別の図表がある場合があります。";
    }
  }
  function createCard(entry, options = {}) {
    const article = element("article", "daily-stream-card" + (options.large ? " daily-stream-card-large" : ""));
    const title = element("h4", "", SLOT_LABELS[entry.slot] + "の配信");
    if (options.isNew) title.prepend(element("span", "daily-new", "NEW"));
    const status = element("div", "daily-stream-stat");
    const label = element("span", "", METRICS[metric] + "（最後の有効な画面参考値）");
    const value = element("strong", "daily-stream-number", "読み込み前");
    status.append(label, value);
    const chart = element("div", "daily-stream-chart");
    const note = element("p", "daily-chart-note", "時刻付きの保存観測を確認しています。");
    const links = element("p", "daily-stream-links");
    const report = element("a", "", "個別の分析・グラフを見る ↗");
    report.href = entry.report;
    const overview = element("a", "", "ラボの当該記録へ ↓");
    overview.href = "#" + entry.section;
    links.append(report, overview);
    article.append(title, status, chart, note, links);
    const card = { entry, data: undefined, label, value, chart, note };
    cards.push(card);
    return { article, card };
  }
  async function loadCards(group) {
    await Promise.all(group.map(async (card) => {
      if (card.data === undefined) card.data = await getData(card.entry);
      renderCard(card);
    }));
  }
  // Latest broadcasts: whole broadcast dates, newest first, until at least LATEST_COUNT broadcasts are shown.
  // A date is never split between the large block and "過去の回", so every date keeps one #daily-YYYY-MM-DD.
  const LATEST_COUNT = 3;
  const NEW_COUNT = 1;
  const days = groupByBroadcastDate(DAILY_STREAM_ENTRIES);
  let latestDayCount = 0;
  for (let shown = 0; latestDayCount < days.length && shown < LATEST_COUNT; latestDayCount++) shown += days[latestDayCount].entries.length;
  let newLeft = NEW_COUNT;
  function createDay(day, large) {
    const group = element("section", "daily-day" + (large ? " daily-day-latest" : ""));
    group.id = "daily-" + day.date;
    group.append(element("h4", "daily-day-title", dayFormat.format(new Date(day.date + "T12:00:00+09:00"))));
    const body = element("div", "daily-day-body");
    const dayCards = [];
    for (const entry of day.entries) {
      const { article, card } = createCard(entry, { large, isNew: large && newLeft-- > 0 });
      dayCards.push(card);
      body.append(article);
    }
    group.append(body);
    return { group, dayCards };
  }

  // Latest dates: large summary cards, loaded right away.
  const latest = element("div", "daily-latest");
  const latestCards = [];
  for (const day of days.slice(0, latestDayCount)) {
    const { group, dayCards } = createDay(day, true);
    latestCards.push(...dayCards);
    latest.append(group);
  }

  // Older dates: one collapsed block, loaded when visible.
  const past = element("details", "daily-past");
  past.id = "daily-past";
  const pastDayList = days.slice(latestDayCount);
  const pastEntryCount = pastDayList.reduce((sum, day) => sum + day.entries.length, 0);
  const pastSummary = element("summary", "daily-past-summary");
  pastSummary.append(element("span", "daily-past-title", "過去の回"), element("span", "daily-day-count", pastEntryCount + "枠 · タップで表示"));
  const pastBody = element("div", "daily-past-body");
  const pastDays = [];
  for (const day of pastDayList) {
    const found = createDay(day, false);
    pastBody.append(found.group);
    pastDays.push(found);
  }
  past.append(pastSummary, pastBody);
  host.append(latest, past);

  // Older dates load their saved aggregates only once "過去の回" is opened (same as the former per-date accordions).
  let pastLoaded = false;
  function watchPastDays() {
    if (pastLoaded) return;
    pastLoaded = true;
    pastDays.forEach(({ dayCards }) => void loadCards(dayCards));
  }
  past.addEventListener("toggle", () => { if (past.open) watchPastDays(); });

  for (const btn of metricButtons) {
    btn.addEventListener("click", () => {
      const next = btn.dataset.dailyMetric;
      if (!(next in METRICS)) return;
      metric = next;
      metricButtons.forEach((candidate) => {
        const active = candidate === btn;
        candidate.setAttribute("aria-pressed", String(active));
        candidate.classList.toggle("active", active);
      });
      cards.forEach((card) => {
        card.label.textContent = METRICS[metric] + "（最後の有効な画面参考値）";
        if (card.data !== undefined) renderCard(card);
      });
    });
  }
  // Use day anchors once enhanced cards exist; keep HTML fallback links usable without JS.
  document.querySelectorAll("#daily-fallback-links a").forEach((link) => {
    const entry = DAILY_STREAM_ENTRIES.find((candidate) => "#" + candidate.section === link.getAttribute("href"));
    if (entry) link.href = "#daily-" + entry.date;
  });
  // Shared day links (/data-lab/#daily-YYYY-MM-DD) keep working, including older days inside "過去の回".
  function openLinkedDay() {
    if (!location.hash.startsWith("#daily-")) return;
    const found = document.getElementById(location.hash.slice(1));
    if (!found || !host.contains(found)) return;
    if (past.contains(found) && !past.open) {
      past.open = true;
      watchPastDays();
    }
    found.scrollIntoView();
  }
  window.addEventListener("hashchange", openLinkedDay);
  openLinkedDay();
  void loadCards(latestCards);
}
