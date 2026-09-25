/* Corter Digital: shared site script (nav, motion, forms) */
(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Header: scrolled state ─────────────────────────────── */
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ── Desktop dropdowns (click + keyboard; hover handled in CSS) ── */
  document.querySelectorAll('.nav-item.has-menu').forEach(item => {
    const btn = item.querySelector('.nav-link');
    const close = () => { item.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', () => {
      const open = !item.classList.contains('is-open');
      item.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
    });
    item.addEventListener('keydown', e => {
      if (e.key === 'Escape') { close(); btn.focus(); }
    });
    item.addEventListener('focusout', e => {
      if (!item.contains(e.relatedTarget)) close();
    });
    document.addEventListener('click', e => { if (!item.contains(e.target)) close(); });
  });

  /* ── Mobile menu ────────────────────────────────────────── */
  const toggle = document.querySelector('.nav-toggle');
  const panel = document.getElementById('mobile-nav');
  if (header && toggle && panel) {
    const setOpen = open => {
      header.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      panel.inert = !open;
      document.documentElement.style.overflow = open ? 'hidden' : '';
      if (open) panel.querySelector('a')?.focus({ preventScroll: true });
    };
    panel.inert = true;
    toggle.addEventListener('click', () => setOpen(!header.classList.contains('is-open')));
    panel.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && header.classList.contains('is-open')) { setOpen(false); toggle.focus(); }
    });
    window.matchMedia('(min-width: 901px)').addEventListener('change', e => { if (e.matches) setOpen(false); });
  }

  /* ── Reveal on scroll ───────────────────────────────────── */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(el => el.classList.add('is-in'));
  } else {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('is-in'); io.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealEls.forEach(el => io.observe(el));
  }

  /* ── Count-up stats ─────────────────────────────────────── */
  // Markup: <span data-count="10" data-suffix="M+">10M+</span>
  // The final value is in the HTML, so it reads correctly without JS.
  const counters = document.querySelectorAll('[data-count]');
  if (!reduceMotion && counters.length && 'IntersectionObserver' in window) {
    const fmt = (n, dec) => n.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });
    const run = el => {
      const target = parseFloat(el.dataset.count);
      const dec = (el.dataset.count.split('.')[1] || '').length;
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      const dur = 1600;
      const start = performance.now();
      const tick = now => {
        const t = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - t, 4);
        el.textContent = prefix + fmt(target * eased, dec) + suffix;
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const cio = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { run(entry.target); cio.unobserve(entry.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(el => {
      el.textContent = (el.dataset.prefix || '') + '0' + (el.dataset.suffix || '');
      cio.observe(el);
    });
  }

  /* ── Cursor spotlight on cards ──────────────────────────── */
  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.card--glow').forEach(card => {
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - r.left}px`);
        card.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    });
  }

  /* ── Forms (Formspree) ──────────────────────────────────── */
  // Same submission as before: POST FormData to the form's action with
  // Accept: application/json. Adds client-side checks for name + email.
  document.querySelectorAll('form[data-ajax]').forEach(form => {
    const success = form.querySelector('.form-status--success');
    const error = form.querySelector('.form-status--error');
    const submit = form.querySelector('[type="submit"]');
    const submitLabel = submit.querySelector('.btn-label');
    const idleText = submitLabel ? submitLabel.textContent : '';

    const validators = {
      name:  v => v.trim().length > 0 || 'Please enter your name.',
      email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Please enter a valid email address.'
    };

    const check = input => {
      const rule = validators[input.name];
      if (!rule) return true;
      const result = rule(input.value);
      const field = input.closest('.field');
      const msg = field.querySelector('.field-error');
      const ok = result === true;
      field.classList.toggle('is-invalid', !ok);
      input.setAttribute('aria-invalid', String(!ok));
      if (msg) msg.textContent = ok ? '' : result;
      return ok;
    };

    form.querySelectorAll('input, textarea').forEach(input => {
      input.addEventListener('blur', () => { if (input.value) check(input); });
      input.addEventListener('input', () => {
        if (input.closest('.field')?.classList.contains('is-invalid')) check(input);
      });
    });

    form.addEventListener('submit', async e => {
      e.preventDefault();
      success?.classList.remove('is-visible');
      error?.classList.remove('is-visible');

      const inputs = [...form.querySelectorAll('input, textarea')];
      const invalid = inputs.filter(i => !check(i));
      if (invalid.length) { invalid[0].focus(); return; }

      submit.disabled = true;
      submit.classList.add('is-loading');
      if (submitLabel) submitLabel.textContent = 'Sending…';

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        });
        if (res.ok) {
          form.reset();
          success?.classList.add('is-visible');
          success?.focus();
        } else {
          error?.classList.add('is-visible');
          error?.focus();
        }
      } catch {
        error?.classList.add('is-visible');
        error?.focus();
      } finally {
        submit.disabled = false;
        submit.classList.remove('is-loading');
        if (submitLabel) submitLabel.textContent = idleText;
      }
    });
  });

  /* ── Filterable grids (Our Work) ────────────────────────── */
  // Buttons: [data-filter="websites"] inside [data-filter-bar="gridId"]
  // Items:   children of #gridId with data-category="websites social"
  document.querySelectorAll('[data-filter-bar]').forEach(bar => {
    const grid = document.getElementById(bar.dataset.filterBar);
    if (!grid) return;
    const buttons = bar.querySelectorAll('[data-filter]');
    const items = [...grid.children];
    const status = document.getElementById(bar.dataset.filterStatus);

    buttons.forEach(btn => {
      const f = btn.dataset.filter;
      const count = btn.querySelector('.filter-count');
      if (count) count.textContent = f === 'all'
        ? items.filter(i => i.dataset.category).length
        : items.filter(i => (i.dataset.category || '').split(' ').includes(f)).length;

      btn.addEventListener('click', () => {
        buttons.forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
        let shown = 0;
        items.forEach(item => {
          const cats = (item.dataset.category || '').split(' ');
          const show = f === 'all' || cats.includes(f) || item.dataset.category === undefined;
          item.hidden = !show;
          if (show && item.dataset.category) {
            shown++;
            item.classList.remove('is-in');
            requestAnimationFrame(() => item.classList.add('is-in'));
          }
        });
        if (status) status.textContent = `Showing ${shown} project${shown === 1 ? '' : 's'}`;
      });
    });
  });

  /* ── Footer year ────────────────────────────────────────── */
  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
})();
