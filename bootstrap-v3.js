(async()=>{
  'use strict';
  const status=document.querySelector('#boot-status');
  const progress=document.querySelector('#boot-progress');
  const set=(text,pct)=>{if(status)status.textContent=text;if(progress)progress.style.width=`${pct}%`};
  const parts=['anime-haven-v3.part00','anime-haven-v3.part01','anime-haven-v3.part02'];
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
      const response=await fetch(`./${parts[i]}`,{cache:'no-store'});
      if(!response.ok)throw new Error(`Missing app package ${i+1}`);
      texts.push((await response.text()).trim());
      set(`Loading realm ${i+1} of ${parts.length}…`,14+Math.round((i+1)/parts.length*38));
    }
    const binary=atob(texts.join(''));
    const bytes=Uint8Array.from(binary,c=>c.charCodeAt(0));
    set('Unlocking the Haven…',60);
    const files=await unzip(bytes);
    for(const key of ['index.html','styles.css','data.js','config.js','app-v2.js'])if(!files[key])throw new Error(`${key} is missing`);
    const html=decoder.decode(files['index.html']);
    const css=decoder.decode(files['styles.css']);
    const data=decoder.decode(files['data.js']);
    const config=decoder.decode(files['config.js']);
    const app=decoder.decode(files['app-v2.js']);
    const hydrated=html
      .replace('<link rel="stylesheet" href="styles.css" />',`<style>${css}</style>`)
      .replace('<script src="data.js"></script>',`<script>${data}<\/script>`)
      .replace('<script src="config.js"></script>',`<script>${config}<\/script>`)
      .replace('<script src="app.js"></script>',`<script>${app}<\/script>`);
    set('Powering up…',94);
    document.open();document.write(hydrated);document.close();
  }catch(error){
    console.error(error);
    document.body.innerHTML=`<main class="boot-error"><div>⚠</div><h1>Anime Haven could not awaken</h1><p>${String(error.message||error)}</p><button onclick="location.reload()">Try again</button></main>`;
  }
})();
