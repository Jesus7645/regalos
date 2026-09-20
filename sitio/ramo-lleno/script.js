const NS = 'http://www.w3.org/2000/svg';
const el = (name, attrs = {}, parent) => {
  const n = document.createElementNS(NS, name);
  for (const k in attrs) n.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(n);
  return n;
};
const rng = seed => () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const GOLDEN = Math.PI * (3 - Math.sqrt(5));
const pt = (a, r) => `${(Math.cos(a) * r).toFixed(2)} ${(Math.sin(a) * r).toFixed(2)}`;

/* ============ 1. GIRASOL (espiral áurea) ============ */
function sunflower(g) {
  const ring = (n, inner, len, wid, off, fill) => {
    for (let i = 0; i < n; i++) {
      el('path', {
        d: `M${inner} 0 C${inner + len * .25} ${-wid} ${inner + len * .75} ${-wid * .8} ${inner + len} 0 ` +
           `C${inner + len * .75} ${wid * .8} ${inner + len * .25} ${wid} ${inner} 0Z`,
        fill: `url(#${fill})`, stroke: 'rgba(170,100,0,.3)', 'stroke-width': .5,
        transform: `rotate(${(i / n * 360 + off).toFixed(2)})`
      }, g);
    }
  };
  ring(34, 29, 60, 8, 180 / 34, 'gSunBack');
  ring(34, 31, 62, 9, 0, 'gSunFront');

  const SEEDS = 650, discR = 36, sp = discR / Math.sqrt(SEEDS), BANDS = 8;
  const paths = Array(BANDS).fill('');
  for (let i = 1; i <= SEEDS; i++) {
    const r = sp * Math.sqrt(i), a = i * GOLDEN, k = r / discR;
    const b = Math.min(BANDS - 1, Math.floor(k * BANDS));
    const x = Math.cos(a) * r, y = Math.sin(a) * r, rad = sp * .46;
    paths[b] += `M${(x - rad).toFixed(2)} ${y.toFixed(2)}a${rad} ${rad} 0 1 0 ${2 * rad} 0a${rad} ${rad} 0 1 0 ${-2 * rad} 0`;
  }
  paths.forEach((d, b) => {
    const k = b / BANDS;
    el('path', { d, fill: `hsl(${28 + k * 8}, ${50 + k * 10}%, ${12 + k * 22}%)` }, g);
  });
}

/* ============ 2. ROSA (pétalos en espiral) ============ */
function rose(g) {
  const R = 78, N = 46;
  for (let s = 0; s < 5; s++) {
    const L = R * 1.22, w = R * .16;
    el('path', {
      d: `M0 0 C${L * .3} ${-w} ${L * .8} ${-w * .5} ${L} 0 C${L * .8} ${w * .5} ${L * .3} ${w} 0 0Z`,
      fill: s % 2 ? '#3f8a3a' : '#2f7433', transform: `rotate(${s * 72 + 17})`
    }, g);
  }
  for (let i = 0; i < N; i++) {
    const t = i / N;
    const r = R * Math.pow(1 - i / (N + 4), 1.1);
    const a = i * GOLDEN, w = 0.75 + 0.5 * t, a0 = a - w, a1 = a + w;
    const ri = r * .3, rd = .12;
    el('path', {
      d: `M${pt(a0, ri)} L${pt(a0, r * .96)} Q${pt(a0, r * 1.03)} ${pt(a0 + rd, r)} ` +
         `A${r.toFixed(2)} ${r.toFixed(2)} 0 0 1 ${pt(a1 - rd, r)} Q${pt(a1, r * 1.03)} ${pt(a1, r * .96)} L${pt(a1, ri)}Z`,
      fill: 'url(#gRose)', stroke: 'rgba(120,70,0,.38)', 'stroke-width': 1
    }, g);
  }
}

/* ============ 3. NARCISO ============ */
function narciso(g) {
  const petal = (L, ang, fill) => {
    const w = L * .36;
    el('path', {
      d: `M0 0 C${-w} ${-L * .3} ${-w * .8} ${-L * .85} 0 ${-L} C${w * .8} ${-L * .85} ${w} ${-L * .3} 0 0Z`,
      fill: `url(#${fill})`, stroke: 'rgba(170,100,0,.3)', 'stroke-width': .8, transform: `rotate(${ang})`
    }, g);
  };
  for (let i = 0; i < 6; i++) petal(70, 30 + i * 60, 'gNarBack');
  for (let i = 0; i < 6; i++) petal(80, i * 60, 'gNarFront');
  for (let i = 0; i < 16; i++) {
    const a = i / 16 * Math.PI * 2;
    el('circle', { cx: Math.cos(a) * 25, cy: Math.sin(a) * 25, r: 5.5, fill: '#ffbe0b', stroke: 'rgba(150,80,0,.35)', 'stroke-width': .8 }, g);
  }
  el('circle', { r: 26, fill: 'url(#gNarCup)' }, g);
  el('circle', { r: 21, fill: 'none', stroke: 'rgba(150,80,0,.35)', 'stroke-width': 1.5 }, g);
}

