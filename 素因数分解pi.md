#　素因数分解　pair int,int


```cpp
vector<pair<int,int>>  p(int n){
    vector<pair<int,int>> ans;
    int x = n;
    int k = 0;
    while(x % 2 == 0){
        k++;
        x /= 2;
    }
    if(k != 0){
        ans.push_back({2,k});
    }
    for(int i = 3;i * i <= n;i+=2){
        int cnt = 0;
        while(x % i == 0){
            cnt++;
            x /= i;
        }
        if(cnt != 0){
            ans.push_back({i,cnt});
        }
        if(x == 1){
            break;
        }
    }
    if(x!=1)ans.push_back({x,1});
    return ans;
};
```
