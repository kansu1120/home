# RMaxQ
segmenttree 名前(サイズ)　で定義

名前.update( i , x ) で i 番目の要素を x に変更

名前.query( l , r ) で l から r の範囲内の最大値を取得

```cpp


class segmenttree{
public:
    long long siz = 1;
    vector<long long> v;
    segmenttree (long long n){
        siz = 1;
        while(siz < n)siz *= 2;
        v.assign(2*siz,-1 * inf);
    }
    void update(long long i, long long x){
        i += siz;
        v[i] = x;
        while(i > 1){
            i /= 2;
            v[i] = max(v[i*2],v[i*2+1]);
        }
    } 
    long long query(long long L, long long R){   // 添字、L , R
        long long ans = -1 * inf;
        function<void(long long,long long,long long)> f = [&](long long s,long long l,long long r){
            if(l >= L && r <= R){
                ans = max(ans,v[s]);
                return;
            }
            if(r < L || l > R)return;
            f(s*2,l,(l+r)/2);
            f(s*2+1,(l+r)/2+1,r);
            return;
        };
        f(1,0,siz-1);
        return ans;
    }
};

```

