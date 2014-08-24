
var Q = Quintus({ development: true });

	   Q.include('Sprites, Scenes, Input, 2D, Anim, UI, TMX, Touch')
		.setup({ maximize: true })
		.controls(true)
		.touch(Q.SPRITE_ALL);

Q.input.keyboardControls({
	87: 'up',	// W
	65: 'left',	// A
	83: 'down',	// S
	68: 'right'	// D
});

Q.input.touchControls();
Q.input.mouseControls({ cursor: 'on' });

// Joypads don't seem to work.
// Q.input.joypadControls();

Q.gravityX = Q.gravityY = 0;

Q.SPRITE_NONE = 0;
Q.SPRITE_PLAYER = 1;
Q.SPRITE_COLLECTABLE = 2;
Q.SPRITE_ENEMY = 4;
Q.SPRITE_DOOR = 8;
Q.SPRITE_BULLET = 16;
Q.SPRITE_WALL = 32;


Q.el.addEventListener('mousedown', function(){
	var player = Q('Player').first();
	if( player )
		player.shoot();
});

Q.scene('level1', function(stage){
	
	Q.stageTMX('/levels/test-level2.tmx', stage);
	
	var player = Q('Player').first();
	var previous = player;
	var enemys = [];

	for(var i =0; i< 5; i++) {
		var enemy = stage.insert(new Q.Enemy({ x: 110+100*i, y: 110+100*i, target: previous, speed: 100 }));
		var ai = new Ai(enemy);
		ai.add(new Behavior_Follow(1, player, 100));
		ai.add(new Behavior_Attack(1, player));
		enemy.p.ai = ai;
		enemys.push( enemy );
		previous = enemys[i];
	}

	stage.insert(new Q.ShipItem());

	stage.add('viewport').follow(Q('Player').first());

});

Q.loadTMX(['/images/dragon_hit1.png', 
		'/images/laser.png', 
		'/levels/test-level.tmx',
		'/levels/test-level2.tmx',
		'/images/tiles.png',
		'/images/portals.png'
	], function(){
	
	Q.sheet('player', '/images/dragon_hit1.png', {
		tilew: 67.71,
		tileh: 67.75,
		sx: 	   0,
		sy: 	   0
	});

	Q.sheet('portal', '/images/portals.png', {
		tilew:  142,
		tileh:  145,
		sx: 	0,
		sy: 	0,
	});

	Q.stageScene('level1');
});