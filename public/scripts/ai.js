function Ai(self) {
	this.behaviors = new Array();
	this.self = self;
}

Ai.prototype.add = function(behavior) {
	var i;
	for(i=0; i< this.behaviors.length; i++) {
		if(behavior.type == this.behaviors[i].type 
			&& behavior.priority >= this.behaviors[i].priority){

			behaviors[i] = behavior;
			return;
		}

	}
	this.behaviors.push(behavior);
}

Ai.prototype.remove = function(behavior) {
	var i;
	for(i=0; i< this.behaviors.length; i++) {
		if(behavior == this.behaviors[i]){
			if(i+1 == this.behaviors.length) {
				this.behaviors.pop();
			} else {
				behaviors[i] = behaviors.pop();
			}
			return;
		}

	}
}

Ai.prototype.step = function(dT) {
	var i;
	for(i=0; i< this.behaviors.length; i++) {
		this.behaviors[i].step(dT, this);
	}
}

function Behavior(type, priority) {
	this.type = type;
	this.priority = priority;

}

Behavior.prototype.step = function(dT, thisAi) {

}

function Behavior_Follow(priority, target, range) {
	Behavior.call('follow', priority);
	this.target = target;
	this.range = range;
}

Behavior_Follow.prototype.step = function(dT, thisAi) {
	var selfx = thisAi.self.p.x;
	var selfy = thisAi.self.p.y;
	var otherx = this.target.p.x;
	var othery = this.target.p.y;
	var dx = otherx-selfx;
	var dy = othery-selfy;
	var distance = (dx*dx) + (dy*dy);
	var range2 = this.range * this.range;
	if(range2 < distance) {
		var speed = thisAi.self.p.speed;
		distance = Math.sqrt(distance);
		if(distance > speed) {
			dx *= speed/distance;
			dy *= speed/distance;
		}
	} else {
		dx = 0;
		dy = 0;
	}
	thisAi.self.p.vx = dx;
	thisAi.self.p.vy = dy;
}

function Behavior_Follow_Path(priority, points) {
	Behavior.call('follow', priority);
	this.points = points;
	this.cur = 0;
	this.thresh = 1;
}

Behavior_Follow_Path.step = function(dT, thisAi) {
	var selfx = thisAi.self.p.x;
	var selfy = thisAi.self.p.y;
	var otherx = this.points[this.cur].x;
	var othery = this.points[this.cur].y;
	var dx = otherx-selfx;
	var dy = othery-selfy;
	var distance = (dx*dx) + (dy*dy);
	var range2 = this.thresh * this.thresh;
	if(range2 < distance) {
		var speed = thisAi.self.p.speed;
		distance = Math.sqrt(distance);
		if(distance > speed) {
			dx *= speed/distance;
			dy *= speed/distance;
		}
	} else {
		dx = 0;
		dy = 0;
		this.cur++;
		if(this.cur == this.points.length)
			this.cur == 0;
	}
	thisAi.self.p.vx = dx;
	thisAi.self.p.vy = dy;
}

//shoots a laser at the next step
//this only an action to create a laser
function Behavior_Shoot(priority, targetx, targety, range, speed) {
	Behavior.call('shoot', priority);
	this.range = range;
	this.speed = speed;
	this.targetx = targetx;
	this.targety = targety;
}

Behavior_Shoot.prototype.step = function(dT, thisAi) {
	//find v
	dx = (this.targetx-thisAi.self.p.x);
	dy = (this.targety-thisAi.self.p.y);
	angle = ((Math.atan2(dy, dx) * 180/Math.PI))
	//add some randomness
	angle += (Math.random()-.5)*45;
	dx = Math.cos(angle*Math.PI/180)*this.speed;
	dy = Math.sin(angle*Math.PI/180)*this.speed;

	//	console.log('dx: '+dx+' dy: '+dy);
	thisAi.self.stage.insert(new Q.Laser({ x:thisAi.self.p.x, y: thisAi.self.p.y,vx:dx, vy:dy, range: this.range, angle: angle+90, shooter: thisAi.self}));
	thisAi.remove(this);
}

function Behavior_Attack(priority, target) {
	Behavior.call('attack', priority);
	this.target = target;
	this.time_elapsed = 0;
}

Behavior_Attack.prototype.step = function(dT, thisAi) {
	this.time_elapsed += dT;
	if(this.time_elapsed > 1) {
		this.time_elapsed -= 1;
		thisAi.add(new Behavior_Shoot(1, this.target.p.x, this.target.p.y, 100, 200));
	}
}

/*
	Graph format
	Each node is idenfified by an index. The nodes should be put in an array.
	Each node has a list of edges. Each edge has an index it connects to and
	the cost to that node. The cost is 1 for straight connections and 1.4 for diagonals.
	The cost can be increased if that edge should be advoided but there shouldn't be
	any need in this program.
*/
function node(index, edges, x, y) {
	this.index = index;
	this.edges = edges;
	this.x = x;
	this.y = y;
	this.parent = -1;
	this.cost = -1;
	this.distance = -1;
	this.run = -1;
	visited = false;
}

node.prototype.setAstar(parent, cost, distance) {
	this.parent = parent;
	this.cost = cost;
	this.distance = distance;
}

node.prototype.total_cost = funtion() {
	return cost + distance;
}

function edge(index, cost) {
	this.index = index;
	this.cost = cost;
}

function Astar(nodeList) {
	this.nodeList = nodeList;
	this.start = 0;
	this.end = 0;
}


Astar.prototype.get_distance(start_i, end_i) {
	start = this.nodeList[start_i];
	end = this.nodeList[end_i];

	return Math.abs(start.x-end.x) + Math.abs(start.y-end.y);
}

Astar.prototype.find_path(start_i, end_i) {

	//clean up all nodes
	for(i=0; i<this.nodeList.length; i++) {
		this.nodeList[i].setAstar(-1,-1, -1);
		this.nodeList[i].visited = false;
	}

	start = this.nodeList[start_i];
	end = this.nodeList[end_i];
	start.setAstar(-1, 0, this.get_distance(start.index, end.index));
	open_list = new Heap(function(a, b) {return a.total_cost() - b.total_cost;});
	//closed_list = new Heap(function(a, b) {return a.total_cost() - b.total_cost;});

	

	open_list.push(start_node);


	while(!open_list.empty()) {
		cur = open_list.pop();

		//check if this is the end
		if(cur.index == end_i) {
			//make list of points
			points = Array();
			points.push({x:cur.x, y:cur.y});
			cur = this.nodeList[cur.parent];
			while(cur.index != start_i) {
				points.push({x:cur.x, y:cur.y});
				cur = this.nodeList[cur.parent];
			}
			return points;
		}

		//mark that node has been visited
		visited[cur.index] = true;

		//add to list of visited nodes
		//closed_list.push(cur);

		//find all edges
		edges = this.nodeList[cur.index].edges;
		for(i=0; i<edges.length; i++) {
			cur2 = this.nodeList[edges[i].index];

			if(!cur2.visited) {
				if(cur2.cost == -1) { 
					cur2.setAstar(cur.index, edges[i].cost + cur.cost, get_distance(cur2.index, end_i));
					open_list.push(cur2);
				}
				//check if the new cost to is less
				else if(edges[i].cost + cur.cost < cur2.cost) {
					//this is a shorter way to reach this node
					cur2.setAstar(cur.index, edges[i].cost + cur.cost, get_distance(cur2.index, end_i));
					open_list.heapify();
				}
			}

		}
	}
}