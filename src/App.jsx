import { useState, useEffect, useRef, useCallback } from "react";
import './styles.css';

/* ═══════════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════════ */
const TICKER_DATA = [
  {v:"$10M+",l:"Pipeline Generated"},{v:"95%",l:"Client Satisfaction"},
  {v:"150+",l:"Qualified Leads/Mo"},{v:"<30d",l:"Days to First Deal"},
  {v:"100%",l:"Full Cycle Ownership"},{v:"47",l:"Startups Scaled"},
  {v:"34%",l:"Avg Reply Rate"},{v:"3×",l:"Outreach Channels"},
];

const PLANS = [
  { name:"Outbound Starter", tier:"Validate Your Market", price:"2,000",
    desc:"For early-stage startups testing product-market fit and generating initial traction.",
    features:["80 verified leads/month","Email outreach (A/B tested)","LinkedIn strategy","Basic CRM setup (HubSpot/Pipedrive)","Monthly performance report"],
    hot:false, cta:"Get Started" },
  { name:"Revenue Engine", tier:"Accelerate Growth", price:"2,800",
    desc:"Comprehensive outbound solution for startups ready to scale aggressively.",
    features:["150 enriched leads/month","Multi-channel outreach","Dedicated SDR (part-time)","Advanced CRM automation","Weekly metrics dashboard","Premium tech stack included"],
    hot:true, cta:"Most Popular — Start Now" },
  { name:"BD 360", tier:"Total Domination", price:"3,300",
    desc:"Your full external sales department — from prospecting to closing, end-to-end.",
    features:["Unlimited lead sourcing","Full sales cycle ownership","Full-time SDR + Account Manager","Bespoke playbooks & scripts","Daily reporting dashboard","Executive access (founders)"],
    hot:false, cta:"Get Started" },
];

const CMP_ROWS = [
  {l:"Qualified Leads / Mo",s:"80",e:"150",b:"Unlimited"},
  {l:"Cold Email Campaigns",s:true,e:true,b:true},
  {l:"LinkedIn Outreach",s:true,e:true,b:true},
  {l:"Multi-Channel Outreach",s:false,e:true,b:true},
  {l:"CRM Setup & Automation",s:"Basic",e:"Advanced",b:"Custom"},
  {l:"Dedicated Account Manager",s:false,e:true,b:true},
  {l:"Strategy Calls",s:false,e:"Weekly",b:"Daily"},
  {l:"Real Closing Support",s:false,e:false,b:true},
  {l:"Performance Reporting",s:"Monthly",e:"Weekly",b:"Daily"},
  {l:"Executive Access",s:false,e:false,b:true},
  {l:"Custom Playbooks",s:false,e:false,b:true},
];

const TESTIMONIALS = [
  {q:"LeadGen B2B transformed our sales pipeline completely. We went from zero to $500K ARR in 8 months — without a single in-house sales hire. Their system is genuinely different from anything else we'd tried.",n:"Sarah Chen",r:"CEO, TechFlow",i:"SC"},
  {q:"Their expertise in outbound saved us months of trial and error. The ROI was evident within 3 weeks. Highly recommended for any B2B founder.",n:"Marcus Rodriguez",r:"Founder, ScaleBase",i:"MR"},
  {q:"Best investment we've made. They don't just generate leads — they actually help you close. The BD 360 plan paid for itself in month one.",n:"Emily Watson",r:"VP Sales, CloudSync",i:"EW"},
];

const PIPELINE_STEPS = [
  {l:"Prospect",e:"🎯",c:"2,400"},
  {l:"Qualify",e:"🔍",c:"840"},
  {l:"Outreach",e:"📨",c:"420"},
  {l:"Meeting",e:"📅",c:"150"},
  {l:"Close",e:"✅",c:"38"},
];

const VALUES = [
  {i:"⚡",t:"Velocity First",d:"We move faster than your internal team ever could. Our systems are already built — we activate, not build from scratch."},
  {i:"🎯",t:"ICP Obsession",d:"Every lead is hand-matched to your ideal customer profile. No spray and pray. Every name has a reason."},
  {i:"🔁",t:"Full Cycle Ownership",d:"We don't hand off leads and disappear. We stay in the deal until it's won, lost, or paused."},
  {i:"📊",t:"Data-Driven Everything",d:"Weekly dashboards, A/B tested sequences, and real-time conversion tracking. Gut feelings stay out."},
];

const TEAM = [
  {i:"AK",n:"Alexandre Kowalski",r:"Co-Founder & CEO",b:"10 years in B2B sales leadership. Previously scaled outbound at two unicorns before founding LeadGen B2B."},
  {i:"LP",n:"Laure Petit",r:"Co-Founder & Head of Strategy",b:"Former VP Sales at a SaaS company that grew 0→$50M ARR. Obsessed with ICP precision and pipeline quality."},
  {i:"JM",n:"Jonas Meyer",r:"Head of Operations",b:"Built and managed SDR teams of 40+ across Europe and North America. Systems thinker, people leader."},
];

const JOBS = [
  {t:"Senior Sales Development Rep",dept:"Sales",type:"Full-time",loc:"Remote"},
  {t:"Account Executive — B2B SaaS",dept:"Sales",type:"Full-time",loc:"Montpellier / Remote"},
  {t:"Outbound Copywriter",dept:"Marketing",type:"Full-time",loc:"Remote"},
  {t:"CRM & Automation Specialist",dept:"Operations",type:"Part-time",loc:"Remote"},
];

const TIME_SLOTS = ["9:00 AM","9:30 AM","10:00 AM","10:30 AM","11:00 AM","2:00 PM","2:30 PM","3:00 PM","3:30 PM"];

/* ═══════════════════════════════════════════════════════════════
   HOOKS
═══════════════════════════════════════════════════════════════ */
function useInView(ref, threshold = 0.12) {
  const [v, setV] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); o.disconnect(); } }, { threshold });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, []);
  return v;
}

function Reveal({ children, delay = 0, style: s = {} }) {
  const ref = useRef(null);
  const v = useInView(ref);
  return (
    <div ref={ref} style={{ opacity: v?1:0, transform: v?"translateY(0)":"translateY(28px)", transition: `opacity 0.68s ease ${delay}s, transform 0.68s ease ${delay}s`, ...s }}>
      {children}
    </div>
  );
}

