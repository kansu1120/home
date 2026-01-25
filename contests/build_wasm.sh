#!/bin/bash
# WebAssembly コンパイルスクリプト
# Emscripten が必要です: https://emscripten.org/

CONTEST_NAME=$1

if [ -z "$CONTEST_NAME" ]; then
    echo "使用法: $0 <コンテスト名>"
    echo "例: $0 example"
    exit 1
fi

CONTEST_DIR="contests/$CONTEST_NAME"

if [ ! -f "$CONTEST_DIR/scorer.cpp" ]; then
    echo "エラー: $CONTEST_DIR/scorer.cpp が見つかりません"
    exit 1
fi

echo "コンパイル中: $CONTEST_NAME"

# Emscriptenでコンパイル
emcc "$CONTEST_DIR/scorer.cpp" \
    -o "$CONTEST_DIR/scorer.js" \
    -s WASM=1 \
    -s EXPORTED_RUNTIME_METHODS='["ccall","cwrap"]' \
    -s ALLOW_MEMORY_GROWTH=1 \
    -s MODULARIZE=1 \
    -s EXPORT_NAME="createScorerModule" \
    -O3

if [ $? -eq 0 ]; then
    echo "コンパイル成功: $CONTEST_DIR/scorer.js と $CONTEST_DIR/scorer.wasm が生成されました"
else
    echo "コンパイルエラー"
    exit 1
fi
