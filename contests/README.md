# コンテスト採点システム

このディレクトリには、WebAssemblyベースの採点システムのコンテスト固有のコードが含まれています。

## ディレクトリ構造

```
contests/
├── build_wasm.sh          # WebAssemblyコンパイルスクリプト
├── example/               # サンプルコンテスト
│   ├── scorer.cpp         # C++採点プログラム
│   ├── scorer.js          # コンパイル済みJSラッパー
│   └── scorer.wasm        # コンパイル済みWebAssembly
└── README.md              # このファイル
```

## 新しいコンテストの追加方法

1. 新しいディレクトリを作成します：
   ```bash
   mkdir contests/your_contest_name
   ```

2. `scorer.cpp` を作成します：
   - `computeScore(const char* testData, int dataLength)` 関数を実装
   - テストケースデータを解析してスコアを計算
   - `extern "C"` と `EMSCRIPTEN_KEEPALIVE` を使用してエクスポート

3. WebAssemblyにコンパイルします：
   ```bash
   ./contests/build_wasm.sh your_contest_name
   ```

## コンパイル要件

WebAssemblyにコンパイルするには、Emscriptenが必要です：

```bash
# Emscriptenのインストール
git clone https://github.com/emscripten-core/emsdk.git
cd emsdk
./emsdk install latest
./emsdk activate latest
source ./emsdk_env.sh
```

## scorer.cpp の実装ガイドライン

採点プログラムは以下の関数をエクスポートする必要があります：

```cpp
extern "C" {
    EMSCRIPTEN_KEEPALIVE
    double computeScore(const char* testData, int dataLength) {
        // テストデータを解析
        // スコアを計算
        // 0-100の範囲でスコアを返す
    }
}
```

### テストデータ形式

テストデータは、ユーザーがアップロードしたZIPファイルの内容です。
形式はコンテストごとに自由に定義できます。

### 戻り値

- スコアは `double` 型で返します
- 一般的には 0-100 の範囲を推奨
- エラーの場合は負の値を返すことも可能

## GitHub Pagesでの使用

コンパイルされた `scorer.js` と `scorer.wasm` ファイルは、
自動的に GitHub Pages で提供されます。

メインの採点ページは `/scorer.html` にあり、
コンテストを選択してZIPファイルをアップロードできます。
