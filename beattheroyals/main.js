/*
    This file is part of Beat The Royals
    Copyright (C) 2025 Geethan Pfeifer

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/ -->
*/
var chipc;
var hand = [['spade', 10], ['spade', 11], ['spade', 12], ['spade', 13], ['spade', 1]];

window.onload = () => {
	betf.reset();
	
	chipc = 10000;
	
	update();
};


/*https://stackoverflow.com/a/24886483

document.querySelector("input[name='cho']:checked").value
document
*/

const winv = new Map([
	["st1", 924],
	["st2", 569],
	["st3", 464],
	["st4", 411],
	["st5", 343],
	["st6", 262],
	["st7", 206],
	["st8", 172],
	["st9", 152],
	["st10", 138],

//FIX SPADES
	["sp1", 2321],
	["sp2", 1220],
	["sp3", 853],
	["sp4", 671],
	["sp5", 563],
	["sp6", 484],
	["sp7", 421],
	["sp8", 370],
	["sp9", 329],
	["sp10", 295],
	["sp11", 268],
	["sp12", 247],
	["sp13", 229],
	
	["ds1", 3159],
	["ds2", 1665],
	["ds3", 1170],
	["ds4", 924],
	["ds5", 777],
	["ds6", 665],
	["ds7", 570],
	["ds8", 491],
	["ds9", 428],
	["ds10", 377]
]);

//rank to number
const rtn = ['', 'Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King']; 

function update(){
	document.getElementById("chipc").innerHTML = chipc;
	document.getElementById("winv").innerHTML = Math.floor(
		winv.get(document.querySelector("input[name='cho']:checked").value)
		* (document.getElementById("betv").value/100));
	
	document.getElementById("hand").innerHTML =
		'<img src = "cards/' + hand[0][0] + rtn[hand[0][1]] + '.png">'
		+ '<img src = "cards/' + hand[1][0] + rtn[hand[1][1]] + '.png">'
		+ '<img src = "cards/' + hand[2][0] + rtn[hand[2][1]] + '.png">'
		+ '<img src = "cards/' + hand[3][0] + rtn[hand[3][1]] + '.png">'
		+ '<img src = "cards/' + hand[4][0] + rtn[hand[4][1]] + '.png">';
	
	
}

/*
 whether two two element arrays are equal
*/
function tae(x, y){
	return x[0] == y[0] && x[1] == y[1];
}

//random card
function rndc(){
	return [['spade', 'heart', 'diamond', 'club'][Math.floor(Math.random() * 4)],
		Math.floor(Math.random() * 13 + 1)];
}

//5 random unique cards
function rndh(){
	var c1 = rndc();
	
	var c2= rndc();
	while(tae(c2, c1))c2 = rndc();
	
	var c3 = rndc();
	while(tae(c3, c1) || tae(c3,c2))c3 = rndc();
	
	var c4 = rndc();
	while(tae(c4, c1) || tae(c4, c2) || tae(c4, c3))c4 = rndc();
	
	var c5 = rndc();
	while(tae(c5, c1) || tae(c5, c2) || tae(c5, c3) || tae(c5, c4))c5 = rndc();
	
	return [c1, c2, c3, c4, c5];
}


function newHand(){
	hand = rndh();
	update();
}

/*
	true: player wins
	false: house wins
*/
function resolveWinner(){
	var upto = Number(document.querySelector("input[name='cho']:checked").value.substring(2));
	var r = 0;
	var p = 0;
	switch(document.querySelector("input[name='cho']:checked").value.substring(0,2)){
		case "st":
			for(const c of hand){
				if(c[1] <= upto){
					p+=c[1];
				} else if(c[1] >= 11){
					r+=10;
				}
			}
			break;
		case "sp":
			for(const c of hand){
				if(c[1] <= upto && c[0] == 'spade'){
					//console.log("card");
					p+=Math.min(c[1], 10);
				} else if(c[1] >= 11 && c[0] != 'spade'){
					r+=10;
				}
			}
			//console.log(p);
			//console.log(r);
			break;
		case "ds":
			for(const c of hand){
				if(c[1] <= upto && c[0] == 'spade'){
					p+=c[1];
				} else if(c[1] >= 11){
					r+=10;
				}
			}
			break;
		
	}
	return p > r;
}


document.betf.addEventListener('change', update);



function userplacebet(){
	var betamount = Number(document.getElementById("betv").value);
	if(betamount < 0){
		alert("Bet must be non-negative!");
		return;
	}
	if(betamount > chipc){
		alert("Bet must not be greater than number of chips!");
		return;
	}
	newHand();
	
	chipc -= betamount;
	chipc += document.getElementById("winv").innerHTML * (resolveWinner())
	
	if(chipc == 0){
		update();
		alert("Ran out of chips, resetting to 10000!");
		chipc = 10000;
	}
	update();
}




