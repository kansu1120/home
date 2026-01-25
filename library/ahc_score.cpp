#include <stdint.h>
#include <limits.h>

extern "C" {
extern uint8_t __heap_base;
static uint32_t heap_ptr = 0;
// Missing penalty when input/output value pairs are not available.
// Adjust this value to align with the contest-specific scoring formula.
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

// Reads the next integer from data. Returns 1 if a number is read and stored in out.
// Non-numeric characters are skipped; returns 0 on end of input.
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
      int digit = c - '0';
      // Overflow check for value * 10 + digit against INT32_MAX.
      if (value > (INT32_MAX / 10) || (value == INT32_MAX / 10 && digit > (INT32_MAX % 10))) {
        value = INT32_MAX;
        while (i < size) {
          uint8_t skip = data[i];
          if (skip < '0' || skip > '9') break;
          ++i;
        }
        found = 1;
        break;
      }
      value = value * 10 + digit;
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
