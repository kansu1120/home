# countが高速に行えるmaltiset

使い方はmulsisetと同じ

countがlogNで実行できる

```cpp
template<typename T>
class countable_multiset{
    public :
    multiset<T> ms;
    map<T,int> cnt;
    void insert(const T& n){
        cnt[n]++;
        ms.insert(n);
    }
    void all_erase(const T& n){
        cnt.erase(n);
        ms.erase(n);
    }
    void it_erase(const T& n){
        auto it = ms.find(n);
        if(it==ms.end())return;
        cnt[n] = max(0,cnt[n]-1);
        if(cnt[n]==0)cnt.erase(n);
        ms.erase(it);
    }
    int count(const T& n){
        if(cnt.count(n))return cnt[n];
        return 0;
    }
    auto find(const T& n){
        return ms.find(n);
    }
};
```
