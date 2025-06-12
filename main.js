var context, player, loop;

context = document.querySelector("canvas").getContext("2d");
let height = 720;
let width = 1280;
let lastTime = 0;

context.canvas.height = height;
context.canvas.width = width;

var missles = [];
var asteroids = generateAsteroids(false, 15).concat(generateAsteroids(true, 30));
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

function drawAsteroids() {
	for (let i = 0; i < asteroids.length; i++) {
		var asteroid = asteroids[i];
		drawSvg("./assets/asteroidA.svg", asteroid.x, asteroid.y, asteroid.width, asteroid.height, asteroid.rotation);
	}
}
function drawSpaceship() {
	drawSvg("./assets/spaceship.svg", player.x, player.y, player.width, player.height, player.rotation);
}

function drawSvg(src, x, y, width, height, rotation) {
	var img = new Image;
	img.src = src;
	context.save();
	context.translate(x, y);
	context.rotate(rotation);
	// Draw the image centered at the origin
	// Subtract half the width and height to center the image
	// Adjust the size as needed
	context.drawImage(img, -width / 2, -height / 2, width, height);
	//context.drawImage(img, 0, 0, player.height, player.width);
	context.restore();
}

function draw() {
	context.fillStyle = "#202020";
	context.fillRect(0, 0, width, height);// x, y, width, height
	drawSpaceship();
	drawAsteroids();

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

	fillAsteroids();
	for (i = 0; asteroids.length > i; i++) {
		var asteroid = asteroids[i];
		// Update asteroid position if needed (e.g., for movement)
		asteroid.rotation += 0.01; // Example rotation update
		asteroid.x += 0.1; // Example movement
		asteroid.y += 0.1; // Example movement
		// Check if the asteroid is out of bounds and reset its positio
	}
	// Check for collisions between missles and asteroids
	for (let i = missles.length - 1; i >= 0; i--) {
		let missle = missles[i];
		for (let j = asteroids.length - 1; j >= 0; j--) {
			let asteroid = asteroids[j];
			// Check if the missle is within the bounds of the asteroid
			if (missle.x > asteroid.x && missle.x < asteroid.x + asteroid.width &&
				missle.y > asteroid.y && missle.y < asteroid.y + asteroid.height) {
				// Collision detected, remove both the missle and the asteroid
				missles.splice(i, 1);
				asteroids.splice(j, 1);
				break; // Break out of the inner loop to avoid checking other asteroids
			}
		}
	}
}

function fillAsteroids() {
	for (let i = asteroids.length - 1; i >= 0; i--) {
		if (asteroids[i].x < -100 || asteroids[i].x > width + 100 || asteroids[i].y < -100 || asteroids[i].y > height + 100) {
			asteroids.splice(i, 1);
		}
	}
	if (asteroids.length < 20) {
		// Generate new asteroids if there are less than 15
		asteroids = asteroids.concat(generateAsteroids(true, 10));
	}
}

function generateAsteroids(negative, len) {
	var asteroidsGen = [];
	for (i = 0; i < len; i++) {
		var x = Math.random() * width;
		var y = Math.random() * height;
		if (negative) {

			y = -y;
		}
		var rotation = Math.random() * Math.PI * 2; // Random rotation
		asteroidsGen.push({ x: x, y: y, width: 64, height: 64, rotation: rotation });
	}
	return asteroidsGen;
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
