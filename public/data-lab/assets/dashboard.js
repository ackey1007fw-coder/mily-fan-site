const DATA_URL = "/data-lab/data/mily-dashboard.json";

const $ = (id) => document.getElementById(id);
const fmt = (n) => (typeof n === "number" ? n.toLocaleString("ja-JP") : "未取得");
const dateLabel = (iso) => {
  if (!iso) return "未取得";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("ja-JP", {
    timeZone: "Asia/Tokyo",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

function el(tag, text, className) {
  const node = document.createElement(tag);
  if (text != null) node.textContent = text;
  if (className) node.className = className;
  return node;
}

function renderProfile(data) {
  const p = data.profile ?? {};
  $("followers").textContent = fmt(p.followers);
  $("followers-source").textContent =
    `SHOWROOM公式プロフィールAPIの実測（${p.observedDateJst ?? "観測日未記録"}）。常時更新ではありません。`;
  $("show-rank").textContent = p.showRank ?? "未取得";
  $("streak").textContent = fmt(p.liveContinuousDays);
  const ls = p.lastStream ?? {};
  $("last-stream").textContent = ls.dateJst
    ? `${ls.dateJst.replaceAll("-", "/")} ${ls.sessionLabel ?? ""}の配信`
    : "未取得";
  $("last-stream-note").textContent = ls.note ?? "";
  $("status").textContent =
    `記録の最終更新：${data.updatedDateJst ?? "未記録"}（日本時間）。数値は観測時点のスナップショットです。`;
}

function renderFollowersChart(history) {
  const wrap = $("followers-chart");
  wrap.replaceChildren();
  if (!Array.isArray(history) || history.length === 0) {
    wrap.append(el("p", "フォロワー推移の記録はまだありません。", "fine"));
    return;
  }
  const W = 720;
  const H = 220;
  const PAD = { l: 56, r: 20, t: 18, b: 34 };
  const values = history.map((h) => h.followers);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = Math.max(10, max - min);
  const lo = Math.max(0, min - span * 0.25);
  const hi = max + span * 0.25;
  const x = (i) =>
    history.length === 1
      ? (PAD.l + (W - PAD.r)) / 2
      : PAD.l + (i * (W - PAD.l - PAD.r)) / (history.length - 1);
  const y = (v) => PAD.t + (1 - (v - lo) / (hi - lo)) * (H - PAD.t - PAD.b);
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.setAttribute("role", "img");
  const desc = history
    .map((h) => `${h.dateJst} ${fmt(h.followers)}人`)
    .join("、");
  svg.setAttribute("aria-label", `フォロワー推移の観測点：${desc}`);
  const axis = document.createElementNS("http://www.w3.org/2000/svg", "line");
  axis.setAttribute("x1", PAD.l);
  axis.setAttribute("x2", W - PAD.r);
  axis.setAttribute("y1", H - PAD.b);
  axis.setAttribute("y2", H - PAD.b);
  axis.setAttribute("stroke", "#63828c");
  svg.append(axis);
  if (history.length > 1) {
    const poly = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "polyline",
    );
    poly.setAttribute(
      "points",
      history.map((h, i) => `${x(i)},${y(h.followers)}`).join(" "),
    );
    poly.setAttribute("fill", "none");
    poly.setAttribute("stroke", "#ffe19a");
    poly.setAttribute("stroke-width", "2");
    svg.append(poly);
  }
  history.forEach((h, i) => {
    const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    c.setAttribute("cx", x(i));
    c.setAttribute("cy", y(h.followers));
    c.setAttribute("r", "5");
    c.setAttribute("fill", "#ffe19a");
    const t = document.createElementNS("http://www.w3.org/2000/svg", "title");
    t.textContent = `${h.dateJst}：${fmt(h.followers)}人`;
    c.append(t);
    svg.append(c);
    const label = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text",
    );
    label.setAttribute("x", x(i));
    label.setAttribute("y", y(h.followers) - 12);
    label.setAttribute("text-anchor", "middle");
    label.setAttribute("fill", "#f5f4eb");
    label.setAttribute("font-size", "13");
    label.textContent = fmt(h.followers);
    svg.append(label);
    const dlabel = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text",
    );
    dlabel.setAttribute("x", x(i));
    dlabel.setAttribute("y", H - 10);
    dlabel.setAttribute("text-anchor", "middle");
    dlabel.setAttribute("fill", "#b8c9d1");
    dlabel.setAttribute("font-size", "11");
    dlabel.textContent = h.dateJst.slice(5).replace("-", "/");
    svg.append(dlabel);
  });
  wrap.append(svg);
  if (history.length === 1) {
    wrap.append(
      el(
        "p",
        "観測は1点から始まります。日々のスナップショットが増えると、ここに推移が描かれます。",
        "fine",
      ),
    );
  }
}

