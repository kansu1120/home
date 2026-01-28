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
    long long query(long long l,long long r){
        if(l > r)return -INF;
        return query(l,r,1,0,siz-1);
    }
    long long find(long long l,long long r){
        if(l > r)return -1;
        long long x = query(l,r);
        if(x==-INF)return -1;
        return find(l,r,x,1,0,siz-1);
    }
    private : 
    long long query(long long L,long long R,long long s,long long l,long long r){
        long long ans = -INF;
        if(r < L || l > R)return -INF;
        if(l >= L && r <= R){
            ans = max(ans,v[s]);
            return ans;
        }
        ans = max(ans,query(L,R,s*2,l,(l+r)/2));
        ans = max(ans,query(L,R,s*2+1,(l+r)/2+1,r));
        return ans;
    }
    long long find(long long L,long long R,long long x,long long s,long long l,long long r){
        if(r < L || l > R)return -1;
        if(v[s] < x)return -1;
        if(l==r)return l;
        long long left = find(L,R,x,s*2,l,(r+l)/2);
        if(left!=-1)return left;
        else return find(L,R,x,s*2+1,(l+r)/2+1,r);
    }
};

```

