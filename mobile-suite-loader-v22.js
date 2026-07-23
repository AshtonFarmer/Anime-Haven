(()=>{
  'use strict';
  const parts=['mobile-suite-v22.part00','mobile-suite-v22.part01','mobile-suite-v22.part02','mobile-suite-v22.part03','mobile-suite-v22.part04','mobile-suite-v22.part05a','mobile-suite-v22.part05b','mobile-suite-v22.part06','mobile-suite-v22.part07'];
  const decode=text=>{const bytes=Uint8Array.from(atob(text),c=>c.charCodeAt(0));return new TextDecoder().decode(bytes)};
  (async()=>{
    try{
      const chunks=await Promise.all(parts.map(path=>fetch(`./${path}?release=22`,{cache:'no-store'}).then(response=>{if(!response.ok)throw new Error(`Missing ${path}`);return response.text()})));
      const payload=JSON.parse(decode(chunks.join('').replace(/\s+/g,'')));
      const style=document.createElement('style');style.id='kagenexus-mobile-suite-v22';style.textContent=payload.css;document.head.appendChild(style);
      (0,eval)(payload.js);
    }catch(error){console.error('KageNexus mobile suite could not load',error)}
  })();
})();
