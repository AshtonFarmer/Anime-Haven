import { ARSENAL_ITEMS as ITEMS } from './data/arsenal-items.js';

const arsenalCollator=new Intl.Collator(undefined,{numeric:true,sensitivity:'base'});
const DISPLAY_ITEMS=[
  ...ITEMS.filter(item=>item.type==='power'),
  ...ITEMS
    .filter(item=>item.type==='weapon')
    .sort((left,right)=>arsenalCollator.compare(left.anime,right.anime)||arsenalCollator.compare(left.name,right.name))
];
const ARSENAL_PAGE_SIZE=96;
const DISPLAY_INDEX_BY_ID=new Map(DISPLAY_ITEMS.map((item,index)=>[item.id,index]));
const ARSENAL_GROUP_TOTALS=new Map();
DISPLAY_ITEMS.forEach(item=>{
  const key=item.type==='power'?'power:all':`weapon:${item.anime}`;
  ARSENAL_GROUP_TOTALS.set(key,(ARSENAL_GROUP_TOTALS.get(key)||0)+1);
});

const arsenalGroup=item=>item.type==='power'
  ? {key:'power:all',title:'Powers & Techniques',type:'power'}
  : {key:`weapon:${item.anime}`,title:item.anime,type:'weapon'};
const arsenalSearchText=item=>`${item.name} ${item.owner} ${item.anime}`.toLowerCase();

const POWER_MARKUP={
  telekinesis:'<span class="fx-ring"></span><span class="fx-ring ring-b"></span><span class="fx-core"></span><span class="fx-shard shard-a"></span><span class="fx-shard shard-b"></span><span class="fx-shard shard-c"></span>',
  hollow:'<span class="fx-orb orb-a"></span><span class="fx-orb orb-b"></span><span class="fx-core"></span><span class="fx-ring ring-b"></span>',
  kamehameha:'<span class="fx-ring ring-b"></span><span class="fx-core"></span><span class="fx-beam"></span>',
  arise:'<span class="fx-core"></span><span class="fx-symbol">ARISE</span><span class="fx-shard shard-a"></span><span class="fx-shard shard-b"></span>',
  getsuga:'<span class="fx-ring ring-b"></span><span class="fx-slash"></span><span class="fx-core"></span>',
  megiddo:'<span class="fx-ring"></span><span class="fx-ring ring-b"></span><span class="fx-core"></span>',
  zoltraak:'<span class="fx-ring"></span><span class="fx-ring ring-b"></span><span class="fx-core"></span><span class="fx-beam"></span>',
  shrine:'<span class="fx-symbol">伏魔</span><span class="fx-slash"></span><span class="fx-ring ring-b"></span>',
  impact:'<span class="fx-ring"></span><span class="fx-ring ring-b"></span><span class="fx-core"></span><span class="fx-slash"></span>',
  adolla:'<span class="fx-ring ring-b"></span><span class="fx-core"></span><span class="fx-shard shard-a"></span><span class="fx-shard shard-b"></span>',
  counter:'<span class="fx-ring"></span><span class="fx-ring ring-b"></span><span class="fx-core"></span><span class="fx-beam"></span>',
  water:'<span class="fx-ring ring-b"></span><span class="fx-slash"></span><span class="fx-core"></span>'
};

let svgSequence=0;
const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,char=>({
  '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
}[char]));

