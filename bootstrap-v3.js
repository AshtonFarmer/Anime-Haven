(async()=>{
  'use strict';

  const status=document.querySelector('#boot-status');
  const progress=document.querySelector('#boot-progress');
  const set=(text,pct)=>{
    if(status)status.textContent=text;
    if(progress)progress.style.width=`${pct}%`;
  };

  const parts=['anime-haven-v4.part00','anime-haven-v4.part01','anime-haven-v4.part02'];
  const decoder=new TextDecoder();
  const u16=(view,offset)=>view.getUint16(offset,true);
  const u32=(view,offset)=>view.getUint32(offset,true);

  async function inflate(bytes){
    const stream=new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
    return new Uint8Array(await new Response(stream).arrayBuffer());
  }

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
    let pointer=central;

    for(let i=0;i<total;i++){
      if(u32(view,pointer)!==0x02014b50)throw new Error('Invalid package directory');
      const method=u16(view,pointer+10);
      const size=u32(view,pointer+20);
      const nameLength=u16(view,pointer+28);
      const extraLength=u16(view,pointer+30);
      const commentLength=u16(view,pointer+32);
      const local=u32(view,pointer+42);
      const name=decoder.decode(bytes.slice(pointer+46,pointer+46+nameLength));
      const localNameLength=u16(view,local+26);
      const localExtraLength=u16(view,local+28);
      const start=local+30+localNameLength+localExtraLength;
      const packed=bytes.slice(start,start+size);
      if(!name.endsWith('/'))files[name]=method===0?packed:method===8?await inflate(packed):null;
      pointer+=46+nameLength+extraLength+commentLength;
    }
    return files;
  }

  try{
    set('Summoning Ashton’s anime archive…',8);
    const texts=[];

    for(let i=0;i<parts.length;i++){
      const response=await fetch(`./${parts[i]}?v=5`,{cache:'no-store'});
      if(!response.ok)throw new Error(`Missing app package ${i+1}`);
      const text=(await response.text()).replace(/[^A-Za-z0-9+/=]/g,'');
      if(!text)throw new Error(`App package ${i+1} was empty`);
      texts.push(text);
      set(`Loading realm ${i+1} of ${parts.length}…`,14+Math.round((i+1)/parts.length*38));
    }

    const encoded=texts.join('');
    if(encoded.length%4!==0)throw new Error('The app package was incomplete. Refresh once more.');

    const binary=atob(encoded);
    const bytes=Uint8Array.from(binary,character=>character.charCodeAt(0));
    set('Unlocking the Haven…',60);

    const files=await unzip(bytes);
    for(const key of ['index.html','styles.css','data.js','config.js','app-v2.js']){
      if(!files[key])throw new Error(`${key} is missing`);
    }

    const html=decoder.decode(files['index.html']);
    const css=decoder.decode(files['styles.css']);
    const data=decoder.decode(files['data.js']);
    const config=decoder.decode(files['config.js']);
    let app=decoder.decode(files['app-v2.js']);

    app=app.replace(
      'localStorage.setItem(STORAGE_KEY, JSON.stringify(state));',
      "try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (error) { console.warn('Could not save Anime Haven progress', error); }"
    );

    set('Powering up…',88);

    const parsed=new DOMParser().parseFromString(html,'text/html');
    parsed.querySelectorAll('link[rel="stylesheet"],script[src]').forEach(node=>node.remove());

    document.documentElement.lang=parsed.documentElement.lang||'en';
    document.head.innerHTML=parsed.head.innerHTML;
    document.body.innerHTML=parsed.body.innerHTML;

    const style=document.createElement('style');
    style.textContent=css;
    document.head.appendChild(style);

    (0,eval)(data);
    (0,eval)(config);
    (0,eval)(app);
  }catch(error){
    console.error(error);
    document.body.innerHTML=`<main class="boot-error"><div>⚠</div><h1>Anime Haven could not awaken</h1><p>${String(error.message||error)}</p><button onclick="location.reload()">Try again</button></main>`;
  }
})();