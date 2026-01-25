// 簡易スコアラー実装（WebAssemblyシミュレーション）
// 実際の環境では、Emscriptenでコンパイルされたscorer.wasmを使用します

function createScorerModule() {
    return new Promise((resolve) => {
        const module = {
            // メモリを管理するための簡易実装
            _malloc: function(size) {
                // 簡易的なメモリアドレスシミュレーション
                return this._memoryOffset = (this._memoryOffset || 1000) + size;
            },
            _free: function(ptr) {
                // メモリ解放（この実装では何もしない）
            },
            
            // 文字列をメモリに書き込む
            stringToUTF8: function(str, ptr, maxBytesToWrite) {
                const encoded = new TextEncoder().encode(str);
                this._memory = this._memory || {};
                this._memory[ptr] = encoded;
                return encoded.length;
            },
            
            // メモリから文字列を読み取る
            UTF8ToString: function(ptr) {
                const data = this._memory[ptr];
                if (!data) return '';
                return new TextDecoder().decode(data);
            },
            
            // スコア計算関数（C++の実装をJSで再現）
            _computeScore: function(dataPtr, dataLength) {
                try {
                    const data = this._memory[dataPtr];
                    const content = new TextDecoder().decode(data);
                    
                    // テストケースを解析
                    const testcases = this.parseTestCases(content);
                    
                    // スコア計算
                    return this.calculateScore(testcases);
                } catch (e) {
                    console.error('Score calculation error:', e);
                    return 0.0;
                }
            },
            
            parseTestCases: function(content) {
                const testcases = [];
                const lines = content.split('\n');
                let tc = { input: '', expected_output: '', user_output: '' };
                let state = -1; // -1: none, 0: input, 1: expected, 2: output
                
                for (const line of lines) {
                    if (line.startsWith('INPUT:')) {
                        if (state >= 0) {
                            testcases.push(tc);
                            tc = { input: '', expected_output: '', user_output: '' };
                        }
                        state = 0;
                    } else if (line.startsWith('EXPECTED:')) {
                        state = 1;
                    } else if (line.startsWith('OUTPUT:')) {
                        state = 2;
                    } else {
                        if (state === 0) tc.input += line + '\n';
                        else if (state === 1) tc.expected_output += line + '\n';
                        else if (state === 2) tc.user_output += line + '\n';
                    }
                }
                
                if (state >= 0 && tc.input) {
                    testcases.push(tc);
                }
                
                return testcases;
            },
            
            calculateScore: function(testcases) {
                if (testcases.length === 0) return 0.0;
                
                let correct = 0;
                for (const tc of testcases) {
                    const expected = tc.expected_output.trim();
                    const output = tc.user_output.trim();
                    
                    if (expected === output) {
                        correct++;
                    }
                }
                
                return (correct / testcases.length) * 100.0;
            },
            
            // C++関数のラッパー
            ccall: function(funcName, returnType, argTypes, args) {
                if (funcName === 'computeScore') {
                    const [data, length] = args;
                    return this._computeScore(data, length);
                } else if (funcName === 'getContestInfo') {
                    return 'Example Contest - Simple Test Case Scorer';
                }
                return null;
            },
            
            cwrap: function(funcName, returnType, argTypes) {
                const self = this;
                return function(...args) {
                    return self.ccall(funcName, returnType, argTypes, args);
                };
            }
        };
        
        resolve(module);
    });
}

// CommonJS/AMD対応
if (typeof module !== 'undefined' && module.exports) {
    module.exports = createScorerModule;
}
