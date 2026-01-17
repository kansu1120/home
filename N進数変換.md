# N進数変換

## 10進数の時はintを使い他のときはstringを使っている


# 10 -> N
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


# N -> 10

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

# X -> y

```cpp


// 先頭の 0 を削除
void trim(vector<int>& a){
    while(a.size() > 1 && a[0] == 0) a.erase(a.begin());
}

// a（x進数）を y で割る
// 商を a に格納し、余りを返す
int div_mod(vector<int>& a, int x, int y){
    vector<int> q;
    int cur = 0;
    for(int d : a){
        cur = cur * x + d;
        q.push_back(cur / y);
        cur %= y;
    }
    a = q;
    trim(a);
    return cur;
}

// x進数(string) → y進数(string)
string f(string s, int x, int y){
    vector<int> a;
    for(char c : s) a.push_back(c - '0');
    trim(a);

    if(a.size() == 1 && a[0] == 0) return "0";

    string res;
    while(!(a.size() == 1 && a[0] == 0)){
        int r = div_mod(a, x, y);
        res.push_back(char('0' + r));
    }
    reverse(res.begin(), res.end());
    return res;
}
```

 
