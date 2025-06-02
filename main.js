var context, player, loop;

context = document.querySelector("canvas").getContext("2d");
let height = 720;
let width = 1280;
let lastTime = 0;

context.canvas.height = height;
context.canvas.width = width;

missles = []
playerOrientation = "North"
const keys = {}; // Object to store the state of pressed keys
player = {
	height: 32,
	width: 32,
	speed: 3,
	// Center of the canvas
	x: width / 2,
	y: height / 2,
};

function draw() {
	context.fillStyle = "#202020";
	context.fillRect(0, 0, width, height);// x, y, width, height
	context.fillStyle = "#ff0000";// hex for red
	context.beginPath();
	context.rect(player.x, player.y, player.width, player.height);
	context.fill();

	// if player goes past boundary
	if (player.x > width) {
		player.x = -player.width;
	} else if (player.x < -player.width) {
		player.x = width
	}
	if (player.y > height) {
		player.y = -player.height
	} else if (player.y < -player.height) {
		player.y = height
	}
	// draw missles
	for (let i = 0; i < missles.length; i++) {
		context.beginPath();
		context.rect(missles[i].x, missles[i].y, 2, 2);
		context.fill();
	}
	// update missles
	for (let i = 0; i < missles.length; i++) {
		newMissles = []
		missle = missles.pop()
		missle
	}
}

function update() {
	north = (keys.KeyW || keys.ArrowUp);
	south = (keys.KeyS || keys.ArrowDown);
	east = (keys.KeyA || keys.ArrowLeft);
	west = (keys.KeyD || keys.ArrowRight);
	newPlayerOrientation = "";
	newPlayer = {
		height: 32,
		width: 32,
		speed: 3,
		x: player.x,
		y: player.y
	};
	if (north && !south) {
		newPlayerOrientation = north;
		newPlayer.y -= player.speed;
	} else if (south && !north) {
		newPlayerOrientation = south;
		newPlayer.y += player.speed;
	}
	if (east && !west) {
		newPlayerOrientation += east;
		newPlayer.x -= player.speed;
	} else if (west && !east) {
		newPlayerOrientation += west;
		newPlayer.x += player.speed;
	}
	if (newPlayerOrientation.length > 0) {
		playerOrientation = newPlayerOrientation;
	}
	player = newPlayer;

	if (keys.Space) {
		fireMissle();
	}
}

function fireMissle() {
	// North
	// NorthWest
	// NorthEast
	// South
	// SouthWest
	// SouthEast
	// West
	// East
	direction = "n"
	missles.push({ x: player.x + 3, y: player.y + 3, velocity: 7, direction: direction })
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