function weaponShape(kind){
  if(kind==='katana')return `
    <path d="M162 273 Q391 130 650 75" fill="none" stroke="url(#blade)" stroke-width="20" stroke-linecap="round"/>
    <path d="M163 274 Q394 144 650 83" fill="none" stroke="url(#edge)" stroke-width="4" stroke-linecap="round"/>
    <path d="M92 319 L164 272" stroke="url(#grip)" stroke-width="24" stroke-linecap="round"/>
    <path d="M108 305l10 12m8-24l10 12m8-24l10 12" stroke="#f6f4ff" stroke-opacity=".52" stroke-width="3"/>
    <path d="M151 252l32 38" stroke="url(#metal)" stroke-width="10" stroke-linecap="round"/>`;
  if(kind==='greatsword')return `
    <path d="M214 287 L548 45 L657 55 L630 145 L292 326 Z" fill="url(#blade)" stroke="url(#metal)" stroke-width="7"/>
    <path d="M272 300L621 71" stroke="url(#edge)" stroke-width="6" opacity=".9"/>
    <path d="M127 336L240 268" stroke="url(#grip)" stroke-width="31" stroke-linecap="round"/>
    <path d="M195 252L261 329" stroke="url(#metal)" stroke-width="15" stroke-linecap="round"/>
    <path d="M137 326l12 17m14-33l12 17m14-33l12 17" stroke="#fff" stroke-opacity=".5" stroke-width="4"/>`;
  if(kind==='cleaver')return `
    <path d="M245 290 L532 67 Q605 38 665 58 L609 183 L291 330 Z" fill="url(#blade)" stroke="url(#metal)" stroke-width="7"/>
    <path d="M285 306L620 91" stroke="url(#edge)" stroke-width="6"/>
    <circle cx="592" cy="105" r="17" fill="#060712" stroke="url(#accent)" stroke-width="5"/>
    <path d="M126 344L250 272" stroke="url(#grip)" stroke-width="30" stroke-linecap="round"/>
    <path d="M205 263L267 326" stroke="url(#metal)" stroke-width="15" stroke-linecap="round"/>`;
  if(kind==='longsword')return `
    <path d="M233 291 L573 42 L650 44 L624 116 L282 324 Z" fill="url(#blade)" stroke="url(#metal)" stroke-width="6"/>
    <path d="M275 305L620 67" stroke="url(#edge)" stroke-width="5"/>
    <path d="M133 345L244 276" stroke="url(#grip)" stroke-width="25" stroke-linecap="round"/>
    <path d="M205 258L270 333" stroke="url(#accent)" stroke-width="13" stroke-linecap="round"/>
    <circle cx="130" cy="346" r="15" fill="url(#accent)" stroke="#f8f7ff" stroke-opacity=".5" stroke-width="4"/>`;
  if(kind==='dagger')return `
    <path d="M280 273 L546 91 L628 89 L587 159 L330 312 Z" fill="url(#blade)" stroke="url(#metal)" stroke-width="7"/>
    <path d="M326 291L587 116" stroke="url(#edge)" stroke-width="5"/>
    <path d="M164 342L292 259" stroke="url(#grip)" stroke-width="29" stroke-linecap="round"/>
    <path d="M244 245L320 326" stroke="url(#accent)" stroke-width="14" stroke-linecap="round"/>`;
  if(kind==='spear')return `
    <path d="M100 321L578 101" stroke="url(#grip)" stroke-width="20" stroke-linecap="round"/>
    <path d="M553 106L663 35L625 151Z" fill="url(#blade)" stroke="url(#metal)" stroke-width="6"/>
    <path d="M548 111L624 83" stroke="url(#accent)" stroke-width="10" stroke-linecap="round"/>
    <circle cx="126" cy="309" r="15" fill="url(#accent)" stroke="#fff" stroke-opacity=".5" stroke-width="3"/>`;
  if(kind==='staff')return `
    <path d="M100 309L260 240M284 228L445 155M469 143L641 65" stroke="url(#grip)" stroke-width="25" stroke-linecap="round"/>
    <path d="M245 225L292 244M430 139L476 160" stroke="url(#metal)" stroke-width="19" stroke-linecap="round"/>
    <path d="M112 297L248 238M296 224L434 162M480 140L628 73" stroke="url(#edge)" stroke-width="4" opacity=".72"/>`;
  if(kind==='axe')return `
    <path d="M138 334L506 103" stroke="url(#grip)" stroke-width="29" stroke-linecap="round"/>
    <path d="M453 129Q539 30 669 44Q654 150 548 212L489 168Z" fill="url(#blade)" stroke="url(#metal)" stroke-width="7"/>
    <path d="M526 110Q581 72 640 69" fill="none" stroke="url(#edge)" stroke-width="8" stroke-linecap="round"/>
    <circle cx="490" cy="145" r="25" fill="url(#accent)" stroke="#fff" stroke-opacity=".45" stroke-width="5"/>`;
  return `
    <path d="M120 325L622 70" stroke="url(#blade)" stroke-width="13" stroke-linecap="round"/>
    <path d="M585 90L662 48L620 111Z" fill="url(#accent)" stroke="url(#metal)" stroke-width="5"/>
    <path d="M107 333L198 288" stroke="url(#grip)" stroke-width="26" stroke-linecap="round"/>
    <path d="M181 272L211 310" stroke="url(#metal)" stroke-width="12" stroke-linecap="round"/>`;
}

