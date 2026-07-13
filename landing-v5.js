(() => {
  const toggle = document.querySelector('.site-menu-toggle');
  const menu = document.querySelector('#site-mobile-menu');
  const sticky = document.querySelector('.v5-sticky-cta');
  const heroCta = document.querySelector('.v5-hero-primary');
  const mobile = window.matchMedia('(max-width: 700px)');
  const pauseZones = [...document.querySelectorAll('#pricing, #intake')];
  let menuOpen = false;
  let paused = false;
  const localized = (key, fallback) => window.mirrortaleSiteLanguage?.t?.(key) || fallback;

  const updateSticky = () => {
    if (!sticky || !heroCta) return;
    const heroPassed = heroCta.getBoundingClientRect().bottom < 68;
    const show = mobile.matches && heroPassed && !menuOpen && !paused;
    sticky.classList.toggle('is-visible', show);
    sticky.setAttribute('aria-hidden', String(!show));
    document.body.classList.toggle('has-v5-sticky', show);
  };

  const setMenu = (open, restoreFocus = false) => {
    if (!toggle || !menu) return;
    menuOpen = open;
    menu.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? localized('nav.menu.close', 'Close menu') : localized('nav.menu.open', 'Open menu'));
    toggle.querySelector('.material-symbols-outlined').textContent = open ? 'close' : 'menu';
    document.body.classList.toggle('menu-open', open);
    if (open) menu.querySelector('a')?.focus();
    if (restoreFocus) toggle.focus();
    updateSticky();
  };

  toggle?.addEventListener('click', () => setMenu(!menuOpen));
  menu?.addEventListener('click', (event) => { if (event.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuOpen) setMenu(false, true);
    if (event.key !== 'Tab' || !menuOpen || !menu) return;
    const links = [...menu.querySelectorAll('a[href]')];
    if (!links.length) return;
    if (event.shiftKey && document.activeElement === links[0]) { event.preventDefault(); links.at(-1).focus(); }
    if (!event.shiftKey && document.activeElement === links.at(-1)) { event.preventDefault(); links[0].focus(); }
  });

  const zoneObserver = new IntersectionObserver((entries) => {
    paused = entries.some((entry) => entry.isIntersecting);
    updateSticky();
  }, { threshold: .12 });
  pauseZones.forEach((zone) => zoneObserver.observe(zone));
  window.addEventListener('scroll', updateSticky, { passive: true });
  window.addEventListener('resize', updateSticky);
  mobile.addEventListener?.('change', updateSticky);
  updateSticky();
})();
