(()=>{
  'use strict';

  const install=()=>{
    const box=document.getElementById('rubberSearch');
    const button=document.getElementById('searchPunch');
    const input=document.getElementById('globalSearch');
    const fist=button?.querySelector('.fist');
    if(!box||!button||!input||!fist)return false;
    if(box.dataset.hakiV13)return true;

    box.removeAttribute('data-haki-v12');
    box.removeAttribute('data-haki-v11');
    box.removeAttribute('data-rubber-v10');
    box.removeAttribute('data-luffy-v7');
    box.removeAttribute('data-luffy-v8');
    box.removeAttribute('data-luffy-v9');
    box.dataset.hakiV13='1';

    document.querySelectorAll('link[href*="luffy-search-v"],link[href*="rubber-search-v10"],link[href*="rubber-search-v11"],link[href*="rubber-search-v12"],link[href*="rubber-search-v13"]').forEach(link=>link.remove());
    const link=document.createElement('link');
    link.rel='stylesheet';
    link.href='./rubber-search-v13.css?release=13';
    document.head.appendChild(link);

    fist.textContent='';
    button.setAttribute('aria-label','Open Anime Haven search');
    box.querySelectorAll('.v10-launcher,.v10-smoke,.v10-impact,.v11-launcher,.v11-smoke,.v11-impact,.v11-search-glyph,.v12-stage,.v13-stage').forEach(node=>node.remove());

    const idleSrc='data:image/webp;base64,'+(window.__AH_HAKI_IDLE||'');
    const finalSrc='data:image/webp;base64,'+(window.__AH_HAKI_FINAL||'');
    if(!window.__AH_HAKI_IDLE||!window.__AH_HAKI_FINAL)return false;

    const stage=document.createElement('div');
    stage.className='v13-stage';
    stage.setAttribute('aria-hidden','true');
    stage.innerHTML=`
      <img class="v13-idle-art" alt="" draggable="false">
      <span class="v13-stretch"><i></i><i></i><i></i><i></i></span>
      <img class="v13-punch-art" alt="" draggable="false">
      <span class="v13-impact"><i></i><i></i><i></i></span>
      <img class="v13-final-art" alt="" draggable="false">
      <span class="v13-smoke"><i></i><i></i><i></i><i></i><i></i></span>
      <span class="v13-speed"><i></i><i></i><i></i><i></i></span>`;
    stage.querySelector('.v13-idle-art').src=idleSrc;
    stage.querySelector('.v13-punch-art').src=idleSrc;
    stage.querySelector('.v13-final-art').src=finalSrc;
    box.prepend(stage);

    let phase='idle';
    let windTimer=0;
    let punchTimer=0;
    let retractTimer=0;
    let confirmTimer=0;
    let autoplayTimer=0;
    const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    const clearTimers=()=>{
      clearTimeout(windTimer);
      clearTimeout(punchTimer);
      clearTimeout(retractTimer);
      clearTimeout(confirmTimer);
      clearTimeout(autoplayTimer);
    };

    const finishOpen=()=>{
      box.classList.remove('is-winding','is-punching');
      box.classList.add('open');
      phase='open';
      requestAnimationFrame(()=>input.focus({preventScroll:true}));
    };

    const openSearch=()=>{
      if(phase!=='idle')return;
      if(reduced){finishOpen();return;}
      phase='winding';
      box.classList.remove('open','is-retracting','is-confirming');
      box.classList.add('is-winding');
      windTimer=setTimeout(()=>{
        box.classList.remove('is-winding');
        box.classList.add('is-punching');
        phase='punching';
        punchTimer=setTimeout(finishOpen,720);
      },360);
    };

    const retract=()=>{
      if(phase!=='open')return;
      phase='retracting';
      box.classList.add('is-retracting');
      input.blur();
      retractTimer=setTimeout(()=>{
        box.classList.remove('open','is-retracting','is-confirming');
        phase='idle';
      },420);
    };

    const confirm=()=>{
      box.classList.remove('is-confirming');
      void box.offsetWidth;
      box.classList.add('is-confirming');
      clearTimeout(confirmTimer);
      confirmTimer=setTimeout(()=>box.classList.remove('is-confirming'),440);
    };

    button.addEventListener('click',event=>{
      if(phase==='idle'){
        event.preventDefault();
        event.stopImmediatePropagation();
        openSearch();
        return;
      }
      if(phase!=='open'){
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
      }
      if(!input.value.trim()){
        event.preventDefault();
        event.stopImmediatePropagation();
        retract();
        return;
      }
      confirm();
    },true);

    input.addEventListener('keydown',event=>{
      if(event.key==='Escape'){
        event.preventDefault();
        event.stopImmediatePropagation();
        retract();
      }else if(event.key==='Enter'){
        confirm();
      }
    },true);

    document.addEventListener('pointerdown',event=>{
      if(phase==='open'&&!box.contains(event.target)&&!input.value.trim())retract();
    },true);

    window.addEventListener('pagehide',clearTimers,{once:true});
    autoplayTimer=setTimeout(()=>{
      if(phase==='idle'&&!input.value&&document.visibilityState==='visible')openSearch();
    },820);
    return true;
  };

  if(install())return;
  window.addEventListener('anime-haven-ready',install,{once:true});
  let tries=0;
  const timer=setInterval(()=>{
    tries++;
    if(install()||tries>150)clearInterval(timer);
  },100);
})();
