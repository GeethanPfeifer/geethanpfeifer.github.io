/*
	Short throwaway "Monte Carlo" simulation of Beat The Royals.
	It's not really Monte Carlo, but similar enough and it's exact, to the level of precision.
*/

#include <bits/stdc++.h>
using namespace std;

int tot_hands{};
int standard[10] = {};
int spades[13] = {};
int dspades[10] = {};

void dfs(vector<int> h, int in){
	if(h.size() == 5){
		tot_hands++;
		/* standard */
		{
			int a, b, c, d, e;
			a = h[0]%13;
			b = h[1]%13;
			c = h[2]%13;
			d = h[3]%13;
			e = h[4]%13;
			
			int r{};
			//10-12 : JQK
			if(a >= 10)r+=10;
			if(b >= 10)r+=10;
			if(c >= 10)r+=10;
			if(d >= 10)r+=10;
			if(e >= 10)r+=10;
			
			int p{};
			for(int i=0; i<10; i++){
				if(a == i)p += i+1;
				if(b == i)p += i+1;
				if(c == i)p += i+1;
				if(d == i)p += i+1;
				if(e == i)p += i+1;
				
				if(p > r){
					standard[i]++;
				}
			}
		}
		
		/* spades */
		{
			vector<int> pl;
			int r{};
			for(auto x : h){
				if(x%4 == 0){
					pl.push_back(x%13);
				} else if(x%13 >= 10){
					r += 10;
				}
			}
			int p{};
			for(int i=0; i<13; i++){
				for(auto y : pl){
					if(y == i)p += min(10,i+1);
				}
				
				if(p > r){
					spades[i]++;
				}
			}
		}
		/* double edged spades */
		{
			int a, b, c, d, e;
			a = h[0];
			b = h[1];
			c = h[2];
			d = h[3];
			e = h[4];
			
			int r{};
			//10-12 : JQK
			if(a%13 >= 10)r+=10;
			if(b%13 >= 10)r+=10;
			if(c%13 >= 10)r+=10;
			if(d%13 >= 10)r+=10;
			if(e%13 >= 10)r+=10;
			
			int p{};
			for(int i=0; i<10; i++){
				if(a == i)p += i+1;
				if(b == i)p += i+1;
				if(c == i)p += i+1;
				if(d == i)p += i+1;
				if(e == i)p += i+1;
				
				if(p > r){
					dspades[i]++;
				}
			}
		}
		
		
		
		
	} else if(in == 52){
		//NOOP
		return;
	} else {
		h.push_back(-1);
		for(int i = in; i<52; i++){
			h.back() = i;
			dfs(h, i+1);
		}
	}
}
//rank to card
inline char rtc(int r){
	return "A23456789TJQK"[r];
}



int main(){
	dfs({}, 0);
	
	int i;
	cout << "Total hands:\t" << tot_hands << "\n\n";
	
	cout << "STANDARD\n";
	cout << "Upto\twins\twin%\tfair win (100 chips)\n";
	for(i=0; i<10; i++){
		cout << rtc(i) << "\t" << standard[i] << "\t"
			<< (double)(standard[i])/(0.01*(double)tot_hands) << "\t"
			<< (100.*(double)tot_hands)/(double)(standard[i])
			<< "\n";
	}
	cout << "\n";
	
	cout << "SPADES\n";
	cout << "Upto\twins\twin%\tfair win (100 chips)\n";
	for(i=0; i<13; i++){
		cout << rtc(i) << "\t" << spades[i] << "\t"
			<< (double)(spades[i])/(0.01*(double)tot_hands) << "\t"
			<< (100.*(double)tot_hands)/(double)(spades[i])
			<< "\n";
	}
	cout << "\n";
	
	cout << "DOUBLE-EDGED SPADES\n";
	cout << "Upto\twins\twin%\tfair win (100 chips)\n";
	for(i=0; i<10; i++){
		cout << rtc(i) << "\t" << dspades[i] << "\t"
			<< (double)(dspades[i])/(0.01*(double)tot_hands) << "\t"
			<< (100.*(double)tot_hands)/(double)(dspades[i])
			<< "\n";
	}
	cout << "\n";
	
	
}



















