/**
 * Scroll reveal — a single IntersectionObserver for the whole page.
 *
 * Elements opt in with `data-reveal`, and may stagger within a grid via
 * `data-reveal-delay` (ms, 80ms increments; capped at MAX_DELAY so nothing drags).
 *
 * Fail-safe by design: the hidden start state lives in CSS scoped to the
 * `reveal-ready` class that THIS script adds to <html>. If the JS never runs
 * (error, old browser, blocked), the class is never added, so nothing is hidden
 * and every element is fully visible. Under reduced-motion we also skip arming.
 */
const MAX_DELAY = 400; // ms — cap the stagger so a grid never feels sluggish

export function initReveal(): void {
  const root = document.documentElement;
  const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
  if (els.length === 0) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced || !('IntersectionObserver' in window)) {
    // Leave everything visible; never arm the hidden state.
    return;
  }

  // Arm: `.reveal-ready [data-reveal]` now hides elements until they cross in.
  root.classList.add('reveal-ready');

  const io = new IntersectionObserver(
    (entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        const raw = Number(el.dataset.revealDelay ?? 0);
        const delay = Number.isFinite(raw) ? Math.min(Math.max(raw, 0), MAX_DELAY) : 0;
        if (delay) el.style.transitionDelay = `${delay}ms`;
        el.classList.add('is-visible');
        observer.unobserve(el); // reveal once — never re-animate on scroll up
      }
    },
    // Fire when an element is ~15% into the viewport.
    { rootMargin: '0px 0px -15% 0px', threshold: 0.15 },
  );

  for (const el of els) io.observe(el);
}
