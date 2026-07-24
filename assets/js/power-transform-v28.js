(()=>{
  'use strict';

  const HOLD_MS=3200;
  const RESET_MS=420;
  const controllers=new Map();

  const PATHS={
    goku:{
      title:'Watched + In Progress',
      match:['watched + in progress','watched and in progress'],
      path:'GOKU PATH',
      stages:[
        ['BASE','#62dfff','#ffffff','#111526'],
        ['SUPER SAIYAN','#ffc928','#fff4a5','#ffd735'],
        ['SUPER SAIYAN 2','#ffe047','#ffffff','#fff06a'],
        ['SUPER SAIYAN 3','#ffb91c','#fff3a2','#ffc928'],
        ['SUPER SAIYAN GOD','#ff365f','#ff9a75','#e92748'],
        ['SUPER SAIYAN BLUE','#00ccff','#8ef4ff','#1ee4ff'],
        ['ULTRA INSTINCT','#d7e2ff','#ffffff','#f1f4ff']
      ]
    },
    vegeta:{
      title:"Haven't Started Yet",
      match:["haven't started yet",'havent started yet','not started'],
      path:'VEGETA PATH',
      stages:[
        ['BASE','#617dff','#ffffff','#101323'],
        ['SUPER SAIYAN','#ffc928','#fff1a0','#ffd735'],
        ['SUPER SAIYAN 2','#ffe24c','#ffffff','#fff36f'],
        ['SUPER SAIYAN GOD','#ff335f','#ff9b82','#e72c4e'],
        ['SUPER SAIYAN BLUE','#00bfff','#8beaff','#24d4ff'],
        ['BLUE EVOLVED','#3155ff','#a8c0ff','#426aff'],
        ['ULTRA EGO','#9b39ff','#ff6bdc','#b348ff']
      ]
    }
  };

  const normalize=value=>String(value||'')
    .toLowerCase()
    .replace(/[’‘]/g,"'")
    .replace(/\s+/g,' ')
    .trim();

  const visible=element=>{
    if(!(element instanceof Element))return false;
    const rect=element.getBoundingClientRect();
    const style=getComputedStyle(element);
    return rect.width>0&&rect.height>0&&style.display!=='none'&&style.visibility!=='hidden';
  };

  function findAnchor(path){
    const matches=[];
    for(const element of document.querySelectorAll('h1,h2,h3,h4,strong,p,span,div')){
      if(!visible(element)||element.closest('.kn28-overlay,.kn28-shield'))continue;
      const text=normalize(element.textContent);
      if(!path.match.some(term=>text.includes(term))||text.length>180)continue;
      const rect=element.getBoundingClientRect();
      matches.push({element,area:rect.width*rect.height,textLength:text.length});
    }
    matches.sort((a,b)=>a.textLength-b.textLength||a.area-b.area);
    return matches[0]?.element||null;
  }

  function cardScore(element,path){
    const rect=element.getBoundingClientRect();
    if(rect.width<280||rect.height<170||rect.height>560||rect.width>1100)return -Infinity;
    const text=normalize(element.innerText||element.textContent);
    if(!path.match.some(term=>text.includes(term)))return -Infinity;
    const other=Object.values(PATHS).find(candidate=>candidate!==path);
    if(other.match.some(term=>text.includes(term)))return -Infinity;

    const style=getComputedStyle(element);
    const radius=parseFloat(style.borderTopLeftRadius)||0;
    const border=(parseFloat(style.borderTopWidth)||0)+(parseFloat(style.borderBottomWidth)||0);
    const background=(style.backgroundImage&&style.backgroundImage!=='none')||style.backgroundColor!=='rgba(0, 0, 0, 0)';
    const shadow=style.boxShadow&&style.boxShadow!=='none';
    const ratio=rect.width/rect.height;
    if(ratio<1.05||ratio>4.2)return -Infinity;

    return rect.width*rect.height+radius*9000+border*12000+(background?50000:0)+(shadow?35000:0);
  }

  function findCard(path){
    const anchor=findAnchor(path);
    if(!anchor)return null;
    const candidates=[];
    let node=anchor;
    const boundary=document.querySelector('#homeView')||document.body;
    while(node&&node!==boundary&&node!==document.body&&node!==document.documentElement){
      const score=cardScore(node,path);
      if(Number.isFinite(score))candidates.push({element:node,score});
      node=node.parentElement;
    }
    candidates.sort((a,b)=>b.score-a.score);
    return candidates[0]?.element||null;
  }

  function cleanupLegacy(root=document){
    root.querySelectorAll?.('.kn-power-layer,.kn-touch-shield,.kn28-overlay,.kn28-shield').forEach(node=>node.remove());
    root.querySelectorAll?.('.kn-transform-card,.kn28-card').forEach(card=>{
      card.classList.remove('kn-transform-card','kn-charging','kn-unleashed','kn-collapse','kn28-card','kn28-active','kn28-release','kn28-collapse');
      delete card.dataset.knTransform;
      delete card.dataset.fighter;
      delete card.dataset.stage;
      delete card.dataset.kn28Fighter;
      delete card.dataset.kn28Stage;
      card.querySelectorAll('[data-kn-original-content],[data-kn-original-hold],[data-kn28-original]').forEach(node=>{
        node.removeAttribute('data-kn-original-content');
        node.removeAttribute('data-kn-original-hold');
        node.removeAttribute('data-kn28-original');
      });
    });
  }

  function markup(path){
    return `<div class="kn28-overlay" aria-hidden="true">
      <div class="kn28-rays"></div>
      <div class="kn28-aura"><i></i><i></i></div>
      <div class="kn28-lightning">${'<b></b>'.repeat(7)}</div>
      <div class="kn28-warrior"><i class="kn28-hair"></i><i class="kn28-head"></i><i class="kn28-body"></i></div>
      <div class="kn28-pips">${path.stages.map(()=>'<i></i>').join('')}</div>
      <div class="kn28-hud"><span class="kn28-path">${path.path}</span><strong class="kn28-name">BASE</strong><em class="kn28-percent">0% POWER</em></div>
      <div class="kn28-meter"><i></i></div>
    </div><span class="kn28-shield" aria-hidden="true"></span>`;
  }

  function applyStage(state,index,progress){
    const [name,aura,aura2,hair]=state.path.stages[index];
    state.stage=index;
    state.card.dataset.kn28Stage=String(index);
    state.card.style.setProperty('--kn28-aura',aura);
    state.card.style.setProperty('--kn28-aura2',aura2);
    state.card.style.setProperty('--kn28-hair',hair);
    state.card.style.setProperty('--kn28-progress',String(progress));
    state.name.textContent=name;
    state.percent.textContent=`${Math.round(progress*100)}% POWER`;
    state.pips.forEach((pip,pipIndex)=>pip.classList.toggle('lit',pipIndex<=index));
    if(index!==state.lastBuzz){
      state.lastBuzz=index;
      try{navigator.vibrate?.(index===state.path.stages.length-1?[18,24,28]:9)}catch{}
    }
  }

  function reset(state){
    cancelAnimationFrame(state.frame);
    state.frame=0;
    state.charging=false;
    state.completed=false;
    state.card.classList.remove('kn28-active','kn28-release','kn28-collapse');
    applyStage(state,0,0);
    state.lastBuzz=-1;
  }

  function activateOriginal(state){
    state.allowClick=true;
    const clickTarget=state.clickTarget&&state.card.contains(state.clickTarget)?state.clickTarget:state.card;
    try{clickTarget.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,view:window}))}
    finally{state.allowClick=false}
  }

  function complete(state){
    if(state.completed)return;
    state.completed=true;
    state.charging=false;
    cancelAnimationFrame(state.frame);
    applyStage(state,state.path.stages.length-1,1);
    state.card.classList.remove('kn28-active');
    state.card.classList.add('kn28-release');
    state.percent.textContent='TRANSFORMATION COMPLETE';

    const finalStage=state.path.stages[state.path.stages.length-1];
    const flash=document.createElement('div');
    flash.className='kn28-flash';
    flash.style.setProperty('--kn28-flash',finalStage[1]);
    document.body.appendChild(flash);
    setTimeout(()=>flash.remove(),760);
    try{navigator.vibrate?.([22,22,34,18,50])}catch{}
    setTimeout(()=>activateOriginal(state),460);
    setTimeout(()=>reset(state),1100);
  }

  function start(state){
    if(state.charging||state.completed)return;
    document.getSelection?.()?.removeAllRanges?.();
    state.charging=true;
    state.started=performance.now();
    state.lastBuzz=-1;
    state.card.classList.remove('kn28-collapse','kn28-release');
    state.card.classList.add('kn28-active');

    const frame=now=>{
      if(!state.charging)return;
      const progress=Math.min(1,(now-state.started)/HOLD_MS);
      const index=Math.min(state.path.stages.length-1,Math.floor(progress*state.path.stages.length));
      applyStage(state,index,progress);
      if(progress>=1){complete(state);return}
      state.frame=requestAnimationFrame(frame);
    };
    state.frame=requestAnimationFrame(frame);
  }

  function cancel(state){
    if(!state.charging||state.completed)return;
    state.charging=false;
    cancelAnimationFrame(state.frame);
    state.card.classList.remove('kn28-active');
    state.card.classList.add('kn28-collapse');
    state.name.textContent='POWER RELEASED';
    state.percent.textContent='HOLD AGAIN';
    setTimeout(()=>reset(state),RESET_MS);
  }

  function stop(event){
    if(event.cancelable)event.preventDefault();
    event.stopPropagation();
  }

  function findClickTarget(card,anchor){
    const ancestor=anchor?.closest('button,a,[role="button"]');
    if(ancestor&&card.contains(ancestor))return ancestor;
    return card.matches('button,a,[role="button"]')?card:card.querySelector('button,a,[role="button"]')||card;
  }

  function attach(card,fighter,path){
    if(!card||controllers.has(card))return;
    const anchor=findAnchor(path);
    card.querySelectorAll('.kn-power-layer,.kn-touch-shield,.kn28-overlay,.kn28-shield').forEach(node=>node.remove());
    card.classList.remove('kn-transform-card','kn-charging','kn-unleashed','kn-collapse');
    card.classList.add('kn28-card');
    card.dataset.kn28Fighter=fighter;
    card.dataset.kn28Stage='0';
    card.setAttribute('draggable','false');

    for(const child of [...card.children])child.dataset.kn28Original='1';
    card.insertAdjacentHTML('beforeend',markup(path));

    const state={
      card,path,fighter,anchor,clickTarget:findClickTarget(card,anchor),allowClick:false,
      charging:false,completed:false,frame:0,started:0,stage:0,lastBuzz:-1,
      shield:card.querySelector('.kn28-shield'),
      name:card.querySelector('.kn28-name'),
      percent:card.querySelector('.kn28-percent'),
      pips:[...card.querySelectorAll('.kn28-pips i')]
    };
    controllers.set(card,state);
    applyStage(state,0,0);

    const shield=state.shield;
    shield.addEventListener('touchstart',event=>{if(event.touches.length===1){stop(event);start(state)}},{passive:false,capture:true});
    shield.addEventListener('touchmove',event=>{if(state.charging)stop(event)},{passive:false,capture:true});
    shield.addEventListener('touchend',event=>{stop(event);cancel(state)},{passive:false,capture:true});
    shield.addEventListener('touchcancel',event=>{stop(event);cancel(state)},{passive:false,capture:true});
    shield.addEventListener('pointerdown',event=>{
      if(event.pointerType==='touch'||(event.pointerType==='mouse'&&event.button!==0))return;
      stop(event);
      try{shield.setPointerCapture?.(event.pointerId)}catch{}
      start(state);
    },true);
    shield.addEventListener('pointerup',event=>{if(event.pointerType!=='touch'){stop(event);cancel(state)}},true);
    shield.addEventListener('pointercancel',event=>{if(event.pointerType!=='touch'){stop(event);cancel(state)}},true);
    for(const type of ['click','contextmenu','dragstart','selectstart'])shield.addEventListener(type,stop,true);

    card.addEventListener('click',event=>{
      if(state.allowClick)return;
      event.preventDefault();
      event.stopImmediatePropagation();
    },true);
  }

  function scan(){
    cleanupLegacy();
    controllers.clear();
    for(const [fighter,path] of Object.entries(PATHS)){
      const card=findCard(path);
      if(card)attach(card,fighter,path);
    }
  }

  let timer=0;
  function schedule(){clearTimeout(timer);timer=setTimeout(scan,80)}

  for(const type of ['selectstart','contextmenu','dragstart']){
    document.addEventListener(type,event=>{
      if(event.target instanceof Element&&event.target.closest('.kn28-card')){
        if(event.cancelable)event.preventDefault();
        document.getSelection?.()?.removeAllRanges?.();
      }
    },true);
  }

  scan();
  window.addEventListener('kagenexus-ready',schedule);
  window.addEventListener('anime-haven-ready',schedule);
  const observer=new MutationObserver(records=>{
    if(records.some(record=>[...record.addedNodes].some(node=>node instanceof Element&&(node.matches?.('#homeView')||node.querySelector?.('#homeView')))))schedule();
  });
  observer.observe(document.documentElement,{childList:true,subtree:true});
  window.addEventListener('pagehide',()=>observer.disconnect(),{once:true});
})();
