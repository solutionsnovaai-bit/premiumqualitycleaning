const EASE = 'cubic-bezier(.22,1,.36,1)';

/** Finite native timeline. Cleanup restores focus, scroll and inert state even in StrictMode. */
export function runBrandIntro(root, refs, props, onReady) {
  const el = refs.loaderRef.current;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const animations = [], timers = [], inert = [];
  let disposed = false, leaving = false, ready = false, locked = false;
  const oldOverflow = document.documentElement.style.overflow;
  const oldFocus = document.activeElement;
  // Replay the full timeline on every page load, including anchored or restored-scroll reloads.
  const skip = !el || props.showLoader === false || reduced.matches;
  const schedule = (fn, delay) => { const id = setTimeout(() => { if (!disposed) fn(); }, delay); timers.push(id); };
  const animate = (target, frames, duration, delay = 0, easing = EASE, fill = 'both') => {
    if (!target?.animate) return null;
    const animation = target.animate(frames, { duration, delay, easing, fill });
    animations.push(animation);
    return animation;
  };
  function release() {
    if (!locked) return;
    locked = false;
    document.documentElement.style.overflow = oldOverflow;
    inert.forEach(([node, value]) => { node.inert = value; });
    if (el.contains(document.activeElement)) {
      if (oldFocus && oldFocus !== document.body && oldFocus.isConnected) oldFocus.focus({ preventScroll: true });
      else root.querySelector('#main')?.focus({ preventScroll: true });
    }
  }
  function reveal() {
    if (ready || disposed) return;
    ready = true;
    root.dataset.intro = 'complete';
    release();
    onReady();
  }
  function finish(immediate = false) {
    if (leaving || disposed) return;
    leaving = true;
    reveal();
    el.style.pointerEvents = 'none';
    if (immediate || reduced.matches) { el.hidden = true; return; }
    animate(el, [
      { clipPath: 'polygon(0 0,100% 0,100% 100%,0 100%)', opacity: 1 },
      { clipPath: 'polygon(0 0,100% 0,100% 0,0 15%)', opacity: 1, offset: .85 },
      { clipPath: 'polygon(0 0,100% 0,100% 0,0 0)', opacity: 0 }
    ], 920);
    animate(el.querySelector('.cs-intro__stage'), [{ transform: 'translateY(0) scale(1)' }, { transform: 'translateY(-54px) scale(1.06)' }], 850);
    schedule(() => { el.hidden = true; animations.forEach(a => a.cancel()); }, 940);
  }
  const skipIntro = () => finish(true);
  const keydown = e => {
    if (e.key === 'Escape') { e.preventDefault(); skipIntro(); }
    // The intro has one interactive control; keep Tab inside while the page is inert.
    if (e.key === 'Tab' && !leaving) { e.preventDefault(); el.querySelector('[data-intro-skip]').focus(); }
  };
  function destroy() {
    disposed = true;
    timers.forEach(clearTimeout);
    animations.forEach(a => a.cancel());
    release();
    el?.querySelector('[data-intro-skip]')?.removeEventListener('click', skipIntro);
    document.removeEventListener('keydown', keydown);
    reduced.removeEventListener('change', skipIntro);
    window.removeEventListener('pagehide', skipIntro);
    delete root.dataset.intro;
  }
  if (skip || !el.animate) {
    if (el) el.hidden = true;
    reveal();
    return destroy;
  }
  el.hidden = false;
  el.style.pointerEvents = '';
  root.dataset.intro = 'playing';
  locked = true;
  document.documentElement.style.overflow = 'hidden';
  Array.from(root.children).filter(node => node !== el).forEach(node => { inert.push([node, node.inert]); node.inert = true; });
  el.focus({ preventScroll: true });
  el.querySelector('[data-intro-skip]').addEventListener('click', skipIntro);
  document.addEventListener('keydown', keydown);
  reduced.addEventListener('change', skipIntro);
  window.addEventListener('pagehide', skipIntro);
  // Never leave a visitor behind a loading screen, including failed image decoding.
  schedule(() => finish(true), 5400);

  // Where the big sparkle lands, in page and stage coordinates.
  const stage = el.querySelector('.bt-stage');
  const r = stage.getBoundingClientRect();
  const SX = 0.824, SY = 0.109;
  const px = ((r.left + r.width * SX) / window.innerWidth * 100).toFixed(1) + '%';
  const py = ((r.top + r.height * SY) / window.innerHeight * 100).toFixed(1) + '%';
  const dx = r.width * (.5 - SX), dy = r.height * (.46 - SY);

  animate(el.querySelector('.cs-intro__halo'), [{ opacity: .18, transform: 'scale(.8)' }, { opacity: .7, offset: .4 }, { opacity: 0, transform: 'scale(1.35)' }], 1700);
  animate(el.querySelector('.cs-intro__paper'), [{ clipPath: `circle(0% at ${px} ${py})` }, { clipPath: `circle(150% at ${px} ${py})` }], 1250, 420, 'cubic-bezier(.55,0,.2,1)');
  animate(el.querySelector('.cs-intro__top'), [{ opacity: 0 }, { opacity: .55, offset: .3 }, { opacity: 0 }], 1700);
  animate(el.querySelector('.cs-intro__bottom'), [{ color: '#efe6dc' }, { color: '#7a5a48' }], 600, 850);
  animate(el.querySelector('.cs-intro__rule i'), [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], 3240, 0, 'linear');

  // Macro camera move: the big sparkle starts huge in the middle and flies into the logo.
  const C = 'translate(-50%,-50%) ';
  animate(el.querySelector('[data-intro-star="0"]'), [
    { opacity: 0, transform: `${C}translate(${dx}px,${dy}px) rotate(-16deg) scale(9)` },
    { opacity: 1, transform: `${C}translate(${dx}px,${dy}px) rotate(-12deg) scale(8.2)`, offset: .16 },
    { opacity: 1, transform: `${C}translate(${dx * .5}px,${dy * .5}px) rotate(-5deg) scale(4)`, offset: .55 },
    { opacity: 1, transform: `${C}translate(0,0) rotate(0deg) scale(1)` }
  ], 1650, 0, 'cubic-bezier(.45,0,.18,1)');
  el.querySelectorAll('[data-intro-star]').forEach((star, i) => {
    if (!i) return;
    const dir = i % 2 ? -1 : 1;
    animate(star, [{ opacity: 0, transform: `${C}translate(${dir * (26 + i * 6)}px,${24 - i * 9}px) rotate(${dir * 18}deg) scale(.55)` }, { opacity: 1, transform: `${C}translate(0,0) rotate(0deg) scale(1)` }], 850, 1040 + i * 70);
  });
  // The symbol spreads out from the sparkle; the lettering is written in from the left.
  animate(el.querySelector('[data-intro-sym]'), [
    { opacity: 0, clipPath: `circle(0% at ${SX * 100}% ${SY * 100}%)`, transform: 'scale(1.04)' },
    { opacity: 1, clipPath: `circle(60% at ${SX * 100}% ${SY * 100}%)`, offset: .5 },
    { opacity: 1, clipPath: `circle(160% at ${SX * 100}% ${SY * 100}%)`, transform: 'scale(1)' }
  ], 1300, 1250, 'cubic-bezier(.55,0,.2,1)');
  animate(el.querySelector('[data-intro-word]'), [
    { opacity: 0, clipPath: 'inset(0 100% 0 0)', transform: 'translateY(3%)' },
    { opacity: 1, clipPath: 'inset(0 0% 0 0)', transform: 'translateY(0)' }
  ], 1000, 1800, 'cubic-bezier(.35,.05,.3,1)');
  el.querySelectorAll('[data-intro-star]').forEach(star => {
    // No backwards fill: the handoff must not override the stars' entrance opacity.
    animate(star, [{ opacity: 1 }, { opacity: 0 }], 280, 2700, 'linear', 'forwards');
  });
  animate(el.querySelector('[data-intro-shine]'), [
    { opacity: 0, transform: 'translateX(-130%) skewX(-18deg)' },
    { opacity: .9, offset: .3 },
    { opacity: 0, transform: 'translateX(230%) skewX(-18deg)' }
  ], 760, 2780, 'cubic-bezier(.4,0,.2,1)');
  schedule(() => finish(), 3400);
  return destroy;
}
