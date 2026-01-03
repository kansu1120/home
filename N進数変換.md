[home](README.md)

# N進数変換



# 10~N
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


# N~10

f(s,n) で任意のn進数(n < 10)を10進数に変換できる

```cpp
int f(string s, int n){
    int v = 0;
    for(char c : s){
        v = v * N + (c - '0');
    }
    return v;
}
```
 