function weaponArt(item){
  const uid=`weapon-${++svgSequence}`;
  return `<span class="arsenal-weapon-aura" aria-hidden="true"></span>
    <svg class="arsenal-weapon-svg" viewBox="0 0 760 360" role="img" aria-label="${escapeHtml(item.name)} vector artwork">
      <defs>
        <linearGradient id="${uid}-blade" x1="0" y1="1" x2="1" y2="0"><stop stop-color="#161a27"/><stop offset=".38" stop-color="#f8fbff"/><stop offset=".62" stop-color="#7f8da9"/><stop offset="1" stop-color="#202536"/></linearGradient>
        <linearGradient id="${uid}-edge" x1="0" x2="1"><stop stop-color="${escapeHtml(item.accent2)}"/><stop offset=".55" stop-color="#fff"/><stop offset="1" stop-color="${escapeHtml(item.accent2)}"/></linearGradient>
        <linearGradient id="${uid}-metal" x1="0" x2="1"><stop stop-color="#272c3c"/><stop offset=".5" stop-color="#e7eaf4"/><stop offset="1" stop-color="#252a39"/></linearGradient>
        <linearGradient id="${uid}-grip" x1="0" x2="1"><stop stop-color="#080914"/><stop offset=".5" stop-color="${escapeHtml(item.accent)}"/><stop offset="1" stop-color="#060710"/></linearGradient>
        <linearGradient id="${uid}-accent" x1="0" x2="1"><stop stop-color="${escapeHtml(item.accent)}"/><stop offset=".5" stop-color="${escapeHtml(item.accent2)}"/><stop offset="1" stop-color="#fff"/></linearGradient>
        <filter id="${uid}-glow"><feGaussianBlur stdDeviation="6" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <g transform="rotate(-2 380 180)" filter="url(#${uid}-glow)"
        style="--blade:url(#${uid}-blade);--edge:url(#${uid}-edge);--metal:url(#${uid}-metal);--grip:url(#${uid}-grip);--accent:url(#${uid}-accent)">
        ${weaponShape(item.kind)
          .replaceAll('url(#blade)',`url(#${uid}-blade)`)
          .replaceAll('url(#edge)',`url(#${uid}-edge)`)
          .replaceAll('url(#metal)',`url(#${uid}-metal)`)
          .replaceAll('url(#grip)',`url(#${uid}-grip)`)
          .replaceAll('url(#accent)',`url(#${uid}-accent)`)}
      </g>
    </svg>`;
}

function mediaMeta(item){
  if(item.type==='power'){
    return {
      kind:'ANIME GIF',
      label:'REAL ANIME GIF • TENOR',
      src:`https://tenor.com/embed/${encodeURIComponent(item.tenorId)}`,
      className:'arsenal-tenor-frame',
      tag:'iframe'
    };
  }
  if(item.sketchfabId){
    return {
      kind:'EXACT 3D',
      label:'SOURCED 3D REPLICA • SKETCHFAB',
      src:`https://sketchfab.com/models/${encodeURIComponent(item.sketchfabId)}/embed?autostart=1&autospin=0.25&ui_hint=0&ui_theme=dark&ui_infos=0&ui_controls=0&ui_watermark=1&dnt=1`,
      className:'arsenal-model-frame',
      tag:'iframe'
    };
  }
  return {
    kind:item.mediaKind||'ANIME STILL',
    label:item.mediaLabel||'SOURCED ANIME WEAPON STILL',
    src:item.imageUrl,
    className:'arsenal-media-image',
    tag:'img'
  };
}

function visualMarkup(item,index,showcase=false){
  const media=mediaMeta(item);
  const classes=`arsenal-visual ${showcase?'arsenal-showcase-visual ':''}${item.type==='power'?'arsenal-power-media':'arsenal-weapon-media'}`;
  const content=media.tag==='iframe'
    ? `<iframe class="arsenal-media-frame ${media.className}" data-arsenal-media-src="${escapeHtml(media.src)}" title="${escapeHtml(`${item.name} ${media.kind.toLowerCase()}`)}" tabindex="-1" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="autoplay; fullscreen; xr-spatial-tracking" allowfullscreen></iframe>`
    : `<img class="${media.className}" data-arsenal-media-src="${escapeHtml(media.src)}" alt="${escapeHtml(`${item.name}, the weapon used by ${item.owner}`)}" loading="lazy" decoding="async" referrerpolicy="no-referrer">`;
  return `<div class="${classes}" data-accent="${escapeHtml(item.accent)}" data-accent2="${escapeHtml(item.accent2)}" style="--accent:${escapeHtml(item.accent)};--accent2:${escapeHtml(item.accent2)}">
    <div class="arsenal-media-shell">
      <span class="arsenal-media-loading" aria-hidden="true"><i></i><b>LOADING REAL MEDIA</b></span>
      ${content}
      <span class="arsenal-media-failed" role="status">REAL MEDIA UNAVAILABLE — OPEN SOURCE</span>
    </div>
    ${showcase?'':`<span class="arsenal-index">${String(index+1).padStart(2,'0')}</span><span class="arsenal-kind">${media.kind}</span><span class="arsenal-media-label">${media.label}</span>`}
  </div>`;
}

function cardMarkup(item,index,groupKey){
  const media=mediaMeta(item);
  return `<article class="arsenal-card" role="button" tabindex="0" data-arsenal-id="${escapeHtml(item.id)}" data-arsenal-type="${item.type}" data-arsenal-group="${escapeHtml(groupKey)}" data-search="${escapeHtml(`${item.name} ${item.owner} ${item.anime}`.toLowerCase())}" style="--accent:${escapeHtml(item.accent)};--accent2:${escapeHtml(item.accent2)}" aria-label="Open ${escapeHtml(item.name)} showcase">
    ${visualMarkup(item,index)}
    <span class="arsenal-card-copy">
      <span class="arsenal-anime">${escapeHtml(item.anime)}</span>
      <h3>${escapeHtml(item.name)}</h3>
      <span class="arsenal-owner">${escapeHtml(item.owner)}</span>
      <span class="arsenal-card-footer"><span>${media.label}</span><b>${item.type==='power'?'WATCH ATTACK':'INSPECT WEAPON'}</b></span>
    </span>
  </article>`;
}

