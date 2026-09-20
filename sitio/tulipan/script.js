const tulip = document.getElementById('tulip');
const toggle = () => tulip.classList.toggle('open');
tulip.addEventListener('click', toggle);
tulip.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
});
// se abre solo al cargar
setTimeout(() => tulip.classList.add('open'), 600);
