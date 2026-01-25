(() => {
  const app = document.getElementById("ahc-score-app");
  if (!app) return;

  const inputZip = document.getElementById("ahc-input-zip");
  const outputZip = document.getElementById("ahc-output-zip");
  const runButton = document.getElementById("ahc-run");
  const status = document.getElementById("ahc-status");
  const summary = document.getElementById("ahc-summary");
  const results = document.getElementById("ahc-results");

  const wasmUrl = app.dataset.wasmUrl;
  const encoder = new TextEncoder();
  let wasmReady = null;

  const setStatus = (message, type = "info") => {
    status.textContent = message;
    status.dataset.status = type;
  };

  const formatScore = score => score.toString();

  const toNumberSafe = value => {
    if (typeof value !== "bigint") return Number(value);
    const limit = BigInt(Number.MAX_SAFE_INTEGER);
    if (value > limit) return Number.MAX_SAFE_INTEGER;
    if (value < -limit) return -Number.MAX_SAFE_INTEGER;
    return Number(value);
  };

  const ensureMemory = (memory, neededBytes) => {
    const pageSize = 65536;
    if (memory.buffer.byteLength >= neededBytes) return;
    const missing = neededBytes - memory.buffer.byteLength;
    const pages = Math.ceil(missing / pageSize);
    memory.grow(pages);
  };

  const readZip = async file => {
    if (!file) return new Map();
    const zip = await JSZip.loadAsync(file);
    const entries = [];
    zip.forEach((relativePath, entry) => {
      if (!entry.dir) entries.push(entry);
    });
    const map = new Map();
    for (const entry of entries) {
      const content = await entry.async("string");
      map.set(entry.name, content);
    }
    return map;
  };

  const loadWasm = async () => {
    if (wasmReady) return wasmReady;
    if (!wasmUrl) throw new Error("WebAssembly の URL が見つかりません。");
    wasmReady = (async () => {
      const memory = new WebAssembly.Memory({ initial: 4, maximum: 256 });
      const response = await fetch(wasmUrl);
      if (!response.ok) {
        throw new Error("WASM の読み込みに失敗しました。");
      }
      const bytes = await response.arrayBuffer();
      const { instance } = await WebAssembly.instantiate(bytes, { env: { memory } });
      return { instance, memory };
    })();
    return wasmReady;
  };

  const updateSummary = (stats, count) => {
    summary.classList.add("is-visible");
    summary.querySelector("[data-summary='total']").textContent = formatScore(stats.total);
    summary.querySelector("[data-summary='average']").textContent = formatScore(stats.average);
    summary.querySelector("[data-summary='best']").textContent = formatScore(stats.best);
    summary.querySelector("[data-summary='worst']").textContent = formatScore(stats.worst);
    summary.querySelector("[data-summary='cases']").textContent = `${count} 件`;
  };

  const renderResults = (rows, stats) => {
    results.innerHTML = "";
    if (!rows.length) {
      results.textContent = "読み込めるテストケースがありませんでした。";
      return;
    }

    const header = document.createElement("div");
    header.className = "ahc-row ahc-row-header";
    header.innerHTML = "<div>No</div><div>ケース</div><div>スコア</div><div>可視化</div>";
    results.appendChild(header);

    const range = stats.worst - stats.best;
    const rangeNumber = range === 0n ? 0 : toNumberSafe(range);

    rows.forEach((row, index) => {
      const rowEl = document.createElement("div");
      rowEl.className = "ahc-row";
      if (row.missing) rowEl.classList.add("is-missing");

      const bar = document.createElement("div");
      bar.className = "ahc-bar";
      const fill = document.createElement("div");
      fill.className = "ahc-bar-fill";

      const ratio = range === 0n ? 0 : toNumberSafe(row.score - stats.best) / rangeNumber;
      const inverted = Math.max(0, Math.min(1, 1 - ratio));
      fill.style.width = `${Math.round(10 + inverted * 90)}%`;
      fill.style.background = `hsl(${Math.round(120 * inverted)}, 70%, 45%)`;

      bar.appendChild(fill);

      const nameCell = document.createElement("div");
      nameCell.textContent = row.displayName;
      const scoreCell = document.createElement("div");
      scoreCell.textContent = formatScore(row.score);
      if (row.missing) {
        const tag = document.createElement("span");
        tag.className = "ahc-tag";
        tag.textContent = "出力なし";
        scoreCell.appendChild(tag);
      }

      rowEl.appendChild(document.createTextNode(String(index + 1)));
      rowEl.appendChild(nameCell);
      rowEl.appendChild(scoreCell);
      rowEl.appendChild(bar);
      results.appendChild(rowEl);
    });
  };

  runButton.addEventListener("click", async () => {
    if (!inputZip.files[0]) {
      setStatus("入力zipを選択してください。", "error");
      return;
    }

    runButton.disabled = true;
    setStatus("読み込み中...", "loading");

    try {
      const [inputMap, outputMap, wasm] = await Promise.all([
        readZip(inputZip.files[0]),
        readZip(outputZip.files[0]),
        loadWasm()
      ]);

      if (!inputMap.size) {
        setStatus("入力zipにファイルが見つかりませんでした。", "error");
        results.innerHTML = "";
        summary.classList.remove("is-visible");
        runButton.disabled = false;
        return;
      }

      const outputBaseMap = new Map();
      for (const [name, content] of outputMap.entries()) {
        const base = name.split("/").pop();
        if (!outputBaseMap.has(base)) outputBaseMap.set(base, content);
      }

      const rows = [];
      const entries = Array.from(inputMap.entries()).sort((a, b) => a[0].localeCompare(b[0]));
      const { instance, memory } = await wasm;
      const { alloc, reset_alloc, score } = instance.exports;

      for (const [name, inputText] of entries) {
        const baseName = name.split("/").pop();
        const outputText = outputMap.get(name) ?? outputBaseMap.get(baseName) ?? "";
        const missing = !outputMap.has(name) && !outputBaseMap.has(baseName);

        const inputBytes = encoder.encode(inputText);
        const outputBytes = encoder.encode(outputText);
        const required = inputBytes.length + outputBytes.length + 128;
        ensureMemory(memory, required);
        reset_alloc();
        const inputPtr = alloc(inputBytes.length);
        const outputPtr = alloc(outputBytes.length);
        const memoryView = new Uint8Array(memory.buffer);
        memoryView.set(inputBytes, inputPtr);
        memoryView.set(outputBytes, outputPtr);
        const scoreValue = score(inputPtr, inputBytes.length, outputPtr, outputBytes.length);

        rows.push({
          displayName: baseName,
          score: scoreValue,
          missing
        });
      }

      let total = 0n;
      let best = rows[0].score;
      let worst = rows[0].score;
      for (const row of rows) {
        total += row.score;
        if (row.score < best) best = row.score;
        if (row.score > worst) worst = row.score;
      }
      const average = total / BigInt(rows.length);

      updateSummary({ total, average, best, worst }, rows.length);
      renderResults(rows, { best, worst });
      setStatus(`計算完了: ${rows.length} 件`, "success");
    } catch (error) {
      console.error("AHC score error:", error);
      setStatus("エラーが発生しました。入力zipやWASMを確認してください。", "error");
      summary.classList.remove("is-visible");
      results.innerHTML = "";
    } finally {
      runButton.disabled = false;
    }
  });
})();
