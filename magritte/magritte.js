/*
    This file is part of Magritte.
    Copyright (C) 2024 Geethan Pfeifer

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/



function Action(val, func){
	this.val = val;
	this.func = func;
}
Object.assign(Action.prototype, {});

/*
function Point2(x, y){
	this.x = x;
	this.y = y;
}
Object.assign(Point2.prototype, {});
*/


function UniformPiece(left, width, start, prob){
	this.left = left;
	this.width = width;
	this.right = left + width;
	this.height = prob/width;
	this.start = start;
	this.prob = prob;
	this.end = start + prob;
	this.mean = left + width/2;

	var theight = this.height;
	this.leftAction = new Action(this.left,
				function(x){
					return x + theight;
				});
	this.rightAction = new Action(this.right,
				function(x){
					return x - theight;
				});
	this.testAction = new Action(0, function(x){return theight;});
}

Object.assign(UniformPiece.prototype,{
	inRange(x){
			return x >= this.start && x < this.end;
	},
	evaluate(){
			return this.left + Math.random() * this.width;
	}
});

/*
	num:		number of pieces (including start and end)
*/
function gameFunction(num){
	if(num==0){
		throw new Error("0 pieces specified");
	}
	var pieces = [];
	
	var cur = 0;
	var nxt, prob, left, width;
	for(;num>0;num--){
		if(num == 1){
			prob = 1 - cur;
		} else {
			prob = Math.random() * 2 / num * (1 - cur);
		}
		if(cur == 0){
			left = 0;
		} else {
			left = Math.random() * 15;
		}
		width = 5*Math.random();
		nxt = new UniformPiece(left, width, cur, prob);
		pieces.push(nxt);
		cur += prob;
	}
	return pieces;
}


/*
converts collection of pieces to points which can be used to generate a PDF

This function is O(n^2) but it can be made O(n log n) or O(n). But that shouldn't be necessary as #pieces is small.
*/
function PDFvertices(pieces){
	var actions = [];
	var actedUpon = [];
	var i;
	var vertices = [];
	
	
	/* JS does not have a PQ implementation by default!
	Luckily the number of actions is small enough that it might be ideal to just iterate...
	*/
	for(i=0; i < pieces.length; i++){
		actions.push(pieces[i].leftAction);
		actedUpon.push(false);
		actions.push(pieces[i].rightAction);
		actedUpon.push(false);
	}
	
	/* assumes start of pieces is 0 */
	var x = 0;
	var y = 0;
	
	vertices.push({x:x,y:y});
	
	var flag = true;
	var funcs;
	while(flag){
		nextVal = false;
		
		for(i=0; i < actions.length; i++){
			if(!actedUpon[i]){
				/* javascript treating 0 as false is a double-edged sword... which is worse than any sword at all */
				if(nextVal || nextVal === 0){
					nextVal = Math.min(nextVal, actions[i].val);
				} else {
					nextVal = actions[i].val;
				}
			}
		}
		
		if(nextVal || nextVal === 0){
			funcs = [];
			for(i=0; i < actions.length; i++){
				if(actions[i].val == nextVal){
					funcs.push(actions[i].func);
					actedUpon[i] = true;
				}
			}
			
			x = nextVal;
			vertices.push({x:x,y:y});
			
			for(i=0; i < funcs.length; i++){
				y = funcs[i](y);
			}
			vertices.push({x:x,y:y});
			
			/* in case nextVal is 0 */
			nextVal = true;
		}
		flag = nextVal;
	}
	
	return vertices;
}





function Round(num, canv){
	this.pieces = gameFunction(num);
	this.vertices = PDFvertices(this.pieces);
	
	this.chart = new Chart(document.getElementById(canv), {
		type: "scatter",
		data: {
			datasets: [{
				id: "",
				data: this.vertices
			}]
		},
		options:{
			responsive: false,
			showLine: true,
			tension: 0,
			fill: true,
			scales: {
				x: {
					min: 0,
					max: 20
				},
				y: {
					min: 0
				}
			},
			plugins: {
				legend: {
					display: false
				}
			}
		}
	});
}
Object.assign(Round.prototype, {
	EV(){
		var ev = 0;
		for(i=0; i<this.pieces.length; i++){
			ev += this.pieces[i].mean * this.pieces[i].prob; 
		}
		return ev;
	},
	/*
	calculates exp(EV(log(X+1)))-1
	*/
	mint(){
		/*lotus */
		var evt = 0;
		for(i=0; i<this.pieces.length; i++){
			/*
				integral 
			
			xcas:
			int(ln(1+x),x,a,b)
			-a*ln(a+1)+b*ln(b+1)-ln(a+1)+ln(b+1)+a-b
			*/
			var a = this.pieces[i].left;
			var b = this.pieces[i].right;
			
			evt += (-a * Math.log(a+1) + b * Math.log(b+1) - Math.log(a+1) + Math.log(b+1) + a - b)
				* this.pieces[i].height;
		}
		return Math.exp(evt) - 1;
	}
});

r = new Round(3, "canv");

ttr = 0;

yrpf = 0;

err = 0;

acb = 0;

function accumulate(){
	var minaccept = r.mint();
	var ev = r.EV();
	
	var pfr = 0;
	
	var bid = document.getElementById("buyv").value;
	if(bid > minaccept){
		document.getElementById("rjac").innerHTML = "accepted";
		
		pfr = ev - bid;
		acb++;
	} else {

		pfr = 0;
		document.getElementById("rjac").innerHTML = "rejected";
	}
	ttr++;
	yrpf += pfr;
	var erpf = (ev - minaccept) - pfr;
	
	err += erpf;
	
	if(pfr < 0){
		document.getElementById("lrpf").innerHTML = "<span style=\"color:red\">" + pfr + "</span>";
	} else {
		document.getElementById("lrpf").innerHTML = pfr;
	}
	document.getElementById("erpf").innerHTML = erpf;
	document.getElementById("thrs").innerHTML = minaccept;
	document.getElementById("evg").innerHTML = ev;
	
	document.getElementById("ttr").innerHTML = ttr;
	document.getElementById("yrpf").innerHTML = yrpf;
	document.getElementById("pfpr").innerHTML = yrpf/ttr;
	document.getElementById("err").innerHTML = err;
	document.getElementById("errr").innerHTML = err/ttr;
	
	document.getElementById("acb").innerHTML = acb;
	
	r.chart.destroy();
	r = new Round(3, "canv");
	
}

