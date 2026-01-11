# 循環配列での長さwの区間の和の最大値

循環させる前の配列と長さWを入れる


```cpp

    long long rmax(vector<int> v,long long w){
        int n = v.size();
        rep(i,n)v.push_back(v[i]);
        n *= 2;
        if(w >= n/2){
            long long ans = 0;
            rep(i,n/2)ans += v[i];
            return ans;
        }
        long long sum = 0;
        rep(i,w)sum += v[i];
        long long ans = sum;
        for(long long i = 0;i < n/2-1;i++){
            sum -= v[i];
            sum += v[i+w];
            ans = max(ans,sum);
        }
        return ans;
    }

```
