(()=>{
  'use strict';

  const STORAGE_KEY='anime-haven-state-v2';
  const MIGRATION_VERSION=15;
  const SINGLE_KIND={
    'black clover sword of the wizard king':'MOVIE',
    'blue exorcist the movie':'MOVIE',
    'demon slayer mugen train':'MOVIE',
    'my hero academia two heroes':'MOVIE',
    'my hero academia heroes rising':'MOVIE',
    'my hero academia world heroes mission':'MOVIE',
    'my hero academia youre next':'MOVIE',
    'rezero memory snow':'OVA',
    'rezero the frozen bond':'OVA',
    'a certain magical index the movie the miracle of endymion':'MOVIE',
    'sword art online the movie ordinal scale':'MOVIE',
    'sword art online progressive aria of a starless night':'MOVIE',
    'sword art online progressive scherzo of deep night':'MOVIE',
    'spy x family code white':'MOVIE',
    'hunter x hunter phantom rouge':'MOVIE',
    'hunter x hunter the last mission':'MOVIE'
  };
  const EXTRA_MOVIES=[
    {title:'SPY x FAMILY CODE: White',franchise:'Spy x Family',seriesOrder:2,status:'completed',progressNote:'Movie watched'},
    {title:'Hunter x Hunter: Phantom Rouge',franchise:'Hunter x Hunter',seriesOrder:2,status:'completed',progressNote:'Movie watched'},
    {title:'Hunter x Hunter: The Last Mission',franchise:'Hunter x Hunter',seriesOrder:3,status:'completed',progressNote:'Movie watched'}
  ];

  const titleKey=value=>String(value||'').normalize('NFKD').toLowerCase().replace(/[’'×:–—\-]/g,' ').replace(/[^a-z0-9]+/g,' ').trim();
  const now=()=>new Date().toISOString();
  const uid=()=>crypto.randomUUID?.()||`id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const readState=()=>{try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||'null')}catch(error){console.warn('Anime Haven could not read saved data',error);return null}};
  const writeState=state=>{try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));return true}catch(error){console.warn('Anime Haven could not save data',error);return false}};
  const setText=(node,text)=>{if(node&&node.textContent!==text)node.textContent=text};
  const setHidden=(node,value)=>{if(node&&node.hidden!==value)node.hidden=value};

  function seedState(){
    if(!Array.isArray(window.ANIME_HAVEN_SEED))return null;
    return {
      version:2,activeProfileId:'ashton',view:'home',listMode:'watched',filter:'all',sort:'alpha',
      profiles:[{id:'ashton',name:'Ashton',items:JSON.parse(JSON.stringify(window.ANIME_HAVEN_SEED))}],
      streak:{lastLogDate:null,days:0},createdAt:now(),updatedAt:now()
    };
  }

  function migrateLibrary(){
    const state=readState()||seedState();
    if(!state||!Array.isArray(state.profiles))return false;
    const profile=state.profiles.find(p=>p.id==='ashton')||state.profiles[0];
    if(!profile||!Array.isArray(profile.items))return false;
    let changed=Number(state.libraryMigrationVersion||0)<MIGRATION_VERSION;
    const byKey=new Map(profile.items.map(item=>[titleKey(item.title),item]));

    profile.items.forEach(item=>{
      const kind=SINGLE_KIND[titleKey(item.title)];
      if(!kind)return;
      if(item.mediaType!=='movie'){item.mediaType='movie';changed=true}
      if(item.season!==0){item.season=0;changed=true}
      const desiredEpisode=item.status==='completed'?1:0;
      if(item.episode!==desiredEpisode){item.episode=desiredEpisode;changed=true}
      if(item.totalEpisodes!==1){item.totalEpisodes=1;changed=true}
      if(Number(item.episodesLogged||0)!==0){item.episodesLogged=0;changed=true}
      const note=item.status==='completed'?`${kind} watched`:`${kind} not watched`;
      if(item.progressNote!==note){item.progressNote=note;changed=true}
    });

    EXTRA_MOVIES.forEach((movie,index)=>{
      const key=titleKey(movie.title);
      if(byKey.has(key))return;
      const item={
        id:`migration-${key.replace(/ /g,'-')}`,title:movie.title,status:movie.status,season:0,episode:1,
        completedSeasons:0,totalEpisodes:1,episodesLogged:0,seasonHistory:[],progressNote:movie.progressNote,
        mediaType:'movie',franchise:movie.franchise,seriesOrder:movie.seriesOrder,chronologyKey:movie.seriesOrder,
        accent:['#ff755c','#9a5cff','#3fe1e8'][index%3],updatedAt:'2026-07-22T00:00:00.000Z',source:'migration',
        anilistId:null,coverImage:'',startDate:null,relationOrder:[]
      };
      profile.items.push(item);byKey.set(key,item);changed=true;
    });

    const spy=byKey.get(titleKey('Spy x Family'));
    if(spy&&/movie/i.test(spy.progressNote||'')){spy.progressNote='Season 2 Episode 12 Finale';changed=true}
    const hunter=byKey.get(titleKey('Hunter x Hunter'));
    if(hunter&&/movie/i.test(hunter.progressNote||'')){hunter.progressNote='Season 6 Finale';changed=true}

    state.libraryMigrationVersion=MIGRATION_VERSION;
    state.updatedAt=now();
    return changed?writeState(state):false;
  }

  const getProfile=()=>{
    const state=readState();
    return state?.profiles?.find(p=>p.id==='ashton')||state?.profiles?.[0]||null;
  };
  const getItemByTitle=title=>getProfile()?.items?.find(item=>titleKey(item.title)===titleKey(title))||null;
  const mediaKind=item=>SINGLE_KIND[titleKey(item?.title)]||'MOVIE';

  async function aniListRequest(query,variables){
    const response=await fetch('https://graphql.anilist.co',{
      method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({query,variables})
    });
    if(!response.ok)throw new Error(`Anime search returned ${response.status}`);
    const payload=await response.json();
    if(payload.errors?.length)throw new Error(payload.errors[0].message||'Anime search failed');
    return payload.data;
  }

  const MEDIA_FIELDS=`id title { romaji english native } episodes format seasonYear startDate { year month day }
    coverImage { large extraLarge color }
    relations { edges { relationType node { id title { romaji english } startDate { year month day } } } } }`;
  const searchMedia=async search=>(await aniListRequest(`query($search:String){Page(page:1,perPage:12){media(search:$search,type:ANIME,sort:SEARCH_MATCH){${MEDIA_FIELDS}}}}`,{search}))?.Page?.media||[];
  const mediaById=async id=>(await aniListRequest(`query($id:Int){Media(id:$id,type:ANIME){${MEDIA_FIELDS}}}`,{id:Number(id)}))?.Media;
  const titleOf=media=>media?.title?.english||media?.title?.romaji||media?.title?.native||'Untitled Anime';
  const dateKey=date=>date?.year?date.year*10000+(date.month||1)*100+(date.day||1):99999999;
  const isMovie=media=>String(media?.format||'').includes('MOVIE');

  function addMedia(media,startNow){
    const state=readState();
    const profile=state?.profiles?.find(p=>p.id==='ashton')||state?.profiles?.[0];
    if(!profile||!media)throw new Error('Your library could not be opened.');
    const title=titleOf(media);
    if(profile.items.some(item=>item.anilistId===media.id||titleKey(item.title)===titleKey(title)))throw new Error(`${title} is already in your library.`);
    const movie=isMovie(media);
    const relations=(media.relations?.edges||[])
      .filter(edge=>['PREQUEL','SEQUEL','PARENT','SIDE_STORY','ALTERNATIVE'].includes(edge.relationType))
      .map(edge=>({type:edge.relationType,id:edge.node.id,title:titleOf(edge.node),date:dateKey(edge.node.startDate)}))
      .sort((a,b)=>a.date-b.date);
    const timeline=[{id:media.id,title,date:dateKey(media.startDate),type:'CURRENT'},...relations].sort((a,b)=>a.date-b.date||a.title.localeCompare(b.title));
    const order=Math.max(1,timeline.findIndex(entry=>entry.id===media.id)+1);
    const completed=startNow&&movie;
    profile.items.push({
      id:uid(),anilistId:media.id,title,status:startNow?(movie?'completed':'watching'):'planned',
      season:movie?0:1,episode:startNow?1:0,completedSeasons:0,totalEpisodes:movie?1:(media.episodes||null),episodesLogged:movie?0:(startNow?1:0),
      seasonHistory:[],progressNote:movie?(completed?'Movie watched':'Movie not watched'):(startNow?'Season 1 Episode 1':'Haven’t started yet'),
      mediaType:movie?'movie':'series',franchise:timeline[0]?.title||title,seriesOrder:order,chronologyKey:dateKey(media.startDate),
      accent:media.coverImage?.color||'#6c5cff',coverImage:media.coverImage?.extraLarge||media.coverImage?.large||'',startDate:media.startDate||null,
      relationOrder:timeline,source:'anilist',updatedAt:now()
    });
    state.updatedAt=now();
    if(!writeState(state))throw new Error('Anime Haven could not save that title.');
    sessionStorage.setItem('anime-haven-library-flash',movie?(completed?`${title} marked watched.`:`${title} added to movies.`):(startNow?`${title} started at Season 1 Episode 1.`:`${title} added to not started.`));
    location.reload();
  }

  const escapeText=value=>String(value).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));

  function createModal(){
    if(document.getElementById('addAnimeDialog'))return;
    const dialog=document.createElement('dialog');
    dialog.id='addAnimeDialog';dialog.className='add-anime-dialog';
    dialog.innerHTML=`<button class="add-dialog-close" aria-label="Close">×</button>
      <div class="add-dialog-head"><p>EXPAND YOUR REALM</p><h2>Add Anime or Movie</h2><span>Search the anime database, then choose where it belongs.</span></div>
      <form id="addAnimeSearchForm" class="add-search-form"><input id="addAnimeSearchInput" type="search" placeholder="Type an anime or movie title…" autocomplete="off" required><button>SEARCH</button></form>
      <div id="addAnimeStatus" class="add-anime-status">Search for a title to add it to Haven’t Started Yet, start Episode 1, or mark a movie watched.</div>
      <div id="addAnimeResults" class="add-anime-results"></div>`;
    document.body.appendChild(dialog);
    dialog.querySelector('.add-dialog-close').addEventListener('click',()=>dialog.close());
    dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});
    dialog.querySelector('#addAnimeSearchForm').addEventListener('submit',async event=>{
      event.preventDefault();
      const input=dialog.querySelector('#addAnimeSearchInput');
      const status=dialog.querySelector('#addAnimeStatus');
      const results=dialog.querySelector('#addAnimeResults');
      const query=input.value.trim();if(!query)return;
      setText(status,'Searching the anime universe…');results.replaceChildren();
      try{
        const media=await searchMedia(query);
        setText(status,`${media.length} result${media.length===1?'':'s'} found`);
        results.innerHTML=media.map(item=>{
          const title=titleOf(item),movie=isMovie(item),year=item.seasonYear||item.startDate?.year||'Unknown';
          const cover=item.coverImage?.large||item.coverImage?.extraLarge||'';
          return `<article class="add-result-card" data-media-id="${item.id}"><div class="add-result-cover" style="${cover?`background-image:url('${cover.replace(/'/g,'%27')}')`:''}"><span>${movie?'MOVIE':String(item.format||'SERIES').replaceAll('_',' ')}</span></div><div><h3>${escapeText(title)}</h3><p>${year} • ${movie?'Movie':`${item.episodes||'?'} episodes`}</p><div class="add-result-actions"><button data-add-mode="planned">ADD TO NOT STARTED</button><button class="primary" data-add-mode="watching">${movie?'MARK WATCHED':'START EP 1'}</button></div></div></article>`;
        }).join('')||'<p class="add-empty">No results found. Try another spelling.</p>';
      }catch(error){setText(status,error.message||'Search could not connect.')}
    });
    dialog.querySelector('#addAnimeResults').addEventListener('click',async event=>{
      const button=event.target.closest('[data-add-mode]');if(!button)return;
      const card=button.closest('[data-media-id]');if(!card)return;
      button.disabled=true;setText(button,'ADDING…');
      try{addMedia(await mediaById(card.dataset.mediaId),button.dataset.addMode==='watching')}
      catch(error){button.disabled=false;setText(button,'TRY AGAIN');setText(dialog.querySelector('#addAnimeStatus'),error.message)}
    });
  }

  function openAddDialog(){
    const dialog=document.getElementById('addAnimeDialog');if(!dialog)return;
    dialog.showModal();setTimeout(()=>dialog.querySelector('#addAnimeSearchInput')?.focus(),80);
  }

  function injectAddButtons(){
    const topbar=document.querySelector('.topbar');
    if(topbar&&!document.getElementById('quickAddAnime')){
      const button=document.createElement('button');button.id='quickAddAnime';button.className='quick-add-anime';button.innerHTML='<b>＋</b><span>ADD</span>';button.addEventListener('click',openAddDialog);
      const profile=topbar.querySelector('.profile-button');topbar.insertBefore(button,profile||null);
    }
    const hero=document.querySelector('#homeView .hero-copy');
    if(hero&&!document.getElementById('homeAddAnime')){
      const button=document.createElement('button');button.id='homeAddAnime';button.className='home-add-anime';button.innerHTML='<span class="home-add-icon">＋</span><span><strong>ADD ANIME OR MOVIE</strong><small>Search the database and place it in the right list</small></span><span class="home-add-arrow">›</span>';
      button.addEventListener('click',openAddDialog);hero.insertAdjacentElement('afterend',button);
    }
  }

  function enhanceCards(root=document){
    const profile=getProfile();if(!profile)return;
    const map=new Map(profile.items.map(item=>[titleKey(item.title),item]));
    root.querySelectorAll?.('.anime-card').forEach(card=>{
      if(card.dataset.externalId)return;
      const title=card.querySelector('h3')?.textContent||'';
      const item=map.get(titleKey(title));if(!item||item.mediaType!=='movie')return;
      card.classList.add('movie-card');
      const art=card.querySelector('.card-art');
      if(art&&!art.querySelector('.media-kind-pill')){
        const pill=document.createElement('span');pill.className='media-kind-pill';pill.textContent=mediaKind(item);art.appendChild(pill);
      }
      setText(card.querySelector('.card-body .card-meta'),`${mediaKind(item)} • ${item.status==='completed'?'Watched':'Not watched'}`);
      const action=card.querySelector('[data-action="plus-episode"]');
      if(action&&item.status==='planned')setText(action,'MARK WATCHED');
    });
  }

  function enhanceDialog(){
    const body=document.querySelector('#animeDialog .dialog-body');if(!body)return;
    const title=document.querySelector('#animeDialog h2')?.textContent||'';
    const item=getItemByTitle(title);if(!item||item.mediaType!=='movie')return;
    body.classList.add('movie-dialog-body');
    if(!body.querySelector('.movie-dialog-banner')){
      const banner=document.createElement('div');banner.className='movie-dialog-banner';banner.innerHTML=`<strong>${mediaKind(item)}</strong><span>${item.status==='completed'?'Watched':'Not watched'}</span>`;body.prepend(banner);
    }
    body.querySelectorAll('.progress-box').forEach((box,index)=>{if(index<3)setHidden(box,true)});
    const labels=body.querySelectorAll('.progress-box label');if(labels[3])setText(labels[3],'Franchise viewing order');
    setHidden(body.querySelector('[data-dialog-action="plus"]'),true);
    setHidden(body.querySelector('[data-dialog-action="finish-season"]'),true);
    setText(body.querySelector('[data-dialog-action="save"]'),'Save movie order');
    setText(body.querySelector('[data-dialog-action="complete"]'),`Mark ${mediaKind(item).toLowerCase()} watched`);
  }

  function showFlash(){
    const message=sessionStorage.getItem('anime-haven-library-flash');if(!message)return;
    sessionStorage.removeItem('anime-haven-library-flash');
    const toast=document.createElement('div');toast.className='library-flash';toast.textContent=message;document.body.appendChild(toast);
    requestAnimationFrame(()=>toast.classList.add('show'));setTimeout(()=>{toast.classList.remove('show');setTimeout(()=>toast.remove(),300)},2600);
  }

  function interceptExternalAdds(){
    document.addEventListener('click',async event=>{
      const button=event.target.closest('.external-card [data-action="add-planned"],.external-card [data-action="add-watching"]');if(!button)return;
      const card=button.closest('[data-external-id]');if(!card)return;
      event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();
      button.disabled=true;setText(button,'ADDING…');
      try{addMedia(await mediaById(card.dataset.externalId),button.dataset.action==='add-watching')}
      catch(error){button.disabled=false;setText(button,'TRY AGAIN');alert(error.message||'Could not add that title.')}
    },true);
  }

  let enhanceQueued=false;
  const scheduleEnhance=()=>{
    if(enhanceQueued)return;
    enhanceQueued=true;
    requestAnimationFrame(()=>{
      enhanceQueued=false;
      injectAddButtons();enhanceCards();enhanceDialog();
    });
  };

  function install(){
    if(document.documentElement.dataset.libraryManagerV15)return true;
    if(!document.getElementById('homeView'))return false;
    document.documentElement.dataset.libraryManagerV15='1';
    document.documentElement.removeAttribute('data-library-manager-v14');
    if(!document.querySelector('link[href*="library-manager-v14.css"]')){
      const link=document.createElement('link');link.rel='stylesheet';link.href='./library-manager-v14.css?release=15';document.head.appendChild(link);
    }
    const changed=migrateLibrary();
    if(changed&&!sessionStorage.getItem('anime-haven-migrated-v15')){
      sessionStorage.setItem('anime-haven-migrated-v15','1');location.reload();return true;
    }
    sessionStorage.removeItem('anime-haven-migrated-v15');
    createModal();injectAddButtons();enhanceCards();enhanceDialog();showFlash();interceptExternalAdds();
    const observer=new MutationObserver(records=>{
      const hasNewElement=records.some(record=>Array.from(record.addedNodes).some(node=>node.nodeType===Node.ELEMENT_NODE));
      if(hasNewElement)scheduleEnhance();
    });
    observer.observe(document.body,{childList:true,subtree:true});
    window.addEventListener('pagehide',()=>observer.disconnect(),{once:true});
    return true;
  }

  if(install())return;
  window.addEventListener('anime-haven-ready',install,{once:true});
  let tries=0;const timer=setInterval(()=>{tries++;if(install()||tries>180)clearInterval(timer)},100);
})();
