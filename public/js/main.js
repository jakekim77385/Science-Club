/* ── main.js — Balboa Academy Science Club ── */

/* ─────────────────────────────────────────────────────
   PARTICLE CANVAS
───────────────────────────────────────────────────── */
(function () {
  var canvas = document.getElementById('particle-canvas');
  var ctx    = canvas.getContext('2d');
  var W, H, particles = [];

  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  function rand(a, b) { return Math.random() * (b - a) + a; }

  function Particle() { this.reset(); }
  Particle.prototype.reset = function () {
    this.x = rand(0, W); this.y = rand(0, H);
    this.r = rand(0.5, 2.5); this.vx = rand(-0.15, 0.15); this.vy = rand(-0.3, -0.05);
    this.alpha = rand(0.2, 0.9); this.decay = rand(0.001, 0.003);
    var hue = Math.random() < 0.65 ? 45 : 220;
    this.color = 'hsla(' + hue + ',90%,70%,' + this.alpha + ')';
  };
  Particle.prototype.update = function () {
    this.x += this.vx; this.y += this.vy; this.alpha -= this.decay;
    if (this.alpha <= 0 || this.y < -10) this.reset();
  };
  Particle.prototype.draw = function () {
    ctx.save(); ctx.globalAlpha = this.alpha; ctx.fillStyle = this.color;
    ctx.shadowBlur = 6; ctx.shadowColor = this.color;
    ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  };

  for (var i = 0; i < 180; i++) particles.push(new Particle());
  function animate() { ctx.clearRect(0, 0, W, H); particles.forEach(function (p) { p.update(); p.draw(); }); requestAnimationFrame(animate); }
  animate();
}());


/* ─────────────────────────────────────────────────────
   NAVBAR
───────────────────────────────────────────────────── */
var navbar = document.getElementById('navbar');
navbar.classList.add('scrolled');
window.addEventListener('scroll', function () {
  navbar.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });


/* ─────────────────────────────────────────────────────
   HAMBURGER
───────────────────────────────────────────────────── */
var hamburger = document.getElementById('hamburger');
var navMenu   = document.getElementById('nav-links');
hamburger.addEventListener('click', function () {
  hamburger.classList.toggle('open');
  navMenu.classList.toggle('open');
});


/* ─────────────────────────────────────────────────────
   PAGE SWITCHING
   - All sections hidden via style.display = 'none' (beats CSS)
   - showPage sets target to 'grid' (home) or 'block' (others)
   - Direct listeners on every internal anchor (no delegation)
───────────────────────────────────────────────────── */
var PAGE_IDS    = ['home', 'about', 'values', 'events', 'gallery', 'team', 'join'];
var PAGE_GRID   = { home: true };   // home needs display:grid
var countersDone = false;

/* Hide every section immediately */
PAGE_IDS.forEach(function (id) {
  var el = document.getElementById(id);
  if (el) el.style.display = 'none';
});

/* ── Stagger fade-up on page enter ── */
function revealPage(pageEl) {
  var cards = pageEl.querySelectorAll(
    '.a-card,.prog-card,.event-card,.officer-year-card,' +
    '.pillar,.sponsor-card,.gallery-tile,.gallery-insta-cta'
  );
  cards.forEach(function (c) { c.classList.remove('visible'); });
  cards.forEach(function (c, i) {
    c.classList.add('fade-up');
    c.style.transitionDelay = (i % 5) * 70 + 'ms';
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { c.classList.add('visible'); });
    });
  });
}

/* ── Core page switch ── */
function showPage(id) {
  if (PAGE_IDS.indexOf(id) === -1) id = 'home';

  // Hide all
  PAGE_IDS.forEach(function (pid) {
    var el = document.getElementById(pid);
    if (el) el.style.display = 'none';
  });

  // Show target
  var target = document.getElementById(id);
  if (target) {
    target.style.display = PAGE_GRID[id] ? 'grid' : 'block';
    window.scrollTo(0, 0);
    revealPage(target);
    if (id === 'home' && !countersDone) {
      countersDone = true;
      document.querySelectorAll('.stat-num[data-target]').forEach(function (el) {
        animCount(el, parseInt(el.dataset.target, 10));
      });
    }
  }

  // Nav highlight
  document.querySelectorAll('.nav-link').forEach(function (a) {
    var linked = a.getAttribute('href').replace('#', '');
    a.classList.toggle('nav-active-page', linked === id);
  });

  // Update URL without page reload
  history.replaceState(null, '', '#' + id);

  // Close mobile menu
  navMenu.classList.remove('open');
  hamburger.classList.remove('open');
}

/* ── Attach click listener to EVERY internal anchor ── */
function bindLink(anchor) {
  anchor.addEventListener('click', function (e) {
    var hash = anchor.getAttribute('href').replace('#', '');
    if (PAGE_IDS.indexOf(hash) !== -1) {
      e.preventDefault();
      showPage(hash);
    }
  });
}
document.querySelectorAll('a[href^="#"]').forEach(bindLink);

/* Browser back/forward */
window.addEventListener('popstate', function () {
  showPage(location.hash.replace('#', '') || 'home');
});


/* ─────────────────────────────────────────────────────
   COUNTER ANIMATION
───────────────────────────────────────────────────── */
function animCount(el, target) {
  var dur = 1800, start = null;
  function step(ts) {
    if (!start) start = ts;
    var p = Math.min((ts - start) / dur, 1);
    el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target);
    if (p < 1) requestAnimationFrame(step); else el.textContent = target;
  }
  requestAnimationFrame(step);
}


/* ─────────────────────────────────────────────────────
   JOIN FORM
───────────────────────────────────────────────────── */
var joinForm    = document.getElementById('join-form');
var formSuccess = document.getElementById('form-success');
joinForm.addEventListener('submit', function (e) {
  e.preventDefault();
  var btn = joinForm.querySelector('button[type="submit"]');
  btn.textContent = 'Submitting…'; btn.disabled = true;
  setTimeout(function () {
    joinForm.style.cssText += ';opacity:0;transform:scale(0.96);transition:opacity .4s,transform .4s';
    setTimeout(function () { joinForm.classList.add('hidden'); formSuccess.classList.remove('hidden'); }, 400);
  }, 900);
});


/* ─────────────────────────────────────────────────────
   HERO SPHERE PARALLAX
───────────────────────────────────────────────────── */
var sphere = document.querySelector('.core-sphere');
window.addEventListener('mousemove', function (e) {
  if (!sphere) return;
  sphere.style.transform = 'translate(' +
    ((e.clientX / window.innerWidth  - 0.5) * 14) + 'px,' +
    ((e.clientY / window.innerHeight - 0.5) * 14) + 'px)';
}, { passive: true });


/* ─────────────────────────────────────────────────────
   HERO BACKGROUND SLIDESHOW  (7s interval, crossfade)
───────────────────────────────────────────────────── */
(function initSlideshow() {
  var slides = document.querySelectorAll('.hero-slide');
  if (!slides.length) return;
  var current = 0;
  setInterval(function () {
    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
  }, 9000);
}());


/* ─────────────────────────────────────────────────────
   INIT – show the right page on load
───────────────────────────────────────────────────── */
showPage(location.hash.replace('#', '') || 'home');
