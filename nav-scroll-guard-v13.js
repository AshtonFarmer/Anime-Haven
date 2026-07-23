(()=>{
  'use strict';

  const NAV_LABELS=['home','archive','unstarted','settings'];
  const CONTROL_SELECTOR='button,a,[role="button"],[data-view],[data-route],[tabindex]';
  const MOVE_THRESHOLD=8;
  const CLICK_BLOCK_MS=850;

  const normalize=value=>String(value||'').trim().toLowerCase().replace(/\s+/g,' ');

  const getNavControl=target=>{
    if(!(target instanceof Element))return null;
    const control=target.closest(CONTROL_SELECTOR);
    if(!control)return null;
    const label=normalize(`${control.getAttribute('aria-label')||''} ${control.textContent||''}`);
    return NAV_LABELS.some(name=>label===name||label.startsWith(`${name} `)||label.endsWith(` ${name}`))?control:null;
  };

  const markNavControls=()=>{
    document.querySelectorAll(CONTROL_SELECTOR).forEach(control=>{
      if(getNavControl(control))control.classList.add('ah-scroll-safe-nav');
    });
  };

  const install=()=>{
    if(document.documentElement.dataset.navScrollGuardV13)return;
    document.documentElement.dataset.navScrollGuardV13='1';

    const style=document.createElement('style');
    style.textContent='.ah-scroll-safe-nav{touch-action:pan-y!important;-webkit-tap-highlight-color:transparent}';
    document.head.appendChild(style);

    let tracking=false;
    let moved=false;
    let startX=0;
    let startY=0;
    let suppressClicksUntil=0;

    const stopAccidentalNavigation=event=>{
      if(!getNavControl(event.target))return;
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
    };

    document.addEventListener('touchstart',event=>{
      if(event.touches.length!==1){
        tracking=false;
        moved=false;
        return;
      }
      tracking=Boolean(getNavControl(event.target));
      moved=false;
      if(!tracking)return;
      startX=event.touches[0].clientX;
      startY=event.touches[0].clientY;
    },{capture:true,passive:true});

    document.addEventListener('touchmove',event=>{
      if(!tracking||event.touches.length!==1)return;
      const dx=event.touches[0].clientX-startX;
      const dy=event.touches[0].clientY-startY;
      if(Math.hypot(dx,dy)>=MOVE_THRESHOLD)moved=true;
    },{capture:true,passive:true});

    document.addEventListener('touchend',event=>{
      if(tracking&&moved){
        suppressClicksUntil=performance.now()+CLICK_BLOCK_MS;
        stopAccidentalNavigation(event);
      }
      tracking=false;
      moved=false;
    },{capture:true,passive:false});

    document.addEventListener('touchcancel',()=>{
      tracking=false;
      moved=false;
    },{capture:true,passive:true});

    document.addEventListener('click',event=>{
      if(performance.now()<suppressClicksUntil)stopAccidentalNavigation(event);
    },true);

    markNavControls();
    const observer=new MutationObserver(markNavControls);
    observer.observe(document.body,{childList:true,subtree:true});

    window.addEventListener('pagehide',()=>observer.disconnect(),{once:true});
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();
  window.addEventListener('anime-haven-ready',markNavControls);
})();
