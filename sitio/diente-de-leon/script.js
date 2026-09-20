const NS = 'http://www.w3.org/2000/svg';
const head = document.getElementById('head');
const leaves = document.getElementById('leaves');

// generador de números pseudoaleatorios con semilla
function rng(seed) {
  return () => (seed = (seed * 16807) % 2147483647) / 2147483647;
}

// anillos de lengüetas: de fuera hacia dentro
const RINGS = [
  { n: 30, len: 104, w: 7,   c: '#f2a900' },
  { n: 28, len: 92,  w: 7,   c: '#f7b500' },
  { n: 26, len: 80,  w: 7,   c: '#ffc20e' },
  { n: 22, len: 66,  w: 6.5, c: '#ffcf2e' },
  { n: 18, len: 52,  w: 6,   c: '#ffdb4d' },
  { n: 12, len: 36,  w: 5.5, c: '#ffe680' },
  { n: 7,  len: 20,  w: 5,   c: '#fff0a8' }
];

function buildHead(seed) {
  const rand = rng(seed);
  head.innerHTML = '';
  RINGS.forEach((r, ri) => {
    for (let i = 0; i < r.n; i++) {
      const angle = (i / r.n) * 360 + ri * (360 / r.n / 2.3) + (rand() - .5) * 6;
      const L = r.len * (0.92 + rand() * 0.16);
      const w = r.w;
      const p = document.createElementNS(NS, 'path');
      // lengüeta con la punta dentada, típica del diente de león
      p.setAttribute('d',
        `M${-w * .45} 0 L${-w} ${-L} L${-w * .35} ${-L * .94} L0 ${-L} ` +
        `L${w * .35} ${-L * .94} L${w} ${-L} L${w * .45} 0Z`);
      p.setAttribute('fill', r.c);
      p.setAttribute('stroke', 'rgba(150,90,0,.22)');
      p.setAttribute('stroke-width', '.6');
      p.setAttribute('transform', `rotate(${angle})`);
      head.appendChild(p);
    }
  });
  const core = document.createElementNS(NS, 'circle');
  core.setAttribute('r', 8);
  core.setAttribute('fill', '#f8b800');
  head.appendChild(core);
}

// hoja dentada que sale de la base
function leafPoints(dir, len, rise) {
  const up = [], low = [];
  for (let k = 0; k <= 8; k++) {
    const t = k / 8;
    const ax = 200 + dir * len * t;
    const ay = 614 - rise * t;
    const hw = 22 * Math.sin(Math.PI * Math.min(t * 1.05, 1)) + 1;
    up.push([ax, ay - hw * (k % 2 ? 1.5 : 0.9)]);
    low.push([ax, ay + hw * (k % 2 ? 0.9 : 0.5)]);
  }
  return [...up, ...low.reverse()].map(p => p.join(',')).join(' ');
}

function buildLeaves() {
  leaves.innerHTML = '';
  [[-1, 150, 80], [1, 140, 96], [-1, 100, 30], [1, 96, 22]].forEach(([dir, len, rise]) => {
    const poly = document.createElementNS(NS, 'polygon');
    poly.setAttribute('points', leafPoints(dir, len, rise));
    leaves.appendChild(poly);
  });
}

buildLeaves();
buildHead(1234);
document.getElementById('again').addEventListener('click', () => {
  buildHead(Math.floor(Math.random() * 2000000) + 1);
});
