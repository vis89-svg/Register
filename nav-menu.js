// Puts the page links behind a hamburger button on the left of the nav bar.
// Clicking it shoots the links out; clicking again, clicking elsewhere or Escape tucks them away.
(function () {
  var nav = document.querySelector('.nav');
  var links = nav && nav.querySelector('.nav-links');
  if (!links) return;

  var button = document.createElement('button');
  button.type = 'button';
  button.className = 'nav-burger';
  button.title = 'Menu';
  button.setAttribute('aria-label', 'Menu');
  button.setAttribute('aria-expanded', 'false');
  button.innerHTML = '<span></span><span></span><span></span>';
  nav.insertBefore(button, links);

  Array.prototype.forEach.call(links.children, function (link, i) {
    link.style.setProperty('--n', i);
  });

  function setOpen(open) {
    nav.classList.toggle('open', open);
    button.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  button.addEventListener('click', function (e) {
    e.stopPropagation();
    setOpen(!nav.classList.contains('open'));
  });
  document.addEventListener('click', function (e) {
    if (!nav.contains(e.target)) setOpen(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setOpen(false);
  });
})();
