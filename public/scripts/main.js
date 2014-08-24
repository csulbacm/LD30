
var Q = Quintus({ development: true });

       Q.include('Sprites, Scenes, Input, 2D, Anim, UI, TMX, Touch')
        .setup({ maximize: true })
        .controls(true)
        .touch(Q.SPRITE_ALL);

Q.input.keyboardControls({
    87: 'up',       // W
    65: 'left',     // A
    83: 'down',     // S
    68: 'right',    // D
    70: 'activate', // F
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

Q.levels = [
	'level1',
	'level2'
];


Q.el.addEventListener('mousedown', function(){
    var player = Q('Player').first();
    if( player )
        player.shoot();
});

Q.scene('level1', function(stage){
    
    Q.stageTMX('/levels/test-level.tmx', stage);
    
    /*
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
    */
    stage.insert(new Q.ShipItem());

    stage.add('viewport').follow(Q('Player').first());
    Q.stageScene('hud', 1, { health: Q('Player').first().p.health, portals: Q('Spawner').length });
});

Q.scene('hud', function(stage){

	var containerLeft = stage.insert(new Q.UI.Container({
		fill: 'black',
		border: 5,
		shadow: 10,
		shadowColor: 'rgb(0,0,0,5)',
		x: 120,
		y: 50
	}));

	containerLeft.insert(new Q.UI.Text({
    	label: 'Health: ' + stage.options.health,
    	color: 'green'
    }));

	var containerRight = stage.insert(new Q.UI.Container({
		fill: 'black',
		border: 5,
		shadow: 10,
		shadowColor: 'rgb(0,0,0,5)',
		x:  (Q.width - 140),
		y: 50
	}));

	containerRight.insert( new Q.UI.Text({
		label: 'Portals: ' + stage.options.portals,
		color: 'green'
	}));

    containerLeft.fit(20,20);
    containerRight.fit(20,20);
});

Q.scene('level2', function(stage){
    Q.stageTMX('/levels/test-level2.tmx', stage);
    stage.add('viewport').follow(Q('Player').first());
    Q.stageScene('hud', 1, { health: Q('Player').first().p.health, portals: Q('Spawner').length });
});

Q.scene('GameOver', function(stage){
	Q.stage(0).pause();
	var container = stage.insert(new Q.UI.Container({
		fill: 'white',
		border: 5,
		shadow: 10,
		shadowColor: 'rgb(0,0,0,5)',
		x: Q.width/2,
		y: Q.height/2
	}));

	var button = container.insert(new Q.UI.Button({
		label: 'Continue?',
		x: 0,
		y: 0,
		border: 5,
		fill: '#CCCCCC'
	}, function(){
		Q.clearStages();
		Q.GameState.level = 0;
		Q.stageScene( Q.levels[ Q.GameState.level ] );
	}));

	container.insert(new Q.UI.Text({
		label: 'Game Over',
		x: 0,
		y: -10 - button.p.h
	}));

	container.fit(20);
});

Q.scene('NextLevel', function(stage){
	Q.stage(0).pause();
	var container = stage.insert(new Q.UI.Container({
		fill: 'white',
		border: 5,
		shadow: 10,
		shadowColor: 'rgb(0,0,0,5)',
		x: Q.width/2,
		y: Q.height/2
	}));

	var button = container.insert(new Q.UI.Button({
		label: 'Continue',
		x: 0,
		y: 0,
		border: 5,
		fill: '#CCCCCC'
	}, function(){
		Q.clearStages();
		
		if( stage.options.levelOffset )
			Q.GameState.level += stage.options.levelOffset;
		else
			Q.GameState.level += 1;

		if( Q.GameState.level >= Q.levels.length )
			Q.GameState.level = Q.levels.length - 1;
		Q.stageScene( Q.levels[ Q.GameState.level ] );
	}));

	var button2 = container.insert(new Q.UI.Button({
		label: 'Restart',
		x: 0,
		y: 10 + button.p.h,
		border: 5,
		fill: '#CCCCCC'
	}, function(){
		Q.clearStages();
		Q.GameState.level = 0;
		Q.stageScene( Q.levels[ Q.GameState.level ] );
	}));

	container.insert(new Q.UI.Text({
		label: 'Continue to Next Level?',
		x: 0,
		y: -10 - button.p.h - button2.p.h
	}));

	container.fit(20);
})

Q.loadTMX(['/images/dragon_hit1.png', 
        '/images/laser.png', 
        '/levels/test-level.tmx',
        '/levels/test-level2.tmx',
        '/images/tiles.png',
        '/images/portals.png',
        '/images/robots.png',
        '/images/lasers.png'
    ], function(){
    
    Q.sheet('player', '/images/dragon_hit1.png', {
        tilew: 67.71,
        tileh: 67.75,
        sx: 0,
        sy: 0
    });

    Q.sheet('portal', '/images/portals.png', {
        tilew:  142,
        tileh:  145,
        sx:     0,
        sy:     0,
    });

    Q.sheet('robot', '/images/robots.png', {
        tilew: 61,
        tileh: 75,
        sx: 0,
        sy: 0,
    });

    Q.sheet('lasers', '/images/lasers.png', {
        tilew: 64,
        tileh: 48,
        sx: 0,
        sy: 8,
    });

    Q.stageScene('level2');
    Q.GameState.level = 0;
});