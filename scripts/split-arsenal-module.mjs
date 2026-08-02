import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const repositoryRoot = path.resolve(import.meta.dirname, '..');
const sourcePath = path.join(repositoryRoot, 'legacy', 'release-62', 'arsenal-v34.js');
const source = await readFile(sourcePath, 'utf8');

const itemsPrefix = "  const ITEMS=";
const logicMarker = "\n  const DISPLAY_ITEMS=";
const wrapperEnd = "\n})();";
const itemsStart = source.indexOf(itemsPrefix);
const logicStart = source.indexOf(logicMarker);
const logicEnd = source.lastIndexOf(wrapperEnd);

if (itemsStart < 0 || logicStart < 0 || logicEnd < 0 || logicStart <= itemsStart) {
  throw new Error('The Release 62 Arsenal source no longer matches the expected module boundaries.');
}

const itemsLiteral = source.slice(itemsStart + itemsPrefix.length, logicStart).trim();
if (!itemsLiteral.startsWith('[') || !itemsLiteral.endsWith(';')) {
  throw new Error('The Release 62 Arsenal item collection could not be isolated.');
}

let logic = source.slice(logicStart + 1, logicEnd).replace(/^  /gm, '');
logic = logic.replace('function install(){', 'export function installArsenal(){');

const legacyAutoStart = `if(install())return;
window.addEventListener('kagenexus-ready',install,{once:true});
window.addEventListener('anime-haven-ready',install,{once:true});
let tries=0;
const timer=setInterval(()=>{tries++;if(install()||tries>200)clearInterval(timer)},100);`;

const moduleAutoStart = `export function autoInstallArsenal(){
  if(typeof document==='undefined')return;
  if(installArsenal())return;
  window.addEventListener('kagenexus-ready',installArsenal,{once:true});
  window.addEventListener('anime-haven-ready',installArsenal,{once:true});
  let tries=0;
  const timer=setInterval(()=>{tries++;if(installArsenal()||tries>200)clearInterval(timer)},100);
}

autoInstallArsenal();`;

if (!logic.includes(legacyAutoStart)) {
  throw new Error('The Release 62 Arsenal auto-start block no longer matches.');
}
logic = logic.replace(legacyAutoStart, moduleAutoStart);

await mkdir(path.join(repositoryRoot, 'src', 'data'), { recursive: true });
await writeFile(
  path.join(repositoryRoot, 'src', 'data', 'arsenal-items.js'),
  `export const ARSENAL_ITEMS=${itemsLiteral}\n`
);
await writeFile(
  path.join(repositoryRoot, 'src', 'arsenal.js'),
  `import { ARSENAL_ITEMS as ITEMS } from './data/arsenal-items.js';\n\nconst arsenalCollator=new Intl.Collator(undefined,{numeric:true,sensitivity:'base'});\n${logic.trim()}\n`
);

console.log(`Split ${sourcePath} into static Arsenal data and UI modules.`);
