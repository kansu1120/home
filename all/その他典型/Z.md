# zアルゴリズム

文字列Sのそれぞれの位置についてそこから後ろの文字列とSとの最長共通接頭辞の長さをO(N)で計算できる

Z(S)でvector<int> のリターン


```cpp
vector<int> z(string s){
    int n = s.size();
    vector<int> ans(n);
    int l=0,r=0;
    ans[0] = n;
    for(int i = 1;i < n;i++){
        if(i > r){
            int J = 0;
            int j = i;
            while(j < n && J < n && s[J] == s[j]){
                J++;
                j++;
            }
            ans[i] = J;
            r = j-1;
            l = i;
        }
        else{
            int j = min(i+ans[i-l],r);
            int J = j-i;
            while(j < n && J < n && s[J] == s[j]){
                J++;
                j++;
            }
            ans[i] = J;
            if(r < j-1){
                r = j-1;
                l = i;
            }            
        }
    }
    return ans;
}

```
