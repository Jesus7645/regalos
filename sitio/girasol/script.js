const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5)); // ~137.5°
const SEEDS = 1100;
let size, dpr, start = performance.now();

function resize() {
  size = Math.min(innerWidth, innerHeight);
  dpr = window.devicePixelRatio || 1;
  canvas.width = canvas.height = size * dpr;
  canvas.style.width = canvas.style.height = size + 'px';
}
addEventListener('resize', resize);
resize();

const ease = t => 1 - Math.pow(1 - t, 3);

// Dibuja un anillo de pétalos alrededor del centro
function petalRing(n, inner, len, wid, offset, colors, sway) {
  for (let i = 0; i < n; i++) {
    ctx.save();
    ctx.rotate(i / n * Math.PI * 2 + offset + Math.sin(sway + i * 0.7) * 0.025);
    const g = ctx.createLinearGradient(inner, 0, inner + len, 0);
    g.addColorStop(0, colors[0]);
    g.addColorStop(1, colors[1]);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(inner, 0);
    ctx.bezierCurveTo(inner + len * .25, -wid, inner + len * .75, -wid * .8, inner + len, 0);
    ctx.bezierCurveTo(inner + len * .75, wid * .8, inner + len * .25, wid, inner, 0);
    ctx.fill();
    // nervadura central
    ctx.strokeStyle = 'rgba(170,100,0,.28)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(inner + len * .12, 0);
    ctx.lineTo(inner + len * .85, 0);
    ctx.stroke();
    ctx.restore();
  }
}

function draw(now) {
  const t = (now - start) / 1000;
  const grow = reduceMotion ? 1 : Math.min(t / 3.2, 1);
  const g = ease(grow);
  const R = size / 2;
  const discR = R * 0.36;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, size, size);
  ctx.translate(R, R);

  const sway = reduceMotion ? 0 : now / 900;

  // pétalos traseros (más oscuros) y delanteros (más claros)
  petalRing(34, discR * .8, R * .60 * g, R * .085, Math.PI / 34, ['#e89a00', '#ffc42b'], sway);
  petalRing(34, discR * .85, R * .62 * g, R * .09, 0, ['#ffb800', '#ffe45c'], sway + 1.3);

  // disco central: semillas en espiral áurea
  const count = Math.floor(SEEDS * g);
  const spacing = discR / Math.sqrt(SEEDS);
  for (let i = 1; i <= count; i++) {
    const r = spacing * Math.sqrt(i);
    const a = i * GOLDEN_ANGLE;
    const k = r / discR;
    ctx.fillStyle = `hsl(${28 + k * 8}, ${50 + k * 10}%, ${12 + k * 22}%)`;
    ctx.beginPath();
    ctx.arc(Math.cos(a) * r, Math.sin(a) * r, spacing * .46, 0, Math.PI * 2);
    ctx.fill();
  }

  requestAnimationFrame(draw);
}

canvas.addEventListener('click', () => { start = performance.now(); });
requestAnimationFrame(draw);
