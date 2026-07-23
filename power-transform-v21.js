(()=>{
  'use strict';

  const HOLD_MS=3100;
  const RESET_MS=520;
  const cards=new WeakMap();

  const PATHS={
    goku:{
      path:'GOKU PATH',
      title:'Watched + In Progress',
      match:['watched + in progress','watched and in progress'],
      stages:[
        {name:'BASE',aura:'#62dfff',aura2:'#ffffff',hair:'#111526'},
        {name:'SUPER SAIYAN',aura:'#ffc928',aura2:'#fff4a5',hair:'#ffd735'},
        {name:'SUPER SAIYAN 2',aura:'#ffe047',aura2:'#ffffff',hair:'#fff06a'},
        {name:'SUPER SAIYAN 3',aura:'#ffb91c',aura2:'#fff3a2',hair:'#ffc928'},
        {name:'SUPER SAIYAN GOD',aura:'#ff365f',aura2:'#ff9a75',hair:'#e92748'},
        {name:'SUPER SAIYAN BLUE',aura:'#00ccff',aura2:'#8ef4ff',hair:'#1ee4ff'},
        {name:'ULTRA INSTINCT',aura:'#c8d7ff',aura2:'#ffffff',hair:'#e8edff'}
      ]
    },
    vegeta:{
      path:'VEGETA PATH',
      title:"Haven't Started Yet",
      match:["haven't started yet",'havent started yet','not started'],
      stages:[
        {name:'BASE',aura:'#617dff',aura2:'#ffffff',hair:'#101323'},
        {name:'SUPER SAIYAN',aura:'#ffc928',aura2:'#fff1a0',hair:'#ffd735'},
        {name:'SUPER SAIYAN 2',aura:'#ffe24c',aura2:'#ffffff',hair:'#fff36f'},
        {name:'SUPER SAIYAN GOD',aura:'#ff335f',aura2:'#ff9b82',hair:'#e72c4e'},
        {name:'SUPER SAIYAN BLUE',aura:'#00bfff',aura2:'#8beaff',hair:'#24d4ff'},
        {name:'BLUE EVOLVED',aura:'#3155ff',aura2:'#a8c0ff',hair:'#426aff'},
        {name:'ULTRA EGO',aura:'#9b39ff',aura2:'#ff6bdc',hair:'#b348ff'}
      ]
    }
  };

  const norm=value=>String(value||'').toLowerCase().replace(/[’‘]/g,"'").replace(/\s+/g,' ').trim();

  function findCard(path){
    const candidates=[];
    for(const element of document.querySelectorAll('button,a,[role="button"],article,section,div')){
      if(element.closest('.kn-power-layer,.kn-touch-shield'))continue;
      const text=norm(element.innerText||element.textContent);
      if(!path.match.some(term=>text.includes(term)))continue;
      const rect=element.getBoundingClientRect();
      if(rect.width<260||rect.height<150||rect.height>560)continue;
      candidates.push({element,area:rect.width*rect.height,clickable:element.matches('button,a,[role="button"]')?0:1});
    }
    candidates.sort((a,b)=>a.clickable-b.clickable||a.area-b.area);
    return candidates[0]?.element||null;
  }

  function powerMarkup(path){
    return `
      <div class="kn-power-layer" aria-hidden="true">
        <div class="kn-aura"></div>
        <div class="kn-bolts">${'<i class="kn-bolt"></i>'.repeat(5)}</div>
        <div class="kn-warrior">
          <i class="kn-warrior-hair"></i>
          <i class="kn-warrior-head"></i>
          <i class="kn-warrior-body"></i>
        </div>
        <div class="kn-stage-pips">${path.stages.map(()=>'<i class="kn-stage-pip"></i>').join('')}</div>
        <div class="kn-stage-panel">
          <div class="kn-stage-path">${path.path}</div>
          <div class="kn-stage-name">HOLD TO TRANSFORM</div>
          <div class="kn-stage-percent">0% POWER</div>
        </div>
        <div class="kn-meter"><i class="kn-meter-fill"></i></div>
      </div>
      <span class="kn-touch-shield" aria-hidden="true"></span>`;
  }

  function setStage(state,index,progress){
    const stage=state.path.stages[index];
    state.stage=index;
    state.card.dataset.stage=String(index);
    state.card.style.setProperty('--kn-aura',stage.aura);
    state.card.style.setProperty('--kn-aura2',stage.aura2);
    state.card.style.setProperty('--kn-hair',stage.hair);
    state.card.style.setProperty('--kn-progress',String(progress));
    state.card.style.setProperty('--kn-intensity',String(Math.min(1,.14+progress*.92)));
    state.name.textContent=stage.name;
    state.percent.textContent=`${Math.round(progress*100)}% POWER`;
    state.pips.forEach((pip,i)=>pip.classList.toggle('kn-lit',i<=index));
    if(index!==state.lastBuzz){
      state.lastBuzz=index;
      try{navigator.vibrate?.(index===state.path.stages.length-1?[18,25,26]:10)}catch{}
    }
  }

  function resetVisual(state){
    const first=state.path.stages[0];
    state.card.classList.remove('kn-charging','kn-unleashed','kn-collapse');
    state.card.dataset.stage='0';
    state.card.style.setProperty('--kn-aura',first.aura);
    state.card.style.setProperty('--kn-aura2',first.aura2);
    state.card.style.setProperty('--kn-hair',first.hair);
    state.card.style.setProperty('--kn-progress','0');
    state.card.style.setProperty('--kn-intensity','0');
    state.name.textContent='HOLD TO TRANSFORM';
    state.percent.textContent='0% POWER';
    state.pips.forEach((pip,i)=>pip.classList.toggle('kn-lit',i===0));
    state.stage=0;
    state.lastBuzz=-1;
  }

  function stopFrame(state){
    if(state.frame){cancelAnimationFrame(state.frame);state.frame=0;}
  }

  function collapse(state){
    if(!state.charging||state.completed)return;
    state.charging=false;
    stopFrame(state);
    state.card.classList.remove('kn-charging');
    state.card.classList.add('kn-collapse');
    state.name.textContent='POWER RELEASED';
    state.percent.textContent='HOLD TO TRY AGAIN';
    state.card.style.setProperty('--kn-progress','0');
    state.card.style.setProperty('--kn-intensity','.12');
    state.suppressUntil=performance.now()+650;
    setTimeout(()=>resetVisual(state),RESET_MS);
  }

  function activateOriginal(state){
    state.allowClick=true;
    try{state.card.click()}finally{state.allowClick=false;}
  }

  function unleash(state){
    if(state.completed)return;
    state.completed=true;
    state.charging=false;
    stopFrame(state);
    const finalIndex=state.path.stages.length-1;
    setStage(state,finalIndex,1);
    state.card.classList.remove('kn-charging');
    state.card.classList.add('kn-unleashed');
    state.name.textContent=state.path.stages[finalIndex].name;
    state.percent.textContent='TRANSFORMATION COMPLETE';
    state.suppressUntil=performance.now()+1000;

    const flash=document.createElement('div');
    flash.className='kn-power-flash';
    flash.style.setProperty('--kn-flash',state.path.stages[finalIndex].aura);
    document.body.appendChild(flash);
    flash.addEventListener('animationend',()=>flash.remove(),{once:true});
    setTimeout(()=>flash.remove(),900);
    try{navigator.vibrate?.([24,25,35,20,55])}catch{}

    setTimeout(()=>activateOriginal(state),430);
    setTimeout(()=>{state.completed=false;resetVisual(state)},1050);
  }

  function beginCharge(state){
    if(state.charging||state.completed)return;
    document.getSelection?.()?.removeAllRanges?.();
    state.suppressUntil=performance.now()+HOLD_MS+900;
    state.charging=true;
    state.completed=false;
    state.started=performance.now();
    state.lastBuzz=-1;
    state.card.classList.remove('kn-collapse','kn-unleashed');
    state.card.classList.add('kn-charging');

    const tick=now=>{
      if(!state.charging)return;
      const progress=Math.min(1,(now-state.started)/HOLD_MS);
      const index=Math.min(state.path.stages.length-1,Math.floor(progress*state.path.stages.length));
      setStage(state,index,progress);
      if(progress>=1){unleash(state);return;}
      state.frame=requestAnimationFrame(tick);
    };
    state.frame=requestAnimationFrame(tick);
  }

  function stopNative(event){
    if(event.cancelable)event.preventDefault();
    event.stopPropagation();
  }

  function enhance(card,fighter,path){
    if(!card||cards.has(card)||card.dataset.knTransform==='21')return;

    card.querySelectorAll('.kn-power-layer,.kn-touch-shield').forEach(node=>node.remove());
    const oldHold=[...card.querySelectorAll('*')].find(element=>
      element.children.length===0&&/hold to (unleash|transform)/i.test(element.textContent||'')
    );
    if(oldHold)oldHold.dataset.knOriginalHold='1';

    card.dataset.knTransform='21';
    card.dataset.fighter=fighter;
    card.dataset.stage='0';
    card.classList.add('kn-transform-card');
    card.insertAdjacentHTML('beforeend',powerMarkup(path));
    card.setAttribute('aria-label',`${path.title}. Hold to transform through ${path.path.replace(' PATH','')} forms.`);
    card.setAttribute('draggable','false');

    const shield=card.querySelector('.kn-touch-shield');
    const state={
      card,shield,path,fighter,charging:false,completed:false,allowClick:false,suppressUntil:0,
      frame:0,stage:0,lastBuzz:-1,touchId:null,pointerId:null,
      name:card.querySelector('.kn-stage-name'),
      percent:card.querySelector('.kn-stage-percent'),
      pips:[...card.querySelectorAll('.kn-stage-pip')]
    };
    cards.set(card,state);
    resetVisual(state);

    shield.addEventListener('touchstart',event=>{
      if(event.touches.length!==1)return;
      stopNative(event);
      state.touchId=event.changedTouches[0]?.identifier??null;
      beginCharge(state);
    },{passive:false,capture:true});

    shield.addEventListener('touchmove',event=>{
      if(state.charging)stopNative(event);
    },{passive:false,capture:true});

    shield.addEventListener('touchend',event=>{
      stopNative(event);
      state.touchId=null;
      collapse(state);
    },{passive:false,capture:true});

    shield.addEventListener('touchcancel',event=>{
      stopNative(event);
      state.touchId=null;
      collapse(state);
    },{passive:false,capture:true});

    shield.addEventListener('pointerdown',event=>{
      if(event.pointerType==='touch')return;
      if(event.pointerType==='mouse'&&event.button!==0)return;
      stopNative(event);
      state.pointerId=event.pointerId;
      try{shield.setPointerCapture?.(event.pointerId)}catch{}
      beginCharge(state);
    },{capture:true});

    shield.addEventListener('pointerup',event=>{
      if(event.pointerType==='touch'||event.pointerId!==state.pointerId)return;
      stopNative(event);
      collapse(state);
    },{capture:true});

    shield.addEventListener('pointercancel',event=>{
      if(event.pointerType==='touch')return;
      stopNative(event);
      collapse(state);
    },{capture:true});

    shield.addEventListener('click',stopNative,true);
    shield.addEventListener('contextmenu',stopNative,true);
    shield.addEventListener('dragstart',stopNative,true);

    card.addEventListener('click',event=>{
      if(state.allowClick)return;
      event.preventDefault();
      event.stopImmediatePropagation();
    },true);
  }

  function scan(){
    for(const [fighter,path] of Object.entries(PATHS)){
      const card=findCard(path);
      if(card)enhance(card,fighter,path);
    }
  }

  function isTransformTarget(target){
    return target instanceof Element&&Boolean(target.closest('.kn-transform-card'));
  }

  for(const type of ['selectionstart','contextmenu','dragstart']){
    document.addEventListener(type,event=>{
      if(!isTransformTarget(event.target))return;
      if(event.cancelable)event.preventDefault();
      event.stopPropagation();
      document.getSelection?.()?.removeAllRanges?.();
    },true);
  }

  let scanQueued=false;
  function queueScan(){
    if(scanQueued)return;
    scanQueued=true;
    requestAnimationFrame(()=>{scanQueued=false;scan()});
  }

  scan();
  window.addEventListener('kagenexus-ready',queueScan);
  window.addEventListener('anime-haven-ready',queueScan);
  const observer=new MutationObserver(mutations=>{
    if(mutations.some(mutation=>mutation.addedNodes.length))queueScan();
  });
  observer.observe(document.documentElement,{childList:true,subtree:true});
  window.addEventListener('pagehide',()=>observer.disconnect(),{once:true});
})();
