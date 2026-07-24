(()=>{
  'use strict';

  const HOLD_TEXT=/^hold to (unleash|transform)$/i;

  function cleanCard(card){
    if(!(card instanceof Element))return;
    card.querySelectorAll('*').forEach(node=>{
      if(node.closest('.kn-power-layer'))return;
      if(node.children.length)return;
      if(HOLD_TEXT.test((node.textContent||'').trim()))node.remove();
    });
    card.setAttribute('draggable','false');
    card.querySelectorAll('img,a').forEach(node=>node.setAttribute('draggable','false'));
  }

  function scan(root=document){
    if(root instanceof Element&&root.matches('.kn-transform-card'))cleanCard(root);
    root.querySelectorAll?.('.kn-transform-card').forEach(cleanCard);
  }

  scan();
  window.addEventListener('kagenexus-ready',()=>scan(),{passive:true});
  window.addEventListener('anime-haven-ready',()=>scan(),{passive:true});

  document.addEventListener('selectstart',event=>{
    if(event.target instanceof Element&&event.target.closest('.kn-transform-card'))event.preventDefault();
  },true);
  document.addEventListener('contextmenu',event=>{
    if(event.target instanceof Element&&event.target.closest('.kn-transform-card'))event.preventDefault();
  },true);
  document.addEventListener('dragstart',event=>{
    if(event.target instanceof Element&&event.target.closest('.kn-transform-card'))event.preventDefault();
  },true);

  const observer=new MutationObserver(records=>{
    for(const record of records){
      for(const node of record.addedNodes){
        if(node instanceof Element)scan(node);
      }
    }
  });
  observer.observe(document.documentElement,{childList:true,subtree:true});
  window.addEventListener('pagehide',()=>observer.disconnect(),{once:true});
})();
