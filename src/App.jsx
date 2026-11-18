import { useRef, useEffect, useLayoutEffect, useState } from 'react';
import { css } from './utils.js';
import { initSite } from './behaviors.js';
import { applyLang, getLang, saveLang, isPT } from './i18n.js';
import { resplitHeading } from './motion.js';
import BrandIntro from './BrandIntro.jsx';
import ScrollScene from './ScrollScene.jsx';
import './motion.css';

// 1×1 transparent GIF: placeholder for images whose real source is chosen by <picture> or set on demand.
const PX = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

// Intrinsic size of each gallery photo (every one ships as 480 / 800 / 1200 px wide WebP).
const V = [1170, 1544], H = [1170, 657];
const GAL = { g1: V, g2: V, g3: V, g4: V, g5: V, g6: V, g7: V, g8: [1170, 1463], g9: H, g10: V, g11: H, g12: H };

function galSet(id) {
  const base = 'assets/gallery/' + id;
  return base + '-480.webp 480w, ' + base + '-800.webp 800w, ' + base + '-1200.webp 1200w';
}

// Attributes for a responsive gallery <img>; `sizes` tells the browser how wide it is drawn.
function gimg(id, sizes) {
  return { src: 'assets/gallery/' + id + '-800.webp', srcSet: galSet(id), sizes, width: GAL[id][0], height: GAL[id][1], decoding: 'async' };
}

const PHONE = '+1 (781) 518-3262';
const WHATSAPP = '17815183262';
const WA_HELLO = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent("Hi Premium Quality Cleaning! I'd like a free estimate for my home.");

const SZ_PANEL_SM = '(max-width:1020px) 92vw, 1px';
const SZ_PANEL = '(min-width:1021px) 46vw, 92vw';
const SZ_INSET = '(min-width:1021px) 15vw, 30vw';
const SZ_STYLE = '(max-width:1020px) 92vw, 44vw';
const SZ_CARD = '(max-width:640px) 92vw, (max-width:1020px) 46vw, 31vw';
const SZ_LOOP = '(max-width:900px) 160px, 345px';
const SZ_LOOP_WIDE = '(max-width:900px) 280px, 615px';

// Language switch: United States on one side, Brazil on the other.
const FLAG_US = (
  <svg viewBox="0 0 30 30" aria-hidden="true">
    <defs><clipPath id="bt-flag-us"><circle cx="15" cy="15" r="15" /></clipPath></defs>
    <g clipPath="url(#bt-flag-us)">
      <rect width="30" height="30" fill="#fff" />
      {[0, 2, 4, 6, 8, 10, 12].map((i) => <rect key={i} y={i * 30 / 13} width="30" height={30 / 13} fill="#B22234" />)}
      <rect width="14" height={30 / 13 * 7} fill="#3C3B6E" />
      {[[3, 3], [7, 3], [11, 3], [5, 6.5], [9, 6.5], [3, 10], [7, 10], [11, 10], [5, 13.5], [9, 13.5]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r=".9" fill="#fff" />)}
    </g>
  </svg>
);
const FLAG_BR = (
  <svg viewBox="0 0 30 30" aria-hidden="true">
    <defs><clipPath id="bt-flag-br"><circle cx="15" cy="15" r="15" /></clipPath></defs>
    <g clipPath="url(#bt-flag-br)">
      <rect width="30" height="30" fill="#009C3B" />
      <path d="M15 4.2 28.4 15 15 25.8 1.6 15Z" fill="#FFDF00" />
      <circle cx="15" cy="15" r="6.3" fill="#002776" />
      <path d="M8.9 13.9c3.9-1.1 8.3-.4 12 1.9" stroke="#fff" strokeWidth="1.2" fill="none" />
    </g>
  </svg>
);

const LEAF = <svg viewBox="0 0 100 100" width=".75em" height=".75em" aria-hidden="true" style={{display:'inline-block',verticalAlign:'middle',transform:'rotate(35deg)'}}><path fill="currentColor" d="M50 0C80 25 80 75 50 100C20 75 20 25 50 0Z" /></svg>;

function LangSwitch({ onChange }) {
  const [lang, setLang] = useState(getLang);
  const pt = lang === 'pt';
  const toggle = () => { const next = pt ? 'en' : 'pt'; setLang(next); onChange(next); };
  return (
    <button type="button" role="switch" aria-checked={pt} aria-label="Switch language" title="English / Português" className="bt-lang" data-lang={lang} onClick={toggle}>
      <span className="bt-lang__knob" aria-hidden="true" />
      <span className="bt-lang__flag" data-flag="us">{FLAG_US}</span>
      <span className="bt-lang__flag" data-flag="br">{FLAG_BR}</span>
    </button>
  );
}

