
var Q = Quintus({ development: true });

       Q.include('Sprites, Scenes, Input, 2D, Anim, UI, TMX, Touch')
        .setup({ width: 800, height: 600 })
        .controls(true)
        .touch(Q.SPRITE_ALL);

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
Q.SPRITE_PLAYER = 1;
Q.SPRITE_COLLECTABLE = 2;
Q.SPRITE_ENEMY = 4;
Q.SPRITE_DOOR = 8;
Q.SPRITE_BULLET = 16;
Q.SPRITE_WALL = 32;

Q.levels = [
	'level3',
    'level1',
    'level2',
];

Q.astar = null;


Q.el.addEventListener('mousedown', function(){
    var player = Q('Player').first();
    if( player )
        player.shoot();
});

Q.el.addEventListener('mousemove', function(){
    Q("Player").first().p.mouseMoved = true;
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
        /*
        tilew: 64,
        tileh: 48,
        sx: 0,
        sy: 8,
        */
        tilew: 3,
        tileh: 36,
        sx: 29,
        sy: 14,
    });

    Q.sheet('tilemap', '/images/TILEMAP.png', {
    	tilew: 64,
    	tileh: 64
    });

    Q.GameState.level = 0;
    Q.stageScene( Q.levels[Q.GameState.level] );
    Q.astar = new Astar();
}, {
    progressCallback: function(loaded, total){
        // TODO: Get this working right. Meant to display a progress bar for asset loading.
        var loadingPercent = Math.floor(loaded/total*100);
        document.getElementById('loading-label').innerHTML = 'Loading: ' + loadingPercent + '%';
        if( loaded == total )
            document.getElementById('loading-label').remove();
    }
});