/* ============ 4. DIENTE DE LEÓN ============ */
function dandelion(g, o = {}) {
  const rand = rng(o.seed || 4242);
  const RINGS = [
    { n: 30, len: 104, w: 7,   c: '#f2a900' }, { n: 28, len: 92, w: 7,   c: '#f7b500' },
    { n: 26, len: 80,  w: 7,   c: '#ffc20e' }, { n: 22, len: 66, w: 6.5, c: '#ffcf2e' },
    { n: 18, len: 52,  w: 6,   c: '#ffdb4d' }, { n: 12, len: 36, w: 5.5, c: '#ffe680' },
    { n: 7,  len: 20,  w: 5,   c: '#fff0a8' }
  ];
  RINGS.forEach((r, ri) => {
    for (let i = 0; i < r.n; i++) {
      const angle = (i / r.n) * 360 + ri * (360 / r.n / 2.3) + (rand() - .5) * 6;
      const L = r.len * (0.92 + rand() * 0.16), w = r.w;
      el('path', {
        d: `M${-w * .45} 0 L${-w} ${-L} L${-w * .35} ${-L * .94} L0 ${-L} L${w * .35} ${-L * .94} L${w} ${-L} L${w * .45} 0Z`,
        fill: r.c, stroke: 'rgba(150,90,0,.22)', 'stroke-width': .6, transform: `rotate(${angle.toFixed(1)})`
      }, g);
    }
  });
  el('circle', { r: 8, fill: '#f8b800' }, g);
}

/* ============ 5. LOTO (vista lateral, base en 0,0) ============ */
function lotus(g) {
  const petalPath = (L, w) =>
    `M0 0 C${-w} ${-L * .3} ${-w * .7} ${-L * .8} 0 ${-L} C${w * .7} ${-L * .8} ${w} ${-L * .3} 0 0Z`;
  const row = (angles, L, fill, delay) => {
    angles.forEach((a, i) => {
      el('path', {
        class: 'lo-petal', d: petalPath(L, L * .32), fill: `url(#${fill})`,
        stroke: 'rgba(150,90,0,.3)', 'stroke-width': .8,
        style: `--a:${a}deg; --ld:${(delay + i * .06).toFixed(2)}s`
      }, g);
    });
  };
  row([-72, -36, 0, 36, 72], 175, 'gLB', 0);
  row([-56, -19, 19, 56], 155, 'gLM', .25);
  el('ellipse', { cx: 0, cy: -50, rx: 20, ry: 12, fill: '#f5b400' }, g);
  const st = el('g', { class: 'lo-stamens' }, g);
  for (let k = 0; k < 15; k++) {
    const ang = (-52 + k * (104 / 14)) * Math.PI / 180;
    const len = 46 + (k % 3) * 7;
    const x2 = Math.sin(ang) * len, y2 = -45 - Math.cos(ang) * len;
    el('line', { x1: Math.sin(ang) * 10, y1: -45, x2, y2, stroke: '#ffc933', 'stroke-width': 2.2, 'stroke-linecap': 'round' }, st);
    el('circle', { cx: x2, cy: y2, r: 3.2, fill: '#e08a00' }, st);
  }
  row([-40, 0, 40], 132, 'gLF', .5);
}

/* ============ 6. TULIPÁN (vista lateral, base en 0,0) ============ */
function tulip(g) {
  el('path', { class: 'tp-petal tp-back',  d: 'M0 0 C-58 -15 -60 -150 0 -208 C60 -150 58 -15 0 0Z',          fill: 'url(#gTB)' }, g);
  el('path', { class: 'tp-petal tp-left',  d: 'M0 4 C-72 0 -104 -86 -88 -184 C-42 -148 -2 -88 0 4Z',        fill: 'url(#gTS)' }, g);
  el('path', { class: 'tp-petal tp-right', d: 'M0 4 C72 0 104 -86 88 -184 C42 -148 2 -88 0 4Z',             fill: 'url(#gTS)' }, g);
  const front = el('g', { class: 'tp-petal tp-front' }, g);
  el('path', { d: 'M0 8 C-50 -4 -54 -100 0 -168 C54 -100 50 -4 0 8Z', fill: 'url(#gTF)' }, front);
  el('path', { d: 'M0 -154 C0 -100 0 -50 0 0', stroke: 'rgba(190,120,0,.35)', 'stroke-width': 2, fill: 'none' }, front);
}

/* ============ hojas ============ */
const leaves = document.getElementById('leaves');
function leaf(bx, by, tx, ty, w, fill) {
  const mx = (bx + tx) / 2, my = (by + ty) / 2, dx = tx - bx, dy = ty - by;
  const len = Math.hypot(dx, dy), nx = -dy / len * w, ny = dx / len * w;
  el('path', {
    d: `M${bx} ${by} Q${mx + nx} ${my + ny} ${tx} ${ty} Q${mx - nx} ${my - ny} ${bx} ${by}Z`,
    fill, stroke: '#25602a', 'stroke-width': 1
  }, leaves);
  el('path', { d: `M${bx} ${by} L${tx} ${ty}`, stroke: 'rgba(255,255,255,.25)', 'stroke-width': 1.2, fill: 'none' }, leaves);
}
[[300, 565, 90, 470, 44, '#3d8a3c'],  [300, 565, 510, 475, 44, '#478f43'],
 [300, 565, 200, 400, 36, '#4e9a45'], [300, 565, 400, 405, 36, '#3a8039'],
 [300, 565, 30, 530, 40, '#2f7433'],  [300, 565, 570, 535, 40, '#337a35'],
 [300, 565, 150, 520, 34, '#3f8f3f'], [300, 565, 450, 522, 34, '#46974a']
].forEach(l => leaf(...l));

