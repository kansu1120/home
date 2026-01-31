# 区間和のセグ木

segmenttreeで定義

update(i,x)iをxにする

query(l,r)  l~rの合計を出す

```cpp
class segmenttree{
public:
    long long INF = 1e18;
    long long siz = 1;
    vector<long long> v;
    segmenttree (long long n){
        siz = 1;
        while(siz < n)siz *= 2;
        v.assign(2*siz,0);
    }
    void update(long long i, long long x){
        i += siz;
        v[i] = x;
        while(i > 1){
            i /= 2;
            v[i] = v[i*2]+v[i*2+1];
        }
    } 
    long long query(int l,int r){
        return query(l,r,1,0,siz-1);
    }
    private : 
    long long query(int L,int R,int s,int l,int r){
        long long ans = 0;
        if(r < L || l > R)return 0;
        if(l >= L && r <= R){
            return v[s];
        }
        ans += query(L,R,s*2,l,(l+r)/2);
        ans += query(L,R,s*2+1,(l+r)/2+1,r);
        return ans;
    }
};
```
