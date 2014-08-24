
//define(function (require){
//var Ai = require('./public/scripts/ai.js');
//var Follow = require('follow');
//});



window.addEventListener("load",function() {
	var Q = Quintus({ development: true })
			.include('Sprites, Scenes, Input, 2D, Anim, UI, TMX')
			.setup({ maximize: true });

	Q.input.keyboardControls({
		87: 'W',
		65: 'A',
		83: 'S',
		68: 'D'
	});
	
	// Joypads don't seem to work.
	Q.input.joypadControls();

	Q.gravityX = Q.gravityY = 0;

	Q.SPRITE_NONE = 0;
	Q.SPRITE_PLAYER = 1;
	Q.SPRITE_COLLECTABLE = 2;
	Q.SPRITE_ENEMY = 4;
	Q.SPRITE_DOOR = 8;
	Q.SPRITE_BULLET = 16;
	Q.SPRITE_WALL = 32;


	Q.Sprite.extend('Player', {
		init: function(p){
			this._super(p, {
				sheet: 'player',
				sprite: 'player',
				x: 100,
				y: 100,
				vx: 1,
				vy: 1,
				speed: 64,
				animState: 0,
				type: Q.SPRITE_PLAYER,
				collisionMask: Q.SPRITE_WALL | Q.SPRITE_COLLECTABLE | Q.SPRITE_BULLET,
				health: 5,
				items: 0

			});

			this.animStates = {
				 0: 'standing',
			 	 1: 'run_right',
			 	 2: 'run_up',
			 	 4: 'run_left',
			 	 8: 'run_down',
			 	 3: 'run_dur',
			 	 6: 'run_dul',
			 	 9: 'run_ddr',
				12: 'run_ddl',
			};

			this.direct_right = 1;
			this.direct_up = 2;
			this.direct_left = 4;
			this.direct_down = 8;

			this.add('2d, animation');
			this.play( this.animStates[this.p.animState] );

			this.on('hit.sprite', function(collision){
				if(collision.obj.isA('Tower')){
					this.destroy();
				}
			});

			Q.input.on('W', this, 'goUp');
			Q.input.on('A', this, 'goLeft');
			Q.input.on('S', this, 'goDown');
			Q.input.on('D', this, 'goRight');
		},

		step: function(dt){
			this.p.vx = this.p.vy = 0;
			this.p.animState = 0;
			if( Q.inputs['W'] )
			{
				this.p.animState = this.p.animState | this.direct_up;
				this.p.vy = -this.p.speed;
			}
			if( Q.inputs['A'] )
			{
				this.p.animState = this.p.animState | this.direct_left;
				this.p.vx = -this.p.speed;
			}
			if( Q.inputs['S'] )
			{
				this.p.animState = this.p.animState | this.direct_down;
				this.p.vy =  this.p.speed;
			}
			if( Q.inputs['D'] )
			{
				this.p.animState = this.p.animState | this.direct_right;
				this.p.vx =  this.p.speed;
			}
			this.play( this.animStates[this.p.animState] );

			this.p.x += this.p.vx * dt;
			this.p.y += this.p.vy * dt;
		},

		goUp: function(){
			this.p.animState = 'run_up';
		},

		goDown: function(){
			this.p.animState = 'run_down';
		},

		goLeft: function(){
			this.p.animState = 'run_left';
		},

		goRight: function(){
			this.p.animState = 'run_right';
		},

		hit: function( dmg ){
			dmg = dmg || 1;
			this.p.health -= dmg;
			if( this.p.health <= 0 )
				this.destroy();
		},

		foundItem: function(){
			this.p.items += 1;
		}

	});

	Q.animations('player', {
		run_right: 	{ frames: [ 0,  1,  2,  3,  4,  5,  6], rate: 1/15 },
		run_up: 	{ frames: [ 7,  8,  9, 10, 11, 12, 13], rate: 1/15 },
		run_dur: 	{ frames: [14, 15, 16, 17, 18, 19, 20], rate: 1/15 },
		run_dul: 	{ frames: [21, 22, 23, 24, 25, 26, 27], rate: 1/15 },
		run_down: 	{ frames: [28, 29, 30, 31, 32, 33, 34], rate: 1/15 },
		run_ddr: 	{ frames: [35, 36, 37, 38, 39, 40, 41], rate: 1/15 },
		run_ddl: 	{ frames: [42, 43, 44, 45, 46, 47, 48], rate: 1/15 },
		run_left: 	{ frames: [49, 50, 51, 52, 53, 54, 55], rate: 1/15 },
		standing: 	{ frames: [28] }
	});

	Q.Sprite.extend('Enemy', {
		init: function(p){
			this._super(p, {
				sheet: 'player',
				sprite: 'player',
				x: 100,
				y: 100,
				vx: 1,
				vy: 1,
				speed: 32,
				target: this,
				type: Q.SPRITE_ENEMY,
				collisionMask: Q.SPRITE_WALL,
				projectile: null,
				ai: null
			});

			this.add('2d, animation');
			this.play('run_down');
		},

		step: function(dt){
			if(this.p.ai) {
				this.p.ai.step(dt);
			}
			// var laserData = {
			// 	x: ( this.p.x + this.p.w + 10 ),
			// 	y: ( this.p.y + this.p.h + 40 ),
			// 	vx: ( this.p.vx * 1.5 ),
			// 	vy: ( this.p.vy * 1.5 ),
			// 	shooter: this

			// }
		},

	});

	Q.Sprite.extend('Laser', {
		init: function(p){
			this._super(p, {
				asset: '/images/laser.png',
				x: 0,
				y: 0,
				vx: 0,
				vy: 0,
				speed: 100,
				target: this,
				range: 1000,
				distance: 0,
				collisionMask: Q.SPRITE_WALL | Q.SPRITE_PLAYER,
				shooter: null,
				type: Q.SPRITE_BULLET

			});
			this.add('2d');

			this.on('hit', function(collision){
				if(collision.obj.isA('Player')){
					if(this.p.shooter)
						this.p.shooter.p.projectile = null;
					this.destroy();
				} else if( collision.obj.p.type == Q.SPRITE_WALL ){
					if(this.p.shooter)
						this.p.shooter.p.projectile = null;
					this.destroy();
				}
			});
		},

		step: function(dt){
			this.p.x += this.p.vx * dt;
			this.p.y += this.p.vy * dt;
			step_size = Math.sqrt(this.p.vx * dt*this.p.vx * dt + this.p.vy * dt*this.p.vy * dt);
			this.distance += step_size;
			if(this.distance > this.range)
				this.destroy();
			else if(step_size < .1) {
				this.destroy();
			}
		}

	});

	Q.Sprite.extend('ShipItem', {
		init: function(p){
			this._super(p, {
				x: 400,
				y: 400,
				type: Q.SPRITE_COLLECTABLE,
				collisionMask: Q.SPRITE_PLAYER,
				asset: '/images/laser.png'
			});

			this.add('2d');

			this.on('hit.sprite', function(collision){
				if(collision.obj.isA('Player'))
				{
					collision.obj.foundItem();
					console.log(collision.obj.p.items);
					this.destroy();
				}
			})
		}
	})

	Q.Sprite.extend('Spawner', {
		init: function(p){
			this._super(p, {
				type: Q.SPRITE_NONE,
				collisionMask: Q.SPRITE_NONE,


			});

			this.timeCounter = 0;
		},

		step: function(dt){
			this.timeCounter += dt;
			if( this.timeCounter >= 5 ){
				this.spawnUnit();
				this.timeCounter = 0;
			}

		},

		spawnUnit: function(){
			var enemy = new Q.Enemy({ x: this.p.x, y: this.p.y });
			var ai = new Ai(enemy);
			ai.add(new Behavior_Follow(1, Q('Player').first(), 100));
			ai.add(new Behavior_Attack(1, Q('Player').first()));
			enemy.p.ai = ai;
			this.stage.insert(enemy);
		}
	});

	var player;
	Q.scene('level1', function(stage){
		
		Q.stageTMX('/levels/test-level.tmx', stage);
		
		player = Q('Player').first();
		var previous = player;
		var enemys = [];
		for(var i =0; i< 5; i++) {
			var enemy = stage.insert(new Q.Enemy({ x: 110+100*i, y: 110+100*i, target: previous, speed: 100 }));
			var ai = new Ai(enemy);
			ai.add(new Behavior_Follow(1, previous, 100));
			ai.add(new Behavior_Attack(1, player));
			enemy.p.ai = ai;
			enemys.push( enemy );
			previous = enemys[i];
		}
		
		stage.insert(new Q.ShipItem());
		stage.insert(new Q.Spawner({ x: 600, y: 600 }));

		stage.add('viewport').follow(Q('Player').first());

	});

	Q.loadTMX(['/images/dragon_hit1.png', 
			'/images/laser.png', 
			'/levels/test-level.tmx',
			'/images/tiles.png'
		], function(){
		Q.sheet('player', '/images/dragon_hit1.png', {
			tilew: 67.71,
			tileh: 67.75,
			sx: 0,
			sy: 0
		});

		Q.stageScene('level1');
	});









	//setup ai stuff ==============================
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
		this.range = range || 100;
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
		this.state = 0;
	}

	Behavior_Attack.prototype.step = function(dT, thisAi) {
		this.time_elapsed += dT;
		if(this.state < 3) {
			if(this.time_elapsed > 0.7) {
				this.time_elapsed = 0;
				thisAi.add(new Behavior_Shoot(1, this.target.p.x, this.target.p.y, 100, 100));
				this.state++;
			}
		} else if(this.state == 3) {
			if(this.time_elapsed > 2) {
				this.time_elapsed = 0;
				thisAi.add(new Behavior_Shoot(1, this.target.p.x, this.target.p.y, 100, 100));
				this.state=0;
			}
		}
	}

	//end ai stuff ===================================================
});