function renderFollowersTable(history) {
  const tbody = document.querySelector("#followers-table tbody");
  tbody.replaceChildren();
  [...history].reverse().forEach((h, idx, arr) => {
    const tr = document.createElement("tr");
    tr.append(el("th", h.dateJst));
    tr.append(el("td", fmt(h.followers)));
    const prev = arr[idx + 1];
    const diff =
      prev && typeof h.followers === "number" && typeof prev.followers === "number"
        ? `${h.followers - prev.followers >= 0 ? "+" : ""}${fmt(h.followers - prev.followers)}`
        : "—";
    tr.append(el("td", diff));
    tr.append(el("td", h.source ?? ""));
    tbody.append(tr);
  });
}

function renderEvent(ev) {
  if (!ev) return;
  $("event-heading").textContent = ev.name ?? "参加中イベント";
  const period = ev.periodJst ?? {};
  $("event-period").textContent =
    `開催期間（日本時間）：${dateLabel(period.start)} 〜 ${dateLabel(period.end)}`;
  const snaps = [...(ev.snapshots ?? [])].sort((a, b) =>
    a.atJst < b.atJst ? -1 : 1,
  );
  const latest = snaps[snaps.length - 1];
  $("event-latest").textContent = latest
    ? `${fmt(latest.rank)}位 ・ ${fmt(latest.point)}pt（${dateLabel(latest.atJst)}観測）`
    : "未取得";
  $("event-note").textContent = ev.note ?? "";
  if (ev.url) $("event-link").href = ev.url;
  const tbody = document.querySelector("#event-table tbody");
  tbody.replaceChildren();
  [...snaps].reverse().forEach((s) => {
    const tr = document.createElement("tr");
    tr.append(el("th", dateLabel(s.atJst)));
    tr.append(el("td", typeof s.rank === "number" ? `${fmt(s.rank)}位` : "未取得"));
    tr.append(el("td", fmt(s.point)));
    tr.append(el("td", s.source ?? ""));
    tbody.append(tr);
  });
}

function renderStreams(data) {
  const tbody = document.querySelector("#streams-table tbody");
  tbody.replaceChildren();
  for (const s of data.streams ?? []) {
    const tr = document.createElement("tr");
    tr.append(el("th", s.dateJst ?? ""));
    tr.append(el("td", s.label ?? ""));
    for (const key of ["stars", "visits", "comments"]) {
      const td = el("td", fmt(s[key]));
      if (typeof s[key] !== "number") td.className = "missing";
      tr.append(td);
    }
    tbody.append(tr);
  }
  $("streams-note").textContent = data.streamsNote ?? "";
}

function renderSongs(songs) {
  if (songs?.status === "preparing") {
    $("songs-note").textContent = songs.note ?? "";
  } else if (songs?.note) {
    $("songs-note").textContent = songs.note;
  }
}

async function main() {
  try {
    const res = await fetch(DATA_URL, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    renderProfile(data);
    renderFollowersChart(data.followersHistory ?? []);
    renderFollowersTable(data.followersHistory ?? []);
    renderEvent(data.currentEvent);
    renderStreams(data);
    renderSongs(data.songs);
  } catch {
    $("status").textContent =
      "記録データを読み込めませんでした。元データは公開JSONから直接確認できます。";
  }
}

main();
