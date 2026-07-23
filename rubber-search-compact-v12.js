(()=>{
  'use strict';

  const install=()=>{
    const box=document.getElementById('rubberSearch');
    const button=document.getElementById('searchPunch');
    const input=document.getElementById('globalSearch');
    if(!box||!button||!input||!box.dataset.hakiPunchV11)return false;
    if(box.dataset.compactV12)return true;

    box.dataset.compactV12='1';

    if(!document.querySelector('link[href*="rubber-search-compact-v12.css"]')){
      const link=document.createElement('link');
      link.rel='stylesheet';
      link.href='./rubber-search-compact-v12.css?release=12';
      document.head.appendChild(link);
    }

    let firstOpenHandled=false;
    let autoRetractTimer=0;

    const queueFirstAutoRetract=()=>{
      if(firstOpenHandled||!box.classList.contains('open'))return;
      firstOpenHandled=true;
      clearTimeout(autoRetractTimer);
      autoRetractTimer=setTimeout(()=>{
        const untouched=!input.value.trim()&&document.activeElement!==input;
        if(box.classList.contains('open')&&untouched)button.click();
      },4200);
    };

    const observer=new MutationObserver(queueFirstAutoRetract);
    observer.observe(box,{attributes:true,attributeFilter:['class']});
    queueFirstAutoRetract();

    input.addEventListener('focus',()=>clearTimeout(autoRetractTimer),{once:true});
    input.addEventListener('input',()=>{
      if(input.value.trim())clearTimeout(autoRetractTimer);
    },{passive:true});

    window.addEventListener('pagehide',()=>{
      clearTimeout(autoRetractTimer);
      observer.disconnect();
    },{once:true});

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