function CountUp({ to, prefix="", suffix="", dur=2000 }) {
  const [n, setN] = useState(0);
  const ref = useRef(null);
  const done = useRef(false);
  const v = useInView(ref);

  useEffect(() => {
    done.current = false;
    setN(0);
  }, [to]);

  useEffect(() => {
    if (!v || done.current) return;
    done.current = true;
    const steps = 60, int = dur / steps;
    let i = 0;
    const t = setInterval(() => {
      i++;
      const p = i / steps;
      const e = 1 - Math.pow(1-p, 3);
      const isF = to % 1 !== 0;
      setN(isF ? (to*e).toFixed(1) : Math.round(to*e));
      if (i >= steps) clearInterval(t);
    }, int);
    return () => clearInterval(t);
  }, [v, to]);

  return <span ref={ref}>{prefix}{n}{suffix}</span>;
}

/* ═══════════════════════════════════════════════════════════════
   SHARED COMPONENTS
═══════════════════════════════════════════════════════════════ */
function Nav({ page, setPage }) {
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setStuck(window.scrollY > 36);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const navigate = (p) => { setOpen(false); setPage(p); window.scrollTo(0,0); };
  const links = ["Home","Services","About","Careers","Contact"];

  return (
    <>
      <nav className={`nav${stuck?" stuck":""}`}>
        <div className="nav-inner">
          <div className="nav-logo" onClick={() => navigate("home")}>
            LeadGen<span className="nav-logo-dot">.</span>B2B
          </div>
          <ul className="nav-links">
            {links.map(l => (
              <li key={l}>
                <button className={`nav-link${page===l.toLowerCase()?" active":""}`}
                  onClick={() => navigate(l.toLowerCase())}>{l}
                </button>
              </li>
            ))}
          </ul>
          <button className="nav-cta" onClick={() => navigate("get-started")}>
            Get Started →
          </button>
          <button className={`mob-menu-btn${open?" open":""}`} onClick={() => setOpen(!open)} aria-label="Menu">
            <span/><span/><span/>
          </button>
        </div>
      </nav>
      <div className={`mob-nav${open?" open":""}`}>
        {links.map((l,i) => (
          <button key={l}
            className={`mob-nav-link${page===l.toLowerCase()?" active":""}`}
            onClick={() => navigate(l.toLowerCase())}
            style={{transitionDelay: open?`${i*0.06}s`:"0s"}}>
            {l}
          </button>
        ))}
        <button className="mob-nav-cta" onClick={() => navigate("get-started")}>
          Get Started →
        </button>
        <div className="mob-nav-footer">© 2026 LeadGen B2B</div>
      </div>
    </>
  );
}

function TickerBar() {
  const items = [...TICKER_DATA,...TICKER_DATA];
  return (
    <div className="ticker-bar">
      <div className="ticker-track">
        {items.map((t,i) => (
          <span key={i} className="ticker-item">
            <b>{t.v}</b>{t.l}<span className="ticker-sep"> · </span>
          </span>
        ))}
      </div>
    </div>
  );
}

