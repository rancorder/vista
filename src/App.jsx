import { useState, useEffect, useRef, useCallback } from "react";

/* ─── Audio ─── */
let _ac = null;
function getCtx() {
  try {
    if (typeof window === "undefined") return null;
    if (!_ac) { const A = window.AudioContext || window.webkitAudioContext; if (!A) return null; _ac = new A(); }
    if (_ac.state === "suspended") _ac.resume();
    return _ac;
  } catch(_){ return null; }
}
function beep(freq, type, dur, vol) {
  try {
    const ctx = getCtx(); if (!ctx) return;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.type = type||"square"; o.frequency.setValueAtTime(freq||440, ctx.currentTime);
    g.gain.setValueAtTime(vol||0.06, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime+(dur||0.08));
    o.start(); o.stop(ctx.currentTime+(dur||0.08));
  } catch(_){}
}
const sfxClick  = () => beep(600,"square",0.04,0.03);
const sfxSelect = () => { beep(440,"sine",0.08,0.07); setTimeout(()=>beep(660,"sine",0.12,0.05),80); };
const sfxWhoosh = () => [150,250,400].forEach((f,i)=>setTimeout(()=>beep(f,"sine",0.1,0.04),i*50));
const sfxImpact = () => { beep(60,"sawtooth",0.18,0.08); setTimeout(()=>beep(100,"square",0.1,0.04),60); };
const sfxChime  = () => [440,554,659,880].forEach((f,i)=>setTimeout(()=>beep(f,"sine",0.3,0.08),i*100));
const sfxBoot   = () => [110,165,220,165,330].forEach((f,i)=>setTimeout(()=>beep(f,"sine",0.14,0.06),i*130));

