// Shared by the welcome page and both login pages:
// remembers light/dark mode and plays the "neon warp" page transition.
(function () {
  var root = document.documentElement;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var NEON = '#ffd400';

  function read(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
  function write(key, value) { try { localStorage.setItem(key, value); } catch (e) {} }

  // ---- Light / dark mode (light is the default) ----
  if (read('koda-theme') === 'dark') root.setAttribute('data-theme', 'dark');

  window.kodaToggleTheme = function () {
    var dark = root.getAttribute('data-theme') !== 'dark';
    if (dark) root.setAttribute('data-theme', 'dark');
    else root.removeAttribute('data-theme');
    write('koda-theme', dark ? 'dark' : 'light');
  };

  // ---- Arriving from a transition: the page drifts into focus ----
  var arriving = false;
  try {
    arriving = sessionStorage.getItem('koda-arrive') === '1';
    sessionStorage.removeItem('koda-arrive');
  } catch (e) {}
  if (arriving && !reduceMotion) {
    root.classList.add('k-arrive');
    setTimeout(function () { root.classList.remove('k-arrive'); }, 1200);
  }

  var css = document.createElement('style');
  css.textContent =
    '.k-arrive body > * { animation: k-in 0.75s cubic-bezier(0.2, 0.7, 0.2, 1) both; }' +
    '@keyframes k-in { from { opacity: 0; transform: translateY(16px) scale(0.985); filter: blur(8px); } to { opacity: 1; transform: none; filter: none; } }' +
    '.k-wipe { position: fixed; z-index: 9999; border-radius: 50%; pointer-events: none;' +
    '  transform: translate(-50%, -50%) scale(0); transition: transform 0.7s cubic-bezier(0.7, 0, 0.25, 1);' +
    '  box-shadow: 0 0 0 5px ' + NEON + '; }' +
    '.k-wipe.grow { transform: translate(-50%, -50%) scale(1); }';
  document.head.appendChild(css);

  // ---- Leaving: lines blur away, then a neon-edged circle fills the screen from the clicked link ----
  window.kodaGo = function (url, fromEl, color) {
    try { sessionStorage.setItem('koda-arrive', '1'); } catch (e) {}
    if (reduceMotion) { window.location.href = url; return; }

    root.classList.add('k-leaving');
    if (fromEl) fromEl.classList.add('k-chosen');

    var r = fromEl ? fromEl.getBoundingClientRect() : { left: innerWidth / 2, top: innerHeight / 2, width: 0, height: 0 };
    var x = r.left + r.width / 2;
    var y = r.top + r.height / 2;
    var radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)) + 40;

    var wipe = document.createElement('div');
    wipe.className = 'k-wipe';
    wipe.style.background = color;
    wipe.style.left = x + 'px';
    wipe.style.top = y + 'px';
    wipe.style.width = wipe.style.height = radius * 2 + 'px';
    document.body.appendChild(wipe);

    setTimeout(function () { wipe.classList.add('grow'); root.classList.add('k-wiping'); }, 280);
    setTimeout(function () { window.location.href = url; }, 1000);
  };

  // Coming back with the browser's Back button: undo the transition
  window.addEventListener('pageshow', function (e) {
    if (!e.persisted) return;
    root.classList.remove('k-leaving', 'k-wiping');
    document.querySelectorAll('.k-wipe').forEach(function (w) { w.remove(); });
    document.querySelectorAll('.k-chosen').forEach(function (el) { el.classList.remove('k-chosen'); });
  });
})();