function groupDividerMarkup(title,count,groupKey,type){
  return `<div class="arsenal-anime-divider" data-arsenal-group="${escapeHtml(groupKey)}" data-arsenal-group-type="${escapeHtml(type)}">
    <span>${escapeHtml(title)}</span>
    <small>${count} ${type==='power'?'POWER'+(count===1?'':'S'):'WEAPON'+(count===1?'':'S')}</small>
  </div>`;
}

const canvasStates=new Map();
let canvasObserver;
let mediaObserver;
let animationFrame=0;

function loadMedia(media){
  if(!media||media.dataset.arsenalMediaLoaded==='1')return;
  const src=media.dataset.arsenalMediaSrc;
  if(!src)return;
  media.dataset.arsenalMediaLoaded='1';
  const shell=media.closest('.arsenal-media-shell');
  const loaded=()=>{
    shell?.classList.add('media-loaded');
    shell?.classList.remove('media-failed');
  };
  let retries=0;
  const attempt=()=>{
    media.onload=()=>{
      media.onload=null;
      media.onerror=null;
      loaded();
    };
    media.onerror=()=>{
      media.onload=null;
      media.onerror=null;
      if(media.tagName==='IMG'&&retries<2){
        retries+=1;
        window.setTimeout(attempt,700*retries);
        return;
      }
      shell?.classList.add('media-failed');
      shell?.classList.remove('media-loaded');
    };
    if(retries&&media.tagName==='IMG'){
      const separator=src.includes('?')?'&':'?';
      media.src=`${src}${separator}knretry=${Date.now()}`;
    }else media.src=src;
  };
  attempt();
}

function initializeMedia(media,immediate=false){
  if(immediate||!mediaObserver)loadMedia(media);
  else mediaObserver.observe(media);
}

function hexRgb(value){
  const hex=String(value||'#ffffff').replace('#','');
  const expanded=hex.length===3?hex.split('').map(char=>char+char).join(''):hex.padEnd(6,'f').slice(0,6);
  return [0,2,4].map(offset=>parseInt(expanded.slice(offset,offset+2),16));
}

function color(rgb,alpha=1){
  return `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha})`;
}

function seedParticles(count){
  return Array.from({length:count},(_,index)=>({
    x:Math.random(),y:Math.random(),r:.5+Math.random()*2.2,s:.2+Math.random()*1.1,
    a:.25+Math.random()*.75,o:Math.random()*Math.PI*2,index
  }));
}

function sizeCanvas(state){
  const {canvas}=state;
  const rect=canvas.getBoundingClientRect();
  if(rect.width<2||rect.height<2)return;
  const ratio=Math.min(2,window.devicePixelRatio||1);
  const width=Math.round(rect.width*ratio),height=Math.round(rect.height*ratio);
  if(canvas.width!==width||canvas.height!==height){
    canvas.width=width;canvas.height=height;
    state.width=rect.width;state.height=rect.height;state.ratio=ratio;
    state.ctx.setTransform(ratio,0,0,ratio,0,0);
  }
}

function glowDot(ctx,x,y,r,rgb,alpha){
  const gradient=ctx.createRadialGradient(x,y,0,x,y,r*5);
  gradient.addColorStop(0,color([255,255,255],Math.min(1,alpha)));
  gradient.addColorStop(.18,color(rgb,alpha));
  gradient.addColorStop(1,color(rgb,0));
  ctx.fillStyle=gradient;ctx.beginPath();ctx.arc(x,y,r*5,0,Math.PI*2);ctx.fill();
}

