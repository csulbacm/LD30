Q.scene('hud', function(stage){
	var containerLeft = stage.insert(new Q.UI.Container({
		fill: 'black',
		border: 5,
		shadow: 10,
		shadowColor: 'rgb(0,0,0,5)',
		x: 120,
		y: 50
	}));

	var healthText = containerLeft.insert(new Q.UI.Text({
    	label: 'Health: ' + stage.options.health,
    	color: 'green'
    }));

    containerLeft.insert(new Q.UI.Text({
    	label: 'Lives: ' + Q.GameState.lives,
    	color: 'green',
    	x: 40 + healthText.p.w
    }));

	var containerRight = stage.insert(new Q.UI.Container({
		fill: 'black',
		border: 5,
		shadow: 10,
		shadowColor: 'rgb(0,0,0,5)',
		x:  (Q.width - 300),
		y: 50
	}));

	var portalsText = containerRight.insert( new Q.UI.Text({
		label: 'Portals: ' + stage.options.portals,
		color: 'green'
	}));

	containerRight.insert( new Q.UI.Text({
		label: 'Dynamite: ' + stage.options.items,
		color: 'green',
		x: 40 + portalsText.p.w
	}));

    containerLeft.fit(20,20);
    containerRight.fit(20,20);
});


Q.scene('level1', function(stage){
    Q.stageTMX('/levels/test-level2.tmx', stage);
    stage.add('viewport').follow(Q('Player').first());
    Q.stageScene('hud', 1, { health: Q('Player').first().p.health, items: Q('Player').first().p.items, portals: Q('Spawner').length });
});

Q.scene('level2', function(stage){
    Q.stageTMX('/levels/test-level.tmx', stage);
    stage.add('viewport').follow(Q('Player').first());
    Q.stageScene('hud', 1, { health: Q('Player').first().p.health, items: Q('Player').first().p.items, portals: Q('Spawner').length });
});

Q.scene('level3', function(stage){
    
    Q.stageTMX('/levels/map03.tmx', stage);

    stage.add('viewport').follow(Q('Player').first());
    Q.stageScene('hud', 1, { health: Q('Player').first().p.health, items: Q('Player').first().p.items, portals: Q('Spawner').length });
});

Q.scene('big', function(stage){
    Q.stageTMX('/levels/big-test.tmx', stage);
    stage.add('viewport').follow(Q('Player').first());
    stage.insert(new Q.HealthPup({ x: 600, y: 550, healthAmount: 10 }));
    Q.stageScene('hud', 1, { health: Q('Player').first().p.health, portals: Q('Spawner').length });
});

Q.scene('GameOver', function(stage){
	Q.stage(0).pause();

	var textLabel = stage.options.textLabel || 'You Died';
	var buttonLabel = stage.options.buttonLabel || 'Continue?';

	if( Q.GameState.lives <= 0 )
		textLabel = 'Game Over';

	var container = stage.insert(new Q.UI.Container({
		fill: 'white',
		border: 5,
		shadow: 10,
		shadowColor: 'rgb(0,0,0,5)',
		x: Q.width/2,
		y: Q.height/2
	}));

	var button = container.insert(new Q.UI.Button({
		label: buttonLabel,
		x: 0,
		y: 0,
		border: 5,
		fill: '#CCCCCC'
	}, function(){
		Q.clearStages();
		if( Q.GameState.lives <= 0 )
			Q.GameState.level = 0;
		Q.stageScene( Q.levels[ Q.GameState.level ] );
	}));

	container.insert(new Q.UI.Text({
		label: textLabel,
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

	container.fit(20,20);
});