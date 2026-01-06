# 素因数分解 vector int


```cpp

vector<int> p(int n){
    vector<int> ans;
    int x = n;
    while(x % 2 == 0){
        x /= 2;
        ans.push_back(2);
    }
    for(int i = 3;i * i <= n;i+=2){
        while(x % i == 0){
            x /= i;
            ans.push_back(i);
        }
        if(x == 1){
            break;
        }
    }
    if(x!=1)ans.push_back(x);
    return ans;
};

```
