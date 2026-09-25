/**
 * Site UI behavior. Everything here re-runs on `astro:page-load`
 * (fires on first load and after every View Transition navigation).
 */

type LenisLike = { stop: () => void; start: () => void } | undefined;
const lenis = (): LenisLike => (window as unknown as { lenis?: LenisLike }).lenis;
const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Listeners on document/window are tied to the current page and removed on navigation */
let page = new AbortController();
document.addEventListener('astro:before-swap', () => { page.abort(); page = new AbortController(); });

/* ── Header: solid on scroll ───────────────────────────────── */
function updateHeader() {
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!header) return;
  const solid = window.scrollY > 24 || document.body.classList.contains('nav-solid');
  header.classList.toggle('is-scrolled', solid);
}
window.addEventListener('scroll', updateHeader, { passive: true });

/* ── Desktop dropdown ──────────────────────────────────────── */
function initDropdowns() {
  document.querySelectorAll<HTMLElement>('[data-dropdown]').forEach((item) => {
    const btn = item.querySelector('button')!;
    const setOpen = (open: boolean) => {
      item.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
    };
    btn.addEventListener('click', () => setOpen(!item.classList.contains('is-open')));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { setOpen(false); btn.focus(); }
    });
    item.addEventListener('focusout', (e) => {
      if (!item.contains(e.relatedTarget as Node)) setOpen(false);
    });
    document.addEventListener('click', (e) => {
      if (!item.contains(e.target as Node)) setOpen(false);
    }, { signal: page.signal });
  });
}

/* ── Mobile menu ───────────────────────────────────────────── */
function initMobileMenu() {
  const header = document.querySelector<HTMLElement>('[data-header]');
  const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const menu = document.querySelector<HTMLElement>('[data-mobile-menu]');
  if (!header || !toggle || !menu) return;

  const setOpen = (open: boolean) => {
    header.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.inert = !open;
    document.documentElement.style.overflow = open ? 'hidden' : '';
    if (open) lenis()?.stop(); else lenis()?.start();
  };

  toggle.addEventListener('click', () => setOpen(!header.classList.contains('menu-open')));
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && header.classList.contains('menu-open')) { setOpen(false); toggle.focus(); }
  }, { signal: page.signal });
  window.matchMedia('(min-width: 1024px)').addEventListener('change', (e) => { if (e.matches) setOpen(false); }, { signal: page.signal });
}

/* ── Accordions: optionally only one open at a time ────────── */
function initAccordions() {
  document.querySelectorAll<HTMLElement>('[data-accordion="single"]').forEach((acc) => {
    const items = acc.querySelectorAll('details');
    items.forEach((d) => {
      d.addEventListener('toggle', () => {
        if (d.open) items.forEach((o) => { if (o !== d) o.open = false; });
        window.dispatchEvent(new Event('layout:change'));
      });
    });
  });
}

/* ── Filterable grids (Our Work) ───────────────────────────── */
function initFilters() {
  document.querySelectorAll<HTMLElement>('[data-filter-bar]').forEach((bar) => {
    const grid = document.getElementById(bar.dataset.filterBar!);
    if (!grid) return;
    const buttons = bar.querySelectorAll<HTMLButtonElement>('[data-filter]');
    const items = Array.from(grid.children) as HTMLElement[];
    const status = document.getElementById(bar.dataset.filterStatus || '');

    buttons.forEach((btn) => {
      const f = btn.dataset.filter!;
      const count = btn.querySelector('[data-count-label]');
      const matches = (el: HTMLElement) => !el.dataset.category || f === 'all' || el.dataset.category === f;
      if (count) count.textContent = String(items.filter((i) => i.dataset.category && matches(i)).length).padStart(2, '0');

      btn.addEventListener('click', () => {
        buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
        let shown = 0;
        items.forEach((item) => {
          const show = matches(item);
          item.hidden = !show;
          if (show && item.dataset.category) shown++;
          if (show && !reduceMotion()) {
            item.animate([{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'none' }], { duration: 600, easing: 'cubic-bezier(.16,1,.3,1)' });
          }
        });
        if (status) status.textContent = `Showing ${shown} project${shown === 1 ? '' : 's'}`;
        window.dispatchEvent(new Event('layout:change'));
      });
    });
  });
}

/* ── Forms (Formspree, same endpoint and fields as the old site) ── */
function initForms() {
  document.querySelectorAll<HTMLFormElement>('form[data-ajax]').forEach((form) => {
    const success = form.querySelector<HTMLElement>('.form-status--success');
    const error = form.querySelector<HTMLElement>('.form-status--error');
    const submit = form.querySelector<HTMLButtonElement>('[type="submit"]')!;
    const label = submit.querySelector('.btn-label');
    const idle = label?.textContent ?? '';

    const rules: Record<string, (v: string) => true | string> = {
      name: (v) => v.trim().length > 0 || 'Please enter your name.',
      email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Please enter a valid email address.',
    };
    const check = (input: HTMLInputElement | HTMLTextAreaElement) => {
      const rule = rules[input.name];
      if (!rule) return true;
      const result = rule(input.value);
      const field = input.closest('.field');
      const msg = field?.querySelector('.field-error');
      const ok = result === true;
      field?.classList.toggle('is-invalid', !ok);
      input.setAttribute('aria-invalid', String(!ok));
      if (msg) msg.textContent = ok ? '' : (result as string);
      return ok;
    };

    const inputs = Array.from(form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input:not([type=hidden]), textarea'));
    inputs.forEach((input) => {
      input.addEventListener('blur', () => { if (input.value) check(input); });
      input.addEventListener('input', () => { if (input.closest('.field')?.classList.contains('is-invalid')) check(input); });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      success?.classList.remove('is-visible');
      error?.classList.remove('is-visible');
      const invalid = inputs.filter((i) => !check(i));
      if (invalid.length) { invalid[0].focus(); return; }

      submit.disabled = true;
      submit.classList.add('is-loading');
      if (label) label.textContent = 'Sending…';
      try {
        const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
        if (!res.ok) throw new Error(String(res.status));
        form.reset();
        success?.classList.add('is-visible');
        success?.focus();
      } catch {
        error?.classList.add('is-visible');
        error?.focus();
      } finally {
        submit.disabled = false;
        submit.classList.remove('is-loading');
        if (label) label.textContent = idle;
        window.dispatchEvent(new Event('layout:change'));
      }
    });
  });
}

/* ── Hero video: load after the page is ready, never on Data Saver ── */
function initHeroVideo() {
  const video = document.querySelector<HTMLVideoElement>('[data-hero-video]');
  if (!video) return;
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (reduceMotion() || conn?.saveData) return;

  const start = () => {
    const mobile = window.matchMedia('(max-width: 767px)').matches;
    video.src = (mobile ? video.dataset.srcMobile : video.dataset.srcDesktop) || '';
    video.play().then(() => video.classList.add('!opacity-100')).catch(() => {});
    // Pause when scrolled out of view to save battery
    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {}); else video.pause();
    }).observe(video);
  };
  if (document.readyState === 'complete') setTimeout(start, 300);
  else window.addEventListener('load', () => setTimeout(start, 300), { once: true });
}

document.addEventListener('astro:page-load', () => {
  document.documentElement.style.overflow = '';
  updateHeader();
  initDropdowns();
  initMobileMenu();
  initAccordions();
  initFilters();
  initForms();
  initHeroVideo();
  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = String(new Date().getFullYear()); });
});
