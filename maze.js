$(document).ready(function(){
	var can = $("#can")[0].getContext('2d');
	// Prototype object
if (typeof Object.beget !== 'function') {
	Object.beget = function (o) {
		var F = function () {};
		F.prototype = o;
		return new F();
	};
}
// Constants
var C = {
	cols:50,
	rows:50,
	padding:2,
	width:8,
	current:"rgb(255,0,0)",
	regular:"rgb(0,0,0)"
}
	can.fillStyle = C.regular;
var block = {
	visited:false,
	rightWall:true,
	bottomWall:true,
	current:false,
	x:0,
	y:0,
	// Draws the block to the canvas named can
	draw: function() {
		can.fillRect((C.width+C.padding)*this.x,(C.width+C.padding)*this.y, C.width, C.width);
		if(this.rightWall){
			can.clearRect((C.width+C.padding)*this.x+C.width,(C.width+C.padding)*this.y, C.padding, C.width);
		} else {
			can.fillRect((C.width+C.padding)*this.x+C.width,(C.width+C.padding)*this.y, C.padding, C.width);
		}
		if(this.bottomWall){
			can.clearRect((C.width+C.padding)*this.x,(C.width+C.padding)*this.y+C.width, C.width, C.padding);
		} else {
			can.fillRect((C.width+C.padding)*this.x,(C.width+C.padding)*this.y+C.width, C.width, C.padding);
		}
		// Clear:
		// can.clearRect((C.width+C.padding)*this.x,(C.width+C.padding)*this.y, C.width+C.padding, C.width+C.padding);
	},
	// Gets unvisited neightbours, m is the matrix with the blocks.
	unvisitedNeightbours: function(m) {
				      var neightbours = [];
				      if(this.y !== 0 && !m[this.x][this.y-1].visited) {
						      neightbours.push(m[this.x][this.y-1]);
				      }
				      if(this.y < C.rows-1  && !m[this.x][this.y+1].visited) {
						      neightbours.push(m[this.x][this.y+1]);
				      }
				      if(this.x !== 0 && !m[this.x-1][this.y].visited) {
						      neightbours.push(m[this.x-1][this.y]);
				      }
				      if(this.x < C.cols-1  && !m[this.x+1][this.y].visited) {
						      neightbours.push(m[this.x+1][this.y]);
				      }
				      return neightbours;
			}
}

function randomInt(min, max)  {  
	return Math.floor(Math.random() * (max - min + 1)) + min;  
}
// Creates an empty maze with blocks.
function emptyMaze() {
	var m = [];
	for(i=0;i < C.rows;i++) {
		m[i] = [];
		for(j=0;j < C.cols;j++) {
			m[i][j] = Object.beget(block);
			m[i][j].x = i;
			m[i][j].y = j;
		}
	}
	return m;
}
generateMaze();
function generateMaze() {
	var m = emptyMaze();
	var visitedCells = 1;
	// Make the initial cell the current cell and mark it as visited
	var current = m[0][0];
	current.visited = true;
	current.current = true;
	var blockStack = [];

    // shim layer with setTimeout fallback
    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function( callback ){
                window.setTimeout(callback, 1000 / 60);
              };
    })();
	// While there are unvisited cells
	function gen() {
		if (visitedCells < C.rows*C.cols) {
			var neightbours = current.unvisitedNeightbours(m);	
			if(neightbours.length !== 0) {
				requestAnimFrame(gen);
				// Choose randomly one of the unvisited neighbours
				var neightbour = neightbours[randomInt(0, neightbours.length - 1)];
				// Push the chosen cell to the stack
				blockStack.push(neightbour);
				// Remove the wall between the current cell and the chosen cell
				if(neightbour.x - current.x === 1) {
					current.rightWall = false;
				} else if(neightbour.x - current.x === -1) {
					neightbour.rightWall = false;
				} else if(neightbour.y - current.y === 1) {
					current.bottomWall = false;
				} else if(neightbour.y - current.y === -1) {
					neightbour.bottomWall = false;
				}
				// Make the chosen cell the current cell and mark it as visited
				neightbour.visited = true;
				visitedCells++;
				current.current = false;
				current.draw();
				neightbour.current = true;
				neightbour.draw();
				current = neightbour;
			} else {
				current = blockStack.pop();
				gen();
			}
		}
	}
	gen();
}
});
