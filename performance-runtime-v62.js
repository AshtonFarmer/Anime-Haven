(()=>{
  'use strict';

  const STORAGE_KEY='kagenexus-performance-mode';
  const MODES=new Set(['full','balanced','low']);
  const MODE_COPY={
    full:'All visual effects and animations stay enabled.',
    balanced:'Keeps the KageNexus look while reducing unnecessary background work.',
    low:'Cuts most decorative motion and pauses extra media to save battery and memory.'
  };
  let mode='balanced';
  let installQueued=false;

  const readMode=()=>{
    try{
      const saved=localStorage.getItem(STORAGE_KEY);
      if(MODES.has(saved))return saved;
    }catch{}
    return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches?'low':'balanced';
  };

  const ensureStyles=()=>{
    if(document.getElementById('kn62-performance-styles'))return;
    const style=document.createElement('style');
    style.id='kn62-performance-styles';
    style.textContent=`
      html[data-kn-performance-mode="low"] *,html[data-kn-page-hidden] *{animation-play-state:paused!important}
      html[data-kn-performance-mode="low"] .kn35-effects,
      html[data-kn-performance-mode="low"] .kn29-canvas,
      html[data-kn-performance-mode="low"] .arsenal-visual canvas{display:none!important}
      html[data-kn-performance-mode="low"] body:before,
      html[data-kn-performance-mode="low"] body:after{animation:none!important}
      html[data-kn-performance-mode="low"] *{scroll-behavior:auto!important}
      @media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important}}
      body{overscroll-behavior-y:contain}
      .view{overscroll-behavior:contain;-webkit-overflow-scrolling:touch}
      .anime-card,.external-card,.settings-card{content-visibility:auto;contain-intrinsic-size:auto 320px}
      .kn62-performance-card h3{margin:0 0 8px}.kn62-performance-card p{margin:0;color:#aaa6c7;line-height:1.55}
      .kn62-performance-options{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:18px}
      .kn62-performance-options button{min-height:46px;border:1px solid rgba(141,129,205,.28);border-radius:13px;background:#17142b;color:#c8c3df;font-weight:900;cursor:pointer;touch-action:manipulation}
      .kn62-performance-options button[aria-pressed="true"]{border-color:rgba(79,225,255,.58);background:linear-gradient(135deg,rgba(61,113,255,.7),rgba(147,63,255,.72));color:#fff;box-shadow:0 8px 28px rgba(66,76,255,.22)}
      .kn62-performance-current{display:block;margin-top:12px;color:#e7e4ff!important;font-weight:750}
      @media(max-width:500px){.kn62-performance-options{grid-template-columns:1fr}.kn62-performance-options button{min-height:42px}}
    `;
    document.head.appendChild(style);
  };

  const pauseMedia=()=>{
    document.querySelectorAll('video,audio').forEach(media=>{
      if(!media.paused){media.dataset.kn62WasPlaying='1';media.pause()}
    });
  };

  const applyMode=next=>{
    mode=MODES.has(next)?next:'balanced';
    document.documentElement.dataset.knPerformanceMode=mode;
    try{localStorage.setItem(STORAGE_KEY,mode)}catch{}
    if(mode==='low')pauseMedia();
    window.dispatchEvent(new CustomEvent('kagenexus-performance-mode',{detail:{mode}}));
    document.querySelectorAll('[data-kn62-performance-option]').forEach(button=>{
      button.setAttribute('aria-pressed',String(button.dataset.kn62PerformanceOption===mode));
    });
    const current=document.getElementById('kn62PerformanceCurrent');
    if(current)current.textContent=MODE_COPY[mode];
  };

  const installSettings=()=>{
    ensureStyles();
    const grid=document.querySelector('#settingsView .settings-grid');
    if(!grid)return false;
    let card=document.getElementById('kn62PerformanceSettings');
    if(!card){
      card=document.createElement('article');
      card.id='kn62PerformanceSettings';
      card.className='glass-panel settings-card full-span kn62-performance-card';
      card.innerHTML=`
        <h3>Performance mode</h3>
        <p>Choose how much animation and background work KageNexus should use on this device.</p>
        <div class="kn62-performance-options" role="group" aria-label="KageNexus performance mode">
          <button type="button" data-kn62-performance-option="full">Full Effects</button>
          <button type="button" data-kn62-performance-option="balanced">Balanced</button>
          <button type="button" data-kn62-performance-option="low">Low Power</button>
        </div>
        <p class="kn62-performance-current" id="kn62PerformanceCurrent"></p>`;
      grid.prepend(card);
      card.addEventListener('click',event=>{
        const button=event.target.closest('[data-kn62-performance-option]');
        if(!button)return;
        applyMode(button.dataset.kn62PerformanceOption);
      });
    }
    applyMode(mode);
    return true;
  };

  const scheduleInstall=()=>{
    if(installQueued)return;
    installQueued=true;
    requestAnimationFrame(()=>{installQueued=false;installSettings()});
  };

  mode=readMode();
  document.documentElement.dataset.knPerformanceMode=mode;
  ensureStyles();

  document.addEventListener('visibilitychange',()=>{
    document.documentElement.toggleAttribute('data-kn-page-hidden',document.hidden);
    if(document.hidden)pauseMedia();
  });
  window.addEventListener('pagehide',pauseMedia,{once:true});
  window.addEventListener('kagenexus-ready',scheduleInstall);
  window.addEventListener('anime-haven-ready',scheduleInstall);

  const observer=new MutationObserver(records=>{
    const relevant=records.some(record=>[...record.addedNodes].some(node=>node instanceof Element&&(
      node.id==='settingsView'||node.matches?.('.settings-grid')||node.querySelector?.('#settingsView .settings-grid')
    )));
    if(relevant)scheduleInstall();
  });
  const startObserver=()=>{
    if(document.body)observer.observe(document.body,{childList:true,subtree:true});
    installSettings();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',startObserver,{once:true});
  else startObserver();
  window.addEventListener('pagehide',()=>observer.disconnect(),{once:true});
})();
