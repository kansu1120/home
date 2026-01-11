# imos法のライブラリ

plus(l,r,x) でl~rまでにxを加算する

solve() をしたら完成

そこからは普通のvecotrと同じようにアクセスできる

```cpp

class imos{
    public : 
    vector<long long> v;
    long long n;
    imos(long long x){
        v.assign(x,0);
        n = v.size();
    }
    void plus(long long l,long long r,long long x){
        v[l] += x;
        if(r != n-1)v[r+1]-=x;
    }
    void solve(){
        for(long long i = 1;i < n;i++){
            v[i] += v[i-1];
        }
    }
    long long at(long long pos){
        return v[pos];
    }
    long long operator[](long long pos) const {
        return v[pos];
    }
};

```
