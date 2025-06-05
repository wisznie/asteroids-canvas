var context, player, loop;

context = document.querySelector("canvas").getContext("2d");
let height = 720;
let width = 1280;
let lastTime = 0;

context.canvas.height = height;
context.canvas.width = width;

var missles = [];
var playerOrientation = "North";
const keys = {}; // Object to store the state of pressed keys
var spaceRegistered = false;
player = {
	height: 32,
	width: 32,
	speed: 3,
	// Center of the canvas
	x: width / 2,
	y: height / 2,
	rotation: 0,
};

function drawSpaceship() {
	var img = new Image;
	img.src = "./assets/spaceship.svg";
	context.save();
	context.translate(player.x, player.y);
	context.rotate(player.rotation);
	context.drawImage(img, 0, 0, player.height, player.width);
	context.restore();
}

function draw() {
	context.fillStyle = "#202020";
	context.fillRect(0, 0, width, height);// x, y, width, height
	drawSpaceship();

	// if player goes past boundary
	if (player.x > width) {
		player.x = -player.width;
	} else if (player.x < -player.width) {
		player.x = width;
	}
	if (player.y > height) {
		player.y = -player.height;
	} else if (player.y < -player.height) {
		player.y = height;
	}
	// draw missles
	for (let i = 0; i < missles.length; i++) {
		context.beginPath();
		context.fillStyle = "#ffffff";// hex for red
		context.rect(missles[i].x, missles[i].y, 2, 2);
		context.fill();
	}
}

function update() {
	var north = (keys.KeyW || keys.ArrowUp);
	var south = (keys.KeyS || keys.ArrowDown);
	var east = (keys.KeyA || keys.ArrowLeft);
	var west = (keys.KeyD || keys.ArrowRight);
	var newPlayerOrientation = "";
	var newPlayer = {
		height: 32,
		width: 32,
		speed: 3,
		x: player.x,
		y: player.y,
		rotation: player.rotation
	};
	if (north && !south) {
		newPlayerOrientation = "North";
		newPlayer.y -= player.speed * Math.sin(player.rotation);
		newPlayer.x -= player.speed * Math.cos(player.rotation);
	} else if (south && !north) {
		newPlayerOrientation = "South";
		newPlayer.y += player.speed * Math.sin(player.rotation);
		newPlayer.x += player.speed * Math.cos(player.rotation);
	}
	if (east && !west) {
		newPlayerOrientation += "East";
		newPlayer.rotation -= Math.PI / 150;
	} else if (west && !east) {
		newPlayerOrientation += "West";
		newPlayer.rotation += Math.PI / 150;
	}
	if (newPlayerOrientation.length > 0) {
		playerOrientation = newPlayerOrientation;
	}
	player = newPlayer;
	console.log(player);

	var newMissles = [];
	let numMissles = missles.length;
	for (i = 0; i < numMissles; i++) {
		var newMissle = missles.pop();
		if (newMissle.direction == "North") {
			newMissle.y -= newMissle.velocity;
		}
		if (newMissle.direction == "NorthEast") {
			newMissle.y -= newMissle.velocity;
			newMissle.x -= newMissle.velocity;
		}
		if (newMissle.direction == "NorthWest") {
			newMissle.y -= newMissle.velocity;
			newMissle.x += newMissle.velocity;
		}
		if (newMissle.direction == "South") {
			newMissle.y += newMissle.velocity;
		}
		if (newMissle.direction == "SouthEast") {
			newMissle.y += newMissle.velocity;
			newMissle.x -= newMissle.velocity;
		}
		if (newMissle.direction == "SouthWest") {
			newMissle.y += newMissle.velocity;
			newMissle.x += newMissle.velocity;
		}
		if (newMissle.direction == "East") {
			newMissle.x -= newMissle.velocity;
		}
		if (newMissle.direction == "West") {
			newMissle.x += newMissle.velocity;
		}
		newMissles.push(newMissle);
	}
	missles = newMissles;

	if (!spaceRegistered && keys.Space) {
		spaceRegistered = true;
		fireMissle();
	} else if (spaceRegistered && !keys.Space) {
		spaceRegistered = false;
	}
}

function fireMissle() {
	missles.push({ x: player.x + 3, y: player.y + 3, velocity: 5, direction: playerOrientation })
}

gameLoop = function() {
	draw();
	update();
	window.requestAnimationFrame(gameLoop);
};

window.requestAnimationFrame(gameLoop);
window.addEventListener('keydown', (e) => {
	// Use e.code for more reliable key identification (e.g., "KeyW", "ArrowUp")
	// e.keyCode is deprecated
	keys[e.code] = true;
	// Prevent default browser behavior (e.g., arrow keys scrolling the page)
	e.preventDefault();
});

window.addEventListener('keyup', (e) => {
	keys[e.code] = false;
	e.preventDefault();
});
