document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('nav');
  const burger = document.getElementById('burger');

  // Mobile menu: full-screen sheet; lock page scroll while it is open.
  const setMenu = (open) => {
    nav.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
    burger?.setAttribute('aria-expanded', String(open));
    burger?.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
  };

  burger?.addEventListener('click', () => setMenu(!nav.classList.contains('open')));

  document.querySelectorAll('.nav__mobile a').forEach((link) => {
    link.addEventListener('click', () => setMenu(false));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) setMenu(false);
  });

  // Burger is hidden above 1100px; don't leave the sheet open after a resize.
  window.matchMedia('(min-width: 1101px)').addEventListener('change', (e) => {
    if (e.matches) setMenu(false);
  });

  // Nav background: transparent while the hero (main section) is in view,
  // white 70% once the user scrolls past it.
  const hero = document.querySelector('.hero');
  if (hero && 'IntersectionObserver' in window) {
    const navHeight = nav.offsetHeight || 72;
    const observer = new IntersectionObserver(
      ([entry]) => {
        nav.classList.toggle('nav--scrolled', !entry.isIntersecting);
      },
      { rootMargin: `-${navHeight}px 0px 0px 0px`, threshold: 0 }
    );
    observer.observe(hero);
  }

  // Product category tabs (cleaners.html / tools.html).
  // ?category=bathroom|kitchen|living preselects a tab.
  const tabs = document.querySelectorAll('.tabs__btn');
  const cards = document.querySelectorAll('.product-card');
  const applyFilter = (filter) => {
    tabs.forEach((tab) => {
      const active = tab.dataset.filter === filter;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', String(active));
    });
    cards.forEach((card) => {
      card.hidden = filter !== 'all' && card.dataset.category !== filter;
    });
  };
  if (tabs.length) {
    tabs.forEach((tab) => tab.addEventListener('click', () => {
      applyFilter(tab.dataset.filter);
      const url = new URL(location.href);
      if (tab.dataset.filter === 'all') url.searchParams.delete('category');
      else url.searchParams.set('category', tab.dataset.filter);
      history.replaceState(null, '', url);
    }));
    const initial = new URLSearchParams(location.search).get('category');
    const known = [...tabs].some((tab) => tab.dataset.filter === initial);
    applyFilter(known ? initial : 'all');
  }
});