function drawCanvas(state,time){
  sizeCanvas(state);
  const {ctx,width:w,height:h,effect,particles,palette}=state;
  if(!w||!h)return;
  const t=time*.001;
  ctx.clearRect(0,0,w,h);
  ctx.save();
  ctx.globalCompositeOperation='lighter';

  if(effect==='telekinesis'){
    particles.forEach(p=>{
      const angle=t*(.35+p.s*.16)+p.o;
      const radius=(.12+p.x*.42)*Math.min(w,h);
      const x=w/2+Math.cos(angle)*radius;
      const y=h/2+Math.sin(angle*1.35)*radius*.54+Math.sin(t*2+p.o)*8;
      const hue=Math.sin(t+p.o)>.15?palette[0]:palette[1];
      glowDot(ctx,x,y,p.r+1,hue,p.a*.64);
      ctx.strokeStyle=color(hue,p.a*.38);ctx.lineWidth=.7;
      ctx.beginPath();ctx.moveTo(w/2,h/2);ctx.lineTo(x,y);ctx.stroke();
    });
  }else if(effect==='hollow'){
    particles.forEach(p=>{
      const phase=(t*.33+p.o)%(Math.PI*2),side=p.index%2?-1:1;
      const cx=w/2+side*(42*(1-Math.min(1,(Math.sin(t*.98)+1)/2)));
      const x=cx+Math.cos(phase)*(16+p.x*42),y=h/2+Math.sin(phase)*(12+p.y*35);
      glowDot(ctx,x,y,p.r,p.index%2?palette[0]:palette[1],p.a*.7);
    });
  }else if(['kamehameha','zoltraak','counter'].includes(effect)){
    particles.forEach(p=>{
      const cycle=(p.x+t*(.38+p.s*.18))%1;
      const x=w*.18+cycle*w*.84;
      const y=h/2+Math.sin(p.o+t*3)*((p.y-.5)*58);
      glowDot(ctx,x,y,p.r+cycle*1.4,p.index%3?palette[0]:palette[1],p.a*(1-cycle*.45));
    });
  }else if(effect==='arise'){
    particles.forEach(p=>{
      const cycle=(p.y-t*(.07+p.s*.035)+2)%1;
      const x=w*(.08+p.x*.84)+Math.sin(t+p.o)*9;
      const y=h*(.93-cycle*.86);
      const tail=14+p.s*24;
      ctx.strokeStyle=color(p.index%3?palette[0]:palette[1],p.a*.55);
      ctx.lineWidth=p.r;ctx.beginPath();ctx.moveTo(x,y+tail);ctx.quadraticCurveTo(x+8,y+tail*.5,x,y);ctx.stroke();
      glowDot(ctx,x,y,p.r,palette[1],p.a*.45);
    });
  }else if(effect==='getsuga'){
    particles.forEach(p=>{
      const cycle=(t*.3+p.x)%1;
      const angle=-.3+cycle*.62;
      const radius=w*(.17+p.y*.48);
      const x=w*.42+Math.cos(angle)*radius,y=h*.62+Math.sin(angle)*radius;
      glowDot(ctx,x,y,p.r+1,p.index%4?palette[0]:palette[1],p.a*.65);
    });
  }else if(effect==='megiddo'){
    particles.slice(0,28).forEach(p=>{
      const x=w*(.08+p.x*.84),cycle=(p.y+t*(.27+p.s*.1))%1,y=cycle*h;
      const gradient=ctx.createLinearGradient(x,y-36,x,y+12);
      gradient.addColorStop(0,color(palette[0],0));gradient.addColorStop(.7,color(palette[1],p.a*.76));gradient.addColorStop(1,'rgba(255,255,255,.9)');
      ctx.strokeStyle=gradient;ctx.lineWidth=1+p.r*.7;ctx.beginPath();ctx.moveTo(x,y-38);ctx.lineTo(x,y+10);ctx.stroke();
    });
  }else if(effect==='shrine'){
    particles.slice(0,26).forEach(p=>{
      const cycle=(p.x+t*(.55+p.s*.17))%1,x=cycle*w,y=p.y*h;
      ctx.strokeStyle=color(p.index%3?palette[0]:palette[1],p.a*.76);ctx.lineWidth=.8+p.r;
      ctx.beginPath();ctx.moveTo(x-34,y+17);ctx.lineTo(x+34,y-17);ctx.stroke();
    });
  }else if(effect==='impact'){
    particles.forEach(p=>{
      const cycle=(p.x+t*(.38+p.s*.16))%1,angle=p.o,radius=cycle*Math.max(w,h)*.62;
      const x=w/2+Math.cos(angle)*radius,y=h/2+Math.sin(angle)*radius;
      ctx.strokeStyle=color(p.index%4?palette[0]:palette[1],p.a*(1-cycle));ctx.lineWidth=p.r;
      ctx.beginPath();ctx.moveTo(w/2+Math.cos(angle)*Math.max(0,radius-32),h/2+Math.sin(angle)*Math.max(0,radius-32));ctx.lineTo(x,y);ctx.stroke();
    });
  }else if(effect==='adolla'){
    particles.forEach(p=>{
      const cycle=(p.y-t*(.19+p.s*.11)+2)%1;
      const x=w/2+(p.x-.5)*w*.38+Math.sin(t*4+p.o)*14*cycle,y=h*(.92-cycle*.93);
      glowDot(ctx,x,y,p.r+1,p.index%3?palette[0]:palette[1],p.a*(1-cycle*.58));
    });
  }else if(effect==='water'){
    particles.forEach(p=>{
      const cycle=(p.x+t*(.16+p.s*.08))%1;
      const x=cycle*w,y=h*.56+Math.sin(cycle*Math.PI*2.1+t*1.7+p.o*.08)*h*.17;
      glowDot(ctx,x,y,p.r+1,p.index%3?palette[0]:palette[1],p.a*.58);
    });
  }
  ctx.restore();
}

