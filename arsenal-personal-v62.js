(()=>{
  'use strict';

  const FAVORITES_KEY='kagenexus-arsenal-favorites-v1';
  const RECENTS_KEY='kagenexus-arsenal-recents-v1';
  const MAX_RECENTS=12;
  let queued=false;

  const readList=key=>{try{const value=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(value)?value:[]}catch{return []}};
  const writeList=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));return true}catch{return false}};
  const recordFromCard=card=>({
    id:card.dataset.arsenalId||'',
    name:card.querySelector('h3')?.textContent?.trim()||'Unknown entry',
    owner:card.querySelector('.arsenal-owner')?.textContent?.trim()||'',
    anime:card.querySelector('.arsenal-anime')?.textContent?.trim()||'',
    type:card.dataset.arsenalType||'weapon'
  });
  const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

  const ensureStyles=()=>{
    if(document.getElementById('kn62-arsenal-personal-styles'))return;
    const style=document.createElement('style');
    style.id='kn62-arsenal-personal-styles';
    style.textContent=`
      .kn62-favorite-button{position:absolute;z-index:8;top:12px;right:12px;width:40px;height:40px;display:grid;place-items:center;border:1px solid rgba(255,255,255,.2);border-radius:13px;background:rgba(8,8,24,.82);color:#d8d4ed;font-size:20px;cursor:pointer;backdrop-filter:blur(10px);touch-action:manipulation}
      .kn62-favorite-button[aria-pressed="true"]{border-color:rgba(255,94,164,.7);background:linear-gradient(135deg,rgba(255,49,128,.88),rgba(139,58,255,.9));color:#fff;box-shadow:0 8px 26px rgba(255,40,137,.28)}
      .kn62-arsenal-personal{margin:12px 0 18px;padding:14px;border:1px solid rgba(113,223,255,.2);border-radius:18px;background:rgba(11,10,30,.74)}
      .kn62-arsenal-personal-head{display:flex;justify-content:space-between;align-items:center;gap:12px}.kn62-arsenal-personal-head strong{font-size:13px}.kn62-arsenal-personal-head span{color:#9793b4;font-size:10px;letter-spacing:.1em}
      .kn62-arsenal-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:11px}.kn62-arsenal-actions button{min-height:38px;border:1px solid rgba(136,124,200,.25);border-radius:12px;padding:0 12px;background:#17142c;color:#d9d5ed;font-weight:850;cursor:pointer;touch-action:manipulation}.kn62-arsenal-actions button:disabled{opacity:.45}
      .kn62-arsenal-drawer{display:grid;gap:7px;margin-top:11px}.kn62-arsenal-drawer[hidden]{display:none}.kn62-arsenal-entry{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px;align-items:center;width:100%;min-height:44px;border:1px solid rgba(136,124,200,.18);border-radius:12px;padding:8px 10px;background:rgba(8,8,23,.7);color:#fff;text-align:left;cursor:pointer}.kn62-arsenal-entry span{min-width:0}.kn62-arsenal-entry strong{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px}.kn62-arsenal-entry small{display:block;margin-top:3px;color:#9591ad;font-size:10px}.kn62-arsenal-entry b{color:#55e5ff;font-size:9px;letter-spacing:.1em}
      .arsenal-media-failed.kn62-retry-ready{pointer-events:auto;cursor:pointer;text-decoration:underline;text-underline-offset:3px}
    `;
    document.head.appendChild(style);
  };

  const updateFavoriteButtons=()=>{
    const favoriteIds=new Set(readList(FAVORITES_KEY).map(item=>item.id));
    document.querySelectorAll('.kn62-favorite-button').forEach(button=>{
      const active=favoriteIds.has(button.dataset.arsenalId);
      button.setAttribute('aria-pressed',String(active));
      button.setAttribute('aria-label',active?'Remove from My Arsenal':'Save to My Arsenal');
      button.textContent=active?'♥':'♡';
    });
  };

  const toggleFavorite=card=>{
    const record=recordFromCard(card);
    let favorites=readList(FAVORITES_KEY);
    const exists=favorites.some(item=>item.id===record.id);
    favorites=exists?favorites.filter(item=>item.id!==record.id):[record,...favorites];
    writeList(FAVORITES_KEY,favorites);
    updateFavoriteButtons();
    renderPanel();
  };

  const addRecent=card=>{
    const record=recordFromCard(card);
    const recents=[record,...readList(RECENTS_KEY).filter(item=>item.id!==record.id)].slice(0,MAX_RECENTS);
    writeList(RECENTS_KEY,recents);
    renderPanel();
  };

  const enhanceCards=root=>{
    root.querySelectorAll?.('.arsenal-card[data-arsenal-id]').forEach(card=>{
      if(card.querySelector('.kn62-favorite-button'))return;
      const button=document.createElement('button');
      button.type='button';
      button.className='kn62-favorite-button';
      button.dataset.arsenalId=card.dataset.arsenalId;
      button.addEventListener('click',event=>{
        event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();
        toggleFavorite(card);
      });
      card.appendChild(button);
    });
    updateFavoriteButtons();
  };

  const searchEntry=entry=>{
    const input=document.getElementById('arsenalSearch');
    if(!input)return;
    input.value=entry.name;
    input.dispatchEvent(new Event('input',{bubbles:true}));
    document.querySelector('.arsenal-toolbar')?.scrollIntoView({behavior:document.documentElement.dataset.knPerformanceMode==='low'?'auto':'smooth',block:'start'});
  };

  const panelMarkup=(items,label)=>items.length
    ? items.map(item=>`<button class="kn62-arsenal-entry" type="button" data-kn62-entry-id="${escapeHtml(item.id)}" data-kn62-entry-source="${label}"><span><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml([item.owner,item.anime].filter(Boolean).join(' • '))}</small></span><b>FIND</b></button>`).join('')
    : '<div class="kn62-arsenal-entry"><span><strong>Nothing saved yet</strong><small>Tap the heart on an Arsenal card.</small></span></div>';

  const renderPanel=()=>{
    ensureStyles();
    const section=document.getElementById('arsenalView');
    const results=section?.querySelector('.arsenal-results-line');
    if(!section||!results)return false;
    let panel=document.getElementById('kn62ArsenalPersonal');
    if(!panel){
      panel=document.createElement('section');
      panel.id='kn62ArsenalPersonal';
      panel.className='kn62-arsenal-personal';
      results.insertAdjacentElement('afterend',panel);
      panel.addEventListener('click',event=>{
        const action=event.target.closest('[data-kn62-arsenal-action]');
        if(action){
          const source=action.dataset.kn62ArsenalAction;
          if(source==='random'){
            const favorites=readList(FAVORITES_KEY);
            if(favorites.length)searchEntry(favorites[Math.floor(Math.random()*favorites.length)]);
            return;
          }
          const drawer=panel.querySelector('.kn62-arsenal-drawer');
          const items=source==='favorites'?readList(FAVORITES_KEY):readList(RECENTS_KEY);
          drawer.dataset.source=source;
          drawer.innerHTML=panelMarkup(items,source);
          drawer.hidden=false;
          return;
        }
        const entryButton=event.target.closest('[data-kn62-entry-id]');
        if(!entryButton)return;
        const source=entryButton.dataset.kn62EntrySource;
        const entry=readList(source==='favorites'?FAVORITES_KEY:RECENTS_KEY).find(item=>item.id===entryButton.dataset.kn62EntryId);
        if(entry)searchEntry(entry);
      });
    }
    const favorites=readList(FAVORITES_KEY);
    const recents=readList(RECENTS_KEY);
    const source=panel.querySelector('.kn62-arsenal-drawer')?.dataset.source||'';
    panel.innerHTML=`
      <div class="kn62-arsenal-personal-head"><strong>My Arsenal</strong><span>SAVED ON THIS DEVICE</span></div>
      <div class="kn62-arsenal-actions">
        <button type="button" data-kn62-arsenal-action="favorites">♥ FAVORITES ${favorites.length}</button>
        <button type="button" data-kn62-arsenal-action="recents">RECENTLY VIEWED ${recents.length}</button>
        <button type="button" data-kn62-arsenal-action="random" ${favorites.length?'':'disabled'}>RANDOM FAVORITE</button>
      </div>
      <div class="kn62-arsenal-drawer" data-source="${escapeHtml(source)}" hidden></div>`;
    return true;
  };

  const prepareRetries=root=>{
    root.querySelectorAll?.('.arsenal-media-failed').forEach(label=>{
      if(label.dataset.kn62Retry)return;
      label.dataset.kn62Retry='1';
      label.classList.add('kn62-retry-ready');
      label.textContent='REAL MEDIA UNAVAILABLE — TAP TO RETRY';
      label.setAttribute('role','button');
      label.tabIndex=0;
    });
  };

  const retryMedia=label=>{
    const shell=label.closest('.arsenal-media-shell');
    const media=shell?.querySelector('[data-arsenal-media-src]');
    const source=media?.dataset.arsenalMediaSrc;
    if(!media||!source)return;
    shell.classList.remove('media-failed','media-loaded');
    label.textContent='RETRYING REAL MEDIA…';
    const finish=success=>{
      shell.classList.toggle('media-loaded',success);
      shell.classList.toggle('media-failed',!success);
      label.textContent=success?'MEDIA RESTORED':'REAL MEDIA UNAVAILABLE — TAP TO RETRY';
    };
    media.onload=()=>finish(true);
    media.onerror=()=>finish(false);
    const separator=source.includes('?')?'&':'?';
    media.src=`${source}${separator}knmanualretry=${Date.now()}`;
  };

  const install=()=>{
    ensureStyles();
    const section=document.getElementById('arsenalView');
    if(!section)return false;
    enhanceCards(section);
    prepareRetries(section);
    renderPanel();
    return true;
  };

  document.addEventListener('click',event=>{
    const card=event.target.closest('.arsenal-card[data-arsenal-id]');
    if(card&&!event.target.closest('.kn62-favorite-button'))addRecent(card);
    const retry=event.target.closest('.arsenal-media-failed.kn62-retry-ready');
    if(retry){event.preventDefault();event.stopPropagation();retryMedia(retry)}
  },true);
  document.addEventListener('keydown',event=>{
    if((event.key==='Enter'||event.key===' ')&&event.target.matches?.('.arsenal-media-failed.kn62-retry-ready')){
      event.preventDefault();retryMedia(event.target);
    }
  });

  const schedule=()=>{
    if(queued)return;
    queued=true;
    requestAnimationFrame(()=>{queued=false;install()});
  };
  window.addEventListener('kagenexus-ready',schedule);
  window.addEventListener('anime-haven-ready',schedule);
  const start=()=>{
    install();
    const observer=new MutationObserver(records=>{
      const relevant=records.some(record=>[...record.addedNodes].some(node=>node instanceof Element&&(
        node.id==='arsenalView'||node.matches?.('.arsenal-card,.arsenal-media-failed')||node.querySelector?.('.arsenal-card,.arsenal-media-failed,#arsenalView')
      )));
      if(relevant)schedule();
    });
    observer.observe(document.body,{childList:true,subtree:true});
    window.addEventListener('pagehide',()=>observer.disconnect(),{once:true});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
