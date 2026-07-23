(()=>{
  'use strict';

  const FAVICON='./icons/kagenexus-favicon-v19.svg';
  const APPLE_ICON='./icons/kagenexus-icon.png?brand=19';
  const MARK=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192">
<defs>
<linearGradient id="g" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#a758ff"/><stop offset=".48" stop-color="#f8f6ff"/><stop offset="1" stop-color="#46dfff"/></linearGradient>
<radialGradient id="bg"><stop stop-color="#151836"/><stop offset="1" stop-color="#03040b"/></radialGradient>
</defs>
<rect width="192" height="192" rx="38" fill="url(#bg)"/>
<circle cx="96" cy="96" r="75" fill="none" stroke="url(#g)" stroke-width="7"/>
<circle cx="96" cy="96" r="65" fill="none" stroke="url(#g)" stroke-opacity=".55" stroke-width="2" stroke-dasharray="18 8"/>
<path d="M96 14l8 10-8 10-8-10zm0 144 8 10-8 10-8-10zM14 96l10-8 10 8-10 8zm144 0 10-8 10 8-10 8z" fill="url(#g)"/>
<g fill="none" stroke="#fff" stroke-width="7" stroke-linejoin="round" stroke-linecap="round">
<path d="M39 71q27-4 51 20v49q-22-18-51-13zM153 71q-27-4-51 20v49q22-18 51-13z"/>
<path d="M96 43v102M86 76h20"/>
<path d="M88 45h16M86 52h20M89 59h14M86 66h20" stroke-width="4"/>
</g>
<path d="M96 145l-6-13h12z" fill="#fff"/>
</svg>
`;
  const replacements=[
    [/ANIME[\s-]*HAVEN/g,'KAGENEXUS'],
    [/Anime[\s-]*Haven/g,'KageNexus'],
    [/anime[\s-]*haven/g,'KageNexus']
  ];
  const replaceBrand=value=>replacements.reduce((text,[pattern,replacement])=>text.replace(pattern,replacement),String(value||''));
  const absolute=path=>new URL(path,document.baseURI).href;

  function setMeta(name,content){
    let meta=document.head.querySelector(`meta[name="${name}"]`);
    if(!meta){meta=document.createElement('meta');meta.name=name;document.head.appendChild(meta);}
    meta.content=content;
  }

  function setLink(rel,href,type,sizes){
    let link=document.head.querySelector(`link[rel="${rel}"]`);
    if(!link){link=document.createElement('link');link.rel=rel;document.head.appendChild(link);}
    link.href=absolute(href);
    if(type)link.type=type;
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
  }

  function installInlineLogo(container){
    if(!container||container.dataset.kageNexusLogo==='19')return;
    container.dataset.kageNexusLogo='19';
    container.textContent='';
    container.insertAdjacentHTML('afterbegin',MARK);
    const svg=container.querySelector('svg');
    if(svg)svg.style.cssText='width:100%;height:100%;display:block;border-radius:inherit;';
  }

  function replaceLegacyMark(){
    const topbar=document.querySelector('.topbar');
    if(!topbar)return;
    const marked=topbar.querySelector('[data-kage-nexus-logo]');
    const broken=topbar.querySelector('img[alt="KageNexus"]');
    const legacy=[...topbar.querySelectorAll('*')].find(element=>element.children.length===0&&element.textContent.trim()==='影');
    const container=marked||(broken?.parentElement)||legacy;
    if(container)installInlineLogo(container);
  }

  function applyBrand(){
    document.title='KageNexus';
    setMeta('application-name','KageNexus');
    setMeta('apple-mobile-web-app-title','KageNexus');
    setLink('icon',FAVICON,'image/svg+xml');
    setLink('shortcut icon',FAVICON,'image/svg+xml');
    setLink('apple-touch-icon',APPLE_ICON,'image/png','180x180');
    rewriteText(document.body);
    replaceLegacyMark();
    document.documentElement.dataset.kageNexus='19';
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