export default function App({ accentPink = '#A3161F', loopSpeed = 64, showLoader = true, sparkleHover = true } = {}) {
  const rootRef = useRef(null);
  const loaderRef = useRef(null);
  const loaderMarkRef = useRef(null);
  const loaderTxtRef = useRef(null);
  const progressRef = useRef(null);
  const navRef = useRef(null);
  const menuRef = useRef(null);
  const heroBgRef = useRef(null);
  const rotatorRef = useRef(null);
  const rotatorRefSm = useRef(null);
  const svcLabelRef = useRef(null);
  const svcNumRef = useRef(null);
  const styleImgRef = useRef(null);
  const formMsgRef = useRef(null);
  const formAltRef = useRef(null);
  const stickyCtaRef = useRef(null);
  const sparkleTextRef = useRef(null);
  const whatsRef = useRef(null);
  const loopARef = useRef(null);
  const loopBRef = useRef(null);
  const stripRef = useRef(null);
  const sparkleRef = useRef(null);
  const baTrackRef = useRef(null);
  const baBarRef = useRef(null);
  const stateRef = useRef({ ctaDismissed: false, tagSeq: 0 });

  const props = { accentPink, loopSpeed, showLoader, sparkleHover };
  const year = new Date().getFullYear();

  const gal = [
    { id: 'g1', alt: 'Bright living room with polished hardwood floors', tag: 'Living rooms', sub: 'Detailed' },
    { id: 'g2', alt: 'Kitchen with spotless counters and cabinets', tag: 'Kitchens', sub: 'Standard' },
    { id: 'g7', alt: 'Marble shower and bathroom cleaned to shine', tag: 'Bathrooms', sub: 'Detailed' },
    { id: 'g4', alt: 'Bedroom with fresh bedding and clean floors', tag: 'Bedrooms', sub: 'Standard' },
    { id: 'g9', alt: 'Family room with sofas and fireplace', tag: 'Family rooms', sub: 'Reset' },
    { id: 'g6', alt: 'Open kitchen with gleaming floors', tag: 'Kitchens', sub: 'Move-in ready' },
    { id: 'g5', alt: 'Powder room with wallpaper and vintage sink', tag: 'Powder rooms', sub: 'Detail' },
    { id: 'g12', alt: 'Formal living room with bay windows', tag: 'Homes', sub: 'Cared for' },
    { id: 'g3', alt: 'Living room with fresh rugs and tidy sofas', tag: 'Apartments', sub: 'Weekly' },
    { id: 'g8', alt: 'Bathroom vanity and floor cleaned top to bottom', tag: 'Bathrooms', sub: 'Deep clean' },
    { id: 'g11', alt: 'Living room with bookshelves and leather chair', tag: 'Living rooms', sub: 'Standard' },
    { id: 'g10', alt: 'Apartment living room ready for the family', tag: 'Homes', sub: 'Biweekly' }
  ];
  const galB = gal.slice(6).concat(gal.slice(0, 6));
  const wrap = (list) => list.concat(list);
  const loopA = wrap(gal);
  const loopB = wrap(galB);

  const groupA = [
    { t: 'Standard cleaning', d: 'Weekly, biweekly or monthly visits that keep your home fresh and comfortable: kitchens, bathrooms, bedrooms, living areas, dusting, floors and the finishing touches, done the same careful way every time.' },
    { t: 'One-time cleaning', d: 'A thorough clean whenever you need it, with no recurring schedule. Great before guests arrive, after a busy season or simply to give your home a fresh start.' },
    { t: 'Recurring plans', d: 'Pick the frequency that fits your life. The same team, the same checklist and a home that always feels ready.' }
  ];
  const groupB = [
    { t: 'Detailed cleaning', d: 'A top-to-bottom deep clean for homes that need extra attention: baseboards, doors, fixtures, built-up grime and the hard-to-reach spots that a regular clean skips.' },
    { t: 'Inside oven cleaning', d: 'Grease and baked-on residue removed from racks, glass and walls, so your oven looks and works like new.' },
    { t: 'Inside refrigerator cleaning', d: 'Shelves, drawers and seals emptied, cleaned and sanitized, then put back neatly.' },
    { t: 'Inside cabinets & drawers', d: 'Kitchen and bathroom cabinets and drawers wiped inside and out, perfect for deep cleans and moves.' }
  ];
  const groupC = [
    { t: 'Move-in cleaning', d: 'Walk into a home that is truly clean on day one: cabinets, closets, appliances, bathrooms and floors ready for your boxes.' },
    { t: 'Move-out cleaning', d: 'Leave the old place spotless for the landlord, the new owners or the next tenant, with the details checked before you hand over the keys.' },
    { t: 'Empty-home reset', d: 'Ideal for realtors, landlords and property managers who need a home ready for photos, showings or a new lease.' }
  ];
  const groupD = [
    { t: 'Office & workplace cleaning', d: 'Clean, welcoming offices and small workplaces: desks, kitchens, restrooms and floors, on a schedule that works around your team.' },
    { t: 'Restaurants & commercial cleaning', d: 'Dining rooms, kitchens, restrooms and common areas cleaned to a high standard, on a schedule that never gets in the way of service.' },
    { t: 'Carpet & upholstery cleaning', d: 'Carpets, rugs, sofas and chairs refreshed and cleaned, so the whole room feels new again.' }
  ];
  const faqs = [
    { q: 'Which areas do you serve?', a: 'We are based in Medford, MA and clean homes and offices across Greater Boston. Send us your ZIP code on WhatsApp and we will confirm right away.' },
    { q: 'What is included in a standard cleaning?', a: 'Kitchen, bathrooms, bedrooms and living areas: dusting, surfaces, mirrors, floors vacuumed and mopped, trash taken out and beds made. We follow the same checklist on every visit.' },
    { q: 'What is the difference between standard and detailed cleaning?', a: 'A standard cleaning keeps a home maintained. A detailed cleaning goes deeper, with baseboards, doors, fixtures, built-up grime and hard-to-reach areas. Most first visits are detailed.' },
    { q: 'Do you clean inside the oven, fridge and cabinets?', a: 'Yes. Inside oven, inside refrigerator and inside cabinets & drawers can be added to any cleaning, and they are often included in move-in and move-out cleans.' },
    { q: 'Do you offer move-in and move-out cleaning?', a: 'Yes, for tenants, homeowners, landlords and realtors. We clean the empty home from the inside of every cabinet to the last baseboard.' },
    { q: 'Do you clean offices and restaurants?', a: 'Yes. We clean offices, workplaces and restaurants on a schedule that suits your team.' },
    { q: 'Do I need to be home?', a: 'Not at all. Many clients leave a key or a door code. We send a message when we arrive and when we finish.' },
    { q: 'Do you bring your own supplies?', a: 'Yes, we bring our own products and equipment. If you prefer a specific product for your home, just let us know.' },
    { q: 'How do I get a quote?', a: 'Tell us the size of your home, the service you need and your area, by WhatsApp, text or the form below. We reply with a free estimate, usually the same day.' }
  ];

  useLayoutEffect(() => {
    if (getLang() === 'pt') applyLang(rootRef.current, 'pt');
  }, []);

  function onLang(lang) {
    saveLang(lang);
    applyLang(rootRef.current, lang, resplitHeading);
    rootRef.current?.querySelector('main')?.animate?.([{ opacity: .45 }, { opacity: 1 }], { duration: 480, easing: 'cubic-bezier(.16,1,.3,1)' });
  }

  useEffect(() => {
    const refs = {
      rootRef, loaderRef, loaderMarkRef, loaderTxtRef, progressRef, navRef, menuRef,
      heroBgRef, rotatorRef, rotatorRefSm, svcLabelRef, svcNumRef, styleImgRef,
      formMsgRef, stickyCtaRef, sparkleTextRef, whatsRef, loopARef, loopBRef, baTrackRef, baBarRef
    };
    return initSite(rootRef.current, refs, props, stateRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function closeMenuNow() {
    const m = menuRef.current; if (!m) return;
    m.style.opacity = '0'; m.style.visibility = 'hidden'; m.style.transform = 'translateY(-2%)';
  }

  function onNavClick(e) {
    const href = e.currentTarget.getAttribute('href') || '';
    if (href.charAt(0) !== '#') return;
    e.preventDefault();
    closeMenuNow();
    const id = href.slice(1);
    const target = id === 'top' ? null : document.getElementById(id);
    const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const top = target ? (target.getBoundingClientRect().top + window.scrollY - 70) : 0;
    window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' });
  }

  function openMenu() {
    const m = menuRef.current; if (!m) return;
    m.style.opacity = '1'; m.style.visibility = 'visible'; m.style.transform = 'translateY(0)';
  }

  function closeMenu() { closeMenuNow(); }

  function toggleItem(e) {
    const btn = e.currentTarget;
    const body = btn.parentElement.querySelector('[data-body]');
    const icon = btn.lastElementChild;
    if (!body) return;
    const open = body.style.maxHeight && body.style.maxHeight !== '0px';
    btn.setAttribute('aria-expanded', String(!open));
    if (open) {
      body.style.maxHeight = '0px';
      if (icon) icon.style.transform = 'rotate(0deg)';
    } else {
      body.style.maxHeight = body.scrollHeight + 'px';
      if (icon) icon.style.transform = 'rotate(45deg)';
    }
  }

  function pickTag(e) {
    const id = e.currentTarget.getAttribute('data-tag');
    const img = styleImgRef.current;
    if (!img || !GAL[id]) return;
    const seq = ++stateRef.current.tagSeq;
    const started = Date.now();
    img.style.opacity = '0';
    img.style.transform = 'scale(1.03)';
    const pre = new Image();
    pre.sizes = SZ_STYLE;
    pre.srcset = galSet(id);
    pre.src = 'assets/gallery/' + id + '-800.webp';
    const show = () => setTimeout(() => {
      if (seq !== stateRef.current.tagSeq) return;
      img.srcset = pre.srcset;
      img.src = pre.src;
      img.style.opacity = '1';
      img.style.transform = 'scale(1)';
    }, Math.max(0, 260 - (Date.now() - started)));
    if (pre.decode) pre.decode().then(show, show); else { pre.onload = show; pre.onerror = show; }
    const sibs = e.currentTarget.parentElement.children;
    for (let i = 0; i < sibs.length; i++) {
      sibs[i].style.borderColor = 'rgba(20,17,19,.18)';
      sibs[i].style.color = '#141113';
    }
    e.currentTarget.style.borderColor = accentPink || '#A3161F';
    e.currentTarget.style.color = accentPink || '#A3161F';
  }

  function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const msg = formMsgRef.current;
    const name = form.querySelector('[name="name"]');
    const valid = name && name.value.trim().length > 0;
    if (name) name.style.borderBottomColor = valid ? 'rgba(255,251,245,.28)' : '#D24A52';
    if (!msg) return;
    if (formAltRef.current) formAltRef.current.style.display = 'none';
    if (!valid) {
      msg.textContent = isPT() ? 'Coloque seu nome para sabermos a quem responder.' : 'Please add your name so we know who to reply to.';
      msg.style.color = '';
      msg.style.opacity = '1';
      return;
    }
    // The request goes straight to the business on WhatsApp, already written out.
    const val = (n) => { const f = form.querySelector('[name="' + n + '"]'); return f ? f.value.trim() : ''; };
    const [yy, mm, dd] = val('date').split('-');
    const date = yy ? (isPT() ? [dd, mm, yy] : [mm, dd, yy]).join('/') : '';
    const pt = isPT();
    const lines = [
      (pt ? 'Nome: ' : 'Name: ') + val('name'),
      val('email') && (pt ? 'E-mail: ' : 'Email: ') + val('email'),
      val('phone') && (pt ? 'Telefone: ' : 'Phone: ') + val('phone'),
      (pt ? 'Tipo de imóvel: ' : 'Home type: ') + val('propertyType'),
      val('service') && (pt ? 'Serviço: ' : 'Service: ') + val('service'),
      date && (pt ? 'Data preferida: ' : 'Preferred date: ') + date,
      val('postcode') && (pt ? 'ZIP code / região: ' : 'ZIP code / area: ') + val('postcode'),
      val('message') && '\n' + val('message')
    ].filter(Boolean);
    const link = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent((pt ? 'Olá, Premium Quality Cleaning! Gostaria de um orçamento grátis.' : "Hi Premium Quality Cleaning! I'd like a free estimate.") + '\n\n' + lines.join('\n'));
    window.open(link, '_blank', 'noopener');
    msg.textContent = pt ? 'O WhatsApp deve ter aberto com o seu pedido pronto, é só tocar em enviar. Não abriu? Ligue ou mande SMS para ' + PHONE + ' ou' : 'WhatsApp should now be open with your request ready, just press send. Nothing opened? Call or text ' + PHONE + ' or';
    msg.style.color = 'rgba(255,251,245,.9)';
    msg.style.opacity = '1';
    const alt = formAltRef.current;
    if (alt) { alt.href = link; alt.style.display = 'inline'; }
  }


  function dismissCta() {
    stateRef.current.ctaDismissed = true;
    const c = stickyCtaRef.current;
    if (c) { c.style.opacity = '0'; c.style.transform = 'translateY(120%)'; c.style.pointerEvents = 'none'; }
  }

  return (
<div ref={rootRef} style={css(`--forest:#1A1517;--forest-deep:#0F0C0E;--forest-mid:#7A0F17;--leaf:#141113;--leaf-deep:#0F0C0E;--pink:#A3161F;--pink-lt:#D24A52;--ivory:#FFFBF5;--paper:#FCF3E7;--cream:#F6EADB;--ink:#141113;--muted:#71666B;--gold:#CBA55C;background:var(--ivory);color:var(--ink);position:relative;width:100%;overflow-x:clip`)}>

  <a href="#main" style={css(`position:absolute;left:-9999px;top:0;z-index:10000;background:var(--forest);color:#fff;padding:14px 20px;font-size:13px;letter-spacing:.16em;text-transform:uppercase`)} data-focus="left:12px;top:12px">Skip to content</a>

  <BrandIntro ref={loaderRef} />

  {/* SCROLL PROGRESS */}
  <div style={css(`position:fixed;top:0;left:0;right:0;height:2px;z-index:900;background:transparent;pointer-events:none`)}>
    <div ref={progressRef} style={css(`height:100%;width:0%;background:linear-gradient(90deg,var(--forest-mid),var(--pink));transform-origin:left`)}></div>
  </div>

  {/* NAV */}
  <header ref={navRef} style={css(`position:fixed;top:0;left:0;right:0;z-index:800;padding:16px clamp(16px,4vw,48px);display:grid;grid-template-columns:auto 1fr auto;align-items:center;column-gap:clamp(16px,3vw,48px);transition:background .5s cubic-bezier(.16,1,.3,1),backdrop-filter .5s,box-shadow .5s,padding .5s`)}>
    <a href="#top" onClick={onNavClick} data-nav-logo="1" style={css(`display:flex;align-items:center;transition:transform .4s cubic-bezier(.16,1,.3,1),opacity .4s`)} data-hover="transform:translateY(-2px)">
      <img src="assets/brand/logo-horizontal.webp" alt="Premium Quality Cleaning" width="667" height="200" style={css(`height:clamp(50px,4.4vw,62px);width:auto;display:block`)} />
    </a>
    <nav data-r="navlinks" aria-label="Primary" style={css(`display:flex;align-items:center;justify-content:center;gap:clamp(12px,1.9vw,30px)`)}>
      <a href="#services" onClick={onNavClick} style={css(`font-size:11.5px;letter-spacing:.13em;text-transform:uppercase;font-weight:500;color:var(--ink);padding:8px 0;white-space:nowrap;transition:color .35s`)} data-hover="color:#A3161F">Services</a>
      <a href="#holiday" onClick={onNavClick} style={css(`font-size:11.5px;letter-spacing:.13em;text-transform:uppercase;font-weight:500;color:var(--ink);padding:8px 0;white-space:nowrap;transition:color .35s`)} data-hover="color:#A3161F">Organizing</a>
      <a href="#directory" onClick={onNavClick} style={css(`font-size:11.5px;letter-spacing:.13em;text-transform:uppercase;font-weight:500;color:var(--ink);padding:8px 0;white-space:nowrap;transition:color .35s`)} data-hover="color:#A3161F">Standard cleaning</a>
      <a href="#commercial" onClick={onNavClick} style={css(`font-size:11.5px;letter-spacing:.13em;text-transform:uppercase;font-weight:500;color:var(--ink);padding:8px 0;white-space:nowrap;transition:color .35s`)} data-hover="color:#A3161F">Office cleaning</a>
      <a href="#standard" onClick={onNavClick} style={css(`font-size:11.5px;letter-spacing:.13em;text-transform:uppercase;font-weight:500;color:var(--ink);padding:8px 0;white-space:nowrap;transition:color .35s`)} data-hover="color:#A3161F">Why Us</a>
    </nav>
    <div style={css(`display:flex;align-items:center;justify-content:flex-end;gap:10px`)}>
      <a data-r="navcta" href="#contact" onClick={onNavClick} data-magnetic="1" style={css(`display:inline-flex;align-items:center;gap:10px;background:var(--forest);color:#fff;padding:13px 20px;border-radius:999px;font-size:11px;letter-spacing:.16em;text-transform:uppercase;font-weight:600;white-space:nowrap;min-height:44px;transition:background .4s,color .4s,transform .3s cubic-bezier(.16,1,.3,1)`)} data-hover="background:#A3161F;color:#fff">Free estimate <span style={css(`display:inline-block`)}>↗</span></a>
      <button data-r="burger" type="button" aria-label="Open menu" onClick={openMenu} style={css(`display:none;align-items:center;gap:10px;background:var(--forest);color:#fff;border:0;padding:13px 18px;border-radius:999px;font-size:11px;letter-spacing:.18em;text-transform:uppercase;font-weight:600;min-height:44px;cursor:pointer`)}>Menu</button>
    </div>
  </header>

  {/* MOBILE MENU */}
  <div ref={menuRef} style={css(`position:fixed;inset:0;z-index:850;background:var(--forest-deep);color:var(--ivory);padding:24px clamp(20px,6vw,48px) 40px;display:flex;flex-direction:column;justify-content:space-between;opacity:0;visibility:hidden;transform:translateY(-2%);transition:opacity .6s cubic-bezier(.16,1,.3,1),transform .6s cubic-bezier(.16,1,.3,1),visibility .6s`)}>
    <div style={css(`display:flex;align-items:center;justify-content:space-between`)}>
      <span style={css(`font-size:11px;letter-spacing:.3em;text-transform:uppercase;color:rgba(255,251,245,.55)`)}>Premium Quality</span>
      <button type="button" aria-label="Close menu" onClick={closeMenu} style={css(`background:transparent;border:1px solid rgba(255,251,245,.28);color:var(--ivory);border-radius:999px;padding:12px 18px;font-size:11px;letter-spacing:.2em;text-transform:uppercase;min-height:44px;cursor:pointer`)}>Close</button>
    </div>
    <nav aria-label="Mobile" style={css(`display:flex;flex-direction:column;gap:2px;padding:32px 0`)}>
      <a href="#services" onClick={onNavClick} style={css(`display:flex;align-items:baseline;gap:16px;padding:10px 0;border-bottom:1px solid rgba(255,251,245,.12);color:var(--ivory)`)}><span style={css(`font-size:10px;letter-spacing:.2em;color:var(--pink-lt)`)}>01</span><span style={css(`font-family:'Instrument Serif',serif;font-size:clamp(34px,10vw,58px);line-height:1.05`)}>Services</span></a>
      <a href="#holiday" onClick={onNavClick} style={css(`display:flex;align-items:baseline;gap:16px;padding:10px 0;border-bottom:1px solid rgba(255,251,245,.12);color:var(--ivory)`)}><span style={css(`font-size:10px;letter-spacing:.2em;color:var(--pink-lt)`)}>02</span><span style={css(`font-family:'Instrument Serif',serif;font-size:clamp(34px,10vw,58px);line-height:1.05`)}>Airbnb</span></a>
      <a href="#directory" onClick={onNavClick} style={css(`display:flex;align-items:baseline;gap:16px;padding:10px 0;border-bottom:1px solid rgba(255,251,245,.12);color:var(--ivory)`)}><span style={css(`font-size:10px;letter-spacing:.2em;color:var(--pink-lt)`)}>03</span><span style={css(`font-family:'Instrument Serif',serif;font-size:clamp(34px,10vw,58px);line-height:1.05`)}>Residential</span></a>
      <a href="#commercial" onClick={onNavClick} style={css(`display:flex;align-items:baseline;gap:16px;padding:10px 0;border-bottom:1px solid rgba(255,251,245,.12);color:var(--ivory)`)}><span style={css(`font-size:10px;letter-spacing:.2em;color:var(--pink-lt)`)}>04</span><span style={css(`font-family:'Instrument Serif',serif;font-size:clamp(34px,10vw,58px);line-height:1.05`)}>Commercial</span></a>
      <a href="#contact" onClick={onNavClick} style={css(`display:flex;align-items:baseline;gap:16px;padding:10px 0;border-bottom:1px solid rgba(255,251,245,.12);color:var(--ivory)`)}><span style={css(`font-size:10px;letter-spacing:.2em;color:var(--pink-lt)`)}>05</span><span style={css(`font-family:'Instrument Serif',serif;font-size:clamp(34px,10vw,58px);line-height:1.05`)}>Contact</span></a>
    </nav>
    <div style={css(`display:flex;flex-direction:column;gap:20px`)}>
      <a href="#contact" onClick={onNavClick} style={css(`display:inline-flex;align-items:center;justify-content:space-between;background:var(--pink);color:#fff;padding:20px 24px;border-radius:999px;font-size:12px;letter-spacing:.18em;text-transform:uppercase;font-weight:600`)}>Free estimate <span>↗</span></a>
      <div style={css(`display:flex;justify-content:space-between;font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:rgba(255,251,245,.5)`)}><span>Greater Boston, MA</span><span>Premium quality in every detail</span></div>
    </div>
  </div>

  <main id="main" tabIndex={-1}>
  {/* HERO */}
  <section id="top" style={css(`position:relative;min-height:100svh;display:flex;flex-direction:column;background:var(--paper);overflow:hidden`)}>
    <div data-r="only-sm" style={css(`background:#FCF3E7;padding-top:clamp(86px,11vw,104px)`)}>
      <picture>
        <source media="(max-width:1020px)" type="image/webp" srcSet="assets/hero/hero-mobile-720.webp 720w, assets/hero/hero-mobile-1200.webp 1200w" sizes="(max-width:760px) 100vw, 760px" />
        <img src={PX} alt="Premium Quality Cleaning" width="1080" height="1131" decoding="async" style={css(`width:100%;max-width:560px;height:auto;display:block;margin:0 auto`)} />
      </picture>
      <div aria-hidden="true" style={css(`height:clamp(28px,7vw,56px);background:linear-gradient(180deg,#FCF3E7,var(--paper))`)}></div>
    </div>
    <div data-r="hide-sm" style={css(`position:absolute;left:0;right:0;top:clamp(78px,10vh,104px);height:calc(min(100%,100svh) - clamp(78px,10vh,104px) - 18px)`)}>
    <picture>
      <source media="(min-width:1021px)" type="image/webp" srcSet="assets/hero/hero-desktop-1100.webp 1100w, assets/hero/hero-desktop-1672.webp 1672w" sizes="100vw" />
      <img ref={heroBgRef} className="cs-hero-art" data-r="hide-sm" src={PX} alt="Premium Quality Cleaning" width="1672" height="941" decoding="async" style={css(`position:absolute;inset:0;width:100%;height:100%;object-fit:contain;object-position:right center;display:block;will-change:transform;background:#FCF3E7`)} />
    </picture>
    <div className="cs-hero-light" aria-hidden="true" />
    <div data-r="hide-sm" aria-hidden="true" style={css(`position:absolute;inset:0;background:linear-gradient(90deg,rgba(252,243,231,.6) 0%,rgba(252,243,231,.25) 20%,rgba(252,243,231,0) 34%);pointer-events:none`)}></div>
    </div>
    <div style={css(`position:relative;flex:1;display:flex;align-items:flex-end;width:100%;max-width:1560px;margin:0 auto;padding:clamp(118px,15vh,190px) clamp(20px,5vw,72px) clamp(40px,6vh,72px)`)} data-r="hero-outer">
    <div style={css(`width:100%;display:grid;grid-template-columns:minmax(0,.92fr) minmax(0,1.08fr);align-items:center;gap:clamp(24px,4vw,56px)`)} data-r="hero">
      <div>
        <div data-reveal="1" style={css(`display:flex;flex-wrap:wrap;gap:10px 18px;align-items:center;font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:var(--muted);opacity:0;transform:translateY(18px);transition:opacity .9s cubic-bezier(.16,1,.3,1),transform .9s cubic-bezier(.16,1,.3,1)`)}>
          <span>Professional cleaning & organizing</span>
          <span style={css(`width:26px;height:1px;background:var(--pink)`)}></span>
          <span>Greater Boston, MA</span>
        </div>
        <h1 style={css(`font-family:'Instrument Serif',serif;font-weight:400;font-size:clamp(3.1rem,8.2vw,8.4rem);line-height:.9;letter-spacing:-.025em;margin:clamp(20px,3vw,34px) 0 0;text-wrap:balance`)}>
          <span data-reveal="1" data-delay="60" style={css(`display:block;overflow:hidden`)}><span data-mask="1" style={css(`display:block;opacity:0;transform:translateY(102%);transition:opacity 1s cubic-bezier(.16,1,.3,1),transform 1.05s cubic-bezier(.16,1,.3,1);color:var(--pink)`)}>Beautifully</span></span>
          <span data-reveal="1" data-delay="150" style={css(`display:block;overflow:hidden`)}><span data-mask="1" style={css(`display:block;opacity:0;transform:translateY(102%);transition:opacity 1s cubic-bezier(.16,1,.3,1),transform 1.05s cubic-bezier(.16,1,.3,1)`)}>clean. <em style={css(`font-style:italic;color:#141113`)}>Properly</em></span></span>
          <span data-reveal="1" data-delay="240" style={css(`display:block;overflow:hidden`)}><span data-mask="1" style={css(`display:block;opacity:0;transform:translateY(102%);transition:opacity 1s cubic-bezier(.16,1,.3,1),transform 1.05s cubic-bezier(.16,1,.3,1)`)}>cared for.</span></span>
        </h1>
        <p data-reveal="1" data-delay="360" style={css(`max-width:46ch;margin:clamp(22px,2.6vw,32px) 0 0;font-size:clamp(15px,1.15vw,18px);line-height:1.62;color:#4A3F44;opacity:0;transform:translateY(18px);transition:opacity .9s cubic-bezier(.16,1,.3,1),transform .9s cubic-bezier(.16,1,.3,1)`)}>
          From standard and detailed cleaning to move-ins, move-outs and offices, Premium Quality Cleaning brings premium care to every corner of your home across Medford and Greater Boston.</p>
        <div data-reveal="1" data-delay="460" style={css(`display:flex;flex-wrap:wrap;gap:14px;margin-top:clamp(26px,3vw,38px);opacity:0;transform:translateY(18px);transition:opacity .9s cubic-bezier(.16,1,.3,1),transform .9s cubic-bezier(.16,1,.3,1)`)}>
          <a href="#contact" onClick={onNavClick} data-magnetic="1" style={css(`display:inline-flex;align-items:center;gap:14px;background:var(--pink);color:#fff;padding:19px 30px;border-radius:999px;font-size:12px;letter-spacing:.18em;text-transform:uppercase;font-weight:600;min-height:44px;transition:background .4s,transform .3s cubic-bezier(.16,1,.3,1)`)} data-hover="background:#1A1517;color:#fff">Free estimate <span>↗</span></a>
          <a href="#services" onClick={onNavClick} style={css(`display:inline-flex;align-items:center;gap:12px;border:1px solid rgba(20,17,19,.2);color:var(--ink);padding:19px 28px;border-radius:999px;font-size:12px;letter-spacing:.18em;text-transform:uppercase;font-weight:600;min-height:44px;transition:border-color .4s,color .4s`)} data-hover="border-color:#1A1517;color:#1A1517">Explore services ↓</a>
        </div>
        <div data-reveal="1" data-delay="560" style={css(`margin-top:clamp(34px,4.5vw,58px);display:flex;flex-wrap:wrap;align-items:center;gap:8px 12px;font-size:10.5px;letter-spacing:.26em;text-transform:uppercase;color:var(--muted);border-top:1px solid rgba(20,17,19,.1);padding-top:18px;opacity:0;transition:opacity .9s cubic-bezier(.16,1,.3,1)`)}>
          <span>Homes</span><span style={css(`color:var(--pink)`)}>•</span><span>Apartments</span><span style={css(`color:var(--pink)`)}>•</span><span>Move-outs</span><span style={css(`color:var(--pink)`)}>•</span><span>Offices</span><span style={css(`color:var(--pink)`)}>•</span><span>5.0 on Google</span>
        </div>
      </div>

      <div data-r="hide-sm" style={css(`position:relative;display:flex;align-items:flex-end;justify-content:flex-end;min-height:min(40vh,420px)`)}>
      </div>
      <div data-r="only-sm" style={css(`position:relative;background:var(--forest);color:var(--ivory);border-radius:18px;padding:24px 22px;overflow:hidden;margin-top:8px`)}>
        <span aria-hidden="true" style={css(`position:absolute;right:-10px;top:-18px;font-size:64px;color:rgba(210,74,82,.28);font-family:'Instrument Serif',serif`)}>{LEAF}</span>
        <div style={css(`font-size:10px;letter-spacing:.26em;text-transform:uppercase;color:var(--pink-lt);font-weight:600`)}>Greater Boston, MA</div>
        <div style={css(`margin-top:8px;font-size:13.5px;letter-spacing:.04em;color:rgba(255,251,245,.85)`)}>Homes • Detailed cleans • Move-outs</div>
        <div style={css(`margin-top:16px;padding-top:16px;border-top:1px solid rgba(255,251,245,.18);display:flex;align-items:baseline;gap:10px;font-family:'Instrument Serif',serif;font-size:20px`)}>
          <span style={css(`font-family:'Manrope',sans-serif;font-size:10px;letter-spacing:.26em;text-transform:uppercase;color:rgba(255,251,245,.55)`)}>Made ready for</span>
          <span style={css(`display:inline-block;overflow:hidden;height:1.25em`)}><span ref={rotatorRefSm} style={css(`display:block;color:var(--pink-lt);font-style:italic`)}>you</span></span>
        </div>
      </div>
    </div>
    </div>

    <div data-r="hide-sm" style={css(`position:absolute;left:clamp(20px,5vw,72px);bottom:clamp(16px,3vh,30px);display:flex;align-items:baseline;gap:12px;font-family:'Instrument Serif',serif;font-size:clamp(17px,2vw,26px);color:#4A3F44`)}>
      <span style={css(`font-family:'Manrope',sans-serif;font-size:10px;letter-spacing:.26em;text-transform:uppercase;color:var(--muted)`)}>Made ready for</span>
      <span style={css(`display:inline-block;overflow:hidden;height:1.25em`)}><span ref={rotatorRef} style={css(`display:block;color:var(--pink);font-style:italic`)}>you</span></span>
    </div>
  </section>

  {/* BRAND STRIP */}
  <section aria-hidden="true" style={css(`background:var(--forest);color:var(--ivory);padding:clamp(16px,2vw,24px) 0;overflow:hidden`)}>
    <div data-r="loopstrip" ref={stripRef} style={css(`display:flex;width:max-content;animation:csLoopL 42s linear infinite;will-change:transform`)}>
      <div style={css(`display:flex;align-items:center;gap:clamp(24px,3vw,48px);padding-right:clamp(24px,3vw,48px);font-family:'Instrument Serif',serif;font-size:clamp(22px,3.2vw,44px);letter-spacing:-.01em;white-space:nowrap`)}>
        <span>Standard cleaning</span><span style={css(`color:var(--pink-lt);font-size:.6em`)}>{LEAF}</span><span>Detailed cleaning</span><span style={css(`color:var(--pink-lt);font-size:.6em`)}>{LEAF}</span><span>Move-in &amp; move-out</span><span style={css(`color:var(--pink-lt);font-size:.6em`)}>{LEAF}</span><span>Inside oven &amp; fridge</span><span style={css(`color:var(--pink-lt);font-size:.6em`)}>{LEAF}</span><span>Office cleaning</span><span style={css(`color:var(--pink-lt);font-size:.6em`)}>{LEAF}</span><span>Home organizing</span><span style={css(`color:var(--pink-lt);font-size:.6em`)}>{LEAF}</span>
      </div>
      <div style={css(`display:flex;align-items:center;gap:clamp(24px,3vw,48px);padding-right:clamp(24px,3vw,48px);font-family:'Instrument Serif',serif;font-size:clamp(22px,3.2vw,44px);letter-spacing:-.01em;white-space:nowrap`)}>
        <span>Standard cleaning</span><span style={css(`color:var(--pink-lt);font-size:.6em`)}>{LEAF}</span><span>Detailed cleaning</span><span style={css(`color:var(--pink-lt);font-size:.6em`)}>{LEAF}</span><span>Move-in &amp; move-out</span><span style={css(`color:var(--pink-lt);font-size:.6em`)}>{LEAF}</span><span>Inside oven &amp; fridge</span><span style={css(`color:var(--pink-lt);font-size:.6em`)}>{LEAF}</span><span>Office cleaning</span><span style={css(`color:var(--pink-lt);font-size:.6em`)}>{LEAF}</span><span>Home organizing</span><span style={css(`color:var(--pink-lt);font-size:.6em`)}>{LEAF}</span>
      </div>
    </div>
  </section>

  {/* POSITIONING */}
  <section data-scene="care" style={css(`position:relative;background:var(--paper);padding:clamp(80px,11vw,170px) clamp(20px,5vw,72px);overflow:hidden;background-image:radial-gradient(rgba(163,22,31,.2) 2px,transparent 2px),radial-gradient(rgba(26,21,23,.14) 2px,transparent 2px);background-size:30px 30px;background-position:0 0,15px 15px`)}>
    <ScrollScene variant="care" />
    <div ref={sparkleRef} aria-hidden="true" style={css(`position:absolute;right:-4%;top:14%;width:min(340px,40vw);height:min(340px,40vw);opacity:.07;animation:csFloat 11s ease-in-out infinite;pointer-events:none;background:conic-gradient(from 45deg,transparent 0 8%,var(--pink) 12%,transparent 20% 33%,var(--pink) 37%,transparent 45% 58%,var(--pink) 62%,transparent 70% 83%,var(--pink) 87%,transparent 95%);mask-image:radial-gradient(circle,#000 62%,transparent 70%);-webkit-mask-image:radial-gradient(circle,#000 62%,transparent 70%)`)}></div>
    <div style={css(`max-width:1440px;margin:0 auto;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,.78fr);gap:clamp(32px,6vw,90px);align-items:end`)} data-r="two">
      <div>
        <div data-reveal="1" style={css(`font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:var(--pink);font-weight:600;opacity:0;transform:translateY(16px);transition:all .9s cubic-bezier(.16,1,.3,1)`)}>More than cleaning</div>
        <h2 data-reveal="1" data-delay="90" style={css(`font-family:'Instrument Serif',serif;font-weight:400;font-size:clamp(2.6rem,6.4vw,6.4rem);line-height:.95;letter-spacing:-.025em;margin:26px 0 0;opacity:0;transform:translateY(26px);transition:all 1s cubic-bezier(.16,1,.3,1)`)}>
          Every home has<br />a next moment.<br /><em style={css(`font-style:italic;color:var(--pink)`)}>Make sure it's ready for it.</em>
        </h2>
      </div>
      <div>
        <p data-reveal="1" data-delay="180" style={css(`font-size:clamp(15px,1.1vw,17.5px);line-height:1.7;color:#4A3F44;max-width:44ch;margin:0;opacity:0;transform:translateY(22px);transition:all .95s cubic-bezier(.16,1,.3,1)`)}>
          From weekly cleaning and detailed deep cleans to move-ins, move-outs and offices, Premium Quality Cleaning keeps homes fresh, cared for and ready for whoever walks through the door next.</p>
        <div style={css(`display:flex;flex-wrap:wrap;gap:12px 30px;margin-top:clamp(34px,5vw,60px);font-family:'Instrument Serif',serif;font-size:clamp(20px,2.6vw,34px);color:var(--forest-mid)`)}>
          <span data-reveal="1" data-delay="240" style={css(`opacity:0;transform:translateY(14px);transition:all .7s cubic-bezier(.16,1,.3,1)`)}>Clean.</span>
          <span data-reveal="1" data-delay="340" style={css(`opacity:0;transform:translateY(14px);transition:all .7s cubic-bezier(.16,1,.3,1)`)}>Refresh.</span>
          <span data-reveal="1" data-delay="440" style={css(`opacity:0;transform:translateY(14px);transition:all .7s cubic-bezier(.16,1,.3,1)`)}>Organize.</span>
          <span data-reveal="1" data-delay="540" style={css(`opacity:0;transform:translateY(14px);transition:all .7s cubic-bezier(.16,1,.3,1)`)}>Reset.</span>
          <span data-reveal="1" data-delay="640" style={css(`opacity:0;transform:translateY(14px);transition:all .7s cubic-bezier(.16,1,.3,1);color:var(--pink)`)}>Shine.</span>
        </div>
      </div>
    </div>
  </section>

  {/* SIGNATURE SERVICES (sticky) */}
  <section id="services" style={css(`background:var(--ivory);padding:clamp(70px,9vw,130px) clamp(20px,5vw,72px) clamp(60px,8vw,120px)`)}>
    <div style={css(`max-width:1440px;margin:0 auto`)}>
      <div style={css(`display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:20px;border-bottom:1px solid rgba(20,17,19,.12);padding-bottom:26px`)}>
        <h2 data-reveal="1" style={css(`font-family:'Instrument Serif',serif;font-weight:400;font-size:clamp(2.2rem,5vw,4.6rem);line-height:.98;letter-spacing:-.02em;margin:0;opacity:0;transform:translateY(20px);transition:all .9s cubic-bezier(.16,1,.3,1)`)}>Signature services</h2>
        <span style={css(`font-size:11px;letter-spacing:.26em;text-transform:uppercase;color:var(--muted)`)}>Four ways we care for a home</span>
      </div>

      <div data-r="svcgrid" style={css(`display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.02fr);gap:clamp(24px,5vw,80px);margin-top:clamp(30px,4vw,60px);align-items:start`)}>
        <div>
          <div data-svc-panel="0" style={css(`min-height:min(74vh,640px);display:flex;flex-direction:column;justify-content:center;padding:40px 0;border-bottom:1px solid rgba(20,17,19,.08)`)}>
            <div style={css(`display:flex;align-items:center;gap:14px`)}><span style={css(`font-size:11px;letter-spacing:.24em;color:var(--pink);font-weight:600`)}>01</span><span data-svc-line="0" style={css(`height:1px;width:0;background:var(--pink);transition:width .8s cubic-bezier(.16,1,.3,1)`)}></span></div>
            <h3 style={css(`font-family:'Instrument Serif',serif;font-weight:400;font-size:clamp(2rem,3.8vw,3.6rem);line-height:1;letter-spacing:-.02em;margin:18px 0 0`)}>Standard cleaning</h3>
            <img data-r="only-sm" {...gimg('g1', SZ_PANEL_SM)} alt="Bright living room with polished hardwood floors" loading="lazy" style={css(`width:100%;height:56vw;max-height:420px;object-fit:cover;border-radius:4px;margin:22px 0 0`)} />
            <p style={css(`max-width:44ch;margin:20px 0 0;font-size:16px;line-height:1.66;color:#4A3F44`)}>Weekly, biweekly or monthly visits that keep your home fresh, tidy and comfortable.</p>
            <p style={css(`max-width:44ch;margin:14px 0 0;font-size:15px;line-height:1.66;color:var(--muted)`)}>Kitchens, bathrooms, bedrooms and living areas cleaned the same careful way every visit, by a team that gets to know your home.</p>
          </div>
          <div data-svc-panel="1" style={css(`min-height:min(74vh,640px);display:flex;flex-direction:column;justify-content:center;padding:40px 0;border-bottom:1px solid rgba(20,17,19,.08)`)}>
            <div style={css(`display:flex;align-items:center;gap:14px`)}><span style={css(`font-size:11px;letter-spacing:.24em;color:var(--pink);font-weight:600`)}>02</span><span data-svc-line="1" style={css(`height:1px;width:0;background:var(--pink);transition:width .8s cubic-bezier(.16,1,.3,1)`)}></span></div>
            <h3 style={css(`font-family:'Instrument Serif',serif;font-weight:400;font-size:clamp(2rem,3.8vw,3.6rem);line-height:1;letter-spacing:-.02em;margin:18px 0 0`)}>Detailed cleaning</h3>
            <img data-r="only-sm" {...gimg('g7', SZ_PANEL_SM)} alt="Marble shower cleaned to shine" loading="lazy" style={css(`width:100%;height:56vw;max-height:420px;object-fit:cover;border-radius:4px;margin:22px 0 0`)} />
            <p style={css(`max-width:44ch;margin:20px 0 0;font-size:16px;line-height:1.66;color:#4A3F44`)}>A top-to-bottom clean for homes that need extra attention.</p>
            <p style={css(`max-width:44ch;margin:14px 0 0;font-size:15px;line-height:1.66;color:var(--muted)`)}>Baseboards, fixtures, built-up grime and the hard-to-reach spots, plus inside the oven, the fridge and the cabinets when you need it.</p>
          </div>
          <div data-svc-panel="2" style={css(`min-height:min(74vh,640px);display:flex;flex-direction:column;justify-content:center;padding:40px 0;border-bottom:1px solid rgba(20,17,19,.08)`)}>
            <div style={css(`display:flex;align-items:center;gap:14px`)}><span style={css(`font-size:11px;letter-spacing:.24em;color:var(--pink);font-weight:600`)}>03</span><span data-svc-line="2" style={css(`height:1px;width:0;background:var(--pink);transition:width .8s cubic-bezier(.16,1,.3,1)`)}></span></div>
            <h3 style={css(`font-family:'Instrument Serif',serif;font-weight:400;font-size:clamp(2rem,3.8vw,3.6rem);line-height:1;letter-spacing:-.02em;margin:18px 0 0`)}>Move-in &amp; move-out</h3>
            <img data-r="only-sm" {...gimg('g6', SZ_PANEL_SM)} alt="Bedroom with fresh bedding and clean floors" loading="lazy" style={css(`width:100%;height:56vw;max-height:420px;object-fit:cover;border-radius:4px;margin:22px 0 0`)} />
            <p style={css(`max-width:44ch;margin:20px 0 0;font-size:16px;line-height:1.66;color:#4A3F44`)}>Leave the old place spotless and walk into a home that is truly ready.</p>
            <p style={css(`max-width:44ch;margin:14px 0 0;font-size:15px;line-height:1.66;color:var(--muted)`)}>Empty-home cleaning for tenants, homeowners, landlords and realtors, including inside cabinets, closets and appliances.</p>
          </div>
          <div data-svc-panel="3" style={css(`min-height:min(74vh,640px);display:flex;flex-direction:column;justify-content:center;padding:40px 0`)}>
            <div style={css(`display:flex;align-items:center;gap:14px`)}><span style={css(`font-size:11px;letter-spacing:.24em;color:var(--pink);font-weight:600`)}>04</span><span data-svc-line="3" style={css(`height:1px;width:0;background:var(--pink);transition:width .8s cubic-bezier(.16,1,.3,1)`)}></span></div>
            <h3 style={css(`font-family:'Instrument Serif',serif;font-weight:400;font-size:clamp(2rem,3.8vw,3.6rem);line-height:1;letter-spacing:-.02em;margin:18px 0 0`)}>Office cleaning</h3>
            <img data-r="only-sm" {...gimg('g12', SZ_PANEL_SM)} alt="Formal living room cleaned and ready" loading="lazy" style={css(`width:100%;height:56vw;max-height:420px;object-fit:cover;border-radius:4px;margin:22px 0 0`)} />
            <p style={css(`max-width:44ch;margin:20px 0 0;font-size:16px;line-height:1.66;color:#4A3F44`)}>Clean, welcoming offices and small workplaces around Boston.</p>
            <p style={css(`max-width:44ch;margin:14px 0 0;font-size:15px;line-height:1.66;color:var(--muted)`)}>Desks, kitchens, restrooms and floors, on a schedule that works around your team.</p>
          </div>
        </div>

        <div data-r="svcmedia" style={css(`position:sticky;top:14vh;height:72vh;overflow:hidden;background:var(--forest-deep);border-radius:2px`)}>
          <div data-svc-media="0" style={css(`position:absolute;inset:0;opacity:1;transition:opacity .9s cubic-bezier(.16,1,.3,1)`)}>
            <img data-svc-main="1" {...gimg('g1', SZ_PANEL)} alt="Bright living room with polished hardwood floors" loading="lazy" style={css(`width:100%;height:100%;object-fit:cover;display:block;transform:scale(1.02);transition:transform 6s cubic-bezier(.22,.61,.36,1)`)} />
            <figure style={css(`position:absolute;left:22px;bottom:76px;width:31%;margin:0;aspect-ratio:3/4;overflow:hidden;box-shadow:0 18px 44px rgba(20,14,17,.34);border:5px solid var(--ivory)`)}>
              <img {...gimg('g4', SZ_INSET)} alt="Bedroom with fresh bedding" loading="lazy" style={css(`width:100%;height:100%;object-fit:cover;display:block`)} />
            </figure>
          </div>
          <div data-svc-media="1" style={css(`position:absolute;inset:0;opacity:0;transition:opacity .9s cubic-bezier(.16,1,.3,1)`)}>
            <img data-svc-main="1" {...gimg('g7', SZ_PANEL)} alt="Marble shower cleaned to shine" loading="lazy" style={css(`width:100%;height:100%;object-fit:cover;display:block;transform:scale(1.02);transition:transform 6s cubic-bezier(.22,.61,.36,1)`)} />
            <figure style={css(`position:absolute;left:22px;bottom:76px;width:31%;margin:0;aspect-ratio:3/4;overflow:hidden;box-shadow:0 18px 44px rgba(20,14,17,.34);border:5px solid var(--ivory)`)}>
              <img {...gimg('g8', SZ_INSET)} alt="Bathroom vanity cleaned top to bottom" loading="lazy" style={css(`width:100%;height:100%;object-fit:cover;display:block`)} />
            </figure>
          </div>
          <div data-svc-media="2" style={css(`position:absolute;inset:0;opacity:0;transition:opacity .9s cubic-bezier(.16,1,.3,1)`)}>
            <img data-svc-main="1" {...gimg('g6', SZ_PANEL)} alt="Open kitchen ready for move-in day" loading="lazy" style={css(`width:100%;height:100%;object-fit:cover;display:block;transform:scale(1.02);transition:transform 6s cubic-bezier(.22,.61,.36,1)`)} />
            <figure style={css(`position:absolute;left:22px;bottom:76px;width:31%;margin:0;aspect-ratio:3/4;overflow:hidden;box-shadow:0 18px 44px rgba(20,14,17,.34);border:5px solid var(--ivory)`)}>
              <img {...gimg('g2', SZ_INSET)} alt="Kitchen cabinets and counters" loading="lazy" style={css(`width:100%;height:100%;object-fit:cover;display:block`)} />
            </figure>
          </div>
          <div data-svc-media="3" style={css(`position:absolute;inset:0;opacity:0;transition:opacity .9s cubic-bezier(.16,1,.3,1)`)}>
            <img data-svc-main="1" {...gimg('g12', SZ_PANEL)} alt="Formal living room cleaned and ready" loading="lazy" style={css(`width:100%;height:100%;object-fit:cover;display:block;transform:scale(1.02);transition:transform 6s cubic-bezier(.22,.61,.36,1)`)} />
            <figure style={css(`position:absolute;left:22px;bottom:76px;width:31%;margin:0;aspect-ratio:3/4;overflow:hidden;box-shadow:0 18px 44px rgba(20,14,17,.34);border:5px solid var(--ivory)`)}>
              <img {...gimg('g5', SZ_INSET)} alt="Powder room with vintage sink" loading="lazy" style={css(`width:100%;height:100%;object-fit:cover;display:block`)} />
            </figure>
          </div>
          <div style={css(`position:absolute;left:0;right:0;bottom:0;display:flex;justify-content:space-between;align-items:flex-end;padding:20px 22px;color:#fff;font-size:11px;letter-spacing:.24em;text-transform:uppercase;background:linear-gradient(0deg,rgba(20,14,17,.55),transparent);pointer-events:none`)}>
            <span ref={svcLabelRef}>Standard cleaning</span>
            <span><span ref={svcNumRef}>01</span> / 04</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  {/* PHOTOGRAPHY */}
  <section data-scene="gallery" style={css(`background:var(--cream);padding:clamp(70px,9vw,130px) 0;overflow:hidden`)}>
    <ScrollScene variant="gallery" />
    <div style={css(`max-width:1440px;margin:0 auto;padding:0 clamp(20px,5vw,72px);display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:20px`)}>
      <h2 data-reveal="1" style={css(`font-family:'Instrument Serif',serif;font-weight:400;font-size:clamp(2.4rem,5.6vw,5.4rem);line-height:.95;letter-spacing:-.025em;margin:0;opacity:0;transform:translateY(22px);transition:all .95s cubic-bezier(.16,1,.3,1)`)}>Real spaces.<br /><em style={css(`font-style:italic;color:var(--pink)`)}>Real details.</em></h2>
      <p style={css(`max-width:34ch;margin:0;font-size:15px;line-height:1.65;color:#4A3F44`)}>Homes cared for by Premium Quality Cleaning, real rooms from real clients, rated 5.0 on Google.</p>
    </div>

    <div data-cursor="Drag" style={css(`margin-top:clamp(34px,4vw,60px);overflow:hidden`)}>
      <div data-r="loop" ref={loopARef} style={css(`display:flex;gap:16px;width:max-content;height:clamp(280px,34vw,460px);animation:csLoopL 64s linear infinite;will-change:transform`)}>
        {loopA.map((item, $index) => (
          <figure key={$index} style={{ ...css(`flex:0 0 auto;height:100%;margin:0;position:relative;border-radius:3px;overflow:hidden;background:#EADCDF`), aspectRatio: GAL[item.id][0] + ' / ' + GAL[item.id][1] }}>
            <img src={PX} data-src={'assets/gallery/' + item.id + '-480.webp'} data-srcset={galSet(item.id)} sizes={GAL[item.id][0] > GAL[item.id][1] ? SZ_LOOP_WIDE : SZ_LOOP} width={GAL[item.id][0]} height={GAL[item.id][1]} alt={$index < gal.length ? item.alt : ''} decoding="async" draggable={false} style={css(`width:100%;height:100%;display:block;object-fit:cover;opacity:0;transition:opacity .6s ease`)} />
            <figcaption style={css(`position:absolute;left:12px;bottom:12px;color:#fff;font-size:10px;letter-spacing:.22em;text-transform:uppercase;text-shadow:0 2px 12px rgba(0,0,0,.5)`)}>{item.tag}<br /><span style={css(`opacity:.75`)}>{item.sub}</span></figcaption>
          </figure>
        ))}
      </div>
    </div>
    <div data-cursor="Drag" style={css(`margin-top:16px;overflow:hidden`)}>
      <div data-r="loop" ref={loopBRef} style={css(`display:flex;gap:16px;width:max-content;height:clamp(180px,22vw,300px);animation:csLoopR 78s linear infinite;will-change:transform`)}>
        {loopB.map((item, $index) => (
          <figure key={$index} style={{ ...css(`flex:0 0 auto;height:100%;margin:0;position:relative;border-radius:3px;overflow:hidden;background:#EADCDF`), aspectRatio: GAL[item.id][0] + ' / ' + GAL[item.id][1] }}>
            <img src={PX} data-src={'assets/gallery/' + item.id + '-480.webp'} data-srcset={galSet(item.id)} sizes={GAL[item.id][0] > GAL[item.id][1] ? SZ_LOOP_WIDE : SZ_LOOP} width={GAL[item.id][0]} height={GAL[item.id][1]} alt={$index < gal.length ? item.alt : ''} decoding="async" draggable={false} style={css(`width:100%;height:100%;display:block;object-fit:cover;opacity:0;transition:opacity .6s ease`)} />
          </figure>
        ))}
      </div>
    </div>
  </section>

  {/* HOLIDAY LETS */}
  <section id="holiday" style={css(`background:var(--forest);color:var(--ivory);padding:clamp(80px,11vw,170px) clamp(20px,5vw,72px);position:relative;overflow:hidden`)}>
    <svg className="cs-holiday-star" viewBox="0 0 200 200" aria-hidden="true"><path fill="currentColor" d="M100 0C160 50 160 150 100 200C40 150 40 50 100 0Z" /></svg>
    <div style={css(`max-width:1440px;margin:0 auto`)}>
      <div style={css(`font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:rgba(255,251,245,.55)`)}>Home organizing</div>
      <h2 data-reveal="1" style={css(`font-family:'Instrument Serif',serif;font-weight:400;font-size:clamp(2.8rem,8vw,8rem);line-height:.9;letter-spacing:-.03em;margin:26px 0 0;opacity:0;transform:translateY(28px);transition:all 1s cubic-bezier(.16,1,.3,1)`)}>
        Declutter.<br /><em style={css(`font-style:italic;color:var(--pink-lt)`)}>Organize.</em><br />Breathe.
      </h2>
      <div style={css(`display:grid;grid-template-columns:minmax(0,1fr) minmax(0,.85fr);gap:clamp(28px,5vw,80px);margin-top:clamp(40px,5vw,70px);align-items:end`)} data-r="two">
        <p style={css(`font-family:'Instrument Serif',serif;font-size:clamp(1.5rem,3vw,2.6rem);line-height:1.12;margin:0;letter-spacing:-.01em`)}>A clean home stays clean when everything has a place.</p>
        <p style={css(`margin:0;font-size:16px;line-height:1.68;color:rgba(255,251,245,.75);max-width:46ch`)}>Beyond cleaning, we sort, declutter and organize closets, kitchens, pantries and garages, so your home works better every single day.</p>
      </div>

      <div data-r="flow" style={css(`position:relative;display:flex;justify-content:space-between;align-items:flex-start;gap:18px;margin-top:clamp(50px,7vw,100px);padding-top:34px`)}>
        <div data-r="flowline" aria-hidden="true" style={css(`position:absolute;top:34px;left:0;right:0;height:1px;background:rgba(255,251,245,.18)`)}></div>
        <div data-flow-step="1" style={css(`position:relative;flex:1;opacity:0;transform:translateY(16px);transition:all .8s cubic-bezier(.16,1,.3,1)`)}><span style={css(`position:absolute;top:-38px;left:0;width:7px;height:7px;border-radius:50%;background:var(--pink)`)}></span><div style={css(`font-size:10px;letter-spacing:.24em;color:rgba(255,251,245,.45)`)}>01</div><div style={css(`margin-top:8px;font-size:13px;letter-spacing:.12em;text-transform:uppercase;font-weight:600`)}>Walkthrough</div></div>
        <div data-flow-step="1" style={css(`position:relative;flex:1;opacity:0;transform:translateY(16px);transition:all .8s cubic-bezier(.16,1,.3,1) .08s`)}><span style={css(`position:absolute;top:-38px;left:0;width:7px;height:7px;border-radius:50%;background:rgba(255,251,245,.45)`)}></span><div style={css(`font-size:10px;letter-spacing:.24em;color:rgba(255,251,245,.45)`)}>02</div><div style={css(`margin-top:8px;font-size:13px;letter-spacing:.12em;text-transform:uppercase;font-weight:600`)}>Declutter</div></div>
        <div data-flow-step="1" style={css(`position:relative;flex:1;opacity:0;transform:translateY(16px);transition:all .8s cubic-bezier(.16,1,.3,1) .16s`)}><span style={css(`position:absolute;top:-38px;left:0;width:7px;height:7px;border-radius:50%;background:rgba(255,251,245,.45)`)}></span><div style={css(`font-size:10px;letter-spacing:.24em;color:rgba(255,251,245,.45)`)}>03</div><div style={css(`margin-top:8px;font-size:13px;letter-spacing:.12em;text-transform:uppercase;font-weight:600`)}>Sort</div></div>
        <div data-flow-step="1" style={css(`position:relative;flex:1;opacity:0;transform:translateY(16px);transition:all .8s cubic-bezier(.16,1,.3,1) .24s`)}><span style={css(`position:absolute;top:-38px;left:0;width:7px;height:7px;border-radius:50%;background:rgba(255,251,245,.45)`)}></span><div style={css(`font-size:10px;letter-spacing:.24em;color:rgba(255,251,245,.45)`)}>04</div><div style={css(`margin-top:8px;font-size:13px;letter-spacing:.12em;text-transform:uppercase;font-weight:600`)}>Organize</div></div>
        <div data-flow-step="1" style={css(`position:relative;flex:1;opacity:0;transform:translateY(16px);transition:all .8s cubic-bezier(.16,1,.3,1) .32s`)}><span style={css(`position:absolute;top:-38px;left:0;width:7px;height:7px;border-radius:50%;background:rgba(255,251,245,.45)`)}></span><div style={css(`font-size:10px;letter-spacing:.24em;color:rgba(255,251,245,.45)`)}>05</div><div style={css(`margin-top:8px;font-size:13px;letter-spacing:.12em;text-transform:uppercase;font-weight:600`)}>Label</div></div>
        <div data-flow-step="1" style={css(`position:relative;flex:1;opacity:0;transform:translateY(16px);transition:all .8s cubic-bezier(.16,1,.3,1) .4s`)}><span style={css(`position:absolute;top:-38px;left:0;width:7px;height:7px;border-radius:50%;background:rgba(255,251,245,.45)`)}></span><div style={css(`font-size:10px;letter-spacing:.24em;color:rgba(255,251,245,.45)`)}>06</div><div style={css(`margin-top:8px;font-size:13px;letter-spacing:.12em;text-transform:uppercase;font-weight:600`)}>Deep clean</div></div>
        <div data-flow-step="1" style={css(`position:relative;flex:1;opacity:0;transform:translateY(16px);transition:all .8s cubic-bezier(.16,1,.3,1) .48s`)}><span style={css(`position:absolute;top:-38px;left:0;width:7px;height:7px;border-radius:50%;background:var(--pink)`)}></span><div style={css(`font-size:10px;letter-spacing:.24em;color:var(--pink-lt)`)}>07</div><div style={css(`margin-top:8px;font-size:13px;letter-spacing:.12em;text-transform:uppercase;font-weight:600;color:var(--pink-lt)`)}>Ready to enjoy</div></div>
      </div>

      <a href="#contact" onClick={onNavClick} data-magnetic="1" style={css(`display:inline-flex;align-items:center;gap:14px;margin-top:clamp(44px,6vw,80px);background:var(--pink);color:#fff;padding:20px 30px;border-radius:999px;font-size:12px;letter-spacing:.18em;text-transform:uppercase;font-weight:600;min-height:44px;transition:background .4s,transform .3s cubic-bezier(.16,1,.3,1)`)} data-hover="background:#FFFBF5;color:#1A1517">Talk about your space →</a>
    </div>
  </section>

  {/* STYLING */}
  <section data-scene="styling" style={css(`background:var(--ivory);padding:clamp(80px,11vw,160px) clamp(20px,5vw,72px)`)}>
    <ScrollScene variant="styling" />
    <div style={css(`max-width:1440px;margin:0 auto;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,.9fr);gap:clamp(30px,5vw,80px);align-items:center`)} data-r="two">
      <div>
        <div style={css(`font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:var(--pink);font-weight:600`)}>Move-in &amp; move-out</div>
        <h2 data-reveal="1" style={css(`font-family:'Instrument Serif',serif;font-weight:400;font-size:clamp(2.4rem,5.6vw,5.2rem);line-height:.95;letter-spacing:-.025em;margin:24px 0 0;opacity:0;transform:translateY(24px);transition:all .95s cubic-bezier(.16,1,.3,1)`)}>Not just clean.<br /><em style={css(`font-style:italic;color:var(--pink)`)}>Ready to move in.</em></h2>
        <p style={css(`max-width:46ch;margin:26px 0 0;font-size:16px;line-height:1.68;color:#4A3F44`)}>Moving is stressful enough. We clean empty homes from the inside of every cabinet to the last baseboard, so you can hand over the keys, or walk in on day one, knowing it is truly clean.</p>
        <div style={css(`display:flex;flex-wrap:wrap;gap:10px;margin-top:34px`)}>
          <button type="button" data-tag="g4" onClick={pickTag} style={css(`background:transparent;border:1px solid rgba(20,17,19,.18);color:var(--ink);padding:13px 20px;border-radius:999px;font-size:11px;letter-spacing:.18em;text-transform:uppercase;cursor:pointer;min-height:44px;transition:all .35s`)} data-hover="border-color:#A3161F;color:#A3161F">Kitchen</button>
          <button type="button" data-tag="g7" onClick={pickTag} style={css(`background:transparent;border:1px solid rgba(20,17,19,.18);color:var(--ink);padding:13px 20px;border-radius:999px;font-size:11px;letter-spacing:.18em;text-transform:uppercase;cursor:pointer;min-height:44px;transition:all .35s`)} data-hover="border-color:#A3161F;color:#A3161F">Bathrooms</button>
          <button type="button" data-tag="g4" onClick={pickTag} style={css(`background:transparent;border:1px solid rgba(20,17,19,.18);color:var(--ink);padding:13px 20px;border-radius:999px;font-size:11px;letter-spacing:.18em;text-transform:uppercase;cursor:pointer;min-height:44px;transition:all .35s`)} data-hover="border-color:#A3161F;color:#A3161F">Bedrooms</button>
          <button type="button" data-tag="g7" onClick={pickTag} style={css(`background:transparent;border:1px solid rgba(20,17,19,.18);color:var(--ink);padding:13px 20px;border-radius:999px;font-size:11px;letter-spacing:.18em;text-transform:uppercase;cursor:pointer;min-height:44px;transition:all .35s`)} data-hover="border-color:#A3161F;color:#A3161F">Living rooms</button>
          <button type="button" data-tag="g5" onClick={pickTag} style={css(`background:transparent;border:1px solid rgba(20,17,19,.18);color:var(--ink);padding:13px 20px;border-radius:999px;font-size:11px;letter-spacing:.18em;text-transform:uppercase;cursor:pointer;min-height:44px;transition:all .35s`)} data-hover="border-color:#A3161F;color:#A3161F">Cabinets</button>
          <button type="button" data-tag="g1" onClick={pickTag} style={css(`background:transparent;border:1px solid rgba(20,17,19,.18);color:var(--ink);padding:13px 20px;border-radius:999px;font-size:11px;letter-spacing:.18em;text-transform:uppercase;cursor:pointer;min-height:44px;transition:all .35s`)} data-hover="border-color:#A3161F;color:#A3161F">Powder rooms</button>
        </div>
        <p style={css(`margin:22px 0 0;font-size:12.5px;line-height:1.6;color:var(--muted);max-width:44ch`)}>Inside oven, inside refrigerator and inside cabinets & drawers can be added to any move.</p>
      </div>
      <div style={css(`position:relative;aspect-ratio:4/5;overflow:hidden;background:var(--cream);border-radius:3px`)}>
        <img ref={styleImgRef} {...gimg('g2', SZ_STYLE)} alt="Kitchen ready for move-in day" loading="lazy" style={css(`width:100%;height:100%;object-fit:cover;display:block;transition:opacity .5s ease,transform 1.2s cubic-bezier(.16,1,.3,1)`)} />
      </div>
    </div>
  </section>

  {/* PROPERTY TYPES */}
  <section data-scene="spaces" id="types" style={css(`background:var(--paper);padding:clamp(70px,9vw,140px) clamp(20px,5vw,72px)`)}>
    <ScrollScene variant="spaces" />
    <div style={css(`max-width:1440px;margin:0 auto`)}>
      <h2 data-reveal="1" style={css(`font-family:'Instrument Serif',serif;font-weight:400;font-size:clamp(2.2rem,5vw,4.6rem);line-height:.98;letter-spacing:-.02em;margin:0 0 clamp(28px,4vw,52px);opacity:0;transform:translateY(20px);transition:all .9s cubic-bezier(.16,1,.3,1)`)}>Homes we care for</h2>
      <div style={css(`display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px`)}>
        <a href="#contact" onClick={onNavClick} data-cursor="View" style={css(`position:relative;display:block;aspect-ratio:4/5;overflow:hidden;background:var(--forest-deep);color:#fff`)}>
          <img {...gimg('g12', SZ_CARD)} alt="House living room" loading="lazy" style={css(`width:100%;height:100%;object-fit:cover;transition:transform 1.1s cubic-bezier(.16,1,.3,1);opacity:.86`)} data-hover="transform:scale(1.04)" />
          <span style={css(`position:absolute;left:20px;bottom:20px;right:20px;display:flex;justify-content:space-between;align-items:flex-end;font-family:'Instrument Serif',serif;font-size:clamp(1.5rem,2.4vw,2.3rem);line-height:1;text-shadow:0 2px 20px rgba(0,0,0,.4)`)}>Houses <span style={css(`font-family:'Manrope',sans-serif;font-size:14px`)}>↗</span></span>
        </a>
        <a href="#contact" onClick={onNavClick} data-cursor="View" style={css(`position:relative;display:block;aspect-ratio:4/5;overflow:hidden;background:var(--forest-deep);color:#fff`)}>
          <img {...gimg('g3', SZ_CARD)} alt="Apartment living room" loading="lazy" style={css(`width:100%;height:100%;object-fit:cover;transition:transform 1.1s cubic-bezier(.16,1,.3,1);opacity:.86`)} data-hover="transform:scale(1.04)" />
          <span style={css(`position:absolute;left:20px;bottom:20px;right:20px;display:flex;justify-content:space-between;align-items:flex-end;font-family:'Instrument Serif',serif;font-size:clamp(1.5rem,2.4vw,2.3rem);line-height:1;text-shadow:0 2px 20px rgba(0,0,0,.4)`)}>Apartments <span style={css(`font-family:'Manrope',sans-serif;font-size:14px`)}>↗</span></span>
        </a>
        <a href="#contact" onClick={onNavClick} data-cursor="View" style={css(`position:relative;display:block;aspect-ratio:4/5;overflow:hidden;background:var(--forest-deep);color:#fff`)}>
          <img {...gimg('g6', SZ_CARD)} alt="Bright kitchen in a rental" loading="lazy" style={css(`width:100%;height:100%;object-fit:cover;transition:transform 1.1s cubic-bezier(.16,1,.3,1);opacity:.86`)} data-hover="transform:scale(1.04)" />
          <span style={css(`position:absolute;left:20px;bottom:20px;right:20px;display:flex;justify-content:space-between;align-items:flex-end;font-family:'Instrument Serif',serif;font-size:clamp(1.5rem,2.4vw,2.3rem);line-height:1;text-shadow:0 2px 20px rgba(0,0,0,.4)`)}>Offices &amp; rentals <span style={css(`font-family:'Manrope',sans-serif;font-size:14px`)}>↗</span></span>
        </a>
      </div>
    </div>
  </section>

  {/* STANDARD */}
  <section data-scene="standard" id="standard" style={css(`background:var(--ivory);padding:clamp(80px,11vw,160px) clamp(20px,5vw,72px)`)}>
    <ScrollScene variant="standard" />
    <div style={css(`max-width:1440px;margin:0 auto`)}>
      <h2 data-reveal="1" style={css(`font-family:'Instrument Serif',serif;font-weight:400;font-size:clamp(2.4rem,6vw,5.6rem);line-height:.94;letter-spacing:-.025em;margin:0;max-width:16ch;opacity:0;transform:translateY(24px);transition:all .95s cubic-bezier(.16,1,.3,1)`)}>The details <em style={css(`font-style:italic;color:var(--pink)`)}>people notice.</em></h2>
      <div style={css(`display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:clamp(24px,3vw,44px);margin-top:clamp(44px,6vw,80px)`)}>
        <div data-reveal="1" style={css(`position:relative;padding-top:44px;border-top:1px solid rgba(20,17,19,.14);opacity:0;transform:translateY(22px);transition:all .85s cubic-bezier(.16,1,.3,1)`)}>
          <span style={css(`position:absolute;top:12px;left:-4px;font-family:'Instrument Serif',serif;font-size:clamp(4rem,7vw,6.5rem);line-height:1;color:rgba(26,21,23,.07);z-index:0`)}>01</span>
          <div style={css(`position:relative;z-index:1`)}><h3 style={css(`font-size:13px;letter-spacing:.2em;text-transform:uppercase;margin:0 0 12px`)}>Presentation</h3><p style={css(`margin:0;font-size:15px;line-height:1.66;color:#4A3F44`)}>Clean is only part of it. The way your home feels when you walk in matters too.</p></div>
        </div>
        <div data-reveal="1" data-delay="100" style={css(`position:relative;padding-top:44px;border-top:1px solid rgba(20,17,19,.14);opacity:0;transform:translateY(22px);transition:all .85s cubic-bezier(.16,1,.3,1)`)}>
          <span style={css(`position:absolute;top:12px;left:-4px;font-family:'Instrument Serif',serif;font-size:clamp(4rem,7vw,6.5rem);line-height:1;color:rgba(26,21,23,.07);z-index:0`)}>02</span>
          <div style={css(`position:relative;z-index:1`)}><h3 style={css(`font-size:13px;letter-spacing:.2em;text-transform:uppercase;margin:0 0 12px`)}>Consistency</h3><p style={css(`margin:0;font-size:15px;line-height:1.66;color:#4A3F44`)}>The same careful checklist on every visit, by people who treat your home like their own.</p></div>
        </div>
        <div data-reveal="1" data-delay="200" style={css(`position:relative;padding-top:44px;border-top:1px solid rgba(20,17,19,.14);opacity:0;transform:translateY(22px);transition:all .85s cubic-bezier(.16,1,.3,1)`)}>
          <span style={css(`position:absolute;top:12px;left:-4px;font-family:'Instrument Serif',serif;font-size:clamp(4rem,7vw,6.5rem);line-height:1;color:rgba(26,21,23,.07);z-index:0`)}>03</span>
          <div style={css(`position:relative;z-index:1`)}><h3 style={css(`font-size:13px;letter-spacing:.2em;text-transform:uppercase;margin:0 0 12px`)}>Flexibility</h3><p style={css(`margin:0;font-size:15px;line-height:1.66;color:#4A3F44`)}>Weekly, biweekly, monthly or one-time. We work around your schedule.</p></div>
        </div>
        <div data-reveal="1" data-delay="300" style={css(`position:relative;padding-top:44px;border-top:1px solid rgba(20,17,19,.14);opacity:0;transform:translateY(22px);transition:all .85s cubic-bezier(.16,1,.3,1)`)}>
          <span style={css(`position:absolute;top:12px;left:-4px;font-family:'Instrument Serif',serif;font-size:clamp(4rem,7vw,6.5rem);line-height:1;color:rgba(163,22,31,.1);z-index:0`)}>04</span>
          <div style={css(`position:relative;z-index:1`)}><h3 style={css(`font-size:13px;letter-spacing:.2em;text-transform:uppercase;margin:0 0 12px`)}>Final details</h3><p style={css(`margin:0;font-size:15px;line-height:1.66;color:#4A3F44`)}>Made beds, folded towels and the little touches that make it feel like home.</p></div>
        </div>
      </div>
    </div>
  </section>

  {/* PROCESS */}
  <section data-scene="process" style={css(`background:var(--paper);padding:clamp(70px,9vw,140px) clamp(20px,5vw,72px);background-image:radial-gradient(rgba(163,22,31,.2) 2px,transparent 2px),radial-gradient(rgba(26,21,23,.14) 2px,transparent 2px);background-size:30px 30px;background-position:0 0,15px 15px`)}>
    <ScrollScene variant="process" />
    <div style={css(`max-width:1440px;margin:0 auto`)}>
      <div style={css(`display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:16px`)}>
        <h2 style={css(`font-family:'Instrument Serif',serif;font-weight:400;font-size:clamp(2rem,4.4vw,3.8rem);line-height:1;letter-spacing:-.02em;margin:0`)}>How it works</h2>
        <span style={css(`font-size:11px;letter-spacing:.26em;text-transform:uppercase;color:var(--muted)`)}>Four steps</span>
      </div>
      <div data-r="processgrid" style={css(`display:grid;grid-template-columns:repeat(4,1fr);gap:clamp(20px,2.4vw,36px);margin-top:clamp(40px,5vw,70px);position:relative`)}>
        <div style={css(`position:relative;padding-top:30px;border-top:1px solid rgba(20,17,19,.16)`)}><span style={css(`position:absolute;top:-4px;left:0;width:7px;height:7px;border-radius:50%;background:var(--pink);transform:translateY(-50%)`)}></span><div style={css(`font-size:10px;letter-spacing:.24em;color:var(--muted)`)}>01</div><h3 style={css(`font-size:14px;letter-spacing:.14em;text-transform:uppercase;margin:12px 0 10px`)}>Tell us about your home</h3><p style={css(`margin:0;font-size:15px;line-height:1.62;color:#4A3F44`)}>Size of the home, your area, the service you need and the best day.</p></div>
        <div style={css(`position:relative;padding-top:30px;border-top:1px solid rgba(20,17,19,.16)`)}><span style={css(`position:absolute;top:-4px;left:0;width:7px;height:7px;border-radius:50%;background:var(--forest-mid);transform:translateY(-50%)`)}></span><div style={css(`font-size:10px;letter-spacing:.24em;color:var(--muted)`)}>02</div><h3 style={css(`font-size:14px;letter-spacing:.14em;text-transform:uppercase;margin:12px 0 10px`)}>We send a free estimate</h3><p style={css(`margin:0;font-size:15px;line-height:1.62;color:#4A3F44`)}>A clear plan and a fair, upfront price, usually the same day.</p></div>
        <div style={css(`position:relative;padding-top:30px;border-top:1px solid rgba(20,17,19,.16)`)}><span style={css(`position:absolute;top:-4px;left:0;width:7px;height:7px;border-radius:50%;background:var(--forest-mid);transform:translateY(-50%)`)}></span><div style={css(`font-size:10px;letter-spacing:.24em;color:var(--muted)`)}>03</div><h3 style={css(`font-size:14px;letter-spacing:.14em;text-transform:uppercase;margin:12px 0 10px`)}>Your home gets the premium treatment</h3><p style={css(`margin:0;font-size:15px;line-height:1.62;color:#4A3F44`)}>Our team cleans with care, from the first room to the final detail.</p></div>
        <div style={css(`position:relative;padding-top:30px;border-top:1px solid rgba(20,17,19,.16)`)}><span style={css(`position:absolute;top:-4px;left:0;width:7px;height:7px;border-radius:50%;background:var(--pink);transform:translateY(-50%)`)}></span><div style={css(`font-size:10px;letter-spacing:.24em;color:var(--pink)`)}>04</div><h3 style={css(`font-size:14px;letter-spacing:.14em;text-transform:uppercase;margin:12px 0 10px`)}>Ready for what's next</h3><p style={css(`margin:0;font-size:15px;line-height:1.62;color:#4A3F44`)}>Family time, guests, move-in day or simply coming home to a clean house.</p></div>
      </div>
    </div>
  </section>

  {/* DIRECTORY */}
  <section id="directory" style={css(`background:var(--ivory);padding:clamp(80px,11vw,160px) clamp(20px,5vw,72px)`)}>
    <div style={css(`max-width:1440px;margin:0 auto`)}>
      <div style={css(`display:grid;grid-template-columns:minmax(0,1fr) minmax(0,.8fr);gap:clamp(24px,4vw,60px);align-items:end`)} data-r="two">
        <h2 data-reveal="1" style={css(`font-family:'Instrument Serif',serif;font-weight:400;font-size:clamp(2.4rem,6vw,5.6rem);line-height:.94;letter-spacing:-.025em;margin:0;opacity:0;transform:translateY(24px);transition:all .95s cubic-bezier(.16,1,.3,1)`)}>One team.<br /><em style={css(`font-style:italic`)}>Every final detail.</em></h2>
        <p style={css(`margin:0;font-size:16px;line-height:1.68;color:#4A3F44;max-width:44ch`)}>Cleaning services for houses, apartments, rentals and offices across Medford and Greater Boston.</p>
      </div>

      <div style={css(`margin-top:clamp(44px,6vw,80px);display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:clamp(28px,3.4vw,56px)`)}>
        <div>
          <div style={css(`display:flex;align-items:baseline;gap:12px;margin-bottom:14px`)}><span style={css(`font-size:10px;letter-spacing:.24em;color:var(--pink);font-weight:600`)}>Group 01</span><span style={css(`font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:var(--muted)`)}>Standard cleaning</span></div>
          {groupA.map((s, $index) => (
            <div key={$index} style={css(`border-top:1px solid rgba(20,17,19,.12)`)}>
              <button type="button" onClick={toggleItem} aria-expanded="false" style={css(`width:100%;display:flex;align-items:center;justify-content:space-between;gap:14px;background:transparent;border:0;padding:18px 0;text-align:left;cursor:pointer;min-height:44px;color:var(--ink);transition:color .35s`)} data-hover="color:#A3161F">
                <span style={css(`font-size:16px;font-weight:500;letter-spacing:-.01em`)}>{s.t}</span>
                <span style={css(`font-size:13px;color:var(--pink);transition:transform .4s cubic-bezier(.16,1,.3,1)`)}>+</span>
              </button>
              <div data-body="1" style={css(`max-height:0;overflow:hidden;transition:max-height .6s cubic-bezier(.16,1,.3,1)`)}><p style={css(`margin:0 0 20px;font-size:14.5px;line-height:1.66;color:#4A3F44;max-width:48ch`)}>{s.d}</p></div>
            </div>
          ))}
        </div>
        <div>
          <div style={css(`display:flex;align-items:baseline;gap:12px;margin-bottom:14px`)}><span style={css(`font-size:10px;letter-spacing:.24em;color:var(--pink);font-weight:600`)}>Group 02</span><span style={css(`font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:var(--muted)`)}>Detailed cleaning</span></div>
          {groupB.map((s, $index) => (
            <div key={$index} style={css(`border-top:1px solid rgba(20,17,19,.12)`)}>
              <button type="button" onClick={toggleItem} aria-expanded="false" style={css(`width:100%;display:flex;align-items:center;justify-content:space-between;gap:14px;background:transparent;border:0;padding:18px 0;text-align:left;cursor:pointer;min-height:44px;color:var(--ink);transition:color .35s`)} data-hover="color:#A3161F">
                <span style={css(`font-size:16px;font-weight:500;letter-spacing:-.01em`)}>{s.t}</span>
                <span style={css(`font-size:13px;color:var(--pink);transition:transform .4s cubic-bezier(.16,1,.3,1)`)}>+</span>
              </button>
              <div data-body="1" style={css(`max-height:0;overflow:hidden;transition:max-height .6s cubic-bezier(.16,1,.3,1)`)}><p style={css(`margin:0 0 20px;font-size:14.5px;line-height:1.66;color:#4A3F44;max-width:48ch`)}>{s.d}</p></div>
            </div>
          ))}
        </div>
        <div>
          <div style={css(`display:flex;align-items:baseline;gap:12px;margin-bottom:14px`)}><span style={css(`font-size:10px;letter-spacing:.24em;color:var(--pink);font-weight:600`)}>Group 03</span><span style={css(`font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:var(--muted)`)}>Moving</span></div>
          {groupC.map((s, $index) => (
            <div key={$index} style={css(`border-top:1px solid rgba(20,17,19,.12)`)}>
              <button type="button" onClick={toggleItem} aria-expanded="false" style={css(`width:100%;display:flex;align-items:center;justify-content:space-between;gap:14px;background:transparent;border:0;padding:18px 0;text-align:left;cursor:pointer;min-height:44px;color:var(--ink);transition:color .35s`)} data-hover="color:#A3161F">
                <span style={css(`font-size:16px;font-weight:500;letter-spacing:-.01em`)}>{s.t}</span>
                <span style={css(`font-size:13px;color:var(--pink);transition:transform .4s cubic-bezier(.16,1,.3,1)`)}>+</span>
              </button>
              <div data-body="1" style={css(`max-height:0;overflow:hidden;transition:max-height .6s cubic-bezier(.16,1,.3,1)`)}><p style={css(`margin:0 0 20px;font-size:14.5px;line-height:1.66;color:#4A3F44;max-width:48ch`)}>{s.d}</p></div>
            </div>
          ))}
          <div id="commercial" style={css(`display:flex;align-items:baseline;gap:12px;margin:34px 0 14px`)}><span style={css(`font-size:10px;letter-spacing:.24em;color:var(--pink);font-weight:600`)}>Group 04</span><span style={css(`font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:var(--muted)`)}>Offices &amp; rentals</span></div>
          {groupD.map((s, $index) => (
            <div key={$index} style={css(`border-top:1px solid rgba(20,17,19,.12)`)}>
              <button type="button" onClick={toggleItem} aria-expanded="false" style={css(`width:100%;display:flex;align-items:center;justify-content:space-between;gap:14px;background:transparent;border:0;padding:18px 0;text-align:left;cursor:pointer;min-height:44px;color:var(--ink);transition:color .35s`)} data-hover="color:#A3161F">
                <span style={css(`font-size:16px;font-weight:500;letter-spacing:-.01em`)}>{s.t}</span>
                <span style={css(`font-size:13px;color:var(--pink);transition:transform .4s cubic-bezier(.16,1,.3,1)`)}>+</span>
              </button>
              <div data-body="1" style={css(`max-height:0;overflow:hidden;transition:max-height .6s cubic-bezier(.16,1,.3,1)`)}><p style={css(`margin:0 0 20px;font-size:14.5px;line-height:1.66;color:#4A3F44;max-width:48ch`)}>{s.d}</p></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>

  {/* FAQ */}
  <section style={css(`background:var(--cream);padding:clamp(70px,9vw,140px) clamp(20px,5vw,72px)`)}>
    <div style={css(`max-width:1080px;margin:0 auto`)}>
      <h2 style={css(`font-family:'Instrument Serif',serif;font-weight:400;font-size:clamp(2rem,4.4vw,3.8rem);line-height:1;letter-spacing:-.02em;margin:0 0 clamp(28px,4vw,48px)`)}>Questions, answered</h2>
      {faqs.map((f, $index) => (
        <div key={$index} style={css(`border-top:1px solid rgba(20,17,19,.14)`)}>
          <button type="button" onClick={toggleItem} aria-expanded="false" style={css(`width:100%;display:flex;align-items:center;justify-content:space-between;gap:18px;background:transparent;border:0;padding:22px 0;text-align:left;cursor:pointer;min-height:44px;color:var(--ink);transition:color .35s`)} data-hover="color:#A3161F">
            <span style={css(`font-family:'Instrument Serif',serif;font-size:clamp(19px,2vw,26px);line-height:1.2;letter-spacing:-.01em`)}>{f.q}</span>
            <span style={css(`font-size:15px;color:var(--pink);transition:transform .4s cubic-bezier(.16,1,.3,1)`)}>+</span>
          </button>
          <div data-body="1" style={css(`max-height:0;overflow:hidden;transition:max-height .6s cubic-bezier(.16,1,.3,1)`)}><p style={css(`margin:0 0 24px;font-size:15.5px;line-height:1.7;color:#4A3F44;max-width:64ch`)}>{f.a}</p></div>
        </div>
      ))}
    </div>
  </section>

  {/* FINAL CTA */}
  <section data-scene="signature" style={css(`position:relative;background:var(--ivory);padding:clamp(80px,11vw,170px) clamp(20px,5vw,72px);text-align:center`)}>
    <ScrollScene variant="signature" />
    <div style={css(`max-width:1100px;margin:0 auto`)}>
      <img data-reveal="1" src="assets/brand/logo-pin-cut.webp" width="1116" height="1191" loading="lazy" decoding="async" alt="Premium Quality Cleaning" style={css(`width:min(380px,66vw);height:auto;margin:0 auto;display:block;opacity:0;transform:translateY(20px) scale(.97);transition:all 1.1s cubic-bezier(.16,1,.3,1)`)} />
      <h2 data-reveal="1" data-delay="120" style={css(`font-family:'Instrument Serif',serif;font-weight:400;font-size:clamp(2.6rem,7.4vw,7rem);line-height:.92;letter-spacing:-.03em;margin:clamp(28px,4vw,48px) 0 0;opacity:0;transform:translateY(26px);transition:all 1s cubic-bezier(.16,1,.3,1)`)}>Let's get your<br /><em style={css(`font-style:italic;color:var(--pink)`)}>home sparkling.</em></h2>
      <p style={css(`max-width:48ch;margin:24px auto 0;font-size:16px;line-height:1.68;color:#4A3F44`)}>Tell us what your home needs and we'll put together the right Premium Quality service, with a free estimate.</p>
      <div style={css(`display:flex;flex-wrap:wrap;gap:14px;justify-content:center;margin-top:36px`)}>
        <a href="#contact" onClick={onNavClick} data-magnetic="1" style={css(`display:inline-flex;align-items:center;gap:14px;background:var(--forest);color:#fff;padding:20px 32px;border-radius:999px;font-size:12px;letter-spacing:.18em;text-transform:uppercase;font-weight:600;min-height:44px;transition:background .4s,transform .3s cubic-bezier(.16,1,.3,1)`)} data-hover="background:#A3161F;color:#fff">Free estimate →</a>
        <a href="#services" onClick={onNavClick} style={css(`display:inline-flex;align-items:center;gap:12px;border:1px solid rgba(20,17,19,.2);color:var(--ink);padding:20px 30px;border-radius:999px;font-size:12px;letter-spacing:.18em;text-transform:uppercase;font-weight:600;min-height:44px;transition:border-color .4s`)} data-hover="border-color:#1A1517">Explore services</a>
      </div>
      <div style={css(`margin-top:34px;font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:var(--muted)`)}>Medford, MA · Greater Boston</div>
    </div>
  </section>

  {/* CONTACT */}
  <section data-scene="contact" id="contact" style={css(`background:var(--forest);color:var(--ivory);padding:clamp(80px,11vw,160px) clamp(20px,5vw,72px)`)}>
    <ScrollScene variant="contact" />
    <div style={css(`max-width:1240px;margin:0 auto;display:grid;grid-template-columns:minmax(0,.7fr) minmax(0,1fr);gap:clamp(30px,5vw,80px)`)} data-r="two">
      <div>
        <div style={css(`font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:rgba(255,251,245,.5)`)}>Free estimate</div>
        <h2 style={css(`font-family:'Instrument Serif',serif;font-weight:400;font-size:clamp(2.2rem,5vw,4.4rem);line-height:.96;letter-spacing:-.025em;margin:22px 0 0`)}>Tell us about<br /><em style={css(`font-style:italic;color:var(--pink-lt)`)}>your home.</em></h2>
        <p style={css(`margin:24px 0 0;font-size:15.5px;line-height:1.7;color:rgba(255,251,245,.72);max-width:38ch`)}>Share the essentials, home size, area and the service you need, and we'll come back with a free estimate on WhatsApp.</p>
        <a href={WA_HELLO} data-wa="" target="_blank" rel="noopener" data-magnetic="1" style={css(`display:inline-flex;align-items:center;gap:12px;margin-top:30px;border:1px solid rgba(255,251,245,.3);color:var(--ivory);padding:16px 24px;border-radius:999px;font-size:11.5px;letter-spacing:.18em;text-transform:uppercase;font-weight:600;min-height:44px;transition:background .4s,color .4s,border-color .4s,transform .3s cubic-bezier(.16,1,.3,1)`)} data-hover="background:#FFFBF5;color:#1A1517;border-color:#FFFBF5">WhatsApp +1 (781) 518-3262</a>
        <div style={css(`margin-top:18px`)}><a href="tel:+17815183262" style={css(`color:var(--ivory);font-size:15px;letter-spacing:.02em;border-bottom:1px solid rgba(255,251,245,.35);padding-bottom:3px;transition:color .35s,border-color .35s`)} data-hover="color:#D24A52;border-color:#D24A52">Call or text {PHONE}</a></div>
        <div style={css(`margin-top:36px;display:flex;flex-direction:column;gap:8px;font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:rgba(255,251,245,.5)`)}>
          <span>Medford, MA · Greater Boston</span>
          <span>Homes • Detailed cleans • Move-outs</span>
        </div>
      </div>

      <form onSubmit={onSubmit} noValidate={true} style={css(`display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:18px`)}>
        <label style={css(`display:flex;flex-direction:column;gap:8px;font-size:10.5px;letter-spacing:.22em;text-transform:uppercase;color:rgba(255,251,245,.55)`)}>Name
          <input name="name" type="text" required={true} autoComplete="name" style={css(`background:transparent;border:0;border-bottom:1px solid rgba(255,251,245,.28);color:var(--ivory);padding:12px 0;font-size:16px;letter-spacing:0;text-transform:none;min-height:44px;outline:none;transition:border-color .35s`)} data-focus="border-color:#D24A52" />
        </label>
        <label style={css(`display:flex;flex-direction:column;gap:8px;font-size:10.5px;letter-spacing:.22em;text-transform:uppercase;color:rgba(255,251,245,.55)`)}>Email
          <input name="email" type="email" autoComplete="email" style={css(`background:transparent;border:0;border-bottom:1px solid rgba(255,251,245,.28);color:var(--ivory);padding:12px 0;font-size:16px;letter-spacing:0;text-transform:none;min-height:44px;outline:none;transition:border-color .35s`)} data-focus="border-color:#D24A52" />
        </label>
        <label style={css(`display:flex;flex-direction:column;gap:8px;font-size:10.5px;letter-spacing:.22em;text-transform:uppercase;color:rgba(255,251,245,.55)`)}>Phone
          <input name="phone" type="tel" autoComplete="tel" style={css(`background:transparent;border:0;border-bottom:1px solid rgba(255,251,245,.28);color:var(--ivory);padding:12px 0;font-size:16px;letter-spacing:0;text-transform:none;min-height:44px;outline:none;transition:border-color .35s`)} data-focus="border-color:#D24A52" />
        </label>
        <label style={css(`display:flex;flex-direction:column;gap:8px;font-size:10.5px;letter-spacing:.22em;text-transform:uppercase;color:rgba(255,251,245,.55)`)}>Home type
          <select name="propertyType" style={css(`background:transparent;border:0;border-bottom:1px solid rgba(255,251,245,.28);color:var(--ivory);padding:12px 0;font-size:16px;letter-spacing:0;text-transform:none;min-height:44px;outline:none`)}>
            <option style={css(`color:#141113`)}>House</option>
            <option style={css(`color:#141113`)}>Apartment / condo</option>
            <option style={css(`color:#141113`)}>Office</option>
            <option style={css(`color:#141113`)}>Restaurant / commercial</option>
            <option style={css(`color:#141113`)}>Move-in / move-out</option>
            <option style={css(`color:#141113`)}>Detailed / deep cleaning</option>
            <option style={css(`color:#141113`)}>Other</option>
          </select>
        </label>
        <label style={css(`display:flex;flex-direction:column;gap:8px;font-size:10.5px;letter-spacing:.22em;text-transform:uppercase;color:rgba(255,251,245,.55)`)}>Service required
          <input name="service" type="text" placeholder="e.g. detailed cleaning + inside oven" style={css(`background:transparent;border:0;border-bottom:1px solid rgba(255,251,245,.28);color:var(--ivory);padding:12px 0;font-size:16px;letter-spacing:0;text-transform:none;min-height:44px;outline:none;transition:border-color .35s`)} data-focus="border-color:#D24A52" />
        </label>
        <label style={css(`display:flex;flex-direction:column;gap:8px;font-size:10.5px;letter-spacing:.22em;text-transform:uppercase;color:rgba(255,251,245,.55)`)}>Preferred date
          <input name="date" type="date" style={css(`background:transparent;border:0;border-bottom:1px solid rgba(255,251,245,.28);color:var(--ivory);padding:12px 0;font-size:16px;letter-spacing:0;text-transform:none;min-height:44px;outline:none;color-scheme:dark`)} />
        </label>
        <label style={css(`display:flex;flex-direction:column;gap:8px;font-size:10.5px;letter-spacing:.22em;text-transform:uppercase;color:rgba(255,251,245,.55)`)}>ZIP code / area
          <input name="postcode" type="text" autoComplete="postal-code" style={css(`background:transparent;border:0;border-bottom:1px solid rgba(255,251,245,.28);color:var(--ivory);padding:12px 0;font-size:16px;letter-spacing:0;text-transform:none;min-height:44px;outline:none;transition:border-color .35s`)} data-focus="border-color:#D24A52" />
        </label>
        <label style={css(`display:flex;flex-direction:column;gap:8px;font-size:10.5px;letter-spacing:.22em;text-transform:uppercase;color:rgba(255,251,245,.55);grid-column:1/-1`)}>Message
          <textarea name="message" rows={3} style={css(`background:transparent;border:0;border-bottom:1px solid rgba(255,251,245,.28);color:var(--ivory);padding:12px 0;font-size:16px;letter-spacing:0;text-transform:none;outline:none;resize:vertical;transition:border-color .35s`)} data-focus="border-color:#D24A52"></textarea>
        </label>
        <div style={css(`grid-column:1/-1;display:flex;flex-wrap:wrap;align-items:center;gap:18px;margin-top:8px`)}>
          <button type="submit" data-magnetic="1" style={css(`display:inline-flex;align-items:center;gap:12px;background:var(--pink);color:#fff;border:0;padding:20px 30px;border-radius:999px;font-size:12px;letter-spacing:.18em;text-transform:uppercase;font-weight:600;min-height:44px;cursor:pointer;transition:background .4s,transform .3s cubic-bezier(.16,1,.3,1)`)} data-hover="background:#FFFBF5;color:#1A1517">Send on WhatsApp →</button>
          <span style={css(`font-size:13px;line-height:1.55;letter-spacing:.02em;max-width:44ch`)}>
            <span ref={formMsgRef} role="status" style={css(`color:var(--pink-lt);opacity:0;transition:opacity .5s`)}></span>
            {' '}<a ref={formAltRef} href={WA_HELLO} target="_blank" rel="noopener" style={css(`display:none;color:var(--ivory);text-decoration:underline;text-underline-offset:3px`)}>send it on WhatsApp instead</a>
          </span>
        </div>
      </form>
    </div>
  </section>

  {/* FOOTER */}
  <footer style={css(`background:#FCF3E7;color:var(--forest);padding:clamp(60px,7vw,110px) clamp(20px,5vw,72px) 30px;position:relative;overflow:hidden`)}>
    <div style={css(`max-width:1440px;margin:0 auto;position:relative;z-index:1`)}>
      <div style={css(`display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:36px`)}>
        <div>
          <img src="assets/brand/logo-velvet-cut.webp" width="560" height="560" loading="lazy" decoding="async" alt="Premium Quality Cleaning" style={css(`width:min(250px,58vw);height:auto;display:block`)} />
          <div style={css(`margin-top:20px;font-size:13px;line-height:1.7;color:rgba(26,21,23,.65)`)}>Professional cleaning & organizing<br />20 Sycamore Ave, Medford, MA 02155</div>
        </div>
        <nav aria-label="Footer" style={css(`display:flex;flex-direction:column;gap:12px;font-size:12px;letter-spacing:.16em;text-transform:uppercase`)}>
          <a href="#services" onClick={onNavClick} style={css(`color:rgba(26,21,23,.8)`)} data-hover="color:#A3161F">Services</a>
          <a href="#holiday" onClick={onNavClick} style={css(`color:rgba(26,21,23,.8)`)} data-hover="color:#A3161F">Home organizing</a>
          <a href="#directory" onClick={onNavClick} style={css(`color:rgba(26,21,23,.8)`)} data-hover="color:#A3161F">Standard cleaning</a>
          <a href="#commercial" onClick={onNavClick} style={css(`color:rgba(26,21,23,.8)`)} data-hover="color:#A3161F">Office cleaning</a>
          <a href="#directory" onClick={onNavClick} style={css(`color:rgba(26,21,23,.8)`)} data-hover="color:#A3161F">Move-in &amp; move-out</a>
          <a href="#contact" onClick={onNavClick} style={css(`color:rgba(26,21,23,.8)`)} data-hover="color:#A3161F">Contact</a>
        </nav>
        <div style={css(`display:flex;flex-direction:column;justify-content:space-between;gap:24px`)}>
          <div ref={sparkleTextRef} style={css(`font-family:'Instrument Serif',serif;font-size:clamp(28px,4vw,52px);line-height:1;letter-spacing:-.02em;position:relative;display:inline-block;cursor:default`)}>Premium quality in every detail</div>
          <a href="#top" onClick={onNavClick} style={css(`align-self:flex-start;display:inline-flex;align-items:center;gap:10px;font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:rgba(26,21,23,.7);border-bottom:1px solid rgba(26,21,23,.28);padding-bottom:6px`)} data-hover="color:#A3161F">Back to top ↑</a>
        </div>
      </div>
      <div style={css(`margin-top:clamp(40px,6vw,80px);padding-top:22px;border-top:1px solid rgba(26,21,23,.14);display:flex;flex-wrap:wrap;justify-content:space-between;gap:14px;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:rgba(26,21,23,.45)`)}>
        <span>© {year} Premium Quality Cleaning</span>
        <span style={css(`display:flex;gap:22px`)}><a href="#top" onClick={onNavClick} style={css(`color:rgba(26,21,23,.45)`)} data-hover="color:#A3161F">Privacy</a><a href="#top" onClick={onNavClick} style={css(`color:rgba(26,21,23,.45)`)} data-hover="color:#A3161F">Terms</a></span>
      </div>
    </div>
    <div aria-hidden="true" style={css(`position:absolute;left:0;right:0;bottom:-4%;font-family:'Instrument Serif',serif;font-size:clamp(80px,20vw,300px);line-height:.78;letter-spacing:-.04em;color:rgba(26,21,23,.06);text-align:center;pointer-events:none;white-space:nowrap`)}>Premium Quality</div>
  </footer>
  </main>

  {/* WHATSAPP FLOAT */}
  <a ref={whatsRef} href={WA_HELLO} data-wa="" target="_blank" rel="noopener" aria-label="Message Premium Quality Cleaning on WhatsApp" data-cursor="Chat" style={css(`position:fixed;right:clamp(14px,2.4vw,32px);bottom:clamp(88px,11vh,120px);z-index:750;width:60px;height:60px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:var(--pink);color:#fff;border:2.5px solid #fff;box-shadow:0 16px 40px rgba(163,22,31,.38),0 0 0 4px rgba(163,22,31,.16);opacity:0;transform:translate3d(0,26px,0);transition:opacity .6s cubic-bezier(.16,1,.3,1),background .4s,transform .3s cubic-bezier(.16,1,.3,1);will-change:transform`)} data-hover="transform:translate3d(0,-3px,0)">
    <svg viewBox="0 0 32 32" width="27" height="27" aria-hidden="true" fill="currentColor"><path d="M16 3C8.8 3 3 8.8 3 16c0 2.3.6 4.5 1.7 6.4L3 29l6.8-1.7c1.9 1 4 1.6 6.2 1.6 7.2 0 13-5.8 13-13S23.2 3 16 3zm0 23.6c-2 0-3.9-.5-5.6-1.5l-.4-.2-4.1 1 1.1-4-.3-.4A10.5 10.5 0 1 1 16 26.6z"></path><path d="M22 19c-.3-.2-2-1-2.3-1.1-.3-.1-.5-.2-.8.2l-1 1.3c-.2.2-.4.3-.7.1-.4-.2-1.5-.6-2.8-1.7-1-.9-1.7-2-1.9-2.4-.2-.3 0-.5.2-.7l.5-.6c.2-.2.2-.4.4-.6.1-.2.1-.4 0-.6l-1-2.5c-.3-.6-.5-.5-.8-.5h-.7c-.2 0-.6.1-.9.5s-1.2 1.2-1.2 2.9 1.3 3.3 1.4 3.6c.2.2 2.5 3.9 6 5.3 2.4.9 2.9.8 3.4.7.5 0 1.7-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.4z"></path></svg>
  </a>

  {/* STICKY MOBILE CTA */}
  <div ref={stickyCtaRef} data-r="only-sm" style={css(`position:fixed;left:12px;right:12px;bottom:calc(12px + env(safe-area-inset-bottom));z-index:700;display:flex;align-items:center;gap:10px;opacity:0;transform:translateY(120%);transition:opacity .5s,transform .5s cubic-bezier(.16,1,.3,1);pointer-events:none`)}>
    <a href="#contact" onClick={onNavClick} style={css(`flex:1;display:inline-flex;align-items:center;justify-content:center;background:var(--pink);color:#fff;padding:17px 20px;border-radius:999px;font-size:12px;letter-spacing:.18em;text-transform:uppercase;font-weight:600;min-height:48px;box-shadow:0 14px 34px rgba(20,14,17,.25)`)}>Free estimate</a>
    <button type="button" aria-label="Dismiss" onClick={dismissCta} style={css(`width:48px;height:48px;border-radius:50%;border:0;background:rgba(26,21,23,.9);color:#fff;font-size:16px;cursor:pointer`)}>×</button>
  </div>
</div>
  );
}

