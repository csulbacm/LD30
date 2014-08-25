Q.animations('player', {
    /*
    run_right:  { frames: [ 0,  1,  2,  3,  4,  5,  6], rate: 1/15 },
    run_up:     { frames: [ 7,  8,  9, 10, 11, 12, 13], rate: 1/15 },
    run_dur:    { frames: [14, 15, 16, 17, 18, 19, 20], rate: 1/15 },
    run_dul:    { frames: [21, 22, 23, 24, 25, 26, 27], rate: 1/15 },
    run_down:   { frames: [28, 29, 30, 31, 32, 33, 34], rate: 1/15 },
    run_ddr:    { frames: [35, 36, 37, 38, 39, 40, 41], rate: 1/15 },
    run_ddl:    { frames: [42, 43, 44, 45, 46, 47, 48], rate: 1/15 },
    run_left:   { frames: [49, 50, 51, 52, 53, 54, 55], rate: 1/15 },
    standing:   { frames: [28] }
    */
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