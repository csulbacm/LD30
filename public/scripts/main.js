window.addEventListener("load",function() {
	var Q = Quintus({ development: true })
			.include('Sprites, Scenes, Input, 2D, Anim, UI')
			.setup({ maximize: true });

	Q.input.keyboardControls({
		87: 'W',
		65: 'A',
		83: 'S',
		68: 'D'
	});
	Q.input.joypadControls();

	Q.gravityX = Q.gravityY = 0;

	Q.SPRITE_NONE = 0;
	Q.SPRITE_PLAYER = 1;
	Q.SPRITE_COLLECTABLE = 2;
	Q.SPRITE_ENEMY = 4;
	Q.SPRITE_DOOR = 8;

	Q.Sprite.extend('Player', {
		init: function(p){
			this._super(p, {
				sheet: 'player',
				sprite: 'player',
				x: 100,
				y: 100,
				vx: 1,
				vy: 1,
				speed: 100,
				animState: 0,
				animStates: {
					 0: 'standing',
				 	 1: 'run_right',
				 	 2: 'run_up',
				 	 4: 'run_left',
				 	 8: 'run_down',
				 	 3: 'run_dur',
				 	 6: 'run_dul',
				 	 9: 'run_ddr',
					12: 'run_ddl',
				},

				direct_right: 1,
				direct_up: 2,
				direct_left: 4,
				direct_down: 8,
				type: Q.SPRITE_PLAYER

			});

			this.add('2d, animation');
			this.play( this.p.animStates[this.p.animState] );

			this.on('hit.sprite', function(collision){
				if(collision.obj.isA('Tower')){
					//Q.stageScene('endGame', 1, { label: 'You Won' });
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
				this.p.animState = this.p.animState | this.p.direct_up;
				this.p.vy = -this.p.speed;
			}
			if( Q.inputs['A'] )
			{
				this.p.animState = this.p.animState | this.p.direct_left;
				this.p.vx = -this.p.speed;
			}
			if( Q.inputs['S'] )
			{
				this.p.animState = this.p.animState | this.p.direct_down;
				this.p.vy =  this.p.speed;
			}
			if( Q.inputs['D'] )
			{
				this.p.animState = this.p.animState | this.p.direct_right;
				this.p.vx =  this.p.speed;
			}
			this.play( this.p.animStates[this.p.animState] );

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

	Q.Sprite.extend('Follower', {
		init: function(p){
			this._super(p, {
				sheet: 'player',
				sprite: 'player',
				x: 100,
				y: 100,
				vx: 1,
				vy: 1,
				speed: 100,
				animState: 0,
				animStates: {
					 0: 'standing',
				 	 1: 'run_right',
				 	 2: 'run_up',
				 	 4: 'run_left',
				 	 8: 'run_down',
				 	 3: 'run_dur',
				 	 6: 'run_dul',
				 	 9: 'run_ddr',
					12: 'run_ddl',
				},

				direct_right: 1,
				direct_up: 2,
				direct_left: 4,
				direct_down: 8,
				target: this,
				type: Q.SPRITE_ENEMY,
				collisionMask: Q.SPRITE_NONE

			});
			this.add('2d, animation');
			this.play( this.p.animStates[this.p.animState] );

			this.on('hit.sprite', function(collision){
				if(collision.obj.isA('Tower')){
					//Q.stageScene('endGame', 1, { label: 'You Won' });
					this.destroy();
				}
			});
		},

		step: function(dt){
			this.p.vx = this.p.vy = 0;
			this.p.animState = 0;

			this.p.vx = (this.p.target.p.x - this.p.x) / 2;
			this.p.vy = (this.p.target.p.y - this.p.y) / 2;

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
		}

	});

	Q.animations('player', {
		run_right: 	{ frames: [ 0,  1,  2,  3,  4,  5,  6], rate: 1/10 },
		run_up: 	{ frames: [ 7,  8,  9, 10, 11, 12, 13], rate: 1/10 },
		run_dur: 	{ frames: [14, 15, 16, 17, 18, 19, 20], rate: 1/10 },
		run_dul: 	{ frames: [21, 22, 23, 24, 25, 26, 27], rate: 1/10 },
		run_down: 	{ frames: [28, 29, 30, 31, 32, 33, 34], rate: 1/10 },
		run_ddr: 	{ frames: [35, 36, 37, 38, 39, 40, 41], rate: 1/10 },
		run_ddl: 	{ frames: [42, 43, 44, 45, 46, 47, 48], rate: 1/10 },
		run_left: 	{ frames: [49, 50, 51, 52, 53, 54, 55], rate: 1/10 },
		standing: 	{ frames: [28] }
	});

	Q.scene('level1', function(stage){
		var player = stage.insert(new Q.Player());
		//var player2 = stage.insert(new Q.Follower({ x: 110, y: 110, target: player}));
		//var followers = new Array[];
		var previous = player;
		var followers = [];
		for(var i =0; i< 50; i++) {
			followers.push( stage.insert(new Q.Follower({ x: 110+100*i, y: 110+100*i, target: previous})) );
			previous = followers[i];
		}
		stage.add('viewport').follow(player);
	});

	Q.load('/images/dragon_hit1.png', function(){
		Q.sheet('player', '/images/dragon_hit1.png', {
			tilew: 67.71,
			tileh: 67.75,
			sx: 0,
			sy: 0
		});

		Q.stageScene('level1');
	});
});