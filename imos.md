# imos法のライブラリ

plus(l,r,x) でl~rまでにxを加算する

solve() をしたら完成

そこからは普通のvecotrと同じようにアクセスできる

```cpp

class imos{
    public : 
    vector<int> v;
    int n;
    imos(int x){
        v.assign(x,0);
        n = v.size();
    }
    void plus(int l,int r,int x){
        v[l] += x;
        if(r != n-1)v[r+1]-=x;
    }
    void solve(){
        for(int i = 1;i < n;i++){
            v[i] += v[i-1];
        }
    }
    int at(int pos){
        return v[pos];
    }
    long long operator[](int pos) const {
        return v[pos];
    }
};

```
