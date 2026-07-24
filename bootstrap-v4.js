(async()=>{
  'use strict';
  const status=document.querySelector('#boot-status');
  const progress=document.querySelector('#boot-progress');
  const set=(text,pct)=>{if(status)status.textContent=text;if(progress)progress.style.width=`${pct}%`};
  const parts=[
    'data/app/anime-haven-v4.part00',
    'data/app/anime-haven-v4.part01',
    'data/app/anime-haven-v4.part02'
  ];
  const decoder=new TextDecoder();
  const u16=(v,o)=>v.getUint16(o,true);
  const u32=(v,o)=>v.getUint32(o,true);
  const rebrand=source=>String(source||'')
    .replace(/ANIME[\s-]*HAVEN/g,'KAGENEXUS')
    .replace(/Anime[\s-]*Haven/g,'KageNexus');

  const inflate=async bytes=>{
    const stream=new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
    return new Uint8Array(await new Response(stream).arrayBuffer());
  };

  async function unzip(bytes){
    const view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);
    let eocd=-1;
    for(let i=bytes.length-22;i>=Math.max(0,bytes.length-65557);i--){
      if(u32(view,i)===0x06054b50){eocd=i;break;}
    }
    if(eocd<0)throw new Error('Package directory was not found');
    const total=u16(view,eocd+10);
    const central=u32(view,eocd+16);
    const files={};
    let p=central;
    for(let i=0;i<total;i++){
      if(u32(view,p)!==0x02014b50)throw new Error('Invalid package directory');
      const method=u16(view,p+10);
      const size=u32(view,p+20);
      const nameLen=u16(view,p+28);
      const extraLen=u16(view,p+30);
      const commentLen=u16(view,p+32);
      const local=u32(view,p+42);
      const name=decoder.decode(bytes.slice(p+46,p+46+nameLen));
      const localName=u16(view,local+26);
      const localExtra=u16(view,local+28);
      const start=local+30+localName+localExtra;
      const packed=bytes.slice(start,start+size);
      if(!name.endsWith('/'))files[name]=method===0?packed:method===8?await inflate(packed):null;
      p+=46+nameLen+extraLen+commentLen;
    }
    return files;
  }

  try{
    set('Summoning Ashton’s anime nexus…',8);
    const texts=[];
    for(let i=0;i<parts.length;i++){
      const response=await fetch(`./${parts[i]}?package=4`,{cache:'no-store'});
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
    set('Unlocking the Nexus…',60);
    const files=await unzip(bytes);
    for(const key of ['index.html','styles.css','data.js','config.js','app-v2.js']){
      if(!files[key])throw new Error(`${key} is missing`);
    }

    const html=rebrand(decoder.decode(files['index.html']));
    const css=rebrand(decoder.decode(files['styles.css']));
    const data=decoder.decode(files['data.js']);
    const config=rebrand(decoder.decode(files['config.js']));
    let app=rebrand(decoder.decode(files['app-v2.js']));
    app=app.replace(
      'localStorage.setItem(STORAGE_KEY, JSON.stringify(state));',
      "try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (error) { console.warn('Could not save KageNexus progress', error); }"
    );

    set('Powering up…',88);
    const parsed=new DOMParser().parseFromString(html,'text/html');
    parsed.querySelectorAll('link[rel="stylesheet"],script[src]').forEach(node=>node.remove());

    parsed.querySelectorAll('link[rel="manifest"]').forEach(node=>node.remove());
    const manifest=document.createElement('link');
    manifest.rel='manifest';
    manifest.href='./manifest.webmanifest?brand=25';
    parsed.head.appendChild(manifest);

    parsed.querySelectorAll('link[rel~="icon"],link[rel="apple-touch-icon"]').forEach(node=>node.remove());
    const icon=document.createElement('link');
    icon.rel='icon';
    icon.type='image/svg+xml';
    icon.href='./icons/kagenexus-favicon-v19.svg?brand=25';
    parsed.head.appendChild(icon);
    const touchIcon=document.createElement('link');
    touchIcon.rel='apple-touch-icon';
    touchIcon.href='./icons/kagenexus-favicon-v19.svg?brand=25';
    parsed.head.appendChild(touchIcon);

    const ensureMeta=(name,content)=>{
      let meta=parsed.head.querySelector(`meta[name="${name}"]`);
      if(!meta){meta=document.createElement('meta');meta.name=name;parsed.head.appendChild(meta);}
      meta.content=content;
    };
    ensureMeta('mobile-web-app-capable','yes');
    ensureMeta('apple-mobile-web-app-capable','yes');
    ensureMeta('apple-mobile-web-app-status-bar-style','black-translucent');
    ensureMeta('apple-mobile-web-app-title','KageNexus');
    ensureMeta('application-name','KageNexus');
    ensureMeta('theme-color','#080817');
    parsed.title='KageNexus';

    document.documentElement.lang=parsed.documentElement.lang||'en';
    document.head.innerHTML=parsed.head.innerHTML;
    document.body.innerHTML=parsed.body.innerHTML;

    const style=document.createElement('style');
    style.id='kagenexus-core-styles';
    style.textContent=css;
    document.head.appendChild(style);

    (0,eval)(data);
    (0,eval)(config);
    (0,eval)(app);
    window.dispatchEvent(new CustomEvent('kagenexus-ready'));
    window.dispatchEvent(new CustomEvent('anime-haven-ready'));
  }catch(error){
    console.error(error);
    document.body.innerHTML=`<main class="boot-error"><div>⚠</div><h1>KageNexus could not awaken</h1><p>${String(error.message||error)}</p><button onclick="location.reload()">Try again</button></main>`;
  }
})();
