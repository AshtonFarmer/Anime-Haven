(()=>{
  'use strict';

  const STORAGE_KEY='anime-haven-state-v2';
  const IMPORT_SAFETY_KEY='kagenexus-import-safety-v1';
  const RELEASE='22';
  const MAX_CONTINUE=5;
  const $=(selector,root=document)=>root.querySelector(selector);
  const $$=(selector,root=document)=>[...root.querySelectorAll(selector)];
  const now=()=>new Date().toISOString();
  const titleKey=value=>String(value||'').normalize('NFKD').toLowerCase().replace(/[’'×:–—\-]/g,' ').replace(/[^a-z0-9]+/g,' ').trim();
  const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,char=>({"&":'&amp;',"<":'&lt;',">":'&gt;',"\"":'&quot;',"'":'&#39;'}[char]));

  function readState(){
    try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||'null')}catch(error){console.warn('KageNexus could not read saved progress',error);return null}
  }
  function writeState(state){
    try{
      state.updatedAt=now();
      localStorage.setItem(STORAGE_KEY,JSON.stringify(state));
      return true;
    }catch(error){
      console.error('KageNexus could not save progress',error);
      showToast('Progress could not be saved on this device.','error');
      return false;
    }
  }
  function profileOf(state){
    return state?.profiles?.find(profile=>profile.id===state.activeProfileId)||state?.profiles?.find(profile=>profile.id==='ashton')||state?.profiles?.[0]||null;
  }
  function itemOf(state,id,title){
    const profile=profileOf(state);
    if(!profile)return null;
    return profile.items?.find(item=>String(item.id)===String(id))||profile.items?.find(item=>titleKey(item.title)===titleKey(title))||null;
  }
  function progressText(item){
    if(item.mediaType==='movie')return item.status==='completed'?'Movie watched':'Movie not watched';
    if(item.status==='planned'||Number(item.episode||0)<=0)return 'Haven’t started yet';
    if(item.status==='completed')return 'Completed';
    return `Season ${Math.max(1,Number(item.season)||1)} Episode ${Math.max(0,Number(item.episode)||0)}`;
  }
  function touchItem(item){item.updatedAt=now();item.progressNote=progressText(item)}
  function updateStreak(state){
    const today=new Date();
    const day=today.toISOString().slice(0,10);
    if(state.streak?.lastLogDate===day)return;
    const yesterday=new Date(today);yesterday.setDate(today.getDate()-1);
    const previous=state.streak?.lastLogDate;
    state.streak=state.streak||{lastLogDate:null,days:0};
    state.streak.days=previous===yesterday.toISOString().slice(0,10)?Math.max(1,Number(state.streak.days)||0)+1:1;
    state.streak.lastLogDate=day;
  }
  function saveReload(state,message){
    if(!writeState(state))return;
    if(message)sessionStorage.setItem('kagenexus-mobile-flash',message);
    location.reload();
  }
  function mutateItem(id,title,mutation,message){
    const state=readState();
    const item=itemOf(state,id,title);
    if(!state||!item){showToast('That title could not be found.','error');return}
    mutation(item,state);
    touchItem(item);
    saveReload(state,typeof message==='function'?message(item):message);
  }

  function plusEpisode(item,state){
    if(item.mediaType==='movie'){
      item.status='completed';item.season=0;item.episode=1;item.totalEpisodes=1;
      return;
    }
    const wasPlanned=item.status==='planned';
    item.status='watching';
    item.season=Math.max(1,Number(item.season)||1);
    item.episode=wasPlanned?1:Math.max(0,Number(item.episode)||0)+1;
    item.episodesLogged=Math.max(0,Number(item.episodesLogged)||0)+1;
    updateStreak(state);
  }
  function minusEpisode(item){
    if(item.mediaType==='movie'){
      item.status='planned';item.season=0;item.episode=0;
      return;
    }
    item.episode=Math.max(0,(Number(item.episode)||0)-1);
    item.episodesLogged=Math.max(0,(Number(item.episodesLogged)||0)-1);
    item.status=item.episode===0&&Math.max(1,Number(item.season)||1)===1?'planned':'watching';
  }
  function changeSeason(item,delta){
    if(item.mediaType==='movie')return;
    item.season=Math.max(1,(Number(item.season)||1)+delta);
    if(item.status==='planned'&&item.episode>0)item.status='watching';
  }
  function markComplete(item){
    item.status='completed';
    if(item.mediaType==='movie'){
      item.season=0;item.episode=1;item.totalEpisodes=1;
    }else{
      item.season=Math.max(1,Number(item.season)||1);
      item.completedSeasons=Math.max(Number(item.completedSeasons)||0,item.season);
    }
  }
  function moveToUnstarted(item){
    item.status='planned';
    if(item.mediaType==='movie'){
      item.season=0;item.episode=0;
    }else{
      item.season=1;item.episode=0;item.completedSeasons=0;
    }
  }

  let toastTimer=0;
  function showToast(message,tone='default',action){
    let toast=$('#knMobileToast');
    if(!toast){
      toast=document.createElement('div');toast.id='knMobileToast';toast.className='kn-mobile-toast';document.body.appendChild(toast);
    }
    clearTimeout(toastTimer);
    toast.className=`kn-mobile-toast show ${tone}`;
    toast.innerHTML=`<span>${escapeHtml(message)}</span>${action?`<button type="button">${escapeHtml(action.label)}</button>`:''}`;
    const button=$('button',toast);
    if(button)button.addEventListener('click',()=>{action.run();toast.classList.remove('show')},{once:true});
    toastTimer=setTimeout(()=>toast.classList.remove('show'),action?7000:3200);
  }
  function showSavedFlash(){
    const message=sessionStorage.getItem('kagenexus-mobile-flash');
    if(!message)return;
    sessionStorage.removeItem('kagenexus-mobile-flash');
    setTimeout(()=>showToast(message,'success'),260);
  }

  function continueItems(){
    const state=readState();
    const profile=profileOf(state);
    if(!profile)return [];
    return profile.items
      .filter(item=>item.mediaType!=='movie'&&item.status==='watching')
      .sort((a,b)=>String(b.updatedAt||'').localeCompare(String(a.updatedAt||''))||String(a.title).localeCompare(String(b.title)))
      .slice(0,MAX_CONTINUE);
  }
  function continueMarkup(item){
    const cover=item.coverImage?`style="background-image:url('${String(item.coverImage).replace(/'/g,'%27')}')"`:'';
    return `<article class="kn-continue-card" data-item-id="${escapeHtml(item.id)}" data-title="${escapeHtml(item.title)}">
      <div class="kn-continue-cover" ${cover}><span>${escapeHtml((item.title||'?').slice(0,1))}</span></div>
      <div class="kn-continue-copy"><p>CONTINUE WATCHING</p><h3>${escapeHtml(item.title)}</h3><strong>S${Math.max(1,Number(item.season)||1)} E${Math.max(0,Number(item.episode)||0)}</strong></div>
      <div class="kn-continue-controls">
        <button type="button" data-kn-action="minus" aria-label="Subtract one episode">−</button>
        <button type="button" class="season" data-kn-action="sheet">S${Math.max(1,Number(item.season)||1)}</button>
        <button type="button" data-kn-action="plus" aria-label="Add one episode">＋</button>
      </div>
    </article>`;
  }
  function renderContinue(){
    document.getElementById('knContinueWatching')?.remove();
    return;
    const home=$('#homeView');
    if(!home)return;
    let section=$('#knContinueWatching');
    const items=continueItems();
    if(!items.length){section?.remove();return}
    if(!section){
      section=document.createElement('section');section.id='knContinueWatching';section.className='kn-continue-section';
      const anchor=$('#homeAddAnime')||$('.home-add-anime',home)||$('.hero-copy',home);
      anchor?.insertAdjacentElement('afterend',section);
    }
    const signature=items.map(item=>[item.id,item.status,item.season,item.episode,item.updatedAt].join(':')).join('|');
    if(section.dataset.knSignature===signature)return;
    section.dataset.knSignature=signature;
    section.innerHTML=`<div class="kn-section-heading"><div><p>JUMP BACK IN</p><h2>Continue Watching</h2></div><span>${items.length} recent</span></div><div class="kn-continue-rail">${items.map(continueMarkup).join('')}</div>`;
  }

  function actionRow(item){
    const id=escapeHtml(item.id),title=escapeHtml(item.title);
    if(item.mediaType==='movie'){
      return `<div class="kn-card-actions" data-item-id="${id}" data-title="${title}">
        <button type="button" data-kn-action="movie-toggle">${item.status==='completed'?'MARK UNWATCHED':'MARK WATCHED'}</button>
        <button type="button" data-kn-action="sheet">MORE</button>
      </div>`;
    }
    return `<div class="kn-card-actions" data-item-id="${id}" data-title="${title}">
      <button type="button" data-kn-action="minus">− EP</button>
      <button type="button" data-kn-action="sheet">S${Math.max(1,Number(item.season)||1)}</button>
      <button type="button" class="primary" data-kn-action="plus">＋ EP</button>
      <button type="button" data-kn-action="complete">COMPLETE</button>
      <button type="button" data-kn-action="unstarted">UNSTARTED</button>
    </div>`;
  }
  function enhanceAnimeCards(root=document){
    const state=readState();const profile=profileOf(state);if(!profile)return;
    const map=new Map(profile.items.map(item=>[titleKey(item.title),item]));
    $$('.anime-card',root).forEach(card=>{
      if(card.dataset.externalId)return;
      const title=$('h3',card)?.textContent||'';
      const item=map.get(titleKey(title));if(!item)return;
      const signature=[item.id,item.mediaType,item.status,item.season,item.episode,item.updatedAt].join(':');
      let row=$('.kn-card-actions',card);
      if(row?.dataset.knSignature===signature){card.dataset.knItemId=item.id;return}
      const wrapper=document.createElement('div');wrapper.innerHTML=actionRow(item);
      const nextRow=wrapper.firstElementChild;nextRow.dataset.knSignature=signature;
      if(row)row.replaceWith(nextRow);else card.appendChild(nextRow);
      card.dataset.knItemId=item.id;
    });
  }

  function ensureQuickSheet(){
    let sheet=$('#knQuickSheet');
    if(sheet)return sheet;
    sheet=document.createElement('dialog');sheet.id='knQuickSheet';sheet.className='kn-quick-sheet';
    sheet.innerHTML='<div class="kn-sheet-panel"><div class="kn-sheet-grabber"></div><button class="kn-sheet-close" type="button">CLOSE</button><div id="knSheetBody"></div></div>';
    document.body.appendChild(sheet);
    $('.kn-sheet-close',sheet).addEventListener('click',()=>sheet.close());
    sheet.addEventListener('click',event=>{if(event.target===sheet)sheet.close()});
    sheet.addEventListener('close',unlockBody);
    return sheet;
  }
  function openQuickSheet(id,title){
    const state=readState();const item=itemOf(state,id,title);if(!item)return;
    const sheet=ensureQuickSheet();
    const body=$('#knSheetBody',sheet);
    body.innerHTML=`<p class="kn-sheet-kicker">QUICK ACTIONS</p><h2>${escapeHtml(item.title)}</h2><div class="kn-sheet-progress">${item.mediaType==='movie'?(item.status==='completed'?'Watched':'Not watched'):`Season ${Math.max(1,Number(item.season)||1)} • Episode ${Math.max(0,Number(item.episode)||0)}`}</div>
      <div class="kn-sheet-actions" data-item-id="${escapeHtml(item.id)}" data-title="${escapeHtml(item.title)}">
        ${item.mediaType==='movie'?`<button data-kn-action="movie-toggle">${item.status==='completed'?'MARK UNWATCHED':'MARK WATCHED'}</button>`:`<button data-kn-action="season-minus">− SEASON</button><button data-kn-action="season-plus">＋ SEASON</button><button data-kn-action="minus">− EPISODE</button><button data-kn-action="plus">＋ EPISODE</button><button data-kn-action="complete">MARK COMPLETE</button><button class="danger" data-kn-action="unstarted">MOVE TO UNSTARTED</button>`}
      </div>`;
    lockBody();sheet.showModal();
  }

  function confirmUnstarted(id,title){
    const state=readState();const item=itemOf(state,id,title);if(!item)return;
    const label=item.mediaType==='movie'?'mark this movie not watched':'move this title to Haven’t Started Yet and reset its current season and episode';
    if(!confirm(`Are you sure you want to ${label}?`))return;
    try{sessionStorage.setItem('kagenexus-undo-item',JSON.stringify({item:typeof structuredClone==='function'?structuredClone(item):JSON.parse(JSON.stringify(item)),at:Date.now()}))}catch{}
    moveToUnstarted(item);touchItem(item);saveReload(state,`${item.title} moved to Unstarted.`);
  }

  function handleAction(button){
    const container=button.closest('[data-item-id]');
    const id=container?.dataset.itemId,title=container?.dataset.title;
    if(!id&&!title)return;
    const action=button.dataset.knAction;
    if(action==='sheet'){openQuickSheet(id,title);return}
    if(action==='unstarted'){confirmUnstarted(id,title);return}
    if(action==='plus')mutateItem(id,title,plusEpisode,item=>`${item.title}: ${progressText(item)}`);
    else if(action==='minus')mutateItem(id,title,minusEpisode,item=>`${item.title}: ${progressText(item)}`);
    else if(action==='season-plus')mutateItem(id,title,item=>changeSeason(item,1),item=>`${item.title}: ${progressText(item)}`);
    else if(action==='season-minus')mutateItem(id,title,item=>changeSeason(item,-1),item=>`${item.title}: ${progressText(item)}`);
    else if(action==='complete')mutateItem(id,title,markComplete,item=>`${item.title} marked complete.`);
    else if(action==='movie-toggle')mutateItem(id,title,item=>{if(item.status==='completed')moveToUnstarted(item);else markComplete(item)},item=>`${item.title}: ${item.status==='completed'?'Watched':'Not watched'}`);
  }

  function setupActionDelegation(){
    document.addEventListener('click',event=>{
      const button=event.target.closest('[data-kn-action]');if(!button)return;
      event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();
      handleAction(button);
    },true);
    document.addEventListener('pointerdown',event=>{
      if(event.target.closest('[data-kn-action]'))event.stopPropagation();
    },true);
  }

  function bytesToBase64(bytes){
    let binary='';const chunk=0x8000;
    for(let i=0;i<bytes.length;i+=chunk)binary+=String.fromCharCode(...bytes.subarray(i,i+chunk));
    return btoa(binary);
  }
  function base64ToBytes(value){
    const binary=atob(value.replace(/\s+/g,''));
    const bytes=new Uint8Array(binary.length);
    for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);
    return bytes;
  }
  function backupPayload(){
    const state=readState();if(!state)throw new Error('No KageNexus progress was found.');
    return {app:'KageNexus',schema:1,exportedAt:now(),state};
  }
  function backupJson(){return JSON.stringify(backupPayload(),null,2)}
  function backupFilename(){return `kagenexus-backup-${new Date().toISOString().slice(0,10)}.json`}
  function downloadBackup(){
    try{
      const url=URL.createObjectURL(new Blob([backupJson()],{type:'application/json'}));
      const anchor=document.createElement('a');anchor.href=url;anchor.download=backupFilename();document.body.appendChild(anchor);anchor.click();anchor.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
      showToast('Backup downloaded.','success');
    }catch(error){showToast(error.message||'Backup could not be created.','error')}
  }
  async function shareBackup(){
    try{
      const file=new File([backupJson()],backupFilename(),{type:'application/json'});
      if(navigator.canShare?.({files:[file]})){await navigator.share({title:'KageNexus Backup',text:'My KageNexus anime progress backup',files:[file]});return}
      downloadBackup();
    }catch(error){if(error?.name!=='AbortError')showToast(error.message||'Backup could not be shared.','error')}
  }
  async function copySyncCode(){
    try{
      const code=`KNX1.${bytesToBase64(new TextEncoder().encode(JSON.stringify(backupPayload())))}`;
      await navigator.clipboard.writeText(code);
      showToast('Sync code copied. Paste it on your other device.','success');
    }catch(error){showToast('The sync code could not be copied. Use Export Backup instead.','error')}
  }
  function validatePayload(payload){
    const state=payload?.state||payload;
    if(!state||!Array.isArray(state.profiles)||!state.profiles.some(profile=>Array.isArray(profile.items)))throw new Error('That is not a valid KageNexus backup.');
    return state;
  }
  function mergeStates(current,incoming){
    if(!current)return incoming;
    const merged=JSON.parse(JSON.stringify(current));
    merged.profiles=merged.profiles||[];
    for(const incomingProfile of incoming.profiles||[]){
      let target=merged.profiles.find(profile=>profile.id===incomingProfile.id)||merged.profiles.find(profile=>profile.name===incomingProfile.name);
      if(!target){merged.profiles.push(incomingProfile);continue}
      target.items=target.items||[];
      const byId=new Map(target.items.map(item=>[String(item.id),item]));
      const byTitle=new Map(target.items.map(item=>[titleKey(item.title),item]));
      for(const incomingItem of incomingProfile.items||[]){
        const existing=byId.get(String(incomingItem.id))||byTitle.get(titleKey(incomingItem.title));
        if(!existing){target.items.push(incomingItem);continue}
        const incomingTime=Date.parse(incomingItem.updatedAt||0)||0;
        const existingTime=Date.parse(existing.updatedAt||0)||0;
        if(incomingTime>=existingTime)Object.assign(existing,incomingItem);
      }
    }
    const incomingUpdated=Date.parse(incoming.updatedAt||0)||0;
    const currentUpdated=Date.parse(current.updatedAt||0)||0;
    if(incomingUpdated>currentUpdated){
      merged.streak=incoming.streak||merged.streak;
      merged.filter=incoming.filter??merged.filter;
      merged.sort=incoming.sort??merged.sort;
    }
    merged.updatedAt=now();
    return merged;
  }
  function importPayload(payload){
    const incoming=validatePayload(payload);
    const current=readState();
    try{localStorage.setItem(IMPORT_SAFETY_KEY,JSON.stringify({savedAt:now(),state:current}))}catch{}
    const merged=mergeStates(current,incoming);
    if(!writeState(merged))return;
    sessionStorage.setItem('kagenexus-mobile-flash','Backup merged. Your newest progress was kept for every title.');
    location.reload();
  }
  async function importFile(file){
    try{importPayload(JSON.parse(await file.text()))}catch(error){showToast(error.message||'That backup could not be imported.','error')}
  }
  function ensureSyncCodeDialog(){
    let dialog=$('#knSyncCodeDialog');if(dialog)return dialog;
    dialog=document.createElement('dialog');dialog.id='knSyncCodeDialog';dialog.className='kn-sync-dialog';
    dialog.innerHTML='<form method="dialog" class="kn-sync-panel"><button class="kn-sync-close" value="cancel">CLOSE</button><p>MANUAL CROSS-DEVICE SYNC</p><h2>Paste Sync Code</h2><textarea id="knSyncCodeInput" placeholder="Paste the KNX1 sync code from your other device"></textarea><button id="knImportSyncCode" type="button">IMPORT & MERGE</button></form>';
    document.body.appendChild(dialog);
    $('#knImportSyncCode',dialog).addEventListener('click',()=>{
      try{
        const value=$('#knSyncCodeInput',dialog).value.trim();
        if(!value.startsWith('KNX1.'))throw new Error('That sync code is not valid.');
        const json=new TextDecoder().decode(base64ToBytes(value.slice(5)));
        importPayload(JSON.parse(json));
      }catch(error){showToast(error.message||'That sync code could not be imported.','error')}
    });
    dialog.addEventListener('close',unlockBody);
    return dialog;
  }
  function restoreSafetyBackup(){
    try{
      const payload=JSON.parse(localStorage.getItem(IMPORT_SAFETY_KEY)||'null');
      if(!payload?.state)throw new Error('No previous import backup is available.');
      if(!confirm('Restore the progress saved immediately before your last import?'))return;
      localStorage.setItem(STORAGE_KEY,JSON.stringify(payload.state));location.reload();
    }catch(error){showToast(error.message||'The safety backup could not be restored.','error')}
  }
  function renderSyncPanel(){
    const settings=$('#settingsView');if(!settings)return;
    let panel=$('#knDataSyncPanel');
    if(!panel){
      panel=document.createElement('section');panel.id='knDataSyncPanel';panel.className='kn-sync-card';
      panel.innerHTML=`<div class="kn-sync-head"><div><p>DATA & SYNC</p><h2>Keep Your Nexus Safe</h2></div><span>MANUAL SYNC READY</span></div>
        <p class="kn-sync-explainer">Back up everything, move progress between your phone and laptop, and safely merge the newest progress for each title.</p>
        <div class="kn-sync-grid">
          <button id="knShareBackup">SHARE BACKUP</button><button id="knExportBackup">EXPORT FILE</button>
          <button id="knCopySyncCode">COPY SYNC CODE</button><button id="knPasteSyncCode">PASTE SYNC CODE</button>
          <button id="knImportBackup">IMPORT FILE</button><button id="knRestoreImport">RESTORE PRE-IMPORT</button>
        </div>
        <input id="knImportFile" type="file" accept="application/json,.json" hidden>
        <div class="kn-cloud-note"><strong>AUTOMATIC CLOUD SYNC</strong><span>The app is ready for it, but GitHub Pages cannot securely store private account data by itself. A database/login connection is still required.</span></div>`;
      settings.appendChild(panel);
      $('#knShareBackup',panel).addEventListener('click',shareBackup);
      $('#knExportBackup',panel).addEventListener('click',downloadBackup);
      $('#knCopySyncCode',panel).addEventListener('click',copySyncCode);
      $('#knPasteSyncCode',panel).addEventListener('click',()=>{const dialog=ensureSyncCodeDialog();lockBody();dialog.showModal();setTimeout(()=>$('#knSyncCodeInput',dialog)?.focus(),80)});
      $('#knImportBackup',panel).addEventListener('click',()=>$('#knImportFile',panel).click());
      $('#knImportFile',panel).addEventListener('change',event=>{const file=event.target.files?.[0];if(file)importFile(file);event.target.value=''});
      $('#knRestoreImport',panel).addEventListener('click',restoreSafetyBackup);
    }
  }

  let lockedScrollY=0;
  function lockBody(){
    if(document.body.classList.contains('kn-body-locked'))return;
    lockedScrollY=window.scrollY;document.body.style.top=`-${lockedScrollY}px`;document.body.classList.add('kn-body-locked');
  }
  function unlockBody(){
    if(!document.body.classList.contains('kn-body-locked'))return;
    document.body.classList.remove('kn-body-locked');document.body.style.top='';window.scrollTo(0,lockedScrollY);
  }
  function updateVisualViewport(){
    const viewport=window.visualViewport;
    const height=viewport?.height||window.innerHeight;
    const offset=Math.max(0,window.innerHeight-height-(viewport?.offsetTop||0));
    document.documentElement.style.setProperty('--kn-visual-height',`${height}px`);
    document.documentElement.style.setProperty('--kn-keyboard-offset',`${offset}px`);
    document.body.classList.toggle('kn-keyboard-open',offset>120);
  }
  function enhanceSearch(){
    const dialog=$('#addAnimeDialog');
    if(dialog&&!dialog.dataset.knMobileSearch){
      dialog.dataset.knMobileSearch='22';dialog.classList.add('kn-mobile-search-dialog');
      const close=$('.add-dialog-close',dialog);
      if(close){close.textContent='CANCEL';close.setAttribute('aria-label','Cancel and close search')}
      const input=$('#addAnimeSearchInput',dialog);
      if(input){input.inputMode='search';input.enterKeyHint='search';input.autocapitalize='words';input.spellcheck=false}
      const observer=new MutationObserver(()=>{
        if(dialog.open){lockBody();updateVisualViewport();setTimeout(()=>input?.focus({preventScroll:true}),60)}else unlockBody();
      });
      observer.observe(dialog,{attributes:true,attributeFilter:['open']});
      dialog.addEventListener('close',unlockBody);
    }
    const global=$('#globalSearch');const rubber=$('#rubberSearch');
    if(global&&rubber&&!rubber.dataset.knPhoneSearch){
      rubber.dataset.knPhoneSearch='22';
      const close=document.createElement('button');close.type='button';close.id='knGlobalSearchClose';close.className='kn-global-search-close';close.textContent='CLOSE';
      close.addEventListener('click',()=>{$('#searchPunch')?.click();global.blur()});rubber.appendChild(close);
      global.addEventListener('focus',()=>{updateVisualViewport();document.body.classList.add('kn-global-search-active')});
      global.addEventListener('blur',()=>setTimeout(()=>document.body.classList.remove('kn-global-search-active'),180));
    }
  }

  function detectBottomNav(){
    if($('.kn-bottom-nav[data-kn-safe-nav="22"]'))return;
    const labels=['home','archive','unstarted','settings'];
    const controls=$$('button,a,[role="button"]');
    const matches=controls.filter(control=>labels.some(label=>String(control.textContent||control.getAttribute('aria-label')||'').trim().toLowerCase()===label));
    if(matches.length<4)return;
    let node=matches[0];
    while(node&&node!==document.body){
      if(matches.every(control=>node.contains(control))){
        node.classList.add('kn-bottom-nav');node.dataset.knSafeNav='22';
        const setHeight=()=>document.documentElement.style.setProperty('--kn-bottom-nav-height',`${Math.ceil(node.getBoundingClientRect().height)}px`);
        setHeight();if('ResizeObserver' in window)new ResizeObserver(setHeight).observe(node);return;
      }
      node=node.parentElement;
    }
  }

  function setupConnectivity(){
    const updateOnline=()=>showToast(navigator.onLine?'Back online.':'You are offline. Cached features remain available.',navigator.onLine?'success':'warning');
    window.addEventListener('online',updateOnline);window.addEventListener('offline',updateOnline);
  }

  let queued=false;
  function enhance(){
    if(queued)return;queued=true;
    requestAnimationFrame(()=>{
      queued=false;
      renderContinue();enhanceAnimeCards();renderSyncPanel();enhanceSearch();detectBottomNav();updateVisualViewport();
    });
  }
  function install(){
    if(document.documentElement.dataset.knMobileSuite==='22')return true;
    if(!document.getElementById('homeView'))return false;
    document.documentElement.dataset.knMobileSuite='22';
    setupActionDelegation();
    enhance();showSavedFlash();setupConnectivity();
    window.visualViewport?.addEventListener('resize',updateVisualViewport,{passive:true});
    window.visualViewport?.addEventListener('scroll',updateVisualViewport,{passive:true});
    window.addEventListener('resize',updateVisualViewport,{passive:true});
    const observer=new MutationObserver(records=>{
      const relevant=records.some(record=>[...record.addedNodes].some(node=>node instanceof Element&&(node.matches('.anime-card,#homeView,#settingsView,#addAnimeDialog,#globalSearch,#rubberSearch')||node.querySelector?.('.anime-card,#homeView,#settingsView,#addAnimeDialog,#globalSearch,#rubberSearch'))));
      if(relevant)enhance();
    });
    observer.observe(document.body,{childList:true,subtree:true});
    window.addEventListener('pagehide',()=>observer.disconnect(),{once:true});
    return true;
  }

  if(install())return;
  window.addEventListener('kagenexus-ready',install,{once:true});
  window.addEventListener('anime-haven-ready',install,{once:true});
  let attempts=0;const timer=setInterval(()=>{attempts++;if(install()||attempts>200)clearInterval(timer)},100);
})();
