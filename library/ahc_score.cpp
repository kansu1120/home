#include <stdint.h>

extern "C" {
extern uint8_t __heap_base;
static uint32_t heap_ptr = 0;
// 入力・出力の数値ペアが欠けている場合のペナルティ。
constexpr int64_t kMissingPenalty = 1000;

uint32_t alloc(uint32_t size) {
  if (!heap_ptr) {
    heap_ptr = reinterpret_cast<uint32_t>(&__heap_base);
  }
  uint32_t ptr = heap_ptr;
  heap_ptr = (heap_ptr + size + 7u) & ~7u;
  return ptr;
}

void reset_alloc() {
  heap_ptr = reinterpret_cast<uint32_t>(&__heap_base);
}

// data 内の数値を読み取る。数字が読めたら 1 を返し、out に値を入れる。
// 非数字はスキップし、終端に達したら 0 を返す。
static int read_int(const uint8_t* data, int32_t size, int32_t* index, int32_t* out) {
  int32_t i = *index;
  while (i < size) {
    while (i < size) {
      uint8_t c = data[i];
      if (c == '-' || (c >= '0' && c <= '9')) break;
      ++i;
    }
    if (i >= size) {
      *index = i;
      return 0;
    }
    int sign = 1;
    if (data[i] == '-') {
      sign = -1;
      ++i;
    }
    int32_t value = 0;
    int found = 0;
    while (i < size) {
      uint8_t c = data[i];
      if (c < '0' || c > '9') break;
      value = value * 10 + (c - '0');
      found = 1;
      ++i;
    }
    if (found) {
      *index = i;
      *out = value * sign;
      return 1;
    }
  }
  *index = i;
  return 0;
}

int64_t score(const uint8_t* input, int32_t input_size, const uint8_t* output, int32_t output_size) {
  int32_t in_idx = 0;
  int32_t out_idx = 0;
  int32_t in_val = 0;
  int32_t out_val = 0;
  int64_t total = 0;

  int in_ok = read_int(input, input_size, &in_idx, &in_val);
  int out_ok = read_int(output, output_size, &out_idx, &out_val);

  while (in_ok && out_ok) {
    int64_t diff = static_cast<int64_t>(in_val) - static_cast<int64_t>(out_val);
    if (diff < 0) diff = -diff;
    total += diff;
    in_ok = read_int(input, input_size, &in_idx, &in_val);
    out_ok = read_int(output, output_size, &out_idx, &out_val);
  }

  while (in_ok) {
    total += kMissingPenalty;
    in_ok = read_int(input, input_size, &in_idx, &in_val);
  }
  while (out_ok) {
    total += kMissingPenalty;
    out_ok = read_int(output, output_size, &out_idx, &out_val);
  }

  return total;
}
}
