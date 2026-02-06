# manacher

ちょい不十分

```cpp
vector<int> mana(string s){
    int n = s.size();
    vector<int> res(n,0);
    int y = -1;
    int x = -1;
    for(int i = 0;i < n;i++){
        int l = i,r = i;
        if(y >= i){
            int t = x*2 - i;
            r = min(y,i+res[t]-1);
            l -=  r-i;
        }
        while(l >= 0 && r < n && s[l]==s[r]){
            if(y < r){
                y = r;
                x = i;
            }
            l--;
            r++;
        }
        res[i] = r  - i;
    }
    return res;
}
```
