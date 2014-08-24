Q.Sprite.extend('Player', {
	init: function(p){
		this._super(p, {
			sheet: 'player',
			sprite: 'player',
			x: 100,
			y: 100,
			w: 64,
			h: 64,
			vx: 1,
			vy: 1,
			speed: 64,
			animState: 0,
			type: Q.SPRITE_PLAYER,
			collisionMask: Q.SPRITE_WALL | Q.SPRITE_COLLECTABLE | Q.SPRITE_BULLET,
			health: 10,
			items: 0,
			sensor: true

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

		Q.input.on('up', this, 'goUp');
		Q.input.on('left', this, 'goLeft');
		Q.input.on('down', this, 'goDown');
		Q.input.on('right', this, 'goRight');
	},

	step: function(dt){
		this.p.vx = this.p.vy = 0;
		this.p.animState = 0;
		if( Q.inputs['up'] )
		{
			this.p.animState = this.p.animState | this.direct_up;
			this.p.vy = -this.p.speed;
		}
		if( Q.inputs['left'] )
		{
			this.p.animState = this.p.animState | this.direct_left;
			this.p.vx = -this.p.speed;
		}
		if( Q.inputs['down'] )
		{
			this.p.animState = this.p.animState | this.direct_down;
			this.p.vy =  this.p.speed;
		}
		if( Q.inputs['right'] )
		{
			this.p.animState = this.p.animState | this.direct_right;
			this.p.vx =  this.p.speed;
		}
		this.play( this.animStates[this.p.animState] );

		this.p.x += this.p.vx * dt;
		this.p.y += this.p.vy * dt;
		this.shoot();
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
		//if( this.p.health <= 0 )
		//	this.destroy();
	},

	foundItem: function(){
		this.p.items += 1;
	},

	shoot: function(){
		var dx = (Q.inputs['mouseX'] - this.p.x);
		var dy = (Q.inputs['mouseY'] - this.p.y);
		var angle = ((Math.atan2(dy, dx) * 180/Math.PI))
		
		dx = Math.cos(angle*Math.PI/180)*200;
		dy = Math.sin(angle*Math.PI/180)*200;

		var laser = new Q.Laser({ x: this.p.x, y: this.p.y,vx:dx, vy:dy, angle: angle+90, shooter: this});
		this.stage.insert(laser);
	}

});

Q.Sprite.extend('Enemy', {
	init: function(p){
		this._super(p, {
			sheet: 'robot',
			sprite: 'robot',
			x: 100,
			y: 100,
			vx: 1,
			vy: 1,
			speed: 32,
			health: 2,
			target: this,
			type: Q.SPRITE_ENEMY,
			collisionMask: Q.SPRITE_WALL | Q.SPRITE_BULLET,
			projectile: null,
			ai: null,
			sensor: true,
			animState: {
				 0: 'walk_left',
				 1: 'idle',
				 2: 'walk_right'
			}
		});

		this.add('2d, animation');
		this.play('walk_right');
	},

	step: function(dt){
		if(this.p.ai) {
			this.p.ai.step(dt);
		}
		
		if( this.p.vx < 0 )
			this.play('walk_left');
		else if( this.p.vy > 0 )
			this.play('walk_right');
		else if( this.p.vx == 0 )
			this.play('idle');
	},

	hit: function( dmg ){
		dmg = dmg || 1;
		this.p.health -= dmg;
		if( this.p.health <= 0 )
			this.destroy();
	}

});

Q.Sprite.extend('Laser', {
	init: function(p){
		this._super(p, {
			//asset: '/images/laser.png',
			sheet: 'lasers',
			sprite: 'lasers',
			x: 0,
			y: 0,
			w: 26,
			h: 48,
			vx: 0,
			vy: 0,
			speed: 200,
			target: this,
			range: 1000,
			distance: 0,
			collisionMask: Q.SPRITE_WALL | Q.SPRITE_PLAYER | Q.SPRITE_ENEMY,
			sensor: true,
			shooter: null,
			type: Q.SPRITE_BULLET
		});
		this.add('2d, animation');
		this.play('flying');

		this.on('sensor', function(collision) {
			if(collision.obj){
				if(collision.obj.isA('Player') || collision.obj.isA('Enemy')){
					if(collision.obj != this.p.shooter){
						collision.obj.p.hit( 1 );
						this.destroy();
					}
				}
				else if( collision.obj.p.type == Q.SPRITE_WALL ){
					if(this.p.shooter)
						this.p.shooter.p.projectile = null;
					this.destroy();
				}

			}
		});
		
		this.on('hit', function(collision){
			if(collision.obj.isA('Player') || collision.obj.isA('Enemy')){
				if(collision.obj != this.p.shooter){
					collision.obj.hit( 1 );
					this.destroy();
				}
			}
			else if( collision.obj.p.type == Q.SPRITE_WALL ){
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
			sheet:  'portal',
			sprite: 'portal',
			type: Q.SPRITE_NONE,
			collisionMask: Q.SPRITE_NONE,
			asset: '/images/laser.png'

		});

		this.add('2d, animation');
		this.play('idle')
		this.timeCounter = 0;
		this.on('mouseup', function(){
			console.log('mousedown event');
		})
	},

	step: function(dt){
		this.timeCounter += dt;
		if( this.timeCounter >= 10 ){
			this.spawnUnit();
			this.timeCounter = 0;
		}
	},

	spawnUnit: function(){
		var enemy = new Q.Enemy({ x: this.p.x, y: this.p.y });
		console.log( enemy.p.x );
		console.log( enemy.p.y );
		var ai = new Ai(enemy);
		ai.add(new Behavior_Follow(1, Q('Player').first(), 100));
		ai.add(new Behavior_Attack(1, Q('Player').first()));
		enemy.p.ai = ai;
		this.stage.insert(enemy);
	}
});