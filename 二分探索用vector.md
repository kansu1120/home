# 二分探索用vector

使い方は普通のvectorと同じ

lb = lower_bound

up = upperbound

ika = 以下

mim = 未満

結果がイテレータではなく添字で帰ってくる

end() に相当するリターンは-1

```cpp

class bs{
    public : 
    vector<long long> v;
    bs(long long n,long long x){
        v.assign(n,x);
        return;
    }
    void sort(){
        std::sort(v.begin(),v.end());
    }
    long long& at(long long pos){
        return v[pos];
    }
    long long& operator[](long long pos){
        return v[pos];
    }
    const long long& operator[](long long pos) const{
        return v[pos];
    }
    void push_back(long long x){
        v.push_back(x);
    }
    void pop_back(){
        v.pop_back();
    }
    long long lb(long long x){
        auto it = lower_bound(v.begin(),v.end(),x);
        if(it == v.end()){
            return -1;
        }
        else{
            return it - v.begin();
        }
    }
    long long ub(long long x){
        auto it = upper_bound(v.begin(),v.end(),x);
        if(it == v.end()){
            return -1;
        }
        else{
            return it - v.begin();
        }
    }
    long long mim(long long x){
        auto it = lower_bound(v.begin(),v.end(),x);
        if(it == v.begin()){
            return -1;
        }
        else{
            --it;
            return it - v.begin();
        }
    }
    long long ika(long long x){
        auto it = upper_bound(v.begin(),v.end(),x);
        if(it == v.begin()){
            return -1;
        }
        else{
            --it;
            return it - v.begin();
        }       
    }
    long long cnt_ika(long long x){
        return ika(x)+1;
    }
    long long cnt_mim(long long x){
        return mim(x)+1;
    }
    long long cnt_lb(long long x){
        if(lb(x) == -1){
            return 0;
        }
        return v.size() - lb(x);
    }
    long long cnt_ub(long long x){
        if(ub(x)==-1){
            return 0;
        }
        return v.size() - ub(x);
    }
};

```
