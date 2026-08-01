(()=>{
  'use strict';

  const STORAGE_KEY='anime-haven-state-v2';
  const titleKey=value=>String(value||'')
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[’'×:–—\-]/g,' ')
    .replace(/[^a-z0-9]+/g,' ')
    .trim();

  const readProfile=()=>{
    try{
      const state=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');
      return state?.profiles?.find(profile=>profile.id==='ashton')||state?.profiles?.[0]||null;
    }catch(error){
      console.warn('KageNexus could not sync the movie dialog',error);
      return null;
    }
  };

  const mediaKind=item=>/ova/i.test(item?.progressNote||'')?'OVA':'MOVIE';
  const setText=(node,text)=>{if(node&&node.textContent!==text)node.textContent=text};
  const setHidden=(node,value)=>{if(node&&node.hidden!==value)node.hidden=value};

  const syncDialog=()=>{
    const dialog=document.getElementById('animeDialog');
    const body=dialog?.querySelector('.dialog-body');
    const title=dialog?.querySelector('h2')?.textContent||'';
    if(!body||!title)return;

    const profile=readProfile();
    const item=profile?.items?.find(entry=>titleKey(entry.title)===titleKey(title));
    if(!item||item.mediaType!=='movie')return;

    const kind=mediaKind(item);
    body.classList.add('movie-dialog-body');
    let banner=body.querySelector('.movie-dialog-banner');
    if(!banner){
      banner=document.createElement('div');
      banner.className='movie-dialog-banner';
      body.prepend(banner);
    }
    banner.innerHTML=`<strong>${kind}</strong><span>${item.status==='completed'?'Watched':'Not watched'}</span>`;
    body.querySelectorAll('.progress-box').forEach((box,index)=>{if(index<3)setHidden(box,true)});
    const labels=body.querySelectorAll('.progress-box label');
    if(labels[3])setText(labels[3],'Franchise viewing order');
    setHidden(body.querySelector('[data-dialog-action="plus"]'),true);
    setHidden(body.querySelector('[data-dialog-action="finish-season"]'),true);
    setText(body.querySelector('[data-dialog-action="save"]'),'Save movie order');
    setText(body.querySelector('[data-dialog-action="complete"]'),`Mark ${kind.toLowerCase()} watched`);
  };

  let frame=0;
  const schedule=()=>{
    if(frame)return;
    frame=requestAnimationFrame(()=>{
      frame=0;
      syncDialog();
    });
  };

  const observer=new MutationObserver(records=>{
    const relevant=records.some(record=>{
      if(record.target instanceof Element&&record.target.closest('#animeDialog'))return true;
      return [...record.addedNodes].some(node=>
        node instanceof Element&&(node.matches('#animeDialog')||Boolean(node.querySelector?.('#animeDialog')))
      );
    });
    if(relevant)schedule();
  });

  const install=()=>{
    schedule();
    observer.observe(document.body,{childList:true,subtree:true});
  };

  if(document.body)install();
  else document.addEventListener('DOMContentLoaded',install,{once:true});
  window.addEventListener('anime-haven-ready',schedule);
  window.addEventListener('pagehide',()=>{
    observer.disconnect();
    if(frame)cancelAnimationFrame(frame);
  },{once:true});
})();
