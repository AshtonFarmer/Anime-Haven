(()=>{
  'use strict';

  const FIST_SVG=`<svg viewBox="0 0 180 124" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id="hakiPalm" x1=".12" y1=".08" x2=".9" y2=".94">
        <stop offset="0" stop-color="#3c3b46"/>
        <stop offset=".28" stop-color="#17151d"/>
        <stop offset=".68" stop-color="#09080d"/>
        <stop offset="1" stop-color="#020205"/>
      </linearGradient>
      <linearGradient id="hakiFinger" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#5a5764"/>
        <stop offset=".2" stop-color="#211e29"/>
        <stop offset=".75" stop-color="#07070b"/>
        <stop offset="1" stop-color="#000"/>
      </linearGradient>
      <radialGradient id="hakiGlow" cx="42%" cy="50%" r="64%">
        <stop offset="0" stop-color="#ff4b4b" stop-opacity=".64"/>
        <stop offset=".45" stop-color="#ef001f" stop-opacity=".18"/>
        <stop offset="1" stop-color="#ef001f" stop-opacity="0"/>
      </radialGradient>
      <filter id="hakiShadow" x="-45%" y="-55%" width="190%" height="215%">
        <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="#000" flood-opacity=".82"/>
        <feDropShadow dx="0" dy="0" stdDeviation="5" flood-color="#ff1738" flood-opacity=".55"/>
      </filter>
      <filter id="redGlow" x="-120%" y="-120%" width="340%" height="340%">
        <feGaussianBlur stdDeviation="2.1" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <pattern id="hakiTexture" width="12" height="12" patternUnits="userSpaceOnUse">
        <circle cx="3" cy="4" r=".7" fill="#fff" opacity=".07"/>
        <circle cx="9" cy="8" r=".55" fill="#ff2445" opacity=".14"/>
      </pattern>
    </defs>
    <ellipse cx="83" cy="62" rx="76" ry="53" fill="url(#hakiGlow)"/>
    <g filter="url(#hakiShadow)" stroke="#ff2946" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round">
      <path fill="url(#hakiPalm)" d="M176 33h-39c-9-13-23-22-41-24H60c-15 0-27 7-34 18l-5 8-12 4C1 42-3 51 1 59c3 8 11 12 20 12h14L19 81c-9 6-10 18-2 25 7 7 18 6 26 0l18-14c14 9 32 10 47 1l29-17h39Z"/>
      <path fill="url(#hakiFinger)" d="M9 36h42c11 0 19 8 19 19S62 74 51 74H9C-2 74-10 66-10 55S-2 36 9 36Z"/>
      <path fill="url(#hakiFinger)" d="M22 21h43c11 0 19 8 19 19S76 59 65 59H22C11 59 3 51 3 40s8-19 19-19Z"/>
      <path fill="url(#hakiFinger)" d="M40 10h41c11 0 19 8 19 19S92 48 81 48H40c-11 0-19-8-19-19s8-19 19-19Z"/>
      <path fill="url(#hakiFinger)" d="M65 12h36c11 0 19 8 19 19s-8 19-19 19H65c-11 0-19-8-19-19s8-19 19-19Z"/>
      <path fill="url(#hakiPalm)" d="M27 74c12-9 28-9 40 0l18 14c8 6 8 17 1 23-7 6-17 6-24 1L47 101l-11 11c-8 8-21 7-27-3-6-10-2-21 8-27Z"/>
    </g>
    <g fill="none" stroke="#ff2946" stroke-width="3" filter="url(#redGlow)" opacity=".92">
      <path d="M12 50 28 45l12 7 15-10 18 7 14-12 16 8 19-6"/>
      <path d="M21 86 39 80l15 8 16-11 18 7 16-10 19 5"/>
      <path d="M47 20 57 30l12-9 13 13 14-8 13 11"/>
      <path d="M106 47 116 58l15-7 13 13 17-7"/>
    </g>
    <g fill="none" stroke="#fff" stroke-width="3.3" stroke-linecap="round" opacity=".5">
      <path d="M18 35c19-15 58-21 90-10"/>
      <path d="M112 28c15 3 28 10 36 20"/>
      <path d="M15 77c20 5 39 2 55-7"/>
    </g>
    <path d="M0 0h180v124H0Z" fill="url(#hakiTexture)" opacity=".42"/>
  </svg>`;

  const install=()=>{
    const box=document.getElementById('rubberSearch');
    const button=document.getElementById('searchPunch');
    const input=document.getElementById('globalSearch');
    const fist=button?.querySelector('.fist');
    const arm=box?.querySelector('.arm-coil');
    if(!box||!button||!input||!fist||!arm)return false;
    if(box.dataset.hakiPunchV11)return true;

    box.removeAttribute('data-rubber-v10');
    box.removeAttribute('data-luffy-v9');
    box.dataset.hakiPunchV11='1';

    document.querySelectorAll('link[href*="rubber-search-v10"],link[href*="rubber-search-v11"],link[href*="luffy-search-v"]').forEach(link=>link.remove());
    const link=document.createElement('link');
    link.rel='stylesheet';
    link.href='./rubber-search-v11.css?release=11';
    document.head.appendChild(link);

    fist.innerHTML=FIST_SVG;
    button.setAttribute('aria-label','Punch left to open Anime Haven search');

    box.querySelectorAll('.v11-launcher,.v11-smoke,.v11-impact,.v11-sparks,.v11-search-glyph').forEach(node=>node.remove());

    const launcher=document.createElement('div');
    launcher.className='v11-launcher';
    launcher.setAttribute('aria-hidden','true');
    launcher.innerHTML='<div class="v11-arm-stub"></div><div class="v11-coils"><i></i><i></i><i></i><i></i></div>';

    const smoke=document.createElement('div');
    smoke.className='v11-smoke';
    smoke.setAttribute('aria-hidden','true');
    smoke.innerHTML='<i></i><i></i><i></i><i></i><i></i><i></i>';

    const sparks=document.createElement('div');
    sparks.className='v11-sparks';
    sparks.setAttribute('aria-hidden','true');
    sparks.innerHTML='<i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>';

    const impact=document.createElement('div');
    impact.className='v11-impact';
    impact.setAttribute('aria-hidden','true');

    const glyph=document.createElement('span');
    glyph.className='v11-search-glyph';
    glyph.setAttribute('aria-hidden','true');
    glyph.innerHTML='<svg viewBox="0 0 32 32"><circle cx="13" cy="13" r="8"></circle><path d="m19 19 8 8"></path></svg>';

    box.append(launcher,smoke,sparks,impact,glyph);

    let phase='idle';
    let windTimer=0;
    let punchTimer=0;
    let retractTimer=0;
    let confirmTimer=0;
    let introTimer=0;

    const clearTimers=()=>{
      clearTimeout(windTimer);
      clearTimeout(punchTimer);
      clearTimeout(retractTimer);
      clearTimeout(confirmTimer);
      clearTimeout(introTimer);
    };

    const updateTravel=()=>{
      if(phase!=='idle'&&phase!=='open')return;
      const boxRect=box.getBoundingClientRect();
      const buttonRect=button.getBoundingClientRect();
      const desiredLeft=boxRect.left+4;
      const travel=Math.round(desiredLeft-buttonRect.left);
      box.style.setProperty('--travel-x',`${travel}px`);
    };

    const finishOpen=({focus=true}={})=>{
      box.classList.remove('is-winding','is-punching');
      box.classList.add('open');
      phase='open';
      if(focus)input.focus({preventScroll:true});
    };

    const openSearch=({focus=true,instant=false}={})=>{
      if(phase!=='idle')return;
      updateTravel();
      if(instant){
        finishOpen({focus});
        return;
      }
      phase='winding';
      box.classList.add('is-winding');
      windTimer=setTimeout(()=>{
        box.classList.remove('is-winding');
        box.classList.add('is-punching');
        phase='punching';
        punchTimer=setTimeout(()=>finishOpen({focus}),620);
      },300);
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
      },390);
    };

    const confirm=()=>{
      if(phase!=='open')return;
      box.classList.remove('is-confirming');
      void box.offsetWidth;
      box.classList.add('is-confirming');
      clearTimeout(confirmTimer);
      confirmTimer=setTimeout(()=>box.classList.remove('is-confirming'),360);
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

    input.addEventListener('input',()=>box.classList.toggle('has-query',Boolean(input.value.trim())));

    document.addEventListener('pointerdown',event=>{
      if(phase==='open'&&!box.contains(event.target)&&!input.value.trim())retract();
    },true);

    window.addEventListener('resize',updateTravel,{passive:true});
    window.addEventListener('orientationchange',()=>setTimeout(updateTravel,120),{passive:true});
    window.addEventListener('pagehide',clearTimers,{once:true});

    requestAnimationFrame(()=>{
      updateTravel();
      const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      introTimer=setTimeout(()=>openSearch({focus:false,instant:reduced}),reduced?50:650);
    });
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
