# 二分探索用vector

使い方は普通のvectorと同じ

lb = lower_bound

up = upperbound

ika = 以下

mim = 未満

結果がイテレータではなく添字で帰ってくる

end() に相当するリターンは-1

```cpp

template<typename T>
class bs{
    public : 
    vector<T> v;
    bs(int n,T x){
        v.assign(n,x);
        return;
    }
    void sort(){
        std::sort(v.begin(),v.end());
    }
    T& at(int pos){
        return v[pos];
    }
    T& operator[](int pos){
        return v[pos];
    }
    const T& operator[](int pos) const{
        return v[pos];
    }
    void push_back(T x){
        v.push_back(x);
    }
    void pop_back(){
        v.pop_back();
    }
    int lb(T x){
        auto it = lower_bound(v.begin(),v.end(),x);
        if(it == v.end()){
            return -1;
        }
        else{
            return it - v.begin();
        }
    }
    int ub(T x){
        auto it = upper_bound(v.begin(),v.end(),x);
        if(it == v.end()){
            return -1;
        }
        else{
            return it - v.begin();
        }
    }
    int mim(T x){
        auto it = lower_bound(v.begin(),v.end(),x);
        if(it == v.begin()){
            return -1;
        }
        else{
            --it;
            return it - v.begin();
        }
    }
    int ika(T x){
        auto it = upper_bound(v.begin(),v.end(),x);
        if(it == v.begin()){
            return -1;
        }
        else{
            --it;
            return it - v.begin();
        }       
    }
    int cnt_ika(T x){
        return ika(x)+1;
    }
    int cnt_mim(T x){
        return mim(x)+1;
    }
    int cnt_lb(T x){
        if(lb(x) == -1){
            return 0;
        }
        return v.size() - lb(x);
    }
    int cnt_ub(T x){
        if(ub(x)==-1){
            return 0;
        }
        return v.size() - ub(x);
    }
};
```
