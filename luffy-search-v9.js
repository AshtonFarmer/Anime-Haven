(()=>{
  const FIST_SVG=`<svg viewBox="0 0 120 82" aria-hidden="true"><defs><linearGradient id="v9skin" x1=".2" y1="0" x2=".8" y2="1"><stop offset="0" stop-color="#ffe0c2"/><stop offset=".46" stop-color="#f0aa7a"/><stop offset="1" stop-color="#b9573d"/></linearGradient><linearGradient id="v9hi" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#ffe7cc"/><stop offset="1" stop-color="#d77f59"/></linearGradient></defs><g stroke="#713022" stroke-width="3" stroke-linejoin="round"><path fill="url(#v9skin)" d="M116 25H87c-4-9-14-15-26-15H42c-9 0-16 5-19 12l-2 5-7 1c-8 1-13 7-12 15 1 7 7 11 15 11h8l-8 5c-7 5-7 14 0 19 6 4 13 3 19-2l13-10c9 6 21 7 31 1l9-6h27Z"/><path fill="url(#v9hi)" d="M17 28h24c7 0 12 5 12 12s-5 12-12 12H17C9 52 4 47 4 40s5-12 13-12Z"/><path fill="url(#v9hi)" d="M24 18h24c7 0 12 5 12 11 0 7-5 12-12 12H24c-7 0-12-5-12-12 0-6 5-11 12-11Z"/><path fill="url(#v9hi)" d="M34 10h23c7 0 12 5 12 11 0 7-5 12-12 12H34c-7 0-12-5-12-12 0-6 5-11 12-11Z"/><path fill="url(#v9hi)" d="M50 12h20c7 0 12 5 12 11 0 7-5 12-12 12H50c-7 0-12-5-12-12 0-6 5-11 12-11Z"/><path fill="url(#v9skin)" d="M24 52c7-5 18-5 25 0l11 8c5 4 5 11 0 15-4 4-10 4-15 1l-10-7-7 7c-5 5-13 4-17-1-4-6-2-13 4-17Z"/><path d="M18 35h26M26 25h25M38 17h22M54 20h18M46 58c8-2 16 0 22 5" fill="none" stroke="#984631" stroke-width="2.1" stroke-linecap="round" opacity=".78"/></g><path d="M21 23c10-9 33-12 49-5M91 31h21" fill="none" stroke="#fff1de" stroke-width="3" stroke-linecap="round" opacity=".55"/></svg>`;

  const install=()=>{
    const box=document.getElementById('rubberSearch');
    const button=document.getElementById('searchPunch');
    const input=document.getElementById('globalSearch');
    const fist=button?.querySelector('.fist');
    const arm=box?.querySelector('.arm-coil');
    if(!box||!button||!input||!fist||!arm)return false;
    if(box.dataset.luffyV9)return true;

    delete box.dataset.luffyV7;
    delete box.dataset.luffyV8;
    box.dataset.luffyV9='1';

    const link=document.createElement('link');
    link.rel='stylesheet';
    link.href='./luffy-search-v9.css?v=9';
    document.head.appendChild(link);

    fist.innerHTML=FIST_SVG;
    button.setAttribute('aria-label','Punch left to open anime search');

    box.querySelectorAll('.luffy-coil,.luffy-smoke,.luffy-impact').forEach(node=>node.remove());
    const coil=document.createElement('div');
    coil.className='luffy-coil';
    const smoke=document.createElement('div');
    smoke.className='luffy-smoke';
    smoke.innerHTML='<i></i><i></i><i></i>';
    const impact=document.createElement('div');
    impact.className='luffy-impact';
    box.append(coil,smoke,impact);

    let phase='idle';
    let windTimer=0,punchTimer=0,retractTimer=0,confirmTimer=0;

    const updateTravel=()=>{
      const travel=Math.max(0,box.clientWidth-button.offsetWidth-4);
      box.style.setProperty('--punch-x',`${-travel}px`);
    };
    updateTravel();
    window.addEventListener('resize',updateTravel,{passive:true});

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
          input.focus();
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
      },305);
    };

    const confirm=()=>{
      box.classList.remove('is-confirming');
      void box.offsetWidth;
      box.classList.add('is-confirming');
      clearTimeout(confirmTimer);
      confirmTimer=setTimeout(()=>box.classList.remove('is-confirming'),320);
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

    window.addEventListener('pagehide',()=>{
      clearTimeout(windTimer);clearTimeout(punchTimer);clearTimeout(retractTimer);clearTimeout(confirmTimer);
    },{once:true});
    return true;
  };

  if(install())return;
  let tries=0;
  const timer=setInterval(()=>{tries++;if(install()||tries>180)clearInterval(timer)},100);
})();
