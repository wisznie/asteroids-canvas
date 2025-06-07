var context, player, loop;

context = document.querySelector("canvas").getContext("2d");
let height = 720;
let width = 1280;
let lastTime = 0;

context.canvas.height = height;
context.canvas.width = width;

var missles = [];
const keys = {}; // Object to store the state of pressed keys
var spaceRegistered = false;
player = {
	height: 32,
	width: 32,
	speed: 0.7,
	// Center of the canvas
	x: width / 2,
	y: height / 2,
	rotation: Math.PI / 2,
};

function drawSpaceship() {
	var img = new Image;
	img.src = "./assets/spaceship.svg";
	context.save();
	context.translate(player.x, player.y);
	context.rotate(player.rotation);
	// Draw the image centered at the origin
	// Subtract half the width and height to center the image
	// Adjust the size as needed
	context.drawImage(img, -player.width / 2, -player.height / 2, player.width, player.height);
	//context.drawImage(img, 0, 0, player.height, player.width);
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
	var newPlayer = {
		height: 32,
		width: 32,
		speed: player.speed,
		x: player.x,
		y: player.y,
		rotation: player.rotation
	};
	newPlayer.y += player.speed * Math.sin(player.rotation);
	newPlayer.x += player.speed * Math.cos(player.rotation);
	if (player.speed > 0.0) {
		newPlayer.speed -= .001;
	}
	if (north && !south) {
		if (player.speed < 2.5) {
			newPlayer.speed += 0.1;
		}
	}
	else if (south && !north) {
		if (player.speed > 0.0) {
			newPlayer.speed -= 0.1;
		}
	}
	if (east && !west) {
		newPlayer.rotation -= Math.PI / 150;
	} else if (west && !east) {
		newPlayer.rotation += Math.PI / 150;
	}
	player = newPlayer;

	var newMissles = [];
	let numMissles = missles.length;
	for (i = 0; i < numMissles; i++) {
		var newMissle = missles.pop();
		newMissle.y += newMissle.velocity * Math.sin(newMissle.rotation);
		newMissle.x += newMissle.velocity * Math.cos(newMissle.rotation);
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
	tipX = player.x + (player.width / 2) * Math.cos(player.rotation);
	tipY = player.y + (player.height / 2) * Math.sin(player.rotation);
	missles.push({ x: tipX, y: tipY, velocity: 5, rotation: player.rotation })
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
