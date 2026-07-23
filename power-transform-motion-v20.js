(()=>{
  'use strict';
  let frame=0;
  let settleTimer=0;

  function apply(card){
    const raw=getComputedStyle(card).getPropertyValue('--kn-progress');
    const progress=Math.max(0,Math.min(1,Number.parseFloat(raw)||0));
    const intensity=Math.min(1,.14+progress*.92);
    const set=(name,value)=>card.style.setProperty(name,value);
    set('--kn-shadow-outer',`${20+34*intensity}px`);
    set('--kn-shadow-inner',`${18+24*intensity}px`);
    set('--kn-layer-opacity',String(.08+intensity*.56));
    set('--kn-sheen-opacity',String(.12+intensity*.72));
    set('--kn-aura-opacity',String(.16+intensity*.76));
    set('--kn-aura-scale',String(.64+progress*.56));
    set('--kn-ring1-rotation',`${progress*-210}deg`);
    set('--kn-ring2-rotation',`${progress*260}deg`);
    set('--kn-warrior-opacity',String(.18+intensity*.78));
    set('--kn-warrior-y',`${8-progress*16}px`);
    set('--kn-warrior-scale',String(.86+progress*.14));
    set('--kn-bolts-opacity',String(intensity*.9));
    set('--kn-bolt-scale',String(.45+progress*.7));
    set('--kn-rays-rotation',`${progress*160}deg`);
    set('--kn-rays-scale',String(.78+progress*.35));
  }

  function loop(){
    const cards=[...document.querySelectorAll('.kn-transform-card')];
    cards.forEach(apply);
    if(cards.some(card=>card.classList.contains('kn-charging'))){
      frame=requestAnimationFrame(loop);
      return;
    }
    frame=0;
    clearTimeout(settleTimer);
    settleTimer=setTimeout(()=>document.querySelectorAll('.kn-transform-card').forEach(apply),1150);
  }

  function start(){
    if(frame)return;
    frame=requestAnimationFrame(loop);
  }

  document.addEventListener('pointerdown',()=>setTimeout(start,0),true);
  document.addEventListener('pointerup',start,true);
  document.addEventListener('pointercancel',start,true);
  window.addEventListener('kagenexus-ready',()=>setTimeout(start,0));
  window.addEventListener('anime-haven-ready',()=>setTimeout(start,0));

  const observer=new MutationObserver(mutations=>{
    if(mutations.some(mutation=>[...mutation.addedNodes].some(node=>node.nodeType===1)))start();
  });
  observer.observe(document.documentElement,{childList:true,subtree:true});
  window.addEventListener('pagehide',()=>{observer.disconnect();if(frame)cancelAnimationFrame(frame);clearTimeout(settleTimer)},{once:true});
  setTimeout(start,350);
})();
