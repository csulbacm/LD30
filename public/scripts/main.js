
var Q = Quintus({ development: true, audioSupported: ['mp3'] });

       Q.include('Sprites, Scenes, Input, 2D, Anim, UI, TMX, Touch, Audio')
        .setup({ maximize: true })
        .controls(true)
        .touch(Q.SPRITE_ALL)
        .enableSound();


Q.input.keyboardControls({
    87: 'up',       // W
    65: 'left',     // A
    83: 'down',     // S
    68: 'right',    // D
    70: 'action',   // F
});

Q.input.touchControls();
Q.input.mouseControls({ cursor: 'on' });
// Q.input.joypadControls();

Q.gravityX = Q.gravityY = 0;

Q.SPRITE_NONE = 0;
Q.SPRITE_DOOR = 1;
Q.SPRITE_COLLECTABLE = 2;
Q.SPRITE_ENEMY = 4;
Q.SPRITE_PLAYER = 8;
Q.SPRITE_BULLET = 16;
Q.SPRITE_WALL = 32;

Q.levels = [
	'level1',
	'level2',
	'level3'
];

Q.astar = null;


Q.el.addEventListener('mousedown', function(){
    var player = Q('Player').first();
    if( player ) {
        player.shoot();

		// switch (Math.floor(Math.random() * (3))) {
		// 	case 0: Q.audio.play("/sounds/p1.mp3"); break;
		// 	case 1: Q.audio.play("/sounds/p3.mp3"); break;
		// 	case 2: Q.audio.play("/sounds/p4.mp3"); break;
		// }
    }
});

Q.loadTMX(['/images/laser.png', 
        '/levels/test-level.tmx',
        '/levels/test-level2.tmx',
        '/images/tiles.png',
        '/images/portals.png',
        '/images/robots.png',
        '/images/lasers.png',
        '/images/player.png',
        '/images/TILEMAP.png',
        '/levels/map03.tmx',
        '/sounds/p0.mp3', 	// a
        '/sounds/p1.mp3',	// c
        '/sounds/p2.mp3',	// d
        '/sounds/p3.mp3',	// e
        '/sounds/p4.mp3',	// g
    ], function(){
    Q.sheet('player', '/images/player.png', {
        tilew: 64,
        tileh: 64,
        sx: 0,
        sy: 0,
        spacingX: 1,
        spacingY: 2,
    });

    Q.sheet('portal', '/images/portals.png', {
        tilew:  142,
        tileh:  145,
        sx:     0,
        sy:     0,
    });

    Q.sheet('robot', '/images/robots.png', {
        tilew: 64,
        tileh: 67,
        sx: 0,
        sy: 2,
    });

    Q.sheet('lasers', '/images/lasers.png', {
        tilew: 64,
        tileh: 48,
        sx: 0,
        sy: 8,
    });

    Q.stageScene('level1');
    Q.astar = new Astar();
    Q.GameState.level = 0;
});