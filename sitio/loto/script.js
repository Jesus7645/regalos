const NS = 'http://www.w3.org/2000/svg';
const BX = 200, BY = 395; // base de la flor

function petalPath(L, w) {
  return `M${BX} ${BY} C${BX - w} ${BY - L * .3} ${BX - w * .7} ${BY - L * .8} ${BX} ${BY - L} ` +
         `C${BX + w * .7} ${BY - L * .8} ${BX + w} ${BY - L * .3} ${BX} ${BY}Z`;
}

function addRow(id, angles, L, fill, delay) {
  const row = document.getElementById(id);
  angles.forEach((a, i) => {
    const p = document.createElementNS(NS, 'path');
    p.setAttribute('class', 'petal');
    p.setAttribute('d', petalPath(L, L * .32));
    p.setAttribute('fill', `url(#${fill})`);
    p.setAttribute('stroke', 'rgba(150,90,0,.3)');
    p.setAttribute('stroke-width', '.8');
    p.setAttribute('style', `--a:${a}deg; --d:${(delay + i * 0.06).toFixed(2)}s`);
    row.appendChild(p);
  });
}

// tres filas de pétalos, de atrás hacia adelante
addRow('rowBack',  [-72, -36, 0, 36, 72], 175, 'gBack',  0);
addRow('rowMid',   [-56, -19, 19, 56],    155, 'gMid',   .25);
addRow('rowFront', [-40, 0, 40],          132, 'gFront', .5);

// estambres alrededor del centro
const st = document.getElementById('stamens');
for (let k = 0; k < 15; k++) {
  const ang = (-52 + k * (104 / 14)) * Math.PI / 180;
  const len = 46 + (k % 3) * 7;
  const x1 = BX + Math.sin(ang) * 10, y1 = 350;
  const x2 = BX + Math.sin(ang) * len, y2 = 350 - Math.cos(ang) * len;
  const line = document.createElementNS(NS, 'line');
  line.setAttribute('x1', x1); line.setAttribute('y1', y1);
  line.setAttribute('x2', x2); line.setAttribute('y2', y2);
  line.setAttribute('stroke', '#ffc933');
  line.setAttribute('stroke-width', '2.2');
  line.setAttribute('stroke-linecap', 'round');
  st.appendChild(line);
  const tip = document.createElementNS(NS, 'circle');
  tip.setAttribute('cx', x2); tip.setAttribute('cy', y2); tip.setAttribute('r', 3.2);
  tip.setAttribute('fill', '#e08a00');
  st.appendChild(tip);
}

const lotus = document.getElementById('lotus');
const toggle = () => lotus.classList.toggle('open');
lotus.addEventListener('click', toggle);
lotus.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
});
setTimeout(() => lotus.classList.add('open'), 500); // se abre sola al cargar
