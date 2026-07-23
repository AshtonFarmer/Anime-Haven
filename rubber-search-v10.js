(()=>{
  'use strict';
  const FIST_SVG=`<svg viewBox="0 0 144 104" aria-hidden="true" focusable="false"><defs><linearGradient id="v10Palm" x1=".18" y1=".05" x2=".86" y2=".94"><stop offset="0" stop-color="#ffe8d0"/><stop offset=".34" stop-color="#f4b287"/><stop offset=".7" stop-color="#d57855"/><stop offset="1" stop-color="#963d2d"/></linearGradient><linearGradient id="v10Finger" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff0dd"/><stop offset=".38" stop-color="#f0aa7d"/><stop offset=".76" stop-color="#c76348"/><stop offset="1" stop-color="#823123"/></linearGradient><linearGradient id="v10Nail" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#ffe6d0"/><stop offset="1" stop-color="#d99070"/></linearGradient><radialGradient id="v10Glow" cx="35%" cy="45%" r="65%"><stop offset="0" stop-color="#ffbe8d" stop-opacity=".72"/><stop offset=".55" stop-color="#ff6b42" stop-opacity=".22"/><stop offset="1" stop-color="#ff3b20" stop-opacity="0"/></radialGradient><pattern id="v10Texture" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r=".7" fill="#7b2e22" opacity=".16"/><circle cx="7" cy="6" r=".5" fill="#fff3e4" opacity=".19"/></pattern><filter id="v10Shadow" x="-35%" y="-35%" width="170%" height="180%"><feDropShadow dx="0" dy="5" stdDeviation="4" flood-color="#41150f" flood-opacity=".62"/></filter></defs><ellipse cx="66" cy="55" rx="66" ry="48" fill="url(#v10Glow)"/><g filter="url(#v10Shadow)" stroke="#64261c" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"><path fill="url(#v10Palm)" d="M139 35h-32c-8-12-20-19-36-20H45c-11 0-20 5-25 13l-4 7-8 2c-8 2-12 8-11 16 2 8 9 12 17 12h12l-12 7c-8 5-9 15-2 21 6 6 15 5 22 0l15-12c12 8 28 8 40 1l18-11h32Z"/><path fill="url(#v10Finger)" d="M8 35h35c9 0 15 6 15 15S52 65 43 65H8C-1 65-7 59-7 50S-1 35 8 35Z"/><path fill="url(#v10Finger)" d="M18 22h36c9 0 15 6 15 15s-6 15-15 15H18C9 52 3 46 3 37s6-15 15-15Z"/><path fill="url(#v10Finger)" d="M32 12h34c9 0 15 6 15 15s-6 15-15 15H32c-9 0-15-6-15-15s6-15 15-15Z"/><path fill="url(#v10Finger)" d="M51 13h30c9 0 15 6 15 15s-6 15-15 15H51c-9 0-15-6-15-15s6-15 15-15Z"/><path fill="url(#v10Palm)" d="M22 66c10-7 24-7 34 0l15 11c7 5 7 14 1 19-6 5-14 5-20 1l-13-9-9 9c-7 7-18 6-23-2-5-8-2-17 6-22Z"/><path fill="url(#v10Nail)" d="M5 43h22c5 0 8 3 8 7s-3 7-8 7H5c-5 0-8-3-8-7s3-7 8-7Z" opacity=".7"/><path fill="url(#v10Nail)" d="M16 29h23c5 0 8 3 8 7s-3 7-8 7H16c-5 0-8-3-8-7s3-7 8-7Z" opacity=".66"/><path d="M9 48h33M20 34h35M35 24h35M55 25h31M50 75c10-3 22 0 30 7M92 34c9 5 13 12 14 22" fill="none" stroke="#9a4936" stroke-width="2.6" opacity=".8"/></g><path d="M10 31c16-13 47-18 73-8M91 25c11 3 20 8 26 15M109 44h26" fill="none" stroke="#fff2e1" stroke-width="3.6" stroke-linecap="round" opacity=".62"/><path d="M5 68c15 4 28 2 41-5M81 73c12-3 22-9 28-19" fill="none" stroke="#6d291f" stroke-width="2.4" opacity=".42"/><path d="M0 0h144v104H0Z" fill="url(#v10Texture)" opacity=".35"/></svg>`;

  const install=()=>{
    const box=document.getElementById('rubberSearch');
    const button=document.getElementById('searchPunch');
    const input=document.getElementById('globalSearch');
    const fist=button?.querySelector('.fist');
    const arm=box?.querySelector('.arm-coil');
    if(!box||!button||!input||!fist||!arm)return false;
    if(box.dataset.rubberV10)return true;

    box.removeAttribute('data-luffy-v7');
    box.removeAttribute('data-luffy-v8');
    box.removeAttribute('data-luffy-v9');
    box.dataset.rubberV10='1';

    document.querySelectorAll('link[href*="luffy-search-v"],link[href*="rubber-search-v10"]').forEach(link=>link.remove());
    const link=document.createElement('link');
    link.rel='stylesheet';
    link.href='./rubber-search-v10.css?release=10';
    document.head.appendChild(link);

    fist.innerHTML=FIST_SVG;
    button.setAttribute('aria-label','Punch left to open anime search');

    box.querySelectorAll('.luffy-coil,.luffy-smoke,.luffy-impact,.v10-launcher,.v10-smoke,.v10-impact').forEach(node=>node.remove());

    const launcher=document.createElement('div');
    launcher.className='v10-launcher';
    launcher.setAttribute('aria-hidden','true');
    launcher.innerHTML='<div class="v10-wrist"></div><div class="v10-coils"><i></i><i></i><i></i><i></i></div>';

    const smoke=document.createElement('div');
    smoke.className='v10-smoke';
    smoke.setAttribute('aria-hidden','true');
    smoke.innerHTML='<i></i><i></i><i></i><i></i>';

    const impact=document.createElement('div');
    impact.className='v10-impact';
    impact.setAttribute('aria-hidden','true');

    box.append(launcher,smoke,impact);

    let phase='idle';
    let windTimer=0;
    let punchTimer=0;
    let retractTimer=0;
    let confirmTimer=0;

    const clearTimers=()=>{
      clearTimeout(windTimer);
      clearTimeout(punchTimer);
      clearTimeout(retractTimer);
      clearTimeout(confirmTimer);
    };

    const updateTravel=()=>{
      if(phase!=='idle'&&phase!=='open')return;
      const boxRect=box.getBoundingClientRect();
      const buttonRect=button.getBoundingClientRect();
      const desiredLeft=boxRect.left+2;
      const travel=Math.round(desiredLeft-buttonRect.left);
      box.style.setProperty('--travel-x',`${travel}px`);
    };

    const openSearch=()=>{
      if(phase!=='idle')return;
      updateTravel();
      phase='winding';
      box.classList.add('is-winding');
      windTimer=setTimeout(()=>{
        box.classList.remove('is-winding');
        box.classList.add('is-punching');
        phase='punching';
        punchTimer=setTimeout(()=>{
          box.classList.remove('is-punching');
          box.classList.add('open');
          phase='open';
          input.focus({preventScroll:true});
        },510);
      },175);
    };

    const retract=()=>{
      if(phase!=='open')return;
      phase='retracting';
      box.classList.add('is-retracting');
      input.blur();
      retractTimer=setTimeout(()=>{
        box.classList.remove('open','is-retracting','is-confirming');
        phase='idle';
        updateTravel();
      },315);
    };

    const confirm=()=>{
      box.classList.remove('is-confirming');
      void box.offsetWidth;
      box.classList.add('is-confirming');
      clearTimeout(confirmTimer);
      confirmTimer=setTimeout(()=>box.classList.remove('is-confirming'),330);
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

    window.addEventListener('resize',updateTravel,{passive:true});
    window.addEventListener('orientationchange',()=>setTimeout(updateTravel,120),{passive:true});
    window.addEventListener('pagehide',clearTimers,{once:true});
    requestAnimationFrame(updateTravel);
    return true;
  };

  if(install())return;
  window.addEventListener('anime-haven-ready',install,{once:true});
  let tries=0;
  const timer=setInterval(()=>{
    tries++;
    if(install()||tries>120)clearInterval(timer);
  },100);
})();