function initializeCanvas(canvas){
  if(canvasStates.has(canvas))return;
  const root=canvas.closest('.arsenal-visual');
  const state={
    canvas,ctx:canvas.getContext('2d'),effect:root?.dataset.effect||'impact',
    palette:[hexRgb(root?.dataset.accent2),hexRgb(root?.dataset.accent)],
    particles:seedParticles(root?.classList.contains('arsenal-showcase-visual')?88:54),
    width:0,height:0,ratio:1,active:false
  };
  canvasStates.set(canvas,state);
  canvasObserver?.observe(canvas);
  if('ResizeObserver' in window)new ResizeObserver(()=>sizeCanvas(state)).observe(canvas);
  sizeCanvas(state);
  if(!animationFrame)animationFrame=requestAnimationFrame(animationLoop);
}

function animationLoop(time){
  for(const [canvas,state] of canvasStates){
    if(!canvas.isConnected){canvasStates.delete(canvas);continue}
    if(state.active&&!document.hidden)drawCanvas(state,time);
  }
  animationFrame=canvasStates.size?requestAnimationFrame(animationLoop):0;
}

function openShowcase(item,index){
  const dialog=document.getElementById('arsenalShowcase');
  if(!dialog)return;
  const media=mediaMeta(item);
  dialog.style.setProperty('--showcase-accent',item.accent);
  dialog.querySelector('#arsenalShowcaseBody').innerHTML=`
    ${visualMarkup(item,index,true)}
    <div class="arsenal-showcase-copy">
      <div>
        <span class="arsenal-anime">${escapeHtml(item.anime)} • ${media.label}</span>
        <h2>${escapeHtml(item.name)}</h2>
        <p><strong>${escapeHtml(item.owner)}</strong> — ${escapeHtml(item.description)}</p>
        <a class="arsenal-showcase-source" href="${escapeHtml(item.sourceUrl)}" target="_blank" rel="noopener noreferrer">OPEN ORIGINAL MEDIA SOURCE ↗</a>
      </div>
      <span class="arsenal-showcase-number">${String(index+1).padStart(2,'0')}</span>
    </div>`;
  dialog.showModal();
  document.body.classList.add('arsenal-dialog-open');
  requestAnimationFrame(()=>dialog.querySelectorAll('[data-arsenal-media-src]').forEach(node=>initializeMedia(node,true)));
  navigator.vibrate?.(item.type==='power'?[18,28,36]:12);
}

