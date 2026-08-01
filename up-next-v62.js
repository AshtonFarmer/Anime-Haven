(()=>{
  'use strict';

  const STORAGE_KEY='anime-haven-state-v2';
  let queued=false;
  let lastSignature='';

  const normalize=value=>String(value||'').normalize('NFKD').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
  const readState=()=>{try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||'null')}catch{return null}};
  const activeItems=()=>{
    const state=readState();
    const profile=state?.profiles?.find(item=>item.id===state.activeProfileId)||state?.profiles?.[0];
    return Array.isArray(profile?.items)?profile.items:[];
  };
  const progressText=item=>{
    if(item.progressNote)return item.progressNote;
    if(item.mediaType==='movie')return item.status==='completed'?'Movie watched':'Movie not watched';
    return `Season ${Math.max(1,Number(item.season)||1)} • Episode ${Math.max(0,Number(item.episode)||0)}`;
  };
  const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

  const ensureStyles=()=>{
    if(document.getElementById('kn62-up-next-styles'))return;
    const style=document.createElement('style');
    style.id='kn62-up-next-styles';
    style.textContent=`
      .kn62-up-next{margin:18px 0 28px;padding:18px;border:1px solid rgba(126,104,255,.24);border-radius:22px;background:linear-gradient(145deg,rgba(20,17,49,.9),rgba(10,10,29,.92));box-shadow:0 20px 55px rgba(0,0,0,.22)}
      .kn62-up-next-head{display:flex;justify-content:space-between;gap:16px;align-items:end;margin-bottom:13px}.kn62-up-next-head p{margin:0;color:#58deff;font-size:10px;font-weight:950;letter-spacing:.16em}.kn62-up-next-head h2{margin:4px 0 0;font-size:22px}.kn62-up-next-head span{color:#9f9bbd;font-size:11px}
      .kn62-up-next-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.kn62-up-next-item{position:relative;display:grid;grid-template-columns:58px minmax(0,1fr);gap:11px;align-items:center;min-height:82px;padding:10px;border:1px solid rgba(144,133,204,.18);border-radius:16px;background:rgba(11,10,29,.8);color:#fff;text-align:left;cursor:pointer;touch-action:manipulation}
      .kn62-up-next-item:hover,.kn62-up-next-item:focus-visible{border-color:rgba(75,222,255,.48);transform:translateY(-1px)}.kn62-up-next-cover{width:58px;height:62px;border-radius:11px;background:linear-gradient(135deg,#342d69,#121126);background-size:cover;background-position:center;box-shadow:0 8px 20px rgba(0,0,0,.28)}
      .kn62-up-next-copy{min-width:0}.kn62-up-next-copy strong{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px}.kn62-up-next-copy span{display:block;margin-top:6px;color:#aaa5c8;font-size:11px;line-height:1.35}.kn62-up-next-copy b{display:block;margin-top:7px;color:#5fe4ff;font-size:9px;letter-spacing:.12em}
      @media(max-width:760px){.kn62-up-next-grid{grid-template-columns:1fr}.kn62-up-next-item{grid-template-columns:54px minmax(0,1fr);min-height:74px}.kn62-up-next-cover{width:54px;height:56px}}
    `;
    document.head.appendChild(style);
  };

  const openItem=title=>{
    const key=normalize(title);
    const headings=[...document.querySelectorAll('.anime-card h3,.external-card h3')];
    const heading=headings.find(node=>normalize(node.textContent)===key);
    const card=heading?.closest('.anime-card,.external-card');
    if(card){
      card.scrollIntoView({behavior:document.documentElement.dataset.knPerformanceMode==='low'?'auto':'smooth',block:'center'});
      window.setTimeout(()=>card.click(),180);
      return;
    }
    const input=document.getElementById('globalSearch');
    const punch=document.getElementById('searchPunch');
    if(input){
      if(!document.getElementById('rubberSearch')?.classList.contains('open'))punch?.click();
      input.value=title;
      input.dispatchEvent(new Event('input',{bubbles:true}));
      input.dispatchEvent(new Event('change',{bubbles:true}));
      input.focus({preventScroll:true});
    }
  };

  const render=()=>{
    ensureStyles();
    const home=document.getElementById('homeView');
    if(!home)return false;
    const items=activeItems()
      .filter(item=>item.status==='watching'&&item.mediaType!=='movie')
      .sort((left,right)=>String(right.updatedAt||'').localeCompare(String(left.updatedAt||'')))
      .slice(0,3);
    const signature=items.map(item=>[item.id,item.title,item.season,item.episode,item.updatedAt].join(':')).join('|');
    let section=document.getElementById('kn62UpNext');
    if(!items.length){section?.remove();lastSignature='';return true}
    if(section&&signature===lastSignature)return true;
    if(!section){
      section=document.createElement('section');
      section.id='kn62UpNext';
      section.className='kn62-up-next';
      const anchor=document.getElementById('homeAddAnime')||home.querySelector('.hero-copy');
      if(anchor)anchor.insertAdjacentElement('afterend',section);else home.prepend(section);
      section.addEventListener('click',event=>{
        const button=event.target.closest('[data-kn62-up-next-title]');
        if(button)openItem(button.dataset.kn62UpNextTitle);
      });
    }
    section.innerHTML=`
      <div class="kn62-up-next-head"><div><p>CONTINUE YOUR JOURNEY</p><h2>Up Next</h2></div><span>${items.length} active title${items.length===1?'':'s'}</span></div>
      <div class="kn62-up-next-grid">${items.map(item=>{
        const cover=item.coverImage?`background-image:url('${String(item.coverImage).replace(/'/g,'%27')}')`:'';
        return `<button class="kn62-up-next-item" type="button" data-kn62-up-next-title="${escapeHtml(item.title)}"><span class="kn62-up-next-cover" style="${cover}"></span><span class="kn62-up-next-copy"><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(progressText(item))}</span><b>OPEN PROGRESS</b></span></button>`;
      }).join('')}</div>`;
    lastSignature=signature;
    return true;
  };

  const schedule=()=>{
    if(queued)return;
    queued=true;
    requestAnimationFrame(()=>{queued=false;render()});
  };
  window.addEventListener('kagenexus-ready',schedule);
  window.addEventListener('anime-haven-ready',schedule);
  window.addEventListener('storage',event=>{if(event.key===STORAGE_KEY)schedule()});
  const start=()=>{
    render();
    const observer=new MutationObserver(records=>{
      const relevant=records.some(record=>[...record.addedNodes].some(node=>node instanceof Element&&(
        node.id==='homeView'||node.matches?.('.anime-card,#homeAddAnime,.hero-copy')||node.querySelector?.('#homeView,.anime-card,#homeAddAnime,.hero-copy')
      )));
      if(relevant)schedule();
    });
    observer.observe(document.body,{childList:true,subtree:true});
    window.addEventListener('pagehide',()=>observer.disconnect(),{once:true});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