/* ─── useIsMobile ─── */
function useIsMobile() {
  const [mob, setMob] = useState(false);
  useEffect(() => {
    const check = () => setMob(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return mob;
}

/* ─── useSwipe ─── */
function useSwipe(onLeft, onRight) {
  const startX = useRef(null);
  const startY = useRef(null);
  return {
    onTouchStart: (e) => { startX.current = e.touches[0].clientX; startY.current = e.touches[0].clientY; },
    onTouchEnd: (e) => {
      if (startX.current === null) return;
      const dx = e.changedTouches[0].clientX - startX.current;
      const dy = e.changedTouches[0].clientY - startY.current;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
        if (dx < 0) onLeft(); else onRight();
      }
      startX.current = null; startY.current = null;
    },
  };
}

/* ─── Color palette: warm white + forest green ─── */
const C = {
  forest:  "#1c4a18",
  forestL: "#2d7227",
  pine:    "#3a6b35",
  bark:    "#7c5c3a",
  sage:    "#5d7558",
  danger:  "#b91c1c",
  bg:      "#f4f1eb",
  surface: "#ffffff",
  card:    "#edeae2",
  text:    "#1a2e17",
  muted:   "#6b7c65",
  wood:    "#22863a",
};

const V  = "'Share Tech Mono',monospace";
const VB = "'Noto Sans JP','Inter',sans-serif";

/* ─── Corners ─── */
function Corners({ color, size, t }) {
  const c = color||C.forest; const sz = size||24; const th = t||2;
  const s = {position:"absolute",width:sz,height:sz};
  const b = th+"px solid "+c;
  return <>
    <div style={{...s,top:0,left:0,borderTop:b,borderLeft:b}}/>
    <div style={{...s,top:0,right:0,borderTop:b,borderRight:b}}/>
    <div style={{...s,bottom:0,left:0,borderBottom:b,borderLeft:b}}/>
    <div style={{...s,bottom:0,right:0,borderBottom:b,borderRight:b}}/>
  </>;
}

/* ─── MiniDots ─── */
function MiniDots({ cur, total }) {
  return (
    <div style={{display:"flex",gap:4,alignItems:"center",flexWrap:"wrap",justifyContent:"center"}}>
      {Array.from({length:total}).map((_,i)=>(
        <div key={i} style={{
          width:i<cur?18:6,height:3,
          background:i<cur?C.forest:"rgba(28,74,24,0.15)",
          boxShadow:i<cur?"0 0 3px rgba(28,74,24,0.3)":"none",
          transition:"all .3s ease",borderRadius:2,
        }}/>
      ))}
    </div>
  );
}

/* ─── ForestBg: parchment + topographic contour lines ─── */
function ForestBg() {
  return (
    <div style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none",overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,background:"linear-gradient(160deg,#f9f7f1 0%,#f0ede4 55%,#e8e4d8 100%)"}}/>
      <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(ellipse 60% 40% at 8% 92%,rgba(28,74,24,0.05) 0%,transparent 60%),radial-gradient(ellipse 50% 50% at 92% 8%,rgba(45,114,39,0.03) 0%,transparent 60%)"}}/>
      <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:.07}} viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
        <g fill="none" stroke="#1c4a18">
          <path strokeWidth="1"   d="M-50,450 Q100,400 200,420 Q320,440 430,390 Q550,340 700,360 Q800,375 900,350"/>
          <path strokeWidth="0.8" d="M-50,380 Q80,330 180,355 Q310,380 420,320 Q540,260 680,290 Q780,310 900,280"/>
          <path strokeWidth="0.6" d="M-50,310 Q60,260 160,285 Q290,315 400,255 Q520,195 660,225 Q760,245 900,215"/>
          <path strokeWidth="0.5" d="M-50,240 Q50,195 140,215 Q260,245 380,185 Q500,125 640,155 Q740,175 900,145"/>
          <path strokeWidth="0.4" d="M-50,500 Q120,465 230,480 Q360,498 460,455 Q580,410 720,428 Q820,440 900,420"/>
          <line x1="0"   y1="0" x2="0"   y2="600" strokeWidth="0.3" opacity="0.5"/>
          <line x1="200" y1="0" x2="200" y2="600" strokeWidth="0.3" opacity="0.5"/>
          <line x1="400" y1="0" x2="400" y2="600" strokeWidth="0.3" opacity="0.5"/>
          <line x1="600" y1="0" x2="600" y2="600" strokeWidth="0.3" opacity="0.5"/>
          <line x1="800" y1="0" x2="800" y2="600" strokeWidth="0.3" opacity="0.5"/>
          <line x1="0" y1="150" x2="800" y2="150" strokeWidth="0.3" opacity="0.5"/>
          <line x1="0" y1="300" x2="800" y2="300" strokeWidth="0.3" opacity="0.5"/>
          <line x1="0" y1="450" x2="800" y2="450" strokeWidth="0.3" opacity="0.5"/>
        </g>
      </svg>
    </div>
  );
}

/* ─── Shell ─── */
function Shell({ children }) {
  return (
    <div style={{height:"100%",overflowY:"auto",overflowX:"hidden",WebkitOverflowScrolling:"touch",boxSizing:"border-box"}}>
      <div style={{minHeight:"100%",padding:"clamp(1.5rem,5vw,2rem) clamp(1.5rem,6vw,5vw)",display:"flex",flexDirection:"column",justifyContent:"center",boxSizing:"border-box"}}>
        {children}
      </div>
    </div>
  );
}

/* ─── Label ─── */
function Label({ children }) {
  return (
    <div style={{fontFamily:V,fontSize:"clamp(.62rem,2vw,.72rem)",color:"rgba(28,74,24,0.45)",letterSpacing:".22em",marginBottom:"clamp(.6rem,2vw,1rem)",borderLeft:"2px solid rgba(28,74,24,0.18)",paddingLeft:".6rem"}}>
      {children}
    </div>
  );
}

/* ─── WallCard ─── */
function WallCard({ num, title, detail, revealed, onReveal }) {
  return (
    <div onClick={onReveal} style={{border:"1px solid "+(revealed?"rgba(28,74,24,.3)":"rgba(28,74,24,.1)"),background:revealed?"rgba(28,74,24,.04)":C.surface,padding:"clamp(.9rem,3.5vw,1.25rem) clamp(1rem,4vw,1.5rem)",cursor:"pointer",position:"relative",transition:"all .3s",WebkitTapHighlightColor:"transparent",boxShadow:revealed?"none":"0 1px 4px rgba(28,74,24,.06)"}}>
      {revealed && <Corners color={C.forest} size={14} t={1.5}/>}
      <div style={{display:"flex",alignItems:"flex-start",gap:"clamp(.75rem,3vw,1.25rem)"}}>
        <div style={{fontFamily:V,fontSize:"clamp(.72rem,2.4vw,.82rem)",color:revealed?C.forest:C.sage,background:revealed?"rgba(28,74,24,.08)":"rgba(28,74,24,.04)",border:"1px solid "+(revealed?"rgba(28,74,24,.25)":"rgba(28,74,24,.1)"),width:"clamp(28px,8vw,36px)",height:"clamp(28px,8vw,36px)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .3s"}}>
          {String(num).padStart(2,"0")}
        </div>
        <div style={{flex:1}}>
          <div style={{fontFamily:VB,fontSize:"clamp(1rem,4vw,1.3rem)",color:revealed?C.text:C.sage,fontWeight:600,lineHeight:1.3,transition:"color .3s"}}>{title}</div>
          {revealed && <div style={{fontFamily:VB,fontSize:"clamp(.82rem,3vw,.95rem)",color:C.muted,lineHeight:1.75,marginTop:".5rem",animation:"fadeIn .4s ease"}}>{detail}</div>}
        </div>
        <div style={{fontFamily:V,fontSize:".72rem",color:"rgba(28,74,24,.22)",flexShrink:0,transition:"transform .3s",transform:revealed?"rotate(90deg)":"none"}}>▶</div>
      </div>
    </div>
  );
}

/* ─── AccordionRow ─── */
function AccordionRow({ icon, title, sub, detail, benefit, color, open, onToggle }) {
  const c = color||C.forest;
  return (
    <div>
      <button onClick={()=>{sfxSelect();onToggle();}} style={{width:"100%",textAlign:"left",background:open?"rgba(28,74,24,.05)":C.surface,border:"1px solid "+(open?"rgba(28,74,24,.28)":"rgba(28,74,24,.1)"),padding:"clamp(.8rem,3vw,1.1rem) clamp(.9rem,3.5vw,1.3rem)",display:"flex",alignItems:"center",gap:"clamp(.6rem,2vw,1rem)",cursor:"pointer",transition:"all .2s",WebkitTapHighlightColor:"transparent",boxShadow:open?"none":"0 1px 3px rgba(28,74,24,.05)"}}>
        <div style={{fontSize:"clamp(1.1rem,4vw,1.4rem)",flexShrink:0}}>{icon}</div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontFamily:VB,fontSize:"clamp(1rem,3.8vw,1.25rem)",color:open?c:C.text,fontWeight:600,lineHeight:1.2}}>{title}</div>
          {sub && <div style={{fontFamily:V,fontSize:"clamp(.62rem,2vw,.72rem)",color:C.sage,marginTop:".2rem"}}>{sub}</div>}
        </div>
        <div style={{fontFamily:V,color:open?c:"rgba(28,74,24,.28)",fontSize:".85rem",flexShrink:0,transition:"transform .2s",transform:open?"rotate(90deg)":"none"}}>▶</div>
      </button>
      {open && (
        <div style={{padding:"clamp(.9rem,3.5vw,1.25rem) clamp(1rem,4vw,1.5rem)",borderLeft:"3px solid "+c,borderRight:"1px solid rgba(28,74,24,.1)",borderBottom:"1px solid rgba(28,74,24,.1)",background:"rgba(28,74,24,.03)",animation:"fadeIn .25s ease"}}>
          {detail && <div style={{fontFamily:VB,fontSize:"clamp(.85rem,3.2vw,1rem)",color:C.muted,lineHeight:1.85,marginBottom:".75rem"}}>{detail}</div>}
          {benefit && (
            <div style={{display:"flex",alignItems:"flex-start",gap:".6rem",padding:".65rem .9rem",background:"rgba(28,74,24,.06)",border:"1px solid rgba(28,74,24,.15)"}}>
              <span style={{color:c,fontFamily:V,flexShrink:0,marginTop:".1rem"}}>✓</span>
              <div style={{fontFamily:VB,fontSize:"clamp(.85rem,3.2vw,1rem)",color:C.forest,lineHeight:1.6,fontWeight:500}}>{benefit}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── CheckItem ─── */
function CheckItem({ id, label, sub, checked, onChange }) {
  return (
    <div onClick={()=>{sfxSelect();onChange(id);}} style={{display:"flex",alignItems:"flex-start",gap:"clamp(.75rem,3vw,1rem)",padding:"clamp(.85rem,3.5vw,1.1rem) clamp(.9rem,3.5vw,1.25rem)",border:"1px solid "+(checked?"rgba(28,74,24,.28)":"rgba(28,74,24,.1)"),background:checked?"rgba(28,74,24,.05)":C.surface,cursor:"pointer",transition:"all .2s",WebkitTapHighlightColor:"transparent",boxShadow:checked?"none":"0 1px 3px rgba(28,74,24,.04)"}}>
      <div style={{width:"clamp(18px,5vw,22px)",height:"clamp(18px,5vw,22px)",border:"1.5px solid "+(checked?C.forest:"rgba(28,74,24,.22)"),background:checked?C.forest:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:"clamp(.1rem,.5vw,.15rem)",transition:"all .2s"}}>
        {checked && <span style={{color:"#fff",fontSize:"clamp(.6rem,2vw,.75rem)",fontWeight:800}}>✓</span>}
      </div>
      <div style={{flex:1}}>
        <div style={{fontFamily:VB,fontSize:"clamp(.9rem,3.5vw,1.1rem)",color:checked?C.text:C.sage,fontWeight:checked?600:400,lineHeight:1.3,transition:"color .2s"}}>{label}</div>
        {sub && <div style={{fontFamily:VB,fontSize:"clamp(.75rem,2.8vw,.85rem)",color:"rgba(93,117,88,.42)",marginTop:".2rem"}}>{sub}</div>}
      </div>
    </div>
  );
}

/* ─── SlopeSVG: light/forest theme ─── */
function SlopeSVG() {
  return (
    <svg viewBox="0 0 320 160" style={{width:"100%",maxWidth:480,height:"auto",display:"block",margin:"0 auto"}} aria-label="無足場アンカー工法 概念図">
      <defs>
        <linearGradient id="skyG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#cfe8d4"/><stop offset="100%" stopColor="#e4f2e6"/>
        </linearGradient>
        <linearGradient id="groundG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5a8a4a"/><stop offset="100%" stopColor="#3d6633"/>
        </linearGradient>
      </defs>
      <rect width="320" height="160" fill="url(#skyG)"/>
      {[20,38,55,70,270,285,300,312].map((x,i)=>(
        <polygon key={i} points={`${x},${75+i%3*4} ${x-7},${95+i%2*3} ${x+7},${95+i%2*3}`} fill="rgba(45,82,38,.2)"/>
      ))}
      <polygon points="0,160 320,160 320,60 60,160" fill="url(#groundG)" opacity="0.95"/>
      <line x1="60" y1="160" x2="320" y2="60" stroke="rgba(45,82,38,.4)" strokeWidth="1.5"/>
      {[0,1,2,3].map(i=>(<line key={i} x1={90+i*50} y1={158} x2={90+i*50} y2={142} stroke="rgba(255,255,255,.18)" strokeWidth="0.6"/>))}
      {[{x:120,y:138,a:-35},{x:175,y:118,a:-38},{x:230,y:98,a:-40},{x:285,y:78,a:-38}].map((a,i)=>(
        <g key={i} transform={`rotate(${a.a},${a.x},${a.y})`}>
          <line x1={a.x} y1={a.y} x2={a.x} y2={a.y+32} stroke="#7c5c3a" strokeWidth="2.5"/>
          <rect x={a.x-4} y={a.y-2} width="8" height="6" fill="#5c3d1c" opacity="0.9"/>
          <polygon points={`${a.x-4},${a.y+32} ${a.x+4},${a.y+32} ${a.x},${a.y+38}`} fill="#7c5c3a" opacity="0.8"/>
        </g>
      ))}
      <line x1="42" y1="12" x2="120" y2="138" stroke="#1c4a18" strokeWidth="1.8" strokeDasharray="5,2.5" opacity="0.7"/>
      <circle cx="42" cy="12" r="5" fill="#1c4a18" opacity="0.85"/>
      <circle cx="42" cy="12" r="2.5" fill="#ffffff" opacity="0.5"/>
      <rect x="145" y="108" width="28" height="18" rx="2" fill="#f4f1eb" stroke="#1c4a18" strokeWidth="1.2"/>
      <rect x="151" y="104" width="16" height="8" rx="1" fill="#d4e8d0"/>
      <circle cx="149" cy="128" r="3" fill="#7c5c3a"/>
      <circle cx="169" cy="128" r="3" fill="#7c5c3a"/>
      <rect x="6" y="18" width="44" height="50" rx="2" fill="rgba(185,28,28,.05)" stroke="rgba(185,28,28,.28)" strokeWidth="1"/>
      <text x="28" y="36" textAnchor="middle" fontSize="8" fill="rgba(185,28,28,.55)" fontFamily="monospace">足場</text>
      <line x1="8" y1="20" x2="48" y2="66" stroke="#b91c1c" strokeWidth="1.5" opacity="0.5"/>
      <line x1="48" y1="20" x2="8" y2="66" stroke="#b91c1c" strokeWidth="1.5" opacity="0.5"/>
      <text x="38" y="9"   textAnchor="middle" fontSize="7" fill="#1c4a18" fontFamily="monospace" fontWeight="bold">固定点</text>
      <text x="186" y="103" textAnchor="middle" fontSize="7" fill="#1c4a18" fontFamily="monospace">施工機</text>
      <text x="262" y="74" textAnchor="middle" fontSize="7" fill="#7c5c3a" fontFamily="monospace">アンカー</text>
      <text x="28" y="78"  textAnchor="middle" fontSize="7" fill="rgba(185,28,28,.7)" fontFamily="monospace">不要</text>
    </svg>
  );
}

/* ─── ImageSlot ─── */
function ImageSlot({ label, aspectRatio }) {
  return (
    <div style={{width:"100%",paddingTop:aspectRatio||"56.25%",position:"relative",border:"1px dashed rgba(28,74,24,.2)",background:"rgba(28,74,24,.03)",overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:".4rem"}}>
        <div style={{fontFamily:V,fontSize:"clamp(.6rem,2vw,.7rem)",color:"rgba(28,74,24,.33)",letterSpacing:".15em"}}>
          📷 {label||"施工写真"}
        </div>
        <div style={{fontFamily:V,fontSize:"clamp(.5rem,1.8vw,.6rem)",color:"rgba(93,117,88,.28)"}}>── 画像を挿入 ──</div>
      </div>
    </div>
  );
}

/* ═══════════════════ SLIDES ═══════════════════ */

function S0_Boot() {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    sfxBoot();
    const t1=setTimeout(()=>setPhase(1),700);
    const t2=setTimeout(()=>setPhase(2),1800);
    const t3=setTimeout(()=>setPhase(3),3000);
    return()=>{clearTimeout(t1);clearTimeout(t2);clearTimeout(t3);};
  },[]);
  return (
    <Shell>
      <div style={{textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:"clamp(1.5rem,5vw,2.5rem)"}}>
        <div style={{opacity:phase>=1?0.55:0,transition:"opacity .8s",display:"flex",gap:3,alignItems:"flex-end",marginBottom:"-1rem"}}>
          {[16,22,28,34,28,22,16].map((h,i)=>(
            <div key={i} style={{width:3,height:h,background:"linear-gradient(to top,#3a6b35,#5a9a50)",borderRadius:"2px 2px 0 0"}}/>
          ))}
        </div>
        <div style={{fontFamily:V,fontSize:"clamp(.78rem,2.8vw,.9rem)",color:"rgba(28,74,24,.4)",letterSpacing:".3em",opacity:phase>=1?1:0,transition:"opacity .6s"}}>
          VISTA ANCHOR SYSTEM
        </div>
        <div style={{fontFamily:VB,fontSize:"clamp(1.9rem,7.5vw,4.5rem)",color:C.text,fontWeight:700,lineHeight:1.15,opacity:phase>=2?1:0,transition:"opacity .8s,transform .8s",transform:phase>=2?"translateY(0)":"translateY(14px)"}}>
          現場に入れない場所、<br/><span style={{color:C.forest}}>ありませんか？</span>
        </div>
        {phase>=3 && (
          <div style={{fontFamily:VB,color:"rgba(93,117,88,.5)",fontSize:"clamp(.75rem,3vw,.85rem)",letterSpacing:".06em",display:"flex",alignItems:"center",gap:".75rem",animation:"fadeIn .8s ease"}}>
            <span style={{animation:"blink 1.5s step-end infinite",color:C.forest}}>▶</span>
            スワイプ または NEXT をタップ
          </div>
        )}
      </div>
    </Shell>
  );
}

function S1_Pain() {
  const [revealed,setRevealed]=useState({});
  const toggle=(i)=>{sfxSelect();setRevealed(p=>({...p,[i]:!p[i]}));};
  const walls=[
    {title:"足場前提だと、選べる工法が一気に減る",       detail:"設置・解体に数週間 & 数百万円。工法の難易度が上がるほど足場代が膨らみ、利益率が見えにくくなる。"},
    {title:"クレーンが届かない現場は諦める", detail:"山間部・急斜面・狭小地。重機が入れなければ施工不可。「対応できない」という判断が入札機会を逃す。"},
    {title:"足場解体まで次工程が動かない",  detail:"並行作業ができないため全体工期が伸びる。災害復旧の緊急現場では、この「待ち時間」が最大のリスクになる。"},
  ];
  return (
    <Shell>
      <Label>PAIN ── 現場が抱える3つの制約</Label>
      <div style={{fontFamily:VB,fontSize:"clamp(1.3rem,5.5vw,2.2rem)",color:C.text,fontWeight:700,lineHeight:1.3,marginBottom:"clamp(1rem,4vw,1.75rem)"}}>
        足場が変えられない、<br/><span style={{color:C.danger}}>3つの壁。</span>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:"clamp(.4rem,1.5vw,.6rem)"}}>
        {walls.map((w,i)=><WallCard key={i} num={i+1} title={w.title} detail={w.detail} revealed={!!revealed[i]} onReveal={()=>toggle(i)}/>)}
      </div>
      <div style={{fontFamily:V,fontSize:"clamp(.6rem,2vw,.7rem)",color:"rgba(93,117,88,.28)",marginTop:"1rem",letterSpacing:".1em"}}>
        ▸ 各項目をタップして展開
      </div>
    </Shell>
  );
}

function S2_Solution() {
  return (
    <Shell>
      <Label>SOLUTION ── 足場を"消す"特許工法</Label>
      <div style={{fontFamily:VB,fontSize:"clamp(1.5rem,6vw,3rem)",color:C.text,fontWeight:700,lineHeight:1.25,marginBottom:"clamp(1rem,4vw,1.5rem)"}}>
        ワイヤーで機械を<br/>斜面に固定する。<br/><span style={{color:C.forest}}>それだけで、足場がいらない。</span>
      </div>
      <div style={{border:"1px solid rgba(28,74,24,.15)",background:C.surface,padding:"clamp(.75rem,3vw,1rem)",marginBottom:"clamp(.75rem,3vw,1.25rem)",position:"relative",boxShadow:"0 2px 8px rgba(28,74,24,.07)"}}>
        <Corners color={C.forest} size={16} t={1}/>
        <SlopeSVG/>
        <div style={{fontFamily:V,fontSize:"clamp(.52rem,1.6vw,.62rem)",color:"rgba(28,74,24,.28)",textAlign:"right",marginTop:".4rem",letterSpacing:".08em"}}>
          CONCEPT DIAGRAM // 無足場アンカー工法
        </div>
      </div>
      <div style={{display:"flex",gap:"clamp(.4rem,1.5vw,.6rem)",flexWrap:"wrap"}}>
        {[{label:"特許工法",color:C.forest},{label:"グランドアンカー工 対応",color:C.bark},{label:"鉄筋挿入工 対応",color:C.bark}].map(b=>(
          <div key={b.label} style={{fontFamily:V,fontSize:"clamp(.62rem,2vw,.72rem)",color:b.color,border:"1px solid "+b.color+"55",background:b.color+"0c",padding:".35rem .75rem",letterSpacing:".08em"}}>
            {b.label}
          </div>
        ))}
      </div>
    </Shell>
  );
}

function S3_Position() {
  const [step,setStep]=useState(0);
  const [answers,setAnswers]=useState([]);
  const [result,setResult]=useState(null);
  const questions=[
    {id:"q1",q:"足場は物理的に組めますか？",         hint:"隣接地の制約、地形、搬入路など",          yes:{next:2,      label:"組める"},           no:{next:"flow", label:"組めない"}},
    {id:"q2",q:"隣地越境・景観・交通規制の問題は？",  hint:"条例エリア、通行止め不可、景観配慮など",   yes:{next:"flow", label:"問題あり"},           no:{next:3,      label:"問題なし"}},
    {id:"q3",q:"工期制約は厳しいですか？",           hint:"災害復旧・入札条件・並行工程など",          yes:{next:"flow", label:"厳しい"},             no:{next:4,      label:"余裕あり"}},
    {id:"q4",q:"削孔径・深度・アンカー種類の条件は？",hint:"大口径、深アンカー、脆い地盤など",          yes:{next:"vista",label:"SD工法では難しい"},   no:{next:"sd",   label:"SD工法で対応可能"}},
  ];
  const curQ=step>=1&&step<=4?questions[step-1]:null;
  const handle=(ans,next)=>{sfxSelect();setAnswers(p=>[...p,ans]);if(["flow","vista","sd"].includes(next)){setStep(5);setResult(next);}else setStep(next);};
  const reset=()=>{sfxClick();setStep(0);setAnswers([]);setResult(null);};
  const stepLabels=["足場","制約","工期","削孔"];
  const done=answers.length;
  const RC={
    flow: {color:C.forest, title:"→ 無足場系へ",              body:"足場は必然的に選外です。SD工法か、ビスタの無足場アンカー工法かを次に判断します。"},
    sd:   {color:C.bark,   title:"SD工法が適用範囲",           body:"比較的シンプルな削孔条件であればSD工法が選択肢に入ります。ただし大型・深層アンカーはSD工法の守備範囲外です。"},
    vista:{color:C.forest, title:"ビスタの無足場アンカー工法", body:"SD工法では対応できない削孔条件こそ、ビスタの出番です。グランドアンカー工・鉄筋挿入工をフルスペックでカバーします。"},
  };
  return (
    <Shell>
      <Label>POSITION ── どの工法を使うべきか、一緒に確認します</Label>
      <div style={{fontFamily:VB,fontSize:"clamp(.82rem,3vw,.95rem)",color:"rgba(93,117,88,.55)",lineHeight:1.75,marginBottom:"clamp(.6rem,2vw,.9rem)",borderLeft:"2px solid rgba(28,74,24,.1)",paddingLeft:".75rem"}}>
        ※ 今日は「どの工法が正しいか」を決める場ではなく、<br/>どこで判断が分かれるかを整理するだけです。
      </div>
      {step>0&&step<5&&(
        <div style={{display:"flex",gap:".4rem",marginBottom:"clamp(.75rem,3vw,1.25rem)",animation:"fadeIn .3s ease",flexWrap:"wrap"}}>
          {stepLabels.map((l,i)=>(
            <div key={i} style={{fontFamily:V,fontSize:"clamp(.6rem,2vw,.7rem)",padding:".25rem .5rem",border:"1px solid "+(i<done?"rgba(28,74,24,.4)":i===done?"rgba(28,74,24,.22)":"rgba(93,117,88,.15)"),color:i<done?C.forest:i===done?"rgba(28,74,24,.55)":"rgba(93,117,88,.3)",background:i<done?"rgba(28,74,24,.07)":"transparent",letterSpacing:".1em"}}>
              {i<done?"✓ ":i===done?"▶ ":""}{l}
            </div>
          ))}
        </div>
      )}
      {step===0&&(
        <div style={{animation:"fadeIn .4s ease"}}>
          <div style={{fontFamily:VB,fontSize:"clamp(1.2rem,5vw,2rem)",color:C.text,fontWeight:700,lineHeight:1.35,marginBottom:"clamp(1rem,4vw,1.5rem)"}}>
            「なぜ無足場なのか」を<br/><span style={{color:C.forest}}>一緒に確認します。</span>
          </div>
          <div style={{border:"1px solid rgba(28,74,24,.12)",background:C.surface,padding:"clamp(.85rem,3.5vw,1.2rem)",marginBottom:"clamp(.75rem,3vw,1.25rem)",boxShadow:"0 1px 6px rgba(28,74,24,.06)"}}>
            <div style={{fontFamily:V,fontSize:"clamp(.6rem,2vw,.7rem)",color:"rgba(28,74,24,.38)",letterSpacing:".15em",marginBottom:".75rem"}}>工法選択ツリー</div>
            {[
              {indent:0,icon:"📋",text:"足場が組める？",                               color:"rgba(93,117,88,.65)"},
              {indent:1,icon:"✔", text:"YES → 足場工法（通常）",                        color:"rgba(93,117,88,.5)"},
              {indent:1,icon:"✖", text:"NO  → 無足場系へ",                              color:C.forest},
              {indent:2,icon:"▸", text:"SD工法",                                          color:C.bark},
              {indent:2,icon:"▸", text:"無足場アンカー（ビスタ）← 条件次第でここ",       color:C.forest},
            ].map((row,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:".5rem",paddingLeft:row.indent*20,paddingTop:".25rem",paddingBottom:".25rem",borderLeft:row.indent>0?"1px dashed rgba(28,74,24,.1)":"none",marginLeft:row.indent>0?10:0}}>
                <span style={{fontFamily:V,fontSize:"clamp(.65rem,2vw,.75rem)",color:row.color,flexShrink:0}}>{row.icon}</span>
                <span style={{fontFamily:V,fontSize:"clamp(.65rem,2vw,.75rem)",color:row.color,lineHeight:1.5}}>{row.text}</span>
              </div>
            ))}
          </div>
          <button onClick={()=>{sfxSelect();setStep(1);}} style={{width:"100%",border:"1px solid rgba(28,74,24,.28)",background:"rgba(28,74,24,.06)",color:C.forest,fontFamily:V,fontSize:"clamp(.85rem,3.2vw,1rem)",padding:"clamp(.85rem,3.5vw,1.1rem)",cursor:"pointer",letterSpacing:".1em",WebkitTapHighlightColor:"transparent",transition:"all .2s"}}>
            ▶ 判定スタート（4問）
          </button>
        </div>
      )}
      {curQ&&(
        <div key={step} style={{animation:"fadeIn .35s ease"}}>
          <div style={{fontFamily:V,fontSize:"clamp(.6rem,2vw,.7rem)",color:"rgba(28,74,24,.33)",letterSpacing:".15em",marginBottom:".6rem"}}>Q{step} / 4</div>
          <div style={{fontFamily:VB,fontSize:"clamp(1.2rem,5vw,1.8rem)",color:C.text,fontWeight:700,lineHeight:1.4,marginBottom:"clamp(.4rem,1.5vw,.6rem)"}}>{curQ.q}</div>
          <div style={{fontFamily:VB,fontSize:"clamp(.78rem,3vw,.9rem)",color:"rgba(93,117,88,.52)",marginBottom:"clamp(1.25rem,5vw,2rem)"}}>{curQ.hint}</div>
          <div style={{display:"flex",flexDirection:"column",gap:"clamp(.5rem,2vw,.75rem)"}}>
            <button onClick={()=>handle("yes",curQ.yes.next)} style={{border:"1px solid rgba(28,74,24,.28)",background:"rgba(28,74,24,.06)",color:C.forest,fontFamily:VB,fontSize:"clamp(1rem,4vw,1.3rem)",fontWeight:600,padding:"clamp(.9rem,4vw,1.25rem) clamp(1rem,4vw,1.5rem)",cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",justifyContent:"space-between",WebkitTapHighlightColor:"transparent",transition:"all .2s"}}>
              <span>{curQ.yes.label}</span><span style={{fontFamily:V,fontSize:".9rem",opacity:.45}}>▶</span>
            </button>
            <button onClick={()=>handle("no",curQ.no.next)} style={{border:"1px solid rgba(93,117,88,.2)",background:C.surface,color:C.sage,fontFamily:VB,fontSize:"clamp(1rem,4vw,1.3rem)",fontWeight:500,padding:"clamp(.9rem,4vw,1.25rem) clamp(1rem,4vw,1.5rem)",cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",justifyContent:"space-between",WebkitTapHighlightColor:"transparent",transition:"all .2s"}}>
              <span>{curQ.no.label}</span><span style={{fontFamily:V,fontSize:".9rem",opacity:.28}}>▶</span>
            </button>
          </div>
        </div>
      )}
      {step===5&&result&&(
        <div key="result" style={{animation:"fadeIn .4s ease"}}>
          <div style={{display:"flex",gap:".35rem",flexWrap:"wrap",marginBottom:"clamp(.75rem,3vw,1.25rem)"}}>
            {answers.map((a,i)=>(
              <div key={i} style={{fontFamily:V,fontSize:"clamp(.58rem,1.8vw,.68rem)",color:C.sage,border:"1px solid rgba(93,117,88,.2)",padding:".2rem .45rem",letterSpacing:".06em"}}>
                Q{i+1}: {a==="yes"?questions[i].yes.label:questions[i].no.label}
              </div>
            ))}
          </div>
          <div style={{border:"2px solid "+RC[result].color,background:"rgba(28,74,24,.04)",padding:"clamp(1.1rem,4.5vw,1.75rem) clamp(1.1rem,4.5vw,1.5rem)",position:"relative",marginBottom:"clamp(.75rem,3vw,1.25rem)",boxShadow:"0 2px 12px rgba(28,74,24,.08)"}}>
            <Corners color={RC[result].color} size={20} t={2}/>
            <div style={{fontFamily:V,fontSize:"clamp(.62rem,2vw,.72rem)",color:RC[result].color+"90",letterSpacing:".15em",marginBottom:".6rem"}}>RESULT</div>
            <div style={{fontFamily:VB,fontSize:"clamp(1.2rem,5vw,1.8rem)",color:RC[result].color,fontWeight:700,lineHeight:1.3,marginBottom:".75rem"}}>{RC[result].title}</div>
            <div style={{fontFamily:VB,fontSize:"clamp(.85rem,3.2vw,1rem)",color:C.muted,lineHeight:1.85}}>{RC[result].body}</div>
          </div>
          <div style={{border:"1px solid rgba(93,117,88,.15)",background:C.surface,padding:"clamp(.75rem,3vw,1rem)",boxShadow:"0 1px 4px rgba(28,74,24,.04)"}}>
            <div style={{fontFamily:V,fontSize:"clamp(.6rem,2vw,.7rem)",color:"rgba(93,117,88,.38)",letterSpacing:".15em",marginBottom:".6rem"}}>SD工法 vs 無足場アンカー（ビスタ）── 本質の差</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:".5rem"}}>
              {[
                {label:"SD工法",      color:C.bark,   pts:["ワイヤー緊張で機械固定","対応削孔径・深度に制限","比較的シンプルな現場向け"]},
                {label:"ビスタ 無足場",color:C.forest, pts:["機械も人も動いて施工","グランドアンカーまで対応","脆弱地盤・深層・大径OK"]},
              ].map(col=>(
                <div key={col.label} style={{border:"1px solid "+col.color+"22",background:col.color+"06",padding:".65rem"}}>
                  <div style={{fontFamily:V,fontSize:"clamp(.62rem,2vw,.72rem)",color:col.color,letterSpacing:".08em",marginBottom:".45rem"}}>{col.label}</div>
                  {col.pts.map((p,j)=>(
                    <div key={j} style={{display:"flex",alignItems:"flex-start",gap:".35rem",marginBottom:".25rem"}}>
                      <span style={{color:col.color,fontFamily:V,fontSize:".65rem",flexShrink:0,marginTop:".1rem"}}>▸</span>
                      <span style={{fontFamily:VB,fontSize:"clamp(.72rem,2.5vw,.82rem)",color:C.muted,lineHeight:1.5}}>{p}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <button onClick={reset} style={{marginTop:".85rem",width:"100%",border:"1px solid rgba(93,117,88,.18)",background:"transparent",color:"rgba(93,117,88,.4)",fontFamily:V,fontSize:"clamp(.65rem,2.2vw,.75rem)",padding:".5rem",cursor:"pointer",letterSpacing:".1em",WebkitTapHighlightColor:"transparent"}}>
            ↺ やり直す
          </button>
        </div>
      )}
    </Shell>
  );
}

function S4_Strength() {
  const [open,setOpen]=useState(null);
  const items=[
    {icon:"🏔",title:"山奥でも入れる",       sub:"HIGH ACCESS // 高所・狭小地・山間部",  color:C.forest,detail:"コンパクトな機械はモノレール・簡易索道で山奥まで搬入可能。クレーンが届かない急斜面も施工範囲に入ります。",benefit:"「対応不可」だった現場を受注できる。入札競合が減る現場で圧倒的に有利。"},
    {icon:"⚙", title:"崩れる地盤でも掘れる",  sub:"DUAL TUBE // 完全二重管削孔",        color:C.bark,  detail:"ロータリーパーカッション同等の完全二重管施工（外管で崩壊を防ぎながら内側で削孔）。軽量機械でも精度は妥協しない。",benefit:"どんなに脆い地盤でも施工可能。「技術的に無理」という現場がなくなる。"},
    {icon:"🌲",title:"木を切らずに施工できる",sub:"ECO CONSTRUCTION // 樹間施工",      color:C.wood,  detail:"木々の隙間を縫って作業する「樹間施工」により、伐採費用ゼロ。環境保護が厳しい現場や景観条例エリアでも対応。",benefit:"SDGs・環境配慮が評価基準に入っている入札で加点要素になる。"},
  ];
  return (
    <Shell>
      <Label>STRENGTH ── 他社ができない現場を、できる理由</Label>
      <div style={{fontFamily:VB,fontSize:"clamp(1.2rem,5vw,2rem)",color:C.text,fontWeight:700,lineHeight:1.3,marginBottom:"clamp(1rem,4vw,1.5rem)"}}>
        <span style={{color:C.forest}}>3つの技術優位</span>が<br/>選ばれる理由です。
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:"clamp(.4rem,1.5vw,.6rem)"}}>
        {items.map((it,i)=><AccordionRow key={i} {...it} open={open===i} onToggle={()=>setOpen(open===i?null:i)}/>)}
      </div>
    </Shell>
  );
}

function S5_Proof() {
  const records=[
    {tag:"災害復旧",color:C.danger, title:"熊本県震災復興工事",    body:"震災直後の緊急現場。重機が入れない急斜面でも即日着工。足場レスの機動力が発揮された代表案件。"},
    {tag:"広域復旧",color:C.forest, title:"東日本大震災 復興工事", body:"大規模・長期の復興事業に参画。稼働率・安全性・品質の三要素を評価され継続受注。"},
    {tag:"継続実績",color:C.bark,   title:"全国 豪雨災害復旧工事", body:"近年多発する豪雨による法面崩壊現場へ複数回対応。緊急性と難易度が高い現場での採用が続く。"},
  ];
  return (
    <Shell>
      <Label>PROOF ── 緊急・難現場で選ばれた実績</Label>
      <div style={{fontFamily:VB,fontSize:"clamp(1.2rem,5vw,2rem)",color:C.text,fontWeight:700,lineHeight:1.3,marginBottom:"clamp(1rem,4vw,1.5rem)"}}>
        「他社が手を挙げない現場」で<br/><span style={{color:C.forest}}>呼ばれます。</span>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:"clamp(.5rem,2vw,.75rem)"}}>
        {records.map((r,i)=>(
          <div key={i} style={{border:"1px solid "+r.color+"25",background:C.surface,padding:"clamp(.85rem,3.5vw,1.15rem) clamp(1rem,4vw,1.4rem)",boxShadow:"0 1px 5px rgba(28,74,24,.05)"}}>
            <div style={{display:"flex",alignItems:"center",gap:".6rem",marginBottom:".5rem"}}>
              <div style={{fontFamily:V,fontSize:"clamp(.6rem,2vw,.7rem)",color:r.color,border:"1px solid "+r.color+"45",padding:".2rem .5rem",letterSpacing:".08em"}}>{r.tag}</div>
            </div>
            <div style={{fontFamily:VB,fontSize:"clamp(1rem,3.8vw,1.2rem)",color:C.text,fontWeight:600,lineHeight:1.3,marginBottom:".4rem"}}>{r.title}</div>
            <div style={{fontFamily:VB,fontSize:"clamp(.8rem,3vw,.95rem)",color:C.muted,lineHeight:1.75}}>{r.body}</div>
            <div style={{marginTop:".75rem"}}><ImageSlot label={r.title+" 現場写真"} aspectRatio="40%"/></div>
          </div>
        ))}
      </div>
    </Shell>
  );
}

function S6_FAQ() {
  const [open,setOpen]=useState(null);
  const faqs=[
    {q:"SD工法と何が違うの？",        a:"最大の違いは「グランドアンカー工まで対応できる」こと。SD工法はアンカー規模に制約がありますが、ビスタの工法はワイヤー緊張方式の独自設計により、より大型アンカーまで対応可能です。機動力とパワーを両立しています。"},
    {q:"軽い機械で二重管削孔、本当にできる？",a:"できます。ロータリーパーカッションと同等の方式で、外管（ケーシング）が崩壊を防ぎながら内側で掘り進む完全二重管施工に対応。軽量・コンパクトでも精度は落ちません。"},
    {q:"足場がない方が安全面が不安では？",a:"実は逆です。足場の設置・解体作業こそが高所作業事故の主因。ビスタの工法はその工程をなくし、ワイヤーで機械を二重三重に固定するため、安全性は従来工法を上回ります。"},
  ];
  return (
    <Shell>
      <Label>FAQ ── よく聞かれること、先にお答えします</Label>
      <div style={{fontFamily:VB,fontSize:"clamp(1.1rem,4.5vw,1.7rem)",color:C.text,fontWeight:700,lineHeight:1.35,marginBottom:"clamp(1rem,4vw,1.5rem)"}}>
        懸念は全部、<br/><span style={{color:C.forest}}>想定済みです。</span>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:"clamp(.4rem,1.5vw,.6rem)"}}>
        {faqs.map((f,i)=>(
          <div key={i}>
            <button onClick={()=>{sfxSelect();setOpen(open===i?null:i);}} style={{width:"100%",textAlign:"left",cursor:"pointer",background:open===i?"rgba(28,74,24,.05)":C.surface,border:"1px solid "+(open===i?"rgba(28,74,24,.28)":"rgba(28,74,24,.1)"),padding:"clamp(.85rem,3.5vw,1.1rem) clamp(1rem,4vw,1.3rem)",WebkitTapHighlightColor:"transparent",transition:"all .2s",boxShadow:open===i?"none":"0 1px 3px rgba(28,74,24,.04)"}}>
              <div style={{display:"flex",alignItems:"center",gap:".75rem"}}>
                <span style={{fontFamily:V,fontSize:"clamp(.7rem,2.5vw,.8rem)",color:C.forest,flexShrink:0,fontWeight:700}}>Q.</span>
                <span style={{fontFamily:VB,fontSize:"clamp(.9rem,3.5vw,1.1rem)",color:open===i?C.text:C.muted,flex:1,lineHeight:1.4}}>{f.q}</span>
                <span style={{fontFamily:V,color:"rgba(28,74,24,.28)",fontSize:".8rem",flexShrink:0,transition:"transform .2s",transform:open===i?"rotate(90deg)":"none"}}>▶</span>
              </div>
            </button>
            {open===i&&(
              <div style={{padding:"clamp(.85rem,3.5vw,1.1rem) clamp(1rem,4vw,1.3rem)",borderLeft:"3px solid "+C.forest,borderRight:"1px solid rgba(28,74,24,.1)",borderBottom:"1px solid rgba(28,74,24,.1)",background:"rgba(28,74,24,.03)",animation:"fadeIn .25s ease"}}>
                <div style={{fontFamily:VB,fontSize:"clamp(.85rem,3.2vw,1rem)",color:C.muted,lineHeight:1.85}}>
                  <span style={{color:C.forest,fontFamily:V,fontSize:"clamp(.65rem,2vw,.75rem)",marginRight:".5rem",fontWeight:700}}>A.</span>{f.a}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Shell>
  );
}

function S7_Scope() {
  const [open,setOpen]=useState(null);
  const services=[
    {id:"anchor",icon:"⚓",title:"無足場アンカー工法",  sub:"SLOPE ANCHOR // 法面安定・地すべり抑止",    color:C.forest,detail:"グランドアンカー工・鉄筋挿入工。足場不要のワイヤー緊張方式（特許）により、急斜面・山間部・崩れやすい地盤でも安全・迅速に施工。",benefit:"他社が断る現場こそ、ビスタの出番。緊急対応・難工事に対応します。",images:["無足場工法 施工写真①","無足場工法 施工写真②"]},
    {id:"wood",  icon:"🌲",title:"木製構造物工法",      sub:"WOOD STRUCTURE // ガードレール・ウッド筋工",color:C.wood, detail:"木製ガードレール「木景（こかげ）」・木製ガードフェンス・ウッド筋工。性能確認試験に合格した安全性と、景観・環境に配慮した素材を両立。",benefit:"SDGs・景観条例エリアの案件、地域材活用のニーズに応えます。",images:["木製構造物 施工写真①"]},
  ];
  return (
    <Shell>
      <Label>SCOPE ── ビスタができること</Label>
      <div style={{fontFamily:VB,fontSize:"clamp(1.1rem,4.5vw,1.7rem)",color:C.text,fontWeight:700,lineHeight:1.35,marginBottom:"clamp(1rem,4vw,1.5rem)"}}>
        <span style={{color:C.forest}}>2軸の強み</span>で、<br/>より多くの現場に対応できます。
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:"clamp(.4rem,1.5vw,.6rem)"}}>
        {services.map((s,i)=>(
          <div key={i}>
            <button onClick={()=>{sfxSelect();setOpen(open===s.id?null:s.id);}} style={{width:"100%",textAlign:"left",background:open===s.id?"rgba(28,74,24,.05)":C.surface,border:"1px solid "+(open===s.id?"rgba(28,74,24,.28)":"rgba(28,74,24,.1)"),padding:"clamp(.9rem,3.5vw,1.25rem) clamp(1rem,4vw,1.4rem)",display:"flex",alignItems:"center",gap:"clamp(.6rem,2.5vw,1rem)",cursor:"pointer",transition:"all .2s",WebkitTapHighlightColor:"transparent",boxShadow:open===s.id?"none":"0 1px 4px rgba(28,74,24,.05)"}}>
              <div style={{fontSize:"clamp(1.4rem,5vw,1.8rem)",flexShrink:0}}>{s.icon}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontFamily:VB,fontSize:"clamp(1rem,4vw,1.3rem)",color:open===s.id?C.forest:C.text,fontWeight:600,lineHeight:1.2}}>{s.title}</div>
                <div style={{fontFamily:V,fontSize:"clamp(.6rem,2.2vw,.7rem)",color:C.sage,marginTop:".25rem"}}>{s.sub}</div>
              </div>
              <span style={{fontFamily:V,color:"rgba(28,74,24,.28)",fontSize:".85rem",flexShrink:0,transition:"transform .2s",transform:open===s.id?"rotate(90deg)":"none"}}>▶</span>
            </button>
            {open===s.id&&(
              <div style={{padding:"clamp(.9rem,3.5vw,1.25rem) clamp(1rem,4vw,1.5rem)",borderLeft:"3px solid "+s.color,borderRight:"1px solid rgba(28,74,24,.1)",borderBottom:"1px solid rgba(28,74,24,.1)",background:"rgba(28,74,24,.03)",animation:"fadeIn .25s ease"}}>
                <div style={{display:"grid",gridTemplateColumns:`repeat(${s.images.length>1?"2":"1"},1fr)`,gap:".5rem",marginBottom:"1rem"}}>
                  {s.images.map((label,j)=><ImageSlot key={j} label={label} aspectRatio="60%"/>)}
                </div>
                <div style={{fontFamily:VB,fontSize:"clamp(.85rem,3.2vw,1rem)",color:C.muted,lineHeight:1.85,marginBottom:".75rem"}}>{s.detail}</div>
                <div style={{display:"flex",alignItems:"flex-start",gap:".6rem",padding:".65rem .9rem",background:"rgba(28,74,24,.06)",border:"1px solid rgba(28,74,24,.14)"}}>
                  <span style={{color:C.forest,fontFamily:V,flexShrink:0}}>✓</span>
                  <div style={{fontFamily:VB,fontSize:"clamp(.85rem,3.2vw,1rem)",color:C.forest,lineHeight:1.6,fontWeight:500}}>{s.benefit}</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Shell>
  );
}

function S8_Hearing({ checks, onCheck }) {
  const items=[
    {id:"slope",   label:"法面・アンカー案件が年間ある",        sub:"グランドアンカー工・鉄筋挿入工など"},
    {id:"disaster",label:"災害復旧・緊急対応の案件がある",       sub:"豪雨・地震・地すべりなど"},
    {id:"access",  label:"クレーン・足場が入りにくい現場がある", sub:"山間部・急斜面・狭小地など"},
    {id:"eco",     label:"環境制約・景観条例のある現場がある",   sub:"伐採不可・SDGs対応が必要な現場"},
    {id:"partner", label:"協力会社の手配に困っている",           sub:"人手不足・技術者が見つからないなど"},
  ];
  const count=Object.values(checks).filter(Boolean).length;
  return (
    <Shell>
      <Label>HEARING ── 貴社の現場を確認させてください</Label>
      <div style={{fontFamily:VB,fontSize:"clamp(1.1rem,4.5vw,1.7rem)",color:C.text,fontWeight:700,lineHeight:1.35,marginBottom:"clamp(.75rem,3vw,1.25rem)"}}>
        当てはまるものを<br/><span style={{color:C.forest}}>タップしてください。</span>
      </div>
      {count>0&&<div style={{fontFamily:V,fontSize:"clamp(.62rem,2vw,.72rem)",color:C.forest,letterSpacing:".1em",marginBottom:"clamp(.5rem,2vw,.75rem)",animation:"fadeIn .3s ease"}}>{count}項目 該当 ── 次のスライドで確認できます</div>}
      <div style={{display:"flex",flexDirection:"column",gap:"clamp(.35rem,1.5vw,.5rem)"}}>
        {items.map(it=><CheckItem key={it.id} id={it.id} label={it.label} sub={it.sub} checked={!!checks[it.id]} onChange={onCheck}/>)}
      </div>
    </Shell>
  );
}

function S9_Close({ checks }) {
  const [phase,setPhase]=useState(0);
  useEffect(()=>{sfxChime();const t=setTimeout(()=>setPhase(1),1000);return()=>clearTimeout(t);},[]);
  const labels={slope:"法面・アンカー案件",disaster:"災害復旧・緊急対応",access:"クレーン・足場が入りにくい現場",eco:"環境制約・景観条例のある現場",partner:"協力会社の手配難"};
  const matched=Object.entries(checks).filter(([,v])=>v).map(([k])=>labels[k]);
  return (
    <Shell>
      <div style={{display:"flex",flexDirection:"column",gap:"clamp(1rem,4vw,1.75rem)"}}>
        <div style={{display:"flex",alignItems:"center",gap:"1rem"}}>
          <div style={{flex:1,height:1,background:"linear-gradient(90deg,transparent,rgba(28,74,24,.18))"}}/>
          <div style={{fontFamily:V,fontSize:"clamp(.6rem,2vw,.7rem)",color:"rgba(28,74,24,.33)",letterSpacing:".2em",animation:"shimmer 3s ease-in-out infinite"}}>SESSION // まとめ</div>
          <div style={{flex:1,height:1,background:"linear-gradient(90deg,rgba(28,74,24,.18),transparent)"}}/>
        </div>
        {matched.length>0?(
          <div style={{border:"1px solid rgba(28,74,24,.2)",background:C.surface,padding:"clamp(1rem,4vw,1.5rem)",position:"relative",opacity:phase?1:0,transition:"opacity .8s",boxShadow:"0 2px 12px rgba(28,74,24,.08)"}}>
            <Corners color={C.forest} size={18} t={1.5}/>
            <div style={{fontFamily:V,fontSize:"clamp(.62rem,2vw,.72rem)",color:"rgba(28,74,24,.42)",letterSpacing:".15em",marginBottom:".75rem"}}>本日 確認できた課題</div>
            <div style={{display:"flex",flexDirection:"column",gap:".4rem"}}>
              {matched.map((m,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:".6rem"}}>
                  <div style={{width:6,height:6,background:C.forest,flexShrink:0}}/>
                  <div style={{fontFamily:VB,fontSize:"clamp(.85rem,3.2vw,1rem)",color:C.text,lineHeight:1.4}}>{m}</div>
                </div>
              ))}
            </div>
            <div style={{marginTop:"1rem",fontFamily:VB,fontSize:"clamp(.85rem,3.2vw,1rem)",color:C.forest,lineHeight:1.6,borderTop:"1px solid rgba(28,74,24,.1)",paddingTop:".75rem",fontWeight:500}}>
              次回は、判断が分かれそうな現場条件だけ整理しましょう。
            </div>
          </div>
        ):(
          <div style={{fontFamily:VB,fontSize:"clamp(1.4rem,5.5vw,2.5rem)",color:C.text,fontWeight:700,lineHeight:1.35,opacity:phase?1:0,transition:"opacity .8s"}}>
            本日、何か<br/><span style={{color:C.forest}}>引っかかりましたか？</span>
          </div>
        )}
        <div style={{border:"1px solid rgba(28,74,24,.1)",background:C.surface,padding:"clamp(.85rem,3.5vw,1.25rem) clamp(1rem,4vw,1.4rem)",boxShadow:"0 1px 4px rgba(28,74,24,.04)"}}>
          <div style={{fontFamily:V,fontSize:"clamp(.6rem,2vw,.7rem)",color:"rgba(28,74,24,.33)",letterSpacing:".2em",marginBottom:".65rem"}}>COMPANY INFO</div>
          {[["社名","株式会社ビスタ"],["所在地","愛媛県松山市平井町2220-1"],["TEL","089-907-0914"],["URL","vista-ehime.com"]].map(([k,v],i,arr)=>(
            <div key={k} style={{display:"flex",borderBottom:i<arr.length-1?"1px solid rgba(28,74,24,.07)":"none"}}>
              <div style={{fontFamily:V,fontSize:"clamp(.6rem,2vw,.7rem)",color:"rgba(28,74,24,.38)",padding:".4rem .6rem",minWidth:56,flexShrink:0,display:"flex",alignItems:"center"}}>{k}</div>
              <div style={{fontFamily:VB,fontSize:"clamp(.78rem,2.8vw,.9rem)",color:C.muted,padding:".4rem .6rem",display:"flex",alignItems:"center"}}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );
}

/* ═══════════════════ APP ═══════════════════ */
const TOTAL  = 10;
const LABELS = ["BOOT","PAIN","SOLUTION","POSITION","STRENGTH","PROOF","FAQ","SCOPE","HEARING","CLOSE"];

export default function App() {
  const [idx,setIdx]=useState(0);
  const [dir,setDir]=useState(1);
  const [checks,setChecks]=useState({});
  const isMobile=useIsMobile();

  const go=useCallback((next)=>{
    if(next<0||next>=TOTAL)return;
    sfxClick();sfxWhoosh();setTimeout(sfxImpact,180);
    setDir(next>idx?1:-1);setTimeout(()=>setIdx(next),160);
  },[idx]);

  useEffect(()=>{
    const h=(e)=>{
      if(["ArrowRight","ArrowDown"," "].includes(e.key)){e.preventDefault();go(idx+1);}
      if(["ArrowLeft","ArrowUp"].includes(e.key)){e.preventDefault();go(idx-1);}
    };
    window.addEventListener("keydown",h);return()=>window.removeEventListener("keydown",h);
  },[go,idx]);

  useEffect(()=>{if(idx===TOTAL-1)setTimeout(sfxChime,300);},[idx]);

  const swipe=useSwipe(()=>go(idx+1),()=>go(idx-1));
  const anim=dir===1?"slideInF .22s cubic-bezier(.16,1,.3,1)":"slideInB .22s cubic-bezier(.16,1,.3,1)";

  const handleCheck=(id)=>setChecks(p=>({...p,[id]:!p[id]}));
  const handleAreaClick=(e)=>{if(e.target.closest("button")||e.target.closest("a"))return;if(isMobile)go(idx+1);};

  const renderSlide=()=>{switch(idx){
    case 0:return<S0_Boot/>;case 1:return<S1_Pain/>;case 2:return<S2_Solution/>;case 3:return<S3_Position/>;
    case 4:return<S4_Strength/>;case 5:return<S5_Proof/>;case 6:return<S6_FAQ/>;case 7:return<S7_Scope/>;
    case 8:return<S8_Hearing checks={checks} onCheck={handleCheck}/>;case 9:return<S9_Close checks={checks}/>;
    default:return null;
  }};

  const checkedCount=Object.values(checks).filter(Boolean).length;

  const css=`
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;600;700&family=Inter:wght@300;400;600;700&family=Share+Tech+Mono&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    html,body,#root{width:100%;height:100%;overflow:hidden;cursor:default;background:#f4f1eb;-webkit-text-size-adjust:100%}
    body{color:#1a2e17;font-family:'Noto Sans JP','Inter',sans-serif;touch-action:pan-y;-webkit-font-smoothing:antialiased}
    ::selection{background:#1c4a18;color:#fff}
    button{-webkit-tap-highlight-color:transparent;touch-action:manipulation;font-family:'Noto Sans JP','Inter',sans-serif}
    @keyframes blink   {0%,100%{opacity:1}50%{opacity:0}}
    @keyframes fadeIn  {from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
    @keyframes slideInF{from{opacity:0;transform:translateX(24px)} to{opacity:1;transform:translateX(0)}}
    @keyframes slideInB{from{opacity:0;transform:translateX(-24px)}to{opacity:1;transform:translateX(0)}}
    @keyframes pulse   {0%,100%{opacity:.5}50%{opacity:1}}
    @keyframes shimmer {0%{opacity:.3}50%{opacity:.65}100%{opacity:.3}}
    ::-webkit-scrollbar{display:none}
    *{scrollbar-width:none}
  `;

  return (
    <div style={{width:"100vw",height:"100vh",background:C.bg,overflow:"hidden",position:"relative"}}>
      <style dangerouslySetInnerHTML={{__html:css}}/>
      <ForestBg/>
      <div onClick={handleAreaClick} {...swipe} style={{position:"fixed",inset:0,zIndex:10,display:"flex",flexDirection:"column"}}>

        {/* ── TOP BAR ── */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"clamp(.4rem,2vw,.65rem) clamp(.75rem,3vw,2rem)",borderBottom:"1px solid rgba(28,74,24,.1)",background:"rgba(244,241,235,.97)",backdropFilter:"blur(8px)",fontFamily:V,fontSize:"clamp(.65rem,2.5vw,.75rem)",color:"rgba(28,74,24,.38)",letterSpacing:".12em",flexShrink:0,zIndex:20,gap:"clamp(.5rem,2vw,1rem)"}}>
          <div style={{display:"flex",gap:"clamp(.5rem,2vw,1.5rem)",alignItems:"center",minWidth:0}}>
            <span style={{color:C.forest,fontSize:"clamp(.82rem,3vw,.95rem)",fontWeight:700,letterSpacing:".06em",flexShrink:0}}>VISTA</span>
            {!isMobile&&<span style={{color:"rgba(28,74,24,.33)"}}>ANCHOR_SYSTEM</span>}
            {checkedCount>0&&<span style={{color:C.forest,flexShrink:0}}>{checkedCount}項目 確認済</span>}
            <span style={{color:C.forestL,animation:"pulse 2.5s ease-in-out infinite",flexShrink:0,fontSize:".88em"}}>● LIVE</span>
          </div>
          <MiniDots cur={idx+1} total={TOTAL}/>
          <div style={{fontFamily:V,fontSize:"clamp(.65rem,2.5vw,.75rem)",color:"rgba(28,74,24,.28)",flexShrink:0}}>
            {String(idx+1).padStart(2,"0")}/{String(TOTAL).padStart(2,"0")}
            {!isMobile&&<span style={{color:"rgba(93,117,88,.28)",marginLeft:"1rem"}}>▸ {LABELS[idx]}</span>}
          </div>
        </div>

        {/* ── SLIDE ── */}
        <div key={idx} style={{flex:1,overflow:"hidden",animation:anim,minHeight:0}}>{renderSlide()}</div>

        {/* ── BOTTOM BAR ── */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"clamp(.4rem,2vw,.55rem) clamp(.75rem,3vw,2rem)",borderTop:"1px solid rgba(28,74,24,.08)",background:"rgba(244,241,235,.97)",backdropFilter:"blur(8px)",fontFamily:V,fontSize:"clamp(.6rem,2.5vw,.7rem)",color:"rgba(28,74,24,.26)",letterSpacing:".08em",flexShrink:0,zIndex:20,gap:"1rem"}}>
          {!isMobile?<span>株式会社ビスタ / 089-907-0914 / vista-ehime.com</span>:<span style={{color:"rgba(93,117,88,.28)"}}>← スワイプ →</span>}
          <div style={{display:"flex",gap:"clamp(.75rem,3vw,1.5rem)"}}>
            <button onClick={e=>{e.stopPropagation();go(idx-1);}} disabled={idx===0} style={{background:"none",border:"none",color:idx===0?"rgba(93,117,88,.15)":"rgba(28,74,24,.33)",cursor:idx===0?"default":"pointer",fontFamily:V,fontSize:"clamp(.78rem,3.2vw,.88rem)",letterSpacing:".08em",padding:"clamp(.4rem,2vw,.5rem) clamp(.5rem,2vw,.75rem)",minWidth:"clamp(44px,12vw,60px)",WebkitTapHighlightColor:"transparent"}}>◀ PREV</button>
            <button onClick={e=>{e.stopPropagation();go(idx+1);}} disabled={idx===TOTAL-1} style={{background:"none",border:"1px solid rgba(28,74,24,.2)",color:idx===TOTAL-1?"rgba(93,117,88,.15)":"rgba(28,74,24,.72)",cursor:idx===TOTAL-1?"default":"pointer",fontFamily:V,fontSize:"clamp(.78rem,3.2vw,.88rem)",letterSpacing:".08em",padding:"clamp(.4rem,2vw,.5rem) clamp(.5rem,2vw,.75rem)",minWidth:"clamp(44px,12vw,60px)",WebkitTapHighlightColor:"transparent"}}>NEXT ▶</button>
          </div>
        </div>
      </div>
    </div>
  );
}
