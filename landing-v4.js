(() => {
  const header = document.querySelector('.v3-site-header');
  const toggle = document.querySelector('.v3-menu-toggle');
  const menu = document.querySelector('#v3-mobile-menu');
  const stickyCta = document.querySelector('.v3-mobile-sticky-cta');
  const heroCta = document.querySelector('.v3-hero-primary');
  const pausedSections = [document.querySelector('#pricing'), document.querySelector('#intake'), document.querySelector('.cta-strip')].filter(Boolean);
  const mobile = window.matchMedia('(max-width: 760px)');
  let menuOpen = false;
  let pauseSticky = false;

  const setMenu = (open, { restoreFocus = false } = {}) => {
    menuOpen = open;
    if (!toggle || !menu) return;
    menu.hidden = !open;
    document.body.classList.toggle('v3-menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    const icon = toggle.querySelector('.material-symbols-outlined');
    if (icon) icon.textContent = open ? 'close' : 'menu';
    if (open) menu.querySelector('a')?.focus();
    if (restoreFocus) toggle.focus();
    updateSticky();
  };

  const updateSticky = () => {
    if (!stickyCta || !heroCta) return;
    const heroGone = heroCta.getBoundingClientRect().bottom <= (header?.offsetHeight || 68);
    const visible = mobile.matches && heroGone && !menuOpen && !pauseSticky;
    stickyCta.classList.toggle('is-visible', visible);
    stickyCta.setAttribute('aria-hidden', String(!visible));
    document.body.classList.toggle('has-mobile-sticky-cta', visible);
  };

  document.addEventListener('click', (event) => {
    if (!toggle || !event.target.closest('.v3-menu-toggle')) return;
    event.stopImmediatePropagation();
    setMenu(!menuOpen);
  }, true);

  menu?.addEventListener('click', (event) => {
    if (event.target.closest('a')) setMenu(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuOpen) setMenu(false, { restoreFocus: true });
    if (event.key !== 'Tab' || !menuOpen || !menu) return;
    const items = [...menu.querySelectorAll('a[href]')];
    if (!items.length) return;
    if (event.shiftKey && document.activeElement === items[0]) { event.preventDefault(); items.at(-1).focus(); }
    if (!event.shiftKey && document.activeElement === items.at(-1)) { event.preventDefault(); items[0].focus(); }
  });

  const observer = new IntersectionObserver((entries) => {
    pauseSticky = entries.some((entry) => entry.isIntersecting);
    updateSticky();
  }, { threshold: .2 });
  pausedSections.forEach((section) => observer.observe(section));
  window.addEventListener('scroll', updateSticky, { passive: true });
  mobile.addEventListener?.('change', updateSticky);
  updateSticky();
})();
