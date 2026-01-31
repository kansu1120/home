# mapを使わずにカウントをする構造体

**範囲forで全部回すなら使える**

cnt x　

x.add(n)  nをひとつ追加

x.solve() これをやらないと使えない

for(auto i : x){
    iを使った処理
    i は　{内容,個数}のpair
}

```cpp

template<class T>
class cnt {
    public : 
    vector<T> v;
    vector<pair<T,int>> ans;
    cnt(){};
    void add(T x){
        v.push_back(x);
    }
    void solve(){
        sort(v.begin(),v.end());
        ans.push_back({v[0],1});
        for(int i = 1;i < v.size();i++){
            if(v[i] == ans[ans.size()-1].first) ans[ans.size()-1].second++;
            else ans.push_back({v[i],1});
        }
    }
    auto begin() return ans.begin();
    auto end() return ans.end();
    auto begin() const return ans.begin();
    auto end() const return ans.end();
};
```
