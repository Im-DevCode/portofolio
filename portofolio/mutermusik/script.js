// === BACKGROUND PARTICLES ===
const canvasBG = document.getElementById("particles");
const ctxBG = canvasBG.getContext("2d");

canvasBG.width = window.innerWidth;
canvasBG.height = window.innerHeight;

const particles = [];
const colors = ["#0ff", "#f0f", "#ff0", "#0f0", "#f00"];

for (let i = 0; i < 100; i++) {
  particles.push({
    x: Math.random() * canvasBG.width,
    y: Math.random() * canvasBG.height,
    r: Math.random() * 3 + 1,
    dx: (Math.random() - 0.5) * 1,
    dy: (Math.random() - 0.5) * 1,
    color: colors[Math.floor(Math.random() * colors.length)]
  });
}

function animateBG() {
  ctxBG.clearRect(0, 0, canvasBG.width, canvasBG.height);
  particles.forEach(p => {
    ctxBG.beginPath();
    ctxBG.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctxBG.fillStyle = p.color;
    ctxBG.fill();

    p.x += p.dx;
    p.y += p.dy;

    if (p.x < 0 || p.x > canvasBG.width) p.dx *= -1;
    if (p.y < 0 || p.y > canvasBG.height) p.dy *= -1;
  });
  requestAnimationFrame(animateBG);
}
animateBG();

window.addEventListener("resize", () => {
  canvasBG.width = window.innerWidth;
  canvasBG.height = window.innerHeight;
});

// === MUSIC VISUALIZER ===
const fileInput = document.getElementById("audioFile");
const audio = document.getElementById("audio");
const canvas = document.getElementById("visualizer");
const ctx = canvas.getContext("2d");

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

let audioContext, analyser, source, dataArray;

fileInput.onchange = function() {
  const files = this.files;
  audio.src = URL.createObjectURL(files[0]);
  audio.load();
  audio.play();
  
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    source = audioContext.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 256;

    const bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    renderFrame();
  }
};

function renderFrame() {
  requestAnimationFrame(renderFrame);
  analyser.getByteFrequencyData(dataArray);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const barWidth = (canvas.width / dataArray.length) * 2.5;
  let x = 0;

  for (let i = 0; i < dataArray.length; i++) {
    const barHeight = dataArray[i];
    const r = (i * 5) % 255;
    const g = (i * 7) % 255;
    const b = (i * 11) % 255;

    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.shadowBlur = 20;
    ctx.shadowColor = `rgb(${r},${g},${b})`;
    ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

    x += barWidth + 1;
  }
}
