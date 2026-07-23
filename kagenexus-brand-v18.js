(()=>{
  'use strict';

  const ICON_PATH='./icons/kagenexus-icon.png?brand=18';
  const iconUrl=()=>new URL(ICON_PATH,document.baseURI).href;
  const replacements=[
    [/ANIME[\s-]*HAVEN/g,'KAGENEXUS'],
    [/Anime[\s-]*Haven/g,'KageNexus'],
    [/anime[\s-]*haven/g,'KageNexus']
  ];
  const replaceBrand=value=>replacements.reduce((text,[pattern,replacement])=>text.replace(pattern,replacement),String(value||''));

  function setMeta(name,content){
    let meta=document.head.querySelector(`meta[name="${name}"]`);
    if(!meta){meta=document.createElement('meta');meta.name=name;document.head.appendChild(meta);}
    if(meta.content!==content)meta.content=content;
  }

  function setIcon(rel,sizes){
    let link=document.head.querySelector(`link[rel="${rel}"]`);
    if(!link){link=document.createElement('link');link.rel=rel;document.head.appendChild(link);}
    link.href=iconUrl();
    link.type='image/png';
    if(sizes)link.sizes=sizes;else link.removeAttribute('sizes');
  }

  function rewriteText(root){
    if(!root)return;
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(node){
      const parent=node.parentElement;
      if(!parent||parent.closest('script,style,noscript'))return NodeFilter.FILTER_REJECT;
      return /anime[\s-]*haven/i.test(node.nodeValue||'')?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT;
    }});
    const nodes=[];
    while(walker.nextNode())nodes.push(walker.currentNode);
    nodes.forEach(node=>{const next=replaceBrand(node.nodeValue);if(next!==node.nodeValue)node.nodeValue=next;});

    const attributes=['aria-label','title','alt','placeholder','content'];
    root.querySelectorAll?.('*').forEach(element=>attributes.forEach(attribute=>{
      const value=element.getAttribute(attribute);
      if(!value||!/anime[\s-]*haven/i.test(value))return;
      const next=replaceBrand(value);
      if(next!==value)element.setAttribute(attribute,next);
    }));
  }

  function installLogo(container){
    if(!container)return;
    container.dataset.kageNexusLogo='18';
    container.textContent='';
    const image=document.createElement('img');
    image.src=iconUrl();
    image.alt='KageNexus';
    image.decoding='async';
    image.loading='eager';
    image.style.cssText='width:100%;height:100%;display:block;object-fit:cover;border-radius:inherit;';
    image.addEventListener('error',()=>{
      container.textContent='KN';
      container.style.cssText+=';display:grid;place-items:center;font-weight:950;color:white;font-size:17px;background:linear-gradient(135deg,#8b5cff,#18d8ee);';
    },{once:true});
    container.appendChild(image);
  }

  function replaceLegacyMark(){
    const topbar=document.querySelector('.topbar');
    if(!topbar)return;
    const existing=topbar.querySelector('[data-kage-nexus-logo],img[alt="KageNexus"]')?.closest('[data-kage-nexus-logo],div,span,a,button');
    const legacy=[...topbar.querySelectorAll('*')].find(element=>element.children.length===0&&element.textContent.trim()==='影');
    const container=existing||legacy;
    if(!container)return;
    const current=container.querySelector('img');
    if(current&&current.src===iconUrl()&&current.complete&&current.naturalWidth>0)return;
    installLogo(container);
  }

  function applyBrand(){
    document.title='KageNexus';
    setMeta('application-name','KageNexus');
    setMeta('apple-mobile-web-app-title','KageNexus');
    setIcon('icon','192x192');
    setIcon('shortcut icon');
    setIcon('apple-touch-icon');
    rewriteText(document.body);
    replaceLegacyMark();
    document.documentElement.dataset.kageNexus='18';
  }

  let scheduled=false;
  const schedule=()=>{
    if(scheduled)return;
    scheduled=true;
    requestAnimationFrame(()=>{scheduled=false;applyBrand();});
  };

  applyBrand();
  window.addEventListener('kagenexus-ready',schedule);
  window.addEventListener('anime-haven-ready',schedule);
  const observer=new MutationObserver(mutations=>{
    if(mutations.some(mutation=>mutation.type==='childList'||mutation.type==='characterData'))schedule();
  });
  observer.observe(document.documentElement,{childList:true,subtree:true,characterData:true});
  window.addEventListener('pagehide',()=>observer.disconnect(),{once:true});
})();
