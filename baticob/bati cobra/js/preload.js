
var game = new Phaser.Game(400, 625, Phaser.CANVAS, '', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('paper', 'assets/images/paper.png');
    game.load.image('paper', 'assets/images/paper2.png');
    game.load.image('hoop', 'assets/images/trash.png');
    game.load.image('background', 'assets/images/background.png');
		game.load.image('side rim', 'assets/images/side_rim.png');
		game.load.image('front rim', 'assets/images/front_rim.png');
    
        game.load.image('win0', 'assets/images/win0.png');
		game.load.image('win1', 'assets/images/win1.png');
		game.load.image('win2', 'assets/images/win2.png');
		game.load.image('win3', 'assets/images/win3.png');
		game.load.image('win4', 'assets/images/win4.png');
		game.load.image('lose0', 'assets/images/lose0.png');
		game.load.image('lose1', 'assets/images/lose1.png');
		game.load.image('lose2', 'assets/images/lose2.png');
		game.load.image('lose3', 'assets/images/lose3.png');
		game.load.image('lose4', 'assets/images/lose4.png');

		game.load.audio('score', 'assets/audio/score.wav');
		game.load.audio('backboard', 'assets/audio/backboard.wav');
		game.load.audio('whoosh', 'assets/audio/whoosh.wav');
		game.load.audio('fail', 'assets/audio/fail.wav');
		game.load.audio('spawn', 'assets/audio/spawn.wav');

}
//
//var hoop,
// 		left_rim,
// 		right_rim,
// 		paper,
// 		front_rim,
// 		score = 0,
// 		score_text,
// 		high_score = 0,
// 		high_score_text,
// 		best_text;
//
//var score_sound,
//		backboard,
//		whoosh,
//		fail,
//		spawn;
//
//var moveInTween,
//		fadeInTween,
//		moveOutTween,
//		fadeOutTween,
//		emoji,
//		emojiName;
//
//var collisionGroup;

function create() {
       this.game.stage.backgroundColor = "#eee";
           this.background = this.game.add.tileSprite(0, 0, this.game.width, 912, 'background');
   //     this.background.autoScroll(-100,0);

	game.physics.startSystem(Phaser.Physics.P2JS);

	game.physics.p2.setImpactEvents(true);

  game.physics.p2.restitution = 0.63;
  game.physics.p2.gravity.y = 0;

	collisionGroup = game.physics.p2.createCollisionGroup();

	score_sound = game.add.audio('score');
	backboard = game.add.audio('backboard');
	backboard.volume = 0.5;
	whoosh = game.add.audio('whoosh');
	fail = game.add.audio('fail');
	fail.volume = 0.1;
	spawn = game.add.audio('spawn');

	game.stage.backgroundColor = "#ffffff";

	 //high_score_text = game.add.text(450, 25, 'High Score\n' + high_score, { font: 'Arial', fontSize: '32px', fill: '#000', align: 'center' });
	score_text = game.add.text(207, 312, '', { font: 'Arial', fontSize: '40px', fill: '#000', align: 'center' }); // 300, 500
	best_text = game.add.text(143, 281, '', { font: 'Arial', fontSize: '20px', fill: '#000', align: 'center' });// 230, 450
	best_score_text = game.add.text(200, 312, '', { font: 'Arial', fontSize: '40px', fill: '#00e6e6', align: 'center' }); // 300, 500

	hoop = game.add.sprite(88, 50, 'hoop'); // 141, 100
	left_rim = game.add.sprite(130, 95, 'side rim'); // 241, 296
	right_rim = game.add.sprite(275, 95, 'side rim'); // 398, 296

	game.physics.p2.enable([ left_rim, right_rim], false);

	left_rim.body.setCircle(5.5);
	left_rim.body.static = true;
	left_rim.body.setCollisionGroup(collisionGroup);
	left_rim.body.collides([collisionGroup]);

	right_rim.body.setCircle(5.5);
	right_rim.body.static = true;
	right_rim.body.setCollisionGroup(collisionGroup);
	right_rim.body.collides([collisionGroup]);

	createpaper();

	cursors = game.input.keyboard.createCursorKeys();

	game.input.onDown.add(click, this);
	game.input.onUp.add(release, this);


	var instructions = document.createElement("span");
	//instructions.innerHTML = "Instructions: Quickly drag the paper to shoot the paper into the hoop!";
	document.body.appendChild(instructions);
}

