import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { inflateRawSync } from 'node:zlib';

const repositoryRoot = path.resolve(import.meta.dirname, '..');
const outputRoot = path.resolve(process.argv[2] || '/tmp/kagenexus-release-62');

const APP_PARTS = [
  'legacy/release-62/data/app/anime-haven-v4.part00',
  'legacy/release-62/data/app/anime-haven-v4.part01',
  'legacy/release-62/data/app/anime-haven-v4.part02'
];

const MOBILE_PARTS = [
  'legacy/release-62/data/mobile-suite/mobile-suite-v22.part00',
  'legacy/release-62/data/mobile-suite/mobile-suite-v22.part01',
  'legacy/release-62/data/mobile-suite/mobile-suite-v22.part02',
  'legacy/release-62/data/mobile-suite/mobile-suite-v22.part03',
  'legacy/release-62/data/mobile-suite/mobile-suite-v22.part04',
  'legacy/release-62/data/mobile-suite/mobile-suite-v22.part05a',
  'legacy/release-62/data/mobile-suite/mobile-suite-v22.part05b',
  'legacy/release-62/data/mobile-suite/mobile-suite-v22.part06',
  'legacy/release-62/data/mobile-suite/mobile-suite-v22.part07'
];

const EXPECTED_APP_SHA256 = '02bd73b54887848edbc1d7a6ad82feaa2915191a35cc83490a0527b83bbce57f';
const EXPECTED_MOBILE_SHA256 = 'f737553a2cd9ff2b2870f60042f1d1341581f5e6408f59b3506261136b4435b1';

const hash = value => createHash('sha256').update(value).digest('hex');

async function joinedBase64(files) {
  const chunks = await Promise.all(files.map(file => readFile(path.join(repositoryRoot, file), 'utf8')));
  return chunks.join('').replace(/[^A-Za-z0-9+/=]/g, '');
}

function unzip(buffer) {
  const u16 = offset => buffer.readUInt16LE(offset);
  const u32 = offset => buffer.readUInt32LE(offset);
  let eocd = -1;
  for (let offset = buffer.length - 22; offset >= Math.max(0, buffer.length - 65557); offset -= 1) {
    if (u32(offset) === 0x06054b50) {
      eocd = offset;
      break;
    }
  }
  if (eocd < 0) throw new Error('Release 62 app package directory was not found.');

  const files = new Map();
  const total = u16(eocd + 10);
  let pointer = u32(eocd + 16);
  for (let index = 0; index < total; index += 1) {
    if (u32(pointer) !== 0x02014b50) throw new Error('Release 62 app package directory is invalid.');
    const method = u16(pointer + 10);
    const packedSize = u32(pointer + 20);
    const nameLength = u16(pointer + 28);
    const extraLength = u16(pointer + 30);
    const commentLength = u16(pointer + 32);
    const localOffset = u32(pointer + 42);
    const name = buffer.subarray(pointer + 46, pointer + 46 + nameLength).toString('utf8');
    const localNameLength = u16(localOffset + 26);
    const localExtraLength = u16(localOffset + 28);
    const dataOffset = localOffset + 30 + localNameLength + localExtraLength;
    const packed = buffer.subarray(dataOffset, dataOffset + packedSize);
    const content = method === 0 ? packed : method === 8 ? inflateRawSync(packed) : null;
    if (!content) throw new Error(`Unsupported ZIP method ${method} for ${name}.`);
    if (!name.endsWith('/')) files.set(name, content);
    pointer += 46 + nameLength + extraLength + commentLength;
  }
  return files;
}

