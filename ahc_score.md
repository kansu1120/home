---
layout: default
---

# AHC スコア計算

AtCoder Heuristic Contest のテストケース zip と出力 zip を読み込み、ブラウザ上でスコアを計算します。

<div id="ahc-score-app" class="ahc-score-app" data-wasm-url="{{ '/library/ahc_score.wasm' | relative_url }}">
  <div class="ahc-panel">
    <h2>1. zip を選択</h2>
    <label class="ahc-file">
      <span>入力テストケース (.zip)</span>
      <input type="file" id="ahc-input-zip" accept=".zip" />
    </label>
    <label class="ahc-file">
      <span>出力結果 (.zip)</span>
      <input type="file" id="ahc-output-zip" accept=".zip" />
      <small>出力 zip は任意です。入力ファイル名と一致するものを探します。</small>
    </label>
    <button id="ahc-run" class="ahc-button">スコア計算</button>
    <p id="ahc-status" class="ahc-status" data-status="idle">zip を読み込んでください。</p>
  </div>

  <div id="ahc-summary" class="ahc-summary">
    <div>
      <span class="ahc-summary-label">合計</span>
      <span class="ahc-summary-value" data-summary="total">-</span>
    </div>
    <div>
      <span class="ahc-summary-label">平均</span>
      <span class="ahc-summary-value" data-summary="average">-</span>
    </div>
    <div>
      <span class="ahc-summary-label">ベスト</span>
      <span class="ahc-summary-value" data-summary="best">-</span>
    </div>
    <div>
      <span class="ahc-summary-label">ワースト</span>
      <span class="ahc-summary-value" data-summary="worst">-</span>
    </div>
    <div>
      <span class="ahc-summary-label">ケース数</span>
      <span class="ahc-summary-value" data-summary="cases">-</span>
    </div>
  </div>

  <div class="ahc-results" id="ahc-results"></div>
</div>

---

## 使い方

1. AtCoder から配布されるテストケース zip を選択します。
2. 手元の出力 zip を選択します（パス一致がなければファイル名のみで照合します）。
3. 「スコア計算」を押すと各ケースのスコアが一覧表示されます。

> 現在のスコアは「入力・出力の数値の差の合計 + 欠損データ 1000 点ペナルティ」の簡易スコアです（`library/ahc_score.cpp` の `kMissingPenalty` で変更できます）。
> AHC 本番のスコアロジックは `library/ahc_score.cpp` を編集してください。

<script src="{{ '/library/jszip.min.js' | relative_url }}"></script>
<script src="{{ '/library/ahc_score.js' | relative_url }}"></script>
