(() => {
  "use strict";

  const $ = id => document.getElementById(id);
  const escape = value => String(value).replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));
  const rate = value => Number.isFinite(value) ? value.toFixed(2) : "未取得";
  const decimal = new Intl.NumberFormat("ja-JP");
  const slots = { morning: "朝", noon: "昼", night: "夜" };
  const phases = { fourth_round: "四次審査期間", after_fourth_round: "四次審査終了後" };
  const knownAnchors = {
    "2026-10-16-night": "night-20261016",
    "2026-10-16-morning": "morning-20261016",
    "2026-10-15-night": "night-20261015",
    "2026-10-15-morning": "morning-20261015",
    "2026-10-14-noon": "noon-20261014",
    "2026-10-14-morning": "morning-20261014",
    "2026-10-12-night": "final-night"
  };
  const sessionName = session => `${session.date_jst.slice(5).replace("-", "/")} ${slots[session.slot] || session.slot}`;
  const clock = iso => String(iso).slice(11,16);
  const validWindow = item => item && Number.isFinite(item.per_minute) && Number.isFinite(item.duration_seconds) &&
    item.duration_seconds > 0 && Number.isFinite(item.added_comments) && item.added_comments >= 0;

  let all = [], currentPhase = "after_fourth_round", selectedId = 23562541;

  function normalize(history, latest) {
    if (history.schema !== 1 || !Array.isArray(history.sessions) || latest.live_id !== 23562541 ||
      !latest.comment_velocity || !Array.isArray(latest.comment_velocity.windows)) {
      throw new Error("Unexpected comment velocity schema");
    }
    const sessions = history.sessions.map(item => ({ ...item, observed_windows: item.observed_windows || [] }));
    const current = latest.comment_velocity;
    const points = latest.five_minute_window_endpoints || [];
    sessions.push({
      live_id: latest.live_id,
      date_jst: latest.date_jst,
      slot: "night",
      phase: "after_fourth_round",
      stored_rows: latest.data_quality.online_counter_timeline_rows,
      valid_rows: latest.data_quality.valid_online_observations,
      observed_span: { ...current.overall },
      observed_windows: current.windows.map((window, i) => ({
        ...window,
        from_elapsed_seconds: points[i]?.elapsed_seconds ?? (i + 1) * 300,
        to_elapsed_seconds: points[i+1]?.elapsed_seconds ?? (i + 2) * 300
      }))
    });
    return sessions.filter(s => Number.isFinite(s.live_id) && s.date_jst && Object.hasOwn(phases, s.phase) &&
      Array.isArray(s.observed_windows) && s.observed_windows.some(validWindow))
      .sort((a,b) => b.date_jst.localeCompare(a.date_jst) ||
        (["morning","noon","night"].indexOf(b.slot) - ["morning","noon","night"].indexOf(a.slot)));
  }

  function filtered() {
    return currentPhase === "all" ? all : all.filter(s => s.phase === currentPhase);
  }

  function renderPicks() {
    const picked = filtered();
    if (!picked.some(s => s.live_id === selectedId)) selectedId = picked[0]?.live_id;
    $("velocity-run-picks").innerHTML = picked.map(s => {
      const pressed = s.live_id === selectedId;
      const count = s.observed_windows.filter(validWindow).length;
      return `<button type="button" data-velocity-id="${s.live_id}" aria-pressed="${pressed}">
        <span class="run-title">${escape(sessionName(s))}</span>
        <span class="run-detail">${count}区間・観測平均 ${rate(s.observed_span.per_minute)}件/分</span>
      </button>`;
    }).join("");
    $("velocity-run-picks").querySelectorAll("button").forEach(button => {
      button.addEventListener("click", () => {
        selectedId = Number(button.dataset.velocityId);
        renderPicks();
        renderSelected();
      });
    });
  }

  function renderChart(session) {
    const windows = session.observed_windows.filter(validWindow);
    const max = Math.max(...windows.map(w => w.per_minute), session.observed_span.per_minute);
    const ceil = Math.max(12, Math.ceil((max + 1) / 4) * 4);
    const pxPerFive = 43;
    const left = 74, baseline = 233, top = 27;
    const lastStart = Math.max(...windows.map(w => Number(w.from_elapsed_seconds) || 0));
    const chartWidth = Math.max(760, left + (lastStart/300 + 2) * pxPerFive + 45);
    const y = v => baseline - (baseline-top)*v/ceil;
    const topRate = Math.max(...windows.map(w => w.per_minute));
    const axis = Array.from({length:5}, (_,i)=>{
      const value = ceil*i/4;
      const yPos = y(value).toFixed(1);
      return `<line x1="${left-5}" y1="${yPos}" x2="${chartWidth-17}" y2="${yPos}" stroke="#476879" stroke-dasharray="4 6"/><text x="18" y="${(+yPos+4).toFixed(1)}">${value.toFixed(0)}</text>`;
    }).join("");
    const bars = windows.map((w, i) => {
      const min = (Number(w.from_elapsed_seconds) || (i+1)*300) / 60;
      const x = left + (min / 5 - 1) * pxPerFive;
      const h = Math.max(1, baseline-y(w.per_minute));
      const isPeak = w.per_minute === topRate;
      const classname = isPeak ? "velocity-bar-peak" : session.phase === "fourth_round" ? "velocity-bar-fourth" : "velocity-bar-regular";
      const displayTick = i===0 || i===windows.length-1 || i%2===0;
      return `<rect class="${classname}" x="${x.toFixed(1)}" y="${y(w.per_minute).toFixed(1)}" width="30" height="${h.toFixed(1)}" rx="4"><title>${escape(clock(w.from))}〜${escape(clock(w.to))}　${w.added_comments}件増／${w.duration_seconds}秒・分速${rate(w.per_minute)}件</title></rect>
        <text x="${(x+15).toFixed(1)}" y="${(y(w.per_minute)-7).toFixed(1)}" text-anchor="middle">${rate(w.per_minute)}</text>
        ${displayTick ? `<text x="${(x+15).toFixed(1)}" y="256" text-anchor="middle">${escape(clock(w.from))}</text>` : ""}`;
    }).join("");
    const svg = $("velocity-chart");
    svg.setAttribute("viewBox", `0 0 ${Math.ceil(chartWidth)} 285`);
    svg.setAttribute("aria-label", `${sessionName(session)}の保存区間、${windows.length}本の時間帯別平均コメント分速の棒グラフ。各値は下の表でも読めます。`);
    svg.style.width = `${Math.ceil(chartWidth)}px`;
    svg.innerHTML = `<title>${escape(sessionName(session))}　観測コメント分速</title><desc>横軸は観測された時間帯、縦軸は区間平均コメント件数／分。欠測区間は描画していません。</desc>${axis}${bars}<text x="${chartWidth-19}" y="278" text-anchor="end">観測時刻（日本時間）</text>`;
  }

  function renderSelected() {
    const session = all.find(s => s.live_id === selectedId);
    const panel = $("velocity-panel");
    if (!session) { panel.hidden = true; return; }
    panel.hidden = false;
    $("velocity-selected-phase").textContent = phases[session.phase];
    $("velocity-selected-label").textContent = `${sessionName(session)}のコメントの流れ`;
    $("velocity-source-note").textContent = `配信ID ${session.live_id}／有効オンライン観測 ${session.valid_rows}件（保存記録 ${session.stored_rows}件中）。集計できた区間のみ表示します。`;
    $("velocity-mean").textContent = rate(session.observed_span.per_minute);
    const max = Math.max(...session.observed_windows.map(w=>w.per_minute));
    $("velocity-max").textContent = rate(max);
    $("velocity-count").textContent = decimal.format(session.observed_windows.length);
    const link = $("velocity-original-link");
    link.href = knownAnchors[`${session.date_jst}-${session.slot}`]
      ? `/data-lab/#${knownAnchors[`${session.date_jst}-${session.slot}`]}`
      : "/data-lab/";
    link.textContent = knownAnchors[`${session.date_jst}-${session.slot}`] ? "この日の記録 ↗" : "データラボへ ↗";
    renderChart(session);
    $("velocity-table-body").innerHTML = session.observed_windows.map(w =>
      `<tr><th scope="row">${escape(clock(w.from))}〜${escape(clock(w.to))}</th>
        <td>${decimal.format(w.duration_seconds)}秒</td><td>＋${decimal.format(w.added_comments)}件</td>
        <td>${rate(w.per_minute)}件/分</td></tr>`).join("");
    const extra = session.live_id===23562541
      ? "最後の12秒の観測差は短いため時間帯の棒から除外し、観測幅の平均には含めています。"
      : "";
    const boundary = session.date_jst==="2026-10-12" && session.slot==="night"
      ? "この夜の配信は四次審査終了時刻をまたぐため、全区間が審査中とは限りません。" : "";
    $("velocity-chart-note").textContent = `観測範囲：${clock(session.observed_span.from||session.observed_first?.at_jst)}〜${clock(session.observed_span.to||session.observed_last?.at_jst)}。約5分ごとの保存区間を使用し、記録できない部分は空白のままです。最高値は保存区間の最大平均であり、全配信の瞬間最高ではありません。 ${extra} ${boundary}`;
  }

  function renderArchive(history) {
    const missing = history.unavailable || [];
    const rows = all.map(s => `<tr>
      <th scope="row"><button class="velocity-pick-link" type="button" data-archive-id="${s.live_id}">${escape(sessionName(s))}</button></th>
      <td>${escape(phases[s.phase])}</td><td>${s.observed_windows.length}区間</td>
      <td>${rate(s.observed_span.per_minute)}件/分</td><td>途中の画面観測</td></tr>`);
    for (const item of missing) {
      const label = `${item.date_jst.slice(5).replace("-","/")} ${slots[item.slot]||item.slot}`;
      rows.push(`<tr><th scope="row">${escape(label)}</th><td>${item.date_jst < "2026-10-13" ? "四次審査期間" : "四次審査終了後"}</td><td class="velocity-missing">比較不可</td><td>未取得</td><td class="velocity-missing">観測不足</td></tr>`);
    }
    $("velocity-archive-body").innerHTML = rows.join("");
    $("velocity-archive-body").querySelectorAll("button[data-archive-id]").forEach(button=>{
      button.addEventListener("click",()=>{
        selectedId=Number(button.dataset.archiveId);
        const s=all.find(item=>item.live_id===selectedId);
        currentPhase=s?.phase||"all";
        updateFilterButtons();
        renderPicks();
        renderSelected();
        $("velocity-explorer").scrollIntoView({behavior:"smooth",block:"start"});
      });
    });
  }

  function updateFilterButtons() {
    document.querySelectorAll("[data-velocity-phase]").forEach(b=>{
      b.setAttribute("aria-pressed",String(b.dataset.velocityPhase===currentPhase));
    });
  }

  async function initialize() {
    try {
      const paths = [
        "/data-lab/data/mily-comment-velocity-history-20261010-16.json",
        "/data-lab/data/mily-night-20261016-aggregate.json"
      ];
      const responses = await Promise.all(paths.map(u=>fetch(u,{cache:"no-store"})));
      if (responses.some(r=>!r.ok)) throw new Error("Missing analysis source");
      const [history,latest] = await Promise.all(responses.map(r=>r.json()));
      all = normalize(history,latest);
      if (all.length < 10) throw new Error("Insufficient verified sessions");
      document.querySelectorAll("[data-velocity-phase]").forEach(button=>{
        button.addEventListener("click",()=>{
          currentPhase=button.dataset.velocityPhase;
          updateFilterButtons();
          renderPicks();
          renderSelected();
        });
      });
      updateFilterButtons();
      renderPicks();
      renderSelected();
      renderArchive(history);
      $("velocity-loading").hidden = true;
    } catch {
      $("velocity-loading").textContent = "データを読み込めませんでした。確認できない値を推測して表示することはありません。";
      $("velocity-panel").hidden = true;
    }
  }

  initialize();
})();