function patchMobileSource(source) {
  const replacements = [
    [
      '    section.innerHTML=`<div class="kn-section-heading">',
      "    const signature=items.map(item=>[item.id,item.status,item.season,item.episode,item.updatedAt].join(':')).join('|');\n    if(section.dataset.knSignature===signature)return;\n    section.dataset.knSignature=signature;\n    section.innerHTML=`<div class=\"kn-section-heading\">"
    ],
    [
      "      const item=map.get(titleKey(title));if(!item)return;\n      let row=$('.kn-card-actions',card);\n      const html=actionRow(item);\n      if(row){\n        const wrapper=document.createElement('div');wrapper.innerHTML=html;\n        row.replaceWith(wrapper.firstElementChild);\n      }else card.insertAdjacentHTML('beforeend',html);",
      "      const item=map.get(titleKey(title));if(!item)return;\n      const signature=[item.id,item.mediaType,item.status,item.season,item.episode,item.updatedAt].join(':');\n      let row=$('.kn-card-actions',card);\n      if(row?.dataset.knSignature===signature){card.dataset.knItemId=item.id;return}\n      const wrapper=document.createElement('div');wrapper.innerHTML=actionRow(item);\n      const nextRow=wrapper.firstElementChild;nextRow.dataset.knSignature=signature;\n      if(row)row.replaceWith(nextRow);else card.appendChild(nextRow);"
    ],
    [
      "  function renderContinue(){\n    const home=$('#homeView');",
      "  function renderContinue(){\n    document.getElementById('knContinueWatching')?.remove();\n    return;\n    const home=$('#homeView');"
    ],
    [
      "  function detectBottomNav(){\n    const labels=",
      "  function detectBottomNav(){\n    if($('.kn-bottom-nav[data-kn-safe-nav=\"22\"]'))return;\n    const labels="
    ],
    [
      "        node.classList.add('kn-bottom-nav');",
      "        node.classList.add('kn-bottom-nav');node.dataset.knSafeNav='22';"
    ],
    [
      '        setHeight();new ResizeObserver(setHeight).observe(node);return;',
      "        setHeight();if('ResizeObserver' in window)new ResizeObserver(setHeight).observe(node);return;"
    ],
    [
      '    const observer=new MutationObserver(records=>{if(records.some(record=>record.addedNodes.length))enhance()});',
      "    const observer=new MutationObserver(records=>{\n      const relevant=records.some(record=>[...record.addedNodes].some(node=>node instanceof Element&&(node.matches('.anime-card,#homeView,#settingsView,#addAnimeDialog,#globalSearch,#rubberSearch')||node.querySelector?.('.anime-card,#homeView,#settingsView,#addAnimeDialog,#globalSearch,#rubberSearch'))));\n      if(relevant)enhance();\n    });"
    ]
  ];

  let patched = source;
  for (const [before, after] of replacements) {
    if (!patched.includes(before)) throw new Error('A Release 62 mobile migration patch no longer matches its source.');
    patched = patched.replace(before, after);
  }
  return patched
    .replaceAll('./sw-v2.js?release=22', './sw-v35.js?release=62')
    .replaceAll('./sw-v25.js?release=25', './sw-v35.js?release=62')
    .replaceAll('./sw-v25.js?release=25.1', './sw-v35.js?release=62')
    .replaceAll('./sw-v26.js?release=26', './sw-v35.js?release=62');
}

const appEncoded = await joinedBase64(APP_PARTS);
const appArchive = Buffer.from(appEncoded, 'base64');
if (hash(appArchive) !== EXPECTED_APP_SHA256) throw new Error('Release 62 app package checksum changed.');

const appFiles = unzip(appArchive);
const requiredFiles = ['index.html', 'styles.css', 'data.js', 'config.js', 'app-v2.js'];
for (const file of requiredFiles) {
  if (!appFiles.has(file)) throw new Error(`Release 62 app package is missing ${file}.`);
}

const mobileEncoded = await joinedBase64(MOBILE_PARTS);
const mobileBuffer = Buffer.from(mobileEncoded, 'base64');
if (hash(mobileBuffer) !== EXPECTED_MOBILE_SHA256) throw new Error('Release 62 mobile package checksum changed.');
const mobilePayload = JSON.parse(mobileBuffer.toString('utf8'));

await mkdir(path.join(outputRoot, 'core'), { recursive: true });
for (const [name, content] of appFiles) {
  await writeFile(path.join(outputRoot, 'core', name), content);
}
await writeFile(path.join(outputRoot, 'mobile.js'), patchMobileSource(mobilePayload.js));
await writeFile(path.join(outputRoot, 'mobile.css'), mobilePayload.css);
await writeFile(path.join(outputRoot, 'manifest.json'), `${JSON.stringify({
  sourceCommit: 'be161ba2b131b9d0e7c17a96b56ab085f60511e8',
  appSha256: EXPECTED_APP_SHA256,
  mobileSha256: EXPECTED_MOBILE_SHA256,
  appFiles: [...appFiles.keys()],
  generatedAt: new Date().toISOString()
}, null, 2)}\n`);

console.log(`Release 62 extracted to ${outputRoot}`);
