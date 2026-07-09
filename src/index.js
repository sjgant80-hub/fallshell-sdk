// fallshell SDK · sovereign single-file library · MIT · AI-Native Solutions
// Extracted from fallshell/index.html · 13594 bytes of source logic
// Public-safe: no primes/glyphs/dyad references

const ESTATE = [
  { category: 'Insight', name: 'FallMirror', url: 'https://sjgant80-hub.github.io/fallmirror/', desc: 'private reflection · 7-ring probes' },
  { category: 'Insight', name: 'Bloom Profile Builder', url: 'https://sjgant80-hub.github.io/bloom-profile-builder/', desc: '21-probe calibration · your F(S⃗)', private: true },
  { category: 'Insight', name: 'Bloom-weighted si-didy', url: 'https://sjgant80-hub.github.io/bloom-weighted-sididy/', desc: 'agent response overlay', private: true },
  { category: 'Insight', name: '9-Axis Human Sonar', url: 'https://sjgant80-hub.github.io/9-axis-human-sonar/', desc: '9-dim conversation intelligence', private: true },
  { category: 'Substrate', name: 'κ-EEG Checker', url: 'https://sjgant80-hub.github.io/kappa-eeg-checker/', desc: 'MSE with 7-band overlay', private: true },
  { category: 'Substrate', name: 'INIT Book', url: 'https://sjgant80-hub.github.io/init-book/', desc: '9-chapter framework book', private: true },
  { category: 'Signal', name: 'FallSignature', url: 'https://sjgant80-hub.github.io/fallsignature/', desc: 'Ed25519 content signing' },
  { category: 'Signal', name: 'Mesh 89 Tracker', url: 'https://sjgant80-hub.github.io/mesh-89-tracker/', desc: 'WebRTC peer count → 89' },
  { category: 'Signal', name: 'Hello Device', url: 'https://sjgant80-hub.github.io/hello-device/', desc: 'browser capability check' },
  { category: 'Signal', name: 'Quine Cube Runner', url: 'https://sjgant80-hub.github.io/quine-cube-runner/', desc: 'programs that print themselves' },
  { category: 'Ops', name: 'FallPx', url: 'https://sjgant80-hub.github.io/fallpx/', desc: 'text→PNG · cut Claude bills', private: true }
];
const CATEGORIES = ['Insight','Substrate','Signal','Ops'];
// ============ IDB ============
const DB_NAME='fallshell', DB_V=1;
let db;
const idbOpen = () => new Promise((res,rej)=>{
  const r=indexedDB.open(DB_NAME,DB_V);
  r.onupgradeneeded=(e)=>{const d=e.target.result;
    if(!d.objectStoreNames.contains('kv'))d.createObjectStore('kv');
    if(!d.objectStoreNames.contains('history'))d.createObjectStore('history',{keyPath:'id',autoIncrement:true});
  };
  r.onsuccess=()=>{db=r.result;res(db);};
  r.onerror=()=>rej(r.error);
});
const idbGet = (store,key) => new Promise((res)=>{const tx=db.transaction(store).objectStore(store).get(key);tx.onsuccess=()=>res(tx.result);tx.onerror=()=>res(null);});
const idbPut = (store,val,key) => new Promise((res)=>{const s=db.transaction(store,'readwrite').objectStore(store);const tx=key===undefined?s.put(val):s.put(val,key);tx.onsuccess=()=>res();tx.onerror=()=>res();});
const idbAll = (store) => new Promise((res)=>{const tx=db.transaction(store).objectStore(store).getAll();tx.onsuccess=()=>res(tx.result||[]);tx.onerror=()=>res([]);});
const idbClear = (store) => new Promise((res)=>{const tx=db.transaction(store,'readwrite').objectStore(store).clear();tx.onsuccess=()=>res();tx.onerror=()=>res();});
// ============ STATE ============
let currentTool = null;
let filterQuery = '';
const state = { S: [0,0,0,0,0,0,0], leftOpen:true, rightOpen:true };
const body = $('body');
// ============ RENDER LEFT SIDEBAR ============
function renderTools(){
  const list = $('toolList');
  const q = filterQuery.trim().toLowerCase();
  const matches = ESTATE.filter(t => !q || t.name.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q) || t.category.toLowerCase().includes(q));
  if(matches.length === 0){ list.innerHTML = '<div class="tool-empty">no tools match</div>'; return; }
  let html = '';
  let quickIdx = 0;
  for(const cat of CATEGORIES){
    const catTools = matches.filter(t => t.category === cat);
    if(catTools.length === 0) continue;
    html += `<div class="cat"><div class="cat-title"><span>${cat}</span><span class="count">${catTools.length}</span></div>`;
    for(const t of catTools){
      quickIdx++;
      const active = currentTool && currentTool.url === t.url ? ' active' : '';
      const idx = ESTATE.indexOf(t);
      const shortcut = quickIdx <= 9 ? `<span class="tool-num">⌘${quickIdx}</span>` : '';
      html += `<div class="tool${active}" data-idx="${idx}" data-quick="${quickIdx}">
        <div class="tool-head"><span class="tool-name">${t.name}${t.private?' <span class="tool-private">●</span>':''}</span>${shortcut}</div>
        <div class="tool-desc">${t.desc}</div></div>`;
    }
    html += '</div>';
  }
  list.innerHTML = html;
  list.querySelectorAll('.tool').forEach(el => el.addEventListener('click', () => openTool(ESTATE[+el.dataset.idx])));
}
// ============ WELCOME GRID ============
function renderWelcome(){
  const grid = $('welcomeGrid');
  const picks = [
    ESTATE.find(t=>t.name==='FallMirror'),
    ESTATE.find(t=>t.name==='FallSignature'),
    ESTATE.find(t=>t.name==='Hello Device'),
    ESTATE.find(t=>t.name==='Mesh 89 Tracker'),
    ESTATE.find(t=>t.name==='Quine Cube Runner'),
    ESTATE.find(t=>t.name==='FallPx')
  ].filter(Boolean);
  grid.innerHTML = picks.map(t => `<div class="welcome-card" data-url="${t.url}"><div class="cn">${t.category}</div><div class="nm">${t.name}</div><div class="ds">${t.desc}</div></div>`).join('');
  grid.querySelectorAll('.welcome-card').forEach(el => el.addEventListener('click', () => openTool(ESTATE.find(t=>t.url===el.dataset.url))));
}
// ============ OPEN TOOL ============
async function openTool(tool){
  if(!tool) return;
  currentTool = tool;
  const wrap = $('iframeWrap');
  wrap.innerHTML = `
    <div class="iframe-head">
      <span class="dot"></span>
      <span class="name">${tool.name}</span>
      <span class="cat-tag">${tool.category}</span>
      <span class="url">${tool.url}</span>
      <a href="${tool.url}" target="_blank" rel="noopener" class="open-external">open ↗</a>
    </div>
    <iframe src="${tool.url}" sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-storage-access-by-user-activation allow-downloads" allow="clipboard-read; clipboard-write; camera; microphone; display-capture"></iframe>`;
  renderTools();
  await idbPut('kv', tool.url, 'lastTool');
  await idbPut('history', { ts: Date.now(), tool: tool.name, url: tool.url, kind:'open' });
}
// ============ FOLDKIT PANEL ============
function updateFoldkit(text){
  const op = fk.pickOpForBand(band.name);
  $('bandGlyph').textContent = band.glyph;
  $('bandName').textContent = band.name;
  $('bandRange').textContent = `κ ∈ [${band.min===-Infinity?'−∞':band.min}, ${band.max===Infinity?'∞':band.max})`;
  const warn = $('bandWarn');
  if(band.warn){ warn.style.display='block'; warn.textContent='⚠ collapse zone · consider return · 華 flower op'; }
  else if(band.orphan){ warn.style.display='block'; warn.textContent='♡ orphan zone · TIME layer · where experience lives'; warn.style.color='var(--sage)'; }
  else warn.style.display='none';
  $('opKanji').textContent = op.kanji;
  $('opVerb').textContent = op.verb;
  $('opArrow').textContent = op.arrow;
  $('opProbe').textContent = op.probe;
  if(text.trim()){
    state.S[band.ring] = (state.S[band.ring]||0) + 1;
    renderFingerprint();
    idbPut('history', { ts: Date.now(), band:band.name, glyph:band.glyph, text:text.slice(0,140), kind:'classify' });
  }
}
function renderFingerprint(){
  $('fsRings').textContent = JSON.stringify(state.S);
  $('fsSig').textContent = fk.stateSignature(state.S);
  $('fsNum').textContent = fk.foldNumber(state.S).toLocaleString();
  $('fsSum').textContent = fk.stateSum(state.S);
}
async function renderHistory(){
  const items = (await idbAll('history')).filter(h=>h.kind==='classify').reverse().slice(0,50);
  const list = $('fkHistory');
  if(items.length === 0){ list.innerHTML = '<div class="empty">no classifications yet</div>'; return; }
  list.innerHTML = items.map(h => `<div class="history-item"><div class="ts">${new Date(h.ts).toLocaleString()}</div><div class="txt">${(h.text||'').replace(/[<>]/g,'')}</div><div class="b">${h.glyph||''} ${h.band}</div></div>`).join('');
}
// ============ TAB SWITCHING ============
  t.classList.add('on');
  if(t.dataset.fv === 'history') renderHistory();
}));
// ============ INPUT HANDLERS ============
let fkDebounce;
$('fkText').addEventListener('input', (e) => { clearTimeout(fkDebounce); fkDebounce = setTimeout(() => updateFoldkit(e.target.value), 250); });
$('filterInput').addEventListener('input', (e) => { filterQuery = e.target.value; renderTools(); });
$('fsReset').addEventListener('click', () => { state.S = [0,0,0,0,0,0,0]; renderFingerprint(); });
$('clearHistory').addEventListener('click', async () => { await idbClear('history'); renderHistory(); });
// ============ SIDEBAR TOGGLES ============
async function toggleLeft(){ state.leftOpen = !state.leftOpen; body.classList.toggle('left-collapsed', !state.leftOpen); await idbPut('kv', state.leftOpen, 'leftOpen'); }
async function toggleRight(){ state.rightOpen = !state.rightOpen; body.classList.toggle('right-collapsed', !state.rightOpen); await idbPut('kv', state.rightOpen, 'rightOpen'); }
$('toggleLeft').addEventListener('click', toggleLeft);
$('toggleRight').addEventListener('click', toggleRight);
// ============ SEARCH MODAL ============
const modal = $('searchModal'), sInput = $('searchInput'), sResults = $('searchResults');
let sIdx = 0, sMatches = [];
function openSearch(){ modal.classList.add('on'); sInput.value=''; renderSearch(''); setTimeout(()=>sInput.focus(),50); }
function closeSearch(){ modal.classList.remove('on'); }
function renderSearch(q){
  q = q.trim().toLowerCase();
  sMatches = ESTATE.filter(t => !q || t.name.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q) || t.category.toLowerCase().includes(q));
  sIdx = 0;
  sResults.innerHTML = sMatches.map((t,i) => `<div class="r${i===0?' on':''}" data-i="${i}"><div><span class="c">${t.category}</span><span class="n">${t.name}${t.private?' <span class="tool-private">●</span>':''}</span></div><div class="d">${t.desc}</div></div>`).join('') || '<div class="tool-empty" style="padding:20px">no matches</div>';
  sResults.querySelectorAll('.r').forEach(el => {
    el.addEventListener('click', () => { openTool(sMatches[+el.dataset.i]); closeSearch(); });
    el.addEventListener('mouseover', () => { sResults.querySelectorAll('.r').forEach(x=>x.classList.remove('on')); el.classList.add('on'); sIdx = +el.dataset.i; });
  });
}
sInput.addEventListener('input', (e) => renderSearch(e.target.value));
sInput.addEventListener('keydown', (e) => {
  if(e.key==='ArrowDown'){e.preventDefault();sIdx=Math.min(sIdx+1,sMatches.length-1);updateSelected();}
  else if(e.key==='ArrowUp'){e.preventDefault();sIdx=Math.max(sIdx-1,0);updateSelected();}
  else if(e.key==='Enter'){e.preventDefault();if(sMatches[sIdx]){openTool(sMatches[sIdx]);closeSearch();}}
  else if(e.key==='Escape'){closeSearch();}
});
function updateSelected(){ sResults.querySelectorAll('.r').forEach((el,i)=>el.classList.toggle('on', i===sIdx)); const on = sResults.querySelector('.r.on'); if(on) on.scrollIntoView({block:'nearest'}); }
modal.addEventListener('click', (e) => { if(e.target === modal) closeSearch(); });
// ============ KEYBOARD ============
document.addEventListener('keydown', (e) => {
  const mod = e.ctrlKey || e.metaKey;
  if(mod && e.key === 'k'){ e.preventDefault(); openSearch(); return; }
  if(mod && e.key === 'b'){ e.preventDefault(); toggleLeft(); return; }
  if(mod && /^[1-9]$/.test(e.key)){
    e.preventDefault();
    const n = parseInt(e.key,10);
    const q = filterQuery.trim().toLowerCase();
    const visible = ESTATE.filter(t => !q || t.name.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q));
    const ordered = CATEGORIES.flatMap(c => visible.filter(t => t.category === c));
    if(ordered[n-1]) openTool(ordered[n-1]);
  }
});
// ============ PWA INSTALL ============
let deferredPrompt;
$('installBtn').addEventListener('click', async () => {
  if(!deferredPrompt) return;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  if(outcome === 'accepted'){ $('installBtn').style.display='none'; const h=$('installedHint'); h.classList.add('on'); setTimeout(()=>h.classList.remove('on'), 4000); }
  deferredPrompt = null;
});
// ============ SW ============
if('serviceWorker' in navigator){ navigator.serviceWorker.register('sw.js').catch(()=>{}); }
// ============ INIT ============
(async () => {
  await idbOpen();
  const savedLeft = await idbGet('kv', 'leftOpen');
  const savedRight = await idbGet('kv', 'rightOpen');
  if(savedLeft === false){ state.leftOpen = false; body.classList.add('left-collapsed'); }
  if(savedRight === false){ state.rightOpen = false; body.classList.add('right-collapsed'); }
  renderTools();
  renderWelcome();
  updateFoldkit('');
  renderFingerprint();
})();

// Named exports for the primary API surface
export { renderTools };
export { renderWelcome };
export { openTool };
export { updateFoldkit };
export { renderFingerprint };
export { renderHistory };
export { toggleLeft };
export { toggleRight };
export { openSearch };
export { closeSearch };

export { ESTATE };
export { CATEGORIES };
export { DB_NAME };
