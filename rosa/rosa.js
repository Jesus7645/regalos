const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
const N = 46;            // número de pétalos
const DURATION = 4.2;    // segundos que tarda en abrirse
let size, dpr, start = performance.now();

function resize() {
  size = Math.min(innerWidth, innerHeight);
  dpr = window.devicePixelRatio || 1;
  canvas.width = canvas.height = size * dpr;
  canvas.style.width = canvas.style.height = size + 'px';
}
addEventListener('resize', resize);
resize();

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const easeOut = t => 1 - Math.pow(1 - t, 3);

// sépalos verdes debajo de la flor
function sepals(R, k) {
  for (let s = 0; s < 5; s++) {
    ctx.save();
    ctx.rotate(s * Math.PI * 2 / 5 + 0.3);
    const L = R * 1.22 * k, w = R * 0.16 * k;
    ctx.fillStyle = s % 2 ? '#3f8a3a' : '#2f7433';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(L * .3, -w, L * .8, -w * .5, L, 0);
    ctx.bezierCurveTo(L * .8, w * .5, L * .3, w, 0, 0);
    ctx.fill();
    ctx.restore();
  }
}

function petal(i, R, scale) {
  const t = i / N;                                        // 0 = exterior, 1 = interior
  const r = R * Math.pow(1 - i / (N + 4), 1.1) * scale;  // radio de este pétalo
  const a = i * GOLDEN_ANGLE;                             // ángulo áureo entre pétalos
  const w = 0.75 + 0.5 * t;                               // los interiores abrazan más
  const a0 = a - w, a1 = a + w;
  const ri = r * 0.3;
  const round = 0.12;

  const g = ctx.createRadialGradient(0, 0, ri, 0, 0, r);
  g.addColorStop(0, '#d08a00');
  g.addColorStop(.65, '#f7b900');
  g.addColorStop(1, '#ffe066');

  ctx.beginPath();
  ctx.moveTo(Math.cos(a0) * ri, Math.sin(a0) * ri);
  ctx.lineTo(Math.cos(a0) * r * .96, Math.sin(a0) * r * .96);
  ctx.quadraticCurveTo(Math.cos(a0) * r * 1.03, Math.sin(a0) * r * 1.03,
                       Math.cos(a0 + round) * r, Math.sin(a0 + round) * r);
  ctx.arc(0, 0, r, a0 + round, a1 - round);
  ctx.quadraticCurveTo(Math.cos(a1) * r * 1.03, Math.sin(a1) * r * 1.03,
                       Math.cos(a1) * r * .96, Math.sin(a1) * r * .96);
  ctx.lineTo(Math.cos(a1) * ri, Math.sin(a1) * ri);
  ctx.closePath();

  ctx.shadowColor = 'rgba(80, 45, 0, .35)';
  ctx.shadowBlur = 7;
  ctx.fillStyle = g;
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = 'rgba(120, 70, 0, .35)';
  ctx.lineWidth = 1.2;
  ctx.stroke();
}

function draw(now) {
  const t = (now - start) / 1000;
  const grow = reduceMotion ? 1 : clamp(t / DURATION);
  const R = size * 0.36;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, size, size);
  ctx.translate(size / 2, size / 2);
  ctx.rotate(reduceMotion ? 0 : Math.sin(now / 2500) * 0.03);

  sepals(R, easeOut(clamp(grow * 3)));

  // los pétalos interiores aparecen primero y la flor se abre hacia afuera
  for (let i = 0; i < N; i++) {
    const delay = 0.6 * (1 - i / N);
    const p = easeOut(clamp((grow - delay) / 0.4));
    if (p > 0) petal(i, R, p);
  }

  requestAnimationFrame(draw);
}

canvas.addEventListener('click', () => { start = performance.now(); });
requestAnimationFrame(draw);
