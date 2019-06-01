#include<bits/stdc++.h>
#define ll long long
using namespace std;

string getString(vector<int> v)
{
    std::stringstream result;
    std:copy(v.begin(),v.end(),std::ostream_iterator<int>(result,""));
    return result.str().c_str();
}

pair<int,vector<int> > getDigitCount(int c,int n,bool flagB=false){
    int count=0,d;
    vector<int> digits;
    if(flagB && n<=9 && c>2){
        for(int i=0;i<(c==2?1:c-2);i++){
            digits.push_back(0);
            count++;
        }
        digits.push_back(n);
        count++;
    }
    else{
        while(n){
            d=n%10;
            digits.push_back(d);
            n=n/10;
            count++;
        }
    }
    
    pair<int,vector<int> > output;
    output=make_pair(count,digits);
    return output;
}

int isExist(vector<int> digitsA,int n){
    bool flag = false;
    int pos=-1;
    for(int i=0;i<digitsA.size();i++){
        if(n==digitsA[i])
        {
            flag=true;
            pos=i;
            
        }    
    }
    return pos;
}
bool validateNumberB(vector<int> digitsA,vector<int> digitsB)
{
    int c=0;
    int prevPos=-1;
    for(int i=0;i<digitsB.size();i++)
    {   
        int pos = isExist(digitsA,digitsB[i]);
        if(pos>prevPos)
            prevPos=pos;
        else
            break;
        if(pos!=-1)
        {
            digitsA[pos]=-1;
            c++;
        }
        
    }
    
    return c==digitsB.size();
}
int main(){

    int t,no=1;
    cin>>t;
    while(t--){
        ll n;
        cin>>n;
        int a,b;
        set<pair<int,int> > answer;
        for(int a=10;a<n;a++)
        {
            pair<int,vector<int> > output1 = getDigitCount(0,a);
            pair<int,vector<int> > output2 = getDigitCount(output1.first,n-a,true);
            
            string s1= getString(output1.second);
            string s2= getString(output2.second);
        
            int no_of_digits_in_a = output1.first;
            int no_of_digits_in_b = output2.first;
            if(no_of_digits_in_b==no_of_digits_in_a-1){

                if(s1.find(s2)!=std::string::npos){
                    answer.insert(make_pair(a,n-a));
                }    
                bool flag = validateNumberB(output1.second,output2.second);
                if(flag){
                    answer.insert(make_pair(a,n-a));
                }
            }
            
            
        }

        cout<<"TEST#"<< no <<endl;
        string st= (answer.size()>1)?"pairs ":"pair ";
        cout<<answer.size()<<" "<<st<<"found"<<endl;
        for(set<pair<int,int> >::iterator i = answer.begin();i!=answer.end();i++){
            cout<<i->first<<" + "<<i->second<< " = "<<n<<endl;
        }
        no++;
        cout<<endl;
    }
    return 0;
}