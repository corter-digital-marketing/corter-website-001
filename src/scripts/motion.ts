/**
 * Cinematic motion: GSAP + ScrollTrigger + SplitText, Lenis smooth scroll.
 * Driven entirely by data attributes (see CLAUDE.md). Nothing here runs when the
 * visitor prefers reduced motion. Content is fully visible without it.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);

const EASE = 'expo.out';
let ctx: gsap.Context | null = null;
let lenis: Lenis | null = null;
let tick: ((t: number) => void) | null = null;

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function startLenis() {
  lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4), anchors: true });
  (window as unknown as { lenis: Lenis }).lenis = lenis;
  lenis.on('scroll', ScrollTrigger.update);
  tick = (t) => lenis?.raf(t * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
}

function stopLenis() {
  if (tick) gsap.ticker.remove(tick);
  lenis?.destroy();
  lenis = null;
  tick = null;
  (window as unknown as { lenis?: Lenis }).lenis = undefined;
}

function animatePage() {
  ctx = gsap.context(() => {
    /* Headlines: line-by-line mask reveal */
    document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
      const onLoad = el.dataset.split === 'load';
      SplitText.create(el, {
        type: 'lines',
        mask: 'lines',
        linesClass: 'split-line',
        autoSplit: true,
        onSplit(self) {
          gsap.set(el, { visibility: 'visible' });
          return gsap.from(self.lines, {
            yPercent: 115,
            duration: 1.3,
            ease: EASE,
            stagger: 0.09,
            delay: onLoad ? 0.15 : 0,
            scrollTrigger: onLoad ? undefined : { trigger: el, start: 'top 88%', once: true },
          });
        },
      });
    });

    /* Fade + rise */
    gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
      const inHero = !!el.closest('[data-hero]') || el.getBoundingClientRect().top < window.innerHeight;
      gsap.fromTo(el, { autoAlpha: 0, y: 36 }, {
        autoAlpha: 1, y: 0, duration: 1.2, ease: EASE,
        delay: inHero ? 0.45 : 0,
        scrollTrigger: inHero ? undefined : { trigger: el, start: 'top 90%', once: true },
      });
    });

    /* Staggered children */
    gsap.utils.toArray<HTMLElement>('[data-stagger]').forEach((parent) => {
      gsap.fromTo(parent.children, { autoAlpha: 0, y: 40 }, {
        autoAlpha: 1, y: 0, duration: 1.1, ease: EASE, stagger: 0.1,
        scrollTrigger: { trigger: parent, start: 'top 85%', once: true },
      });
    });

    /* Image clip + scale reveal */
    gsap.utils.toArray<HTMLElement>('[data-reveal-img]').forEach((el) => {
      const inner = el.firstElementChild;
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
      tl.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut' });
      if (inner) tl.fromTo(inner, { scale: 1.2 }, { scale: 1, duration: 1.8, ease: EASE }, 0);
    });

    /* Count-up stats */
    gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
      const target = parseFloat(el.dataset.count || '0');
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      const obj = { v: 0 };
      el.textContent = `${prefix}0${suffix}`;
      gsap.to(obj, {
        v: target, duration: 2, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        onUpdate: () => { el.textContent = `${prefix}${Math.round(obj.v)}${suffix}`; },
      });
    });

    /* Hero media drifts slower than the page */
    gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
      gsap.to(el, {
        yPercent: 12, ease: 'none',
        scrollTrigger: { trigger: el.closest('section') || el, start: 'top top', end: 'bottom top', scrub: true },
      });
    });

    /* Pinned process section (desktop only) */
    const mm = gsap.matchMedia();
    mm.add('(min-width: 1024px)', () => {
      document.querySelectorAll<HTMLElement>('[data-pin-steps]').forEach((section) => {
        const steps = section.querySelectorAll<HTMLElement>('[data-step]');
        const bar = section.querySelector<HTMLElement>('[data-step-progress]');
        const setActive = (p: number) => {
          const active = Math.min(steps.length - 1, Math.floor(p * steps.length * 0.999));
          steps.forEach((s, i) => s.classList.toggle('is-active', i <= active));
        };
        setActive(0);
        ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          end: () => `+=${window.innerHeight * 1.4}`,
          pin: true,
          scrub: true,
          onUpdate: (self) => {
            setActive(self.progress);
            if (bar) gsap.set(bar, { scaleX: self.progress });
          },
        });
        return () => steps.forEach((s) => s.classList.add('is-active'));
      });
    });
  });
}

document.addEventListener('astro:page-load', () => {
  if (reduced()) {
    document.querySelectorAll('[data-step]').forEach((s) => s.classList.add('is-active'));
    return;
  }
  startLenis();
  // Wait for fonts so SplitText measures real line breaks
  document.fonts.ready.then(() => {
    animatePage();
    ScrollTrigger.refresh();
  });
});

document.addEventListener('astro:before-swap', () => {
  ctx?.revert();
  ctx = null;
  ScrollTrigger.getAll().forEach((t) => t.kill());
  stopLenis();
});

window.addEventListener('layout:change', () => ScrollTrigger.refresh());
