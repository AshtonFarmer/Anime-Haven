(()=>{
  'use strict';

  const style=document.createElement('style');
  style.id='kn-transform-hardfix-v25';
  style.textContent=`
    .kn-transform-card{
      -webkit-user-select:none!important;
      user-select:none!important;
      -webkit-touch-callout:none!important;
      touch-action:none!important;
    }
    .kn-transform-card [data-kn-original-content="25"]{
      transition:opacity .12s ease!important;
    }
    .kn-transform-card.kn-charging [data-kn-original-content="25"],
    .kn-transform-card.kn-unleashed [data-kn-original-content="25"],
    .kn-transform-card.kn-collapse [data-kn-original-content="25"]{
      display:none!important;
      opacity:0!important;
      visibility:hidden!important;
      pointer-events:none!important;
    }
    .kn-transform-card>.kn-power-layer{
      position:absolute!important;
      inset:0!important;
      z-index:500!important;
      display:block!important;
      opacity:1!important;
      visibility:visible!important;
      pointer-events:none!important;
    }
    .kn-transform-card>.kn-touch-shield{
      position:absolute!important;
      inset:0!important;
      z-index:600!important;
      display:block!important;
      -webkit-user-select:none!important;
      user-select:none!important;
      -webkit-touch-callout:none!important;
      touch-action:none!important;
    }
    .kn-transform-card .kn-stage-panel{
      position:absolute!important;
      left:12px!important;
      right:12px!important;
      top:auto!important;
      bottom:12px!important;
      z-index:550!important;
      display:grid!important;
      grid-template-columns:minmax(0,1fr) auto!important;
      grid-template-areas:"path percent" "name percent"!important;
      align-items:center!important;
      gap:4px 12px!important;
      width:auto!important;
      min-width:0!important;
      margin:0!important;
      padding:10px 12px!important;
      border:1px solid color-mix(in srgb,var(--kn-aura) 60%,transparent)!important;
      border-radius:14px!important;
      background:rgba(5,6,16,.96)!important;
      box-shadow:0 12px 30px rgba(0,0,0,.75),inset 0 0 18px color-mix(in srgb,var(--kn-aura) 13%,transparent)!important;
      text-align:left!important;
      opacity:0!important;
      visibility:hidden!important;
      transform:translateY(8px)!important;
    }
    .kn-transform-card.kn-charging .kn-stage-panel,
    .kn-transform-card.kn-unleashed .kn-stage-panel,
    .kn-transform-card.kn-collapse .kn-stage-panel{
      opacity:1!important;
      visibility:visible!important;
      transform:translateY(0)!important;
    }
    .kn-transform-card .kn-stage-path{grid-area:path!important;font-size:8px!important;line-height:1!important;white-space:nowrap!important}
    .kn-transform-card .kn-stage-name{grid-area:name!important;margin:3px 0 0!important;font-size:12px!important;line-height:1.05!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
    .kn-transform-card .kn-stage-percent{grid-area:percent!important;margin:0!important;font-size:9px!important;text-align:right!important;white-space:nowrap!important}
    .kn-transform-card .kn-stage-pips,
    .kn-transform-card .kn-meter{opacity:0!important;visibility:hidden!important}
    .kn-transform-card.kn-charging .kn-stage-pips,
    .kn-transform-card.kn-unleashed .kn-stage-pips,
    .kn-transform-card.kn-collapse .kn-stage-pips,
    .kn-transform-card.kn-charging .kn-meter,
    .kn-transform-card.kn-unleashed .kn-meter,
    .kn-transform-card.kn-collapse .kn-meter{opacity:1!important;visibility:visible!important}
    @media(max-width:480px){
      .kn-transform-card .kn-stage-panel{left:9px!important;right:9px!important;bottom:9px!important;padding:9px 10px!important}
      .kn-transform-card .kn-stage-name{font-size:10px!important}
      .kn-transform-card .kn-stage-percent{font-size:8px!important}
    }
  `;
  document.head.appendChild(style);

  const HOLD_TEXT=/hold to (unleash|transform)/i;

  function markOriginalContent(card){
    if(!(card instanceof Element))return;

    for(const node of [...card.childNodes]){
      if(node.nodeType===Node.TEXT_NODE && node.textContent.trim()){
        const span=document.createElement('span');
        span.dataset.knOriginalContent='25';
        span.textContent=node.textContent;
        node.replaceWith(span);
      }
    }

    for(const child of [...card.children]){
      if(child.classList.contains('kn-power-layer')||child.classList.contains('kn-touch-shield'))continue;
      child.dataset.knOriginalContent='25';
    }

    for(const node of [...card.querySelectorAll('*')]){
      if(node.closest('.kn-power-layer'))continue;
      if(node.children.length===0&&HOLD_TEXT.test((node.textContent||'').trim()))node.remove();
    }

    card.setAttribute('draggable','false');
  }

  function scan(root=document){
    if(root instanceof Element&&root.matches('.kn-transform-card'))markOriginalContent(root);
    root.querySelectorAll?.('.kn-transform-card').forEach(markOriginalContent);
  }

  scan();
  window.addEventListener('kagenexus-ready',()=>scan(),{passive:true});
  window.addEventListener('anime-haven-ready',()=>scan(),{passive:true});

  const observer=new MutationObserver(records=>{
    for(const record of records){
      if(record.type==='attributes'&&record.target instanceof Element&&record.target.matches('.kn-transform-card')){
        markOriginalContent(record.target);
        continue;
      }
      for(const node of record.addedNodes){
        if(node instanceof Element)scan(node);
      }
    }
  });
  observer.observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});

  const block=event=>{
    if(event.target instanceof Element&&event.target.closest('.kn-transform-card')){
      if(event.cancelable)event.preventDefault();
      document.getSelection?.()?.removeAllRanges?.();
    }
  };
  document.addEventListener('selectstart',block,true);
  document.addEventListener('contextmenu',block,true);
  document.addEventListener('dragstart',block,true);

  window.addEventListener('pagehide',()=>observer.disconnect(),{once:true});
})();
