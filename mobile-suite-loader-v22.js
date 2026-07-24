(()=>{
  'use strict';
  const parts=[
    "data/mobile-suite/mobile-suite-v22.part00",
    "data/mobile-suite/mobile-suite-v22.part01",
    "data/mobile-suite/mobile-suite-v22.part02",
    "data/mobile-suite/mobile-suite-v22.part03",
    "data/mobile-suite/mobile-suite-v22.part04",
    "data/mobile-suite/mobile-suite-v22.part05a",
    "data/mobile-suite/mobile-suite-v22.part05b",
    "data/mobile-suite/mobile-suite-v22.part06",
    "data/mobile-suite/mobile-suite-v22.part07"
  ];
  const replacements=[
    ["    section.innerHTML=`<div class=\"kn-section-heading\">","    const signature=items.map(item=>[item.id,item.status,item.season,item.episode,item.updatedAt].join(':')).join('|');\n    if(section.dataset.knSignature===signature)return;\n    section.dataset.knSignature=signature;\n    section.innerHTML=`<div class=\"kn-section-heading\">"],
    ["      const item=map.get(titleKey(title));if(!item)return;\n      let row=$('.kn-card-actions',card);\n      const html=actionRow(item);\n      if(row){\n        const wrapper=document.createElement('div');wrapper.innerHTML=html;\n        row.replaceWith(wrapper.firstElementChild);\n      }else card.insertAdjacentHTML('beforeend',html);","      const item=map.get(titleKey(title));if(!item)return;\n      const signature=[item.id,item.mediaType,item.status,item.season,item.episode,item.updatedAt].join(':');\n      let row=$('.kn-card-actions',card);\n      if(row?.dataset.knSignature===signature){card.dataset.knItemId=item.id;return}\n      const wrapper=document.createElement('div');wrapper.innerHTML=actionRow(item);\n      const nextRow=wrapper.firstElementChild;nextRow.dataset.knSignature=signature;\n      if(row)row.replaceWith(nextRow);else card.appendChild(nextRow);"],
    ["  function renderContinue(){\n    const home=$('#homeView');","  function renderContinue(){\n    document.getElementById('knContinueWatching')?.remove();\n    return;\n    const home=$('#homeView');"],
    ["  function detectBottomNav(){\n    const labels=","  function detectBottomNav(){\n    if($('.kn-bottom-nav[data-kn-safe-nav=\"22\"]'))return;\n    const labels="],
    ["        node.classList.add('kn-bottom-nav');","        node.classList.add('kn-bottom-nav');node.dataset.knSafeNav='22';"],
    ["        setHeight();new ResizeObserver(setHeight).observe(node);return;","        setHeight();if('ResizeObserver' in window)new ResizeObserver(setHeight).observe(node);return;"],
    ["    const observer=new MutationObserver(records=>{if(records.some(record=>record.addedNodes.length))enhance()});","    const observer=new MutationObserver(records=>{\n      const relevant=records.some(record=>[...record.addedNodes].some(node=>node instanceof Element&&(node.matches('.anime-card,#homeView,#settingsView,#addAnimeDialog,#globalSearch,#rubberSearch')||node.querySelector?.('.anime-card,#homeView,#settingsView,#addAnimeDialog,#globalSearch,#rubberSearch'))));\n      if(relevant)enhance();\n    });"]
  ];
  const noSelectionCss=`
    button,button *,[role="button"],[role="button"]*,input[type="button"],input[type="submit"],input[type="reset"],.kn-bottom-nav a,.kn-bottom-nav a *{
      -webkit-user-select:none!important;
      user-select:none!important;
      -webkit-touch-callout:none!important;
      -webkit-tap-highlight-color:transparent!important;
      touch-action:manipulation;
    }
    input:not([type="button"]):not([type="submit"]):not([type="reset"]),textarea,[contenteditable="true"]{
      -webkit-user-select:text!important;
      user-select:text!important;
      -webkit-touch-callout:default!important;
    }
    #knGlobalSearchClose{display:none!important}
  `;
  const noSelectionSelector='button,[role="button"],input[type="button"],input[type="submit"],input[type="reset"],.kn-bottom-nav a';
  const installNoSelectionGuards=()=>{
    if(document.documentElement.dataset.knNoSelection==='22.2')return;
    document.documentElement.dataset.knNoSelection='22.2';
    const stopSelection=event=>{
      const target=event.target instanceof Element?event.target.closest(noSelectionSelector):null;
      if(target)event.preventDefault();
    };
    document.addEventListener('selectstart',stopSelection,true);
    document.addEventListener('contextmenu',stopSelection,true);
    document.addEventListener('dragstart',stopSelection,true);
  };
  const cleanHomeHero=()=>{
    document.getElementById('knGlobalSearchClose')?.remove();
    const home=document.getElementById('homeView');
    if(!home)return;
    const heading=[...home.querySelectorAll('h1,h2')].find(node=>/build your story/i.test(node.textContent||'')&&/never lose your place/i.test(node.textContent||''));
    if(!heading)return;
    const keeper=[...heading.querySelectorAll('*')].find(node=>!/build your story/i.test(node.textContent||'')&&/never lose your place/i.test(node.textContent||''));
    if(keeper)heading.replaceChildren(keeper.cloneNode(true));
    else heading.textContent='Never lose your place.';
  };
  const registerCleanWorker=async()=>{
    if(!('serviceWorker' in navigator))return;
    try{
      const registration=await navigator.serviceWorker.register('./sw-v26.js?release=26',{scope:'./',updateViaCache:'none'});
      await registration.update();
    }catch(error){console.error('KageNexus v26 worker registration failed',error)}
  };
  const decode=text=>{const bytes=Uint8Array.from(atob(text),c=>c.charCodeAt(0));return new TextDecoder().decode(bytes)};
  (async()=>{
    try{
      const chunks=await Promise.all(parts.map(path=>fetch(`./${path}?release=22`,{cache:'no-store'}).then(response=>{if(!response.ok)throw new Error(`Missing ${path}`);return response.text()})));
      const payload=JSON.parse(decode(chunks.join('').replace(/\s+/g,'')));
      let source=payload.js;
      for(const [before,after] of replacements){
        if(!source.includes(before))throw new Error('Mobile stability patch did not match');
        source=source.replace(before,after);
      }
      source=source
        .split('./sw-v2.js?release=22').join('./sw-v26.js?release=26')
        .split('./sw-v25.js?release=25').join('./sw-v26.js?release=26')
        .split('./sw-v25.js?release=25.1').join('./sw-v26.js?release=26');
      document.getElementById('knContinueWatching')?.remove();
      document.getElementById('kagenexus-mobile-suite-v22')?.remove();
      const style=document.createElement('style');style.id='kagenexus-mobile-suite-v22';style.textContent=payload.css+noSelectionCss;document.head.appendChild(style);
      installNoSelectionGuards();
      (0,eval)(source);
      cleanHomeHero();
      registerCleanWorker();
      const cleanupObserver=new MutationObserver(records=>{
        if(records.some(record=>[...record.addedNodes].some(node=>node instanceof Element&&(node.id==='knGlobalSearchClose'||node.id==='homeView'||node.querySelector?.('#knGlobalSearchClose,#homeView')))))cleanHomeHero();
      });
      cleanupObserver.observe(document.body,{childList:true,subtree:true});
    }catch(error){console.error('KageNexus mobile suite could not load',error);registerCleanWorker()}
  })();
})();
