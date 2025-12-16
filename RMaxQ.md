# RMaxQ
segmenttree 名前(サイズ)　で定義

名前.update( i , x ) で i 番目の要素を x に変更

名前.query( l , r ) で l から r の範囲内の最大値を取得

```cpp

class segmenttree{
public:
    int siz = 1;
    vector<int> v;
    segmenttree (int n){
        siz = 1;
        while(siz < n)siz *= 2;
        v.assign(2*siz,-1 * inf);
    }
    void update(int i, int x){
        i += siz;
        v[i] = x;
        while(i > 1){
            i /= 2;
            v[i] = max(v[i*2],v[i*2+1]);
        }
    } 
    int query(int L, int R){   // 添字、L , R
        int ans = -1 * inf;
        function<void(int,int,int)> f = [&](int s,int l,int r){
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

