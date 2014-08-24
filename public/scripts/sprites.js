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
			speed: 200,
			animState: 0,
			type: Q.SPRITE_PLAYER,
			collisionMask: Q.SPRITE_WALL | Q.SPRITE_COLLECTABLE | Q.SPRITE_BULLET | Q.SPRITE_DOOR,
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

		this.lastShotTime = 0;
		this.portalTouching;

		this.add('2d, animation');
		this.play( this.animStates[this.p.animState] );

		this.on('sensor', this.collisionCheck);

		this.on('hit.sprite', this.collisionCheck);

		Q.input.on('up', this, 'goUp');
		Q.input.on('left', this, 'goLeft');
		Q.input.on('down', this, 'goDown');
		Q.input.on('right', this, 'goRight');
		Q.input.on('activate', this, 'closePortal');
	},

	collisionCheck: function(collision){
		if( collision.obj )
		{
			if( collision.obj.isA('Spawner') )
				this.portalTouching = collision.obj;
			else if( collision.obj.isA('ShipItem') )
			{
				this.foundItem();
				collision.obj.destroy();
			}
		}

	},

	closePortal: function(){
		if( this.portalTouching )
		{
			this.portalTouching.closePortal();
			console.log('Portals Left: ' + Q('Spawner').length);
		}
	},

	step: function(dt){
		this.portalTouching = null;
		this.p.vx = this.p.vy = 0;
		this.p.animState = 0;
		this.lastShotTime += dt;
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

		if( this.lastShotTime > 0.25 )
		{
			this.lastShotTime = 0;
			this.shoot();
		}
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
			this.kill();
	},

	kill: function(){
		this.stage.unfollow( this );
		this.destroy();
		Q.stageScene( Q.GameState.level );
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
		});

		this.add('2d, animation');
		this.play('walk_left');
	},

	step: function(dt){

		if(this.p.ai) {
			this.p.ai.step(dt);
			if( this.p.vx < 0 )
				this.play('walk_left');
			else if( this.p.vx > 0 )
				// TODO: Fix this by getting Suzy to flip sprites on sheet. Quintus flipping seems to be janky.
				this.play('walk_right');
			else
				this.play('idle');
		}
		
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
			type: Q.SPRITE_BULLET,
			collisionMask: Q.SPRITE_WALL | Q.SPRITE_PLAYER | Q.SPRITE_ENEMY,
			sensor: true,
			shooter: null,
		});
		this.add('2d, animation');
		this.play('flying');

		this.on('sensor', this.collisionCheck);
		this.on('hit', this.collisionCheck);
	},

	collisionCheck: function(collision){
		if( collision.obj ){
			if(collision.obj.isA('Player') || collision.obj.isA('Enemy')){
				console.log( this );
				if(collision.obj != this.p.shooter && collision.obj.p.type != this.p.shooter.p.type){
					collision.obj.hit( 1 );
					this.destroy();
				}
			}
			else if( collision.obj.p.type == Q.SPRITE_WALL ){
				if(this.p.shooter)
					this.p.shooter.p.projectile = null;
				this.destroy();
			}
		}
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
			y: 550,
			type: Q.SPRITE_COLLECTABLE,
			collisionMask: Q.SPRITE_PLAYER,
			asset: '/images/laser.png'
		});

		this.add('2d');
	}
})

Q.Sprite.extend('Spawner', {
	init: function(p){
		this._super(p, {
			sheet:  'portal',
			sprite: 'portal',
			w: 142,
			h: 145,
			type: Q.SPRITE_DOOR,
			collisionMask: Q.SPRITE_PLAYER,
			sensor: true,
			collision: false,
			asset: '/images/laser.png',
			dead: false,
			startDeadTimer: 0
		});

		this.add('2d, animation');
		this.play('idle')
		this.timeCounter = 0;
	},

	step: function(dt){
		this.timeCounter += dt;
		if( this.timeCounter >= 2.5 ){
			this.spawnUnit();
			this.timeCounter = 0;
		}

		if( this.isDead() )
		{
			this.p.startDeadTimer += dt;
			if( this.p.startDeadTimer >= 1 )
				this.destroy();
		}
	},

	spawnUnit: function(){
		var enemy = new Q.Enemy({ x: this.p.x, y: this.p.y });
		var ai = new Ai(enemy);
		ai.add(new Behavior_Follow(1, Q('Player').first(), 100));
		ai.add(new Behavior_Attack(1, Q('Player').first()));
		enemy.p.ai = ai;
		this.stage.insert(enemy);
	},

	closePortal: function(){
		this.play('close');
		this.p.dead = true;
	},

	isDead: function(){
		return this.p.dead;
	}
});