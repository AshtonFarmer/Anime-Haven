(async()=>{
  'use strict';
  const status=document.querySelector('#boot-status');
  const progress=document.querySelector('#boot-progress');
  const set=(text,pct)=>{if(status)status.textContent=text;if(progress)progress.style.width=`${pct}%`};
  const parts=['anime-haven-v4.part00','anime-haven-v4.part01','anime-haven-v4.part02'];
  const decoder=new TextDecoder();
  const u16=(v,o)=>v.getUint16(o,true),u32=(v,o)=>v.getUint32(o,true);
  const inflate=async bytes=>{
    const stream=new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
    return new Uint8Array(await new Response(stream).arrayBuffer());
  };
  async function unzip(bytes){
    const view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);
    let eocd=-1;
    for(let i=bytes.length-22;i>=Math.max(0,bytes.length-65557);i--){if(u32(view,i)===0x06054b50){eocd=i;break}}
    if(eocd<0)throw new Error('Package directory was not found');
    const total=u16(view,eocd+10),central=u32(view,eocd+16),files={};
    let p=central;
    for(let i=0;i<total;i++){
      if(u32(view,p)!==0x02014b50)throw new Error('Invalid package directory');
      const method=u16(view,p+10),size=u32(view,p+20),nameLen=u16(view,p+28),extraLen=u16(view,p+30),commentLen=u16(view,p+32),local=u32(view,p+42);
      const name=decoder.decode(bytes.slice(p+46,p+46+nameLen));
      const localName=u16(view,local+26),localExtra=u16(view,local+28),start=local+30+localName+localExtra;
      const packed=bytes.slice(start,start+size);
      if(!name.endsWith('/'))files[name]=method===0?packed:method===8?await inflate(packed):null;
      p+=46+nameLen+extraLen+commentLen;
    }
    return files;
  }
  try{
    set('Summoning Ashton’s anime archive…',8);
    const texts=[];
    for(let i=0;i<parts.length;i++){
      const response=await fetch(`./${parts[i]}?v=4`,{cache:'no-store'});
      if(!response.ok)throw new Error(`Missing app package ${i+1}`);
      const text=(await response.text()).replace(/[^A-Za-z0-9+/=]/g,'');
      if(!text)throw new Error(`App package ${i+1} was empty`);
      texts.push(text);
      set(`Loading realm ${i+1} of ${parts.length}…`,14+Math.round((i+1)/parts.length*38));
    }
    const encoded=texts.join('');
    if(encoded.length%4!==0)throw new Error('The app package was incomplete. Refresh once more.');
    const binary=atob(encoded);
    const bytes=Uint8Array.from(binary,c=>c.charCodeAt(0));
    set('Unlocking the Haven…',60);
    const files=await unzip(bytes);
    for(const key of ['index.html','styles.css','data.js','config.js','app-v2.js'])if(!files[key])throw new Error(`${key} is missing`);
    const html=decoder.decode(files['index.html']);
    const css=decoder.decode(files['styles.css']);
    const data=decoder.decode(files['data.js']);
    const config=decoder.decode(files['config.js']);
    let app=decoder.decode(files['app-v2.js']);
    app=app.replace(
      'localStorage.setItem(STORAGE_KEY, JSON.stringify(state));',
      "try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (error) { console.warn('Could not save Anime Haven progress', error); }"
    );

    let enhancedCss = css + `
.rubber-search{position:fixed;right:max(14px, env(safe-area-inset-right));bottom:calc(var(--safe-bottom) + 77px);z-index:80;height:74px;width:74px;display:flex;justify-content:flex-end;align-items:center;transition:width .62s cubic-bezier(.2,.88,.18,1.06),transform .25s ease;overflow:visible;}
.rubber-search.open{width:min(720px,calc(100vw - 24px));}
.rubber-search input{position:relative;z-index:2;width:100%;height:60px;opacity:0;pointer-events:none;padding:0 88px 0 26px;border-radius:999px;border:none;background:linear-gradient(180deg,rgba(255,223,198,.97),rgba(237,173,133,.95));box-shadow:0 14px 34px rgba(0,0,0,.34),inset 0 0 0 2px rgba(104,49,34,.18),inset 0 10px 12px rgba(255,255,255,.24),inset 0 -14px 16px rgba(142,73,51,.18);color:#36150d;font-weight:700;letter-spacing:.01em;transition:opacity .22s ease .18s,transform .58s cubic-bezier(.18,.88,.18,1.03);transform:translateX(16px);caret-color:#5e1608;}
.rubber-search input::placeholder{color:rgba(78,34,24,.58);}
.rubber-search input:focus{outline:none;box-shadow:0 14px 36px rgba(0,0,0,.34),inset 0 0 0 2px rgba(104,49,34,.24),0 0 0 4px rgba(255,139,88,.18),inset 0 -14px 16px rgba(142,73,51,.18);}
.rubber-search.open input{opacity:1;pointer-events:auto;transform:translateX(0);}
.fist-button{position:absolute;right:0;width:74px;height:74px;border:0;border-radius:50%;background:radial-gradient(circle at 36% 30%,#ffd7b8 0,#f7b68c 34%,#dd8760 65%,#a85338 100%);box-shadow:0 0 0 3px rgba(255,255,255,.06),0 14px 24px rgba(0,0,0,.35),inset 0 12px 14px rgba(255,255,255,.18),inset 0 -10px 16px rgba(124,58,35,.26),0 0 28px rgba(255,99,73,.24);cursor:pointer;z-index:3;transition:transform .55s cubic-bezier(.2,.9,.2,1.08),box-shadow .35s ease;overflow:hidden;}
.fist-button .fist{position:relative;display:grid;place-items:center;width:100%;height:100%;font-size:32px;filter:saturate(.9) drop-shadow(0 2px 2px rgba(0,0,0,.18));transform:translateY(1px) translateX(1px);}
.fist-button:hover{box-shadow:0 0 0 3px rgba(255,255,255,.09),0 14px 34px rgba(255,91,73,.34),inset 0 12px 14px rgba(255,255,255,.22),inset 0 -10px 16px rgba(124,58,35,.28);}
.arm-coil{position:absolute;right:11px;top:9px;height:56px;width:56px;border-radius:50%;background:radial-gradient(circle at 50% 50%,rgba(130,60,44,0) 0 7px,#f4bc95 8px 12px,#de8f67 13px 17px,#c56f4d 18px 21px,rgba(130,60,44,0) 22px),repeating-radial-gradient(circle at 50% 50%,#f7c59d 0 6px,#dc9168 6px 11px,#bf6948 11px 15px,rgba(0,0,0,0) 15px 21px);box-shadow:0 8px 20px rgba(0,0,0,.24),inset 0 -10px 18px rgba(124,58,35,.22),0 0 22px rgba(255,92,67,.18);transition:width .62s cubic-bezier(.2,.88,.18,1.06),height .62s cubic-bezier(.2,.88,.18,1.06),right .62s cubic-bezier(.2,.88,.18,1.06),top .62s cubic-bezier(.2,.88,.18,1.06),border-radius .62s cubic-bezier(.2,.88,.18,1.06),opacity .25s ease,filter .25s ease;z-index:1;opacity:1;filter:saturate(1.04);}
.rubber-search.open .arm-coil{width:calc(100% - 52px);height:60px;right:24px;top:7px;border-radius:999px 14px 14px 999px;background:linear-gradient(180deg,rgba(255,231,209,.26),rgba(255,231,209,0) 28%),repeating-linear-gradient(90deg,#f2b88f 0 48px,#e29d74 48px 96px,#cf805a 96px 144px);opacity:.62;filter:saturate(1.05);}
.steam{position:absolute;right:16px;top:-10px;width:28px;height:28px;border-radius:50%;border-top:4px solid rgba(255,255,255,.82);border-left:3px solid rgba(255,255,255,.26);opacity:0;pointer-events:none;}
.steam-b{right:40px;animation-delay:.5s !important;}
.rubber-search.priming .steam,.rubber-search.opening .steam,.rubber-search.open .steam{animation:steamRise 1.25s ease-out infinite;opacity:.82;}
.rubber-search::after{content:'';position:absolute;left:14px;top:50%;width:34px;height:34px;border-radius:50%;transform:translateY(-50%) scale(.2);background:radial-gradient(circle,rgba(255,244,224,.95) 0 25%,rgba(255,199,154,.45) 35%,rgba(255,199,154,0) 72%);opacity:0;pointer-events:none;}
.rubber-search.opening::after{animation:leftImpact .66s ease-out;}
.rubber-search.priming .fist-button{transform:translateX(7px) scale(.97);}
.rubber-search.opening .fist-button{animation:fistPunchLeft .68s cubic-bezier(.17,.91,.23,1.03);}
.rubber-search.opening .arm-coil{animation:armPunchLeft .68s cubic-bezier(.17,.91,.23,1.03);}
.rubber-search.search-flare .fist-button{animation:searchPulse .4s ease;}
@keyframes steamRise{0%{opacity:.78;transform:translateY(6px) translateX(0) scale(.54);}100%{opacity:0;transform:translateY(-32px) translateX(-10px) scale(1.5);}}
@keyframes fistPunchLeft{0%{transform:translateX(0) scale(1);}18%{transform:translateX(8px) scale(.98);}62%{transform:translateX(-14px) scale(1.03);}100%{transform:translateX(0) scale(1);}}
@keyframes armPunchLeft{0%{transform:scaleX(.34);transform-origin:right center;opacity:.96;}18%{transform:scaleX(.24) translateX(4px);transform-origin:right center;}62%{transform:scaleX(1.02) translateX(-6px);transform-origin:right center;opacity:.72;}100%{transform:scaleX(1) translateX(0);transform-origin:right center;opacity:.62;}}
@keyframes leftImpact{0%{opacity:0;transform:translateY(-50%) scale(.2);}48%{opacity:.86;}100%{opacity:0;transform:translateY(-50%) translateX(-18px) scale(1.9);}}
@keyframes searchPulse{0%,100%{transform:scale(1);}50%{transform:scale(1.05);}}
`;
    set('Powering up…',88);
    const parsed=new DOMParser().parseFromString(html,'text/html');
    parsed.querySelectorAll('link[rel="stylesheet"],script[src]').forEach(node=>node.remove());
    document.documentElement.lang=parsed.documentElement.lang||'en';
    document.head.innerHTML=parsed.head.innerHTML;
    document.body.innerHTML=parsed.body.innerHTML;
    const style=document.createElement('style');
    style.textContent=enhancedCss;
    document.head.appendChild(style);
    (0,eval)(data);
    (0,eval)(config);
    (0,eval)(app);
    (()=>{
      const searchBox=document.getElementById('rubberSearch');
      const searchButton=document.getElementById('searchPunch');
      const searchInput=document.getElementById('globalSearch');
      if(!searchBox||!searchButton||!searchInput)return;
      let openTimer=0, closeTimer=0, flareTimer=0;
      searchButton.addEventListener('pointerdown',()=>{
        searchBox.dataset.wasOpen=searchBox.classList.contains('open')?'1':'0';
        if(searchBox.dataset.wasOpen==='0') searchBox.classList.add('priming');
      });
      searchButton.addEventListener('pointerup',()=>searchBox.classList.remove('priming'));
      searchButton.addEventListener('pointercancel',()=>searchBox.classList.remove('priming'));
      searchButton.addEventListener('click',()=>{
        const wasOpen=searchBox.dataset.wasOpen==='1';
        searchBox.classList.remove('priming');
        clearTimeout(openTimer); clearTimeout(flareTimer);
        if(!wasOpen){
          searchBox.classList.add('opening');
          openTimer=window.setTimeout(()=>searchBox.classList.remove('opening'),700);
        } else if(!searchInput.value.trim()){
          searchBox.classList.add('search-flare');
          flareTimer=window.setTimeout(()=>searchBox.classList.remove('search-flare'),450);
        }
      });
      searchInput.addEventListener('focus',()=>searchBox.classList.add('open'));
      searchInput.addEventListener('keydown',event=>{
        if(event.key==='Escape'){
          searchBox.classList.add('closing');
          clearTimeout(closeTimer);
          closeTimer=window.setTimeout(()=>searchBox.classList.remove('closing'),420);
        }
      });
      document.addEventListener('click',event=>{
        if(!searchBox.contains(event.target) && searchBox.classList.contains('open') && !searchInput.value.trim()){
          searchBox.classList.remove('open');
          searchBox.classList.remove('priming');
        }
      });
    })();
  }catch(error){
    console.error(error);
    document.body.innerHTML=`<main class="boot-error"><div>⚠</div><h1>Anime Haven could not awaken</h1><p>${String(error.message||error)}</p><button onclick="location.reload()">Try again</button></main>`;
  }
})();