/* ============ armado del ramo ============ */
const G = { x: 300, y: 610 }; // punto donde se juntan todos los tallos

// Se dibujan de atrás hacia adelante. side:true = flor vista de lado (tulipán, loto),
// que se inclina siguiendo la curva de su tallo.
const FLOWERS = [
  // fondo
  { build: sunflower, x: 300, y: 135, s: .92, r: 0,   sw: 1.2, dur: 8 },
  { build: sunflower, x: 165, y: 205, s: .74, r: 12,  sw: 1.5, dur: 9 },
  { build: sunflower, x: 435, y: 205, s: .74, r: -9,  sw: 1.5, dur: 7.5 },
  { build: narciso,   x: 52,  y: 190, s: .62, r: 15,  sw: 3,   dur: 7 },
  { build: rose,      x: 548, y: 192, s: .62, r: -20, sw: 2.5, dur: 6.5 },
  // centro
  { build: rose,      x: 300, y: 262, s: .8,  r: 8,   sw: 2.5, dur: 6 },
  { build: dandelion, x: 42,  y: 295, s: .56, r: 20,  sw: 3,   dur: 9,   seed: 111 },
  { build: dandelion, x: 558, y: 300, s: .56, r: -15, sw: 3,   dur: 8.5, seed: 222 },
  { build: narciso,   x: 195, y: 300, s: .78, r: -10, sw: 3,   dur: 7 },
  { build: narciso,   x: 405, y: 300, s: .78, r: 25,  sw: 3,   dur: 7.5 },
  { build: dandelion, x: 300, y: 350, s: .55, r: 5,   sw: 3,   dur: 8,   seed: 333 },
  { build: rose,      x: 112, y: 385, s: .7,  r: -25, sw: 2.5, dur: 6.8 },
  { build: rose,      x: 488, y: 385, s: .7,  r: 30,  sw: 2.5, dur: 6.3 },
  // frente
  { build: tulip,     x: 300, y: 432, s: .55, side: true, sw: 2, dur: 6 },
  { build: lotus,     x: 200, y: 440, s: .46, side: true, sw: 2, dur: 7 },
  { build: lotus,     x: 400, y: 440, s: .46, side: true, sw: 2, dur: 7.5 },
  { build: tulip,     x: 245, y: 478, s: .5,  side: true, sw: 2, dur: 6.4 },
  { build: tulip,     x: 355, y: 478, s: .5,  side: true, sw: 2, dur: 5.8 },
  { build: lotus,     x: 300, y: 505, s: .42, side: true, sw: 2, dur: 7 }
];

// tallo curvo desde el punto de unión hasta la flor (y su ángulo al llegar)
function stemFor(f) {
  const dx = f.x - G.x, dy = f.y - G.y;
  const c1 = [G.x + dx * .1,  G.y + dy * .45];
  const c2 = [G.x + dx * .75, G.y + dy * .85];
  return {
    d: `M${G.x} ${G.y} C${c1[0]} ${c1[1]} ${c2[0]} ${c2[1]} ${f.x} ${f.y}`,
    angle: Math.atan2(f.x - c2[0], c2[1] - f.y) * 180 / Math.PI
  };
}

const stems = document.getElementById('stems');
const heads = document.getElementById('heads');
FLOWERS.forEach((f, i) => {
  const t = 0.3 + i * 0.14; // primero crece el tallo, luego florece la cabeza
  const st = stemFor(f);
  const rot = f.side ? st.angle * .5 : f.r;
  el('path', { class: 'stem', d: st.d, pathLength: 1, style: `--d:${t.toFixed(2)}s` }, stems);
  const outer = el('g', { transform: `translate(${f.x} ${f.y}) rotate(${rot.toFixed(1)}) scale(${f.s})` }, heads);
  const bloom = el('g', { class: 'bloom', style: `--d:${(t + .9).toFixed(2)}s` }, outer);
  const sway  = el('g', { class: 'sway',  style: `--sw:${f.sw}deg; --sdur:${f.dur}s; --sd:${(t + 2.2).toFixed(2)}s` }, bloom);
  f.build(sway, f);
});

/* ============ interacción ============ */
const svg = document.getElementById('bouquet');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
let timer;
function play() {
  clearTimeout(timer);
  svg.classList.remove('play', 'open');
  void svg.getBoundingClientRect(); // fuerza el reinicio de las animaciones
  svg.classList.add('play');
  timer = setTimeout(() => svg.classList.add('open'), reduce ? 0 : 3800); // el tulipán y el loto se abren
}
svg.addEventListener('click', play);
svg.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); play(); }
});
play();
