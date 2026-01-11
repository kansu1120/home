# imos2D

```
(a,b)(   )(   )
(   )(   )(   )
(   )(   )(c,d)  
```
update(a,b,c,d,x)でここの範囲に+xできる

build()をやったらOK


```cpp

class imos2D{
    public :
    vector<vector<long long>> v;
    long long h,w;
    imos2D(long long H,long long W){
        h = H;
        w = W;
        v.assign(h,vector<long long>(w));
    }
    void update(long long a,long long b,long long c,long long d,long long x){
        v[a][b]+=x;
        if(c+1 < h)v[c+1][b]-=x;
        if(d+1 < w)v[a][d+1]-=x;
        if(c+1 < h && d+1 < w)v[c+1][d+1]+=x;
    }
    void build(){
        for(long long i = 0;i < h;i++){
            for(long long j = 1;j < w;j++){
                v[i][j] += v[i][j-1];
            }
        }
        for(long long j = 0;j < w;j++){
            for(long long i = 1;i < h;i++){
                v[i][j] += v[i-1][j];
            }
        }
    }
    vector<long long>& operator[](long long i){
        return v[i];
    }
    const vector<long long>& operator[](long long i) const{
        return v[i];
    }
};

```
