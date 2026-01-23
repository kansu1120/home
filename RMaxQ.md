# RMaxQ
segmenttree 名前(サイズ)　で定義

名前.update( i , x ) で i 番目の要素を x に変更

名前.query( l , r ) で l から r の範囲内の最大値を取得

```cpp

class segmenttree{
public:
    long long INF = 1e18;
    long long siz = 1;
    vector<long long> v;
    segmenttree (long long n){
        siz = 1;
        while(siz < n)siz *= 2;
        v.assign(2*siz,-INF);
    }
    void update(long long i, long long x){
        i += siz;
        v[i] = x;
        while(i > 1){
            i /= 2;
            v[i] = max(v[i*2],v[i*2+1]);
        }
    } 
    long long query(int l,int r){
        return query(l,r,1,0,siz-1);
    }
    private : 
    long long query(int L,int R,int s,int l,int r){
        long long ans = -INF;
        if(r < L || l > R)return -INF;
        if(l >= L && r <= R){
            return v[s];
        }
        ans = max(ans,query(L,R,s*2,l,(l+r)/2));
        ans = max(ans,query(L,R,s*2+1,(l+r)/2+1,r));
        return ans;
    }
};

```

