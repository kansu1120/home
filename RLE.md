# ラングレス圧縮

string を入力

int char の　pair の vector でリターン

aaab ->  4 a , 1 b

```cpp
vector<pair<int,char>> r(string s){
    vector<pair<int,char>> ans;
    for(int i = 0;i < s.size();i++){
        if(ans.size()==0 || ans[ans.size()-1].second != s[i]){
            ans.push_back({1,s[i]});
        }
        else{
            ans[ans.size()-1].first++;
        }
    } 
    return ans;
}
```
