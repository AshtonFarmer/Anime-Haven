(()=>{
  'use strict';

  const CONTROL_SELECTOR=[
    'button',
    'a[href]',
    '[role="button"]',
    '[data-view]',
    '[data-route]',
    'input:not([type="range"])',
    'textarea',
    'select',
    'label[for]',
    'summary',
    '[contenteditable="true"]',
    '[tabindex]:not([tabindex="-1"])'
  ].join(',');
  const MOVE_THRESHOLD=8;
  const CLICK_BLOCK_MS=750;

  const getControl=target=>{
    if(!(target instanceof Element))return null;
    return target.closest(CONTROL_SELECTOR);
  };

  const markControls=root=>{
    if(!(root instanceof Element||root instanceof Document))return;
    if(root instanceof Element&&root.matches(CONTROL_SELECTOR))root.classList.add('ah-scroll-safe-control');
    root.querySelectorAll?.(CONTROL_SELECTOR).forEach(control=>control.classList.add('ah-scroll-safe-control'));
  };

  const install=()=>{
    if(document.documentElement.dataset.appScrollGuardV14)return;
    document.documentElement.dataset.appScrollGuardV14='1';

    const style=document.createElement('style');
    style.textContent='.ah-scroll-safe-control{touch-action:pan-y;-webkit-tap-highlight-color:transparent}input[type="range"].ah-scroll-safe-control{touch-action:auto}';
    document.head.appendChild(style);

    let trackedControl=null;
    let moved=false;
    let startX=0;
    let startY=0;
    let blockedControl=null;
    let suppressClicksUntil=0;

    const sameControl=(eventTarget,control)=>{
      if(!control||!(eventTarget instanceof Element))return false;
      const clicked=getControl(eventTarget);
      return clicked===control||control.contains(eventTarget)||Boolean(clicked&&clicked.contains(control));
    };

    const cancelActivation=event=>{
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
    };

    document.addEventListener('touchstart',event=>{
      if(event.touches.length!==1){
        trackedControl=null;
        moved=false;
        return;
      }
      trackedControl=getControl(event.target);
      moved=false;
      if(!trackedControl)return;
      startX=event.touches[0].clientX;
      startY=event.touches[0].clientY;
    },{capture:true,passive:true});

    document.addEventListener('touchmove',event=>{
      if(!trackedControl||event.touches.length!==1)return;
      const dx=event.touches[0].clientX-startX;
      const dy=event.touches[0].clientY-startY;
      if(Math.hypot(dx,dy)>=MOVE_THRESHOLD)moved=true;
    },{capture:true,passive:true});

    document.addEventListener('touchend',event=>{
      if(trackedControl&&moved){
        blockedControl=trackedControl;
        suppressClicksUntil=performance.now()+CLICK_BLOCK_MS;
        cancelActivation(event);
      }
      trackedControl=null;
      moved=false;
    },{capture:true,passive:false});

    document.addEventListener('touchcancel',()=>{
      trackedControl=null;
      moved=false;
    },{capture:true,passive:true});

    document.addEventListener('click',event=>{
      if(performance.now()>=suppressClicksUntil){
        blockedControl=null;
        return;
      }
      if(sameControl(event.target,blockedControl))cancelActivation(event);
    },true);

    markControls(document);
    const observer=new MutationObserver(records=>{
      records.forEach(record=>record.addedNodes.forEach(node=>markControls(node)));
    });
    observer.observe(document.body,{childList:true,subtree:true});

    window.addEventListener('pagehide',()=>observer.disconnect(),{once:true});
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();
  window.addEventListener('anime-haven-ready',()=>markControls(document));
})();
