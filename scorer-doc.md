# WebAssembly採点システム

このシステムは、競技プログラミングコンテストのテストケースを自動採点するためのブラウザベースのツールです。

## 📖 概要

- **ブラウザで動作**: インストール不要、WebAssemblyを使用してC++で書かれた採点プログラムをブラウザで実行
- **オフライン対応**: すべての処理がクライアント側で完結
- **セキュア**: テストデータはサーバーに送信されません
- **高速**: WebAssemblyによる高速な採点処理

## 🚀 使い方

1. [採点システムページ](scorer.html)にアクセス
2. 採点したいコンテストを選択
3. テストケースを含むZIPまたはテキストファイルをアップロード
4. 「採点開始」ボタンをクリック
5. スコアが表示されます

## 📁 テストデータの形式

テストデータは以下の形式で作成してください：

```
INPUT:
(入力データ)
EXPECTED:
(期待される出力)
OUTPUT:
(実際の出力)

INPUT:
(次のテストケースの入力)
EXPECTED:
(期待される出力)
OUTPUT:
(実際の出力)
```

### 例

```
INPUT:
5
EXPECTED:
5
OUTPUT:
5

INPUT:
10
EXPECTED:
10
OUTPUT:
9
```

この例では、2つのテストケースがあり、1つ目は正解、2つ目は不正解です。
スコアは 50.00 点（1/2 × 100）となります。

## 🔧 技術詳細

### アーキテクチャ

```
[ユーザー] → [ブラウザ]
              ↓
         [scorer.html]
              ↓
    [WebAssembly Module]
    (C++採点プログラム)
              ↓
         [スコア表示]
```

### コンテストの追加方法

新しいコンテストを追加するには：

1. `/contests/` ディレクトリに新しいコンテスト用のフォルダを作成
2. `scorer.cpp` を作成（採点ロジックを実装）
3. Emscriptenでコンパイル：
   ```bash
   cd contests
   ./build_wasm.sh your_contest_name
   ```
4. `scorer.html` にコンテストを追加

詳細は [contests/README.md](contests/README.md) を参照してください。

## 🛠️ 開発

### 必要なツール

- [Emscripten](https://emscripten.org/) - C++からWebAssemblyへのコンパイラ

### Emscriptenのインストール

```bash
git clone https://github.com/emscripten-core/emsdk.git
cd emsdk
./emsdk install latest
./emsdk activate latest
source ./emsdk_env.sh
```

### WebAssemblyのビルド

```bash
cd contests
./build_wasm.sh example
```

## 🎯 サンプルコンテスト

「サンプルコンテスト」では、シンプルな正解率ベースの採点を行います。

[サンプルテストデータ](contests/example/sample_test.txt)をダウンロードして試すことができます。

## 📚 参考資料

- [Emscripten Documentation](https://emscripten.org/docs/)
- [WebAssembly](https://webassembly.org/)

## ⚠️ 制限事項

- 現在のバージョンでは、ZIPファイルの解凍はサポートしていません（テキストファイルのみ）
- 大きなファイル（>10MB）の処理には時間がかかる場合があります
- ブラウザのメモリ制限により、非常に大きなテストケースは処理できない場合があります

## 📝 ライセンス

このプロジェクトは、競技プログラミングの学習を支援するために作成されました。