function update() {

	if (paper && paper.body.velocity.y > 0) {
		front_rim = game.add.sprite(148, 95, 'front rim');
		paper.body.collides([collisionGroup], hitRim, this);
	}

	if (paper && paper.body.velocity.y > 0 && paper.body.y > 188 && !paper.isBelowHoop) {
		paper.isBelowHoop = true;
		paper.body.collideWorldBounds = false;
		var rand = Math.floor(Math.random() * 5);
		if (paper.body.x > 151 && paper.body.x < 249) {
			emojiName = "win" + rand;
			score += 1;
			score_text.text = score;
			score_sound.play();
		} else {
			emojiName = "lose" + rand;
			fail.play();
			if (score > high_score) {
				high_score = score;
			// 	high_score_text.text = 'High Score\n' + high_score;
			}
			score = 0;
			score_text.text = '';
			best_text.text = '  Best  ';
			best_score_text.text = high_score;
		}
		emoji = game.add.sprite(180, 100, emojiName);
		emoji.scale.setTo(0.25, 0.25);
		moveInTween = game.add.tween(emoji).from( { y: 150 }, 500, Phaser.Easing.Elastic.Out, true);
		fadeInTween = game.add.tween(emoji).from( { alpha: 0 }, 200, Phaser.Easing.Linear.None, true, 0, 0, false);
		moveInTween.onComplete.add(tweenOut, this);
	}

	if (paper && paper.body.y > 1500) {
		game.physics.p2.gravity.y = 0;
		paper.kill();
		createpaper();
	}

}

function tweenOut() {
	moveOutTween = game.add.tween(emoji).to( { y: 50 }, 600, Phaser.Easing.Elastic.In, true);
	moveOutTween.onComplete.add(function() { emoji.kill(); }, this);
	setTimeout(function () {
		fadeOutTween = game.add.tween(emoji).to( { alpha: 0 }, 300, Phaser.Easing.Linear.None, true, 0, 0, false);
	}, 450);
}

function hitRim() {

	backboard.play();

}

function createpaper() {

	var xpos;
	if (score === 0) {
		xpos = 200;
	} else {
		xpos = 60 + Math.random() * 280;
	}
	spawn.play();
	paper = game.add.sprite(xpos, 547, 'paper');
	game.add.tween(paper.scale).from({x : 0.7, y : 0.7}, 100, Phaser.Easing.Linear.None, true, 0, 0, false);
	game.physics.p2.enable(paper, false);
	paper.body.setCircle(60); // NOTE: Goes from 60 to 36
	paper.launched = false;
	paper.isBelowHoop = false;

}

var location_interval;
var isDown = false;
var start_location;
var end_location;

function click(pointer) {

	var bodies = game.physics.p2.hitTest(pointer.position, [ paper.body ]);
	if (bodies.length) {
		start_location = [pointer.x, pointer.y];
		isDown = true;
		location_interval = setInterval(function () {
			start_location = [pointer.x, pointer.y];
		}.bind(this), 200);
	}

}

function release(pointer) {

	if (isDown) {
		window.clearInterval(location_interval);
		isDown = false;
		end_location = [pointer.x, pointer.y];

		if (end_location[1] < start_location[1]) {
			var slope = [end_location[0] - start_location[0], end_location[1] - start_location[1]];
			var x_traj = -2300 * slope[0] / slope[1];
			launch(x_traj);
		}
	}

}

function launch(x_traj) {

	if (paper.launched === false) {
		paper.body.setCircle(36);
		paper.body.setCollisionGroup(collisionGroup);
		best_text.text = '';
		best_score_text.text = '';
		paper.launched = true;
		game.physics.p2.gravity.y = 3000;
		game.add.tween(paper.scale).to({x : 0.6, y : 0.6}, 500, Phaser.Easing.Linear.None, true, 0, 0, false);
		paper.body.velocity.x = x_traj;
		paper.body.velocity.y = -1750;
		paper.body.rotateRight(x_traj / 3);
		whoosh.play();
	}

}
