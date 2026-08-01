(()=>{
  'use strict';

  const RELEASE='62';
  const WORKER_URL=`./sw-v35.js?release=${RELEASE}`;
  const LAST_RELEASE_KEY='kagenexus-last-seen-release';
  let refreshing=false;
  let updateCard=null;
  let appReady=false;
  let pendingNotice=null;
  let waitingWorker=null;

  const ensureStyles=()=>{
    if(document.getElementById('kn62-update-styles'))return;
    const style=document.createElement('style');
    style.id='kn62-update-styles';
    style.textContent=`
      .kn62-update-card{position:fixed;z-index:2147483600;left:max(14px,env(safe-area-inset-left));right:max(14px,env(safe-area-inset-right));bottom:calc(86px + env(safe-area-inset-bottom));max-width:560px;margin:auto;display:grid;grid-template-columns:1fr auto;gap:14px;align-items:center;padding:15px 16px;border:1px solid rgba(98,226,255,.35);border-radius:18px;background:rgba(11,10,31,.96);box-shadow:0 18px 60px rgba(0,0,0,.55),0 0 34px rgba(97,76,255,.25);backdrop-filter:blur(18px);color:#fff;font-family:Inter,ui-sans-serif,system-ui,-apple-system,sans-serif}
      .kn62-update-card[hidden]{display:none}
      .kn62-update-copy{min-width:0}.kn62-update-copy strong{display:block;font-size:14px;letter-spacing:.01em}.kn62-update-copy span{display:block;margin-top:3px;color:#b7b3d3;font-size:12px;line-height:1.35}
      .kn62-update-actions{display:flex;gap:8px;align-items:center}.kn62-update-actions button{min-height:40px;border:0;border-radius:12px;padding:0 14px;color:#fff;font-weight:900;cursor:pointer;touch-action:manipulation}
      .kn62-update-restart{background:linear-gradient(135deg,#4d78ff,#9d45ff)}.kn62-update-dismiss{background:#242039;color:#c9c5df!important}
      @media(max-width:520px){.kn62-update-card{grid-template-columns:1fr}.kn62-update-actions{justify-content:stretch}.kn62-update-actions button{flex:1}}
    `;
    document.head.appendChild(style);
  };

  const removeCard=()=>{
    updateCard?.remove();
    updateCard=null;
  };

  const showCard=notice=>{
    if(!appReady&&!document.getElementById('app')){pendingNotice=notice;return}
    const {title,message,worker,restart=false,timeout=0}=notice;
    ensureStyles();
    removeCard();
    const card=document.createElement('aside');
    card.className='kn62-update-card';
    card.setAttribute('role','status');
    card.setAttribute('aria-live','polite');
    card.innerHTML=`
      <div class="kn62-update-copy"><strong></strong><span></span></div>
      <div class="kn62-update-actions">
        ${restart?'<button class="kn62-update-dismiss" type="button">Later</button><button class="kn62-update-restart" type="button">Restart now</button>':'<button class="kn62-update-dismiss" type="button">OK</button>'}
      </div>`;
    card.querySelector('strong').textContent=title;
    card.querySelector('span').textContent=message;
    card.querySelector('.kn62-update-dismiss')?.addEventListener('click',removeCard);
    card.querySelector('.kn62-update-restart')?.addEventListener('click',()=>{
      const target=worker;
      if(!target)return;
      card.querySelectorAll('button').forEach(button=>button.disabled=true);
      card.querySelector('span').textContent='Installing the update…';
      target.postMessage({type:'SKIP_WAITING'});
    });
    document.body.appendChild(card);
    updateCard=card;
    if(timeout)window.setTimeout(()=>{if(updateCard===card)removeCard()},timeout);
  };

  const announceWaiting=worker=>{
    if(!worker)return;
    waitingWorker=worker;
    showCard({
      title:'KageNexus update ready',
      message:'Restart once to load the newest version without losing your library or progress.',
      worker,
      restart:true
    });
  };

  const announceRelease=()=>{
    if(waitingWorker)return;
    let previous='';
    try{previous=localStorage.getItem(LAST_RELEASE_KEY)||'';localStorage.setItem(LAST_RELEASE_KEY,RELEASE)}catch{}
    if(previous&&previous!==RELEASE){
      showCard({title:`KageNexus upgraded to release ${RELEASE}`,message:'The newest reliability and performance improvements are active.',timeout:6500});
    }
  };

  const watchRegistration=registration=>{
    if(registration.waiting&&navigator.serviceWorker.controller)announceWaiting(registration.waiting);
    registration.addEventListener('updatefound',()=>{
      const worker=registration.installing;
      if(!worker)return;
      worker.addEventListener('statechange',()=>{
        if(worker.state==='installed'&&navigator.serviceWorker.controller)announceWaiting(worker);
      });
    });
  };

  const install=async()=>{
    if(!('serviceWorker' in navigator))return;
    navigator.serviceWorker.addEventListener('controllerchange',()=>{
      if(refreshing)return;
      refreshing=true;
      window.location.reload();
    });
    try{
      const registration=await navigator.serviceWorker.register(WORKER_URL,{scope:'./',updateViaCache:'none'});
      watchRegistration(registration);
      window.setTimeout(()=>registration.update().catch(()=>{}),1200);
      const ready=()=>{
        appReady=true;
        if(pendingNotice){const notice=pendingNotice;pendingNotice=null;showCard(notice)}
        if(!waitingWorker)announceRelease();
      };
      if(document.getElementById('app'))ready();
      else{
        window.addEventListener('kagenexus-ready',ready,{once:true});
        window.setTimeout(ready,8000);
      }
    }catch(error){console.error('KageNexus update manager could not register the worker',error)}
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();
})();
