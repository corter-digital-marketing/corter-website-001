/**
 * Motion. Only four moments animate (see CLAUDE.md):
 *   1. [data-split]       hero headline, line by line, on load
 *   2. .grid-lines        column hairlines draw in, first page load of the visit only
 *   3. [data-reveal-img]  media clip reveal when scrolled into view
 *   4. [data-count]       stat counters
 * Plus Lenis smooth scrolling. Nothing runs under prefers-reduced-motion.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { CustomEase } from 'gsap/CustomEase';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);
// Slow, precise, no overshoot. Matches --ease-precise in global.css.
CustomEase.create('precise', '0.7,0,0.2,1');
CustomEase.create('settle', '0.22,1,0.36,1');

let ctx: gsap.Context | null = null;
let lenis: Lenis | null = null;
let tick: ((t: number) => void) | null = null;

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function startLenis() {
  lenis = new Lenis({ duration: 1.1, easing: (t) => 1 - Math.pow(1 - t, 3), anchors: true });
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
    const root = document.documentElement;

    /* 2. Gridlines draw in, once per visit */
    if (root.classList.contains('first-load')) {
      gsap.to('.grid-lines > i', {
        scaleY: 1, duration: 1.6, ease: 'precise', stagger: 0.04,
        onComplete: () => root.classList.remove('first-load'),
      });
      try { sessionStorage.setItem('cd-seen', '1'); } catch { /* storage blocked */ }
    }

    /* 1. Hero headline, line by line */
    document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
      SplitText.create(el, {
        type: 'lines',
        mask: 'lines',
        autoSplit: true,
        onSplit(self) {
          gsap.set(el, { visibility: 'visible' });
          return gsap.from(self.lines, { yPercent: 105, duration: 1.4, ease: 'settle', stagger: 0.1, delay: 0.2 });
        },
      });
    });

    /* 3. Media clip reveal */
    gsap.utils.toArray<HTMLElement>('[data-reveal-img]').forEach((el) => {
      gsap.fromTo(el, { clipPath: 'inset(0% 0% 100% 0%)' }, {
        clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'precise',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      });
    });

    /* 4. Counters */
    gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
      const target = parseFloat(el.dataset.count || '0');
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      const obj = { v: 0 };
      el.textContent = `${prefix}0${suffix}`;
      gsap.to(obj, {
        v: target, duration: 1.8, ease: 'settle',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        onUpdate: () => { el.textContent = `${prefix}${Math.round(obj.v)}${suffix}`; },
      });
    });
  });
}

document.addEventListener('astro:page-load', () => {
  if (reduced()) return;
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
