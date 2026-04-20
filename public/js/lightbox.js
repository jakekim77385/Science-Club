// ── Gallery Lightbox ──────────────────────────────────────
(function () {
  const overlay  = document.getElementById('lightbox');
  const img      = document.getElementById('lightbox-img');
  const title    = document.getElementById('lightbox-title');
  const counter  = document.getElementById('lightbox-counter');
  const btnClose = document.getElementById('lightbox-close');
  const btnPrev  = document.getElementById('lightbox-prev');
  const btnNext  = document.getElementById('lightbox-next');

  let images = [];
  let current = 0;

  function show(idx) {
    current = idx;
    img.src = images[idx];
    counter.textContent = `${idx + 1} / ${images.length}`;
    btnPrev.disabled = idx === 0;
    btnNext.disabled = idx === images.length - 1;
  }

  function open(gallery, titleText) {
    images = gallery;
    title.textContent = titleText;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    show(0);
  }

  function close() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    img.src = '';
  }

  // Attach click to each gallery card
  document.querySelectorAll('.gallery-row-card[data-gallery]').forEach(card => {
    card.addEventListener('click', () => {
      const gallery = JSON.parse(card.dataset.gallery);
      const titleText = card.dataset.title || '';
      open(gallery, titleText);
    });
  });

  btnClose.addEventListener('click', close);
  btnPrev.addEventListener('click', () => show(current - 1));
  btnNext.addEventListener('click', () => show(current + 1));

  // Close on backdrop click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('active')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight' && current < images.length - 1) show(current + 1);
    if (e.key === 'ArrowLeft'  && current > 0)                 show(current - 1);
  });
})();
