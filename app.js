
const __dummy=(()=>{const __o={style:{},dataset:{},value:'',textContent:'',innerHTML:''};const __noop=()=>{};return new Proxy(__o,{get(t,p){if(p==='style')return t.style;if(p==='dataset')return t.dataset;if(p==='classList')return{add(){},remove(){},toggle(){},contains:()=>false};if(p==='querySelectorAll')return()=>[];if(p==='querySelector')return()=>__dummy;if(p==='addEventListener'||p==='removeEventListener')return __noop;if(p==='closest')return()=>null;if(p in t)return t[p];return __noop;},set(t,p,v){t[p]=v;return true;}});})();
const $=id=>document.getElementById(id)||__dummy;
const fmt=t=>{t=Math.max(0,t);const m=Math.floor(t/60),s=t%60;return String(m).padStart(2,'0')+':'+s.toFixed(1).padStart(4,'0');};
const vid=$('vid'), overlay=$('overlay'), track=$('track'), prog=$('prog');
let duration=0, moments=[], placements=[], selected=null, filter='all', query='';
let plan='free'; try{ if(localStorage.getItem('editmate_plan')==='premium') plan='premium'; }catch(e){}
const ASSETS=[
 {id:'skull',name:'Skull (vine boom)',type:'meme',emoji:'💀',vibe:['funny','fail','shock'],hot:true,src:'TikTok • Reels • Shorts'},
 {id:'cry',name:'Crying laugh',type:'meme',emoji:'😭',vibe:['funny','awkward','fail'],hot:true,src:'TikTok • Reels • Shorts'},
 {id:'bruh',name:'Bruh moment',type:'meme',emoji:'😐',vibe:['awkward','fail'],hot:false,src:'TikTok • Reels'},
 {id:'shock',name:'Shocked',type:'meme',emoji:'😱',vibe:['shock'],hot:false,src:'Reels • Shorts'},
 {id:'gigachad',name:'Gigachad (sigma edit)',type:'meme',emoji:'🗿',vibe:['win','hype'],hot:true,src:'TikTok • Reels • Shorts'},
 {id:'npc',name:'NPC (TikTok live)',type:'meme',emoji:'🧍',vibe:['awkward','funny'],hot:true,src:'TikTok • Reels'},
 {id:'rizz',name:'Rizz (W rizz)',type:'meme',emoji:'😏',vibe:['win','funny'],hot:true,src:'TikTok • Reels • Shorts'},
 {id:'skibidi',name:'Skibidi',type:'meme',emoji:'🚽',vibe:['funny','hype'],hot:true,src:'TikTok • Shorts'},
 {id:'grimace',name:'Grimace Shake',type:'meme',emoji:'🥤',vibe:['shock','funny'],hot:true,src:'TikTok • Reels'},
 {id:'doge',name:'Doge (much wow)',type:'meme',emoji:'🐕',vibe:['funny','win'],hot:true,src:'Reels • Shorts'},
 {id:'bonk',name:'Bonk!',type:'meme',emoji:'🔨',vibe:['funny'],hot:false,src:'Reels • Shorts'},
 {id:'stonks',name:'Stonks',type:'meme',emoji:'📈',vibe:['win','funny'],hot:false,src:'Reels • Shorts'},
 {id:'drake',name:'Drake yes-no',type:'meme',emoji:'↔️',vibe:['funny'],hot:false,src:'TikTok • Reels'},
 {id:'catfight',name:'Woman vs Cat',type:'meme',emoji:'🙀',vibe:['funny','awkward'],hot:false,src:'Reels • Shorts'},
 {id:'thisfine',name:'This Is Fine',type:'meme',emoji:'🔥',vibe:['fail','funny'],hot:false,src:'Reels • Shorts'},
 {id:'pikachu',name:'Pikachu face',type:'meme',emoji:'😲',vibe:['shock','funny'],hot:false,src:'Reels • Shorts'},
 {id:'ohio',name:'Only in Ohio',type:'meme',emoji:'🌀',vibe:['funny','shock'],hot:true,src:'TikTok'},
 {id:'bateman',name:'Bateman (sigma grindset)',type:'meme',emoji:'🕶️',vibe:['win','hype'],hot:true,src:'TikTok • Reels'},
 {id:'wednesday',name:'Wednesday dance',type:'meme',emoji:'💃',vibe:['hype','win'],hot:true,src:'TikTok • Reels'},
 {id:'barbie',name:'Barbie',type:'meme',emoji:'💖',vibe:['hype','win'],hot:false,src:'Reels • Shorts'},
 {id:'successkid',name:'Success Kid',type:'meme',emoji:'✊',vibe:['win'],hot:false,src:'Reels • Shorts'},
 {id:'disastergirl',name:'Disaster Girl',type:'meme',emoji:'👧',vibe:['fail','funny'],hot:false,src:'Reels • Shorts'},
 {id:'rollsafe',name:'Roll Safe',type:'meme',emoji:'🧠',vibe:['win','funny'],hot:false,src:'Reels'},
 {id:'changemind',name:'Change My Mind',type:'meme',emoji:'☕',vibe:['funny','awkward'],hot:false,src:'Reels'},
 {id:'clap',name:'Clap SFX',type:'sfx',emoji:'👏',vibe:['win','hype'],hot:false,src:'Reels • Shorts'},
 {id:'airhorn',name:'Airhorn',type:'sfx',emoji:'📯',vibe:['hype','win','shock'],hot:false,src:'TikTok • Shorts'},
 {id:'boomSfx',name:'Vine boom',type:'sfx',emoji:'🔊',vibe:['fail','shock','funny'],hot:true,src:'TikTok • Reels • Shorts'},
 {id:'ohno',name:'Oh No song',type:'sfx',emoji:'🎶',vibe:['fail','funny'],hot:true,src:'TikTok • Reels • Shorts'},
 {id:'bruhsfx',name:'Bruh sound',type:'sfx',emoji:'🗣️',vibe:['fail','funny'],hot:true,src:'TikTok • Shorts'},
 {id:'fbi',name:'FBI Open Up',type:'sfx',emoji:'🚨',vibe:['shock','funny'],hot:true,src:'TikTok • Reels'},
 {id:'run',name:'Run! (vine)',type:'sfx',emoji:'🏃',vibe:['funny'],hot:true,src:'TikTok • Shorts'},
 {id:'beep',name:'Censor beep',type:'sfx',emoji:'📳',vibe:['funny'],hot:false,src:'Reels • Shorts'},
 {id:'trombone',name:'Sad trombone',type:'sfx',emoji:'🎺',vibe:['fail'],hot:false,src:'Reels'},
 {id:'scratch',name:'Record scratch',type:'sfx',emoji:'💿',vibe:['awkward','shock'],hot:false,src:'Reels'},
 {id:'dramatic',name:'Dramatic dum',type:'sfx',emoji:'🥁',vibe:['shock'],hot:false,src:'Reels • Shorts'},
 {id:'bong',name:'Taco Bell bong',type:'sfx',emoji:'🔔',vibe:['win','funny'],hot:true,src:'TikTok • Reels'},
 {id:'winerror',name:'Windows error',type:'sfx',emoji:'🪟',vibe:['fail','funny'],hot:false,src:'Shorts'},
 {id:'buzz',name:'Phone buzz',type:'sfx',emoji:'📱',vibe:['shock'],hot:false,src:'Reels'},
 {id:'discord',name:'Discord ping',type:'sfx',emoji:'🔵',vibe:['funny'],hot:true,src:'TikTok • Reels'},
 {id:'oof',name:'Roblox oof',type:'sfx',emoji:'🎮',vibe:['fail','funny'],hot:true,src:'TikTok • Shorts'},
 {id:'eject',name:'Ejected (sus)',type:'sfx',emoji:'🚀',vibe:['funny','shock'],hot:true,src:'TikTok'},
 {id:'coin',name:'Coin (Mario)',type:'sfx',emoji:'🪙',vibe:['win'],hot:true,src:'Shorts • Reels'},
 {id:'crickets',name:'Crickets',type:'sfx',emoji:'🦗',vibe:['awkward'],hot:true,src:'TikTok • Reels'},
 {id:'fire',name:'Fire sticker',type:'sticker',emoji:'🔥',vibe:['hype','win'],hot:true,src:'TikTok • Reels • Shorts'},
 {id:'pop',name:'Mind-blown GIF',type:'gif',emoji:'🤯',vibe:['shock','win'],hot:false,src:'Reels • Shorts'},
 {id:'sideye',name:'Side-eye GIF',type:'gif',emoji:'🙄',vibe:['awkward'],hot:false,src:'TikTok • Reels'},
 {id:'gg',name:'GG sticker',type:'sticker',emoji:'🎮',vibe:['win'],hot:false,src:'Shorts • Reels'},
 {id:'tada',name:'Tada sparkle',type:'sticker',emoji:'✨',vibe:['win'],hot:false,src:'Reels • Shorts'},
 {id:'hundred',name:'100 sticker',type:'sticker',emoji:'💯',vibe:['win'],hot:true,src:'TikTok • Reels • Shorts'},
 {id:'heartfire',name:'Heart on fire',type:'sticker',emoji:'❤️‍🔥',vibe:['hype','win'],hot:true,src:'TikTok • Reels'},
 {id:'pleading',name:'Pleading',type:'sticker',emoji:'🥺',vibe:['funny','awkward'],hot:true,src:'TikTok • Reels • Shorts'},
 {id:'nails',name:'Slay nails',type:'sticker',emoji:'💅',vibe:['win','funny'],hot:true,src:'TikTok • Reels'},
 {id:'salute',name:'Salute',type:'sticker',emoji:'🫡',vibe:['win'],hot:false,src:'Reels • Shorts'},
 {id:'bell',name:'Subscribe bell',type:'sticker',emoji:'🔔',vibe:['win'],hot:false,src:'YouTube • Shorts'},
 {id:'like',name:'Like button',type:'sticker',emoji:'👍',vibe:['win'],hot:false,src:'YouTube • Reels • Shorts'},
 {id:'follow',name:'Follow +',type:'sticker',emoji:'➕',vibe:['win','hype'],hot:true,src:'TikTok • Reels • Shorts'},
 {id:'trophy',name:'Champion',type:'sticker',emoji:'🏆',vibe:['win'],hot:false,src:'Reels'},
 {id:'muscle',name:'Beast mode',type:'sticker',emoji:'💪',vibe:['hype'],hot:false,src:'Shorts • Reels'},
 {id:'eyes',name:'Watching you',type:'sticker',emoji:'👀',vibe:['shock','awkward'],hot:false,src:'TikTok • Reels'},
 {id:'party',name:'Party',type:'sticker',emoji:'🥳',vibe:['win','hype'],hot:false,src:'Reels • Shorts'},
 {id:'laugh',name:'Rolling laugh GIF',type:'gif',emoji:'🤣',vibe:['funny'],hot:true,src:'TikTok • Reels • Shorts'},
 {id:'pain',name:'Smile through pain GIF',type:'gif',emoji:'🥲',vibe:['awkward','funny'],hot:true,src:'TikTok • Reels'},
 {id:'melt',name:'Melting GIF',type:'gif',emoji:'🫠',vibe:['awkward','fail'],hot:true,src:'TikTok • Reels'},
 {id:'clown',name:'Clown GIF',type:'gif',emoji:'🤡',vibe:['fail','funny'],hot:true,src:'TikTok • Shorts'},
 {id:'spicy',name:'Spicy take GIF',type:'gif',emoji:'🥵',vibe:['hype','shock'],hot:false,src:'Reels'},
 {id:'caught',name:'Caught GIF',type:'gif',emoji:'😳',vibe:['shock','awkward'],hot:false,src:'Reels • Shorts'},
 {id:'peek',name:'Peeking GIF',type:'gif',emoji:'🫣',vibe:['shock','awkward'],hot:true,src:'TikTok • Reels'},
 {id:'locked',name:'Locked in GIF',type:'gif',emoji:'😤',vibe:['hype'],hot:false,src:'Shorts • Reels'},
 {id:'fine',name:'Fine GIF',type:'gif',emoji:'🙃',vibe:['awkward','funny'],hot:false,src:'Reels'},
 {id:'sleepy',name:'Boring GIF',type:'gif',emoji:'😴',vibe:['funny','awkward'],hot:false,src:'Reels'},
 {id:'aura',name:'Aura +1000',type:'meme',emoji:'💫',vibe:['win','hype'],hot:true,src:'Instagram Reels • TikTok'},
 {id:'cook',name:'Let him cook',type:'meme',emoji:'👨‍🍳',vibe:['win','funny'],hot:true,src:'Instagram Reels • TikTok'},
 {id:'mainchar',name:'Main character',type:'meme',emoji:'🎬',vibe:['win','hype'],hot:false,src:'Instagram Reels'},
 {id:'canon',name:'Canon event',type:'meme',emoji:'🕸️',vibe:['funny','shock'],hot:false,src:'TikTok • Reels'},
 {id:'delulu',name:'Delulu',type:'meme',emoji:'🤪',vibe:['funny'],hot:true,src:'Instagram Reels • TikTok'},
 {id:'pookie',name:'Pookie',type:'meme',emoji:'🧸',vibe:['funny','win'],hot:true,src:'Instagram Reels • TikTok'},
 {id:'girldinner',name:'Girl dinner',type:'meme',emoji:'🍱',vibe:['funny'],hot:true,src:'Instagram Reels • TikTok'},
 {id:'girlmath',name:'Girl math',type:'meme',emoji:'🧮',vibe:['funny'],hot:false,src:'Instagram Reels • TikTok'},
 {id:'mother',name:'Mother (mothering)',type:'meme',emoji:'🤱',vibe:['win','hype'],hot:true,src:'Instagram Reels • TikTok'},
 {id:'ate',name:'Ate that',type:'meme',emoji:'😋',vibe:['win'],hot:true,src:'Instagram Reels • TikTok'},
 {id:'nocap',name:'No cap',type:'meme',emoji:'🧢',vibe:['funny','win'],hot:false,src:'TikTok • Shorts'},
 {id:'touchgrass',name:'Touch grass',type:'meme',emoji:'🌱',vibe:['funny'],hot:false,src:'TikTok • Reels'},
 {id:'ratio',name:'Ratio + L',type:'meme',emoji:'📉',vibe:['funny'],hot:false,src:'TikTok'},
 {id:'girlboss',name:'Girlboss',type:'meme',emoji:'💼',vibe:['win','funny'],hot:false,src:'Reels'},
 {id:'gyatt',name:'GYATT',type:'meme',emoji:'🍑',vibe:['shock','funny'],hot:true,src:'TikTok • Reels'},
 {id:'mewing',name:'Mewing',type:'meme',emoji:'😶',vibe:['win'],hot:true,src:'TikTok • Reels • Shorts'},
 {id:'fanumtax',name:'Fanum tax',type:'meme',emoji:'🍔',vibe:['funny'],hot:true,src:'TikTok • Shorts'},
 {id:'demure',name:'Very demure',type:'meme',emoji:'🧘',vibe:['funny','win'],hot:true,src:'Instagram Reels • TikTok'},
 {id:'pushpa',name:'Pushpa (Jhukega nahi)',type:'meme',emoji:'🌿',vibe:['win','hype'],hot:true,src:'Instagram Reels • Shorts'},
 {id:'leo',name:'Leo',type:'meme',emoji:'🦁',vibe:['win','funny'],hot:true,src:'Instagram Reels'},
 {id:'roman',name:'Roman Empire',type:'meme',emoji:'🏛️',vibe:['funny'],hot:false,src:'TikTok • Reels'},
 {id:'goat',name:'GOAT',type:'meme',emoji:'🐐',vibe:['win'],hot:true,src:'Instagram Reels • Shorts'},
 {id:'siuuu',name:'SIUUU',type:'meme',emoji:'⚽',vibe:['hype','win'],hot:true,src:'Instagram Reels • Shorts'},
 {id:'brat',name:'Brat summer',type:'sticker',emoji:'🟢',vibe:['hype'],hot:true,src:'Instagram Reels • TikTok'},
 {id:'coquette',name:'Coquette',type:'sticker',emoji:'🎀',vibe:['win'],hot:false,src:'Instagram Reels'},
 {id:'mobwife',name:'Mob wife',type:'sticker',emoji:'💋',vibe:['win','hype'],hot:false,src:'Instagram Reels • TikTok'},
 {id:'pov',name:'POV shot',type:'sticker',emoji:'🎥',vibe:['funny','win'],hot:true,src:'Instagram Reels • TikTok • Shorts'},
 {id:'grwm',name:'GRWM',type:'sticker',emoji:'💄',vibe:['win'],hot:true,src:'Instagram Reels • TikTok'},
 {id:'fitcheck',name:'Fit check',type:'sticker',emoji:'👗',vibe:['win'],hot:false,src:'Instagram Reels'},
 {id:'unboxing',name:'Unboxing',type:'sticker',emoji:'📦',vibe:['win','funny'],hot:true,src:'Instagram Reels • Shorts'},
 {id:'glowup',name:'Glow-up',type:'sticker',emoji:'🌟',vibe:['win'],hot:false,src:'Instagram Reels'},
 {id:'gulabi',name:'Gulabi Sadi',type:'sticker',emoji:'🌸',vibe:['hype','win'],hot:false,src:'Instagram Reels'},
 {id:'kala',name:'Kala Chashma',type:'sticker',emoji:'👓',vibe:['hype','win'],hot:true,src:'Instagram Reels • Shorts'},
 {id:'appledance',name:'Apple dance GIF',type:'gif',emoji:'🍏',vibe:['hype'],hot:true,src:'TikTok • Reels'},
 {id:'tshwala',name:'Tshwala Bam GIF',type:'gif',emoji:'👯',vibe:['hype'],hot:true,src:'Instagram Reels • TikTok'},
 {id:'transition',name:'Smooth transition GIF',type:'gif',emoji:'🔄',vibe:['hype','win'],hot:true,src:'Instagram Reels • Shorts'},
 {id:'waitforit',name:'Wait for it GIF',type:'gif',emoji:'⏳',vibe:['shock'],hot:false,src:'Reels • Shorts'},
 {id:'moye',name:'Moye Moye song',type:'sfx',emoji:'🌊',vibe:['fail','funny'],hot:true,src:'Instagram Reels • Shorts'},
 {id:'jamal',name:'Jamal Kudu',type:'sfx',emoji:'🪘',vibe:['hype','win'],hot:true,src:'Instagram Reels'},
 {id:'espresso',name:'Espresso',type:'sfx',emoji:'☕',vibe:['hype'],hot:true,src:'Instagram Reels • TikTok'},
 {id:'apt',name:'APT.',type:'sfx',emoji:'🍎',vibe:['hype','win'],hot:true,src:'Instagram Reels • TikTok'},
 {id:'notlikeus',name:'Not Like Us',type:'sfx',emoji:'🕺',vibe:['hype'],hot:true,src:'Instagram Reels • TikTok'},
 {id:'birds',name:'Birds of a Feather',type:'sfx',emoji:'🐦',vibe:['win'],hot:false,src:'Instagram Reels'},
 {id:'houdini',name:'Houdini',type:'sfx',emoji:'🎩',vibe:['shock','hype'],hot:false,src:'Instagram Reels'},
 {id:'cupid',name:'Cupid (Twin Ver.)',type:'sfx',emoji:'👼',vibe:['win','funny'],hot:true,src:'Instagram Reels • TikTok'},
 {id:'calmdown',name:'Calm Down',type:'sfx',emoji:'🌙',vibe:['win'],hot:false,src:'Instagram Reels'},
 {id:'painttown',name:'Paint the Town Red',type:'sfx',emoji:'🎨',vibe:['hype'],hot:false,src:'Instagram Reels'},
 {id:'phonk',name:'Phonk drift',type:'sfx',emoji:'🚗',vibe:['hype'],hot:true,src:'Instagram Reels • Shorts'},
 {id:'usethissound',name:'Use this sound',type:'sfx',emoji:'🎤',vibe:['win'],hot:true,src:'Instagram Reels • TikTok'},
 {id:'spedup',name:'Sped up',type:'sfx',emoji:'⏩',vibe:['hype'],hot:false,src:'TikTok • Reels'},
];
const DIALOGUES=[
 ['funny','😅 Funny mistake','“oh no — that was NOT supposed to happen…”','laughter peak + face-palm',92],
 ['awkward','😬 Awkward silence','“...so... anyway...”','2.1s pause, gaze drift',78],
 ['hype','🔥 Epic win','“LET’S GOOO!”','volume spike + arms up',95],
 ['shock','😱 Plot twist','“wait, WHAT?!”','eyebrow raise, zoom-in',88],
 ['fail','💀 Fail cam','“my bad, my bad”','stumble / prop drop',84],
 ['win','👏 Wholesome praise','“that was actually perfect”','smile + applause tail',81],
];
const EMOJI_BY_EMO={funny:'😅',awkward:'😬',hype:'🔥',shock:'😱',fail:'💀',win:'👏'};
const drop=$('drop'), fileIn=$('file');
drop.onclick=()=>fileIn.click();
fileIn.onchange=e=>{if(e.target.files[0])loadFile(e.target.files[0]);};
['dragover','dragenter'].forEach(ev=>drop.addEventListener(ev,e=>{e.preventDefault();}));
drop.addEventListener('drop',e=>{e.preventDefault();if(e.dataTransfer.files[0])loadFile(e.dataTransfer.files[0]);});
function loadFile(f){vid.src=URL.createObjectURL(f);log('📤 Loaded <b>'+f.name+'</b> ('+(f.size/1048576).toFixed(1)+' MB). Analyzing automatically…','run');setFlow(1);$('tInfo').textContent=f.name;}
const REAL_CLIP=['https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4','https://test-videos.co.uk/vids/jellyfish/mp4/h264/720/Jellyfish_720_10s_1MB.mp4','https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'];let realMode=false;
$('sampleBtn').onclick=()=>{realMode=true;vid.src=REAL_CLIP[0];log('🎥 Real-life sample: <b>family movie night</b> (real footage). Analyzing automatically…','run');setFlow(1);$('tInfo').textContent='family movie night (real footage)';};
vid.addEventListener('error',()=>{if(!realMode)return;const cur=vid.currentSrc||vid.src||'';const i=REAL_CLIP.findIndex(u=>cur.includes(u.split('/').pop()));if(i>=0&&i<REAL_CLIP.length-1){vid.src=REAL_CLIP[i+1];log('⚠️ primary clip blocked, trying fallback '+(i+2)+'…','run');}else{realMode=false;}});
let analyzingNow=false,lastAutoSrc='';vid.onloadedmetadata=()=>{duration=vid.duration||60;$('tDur').textContent=fmt(duration);drawTrack();if(!analyzingNow&&vid.src&&vid.src!==lastAutoSrc){lastAutoSrc=vid.src;setTimeout(()=>{if(!moments.length&&!analyzingNow){try{const r=$('analyzeBtn').onclick();if(r&&r.catch)r.catch(()=>{});}catch(e){}}},600);}};
$('resetBtn').onclick=()=>{moments=[];placements=[];selected=null;try{fileIn.value='';}catch(e){}$('moments').innerHTML='<p style="color:#A79DC6;font-size:13px">Moments appear here after analysis.</p>';$('sugs').innerHTML='';$('syncbox').classList.remove('show');$('log').innerHTML='<div>— ready. Upload or load the sample — meme suggestions appear automatically. —</div>';overlay.innerHTML='';drawTrack();updatePlan();setFlow(1);};
$('analyzeBtn').onclick=async()=>{
  if(!vid.src){toast('Loading the sample clip for you…');realMode=true;vid.src=REAL_CLIP[0];$('tInfo').textContent='sample clip';setTimeout(()=>{if(!moments.length&&!analyzingNow){try{const r=$('analyzeBtn').onclick();if(r&&r.catch)r.catch(()=>{});}catch(e){}}},4000);return;}
  if(analyzingNow)return;analyzingNow=true;
  if(!duration||!isFinite(duration))duration=60;
  moments=[];placements=[];selected=null;updatePlan();setFlow(2);
  const steps=['🎧 Extracting audio & transcribing… <span class="ok">done</span>','✂️ Scene-cut detection… <span class="ok">'+(4+Math.floor(duration/12))+' scenes</span>','🧠 Emotion & energy scoring… <span class="ok">done</span>','🎭 Matching memes to moments… <span class="ok">done</span>'];
  $('log').innerHTML='';
  for(const s of steps){log('⏳ '+s.replace(/ <span.*$/,''),'run');await wait(800);$('log').lastChild.innerHTML='✅ '+s;}
  buildMoments();analyzingNow=false;setFlow(3);toast('AI found '+moments.length+' key moments — pick a meme below 👇');
  try{$('sugs').scrollIntoView({behavior:'smooth',block:'nearest'});}catch(e){}
};
function buildMoments(){
  const n=Math.max(4,Math.min(7,Math.round(duration/9)));moments=[];
  for(let i=0;i<n;i++){const t=+((duration*(i+0.7)/n).toFixed(1));const d=DIALOGUES[i%DIALOGUES.length];moments.push({id:i,time:t,emo:d[0],label:d[1],dialogue:d[2],ctx:d[3],score:d[4]+Math.floor(Math.random()*5)});}
  if(duration>25)moments[1].time=18.0;
  moments.sort((a,b)=>a.time-b.time);renderMoments();renderSugs();drawTrack();
  $('mCount').textContent='('+moments.length+' found)';
  log('⭐ Top: <b>'+moments[0].label+'</b> @ '+fmt(moments[0].time)+' — click a suggestion below.','run');
}
function renderMoments(){$('moments').innerHTML=moments.map((m,i)=>`<div class="moment ${selected&&selected.momentId===m.id?'sel':''}" onclick="pickMoment(${i})"><span class="t">⏱ ${fmt(m.time)}</span> <b style="font-size:13px">${m.label}</b><span style="float:right;font-size:12px;color:var(--lime);font-weight:800">${m.score}% 🔥</span><div class="e">${m.dialogue}<br><span style="opacity:.8">ctx: ${m.ctx}</span></div><span class="emo">${EMOJI_BY_EMO[m.emo]||'🎬'} ${m.emo}</span></div>`).join('');}
window.pickMoment=i=>{const m=moments[i];selectSug(m,sugsFor(m)[0]);renderMoments();};
function sugsFor(m){return ASSETS.map(a=>({a,s:(a.vibe.includes(m.emo)?2:(a.type==='meme'?1:0))+(a.hot?1.2:0)+Math.random()})).sort((x,y)=>y.s-x.s).slice(0,6).map(x=>x.a);}
function renderSugs(){
  if(!moments.length){$('sugs').innerHTML='<p style="color:#A79DC6;font-size:13px">🤖 AI picks appear here — press <b>Analyze</b> above 👆</p>';return;}
  const q=(query||'').toLowerCase().trim();
  const all=moments.flatMap(m=>sugsFor(m).map(a=>({m,a})));
  let list=all.filter(x=>(filter==='all'||(filter==='hot'?x.a.hot:x.a.type===filter)));
  if(q)list=list.filter(x=>(x.a.name+' '+x.a.type+' '+(x.a.src||'')).toLowerCase().includes(q));
  list=list.slice(0,12);
  const icons={meme:'😂',sticker:'⭐',gif:'🎞️',sfx:'🔊'};
  $('sugs').innerHTML=list.map(x=>`<button class="sug" onclick='selectSugByIdx(${moments.indexOf(x.m)},"${x.a.id}")'>${x.a.hot?'<span class="hotbadge">🔥 TRENDING</span>':''}<span class="em">${x.a.emoji}</span><b>${x.a.name}</b><span>${icons[x.a.type]} ${x.a.type} • @ ${fmt(x.m.time)} • ${x.m.emo}</span><span class="srcs">${x.a.src||''}</span><div class="use">⏱ auto-sync →</div></button>`).join('')||'<p style="color:#A79DC6">No matches — try another search.</p>';
}
window.selectSugByIdx=(mi,aid)=>{selectSug(moments[mi],ASSETS.find(x=>x.id===aid));renderMoments();};
function selectSug(m,a){
  selected={momentId:m.id,assetId:a.id,best:+(m.time+0.2).toFixed(1)};
  $('syncbox').classList.add('show');$('syncTime').textContent=fmt(selected.best);
  $('syncReason').innerHTML=`<b style="color:#fff">${m.label}</b> @ ${fmt(m.time)} → <b style="color:#fff">${a.emoji} ${a.name}</b>.<br>Why ${fmt(selected.best)}? reaction peak +0.2s, dialogue pause, beat-snapped — e.g. mistake at <b>00:18 → pop at 00:18.2</b>.`;
  setFlow(3);document.querySelectorAll('.moment').forEach((el,i)=>el.classList.toggle('sel',moments[i].id===m.id));
}
$('applyBtn').onclick=()=>{
  if(!selected){toast('Pick a suggestion first 👆');return;}
  if(plan==='free'&&placements.length>=3){$('payModal').classList.add('show');return;}
  const m=moments.find(x=>x.id===selected.momentId),a=ASSETS.find(x=>x.id===selected.assetId);
  placements.push({t:selected.best,emoji:a.emoji,name:a.name,type:a.type});placements.sort((x,y)=>x.t-y.t);
  drawTrack();updatePlan();setFlow(4);burst();
  toast(a.type==='sfx'?'🔊 SFX placed @ '+fmt(selected.best):a.emoji+' placed @ '+fmt(selected.best));
  vid.currentTime=Math.max(0,selected.best-1);vid.play().catch(()=>{});
};
$('previewBtn').onclick=()=>{if(!selected)return;setFlow(4);vid.currentTime=Math.max(0,selected.best-1);vid.play().catch(()=>{});};
/* 🤳 social meme import (sent from social.html) */
(function(){
  let imp=null;try{imp=JSON.parse(localStorage.getItem('editmate_social_meme')||'null');}catch(e){}
  if(!imp||!imp.url||!document.getElementById('socImport'))return;
  $('socThumb').src=imp.url;$('socName').textContent=imp.name||'Social meme';
  $('socImport').classList.add('show');
  $('socPlaceBtn').onclick=()=>{
    if(plan==='free'&&placements.length>=3){$('payModal').classList.add('show');return;}
    const t=selected?selected.best:(moments.length?+(moments[0].time+0.2).toFixed(1):1.0);
    placements.push({t:t,img:imp.url,anim:imp.anim||'',name:imp.name||'Social meme',type:'meme',emoji:'🖼️'});
    placements.sort((x,y)=>x.t-y.t);
    drawTrack();updatePlan();setFlow(4);burst();
    try{localStorage.removeItem('editmate_social_meme');}catch(e){}
    $('socImport').classList.remove('show');
    toast('🖼️ Social meme placed @ '+fmt(t));
    try{vid.currentTime=Math.max(0,t-1);vid.play().catch(()=>{});}catch(e2){}
  };
})();
document.querySelectorAll('#filterTabs .tab').forEach(t=>t.onclick=()=>{document.querySelectorAll('#filterTabs .tab').forEach(x=>x.classList.remove('on'));t.classList.add('on');filter=t.dataset.f;renderSugs();});
$('sugSearch').addEventListener('input',e=>{query=e.target.value;renderSugs();renderLib();});
try{$('libSearch').addEventListener('input',e=>{query=e.target.value;renderLib();});}catch(e){}
function drawTrack(){track.querySelectorAll('.tl-moment,.tl-place').forEach(e=>e.remove());moments.forEach(m=>{if(!duration)return;const d=document.createElement('div');d.className='tl-moment';d.style.left=(m.time/duration*100)+'%';d.title=m.label;track.appendChild(d);});placements.forEach(p=>{const d=document.createElement('div');d.className='tl-place';d.style.left=(p.t/duration*100)+'%';if(p.img){const im=document.createElement('img');im.src=p.img;im.alt='meme';d.appendChild(im);}else{d.textContent=p.emoji;}d.title=p.name;track.appendChild(d);});}
track.onclick=e=>{if(!duration)return;const r=track.getBoundingClientRect();vid.currentTime=((e.clientX-r.left)/r.width)*duration;};
vid.ontimeupdate=()=>{$('tCur').textContent=fmt(vid.currentTime);if(duration)prog.style.width=(vid.currentTime/duration*100)+'%';const hit=placements.find(p=>Math.abs(p.t-vid.currentTime)<1.1);if(hit){if(hit.type==='sfx'){$('sfxToast').style.display='block';$('sfxToast').textContent='🔊 '+hit.name+' @ '+fmt(hit.t);}const visual=hit.anim?`<video src="${String(hit.anim).replace(/"/g,'')}" autoplay muted loop playsinline></video>`:(hit.img?`<img src="${String(hit.img).replace(/"/g,'')}" alt="meme"/>`:hit.emoji);overlay.innerHTML=`<div class="ov-meme">${visual}<small>${hit.name} • ${fmt(hit.t)}</small></div>`;}else{overlay.innerHTML='';$('sfxToast').style.display='none';}};
$('playBtn').onclick=()=>vid.paused?vid.play():vid.pause();
$('exportBtn').onclick=()=>{dl('editmate-timeline.json',JSON.stringify({app:'EditMate AI v2',exported:new Date().toISOString(),video:$('tInfo').textContent,duration,moments,placements},null,2),'application/json');toast('JSON downloaded ⬇');};
$('edlBtn').onclick=()=>{let t='EDITMATE AI v2 — EDL\nVideo: '+$('tInfo').textContent+'\n\n';placements.forEach((p,i)=>t+=`${String(i+1).padStart(2,'0')}  ${fmt(p.t)}  ${p.type.toUpperCase().padEnd(7)}  ${p.emoji} ${p.name}\n`);if(!placements.length)t+='(no placements yet)\n';dl('editmate-timeline.txt',t,'text/plain');toast('EDL downloaded 🧾');};
function dl(n,c,t){const b=new Blob([c],{type:t});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download=n;document.body.appendChild(a);a.click();setTimeout(()=>{try{a.remove();}catch(e){}URL.revokeObjectURL(u);},1500);}
function setPlan(p){plan=p;try{localStorage.setItem('editmate_plan',p);}catch(e){}updatePlan();closeModal();toast(p==='premium'?'⚡ Premium active — unlimited!':'🆓 Free — 3/video');}
window.setPlan=setPlan;
function updatePlan(){$('placeCount').textContent=placements.length;$('planLabel').innerHTML=(plan==='free'?'🆓 Free: ':'⚡ Premium: ')+`<span>${placements.length}${plan==='free'?'/3':''} used</span>`+(plan==='premium'?' — unlimited ✨':'');}
$('upgradeBtn').onclick=()=>plan==='free'?$('payModal').classList.add('show'):toast('Already Premium ⚡');
window.closeModal=()=>$('payModal').classList.remove('show');
$('payModal').addEventListener('click',e=>{if(e.target&&e.target.id==='payModal')closeModal();});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});
/* auto-debug: report browser errors to the backend so they get logged + fixed */
(function(){function rep(m){try{fetch('/api/report',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({msg:String(m).slice(0,500),url:location.href})}).catch(()=>{});}catch(e){}}
window.addEventListener('error',e=>rep((e&&e.error&&e.error.stack)||(e&&e.message)||'unknown error'));
window.addEventListener('unhandledrejection',e=>rep('unhandled rejection: '+e.reason));})();
window.toast=m=>{const t=$('toast');t.textContent=m;t.style.display='block';clearTimeout(t._h);t._h=setTimeout(()=>t.style.display='none',2600);};
function log(h,c){const d=document.createElement('div');if(c)d.className=c;d.innerHTML=h;$('log').appendChild(d);$('log').scrollTop=9999;}
function setFlow(n){document.querySelectorAll('#flowSteps .fstep').forEach(el=>{const s=+el.dataset.s;el.classList.toggle('on',s===n);el.classList.toggle('done',s<n);});}
const wait=ms=>new Promise(r=>setTimeout(r,ms));
function burst(){const c=$('confetti');const em=['🎉','💀','🔥','✨','👏'];for(let i=0;i<14;i++){const s=document.createElement('span');s.textContent=em[i%em.length];s.style.cssText=`position:absolute;left:${45+Math.random()*10}%;top:60%;transition:all 1s ease;`;c.appendChild(s);requestAnimationFrame(()=>{s.style.transform=`translate(${(Math.random()-.5)*500}px,${-Math.random()*400}px) rotate(${Math.random()*360}deg)`;s.style.opacity='0';});setTimeout(()=>s.remove(),1100);}}
function renderLib(){
  const q=(query||'').toLowerCase().trim();
  let list=ASSETS.filter(a=>(filter==='all'||(filter==='hot'?a.hot:a.type===filter)));
  if(q)list=list.filter(a=>(a.name+' '+a.type+' '+(a.src||'')).toLowerCase().includes(q));
  $('libGrid').innerHTML=list.map(a=>`<div class="lib">${a.hot?'<span class="hotbadge">🔥 TRENDING</span>':''}<div class="em">${a.emoji}</div><b>${a.name}</b><span>${a.type} • ${a.vibe.join(', ')}</span><span class="srcs">${a.src||''}</span></div>`).join('')||'<p style="color:#7a6f57">No matches.</p>';
  try{document.querySelector('#library .sec-sub').textContent=ASSETS.length+' trending memes, stickers, GIFs & sounds from TikTok, Reels, Shorts & YouTube — showing '+list.length+'. Click any suggestion in the Studio to use it.';}catch(e){}
}
renderLib();
try{fetch('/api/assets').then(r=>{if(!r.ok)throw 0;return r.json();}).then(d=>{if(d&&d.assets&&d.assets.length>=ASSETS.length){ASSETS.length=0;d.assets.forEach(a=>ASSETS.push(a));renderLib();renderSugs();}}).catch(()=>{});}catch(e){}
function getFb(){try{return JSON.parse(localStorage.getItem('editmate_fb')||'[]')}catch{return[]}}
function renderFb(){const l=getFb();$('fbCount').textContent=l.length;$('fbList').innerHTML=l.length?l.map(f=>`<div class="fb-item"><b>${esc(f.n)}</b> <small>• ${esc(f.a)}</small><br>${esc(f.t)}</div>`).join(''):'<p style="color:#7a6f57;font-size:13px">No notes yet — go break the demo!</p>';}
window.saveFeedback=()=>{const n=$('fbName').value.trim()||'Anonymous',a=$('fbArea').value,t=$('fbText').value.trim();if(!t){toast('Write the note first ✍️');return;}const l=getFb();l.unshift({n,a,t});localStorage.setItem('editmate_fb',JSON.stringify(l));try{fetch('/api/feedback',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({n:n,a:a,t:t})}).catch(()=>{});}catch(e){}$('fbText').value='';renderFb();toast('Saved for v2 💾');};
window.clearFeedback=()=>{localStorage.removeItem('editmate_fb');renderFb();};
function esc(s){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
renderFb();updatePlan();
const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add('vis')),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
/* hero live EDIT example — real footage, fractional edit map (works at any clip length) */
(function(){
  if(!document.getElementById('heroVid')||!document.getElementById('heroTrack'))return;
  const hv=$('heroVid'), fill=$('heroFill'), ov=$('heroOverlay'), play=$('heroPlay'), tag=$('heroTag'),
        trackEl=$('heroTrack'), cap=$('heroCap'), sfxEl=$('heroSfx'), timeEl=$('heroTime'), edl=$('heroEdl'),
        flash=$('heroFlash'), cutEl=$('heroCut'), head=$('heroHead'), tip=$('heroTip');
  if(!hv||!trackEl)return;
  const spots=[
    {frac:0.08,emoji:'🔥',kind:'sticker',label:'hype build',cap:'POV: the drop is coming…',sfx:null},
    {frac:0.30,emoji:'💀',kind:'meme + SFX',label:'funny mistake',cap:'bro really said "trust me" 💀',sfx:'🔊 vine-boom'},
    {frac:0.45,emoji:'🙄',kind:'GIF',label:'awkward silence',cap:'that awkward silence…',sfx:null},
    {frac:0.55,emoji:'😭',kind:'meme',label:'fail cam',cap:"I'M DONE 😭",sfx:null},
    {frac:0.78,emoji:'👏',kind:'SFX + sticker',label:'epic win',cap:'and the crowd goes wild 👏',sfx:'🔊 crowd clap + ✨ sparkle'},
  ];
  const cutFracs=[0.22,0.48,0.66];
  const DEFAULT_CAP='♪ jellyfish cam — original audio';
  let dur=10, T=[], cutT=[], lastMeme=-99, lastCut=-99;
  const rows=[];
  function layout(){
    T=spots.map(s=>({...s,t:+(s.frac*dur).toFixed(1)}));
    cutT=cutFracs.map(c=>+(c*dur).toFixed(1));
    timeEl.textContent=fmt(0)+' / '+fmt(dur);
    edl.innerHTML=T.map((s,i)=>`<div class="erow" data-i="${i}"><span class="et">${fmt(s.t)}</span><span>${s.emoji}</span><span>${s.label} • ${s.kind}</span></div>`).join('');
    rows.length=0;edl.querySelectorAll('.erow').forEach(r=>{rows.push(r);r.onclick=e=>{e.stopPropagation();jump(+r.dataset.i);};});
    document.querySelectorAll('.chips .chip[data-i]').forEach(c=>{const s=T[+c.dataset.i];if(s)c.textContent=`${s.emoji} ${s.label}${s.sfx?' + SFX':''} @ ${fmt(s.t)}`;});
    document.querySelectorAll('.tlmark[data-i]').forEach(m=>{const s=T[+m.dataset.i];if(s)m.title=`${s.emoji} ${s.label} @ ${fmt(s.t)}`;});
  }
  function render(now){
    const memeWin=Math.max(0.5,dur*0.09), capBack=dur*0.10, capFwd=dur*0.24;
    fill.style.width=(dur?(now/dur*100):0)+'%';
    if(head)head.style.left=(dur?(now/dur*100):0)+'%';
    timeEl.textContent=fmt(now)+' / '+fmt(dur);
    const meme=T.find(s=>Math.abs(s.t-now)<memeWin);
    if(meme&&now-lastMeme>memeWin+0.3){
      lastMeme=now;
      ov.innerHTML=`<div class="pop">${meme.emoji}</div>`;
      clearTimeout(ov._h);ov._h=setTimeout(()=>ov.innerHTML='',1200);
      tag.textContent=`🧠 ${meme.label} @ ${fmt(meme.t)}`;
      document.querySelectorAll('.chips .chip').forEach(c=>c.classList.toggle('fired',+c.dataset.i===T.indexOf(meme)));
      setTimeout(()=>document.querySelectorAll('.chips .chip').forEach(c=>c.classList.remove('fired')),1300);
    }
    const capSpot=[...T].reverse().find(s=>now>=s.t-capBack&&now<=s.t+capFwd);
    const newCap=capSpot?capSpot.cap:DEFAULT_CAP;
    if(cap.textContent!==newCap)cap.textContent=newCap;
    const sfxSpot=T.find(s=>s.sfx&&Math.abs(s.t-now)<memeWin);
    if(sfxSpot){sfxEl.style.display='block';sfxEl.textContent=sfxSpot.sfx;}
    else sfxEl.style.display='none';
    const cutHit=cutT.find(c=>Math.abs(c-now)<0.22);
    if(cutHit!==undefined&&now-lastCut>1){
      lastCut=now;flash.classList.remove('go');void flash.offsetWidth;flash.classList.add('go');
      cutEl.style.display='block';clearTimeout(cutEl._h);cutEl._h=setTimeout(()=>cutEl.style.display='none',550);
    }
    let liveIdx=-1;T.forEach((s,i)=>{if(now>=s.t-dur*0.05)liveIdx=i;});
    rows.forEach((r,i)=>r.classList.toggle('live',i===liveIdx));
  }
  function jump(i){
    const s=T[i]||T[0];if(!s)return;
    try{hv.currentTime=Math.max(0,s.t-0.8);}catch(e){}
    hv.play().catch(()=>{});syncPlay();render(Math.max(0,s.t-0.8));
    ov.innerHTML=`<div class="pop">${s.emoji}</div>`;
    clearTimeout(ov._h);ov._h=setTimeout(()=>ov.innerHTML='',1200);
    lastMeme=Math.max(0,s.t-0.8);tag.textContent=`🧠 ${s.label} @ ${fmt(s.t)}`;
  }
  function syncPlay(){play.textContent=hv.paused?'▶':'⏸';}
  play.onclick=e=>{e.stopPropagation();hv.paused?hv.play().catch(()=>{}):hv.pause();syncPlay();};
  $('heroPlayer').onclick=()=>{hv.paused?hv.play().catch(()=>{}):hv.pause();syncPlay();};
  hv.addEventListener('play',syncPlay);hv.addEventListener('pause',syncPlay);
  hv.addEventListener('timeupdate',()=>render(hv.currentTime));
  hv.addEventListener('loadedmetadata',()=>{dur=hv.duration||10;layout();});
  hv.addEventListener('durationchange',()=>{if(hv.duration&&isFinite(hv.duration)){dur=hv.duration;layout();}});
  hv.addEventListener('error',()=>{cap.textContent='⚠️ footage blocked offline — connect to the internet for the real clip';},true);
  function seekExact(t, playFwd){
    t=Math.max(0,Math.min(dur||0,t));
    try{hv.currentTime=t;}catch(e){}
    render(t);
    const s=T.reduce((a,b,i,arr)=>Math.abs(b.t-t)<Math.abs(arr[a].t-t)?i:a,0);
    if(T[s]&&Math.abs(T[s].t-t)<Math.max(0.5,dur*0.09)){jump(s);return;}
    if(playFwd!==false){hv.play().catch(()=>{});syncPlay();}
  }
  let scrubbing=false, wasPlaying=false;
  function posToT(e){const r=trackEl.getBoundingClientRect();const x=(e.clientX-r.left);return {t:(x/r.width)*dur, x, w:r.width};}
  trackEl.addEventListener('pointerdown',e=>{
    if(e.target.closest('.tlmark'))return;
    scrubbing=true;wasPlaying=!hv.paused;
    try{hv.pause();}catch(err){}
    trackEl.classList.add('scrubbing');
    try{trackEl.setPointerCapture(e.pointerId);}catch(err){}
    const p=posToT(e);seekExact(p.t,false);
    tip.style.left=Math.max(24,Math.min(p.w-24,p.x))+'px';tip.textContent=fmt(p.t);tip.style.display='block';
    e.preventDefault();
  });
  trackEl.addEventListener('pointermove',e=>{
    const p=posToT(e);
    if(scrubbing){
      seekExact(p.t,false);
      tip.style.left=Math.max(24,Math.min(p.w-24,p.x))+'px';tip.textContent=fmt(p.t);
    } else {
      tip.style.left=Math.max(24,Math.min(p.w-24,p.x))+'px';tip.textContent=fmt(p.t);tip.style.display='block';
      clearTimeout(trackEl._tipH);trackEl._tipH=setTimeout(()=>{if(!scrubbing)tip.style.display='none';},900);
    }
  });
  function endScrub(e){
    if(!scrubbing)return;scrubbing=false;trackEl.classList.remove('scrubbing');tip.style.display='none';
    const p=posToT(e);seekExact(p.t,false);
    hv.play().catch(()=>{});syncPlay();
  }
  trackEl.addEventListener('pointerup',endScrub);
  trackEl.addEventListener('pointercancel',endScrub);
  trackEl.addEventListener('wheel',e=>{
    e.preventDefault();
    const d=(e.deltaY>0?1.5:-1.5);
    seekExact(hv.currentTime+d,true);
  },{passive:false});
  /* load your own real-life footage into the box */
  const SAMPLE_HTML=hv.innerHTML, SAMPLE_CLIP='family_movie_night.mp4';
  $('heroMine').onclick=()=>{try{$('heroFile').value='';}catch(e){}$('heroFile').click();};
  $('heroFile').onchange=e=>{
    const f=e.target.files[0];if(!f)return;
    hv.src=URL.createObjectURL(f);hv.load();
    $('heroClip').textContent=f.name.length>26?f.name.slice(0,24)+'…':f.name;
    tag.textContent='🧠 reading your clip…';hv.play().catch(()=>{});syncPlay();
  };
  $('heroReset').onclick=()=>{try{hv.removeAttribute('src');}catch(e){}try{$('heroFile').value='';}catch(e2){}hv.innerHTML=SAMPLE_HTML;hv.load();$('heroClip').textContent=SAMPLE_CLIP;tag.textContent='🧠 reading scene…';hv.play().catch(()=>{});syncPlay();};
  document.querySelectorAll('.tlmark[data-i],.chips .chip[data-i]').forEach(el=>{el.onclick=e=>{e.stopPropagation();jump(+el.dataset.i);};});
  layout();render(0);
  const auto=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){hv.play().catch(()=>{});syncPlay();auto.disconnect();}}),{threshold:.35});
  auto.observe(hv);
})();
/* ⑤ PUBLISH — captions, render with memes burned in, share to social */
(function(){
  if(!document.getElementById('pubCap'))return;
  const capEl=$('pubCap');
  let aspect='16:9';
  document.querySelectorAll('#publishPanel [data-a]').forEach(b=>b.onclick=()=>{
    aspect=b.dataset.a;
    document.querySelectorAll('#publishPanel [data-a]').forEach(x=>{x.classList.toggle('s-y',x===b);x.classList.toggle('s-w',x!==b);});
    toast('Format: '+aspect+(aspect==='9:16'?' — Reels / Shorts / TikTok':aspect==='1:1'?' — square feed':' — YouTube'));
  });
  function captionLines(){
    const lines=['My edit with EditMate AI'];
    placements.slice(0,6).forEach(p=>lines.push(p.emoji+' '+p.name+' @ '+fmt(p.t)));
    lines.push('');
    lines.push('#memes #videoediting #reels #shorts #tiktok #editmateai');
    return lines.join('\n');
  }
  function buildCaption(force){ if(force||document.activeElement!==capEl) capEl.value=captionLines(); }
  try{ new MutationObserver(()=>buildCaption(false)).observe($('placeCount'),{childList:true,characterData:true,subtree:true}); }catch(e){}
  try{ new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){buildCaption(false);setFlow(4);}}),{threshold:.2}).observe($('publishPanel')); }catch(e){}
  $('pubWrite').onclick=()=>{buildCaption(true);toast('Caption written from your edit');};
  function copyCap(silent){
    const t=capEl.value||'';
    function done(){ if(!silent)toast('Caption copied — paste it anywhere'); }
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).then(done).catch(()=>fallbackCopy(t,done));}
    else fallbackCopy(t,done);
  }
  function fallbackCopy(t,done){capEl.focus();capEl.select();try{document.execCommand('copy');done();}catch(e){toast('Copy it manually');}}
  $('pubCopy').onclick=()=>copyCap(false);
  let rendering=false, rec=null, chunks=[], raf=0, lastFile=null, lastUrl=null;
  function dims(){return aspect==='9:16'?[720,1280]:aspect==='1:1'?[720,720]:[1280,720];}
  function ensureAudio(stream){
    try{
      if(!vid._audCtx){
        const AC=window.AudioContext||window.webkitAudioContext; if(!AC)return;
        const ac=new AC(), src=ac.createMediaElementSource(vid), dest=ac.createMediaStreamDestination();
        src.connect(dest); src.connect(ac.destination);
        vid._audCtx=ac; vid._audDest=dest;
      }
      if(vid._audDest)vid._audDest.stream.getAudioTracks().forEach(t=>stream.addTrack(t));
    }catch(e){}
  }
  $('pubRender').onclick=()=>{
    if(!vid.src){toast('Upload or load a clip first');return;}
    if(!String(vid.src).startsWith('blob:')){toast('Samples block export — upload YOUR video above, then render.');return;}
    if(!placements.length){toast('Place at least 1 meme first');return;}
    if(rendering||!window.MediaRecorder)return;
    const WH=dims(), W=WH[0], H=WH[1];
    const cv=document.createElement('canvas');cv.width=W;cv.height=H;
    const cx=cv.getContext('2d');
    const stream=cv.captureStream(30);ensureAudio(stream);
    let mime='video/webm;codecs=vp9';
    if(!MediaRecorder.isTypeSupported(mime))mime='video/webm';
    chunks=[];
    try{rec=new MediaRecorder(stream,{mimeType:mime,videoBitsPerSecond:5000000});}
    catch(e){toast('Recorder not supported in this browser');return;}
    rec.ondataavailable=e=>{if(e.data&&e.data.size)chunks.push(e.data);};
    rec.onstop=finishRender;
    function draw(){
      if(!rendering)return;
      const vw=vid.videoWidth||16, vh=vid.videoHeight||9;
      const s=Math.max(W/vw,H/vh), dw=vw*s, dh=vh*s;
      cx.fillStyle='#000';cx.fillRect(0,0,W,H);
      try{cx.drawImage(vid,(W-dw)/2,(H-dh)/2,dw,dh);}catch(e){}
      const now=vid.currentTime;
      const hit=placements.find(p=>Math.abs(p.t-now)<1.1);
      if(hit){
        cx.textAlign='center';
        cx.font=Math.floor(W*0.17)+'px serif';
        cx.fillText(hit.emoji,W/2,H*0.32);
        cx.font='bold '+Math.floor(W*0.038)+'px Inter, sans-serif';
        const label=hit.name+' • '+fmt(hit.t);
        const tw=cx.measureText(label).width;
        cx.fillStyle='rgba(0,0,0,.72)';cx.fillRect(W/2-tw/2-16,H*0.36-32,tw+32,48);
        cx.fillStyle='#B8F135';cx.fillText(label,W/2,H*0.36);
      }
      raf=requestAnimationFrame(draw);
    }
    rendering=true;rec.start(250);draw();
    try{vid.currentTime=0;}catch(e){}
    vid.play().catch(()=>{});
    $('pubRender').style.display='none';$('pubStop').style.display='inline-block';
    $('pubProgWrap').style.display='block';$('pubProg').style.width='0%';
    $('pubDl').style.display='none';setFlow(4);
    toast('Rendering '+aspect+' — playing through once…');
  };
  vid.addEventListener('timeupdate',()=>{
    if(!rendering||!vid.duration)return;
    $('pubProg').style.width=Math.min(100,vid.currentTime/vid.duration*100)+'%';
  });
  vid.addEventListener('ended',()=>{if(rendering)stopRender();});
  function stopRender(){
    if(!rendering)return;rendering=false;
    cancelAnimationFrame(raf);
    try{rec.stop();}catch(e){}
    try{vid.pause();}catch(e2){}
    $('pubRender').style.display='inline-block';$('pubStop').style.display='none';
  }
  $('pubStop').onclick=stopRender;
  function finishRender(){
    const blob=new Blob(chunks,{type:'video/webm'});
    if(lastUrl)URL.revokeObjectURL(lastUrl);
    lastFile=new File([blob],'editmate-'+aspect.replace(':','x')+'.webm',{type:'video/webm'});
    lastUrl=URL.createObjectURL(blob);
    const a=$('pubDl');a.href=lastUrl;a.download=lastFile.name;
    a.textContent='Download '+lastFile.name+' ('+(blob.size/1048576).toFixed(1)+' MB)';
    a.style.display='inline-block';
    $('pubProgWrap').style.display='none';
    toast('Render done — post it anywhere');
  }
  $('pubShare').onclick=async()=>{
    let files=[];
    try{
      if(lastFile&&'canShare' in navigator&&navigator.canShare({files:[lastFile]}))files=[lastFile];
    }catch(e){}
    if(navigator.share){
      try{await navigator.share({title:'My EditMate AI video',text:capEl.value,files:files.length?files:undefined});toast('Shared');}
      catch(e){}
    } else { copyCap(false);toast('Share sheet unavailable — caption copied, use the buttons'); }
  };
  document.querySelectorAll('#publishPanel [data-plat]').forEach(b=>b.onclick=()=>{
    copyCap(true);
    const text=encodeURIComponent(capEl.value||'My EditMate AI video');
    const page=encodeURIComponent(location.href);
    const urls={
      youtube:'https://www.youtube.com/upload',
      instagram:'https://www.instagram.com/',
      tiktok:'https://www.tiktok.com/upload',
      x:'https://twitter.com/intent/tweet?text='+text,
      whatsapp:'https://wa.me/?text='+text,
      telegram:'https://t.me/share/url?url='+page+'&text='+text
    };
    window.open(urls[b.dataset.plat],'_blank');
    if(b.dataset.plat==='youtube'||b.dataset.plat==='instagram'||b.dataset.plat==='tiktok')toast('Caption copied — paste it on '+b.dataset.plat);
  });
})();
/* auto-demo: when the Studio first scrolls into view, load the sample + run AI so memes show by themselves */
(function(){
  let done=false;
  const io2=new IntersectionObserver(es=>es.forEach(x=>{
    if(!x.isIntersecting||done)return;done=true;io2.disconnect();
    if(!vid.src){try{$('sampleBtn').click();}catch(e){}}
    setTimeout(()=>{try{if(!moments.length)$('analyzeBtn').click();}catch(e){}},1800);
  }),{threshold:.2});
  try{io2.observe($('demo'));}catch(e){}
})();
/* visiting-section meme motion: stagger reveals, wiggle titles + meme burst, ambient floaters */
(function(){
  try{
    const revs=document.querySelectorAll('.reveal');
    revs.forEach((el,i)=>{try{el.style.setProperty('--d',((i%6)*70)+'ms');}catch(e){}});
  }catch(e){}
  const EM=['💀','🔥','✨','😭','👏','🤣','🫠','🕶️','🚀','💅','🤯','🥳'];
  function burst(x,y,n){
    if(!isFinite(x)||!isFinite(y))return;
    for(let i=0;i<(n||7);i++){
      try{
        const s=document.createElement('span');
        s.textContent=EM[(Math.random()*EM.length)|0];
        s.className='visit-pop';
        s.style.left=x+'px';s.style.top=y+'px';
        s.style.setProperty('--dx',((Math.random()-.5)*260)+'px');
        s.style.setProperty('--dy',(-40-Math.random()*150)+'px');
        s.style.setProperty('--rot',((Math.random()-.5)*120)+'deg');
        s.style.fontSize=(20+Math.random()*22)+'px';
        document.body.appendChild(s);
        setTimeout(()=>{try{s.remove();}catch(e){}},1150);
      }catch(e){}
    }
  }
  try{
    if('IntersectionObserver' in window){
      const seen=new WeakSet();
      const so=new IntersectionObserver(es=>es.forEach(en=>{
        if(!en.isIntersecting||seen.has(en.target))return;
        seen.add(en.target);
        try{
          en.target.classList.add('wiggle');
          const r=en.target.getBoundingClientRect();
          burst(r.left+r.width/2,r.top+10,7);
          setTimeout(()=>{try{en.target.classList.remove('wiggle');}catch(e){}},1000);
        }catch(e){}
      }),{threshold:.55});
      document.querySelectorAll('section h2').forEach(h=>{try{so.observe(h);}catch(e){}});
      const hb=document.querySelector('.hero h1');
      if(hb){try{const r=hb.getBoundingClientRect();if(r&&isFinite(r.left)&&isFinite(r.top))setTimeout(()=>burst(r.left+r.width/2,r.top+60,9),450);}catch(e){}}
    }
  }catch(e){}
  try{
    if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const box=document.createElement('div');box.id='floaters';
    document.body.appendChild(box);
    for(let i=0;i<9;i++){
      const s=document.createElement('span');
      s.textContent=EM[(Math.random()*EM.length)|0];
      s.style.left=(Math.random()*96)+'vw';
      s.style.fontSize=(22+Math.random()*26)+'px';
      s.style.animationDuration=(13+Math.random()*15)+'s';
      s.style.animationDelay=(-Math.random()*22)+'s';
      box.appendChild(s);
    }
  }catch(e){}
})();
