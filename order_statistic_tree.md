# order_statistic_tree

insert,erase,find,cnt,order,lower_bound,upper_bound,miman,ika

が可能

```cpp


class trp{
    const long long INF = 1e18;
    struct node{
        int key;
        int priority;
        int siz;
        node* left;
        node* right;
        node(int k,int p){
            key = k;
            priority = p;
            siz = 1;
            left = nullptr;
            right = nullptr;
        }
    };

    node* root;


    bool find(node* t,int x){
        if(t == nullptr)return false;
        if(t -> key == x)return true;
        if(x < t->key)return find(t->left,x);
        else return find(t->right,x);
    }
    node* merge(node* l,node* r){
        if(l == nullptr)return r;
        if(r == nullptr)return l;
        if(l->priority > r->priority){
            l-> right = merge(l->right,r);
            update(l);
            return l;
        }
        else{
            r->left = merge(l,r->left);
            update(r);
            return r;
        }
    }
    pair<node*,node*> split(node* t,int x){
        if(t==nullptr)return {nullptr,nullptr};
        if(x <= t->key){
            pair<node*,node*> p = split(t->left,x);
            t -> left = p.second;
            update(t);
            return {p.first,t};
        }
        else{
            pair<node*,node*> p = split(t->right,x);
            t -> right = p.first;
            update(t);
            return {t,p.second};            
        }
    }
    int size(node* t){
        if(t == nullptr)return 0;
        else return t -> siz;
    }
    void update(node* t){
        if(t == nullptr)return;
        t -> siz = 1 + size(t->left)+size(t->right);
    }
    int cnt(node* t,int k){
        if(t == nullptr)return -INF;
        int lsiz = size(t->left);
        if(lsiz > k){
            return cnt(t -> left,k);
        }
        else if(k==lsiz){
            return t->key;
        }
        else{
            return cnt(t -> right,k - lsiz - 1);
        }
    }
    int order(node* t,int x){
        if(t == nullptr)return 0;
        if(x <= t->key){
            return order(t -> left,x);
        }
        else{
            return size(t -> left) + 1 + order(t->right,x);
        }
    }
    node* lower_bound(node* t, int x){
        if(t == nullptr) return nullptr;

        if(t->key < x){
            return lower_bound(t->right, x);
        }
        else{
            node* res = lower_bound(t->left, x);
            if(res != nullptr) return res;
            else return t;
        }
    }
    node* upper_bound(node* t, int x){
        if(t == nullptr) return nullptr;

        if(t->key <= x){
            return upper_bound(t->right, x);
        }
        else{
            node* res = upper_bound(t->left, x);
            if(res != nullptr) return res;
            else return t;
        }
    }
    node* ika(node* t,int x){
        if(t==nullptr)return nullptr;
        if(t -> key > x){
            return ika(t->left,x);
        }
        else{
            node*res = ika(t->right,x);
            if(res != nullptr)return res;
            else return t;
        }
    }


    public : 
    trp(){
        root = nullptr;
    }
    bool find(int x){
        return find(root,x);
    }
    void insert(int x){
        if(find(x))return;
        pair<node*,node*> p = split(root,x);
        node* r = p.second;
        node* l = p.first;
        node* n = new node(x,rand());
        root = merge(merge(l,n),r);
    }
    void erase(int x){
        if(!find(x))return ;
        pair<node*,node*> a = split(root,x);
        pair<node*,node*> b = split(a.second,x+1);
        root = merge(a.first,b.second);
    }
    int cnt(int k){
        return  cnt(root,k);
    }
    int order(int x){
        return order(root,x);
    }
    int lower_bound(int x){
        node* res = lower_bound(root, x);
        if(res == nullptr) return -INF;
        return res->key;
    }
    int upper_bound(int x){
        node* res = upper_bound(root, x);
        if(res == nullptr) return -INF;
        return res->key;
    }
    int miman(int x){
        int k = order(x) -1;
        if(k < 0)return -INF;
        return cnt(k);
    }
    int ika(int x){
        node* k = ika(root,x);
        if(k == nullptr)return -INF;
        else return k->key;
    }
};

```
