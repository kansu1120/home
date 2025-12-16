#N進数変換

f(n,N)　で任意の10進数n をN進数に変換できる

```cpp

string f(int n,int N){
    string ans = "";
    while (n) {
        ans.push_back('0' + n % N);
        n /= N;
    }
    reverse(ans.begin(),ans.end());
    return ans;
}
```
 
