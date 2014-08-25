Q.animations('player', {
    idle:       { frames: [0] },
    walk_right: { frames: [0,1,2,3,4], rate: 1/3, loop: true },
    walk_left:  { frames: [9,8,7,6,5], rate: 1/3, loop: true }
});

Q.animations('portal', {
    idle:       { frames: [4,5,6], rate: 1/4 },
    close:      { frames: [0,1,2,3], rate: 1/4, loop: false }
});

Q.animations('robot', {
    idle:       { frames: [0] },
    walk_right: { frames: [0,1,2,3,4], rate: 1/3, loop: true },
    walk_left:  { frames: [9,8,7,6,5], rate: 1/3, loop: true }
});

Q.animations('lasers', {
    idle:       { frames: [0] },
    flying:     { frames: [0,1,2,3], rate: 1/4 }
});

Q.animations('tilemap', {
	turkey: 	{ frames: [39] },
	dynamite: 	{ frames: [49] }
});