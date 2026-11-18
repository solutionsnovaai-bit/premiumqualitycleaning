import { forwardRef } from 'react';

// Opens like a macro shot on the logo's big leaf, then the real logo (gold-edged enamel pin)
// spreads out from it: the symbol first, the lettering written in after.
const STAR = 'M50 0C80 25 80 75 50 100C20 75 20 25 50 0Z';
const SPARKS = [{"x": 82.4, "y": 10.9, "s": 9.5, "r": -19}, {"x": 88.7, "y": 16.7, "s": 10.7, "r": 10}, {"x": 92.5, "y": 25.3, "s": 10.3, "r": 21}];

const BrandIntro = forwardRef(function BrandIntro(_, ref) {
  return (
    <div ref={ref} className="cs-intro" role="dialog" aria-modal="true" aria-label="Welcome to Premium Quality Cleaning" tabIndex={-1}>
      <div className="cs-intro__halo" aria-hidden="true" />
      <div className="cs-intro__paper" aria-hidden="true" />
      <div className="cs-intro__top" aria-hidden="true"><span>Premium care.</span><span>Spotless homes.</span></div>
      <div className="cs-intro__stage bt-stage" aria-hidden="true">
        <div className="bt-intro__part bt-intro__sym"><img data-intro-sym="" src="/assets/brand/logo-pin-cut.webp" alt="" width="900" height="1283" /></div>
        <div className="bt-intro__part bt-intro__word"><img data-intro-word="" src="/assets/brand/logo-pin-cut.webp" alt="" width="900" height="1283" /></div>
        <span data-intro-shine="" className="bt-intro__shine" />
        <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
          <defs>
            <radialGradient id="bt-star-rose" cx="38%" cy="32%" r="80%"><stop offset="0" stopColor="#e2525b" /><stop offset=".35" stopColor="#c4202b" /><stop offset=".72" stopColor="#A3161F" /><stop offset="1" stopColor="#6e0c13" /></radialGradient>
          </defs>
        </svg>
        {SPARKS.map((p, i) => (
          <svg key={i} data-intro-star={i} className="bt-intro__spark" viewBox="-4 -4 108 108" style={{ left: p.x + '%', top: p.y + '%', width: p.s + '%' }}>
            <path d={STAR} transform={`rotate(${p.r} 50 50)`} fill="url(#bt-star-rose)" stroke="#E7C77E" strokeWidth="3.2" strokeLinejoin="round" />
          </svg>
        ))}
      </div>
      <div className="cs-intro__bottom"><span>Greater Boston <i><svg viewBox="0 0 100 100" width=".8em" height=".8em" style={{ verticalAlign: "middle", transform: "rotate(35deg)" }}><path fill="currentColor" d="M50 0C80 25 80 75 50 100C20 75 20 25 50 0Z" /></svg></i> Home care</span><span className="cs-intro__rule"><i /></span><button type="button" data-intro-skip="">Skip intro <span>↗</span></button></div>
    </div>
  );
});

export default BrandIntro;
