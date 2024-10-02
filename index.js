const canvas = document.getElementById("starCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let staticStars = [];
let shootingStars = [];

// Create static stars (non-twinkling)
function createStaticStar() {
  const x = Math.random() * canvas.width;
  const y = Math.random() * canvas.height;
  const size = Math.random() * 1 + 0.5; // Very small static stars

  staticStars.push({ x, y, size });
}

// Create shooting stars
function createShootingStar() {
  const x = Math.random() * canvas.width;
  const y = Math.random() * canvas.height / 2; // Start from upper half
  const size = Math.random() * 2 + 1; // Shooting star size
  const speedX = Math.random() * 4 + 2; // Horizontal speed
  const speedY = Math.random() * 2 + 1; // Vertical speed
  const length = Math.random() * 60 + 40; // Tail length

  shootingStars.push({ x, y, size, speedX, speedY, length });
}

// Draw static stars (no twinkling)
function drawStaticStars() {
  for (let i = 0; i < staticStars.length; i++) {
    const star = staticStars[i];

    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Draw shooting stars with tail
function drawShootingStars() {
  for (let i = 0; i < shootingStars.length; i++) {
    const star = shootingStars[i];
    
    // Create a gradient for the star tail
    const gradient = ctx.createLinearGradient(star.x, star.y, star.x - star.length, star.y - star.length);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(star.x, star.y);
    ctx.lineTo(star.x - star.length, star.y - star.length);
    ctx.lineWidth = star.size;
    ctx.strokeStyle = gradient;
    ctx.stroke();
  }
}

// Update shooting stars
function updateShootingStars() {
  for (let i = 0; i < shootingStars.length; i++) {
    const star = shootingStars[i];
    
    // Move the star diagonally
    star.x += star.speedX;
    star.y += star.speedY;

    // Remove star if it moves off screen
    if (star.x > canvas.width || star.y > canvas.height) {
      shootingStars.splice(i, 1);
      i--;
    }
  }
}

// Animation loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw static stars
  drawStaticStars();
  
  // Draw shooting stars
  drawShootingStars();
  
  // Update shooting stars
  updateShootingStars();

  // Occasionally create new shooting stars
  if (Math.random() < 0.03) {
    createShootingStar();
  }

  requestAnimationFrame(animate);
}

// Create static stars on canvas load
for (let i = 0; i < 150; i++) { // Number of static stars
  createStaticStar();
}

// Start animation
animate();

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Reset stars on resize
  staticStars = [];
  for (let i = 0; i < 150; i++) {
    createStaticStar();
  }
});