export function installArsenal(){
  if(document.documentElement.dataset.arsenalV59)return true;
  const app=document.getElementById('app');
  const nav=document.querySelector('.bottom-nav');
  const topbar=document.querySelector('.topbar');
  if(!app||!nav||!topbar)return false;
  document.documentElement.dataset.arsenalV59='1';

  let arsenalStyles=document.querySelector('link[href*="arsenal-v34.css"]');
  if(!arsenalStyles){
    arsenalStyles=document.createElement('link');
    arsenalStyles.rel='stylesheet';
    document.head.appendChild(arsenalStyles);
  }
  arsenalStyles.href='./arsenal-v34.css?release=59';

  const settingsNav=nav.querySelector('[data-view="settings"]');
  if(settingsNav){
    settingsNav.dataset.view='arsenal';
    settingsNav.setAttribute('aria-label','Open Arsenal');
    settingsNav.innerHTML='<span aria-hidden="true">⚔</span>Arsenal';
  }
  nav.classList.add('kn-bottom-nav');
  nav.dataset.knSafeNav='22';
  const setNavHeight=()=>document.documentElement.style.setProperty('--kn-bottom-nav-height',`${Math.ceil(nav.getBoundingClientRect().height)}px`);
  setNavHeight();
  if('ResizeObserver' in window)new ResizeObserver(setNavHeight).observe(nav);

  if(!document.getElementById('arsenalSettingsButton')){
    const settings=document.createElement('button');
    settings.id='arsenalSettingsButton';
    settings.className='arsenal-settings-button';
    settings.type='button';settings.dataset.view='settings';
    settings.setAttribute('aria-label','Settings');
    settings.innerHTML='<span aria-hidden="true">⚙</span>';
    const profile=topbar.querySelector('.profile-button');
    topbar.insertBefore(settings,profile||null);
  }

  const section=document.createElement('section');
  section.id='arsenalView';section.className='view arsenal-view';section.dataset.viewName='arsenal';
  const powerCount=ITEMS.filter(item=>item.type==='power').length;
  const weaponCount=ITEMS.filter(item=>item.type==='weapon').length;
  const totalCount=ITEMS.length;
  section.innerHTML=`
    <div class="section-heading arsenal-heading">
      <button class="back-button" data-view="home">← HOME</button>
      <div class="arsenal-heading-copy">
        <p class="eyebrow">${totalCount} RELICS, POWERS + TECHNIQUES</p>
        <h2>Arsenal</h2>
        <p class="arsenal-lede">Physical weapons and unforgettable abilities from across your anime universe. Tap anything to unleash its full showcase.</p>
      </div>
    </div>
    <section class="arsenal-overview" aria-label="Arsenal collection summary">
      <div><strong>The real moves. The exact weapons.</strong><p>${powerCount} sourced anime attack GIFs plus ${weaponCount} exact weapon models and stills. Every entry links back to the original media source.</p></div>
      <div class="arsenal-counts"><span><b>${powerCount}</b><small>Anime GIFs</small></span><span><b>${weaponCount}</b><small>Exact Weapons</small></span><span><b>${totalCount}</b><small>Sourced</small></span></div>
    </section>
    <div class="arsenal-toolbar">
      <label class="arsenal-search-wrap"><input id="arsenalSearch" type="search" autocomplete="off" placeholder="Search weapon, power, character or anime…" aria-label="Search Arsenal"></label>
      <div class="arsenal-filters" aria-label="Arsenal filters">
        <button class="arsenal-filter active" type="button" data-arsenal-filter="all">ALL ${totalCount}</button>
        <button class="arsenal-filter" type="button" data-arsenal-filter="power">POWERS ${powerCount}</button>
        <button class="arsenal-filter" type="button" data-arsenal-filter="weapon">WEAPONS ${weaponCount}</button>
      </div>
      <button class="arsenal-random" id="arsenalRandom" type="button">UNLEASH RANDOM</button>
    </div>
    <div class="arsenal-results-line"><span id="arsenalResultCount" aria-live="polite"><strong>${totalCount}</strong> entries ready</span><span>Weapons grouped A–Z by anime</span></div>
    <div class="arsenal-grid" id="arsenalGrid"></div>
    <div class="arsenal-load-more" id="arsenalLoadMore" hidden>
      <span id="arsenalLoadStatus" aria-live="polite"></span>
      <button id="arsenalLoadMoreButton" type="button">LOAD MORE</button>
    </div>`;
  app.appendChild(section);

  const dialog=document.createElement('dialog');
  dialog.id='arsenalShowcase';dialog.className='arsenal-showcase';
  dialog.innerHTML='<button class="arsenal-showcase-close" type="button" aria-label="Close showcase">×</button><div id="arsenalShowcaseBody"></div>';
  document.body.appendChild(dialog);

  if('IntersectionObserver' in window){
    canvasObserver=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        const state=canvasStates.get(entry.target);
        if(state)state.active=entry.isIntersecting;
      });
    },{rootMargin:'80px 0px',threshold:.05});
    mediaObserver=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(!entry.isIntersecting)return;
        mediaObserver.unobserve(entry.target);
        loadMedia(entry.target);
      });
    },{rootMargin:'420px 0px',threshold:.01});
  }

  const grid=section.querySelector('#arsenalGrid');
  const loadMore=section.querySelector('#arsenalLoadMore');
  const loadMoreButton=section.querySelector('#arsenalLoadMoreButton');
  const loadStatus=section.querySelector('#arsenalLoadStatus');
  const countLine=section.querySelector('#arsenalResultCount');
  const searchInput=section.querySelector('#arsenalSearch');
  let activeFilter='all';
  let activeQuery='';
  let matchingItems=[];
  let renderedCount=0;
  let lastRenderedGroup='';
  let collectionReady=false;
  let searchTimer=0;
  let appending=false;

  const releaseGridMedia=()=>{
    grid.querySelectorAll('[data-arsenal-media-src]').forEach(media=>mediaObserver?.unobserve(media));
  };

  const updateLoadState=()=>{
    const total=matchingItems.length;
    const remaining=Math.max(0,total-renderedCount);
    loadMore.hidden=!remaining;
    loadStatus.textContent=total?`Showing ${renderedCount.toLocaleString()} of ${total.toLocaleString()}`:'';
    loadMoreButton.textContent=remaining
      ? `LOAD ${Math.min(ARSENAL_PAGE_SIZE,remaining).toLocaleString()} MORE`
      : 'ALL ENTRIES LOADED';
  };

  const appendNextBatch=()=>{
    if(appending||renderedCount>=matchingItems.length)return;
    appending=true;
    const batch=matchingItems.slice(renderedCount,renderedCount+ARSENAL_PAGE_SIZE);
    let markup='';
    batch.forEach(item=>{
      const group=arsenalGroup(item);
      if(group.key!==lastRenderedGroup){
        markup+=groupDividerMarkup(group.title,ARSENAL_GROUP_TOTALS.get(group.key)||1,group.key,group.type);
        lastRenderedGroup=group.key;
      }
      markup+=cardMarkup(item,DISPLAY_INDEX_BY_ID.get(item.id),group.key);
    });
    const template=document.createElement('template');
    template.innerHTML=markup;
    const media=[...template.content.querySelectorAll('[data-arsenal-media-src]')];
    grid.appendChild(template.content);
    media.forEach(node=>initializeMedia(node));
    renderedCount+=batch.length;
    updateLoadState();
    appending=false;
  };

  const resetCollection=()=>{
    releaseGridMedia();
    grid.replaceChildren();
    renderedCount=0;
    lastRenderedGroup='';
    matchingItems=DISPLAY_ITEMS.filter(item=>{
      const matchesType=activeFilter==='all'||item.type===activeFilter;
      const matchesQuery=!activeQuery||arsenalSearchText(item).includes(activeQuery);
      return matchesType&&matchesQuery;
    });
    countLine.innerHTML=matchingItems.length
      ? `<strong>${matchingItems.length.toLocaleString()}</strong> entr${matchingItems.length===1?'y':'ies'} ready`
      : '<strong>0</strong> matches';
    if(matchingItems.length)appendNextBatch();
    else{
      const empty=document.createElement('div');
      empty.className='arsenal-empty';
      empty.innerHTML='<b>No Arsenal entries found.</b><span>Try a character, anime, weapon or attack name.</span>';
      grid.appendChild(empty);
      updateLoadState();
    }
  };

  const ensureCollection=()=>{
    if(collectionReady)return;
    collectionReady=true;
    resetCollection();
  };

  searchInput.addEventListener('input',()=>{
    activeQuery=searchInput.value.trim().toLowerCase();
    window.clearTimeout(searchTimer);
    searchTimer=window.setTimeout(()=>{
      ensureCollection();
      resetCollection();
    },120);
  });
  section.querySelector('.arsenal-filters').addEventListener('click',event=>{
    const button=event.target.closest('[data-arsenal-filter]');if(!button)return;
    activeFilter=button.dataset.arsenalFilter;
    section.querySelectorAll('.arsenal-filter').forEach(item=>item.classList.toggle('active',item===button));
    ensureCollection();
    resetCollection();
  });
  grid.addEventListener('click',event=>{
    const card=event.target.closest('[data-arsenal-id]');if(!card)return;
    const index=DISPLAY_INDEX_BY_ID.get(card.dataset.arsenalId);
    if(index>=0)openShowcase(DISPLAY_ITEMS[index],index);
  });
  grid.addEventListener('keydown',event=>{
    if(event.key!=='Enter'&&event.key!==' ')return;
    const card=event.target.closest('[data-arsenal-id]');if(!card)return;
    event.preventDefault();
    const index=DISPLAY_INDEX_BY_ID.get(card.dataset.arsenalId);
    if(index>=0)openShowcase(DISPLAY_ITEMS[index],index);
  });
  section.querySelector('#arsenalRandom').addEventListener('click',()=>{
    ensureCollection();
    if(!matchingItems.length)return;
    const item=matchingItems[Math.floor(Math.random()*matchingItems.length)];
    const index=DISPLAY_INDEX_BY_ID.get(item.id);
    if(index>=0)openShowcase(DISPLAY_ITEMS[index],index);
  });
  loadMoreButton.addEventListener('click',appendNextBatch);
  let loadMoreObserver;
  if('IntersectionObserver' in window){
    loadMoreObserver=new IntersectionObserver(entries=>{
      if(entries.some(entry=>entry.isIntersecting)&&section.classList.contains('active'))appendNextBatch();
    },{rootMargin:'900px 0px',threshold:.01});
    loadMoreObserver.observe(loadMore);
  }

  const closeDialog=()=>{
    if(dialog.open)dialog.close();
    document.body.classList.remove('arsenal-dialog-open');
    dialog.querySelector('#arsenalShowcaseBody').replaceChildren();
  };
  dialog.querySelector('.arsenal-showcase-close').addEventListener('click',closeDialog);
  dialog.addEventListener('click',event=>{if(event.target===dialog)closeDialog()});
  dialog.addEventListener('close',()=>{
    document.body.classList.remove('arsenal-dialog-open');
    dialog.querySelector('#arsenalShowcaseBody').replaceChildren();
  });

  const syncArsenalState=()=>{
    const active=section.classList.contains('active');
    document.body.classList.toggle('arsenal-active',active);
    if(active)ensureCollection();
    else if(collectionReady){
      if(dialog.open)closeDialog();
      if(renderedCount>ARSENAL_PAGE_SIZE)resetCollection();
      grid.querySelectorAll('iframe[data-arsenal-media-src]').forEach(frame=>{
        mediaObserver?.unobserve(frame);
        frame.removeAttribute('src');
        delete frame.dataset.arsenalMediaLoaded;
        const shell=frame.closest('.arsenal-media-shell');
        shell?.classList.remove('media-loaded','media-failed');
        initializeMedia(frame);
      });
    }
  };
  new MutationObserver(syncArsenalState).observe(section,{attributes:true,attributeFilter:['class']});
  syncArsenalState();

  try{
    const state=JSON.parse(localStorage.getItem('anime-haven-state-v2')||'null');
    if(state?.view==='arsenal')setTimeout(()=>settingsNav?.click(),0);
  }catch(error){console.warn('Arsenal could not restore its last view',error)}
  return true;
}

export function autoInstallArsenal(){
  if(typeof document==='undefined')return;
  if(installArsenal())return;
  window.addEventListener('kagenexus-ready',installArsenal,{once:true});
  window.addEventListener('anime-haven-ready',installArsenal,{once:true});
  let tries=0;
  const timer=setInterval(()=>{tries++;if(installArsenal()||tries>200)clearInterval(timer)},100);
}

autoInstallArsenal();
