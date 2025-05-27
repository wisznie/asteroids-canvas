var context, player, loop;

context = document.querySelector("canvas").getContext("2d");
let height = 180*3;
let width = 320*3;
let lastTime = 0;

context.canvas.height = height;
context.canvas.width = width;

const keys = {}; // Object to store the state of pressed keys
player = {
  height:32,
  width:32,
  speed: 5,
  // Center of the canvas
  x:width/2,
  y:height/2, 
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
}

function update() {
    if (keys.KeyW || keys.ArrowUp) {
        player.y -= player.speed;
    } if (keys.KeyS || keys.ArrowDown) {
        player.y += player.speed;
    } if (keys.KeyA || keys.ArrowLeft) {
        player.x -= player.speed;
    } if (keys.KeyD || keys.ArrowRight) {
        player.x += player.speed;
    }
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