function PipelineViz() {
  const [active, setActive] = useState(0);
  const ref = useRef(null);
  const v = useInView(ref);
  useEffect(() => {
    if (!v) return;
    const t = setInterval(() => setActive(a => (a+1)%PIPELINE_STEPS.length), 1300);
    return () => clearInterval(t);
  }, [v]);
  return (
    <div ref={ref} className="pipeline">
      {PIPELINE_STEPS.map((s,i) => (
        <div key={s.l} style={{display:"flex",alignItems:"center",flex:1}}>
          <div className="pipeline-node" style={{flex:1}}>
            <div className="pipeline-label">{s.l}</div>
            <div className={`pipeline-circle${i<=active?" lit":""}`} style={{fontSize:15}}>{s.e}</div>
            <div className={`pipeline-count${i<=active?" lit":""}`}>{s.c}</div>
          </div>
          {i < PIPELINE_STEPS.length-1 && (
            <div className="pipeline-line" style={{flex:"0 0 28px"}}>
              <div className="pipeline-fill" style={{width:i<active?"100%":"0%",transition:"width 0.6s ease"}}/>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function StatsRow() {
  const STATS = [
    {pre:"$",to:10,suf:"M+",l:"Pipeline Generated"},
    {pre:"",to:95,suf:"%",l:"Client Satisfaction"},
    {pre:"",to:47,suf:"",l:"Startups Scaled"},
    {pre:"",to:100,suf:"%",l:"Full Cycle Ownership"},
  ];
  return (
    <div className="stats-row">
      {STATS.map((s,i) => (
        <Reveal key={s.l} delay={i*0.08}>
          <div className="stat-cell">
            <div className="stat-num accent">
              <CountUp to={s.to} prefix={s.pre} suffix={s.suf} />
            </div>
            <div className="stat-lbl">{s.l}</div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

function PlansGrid({ onStart }) {
  return (
    <div className="plans-grid">
      {PLANS.map(p => (
        <div key={p.name} className={`plan-card${p.hot?" hot":""}`}>
          {p.hot && <div className="plan-badge">Most Popular</div>}
          <div className="plan-name">{p.name}</div>
          <div className="plan-tier">{p.tier}</div>
          <div className="plan-price">
            <span className="plan-cur">$</span>
            <span className="plan-amt">{p.price}</span>
            <span className="plan-per">/mo</span>
          </div>
          <p className="plan-desc">{p.desc}</p>
          <ul className="plan-features">
            {p.features.map(f => (
              <li key={f} className="plan-feat">
                <span className="feat-chk">✓</span>{f}
              </li>
            ))}
          </ul>
          <button className={`plan-btn${p.hot?" hot-btn":""}`} onClick={onStart}>{p.cta}</button>
        </div>
      ))}
    </div>
  );
}

function CompareTable() {
  function Cell({v}) {
    if (v===true) return <span className="yes">✓</span>;
    if (v===false) return <span className="no">—</span>;
    const isA = v==="150"||v==="Advanced"||v==="Weekly";
    return <span className={`txt${isA?" a":""}`}>{v}</span>;
  }
  return (
    <>
      <div className="cmp-scroll-hint">← Scroll to compare →</div>
      <div className="cmp-table-wrap">
      <table className="cmp-table">
      <thead>
        <tr>
          <th>Feature</th>
          <th>Outbound Starter</th>
          <th className="hl">Revenue Engine</th>
          <th>BD 360</th>
        </tr>
      </thead>
      <tbody>
        {CMP_ROWS.map(r => (
          <tr key={r.l}>
            <td>{r.l}</td>
            <td><Cell v={r.s}/></td>
            <td className="hl"><Cell v={r.e}/></td>
            <td><Cell v={r.b}/></td>
          </tr>
        ))}
      </tbody>
      </table>
      </div>
    </>
  );
}

function Guarantee() {
  return (
    <div className="guarantee">
      <div className="g-icon">🛡</div>
      <div>
        <div className="g-title">30-Day Growth Guarantee</div>
        <p className="g-text">If we don't generate qualified opportunities within the first 30 days of launch, we extend your service for free until we do. Zero risk, full upside.</p>
      </div>
      <div className="g-badge">
        <div className="g-num">30</div>
        <div className="g-sub">Day Guarantee</div>
      </div>
    </div>
  );
}

function TestimonialsBlock() {
  return (
    <div className="testi-grid">
      <Reveal>
        <div className="testi-main">
          <p className="testi-quote">"{TESTIMONIALS[0].q}"</p>
          <div className="testi-author">
            <div className="avatar">{TESTIMONIALS[0].i}</div>
            <div>
              <div className="avatar-name">{TESTIMONIALS[0].n}</div>
              <div className="avatar-role">{TESTIMONIALS[0].r}</div>
            </div>
          </div>
        </div>
      </Reveal>
      <div className="testi-stack">
        {TESTIMONIALS.slice(1).map((t,i) => (
          <Reveal key={t.n} delay={0.1+i*0.1}>
            <div className="testi-mini">
              <p className="mini-q">"{t.q}"</p>
              <div className="mini-n">{t.n}</div>
              <div className="mini-r">{t.r}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

function CTASection({ setPage }) {
  return (
    <section className="cta-section">
      <Reveal>
        <div className="section-tag" style={{justifyContent:"center",marginBottom:24}}>Ready to scale</div>
        <h2 className="display display-lg" style={{marginBottom:22}}>
          Your pipeline is waiting.<br/><span className="accent">Let's build it.</span>
        </h2>
        <p className="lead" style={{maxWidth:440,margin:"0 auto"}}>
          Let's talk about your growth goals. No fluff, no slides — just a real conversation about your pipeline.
        </p>
        <div className="cta-actions">
          <button className="btn-acid btn-lg" onClick={() => { setPage("get-started"); window.scrollTo(0,0); }}>
            Schedule Free Call →
          </button>
          <button className="btn-outline btn-lg" onClick={() => { setPage("services"); window.scrollTo(0,0); }}>
            View Pricing
          </button>
        </div>
      </Reveal>
    </section>
  );
}

function Footer({ setPage }) {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <div className="footer-logo">LeadGen<span className="accent">.</span>B2B</div>
          <p className="footer-desc">Helping startups scale revenue without building an in-house sales team. We own outbound, pipeline, and closing — end to end.</p>
          <div className="footer-socials">
            {["in","𝕏","f"].map((s,i) => <a key={i} className="social-btn">{s}</a>)}
          </div>
        </div>
        <div>
          <div className="footer-col-h">Navigate</div>
          <ul className="footer-nav">
            {["Home","Services","About","Careers","Contact"].map(l => (
              <li key={l}><a onClick={() => { setPage(l.toLowerCase()); window.scrollTo(0,0); }}>{l}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <div className="footer-col-h">Contact</div>
          <div className="footer-ci"><span className="footer-ci-icon">✉</span>contact@leadgenb2b.org</div>
          <div className="footer-ci"><span className="footer-ci-icon">✆</span>+33 609 077 848</div>
          <div className="footer-ci"><span className="footer-ci-icon">◎</span>340 Rue Fra Angelico<br/>34000 Montpellier, France</div>
        </div>
        <div>
          <div className="footer-col-h">Legal</div>
          <ul className="footer-nav">
            {["Privacy Policy","Terms of Service","Cookie Policy"].map(l => <li key={l}><a>{l}</a></li>)}
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span className="footer-copy">© 2026 LeadGen B2B. All rights reserved.</span>
        <div className="footer-legal">
          <a>Privacy</a><a>Terms</a><a>Cookies</a>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE: HOME
═══════════════════════════════════════════════════════════════ */
function HomePage({ setPage }) {
  return (
    <>
      {/* HERO */}
      <section style={{minHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"center",padding:"130px 52px 80px",position:"relative",overflow:"hidden"}}>
        <div className="hero-grid"/>
        <div className="hero-radial" style={{top:"-20%",right:"-8%",width:"800px",height:"800px"}}/>
        <div className="hero-radial" style={{bottom:"-15%",left:"-5%",width:"500px",height:"500px"}}/>
        <div style={{position:"relative",zIndex:1,maxWidth:"1280px",margin:"0 auto",width:"100%"}}>
          <div className="tag-pill anim-hero"><span className="tag-dot"/>B2B Revenue Infrastructure</div>
          <h1 className="display display-xl anim-hero-1">
            We build your<br/><span className="accent">sales pipeline.</span><br/><span className="italic">You close the deals.</span>
          </h1>
          <p className="lead anim-hero-2" style={{maxWidth:480,marginTop:24,marginBottom:46}}>
            LeadGen B2B owns your outbound end-to-end — prospecting, sequences, pipeline, closing support. No in-house team needed.
          </p>
          <div className="anim-hero-3" style={{display:"flex",gap:16,marginBottom:64,alignItems:"center"}}>
            <button className="btn-acid btn-lg" onClick={() => { setPage("get-started"); window.scrollTo(0,0); }}>Schedule a Call →</button>
            <button className="btn-outline btn-lg" onClick={() => { setPage("services"); window.scrollTo(0,0); }}>View Pricing ↓</button>
          </div>
          <div className="anim-hero-4"><PipelineViz/></div>
        </div>
      </section>

      <TickerBar/>
      <StatsRow/>

      {/* SERVICES PREVIEW */}
      <section className="section" style={{background:"var(--ink-2)"}}>
        <Reveal>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:48,alignItems:"end",marginBottom:56}}>
            <div>
              <div className="section-tag">Services & Pricing</div>
              <h2 className="display display-lg">Choose your<br/>growth engine.</h2>
            </div>
            <p className="lead">No hidden fees. No lock-ins. Just transparent pricing and pure performance. If we don't deliver in 30 days — we extend free.</p>
          </div>
        </Reveal>
        <Reveal delay={0.08}><PlansGrid onStart={() => { setPage("get-started"); window.scrollTo(0,0); }}/></Reveal>
        <Reveal delay={0.12}><Guarantee/></Reveal>
      </section>

      {/* COMPARE */}
      <section className="section">
        <Reveal>
          <div className="section-tag">Feature Comparison</div>
          <h2 className="display display-md" style={{marginBottom:14}}>Every plan, laid bare.</h2>
          <p className="lead" style={{maxWidth:480,marginBottom:52}}>See exactly what you get at each tier. No hidden asterisks.</p>
        </Reveal>
        <Reveal delay={0.1}><CompareTable/></Reveal>
      </section>

      {/* TESTIMONIALS */}
      <section className="section" style={{background:"var(--ink-2)"}}>
        <Reveal>
          <div className="section-tag">Client Results</div>
          <h2 className="display display-lg">Real startups.<br/><span className="accent">Real revenue.</span></h2>
        </Reveal>
        <TestimonialsBlock/>
      </section>

      <CTASection setPage={setPage}/>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE: SERVICES
═══════════════════════════════════════════════════════════════ */
function ServicesPage({ setPage }) {
  return (
    <>
      <section className="page-hero">
        <div className="hero-grid"/>
        <div className="hero-radial" style={{top:"-30%",right:"-5%",width:"700px",height:"700px"}}/>
        <div style={{position:"relative",zIndex:1}}>
          <div className="tag-pill anim-hero"><span className="tag-dot"/>Services & Pricing</div>
          <h1 className="display display-xl anim-hero-1">
            Simple, transparent<br/><span className="accent">pricing.</span>
          </h1>
          <p className="lead anim-hero-2" style={{maxWidth:520,marginTop:20}}>
            Choose the engine that fits your growth stage. No hidden fees. No long-term lock-ins. Just pure performance — or your money back.
          </p>
        </div>
      </section>

      <TickerBar/>

      <section className="section">
        <Reveal><PlansGrid onStart={() => { setPage("get-started"); window.scrollTo(0,0); }}/></Reveal>
        <Reveal delay={0.1}><Guarantee/></Reveal>
      </section>

      <section className="section" style={{background:"var(--ink-2)"}}>
        <Reveal>
          <div className="section-tag">Full Breakdown</div>
          <h2 className="display display-md" style={{marginBottom:14}}>Every plan, compared.</h2>
          <p className="lead" style={{maxWidth:480,marginBottom:56}}>All features side-by-side. No asterisks, no fine print.</p>
        </Reveal>
        <Reveal delay={0.08}><CompareTable/></Reveal>
      </section>

      {/* HOW IT WORKS */}
      <section className="section">
        <Reveal>
          <div className="section-tag">Our Process</div>
          <h2 className="display display-md" style={{marginBottom:52}}>From kickoff to <span className="accent">closed deals.</span></h2>
        </Reveal>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:1,background:"var(--line)",border:"0.5px solid var(--line)",borderRadius:"var(--r-xl)",overflow:"hidden"}}>
          {[
            {n:"01",t:"Onboarding",d:"ICP definition, CRM setup, messaging framework, competitive positioning — all done in week 1."},
            {n:"02",t:"Build",d:"Lead database built, sequences crafted and A/B tested, LinkedIn profile optimized, toolstack live."},
            {n:"03",t:"Launch",d:"Campaigns go live. SDR begins managing replies. You get real-time access to pipeline dashboard."},
            {n:"04",t:"Scale",d:"Weekly strategy calls, performance tuning, channel expansion, and closing support activated."},
          ].map((s,i) => (
            <Reveal key={s.n} delay={i*0.08}>
              <div style={{background:"var(--ink-2)",padding:"40px 32px",transition:"background 0.3s"}}
                onMouseEnter={e=>e.currentTarget.style.background="var(--ink-3)"}
                onMouseLeave={e=>e.currentTarget.style.background="var(--ink-2)"}>
                <div style={{fontFamily:"var(--mono)",fontSize:"28px",fontWeight:400,color:"var(--acid)",marginBottom:16,lineHeight:1}}>{s.n}</div>
                <div style={{fontFamily:"var(--display)",fontSize:17,fontWeight:700,color:"var(--cream)",marginBottom:10}}>{s.t}</div>
                <p style={{fontSize:13.5,color:"var(--cream-2)",lineHeight:1.6,fontWeight:300}}>{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section" style={{background:"var(--ink-2)"}}>
        <Reveal>
          <div className="section-tag">Client Results</div>
          <h2 className="display display-lg">Real startups.<br/><span className="accent">Real revenue.</span></h2>
        </Reveal>
        <TestimonialsBlock/>
      </section>

      <CTASection setPage={setPage}/>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE: ABOUT
═══════════════════════════════════════════════════════════════ */
function AboutPage({ setPage }) {
  return (
    <>
      <section className="page-hero">
        <div className="hero-grid"/>
        <div className="hero-radial" style={{top:"-25%",left:"30%",width:"600px",height:"600px"}}/>
        <div style={{position:"relative",zIndex:1}}>
          <div className="tag-pill anim-hero"><span className="tag-dot"/>About LeadGen B2B</div>
          <h1 className="display display-xl anim-hero-1">
            Your dedicated partner in<br/><span className="accent">scalable growth.</span>
          </h1>
          <p className="lead anim-hero-2" style={{maxWidth:540,marginTop:20}}>
            We're a premier Business Development agency helping startups in the US, UK, and Canada scale revenue — without the overhead of an in-house sales team.
          </p>
        </div>
      </section>

      {/* WHO WE ARE */}
      <section className="section">
        <div className="about-body">
          <Reveal>
            <div>
              <div className="section-tag">Who We Are</div>
              <h2 className="display display-md" style={{marginBottom:32}}>We are your external<br/><span className="accent">sales department.</span></h2>
              <div className="about-text">
                <p>LeadGen B2B is a premier Business Development agency specializing in helping startups and small-to-medium-sized companies in the US, UK, and Canada scale their revenue. We understand the challenges of building a sales function from scratch, which is why we've designed our services to bridge the gap between product-market fit and <strong>scalable growth</strong>.</p>
                <p>Our mission is simple: to act as your external BDR and sales team. We don't just generate leads — we own the <strong>entire outbound process</strong>, build your pipeline, and support closing efforts end-to-end. By partnering with us, you get the expertise of a full sales department without the overhead of hiring, training, and managing an in-house team.</p>
                <p>Whether you're looking to validate a new market, accelerate your current growth, or completely outsource your business development, LeadGen B2B provides the <strong>strategy, technology, and talent</strong> to make it happen.</p>
              </div>
              <div style={{marginTop:36}}>
                <button className="btn-acid" onClick={() => { setPage("get-started"); window.scrollTo(0,0); }}>Work With Us →</button>
              </div>
            </div>
          </Reveal>
          <div>
            <Reveal delay={0.1}>
              <div className="impact-grid">
                {[
                  {pre:"$",to:10,suf:"M+",l:"Pipeline Generated"},
                  {pre:"",to:95,suf:"%",l:"Client Satisfaction"},
                  {pre:"",to:47,suf:"",l:"Startups Scaled"},
                  {pre:"",to:100,suf:"%",l:"Full Cycle Ownership"},
                ].map((s,i) => (
                  <div key={s.l} className="impact-card">
                    <div className="impact-num accent">
                      <CountUp to={s.to} prefix={s.pre} suffix={s.suf}/>
                    </div>
                    <div className="impact-lbl">{s.l}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="section" style={{background:"var(--ink-2)"}}>
        <Reveal>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:80,alignItems:"start"}}>
            <div>
              <div className="section-tag">Our Values</div>
              <h2 className="display display-md" style={{marginBottom:16}}>What we actually<br/>believe in.</h2>
              <p className="lead">Every principle that drives our work, made explicit. We hold ourselves to these — publicly.</p>
            </div>
            <div className="values-list">
              {VALUES.map((v,i) => (
                <Reveal key={v.t} delay={i*0.08}>
                  <div className="value-item">
                    <div className="value-icon">{v.i}</div>
                    <div>
                      <div className="value-title">{v.t}</div>
                      <div className="value-desc">{v.d}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* TEAM */}
      <section className="section team-section">
        <Reveal>
          <div className="section-tag">The Team</div>
          <h2 className="display display-md" style={{marginBottom:10}}>The people behind<br/>your <span className="accent">pipeline.</span></h2>
          <p className="lead" style={{maxWidth:480,marginBottom:0}}>Three operators who've built and scaled B2B sales machines from scratch — for themselves, and now for you.</p>
        </Reveal>
        <div className="team-grid">
          {TEAM.map((m,i) => (
            <Reveal key={m.n} delay={i*0.1}>
              <div className="team-card">
                <div className="team-avatar">{m.i}</div>
                <div className="team-name">{m.n}</div>
                <div className="team-role">{m.r}</div>
                <p className="team-bio">{m.b}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <CTASection setPage={setPage}/>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE: CAREERS
═══════════════════════════════════════════════════════════════ */
function CareersPage() {
  const [form, setForm] = useState({ name:"", email:"", phone:"", position:"", type:"", cover:"" });
  const [file, setFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <>
      <section className="page-hero">
        <div className="hero-grid"/>
        <div className="hero-radial" style={{top:"-20%",right:"-5%",width:"650px",height:"650px"}}/>
        <div style={{position:"relative",zIndex:1}}>
          <div className="tag-pill anim-hero"><span className="tag-dot"/>Careers</div>
          <h1 className="display display-xl anim-hero-1">
            Join our<br/><span className="accent">mission.</span>
          </h1>
          <p className="lead anim-hero-2" style={{maxWidth:520,marginTop:20}}>
            We're building the future of B2B sales. If you're passionate, driven, and ready to make a real impact on startups worldwide — we want to hear from you.
          </p>
        </div>
      </section>

      {/* WHY JOIN */}
      <section className="section-sm" style={{background:"var(--ink-2)"}}>
        <Reveal>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:1,background:"var(--line)",border:"0.5px solid var(--line)",borderRadius:"var(--r-xl)",overflow:"hidden"}}>
            {[
              {i:"🌍",t:"100% Remote",d:"Work from anywhere in the world."},
              {i:"📈",t:"Fast Growth",d:"We're scaling quickly — so is your career."},
              {i:"💰",t:"Performance Pay",d:"Base + uncapped commissions on closed deals."},
              {i:"🧠",t:"Real Ownership",d:"No micromanagement. You own your results."},
            ].map((p,i) => (
              <div key={p.t} style={{background:"var(--ink-2)",padding:"32px 28px",transition:"background 0.25s"}}
                onMouseEnter={e=>e.currentTarget.style.background="var(--ink-3)"}
                onMouseLeave={e=>e.currentTarget.style.background="var(--ink-2)"}>
                <div style={{fontSize:26,marginBottom:12}}>{p.i}</div>
                <div style={{fontFamily:"var(--display)",fontSize:15,fontWeight:700,color:"var(--cream)",marginBottom:6}}>{p.t}</div>
                <p style={{fontSize:13,color:"var(--cream-2)",lineHeight:1.55,fontWeight:300}}>{p.d}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* OPEN ROLES */}
      <section className="section">
        <Reveal>
          <div className="section-tag">Open Positions</div>
          <h2 className="display display-md" style={{marginBottom:48}}>Current <span className="accent">openings.</span></h2>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="jobs-list">
            {JOBS.map((j,i) => (
              <div key={j.t} className="job-row">
                <div>
                  <div className="job-title">{j.t}</div>
                  <div className="job-meta">
                    <span className="job-tag open">Open</span>
                    <span className="job-tag">{j.dept}</span>
                    <span className="job-tag">{j.type}</span>
                    <span className="job-tag">{j.loc}</span>
                  </div>
                </div>
                <span className="job-arrow">→</span>
              </div>
            ))}
          </div>
        </Reveal>

        {/* APPLICATION FORM */}
        <Reveal delay={0.1}>
          <div className="apply-form">
            <div className="apply-form-header">
              <h3>Apply Now</h3>
              <p>Fill out the form below to apply for any open position. We review every application personally.</p>
            </div>
            <div className="apply-form-body">
              {submitted && (
                <div className="form-success">
                  <span style={{fontSize:22}}>🎉</span>
                  <div>
                    <div style={{fontFamily:"var(--display)",fontWeight:700,marginBottom:3}}>Application submitted!</div>
                    <div style={{fontSize:13,color:"var(--cream-2)",fontWeight:300}}>We'll review your application and get back to you within 3 business days.</div>
                  </div>
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Full Name <span>*</span></label>
                    <input className="form-input" placeholder="Jane Doe" required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address <span>*</span></label>
                    <input className="form-input" type="email" placeholder="jane@example.com" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number <span>*</span></label>
                    <input className="form-input" placeholder="+1 (555) 000-0000" required value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Position Applying For <span>*</span></label>
                    <input className="form-input" placeholder="e.g. Sales Development Rep" required value={form.position} onChange={e=>setForm({...form,position:e.target.value})}/>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Employment Type <span>*</span></label>
                  <select className="form-select" required value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>
                    <option value="">Select an option</option>
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract / Freelance</option>
                    <option>Internship</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Upload CV / Resume <span>*</span> <span style={{color:"var(--cream-2)",fontWeight:300}}>(PDF, DOC, DOCX — up to 10MB)</span></label>
                  <label className="file-drop">
                    <input type="file" accept=".pdf,.doc,.docx" style={{display:"none"}} onChange={e=>setFile(e.target.files[0])}/>
                    <div style={{fontSize:28,marginBottom:6}}>📎</div>
                    <p>{file ? <><span style={{color:"var(--acid)"}}>{file.name}</span> selected</> : <><span>Upload a file</span> or drag and drop</>}</p>
                    <small>PDF, DOC, DOCX up to 10MB</small>
                  </label>
                </div>
                <div className="form-group">
                  <label className="form-label">Cover Letter / Message <span style={{color:"var(--cream-2)",fontWeight:300}}>(Optional)</span></label>
                  <textarea className="form-textarea" placeholder="Tell us why you're a great fit for this role..." value={form.cover} onChange={e=>setForm({...form,cover:e.target.value})}/>
                </div>
                <button type="submit" className="btn-acid form-submit" style={{width:"100%",justifyContent:"center",fontSize:15,padding:"16px"}}>
                  Submit Application →
                </button>
              </form>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE: CONTACT
═══════════════════════════════════════════════════════════════ */
function ContactPage() {
  const [form, setForm] = useState({ name:"", email:"", company:"", message:"" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setForm({ name:"", email:"", company:"", message:"" });
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <>
      <section className="page-hero">
        <div className="hero-grid"/>
        <div className="hero-radial" style={{top:"-25%",left:"20%",width:"700px",height:"700px"}}/>
        <div style={{position:"relative",zIndex:1}}>
          <div className="tag-pill anim-hero"><span className="tag-dot"/>Contact</div>
          <h1 className="display display-xl anim-hero-1">
            Let's start a<br/><span className="accent">conversation.</span>
          </h1>
          <p className="lead anim-hero-2" style={{maxWidth:500,marginTop:20}}>
            Ready to accelerate your sales pipeline? Let's discuss your growth goals — no commitment, no pitch deck, just a real conversation.
          </p>
        </div>
      </section>

      <section className="section">
        <Reveal>
          <div className="contact-layout">
            {/* LEFT: INFO */}
            <div className="contact-info">
              <div className="contact-info-title">Get in Touch</div>
              <div className="contact-item">
                <div className="contact-icon">✉</div>
                <div>
                  <div className="contact-item-label">Email Us</div>
                  <div className="contact-item-val">contact@leadgenb2b.org</div>
                  <div className="contact-hours">For general inquiries and support</div>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">✆</div>
                <div>
                  <div className="contact-item-label">Call Us</div>
                  <div className="contact-item-val">+33 609 077 848</div>
                  <div className="contact-hours">Mon–Fri, 9:00am–6:00pm CET</div>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">◎</div>
                <div>
                  <div className="contact-item-label">Visit Us</div>
                  <div className="contact-item-val">340 Rue Fra Angelico<br/>34000 Montpellier, France</div>
                </div>
              </div>
              <div className="why-box">
                <div className="why-title">Why Partner With Us?</div>
                <ul className="why-list">
                  <li>Dedicated account management from day one</li>
                  <li>Proprietary lead sourcing technology</li>
                  <li>Proven track record with 47+ startups</li>
                  <li>Performance-based incentives — we win when you win</li>
                  <li>30-day growth guarantee, no questions asked</li>
                </ul>
              </div>
            </div>
            {/* RIGHT: FORM */}
            <div className="contact-form-wrap">
              <div className="contact-form-title">Send us a Message</div>
              <p className="contact-form-sub">We respond to every message within 24 hours, usually much faster.</p>
              {sent && (
                <div className="form-success">
                  <span style={{fontSize:22}}>✅</span>
                  <div>
                    <div style={{fontFamily:"var(--display)",fontWeight:700,marginBottom:3}}>Message sent!</div>
                    <div style={{fontSize:13,color:"var(--cream-2)",fontWeight:300}}>We'll be in touch within 24 hours.</div>
                  </div>
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-input" placeholder="John Doe" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input className="form-input" type="email" placeholder="john@company.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
                </div>
                <div className="form-group">
                  <label className="form-label">Company Name</label>
                  <input className="form-input" placeholder="Acme Inc." value={form.company} onChange={e=>setForm({...form,company:e.target.value})}/>
                </div>
                <div className="form-group">
                  <label className="form-label">Message</label>
                  <textarea className="form-textarea" placeholder="Tell us about your sales goals, current challenges, and what you're looking to achieve..." value={form.message} onChange={e=>setForm({...form,message:e.target.value})} style={{minHeight:130}}/>
                </div>
                <button type="submit" className="btn-acid" style={{width:"100%",justifyContent:"center",fontSize:15,padding:"16px"}}>
                  Send Message →
                </button>
              </form>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE: GET STARTED
═══════════════════════════════════════════════════════════════ */
function GetStartedPage({ setPage }) {
  const today = new Date();
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [plan, setPlan] = useState("");
  const [form, setForm] = useState({ name:"", email:"", company:"", size:"", goals:"" });
  const [step, setStep] = useState(1);
  const [booked, setBooked] = useState(false);

  const daysInMonth = new Date(today.getFullYear(), today.getMonth()+1, 0).getDate();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
  const weekDays = ["Su","Mo","Tu","We","Th","Fr","Sa"];
  const monthName = today.toLocaleString("default",{month:"long",year:"numeric"});

  const isWeekend = (d) => {
    const day = new Date(today.getFullYear(),today.getMonth(),d).getDay();
    return day===0||day===6;
  };
  const isPast = (d) => d < today.getDate();

  return (
    <>
      <section className="page-hero" style={{minHeight:"40vh"}}>
        <div className="hero-grid"/>
        <div className="hero-radial" style={{top:"-20%",right:"10%",width:"600px",height:"600px"}}/>
        <div style={{position:"relative",zIndex:1}}>
          <div className="tag-pill anim-hero"><span className="tag-dot"/>Get Started</div>
          <h1 className="display display-lg anim-hero-1">
            Schedule your free<br/><span className="accent">strategy call.</span>
          </h1>
          <p className="lead anim-hero-2" style={{maxWidth:480,marginTop:16}}>
            30 minutes. No pitch, no pressure. Just a candid conversation about your pipeline goals.
          </p>
        </div>
      </section>

      <section className="section">
        {booked ? (
          <Reveal>
            <div style={{maxWidth:560,margin:"0 auto",textAlign:"center"}}>
              <div style={{fontSize:64,marginBottom:24}}>🎉</div>
              <h2 className="display display-md" style={{marginBottom:16}}>You're <span className="accent">booked!</span></h2>
              <p className="lead" style={{marginBottom:32}}>Your strategy call is confirmed. Check your inbox — a calendar invite and prep guide are on their way.</p>
              <div style={{background:"var(--ink-2)",border:"0.5px solid var(--line)",borderRadius:"var(--r-lg)",padding:"28px 36px",marginBottom:32,textAlign:"left"}}>
                <div style={{fontFamily:"var(--mono)",fontSize:11,color:"var(--acid)",letterSpacing:"0.09em",marginBottom:16,textTransform:"uppercase"}}>Booking Summary</div>
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {[
                    {l:"Date",v:`${monthName}, Day ${selectedDay}`},
                    {l:"Time",v:selectedTime},
                    {l:"Plan Interest",v:plan||"To be discussed"},
                    {l:"Name",v:form.name},
                    {l:"Email",v:form.email},
                    {l:"Company",v:form.company},
                  ].map(r=>(
                    <div key={r.l} style={{display:"flex",gap:12,fontSize:14}}>
                      <span style={{color:"var(--cream-2)",minWidth:90,fontFamily:"var(--mono)",fontSize:12}}>{r.l}</span>
                      <span style={{color:"var(--cream)",fontWeight:400}}>{r.v}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button className="btn-outline" onClick={() => { setPage("home"); window.scrollTo(0,0); }}>← Back to Home</button>
            </div>
          </Reveal>
        ) : (
          <Reveal>
            <div className="gs-layout">
              {/* LEFT: HOW IT WORKS */}
              <div className="gs-left">
                <div className="section-tag">What to Expect</div>
                <h2 className="display display-md" style={{marginBottom:8}}>Your path to<br/><span className="accent">pipeline.</span></h2>
                <p style={{fontSize:14,color:"var(--cream-2)",fontWeight:300,marginBottom:0,lineHeight:1.6}}>From call to campaign in under 7 days.</p>
                <ol className="step-list">
                  {[
                    {n:"01",t:"Strategy Call (30 min)",d:"We audit your current pipeline, define your ICP, and map a custom outbound strategy. Zero commitment."},
                    {n:"02",t:"Proposal (24h)",d:"You receive a tailored proposal within 24 hours — plan recommendation, timeline, and projected outcomes."},
                    {n:"03",t:"Kickoff (Week 1)",d:"CRM setup, lead database built, sequences crafted. Your SDR is briefed and ready to launch."},
                    {n:"04",t:"Launch & Scale",d:"Campaigns go live. Leads start flowing. Weekly check-ins keep everything calibrated."},
                  ].map(s => (
                    <li key={s.n} className="step-item">
                      <div className="step-num">{s.n}</div>
                      <div>
                        <div className="step-title">{s.t}</div>
                        <p className="step-desc">{s.d}</p>
                      </div>
                    </li>
                  ))}
                </ol>
                {/* Plan selector */}
                <div style={{marginTop:8}}>
                  <div style={{fontFamily:"var(--mono)",fontSize:11,color:"var(--acid)",letterSpacing:"0.09em",textTransform:"uppercase",marginBottom:14}}>Interested in which plan?</div>
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    {["Outbound Starter — $2,000/mo","Revenue Engine — $2,800/mo","BD 360 — $3,300/mo","Not sure yet"].map(p => (
                      <label key={p} style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",padding:"10px 14px",borderRadius:"var(--r-sm)",border:`0.5px solid ${plan===p?"rgba(202,255,51,0.4)":"var(--line)"}`,background:plan===p?"var(--acid-3)":"transparent",transition:"all 0.2s"}}>
                        <input type="radio" name="plan" value={p} checked={plan===p} onChange={()=>setPlan(p)} style={{accentColor:"var(--acid)"}}/>
                        <span style={{fontSize:13.5,color:"var(--cream-2)",fontWeight:300}}>{p}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT: BOOKING FORM */}
              <div className="gs-right">
                {/* Step indicator */}
                <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:36}}>
                  {[1,2].map(s => (
                    <div key={s} style={{display:"flex",alignItems:"center",gap:8}}>
                      <div style={{
                        width:28,height:28,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",
                        background:step===s?"var(--acid)":step>s?"var(--acid-2)":"var(--ink-3)",
                        border:`0.5px solid ${step>=s?"var(--acid)":"var(--line)"}`,
                        fontFamily:"var(--mono)",fontSize:12,color:step===s?"var(--ink)":step>s?"var(--acid)":"var(--cream-2)",
                        fontWeight:600,transition:"all 0.3s"
                      }}>{step>s?"✓":s}</div>
                      <span style={{fontSize:12,color:step===s?"var(--cream)":"var(--cream-2)",fontFamily:"var(--mono)",letterSpacing:"0.06em",fontWeight:step===s?500:300}}>
                        {s===1?"Pick a time":"Your details"}
                      </span>
                      {s<2 && <span style={{color:"var(--line-2)",fontSize:16,margin:"0 4px"}}>→</span>}
                    </div>
                  ))}
                </div>

                {step===1 && (
                  <>
                    <div className="cal-block">
                      <div className="cal-title">
                        <span style={{fontSize:16}}>📅</span>{monthName}
                      </div>
                      <div className="cal-grid">
                        {weekDays.map(d=><div key={d} style={{textAlign:"center",fontFamily:"var(--mono)",fontSize:11,color:"var(--cream-2)",letterSpacing:"0.06em",padding:"4px 0"}}>{d}</div>)}
                        {Array(firstDay).fill(null).map((_,i)=><div key={`e${i}`}/>)}
                        {Array.from({length:daysInMonth},(_,i)=>i+1).map(d=>(
                          <div key={d} className={`cal-cell${selectedDay===d?" selected":""}${isPast(d)||isWeekend(d)?" disabled":""}`}
                            onClick={()=>!isPast(d)&&!isWeekend(d)&&setSelectedDay(d)}>
                            {d}
                          </div>
                        ))}
                      </div>
                    </div>
                    {selectedDay && (
                      <div>
                        <div style={{fontFamily:"var(--mono)",fontSize:11,color:"var(--acid)",letterSpacing:"0.09em",textTransform:"uppercase",marginBottom:12}}>Available Times — CET</div>
                        <div className="time-slots">
                          {TIME_SLOTS.map(t => (
                            <div key={t} className={`time-slot${selectedTime===t?" selected":""}`} onClick={()=>setSelectedTime(t)}>{t}</div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div style={{marginTop:28}}>
                      <button className="btn-acid" style={{width:"100%",justifyContent:"center",fontSize:15,padding:"16px",opacity:(selectedDay&&selectedTime)?1:0.4,cursor:(selectedDay&&selectedTime)?"pointer":"not-allowed"}}
                        onClick={()=>(selectedDay&&selectedTime)&&setStep(2)}>
                        Continue →
                      </button>
                    </div>
                  </>
                )}

                {step===2 && (
                  <>
                    <div style={{background:"var(--ink-2)",border:"0.5px solid rgba(202,255,51,0.2)",borderRadius:"var(--r-md)",padding:"14px 18px",marginBottom:28,display:"flex",alignItems:"center",gap:12}}>
                      <span style={{fontSize:16}}>📅</span>
                      <span style={{fontSize:13,color:"var(--cream-2)",fontFamily:"var(--mono)"}}>{monthName}, Day {selectedDay} · <span style={{color:"var(--acid)"}}>{selectedTime} CET</span></span>
                      <button onClick={()=>setStep(1)} style={{marginLeft:"auto",fontSize:12,color:"var(--cream-2)",background:"none",border:"none",cursor:"pointer",fontFamily:"var(--mono)"}}>Change</button>
                    </div>
                    <form onSubmit={e=>{e.preventDefault();setBooked(true);}}>
                      <div className="form-grid-2">
                        <div className="form-group">
                          <label className="form-label">Your Name <span>*</span></label>
                          <input className="form-input" placeholder="Jane Doe" required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
                        </div>
                        <div className="form-group">
                          <label className="form-label">Work Email <span>*</span></label>
                          <input className="form-input" type="email" placeholder="jane@startup.com" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Company Name <span>*</span></label>
                        <input className="form-input" placeholder="Your Startup Inc." required value={form.company} onChange={e=>setForm({...form,company:e.target.value})}/>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Team Size</label>
                        <select className="form-select" value={form.size} onChange={e=>setForm({...form,size:e.target.value})}>
                          <option value="">Select range</option>
                          <option>1–5 (Founder-led)</option>
                          <option>6–20</option>
                          <option>21–50</option>
                          <option>50+</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">What's your biggest sales challenge?</label>
                        <textarea className="form-textarea" placeholder="e.g. We have a great product but struggle to get in front of decision makers consistently..." value={form.goals} onChange={e=>setForm({...form,goals:e.target.value})}/>
                      </div>
                      <button type="submit" className="btn-acid" style={{width:"100%",justifyContent:"center",fontSize:15,padding:"16px"}}>
                        Confirm Booking →
                      </button>
                      <p style={{fontSize:12,color:"var(--cream-2)",textAlign:"center",marginTop:14,fontWeight:300}}>
                        No commitment. Cancel or reschedule any time.
                      </p>
                    </form>
                  </>
                )}
              </div>
            </div>
          </Reveal>
        )}
      </section>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════════════════════════ */
export default function App() {
  const [page, setPage] = useState("home");

  const navigate = useCallback((p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const renderPage = () => {
    switch(page) {
      case "home":     return <HomePage setPage={navigate}/>;
      case "services": return <ServicesPage setPage={navigate}/>;
      case "about":    return <AboutPage setPage={navigate}/>;
      case "careers":  return <CareersPage/>;
      case "contact":  return <ContactPage/>;
      case "get-started": return <GetStartedPage setPage={navigate}/>;
      default:         return <HomePage setPage={navigate}/>;
    }
  };

  return (
    <>
      <Nav page={page} setPage={navigate}/>
      <main>{renderPage()}</main>
      <Footer setPage={navigate}/>
    </>
  );
}
