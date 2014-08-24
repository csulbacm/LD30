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
	thisAi.self.stage.insert(new Q.Laser({ x:thisAi.self.p.x, y: thisAi.self.p.y,vx:dx, vy:dy, range: this.range, angle: angle+90}));
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
		thisAi.add(new Behavior_Shoot(1, this.target.p.x, this.target.p.y, 100, 100));
	}
}