// === JAM DIGITAL ===
function updateClock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  document.getElementById("clock").textContent = `${hours}:${minutes}:${seconds}`;
}
setInterval(updateClock, 1000);
updateClock();

// === PARTICLES + SHOOTING STAR ===
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const colors = ["#0ff", "#f0f", "#ff0", "#0f0", "#f00"];

for (let i = 0; i < 100; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 3 + 1,
    dx: (Math.random() - 0.5) * 1,
    dy: (Math.random() - 0.5) * 1,
    color: colors[Math.floor(Math.random() * colors.length)]
  });
}

// Shooting stars
const shootingStars = [];
function createShootingStar() {
  shootingStars.push({
    x: Math.random() * canvas.width,
    y: 0,
    length: Math.random() * 80 + 20,
    speed: Math.random() * 10 + 6,
    opacity: 1
  });
}
setInterval(createShootingStar, 2000);

// Mouse interaction
let mouse = { x: null, y: null };
window.addEventListener("mousemove", (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
});

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // particles
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();

    // Interaktif sama mouse
    const dx = p.x - mouse.x;
    const dy = p.y - mouse.y;
    const dist = Math.sqrt(dx*dx + dy*dy);
    if (dist < 100) {
      p.x += dx / dist;
      p.y += dy / dist;
    }

    p.x += p.dx;
    p.y += p.dy;

    if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
  });

  // shooting stars
  shootingStars.forEach((s, i) => {
    ctx.beginPath();
    const gradient = ctx.createLinearGradient(s.x, s.y, s.x - s.length, s.y + s.length);
    gradient.addColorStop(0, "rgba(255,255,255," + s.opacity + ")");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2;
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(s.x - s.length, s.y + s.length);
    ctx.stroke();

    s.x += s.speed;
    s.y += s.speed;
    s.opacity -= 0.01;

    if (s.opacity <= 0) shootingStars.splice(i, 1);
  });

  requestAnimationFrame(animate);
}
animate();

// Resize handler
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
