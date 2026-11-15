// @ts-nocheck
/* Verbatim port of the source HTML film engine (Qwen_html_20261113_09446k3te.html).
   The code below is copied unchanged; only CAPS, the poster text rows/footer were edited as requested.
   Wrapped in a function so it runs once in the browser after the markup is mounted. */
export function runGumshuda(): void {
"use strict";
/* ============================================================
   GUMSHUDA: AZAADI — a poetic documentary on Liberty
   Old Hindi cinema · six reels · no voices, only sound
   ============================================================ */
const W=960,H=720,DUR=225;
const $=id=>document.getElementById(id);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const lerp=(a,b,t)=>a+(b-a)*t;
const eo=t=>1-Math.pow(1-t,3);
const sr=n=>{const x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x);};
const fmt=t=>{t=Math.max(0,Math.floor(t));return Math.floor(t/60)+":"+String(t%60).padStart(2,"0");};
const DEV=["१","२","३","४","५","६","७"];
const RM=matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------------- settings ---------------- */
const DEF={grain:RM?35:55,flick:RM?12:40,scr:RM?30:50,weave:RM?0:35,tone:65,lang:"both",proj:60,sfx:85,music:55,burns:true,muted:false};
let S={...DEF};
try{const s=localStorage.getItem("gumshuda-booth");if(s)S={...DEF,...JSON.parse(s)};}catch(e){}
if(S.lang!=="off")S.lang="both";
const saveS=()=>{try{localStorage.setItem("gumshuda-booth",JSON.stringify(S));}catch(e){}};

/* ---------------- data ---------------- */
const SCENES=[
 {t0:0,  t1:30, hi:"एलान",           en:"THE ANNOUNCEMENT"},
 {t0:30, t1:60, hi:"अतीत",            en:"THE PAST"},
 {t0:60, t1:95, hi:"अदृश्य ज़ंजीरें",  en:"THE INVISIBLE CHAINS"},
 {t0:95, t1:135,hi:"आज़ादी का अर्थ",   en:"THE MEANING OF LIBERTY"},
 {t0:135,t1:170,hi:"आईना",            en:"THE MIRROR"},
 {t0:170,t1:215,hi:"तलाश जारी",       en:"THE SEARCH CONTINUES"},
 {t0:215,t1:225,hi:"छह आवाज़ें",       en:"SIX VOICES"}
];
const STOCK={
 struggle:["https://assets.mixkit.co/videos/preview/mixkit-people-walking-in-a-crosswalk-4460.mp4","https://videos.pexels.com/video-files/3195394/3195394-hd_1920_1080_25fps.mp4"],
 crowd:["https://assets.mixkit.co/videos/preview/mixkit-crowd-of-people-walking-in-the-street-4326.mp4","https://videos.pexels.com/video-files/1093662/1093662-hd_1920_1080_30fps.mp4"],
 archive:["https://assets.mixkit.co/videos/preview/mixkit-turning-the-pages-of-a-book-41569.mp4","https://videos.pexels.com/video-files/4782135/4782135-hd_1920_1080_25fps.mp4"],
 road:["https://videos.pexels.com/video-files/857195/857195-hd_1920_1080_25fps.mp4","https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529.mp4"]
};
const SHOTS=[
 {t0:0,t1:7,r:"tuning"},{t0:7,t1:14,r:"radio"},{t0:14,t1:21,r:"struggle",tex:.35},{t0:21,t1:27,r:"lastseen"},{t0:27,t1:30,r:"poster"},
 {t0:30,t1:34,r:"lantern"},{t0:34,t1:39,r:"archive",tex:.2},{t0:39,t1:43.5,r:"photos"},{t0:43.5,t1:54,r:"dream"},{t0:54,t1:60,r:"question"},
 {t0:60,t1:73,r:"walls"},{t0:73,t1:79,r:"silence"},{t0:79,t1:85,r:"puppet"},{t0:85,t1:95,r:"chains"},
 {t0:95,t1:102.5,r:"ask"},{t0:102.5,t1:107,r:"faces"},{t0:107,t1:112,r:"unheard"},{t0:112,t1:117,r:"unreach"},{t0:117,t1:122,r:"choice"},{t0:122,t1:128,r:"door"},{t0:128,t1:135,r:"window"},
 {t0:135,t1:141,r:"pause"},{t0:141,t1:148,r:"shelves"},{t0:148,t1:151,r:"calendar"},{t0:151,t1:159,r:"path"},{t0:159,t1:170,r:"hands"},
 {t0:170,t1:178.5,r:"crowd",tex:.35},{t0:178.5,t1:189.5,r:"baaki"},{t0:189.5,t1:194,r:"recap"},{t0:194,t1:202,r:"road",tex:.4},{t0:202,t1:211,r:"flame"},
 {t0:211,t1:215,r:"poster2"},{t0:215,t1:225,r:"fin"}
];
SHOTS.forEach(s=>{if(STOCK[s.r]){s.stock=STOCK[s.r];s.tex=s.tex||.3;}s.v=null;s.vstate=0;s.si=0;});
const sceneAt=t=>{for(let i=SCENES.length-1;i>=0;i--)if(t>=SCENES[i].t0)return i;return 0;};
const shotAt=t=>{for(let i=SHOTS.length-1;i>=0;i--)if(t>=SHOTS[i].t0)return SHOTS[i];return SHOTS[0];};

const CAPS=[
 {t0:6,t1:8,hi:"Yeh ek zaroori elaan hai.",en:""},
 {t0:8.5,t1:10.5,hi:"Ek cheez gumshuda hai.",en:""},
 {t0:11,t1:13.5,m:"stamp",hi:"Naam hai... Azaadi.",en:""},
 {t0:14,t1:16.5,hi:"Kehte hain, ise bahut saalon pehle paaya gaya tha.",en:""},
 {t0:17,t1:20.5,hi:"Iske liye ladaaiyaan ladi gayi, qurbaaniyaan di gayi, aur na jaane kitne sapne dekhe gaye.",en:""},
 {t0:21,t1:23,hi:"Lekin aaj... iska pata kisi ko nahi.",en:""},
 {t0:23.5,t1:26.5,hi:"Aakhri baar ise ek azaad desh mein dekha gaya tha.",en:""},
 {t0:27,t1:29.8,hi:"Agar aapko kahin nazar aaye... toh humein zaroor batayein.",en:""},
 {t0:32,t1:34,hi:"Humne uski talaash shuru ki.",en:""},
 {t0:34.5,t1:38.5,hi:"Purani kitaabon mein, itihaas ke pannon mein, un sadkon par jahan kabhi inquilab ke naare goonjte the.",en:""},
 {t0:39,t1:41,hi:"Har tasveer mein ek kahaani thi.",en:""},
 {t0:41,t1:43,hi:"Har kahaani mein ek khwaab tha.",en:""},
 {t0:43.5,t1:46.5,hi:"Ek aise kal ka khwaab, jahan koi kisi se na dare.",en:""},
 {t0:47,t1:50,hi:"Jahan apni baat kehne ke liye ijazat na maangni pade.",en:""},
 {t0:50.5,t1:53.5,hi:"Jahan jeene ke liye kisi aur ki marzi zaroori na ho.",en:""},
 {t0:54,t1:56,hi:"Lekin waqt ke saath ek sawaal reh gaya...",en:""},
 {t0:56.5,t1:59.8,hi:"Kya humne sirf ek desh ko azaad karaya tha, ya insaan ko bhi?",en:""},
 {t0:61,t1:64,hi:"Hum aage badhe... toh kuch deewarein nazar aayi.",en:""},
 {t0:64.5,t1:66.5,hi:"Kuch deewarein patthar ki thi.",en:""},
 {t0:67,t1:69,hi:"Kuch samaaj ne banayi thi.",en:""},
 {t0:69.5,t1:73,hi:"Aur kuch... humne khud apne andar khadi kar li thi.",en:""},
 {t0:73.5,t1:75.5,hi:"Kahin kisi ki awaaz daba di gayi.",en:""},
 {t0:76,t1:78.5,hi:"Kahin kisi ke sapnon ko chhota kar diya gaya.",en:""},
 {t0:79,t1:84.5,hi:"Kahin kisi ko bataya gaya ki use kaise jeena hai, kya banna hai, kisse milna hai, kya kehna hai.",en:""},
 {t0:85,t1:86.5,hi:"Aur hum sochte rahe...",en:""},
 {t0:87,t1:89,hi:"Aakhir azaadi ka matlab kya hai?",en:""},
 {t0:89.5,t1:91.5,hi:"Kya sirf zanjeeron ka na hona azaadi hai?",en:""},
 {t0:92,t1:95,hi:"Ya phir apne khwaabon ko bina dare jee paana bhi zaroori hai?",en:""},
 {t0:96.5,t1:99,hi:"Humne logon se poochna chaha...",en:""},
 {t0:99.5,t1:102,m:"hand",hw:"Kya tum azaad ho?",hi:"",en:""},
 {t0:102.5,t1:106.5,hi:"Lekin jawaab dene se pehle hi kai chehre khamosh ho gaye.",en:""},
 {t0:107,t1:111.5,hi:"Kisi ke paas kehne ko bahut kuch tha, par sunne wala koi nahi.",en:""},
 {t0:112,t1:116.5,hi:"Kisi ke paas sapne the, par unhe poora karne ke mauke nahi.",en:""},
 {t0:117,t1:121.5,hi:"Kisi ke paas apni marzi thi, par faisle karne ka haq nahi.",en:""},
 {t0:122,t1:127.5,hi:"Aur kisi ke paas sab kuch tha... bas khud ko chunne ki himmat nahi.",en:""},
 {t0:128,t1:134,m:"hand",hw:"Shayad azaadi ek aisi cheez hai, jise har insaan mehsoos toh karta hai, par har insaan jee nahi paata.",hi:"",en:""},
 {t0:136,t1:138.5,hi:"Phir ek din hum ruk gaye.",en:""},
 {t0:139,t1:140.5,hi:"Aur socha...",en:""},
 {t0:141,t1:144,hi:"Kya hum azaadi ko galat jagah dhoond rahe the?",en:""},
 {t0:144.5,t1:147.5,hi:"Shayad woh kisi kitaab mein nahi thi.",en:""},
 {t0:148,t1:150.5,hi:"Na kisi tareekh mein, na kisi naare mein.",en:""},
 {t0:151,t1:155,hi:"Shayad woh tab thi, jab koi apni marzi se apna raasta chunta hai.",en:""},
 {t0:155.5,t1:158.5,hi:"Jab koi bina dare apni awaaz uthata hai.",en:""},
 {t0:159,t1:163.5,hi:"Jab koi doosre ko bhi wahi haq deta hai, jo woh khud ke liye chahta hai.",en:""},
 {t0:164,t1:167,hi:"Kyunki azaadi sirf khud ke liye azaad hone ka naam nahi...",en:""},
 {t0:167.5,t1:169.8,hi:"Balki doosron ko bhi azaad rehne dene ka naam hai.",en:""},
 {t0:171,t1:174.5,hi:"Toh shayad Azaadi gumshuda nahi hai.",en:""},
 {t0:175,t1:178,hi:"Shayad woh humare beech hi kahin hai.",en:""},
 {t0:178.5,t1:182,hi:"Har us sawaal mein, jo poochha jaana baaki hai.",en:""},
 {t0:182.5,t1:185.5,hi:"Har us awaaz mein, jo uthna baaki hai.",en:""},
 {t0:186,t1:189,hi:"Har us sapne mein, jo poora hona baaki hai.",en:""},
 {t0:189.5,t1:193.5,hi:"Humne use dhoonda itihaas mein, sadkon par, logon ke beech...",en:""},
 {t0:194,t1:196.5,hi:"Aur aakhir mein samjha...",en:""},
 {t0:197,t1:201.5,hi:"Azaadi koi manzil nahi, jahan pahunch kar safar khatam ho jaaye.",en:""},
 {t0:202,t1:204,hi:"Azaadi ek ehsaas hai.",en:""},
 {t0:204.5,t1:206,hi:"Ek zimmedari hai.",en:""},
 {t0:206.5,t1:211,hi:"Ek aisa haq hai, jise har roz jeena aur har roz bachana padta hai.",en:""},
 {t0:211.5,t1:214.8,hi:"Aur shayad... isi liye uski talaash kabhi khatam nahi hoti.",en:""},
 {t0:215,t1:216.4,m:"fin",hi:"Azaadi sirf ek lafz nahi...",en:""},
 {t0:216.4,t1:217.8,m:"fin",hi:"Yeh ek khwaab hai.",en:""},
 {t0:217.8,t1:219.2,m:"fin",hi:"Ek awaaz hai.",en:""},
 {t0:219.2,t1:220.6,m:"fin",hi:"Ek sawaal hai.",en:""},
 {t0:220.6,t1:222,m:"fin",hi:"Ek haq hai.",en:""},
 {t0:222,t1:223.4,m:"fin",hi:"Aur ek zimmedari bhi.",en:""}
];

/* ---------------- sound cues ---------------- */
const CUES=[];
const cue=(t,f,a)=>CUES.push({t,f,a});
cue(0.1,"staticHi");[0.4,2.2,4,5.8,7.6,9.4].forEach(t=>cue(t,"sweep"));
(()=>{ // morse AZAADI
 const M={A:".-",Z:"--..",D:"-..",I:".."};let t=8.2;const u=.085;
 for(const ch of "AZAADI"){for(const s of M[ch]){cue(t,"morse",s==="."?u:u*3);t+=s==="."?u*2:u*4;}t+=u*3;}
})();
cue(16,"staticLo");cue(16,"click");cue(27.2,"page");cue(27.6,"thud");
cue(31.4,"whistle");cue(30.8,"page");cue(52.5,"whistle");cue(54,"bell");cue(55.4,"birds");cue(56.4,"birds");
[[392,.9,33],[415.3,.9,34.1],[466.16,.9,35.2],[523.25,1.4,36.3],[466.16,.8,38],[415.3,.8,39],[392,1.2,40],[349.23,1.7,41.2]].forEach(n=>cue(n[2],"flute",[n[0],n[1]]));
for(let t=31;t<59;t+=4){cue(t,"dha");cue(t+.75,"tin");cue(t+1.5,"dha");cue(t+2.25,"tin");cue(t+3,"dha");}
[66.3,70.2,84.7,86.1,88.4].forEach(t=>cue(t,"clink"));
[75.5,78.5,81.5].forEach(t=>cue(t,"thud"));
[96.5,100.8,110.5,123.5].forEach(t=>cue(t,"page"));
[97,100.2,103.4,106.6,110,113,116.5,119.5].forEach((t,i)=>cue(t,"pluck",[261.63,311.13,349.23,311.13,261.63,233.08,261.63,311.13][i]));
cue(124.5,"chord",[261.63,392,523.25]);
[[261.63,.8,150],[277.18,.8,151],[311.13,1,152],[349.23,1.2,153.2],[311.13,.8,154.6],[277.18,.8,155.6],[261.63,1.8,156.6]].forEach(n=>cue(n[2],"flute",[n[0],n[1]]));
cue(163,"chime");
[[261.63,172],[311.13,175],[349.23,178],[392,181],[466.16,184],[523.25,187]].forEach(n=>cue(n[1],"pluck",[n[0]]));
for(let t=171;t<213;t+=2)cue(t,"tin");
cue(186,"chime");cue(194,"swell");cue(194,"chord",[261.63,392,523.25]);cue(200,"pluck",[523.25]);
cue(211.2,"page");cue(213.5,"thud");
[215,216.4,217.8,219.2,220.6,222].forEach(t=>cue(t,"blip"));
cue(223.4,"burst");cue(223.4,"projOff");
CUES.sort((a,b)=>a.t-b.t);

/* ============================================================
   AUDIO — all synthesized, no voices
   ============================================================ */
let AC=null,master,projBus,sfxBus,scoreBus,comp;
let projLevel=0,staticLevel=0,staticGain=null;
let ambLayers=[],ambTrain=null,ambCharkha=null;
const pluckCache={};let BUF={};
function initAudio(){
 if(AC)return;
 try{
  AC=new (window.AudioContext||window.webkitAudioContext)();
  comp=AC.createDynamicsCompressor();comp.threshold.value=-18;comp.ratio.value=4;comp.connect(AC.destination);
  master=AC.createGain();master.connect(comp);
  projBus=AC.createGain();sfxBus=AC.createGain();scoreBus=AC.createGain();
  [projBus,sfxBus,scoreBus].forEach(b=>b.connect(master));
  BUF.white=mkBuf(2,(t)=>Math.random()*2-1);
  let br=0;BUF.brown=mkBuf(2,(t)=>{br=(br+ (Math.random()*2-1)*.04);br*=.985;return br*6;});
  let pb=0;BUF.proj=mkBuf(1,(t)=>{pb=(pb+(Math.random()*2-1)*.05)*.97;const sh=(t*24)%1;return pb*.9+(Math.random()*2-1)*Math.exp(-sh*26)*.5+Math.sin(t*2*Math.PI*50)*.10;});
  BUF.clack=mkBuf(1.36,(t)=>{let v=(Math.random()*2-1)*.06;[0,.09,.68,.77].forEach(t0=>{if(t>=t0&&t<t0+.07)v+=(Math.random()*2-1)*Math.exp(-(t-t0)*55)*.8;});return v;});
  BUF.charkha=mkBuf(1.15,(t)=>{const wh=(Math.random()*2-1)*.05*(0.7+0.3*Math.sin(t/1.15*2*Math.PI));let c=0;if(t>=.1&&t<.28)c=Math.sin(2*Math.PI*(170-(t-.1)*300)*t)*Math.exp(-(t-.1)*22)*.3;if(t>=.62&&t<.74)c+=Math.sin(2*Math.PI*130*t)*Math.exp(-(t-.62)*30)*.18;return wh+c;});
  BUF.tanpura=mkBuf(4.8,()=>0);
  const td=BUF.tanpura.getChannelData(0);ksInto(td,0,130.81,.5);ksInto(td,1.6,196,.42);ksInto(td,3.2,261.63,.34);
  // persistent projector
  const ps=AC.createBufferSource();ps.buffer=BUF.proj;ps.loop=true;
  const pf=AC.createBiquadFilter();pf.type="lowpass";pf.frequency.value=1400;
  ps.connect(pf);pf.connect(projBus);ps.start();
  // persistent static
  const ss=AC.createBufferSource();ss.buffer=BUF.white;ss.loop=true;
  const sf=AC.createBiquadFilter();sf.type="bandpass";sf.frequency.value=1900;sf.Q.value=.5;
  staticGain=AC.createGain();staticGain.gain.value=0;
  ss.connect(sf);sf.connect(staticGain);staticGain.connect(sfxBus);ss.start();
  applyMix();
 }catch(e){AC=null;}
}
function mkBuf(dur,fn){const b=AC.createBuffer(1,Math.floor(AC.sampleRate*dur),AC.sampleRate);const d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=fn(i/AC.sampleRate,i);return b;}
function ksInto(arr,off,freq,amp){const N=Math.max(2,Math.round(AC.sampleRate/freq));const ring=new Float32Array(N);for(let i=0;i<N;i++)ring[i]=Math.random()*2-1;let idx=0;const start=Math.floor(off*AC.sampleRate);for(let i=0;i<arr.length-start&&i<AC.sampleRate*3;i++){const cur=ring[idx];ring[idx]=.996*.5*(cur+ring[(idx+1)%N]);arr[start+i]+=cur*amp*Math.exp(-i/(AC.sampleRate*1.5));idx=(idx+1)%N;}}
function pluckBuf(freq){const k=Math.round(freq);if(pluckCache[k])return pluckCache[k];const b=mkBuf(2.2,()=>0);ksInto(b.getChannelData(0),0,freq,1);pluckCache[k]=b;return b;}
function applyMix(){
 if(!AC)return;const t=AC.currentTime;
 master.gain.setTargetAtTime(S.muted?0:1,t,.05);
 projBus.gain.setTargetAtTime(projLevel*(S.proj/100)*.5,t,.15);
 sfxBus.gain.setTargetAtTime((S.sfx/100),t,.1);
 scoreBus.gain.setTargetAtTime((S.music/100)*.8,t,.1);
 if(staticGain)staticGain.gain.setTargetAtTime(staticLevel*(S.sfx/100),t,.2);
}
function setStatic(l){staticLevel=l;applyMix();}
function env(g,t,a,peak,d){g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(peak,t+a);g.gain.exponentialRampToValueAtTime(.0001,t+d);}
function osc(type,f,t,d,peak,bus,glideTo){if(!AC)return;const o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(glideTo)o.frequency.exponentialRampToValueAtTime(glideTo,t+d*.8);env(g,t,.01,peak,d);o.connect(g);g.connect(bus);o.start(t);o.stop(t+d+.05);}
function noiseShot(t,d,peak,fType,f0,f1,bus){if(!AC)return;const s=AC.createBufferSource();s.buffer=BUF.white;const f=AC.createBiquadFilter();f.type=fType;f.frequency.setValueAtTime(f0,t);if(f1)f.frequency.exponentialRampToValueAtTime(f1,t+d);const g=AC.createGain();env(g,t,.02,peak,d);s.connect(f);f.connect(g);g.connect(bus);s.start(t);s.stop(t+d+.05);}
function pluck(freq,when,amp=0.3){if(!AC)return;const t=when||AC.currentTime;const s=AC.createBufferSource();s.buffer=pluckBuf(freq);const g=AC.createGain();g.gain.value=amp;const f=AC.createBiquadFilter();f.type="lowpass";f.frequency.value=3200;s.connect(f);f.connect(g);g.connect(scoreBus);s.start(t);const s2=AC.createBufferSource();s2.buffer=pluckBuf(freq*1.003);const g2=AC.createGain();g2.gain.value=amp*.4;s2.connect(g2);g2.connect(scoreBus);s2.start(t);}
function flute(freq,dur){if(!AC)return;const t=AC.currentTime;const o=AC.createOscillator();o.type="triangle";o.frequency.value=freq;const v=AC.createOscillator();v.frequency.value=5;const vg=AC.createGain();vg.gain.value=4;v.connect(vg);vg.connect(o.frequency);const f=AC.createBiquadFilter();f.type="lowpass";f.frequency.value=1900;const g=AC.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.14,t+.09);g.gain.setValueAtTime(.14,t+dur-.2);g.gain.linearRampToValueAtTime(0,t+dur);o.connect(f);f.connect(g);g.connect(scoreBus);o.start(t);v.start(t);o.stop(t+dur+.05);v.stop(t+dur+.05);noiseShot(t,dur,.012,"bandpass",freq*2,freq*2,scoreBus);}
function bell(f=660,amp=.2){if(!AC)return;const t=AC.currentTime;[[1,1],[2.01,.5],[2.99,.32],[4.2,.18]].forEach(p=>{const o=AC.createOscillator();o.frequency.value=f*p[0];const g=AC.createGain();env(g,t,.005,amp*p[1],2.4);o.connect(g);g.connect(sfxBus);o.start(t);o.stop(t+2.5);});}
function birds(){if(!AC)return;const t=AC.currentTime;const n=3+Math.floor(Math.random()*3);for(let i=0;i<n;i++){const tt=t+i*(.09+Math.random()*.07);const f=2500+Math.random()*900;osc("sine",f,tt,.07,.035,sfxBus,f*(1.2+Math.random()*.3));}}
function fire(c){
 if(!AC)return;const t=AC.currentTime;
 switch(c.f){
  case"staticHi":setStatic(.16);break;
  case"staticLo":setStatic(.03);break;
  case"sweep":osc("sine",700+Math.random()*500,t,.7,.05,sfxBus,260);noiseShot(t,.5,.06,"bandpass",800,2600,sfxBus);break;
  case"morse":osc("sine",740,t,c.a,.05,sfxBus);break;
  case"click":noiseShot(t,.03,.14,"highpass",2500,0,sfxBus);break;
  case"page":noiseShot(t,.35,.12,"bandpass",600,2400,sfxBus);break;
  case"thud":osc("sine",90,t,.2,.5,sfxBus,42);noiseShot(t,.08,.2,"lowpass",300,0,sfxBus);break;
  case"whistle":osc("sine",620,t,1.3,.035,sfxBus);osc("sine",782,t,1.3,.028,sfxBus);break;
  case"bell":bell(523,.24);break;
  case"chime":bell(880,.12);break;
  case"birds":birds();break;
  case"flute":flute(c.a[0],c.a[1]);break;
  case"pluck":pluck(c.a[0],0,.3);break;
  case"chord":c.a.forEach((f,i)=>pluck(f,t+i*.06,.24));break;
  case"dha":osc("sine",170,t,.22,.22,scoreBus,80);noiseShot(t,.04,.05,"bandpass",900,0,scoreBus);break;
  case"tin":osc("sine",420,t,.1,.09,scoreBus);noiseShot(t,.02,.04,"highpass",3000,0,scoreBus);break;
  case"clink":[2400,3150,4300].forEach(f=>osc("sine",f,t,.22,.06,sfxBus));noiseShot(t,.03,.08,"highpass",3500,0,sfxBus);break;
  case"trainOn":trainLayer(true);break;
  case"trainOff":trainLayer(false);break;
  case"charkhaOn":charkhaLayer(true);break;
  case"charkhaOff":charkhaLayer(false);break;
  case"swell":noiseShot(t,3,.05,"lowpass",300,1400,sfxBus);break;
  case"blip":noiseShot(t,.025,.12,"highpass",2800,0,sfxBus);osc("sine",1200,t,.04,.06,sfxBus);break;
  case"burst":setStatic(.3);setTimeout(()=>setStatic(0),800);noiseShot(t,.7,.2,"highpass",1000,0,sfxBus);break;
  case"projOff":projLevel=0;applyMix();setStatic(0);break;
  case"heart":osc("sine",56,t,.13,.24,sfxBus);osc("sine",50,t+.14,.11,.16,sfxBus);break;
  case"tick":noiseShot(t,.015,.06,"bandpass",c.a||1800,0,sfxBus);break;
  case"pen":noiseShot(t,.02,.045,"highpass",3200,0,sfxBus);break;
  case"reel":noiseShot(t,.05,.12,"bandpass",1200,600,sfxBus);break;
 }
}
function mkLoop(buf,fType,freq,g0,bus){const s=AC.createBufferSource();s.buffer=buf;s.loop=true;const f=AC.createBiquadFilter();f.type=fType;f.frequency.value=freq;const g=AC.createGain();g.gain.value=0;g.gain.setTargetAtTime(g0,AC.currentTime,.4);s.connect(f);f.connect(g);g.connect(bus);s.start();const L={s,g};ambLayers.push(L);return L;}
function mkDrone(freqs,g0){const g=AC.createGain();g.gain.value=0;g.gain.setTargetAtTime(g0,AC.currentTime,.6);const f=AC.createBiquadFilter();f.type="lowpass";f.frequency.value=320;f.connect(g);g.connect(scoreBus);const os=freqs.map(fr=>{const o=AC.createOscillator();o.type="sawtooth";o.frequency.value=fr;o.connect(f);o.start();return o;});const L={s:{stop:w=>os.forEach(o=>{try{o.stop(w)}catch(e){}})},g};ambLayers.push(L);return L;}
function stopLayer(L){if(!L||!AC)return;try{L.g.gain.setTargetAtTime(0,AC.currentTime,.15);L.s.stop(AC.currentTime+.6);}catch(e){}}
function trainLayer(on){if(!AC)return;if(on&&!ambTrain)ambTrain=mkLoop(BUF.clack,"lowpass",900,.14,sfxBus);if(!on&&ambTrain){stopLayer(ambTrain);ambTrain=null;}}
function charkhaLayer(on){if(!AC)return;if(on&&!ambCharkha)ambCharkha=mkLoop(BUF.charkha,"lowpass",2400,.3,sfxBus);if(!on&&ambCharkha){stopLayer(ambCharkha);ambCharkha=null;}}
function ambStop(){ambLayers.forEach(stopLayer);ambLayers=[];ambTrain=null;ambCharkha=null;}
function setAmb(idx,t){
 if(!AC)return;ambStop();setStatic(idx===0?(t<16?.14:.03):0);
 if(idx===0){mkDrone([50],.02);}
 if(idx===1){mkLoop(BUF.clack,"lowpass",500,.05,sfxBus);mkLoop(BUF.brown,"lowpass",420,.05,sfxBus);}
 if(idx===2){mkDrone([55,82.41],.05);mkLoop(BUF.brown,"lowpass",380,.06,sfxBus);}
 if(idx===3){mkLoop(BUF.brown,"lowpass",230,.05,sfxBus);}
 if(idx===4){mkLoop(BUF.tanpura,"lowpass",2600,.16,scoreBus);mkLoop(BUF.brown,"lowpass",420,.04,sfxBus);}
 if(idx===5){mkLoop(BUF.brown,"lowpass",500,.05,sfxBus);}
}

/* ============================================================
   CANVAS RENDERERS — the archival reels, drawn live
   ============================================================ */
const sc=$("sceneCv").getContext("2d"),fx=$("fxCv").getContext("2d");
const INK="#14100a",PAP="#e8d9b5",BR="#d9a441",SD="#c2452a";
function bgGrad(g,c1,c2){const gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,c1);gr.addColorStop(1,c2);g.fillStyle=gr;g.fillRect(-6,-6,W+12,H+12);}
function glow(g,x,y,r,c,a){const gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,c);gr.addColorStop(1,"rgba(0,0,0,0)");g.globalAlpha=a;g.fillStyle=gr;g.fillRect(x-r,y-r,r*2,r*2);g.globalAlpha=1;}
function motes(g,t,n,seed){g.fillStyle="rgba(240,220,170,.5)";for(let i=0;i<n;i++){const x=(sr(seed+i)*W+t*8*(0.4+sr(i)))%W,y=(sr(seed+i+99)*H+Math.sin(t*.5+i)*20+H)%H;g.globalAlpha=.15+.35*sr(i+7);g.fillRect(x,y,2,2);}g.globalAlpha=1;}
/* ink figures: jointed limbs, idle breathing, a walk with bounce, little costume touches, and a warm rim light so they read on dark ground */
const RIM="rgba(255,232,186,1)";let figN=0;
function rimInk(g,draw){g.save();g.fillStyle=g.strokeStyle=RIM;const a=g.globalAlpha;g.globalAlpha=a*.16;draw(g,11);g.globalAlpha=a*.6;draw(g,4);g.restore();g.save();g.fillStyle=g.strokeStyle=INK;draw(g,0);g.restore();}
function joint(a,b,L,dir){const dx=b[0]-a[0],dy=b[1]-a[1],d=Math.hypot(dx,dy)||1,h=Math.sqrt(Math.max(0,L*L-d*d/4));return[(a[0]+b[0])/2-dy/d*h*dir,(a[1]+b[1])/2+dx/d*h*dir];}
function seg3(g,a,b,c){g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.lineTo(c[0],c[1]);}
function headAcc(g,look,hd,sh,e,T,walk){
 if(look===0){g.beginPath();g.moveTo(hd[0]-12,hd[1]-5);g.lineTo(hd[0]+12,hd[1]-5);g.lineTo(hd[0]+9,hd[1]-16);g.lineTo(hd[0]-10,hd[1]-13);g.closePath();g.fill();if(e){g.lineWidth=e;g.stroke();}}
 else if(look===1){const f=Math.sin(T*(walk?9:2.5))*(walk?6:3);g.lineWidth=5+e;g.beginPath();g.moveTo(sh[0]+4,sh[1]-4);g.quadraticCurveTo(sh[0]-14,sh[1]+2+f*.5,sh[0]-28,sh[1]+12+f);g.stroke();}
 else if(look===2){g.beginPath();g.arc(hd[0]-10,hd[1]-5,6,0,7);g.fill();if(e){g.lineWidth=e;g.stroke();}}
 else if(look===3){g.beginPath();g.ellipse(hd[0],hd[1]-7,14,9,0,0,7);g.fill();if(e){g.lineWidth=e;g.stroke();}g.lineWidth=4+e;g.beginPath();g.moveTo(hd[0]-12,hd[1]-6);g.lineTo(hd[0]-18,hd[1]+4);g.stroke();}
}
function fig(g,x,y,s,ph,flagB){const look=figN++%6,walk=ph!==0,kid=look===5&&!flagB,T=ft+look*1.7;
 g.save();g.translate(x,y);g.scale(s,s);if(kid)g.scale(.7,.7);g.lineCap="round";g.lineJoin="round";
 const sw=Math.sin(ph),bob=walk?-Math.abs(Math.cos(ph))*4:Math.sin(T*2.2)*1.3,lean=walk?.09:Math.sin(T*.6)*.035;
 const hip=[0,-39+bob],sh=[hip[0]+Math.sin(lean)*32,hip[1]-31],nod=walk?Math.sin(ph*2)*.05:Math.sin(T*.8)*.09;
 const hd=[sh[0]+Math.sin(lean+nod)*21,sh[1]-21];
 const ft1=walk?[sw*17,-Math.max(0,Math.cos(ph))*8]:[-9+Math.sin(T*.6)*1.5,0],ft2=walk?[-sw*17,-Math.max(0,-Math.cos(ph))*8]:[9+Math.sin(T*.6)*1.5,0];
 const k1=joint(hip,ft1,21,-1),k2=joint(hip,ft2,21,-1);
 let h1,h2,d1=1,d2=1;const sa=[sh[0],sh[1]+3];
 if(walk){h1=[sa[0]-sw*15,sa[1]+37];h2=[sa[0]+sw*15,sa[1]+37];}
 else if(look===3){h1=[hip[0]-15,hip[1]-3];h2=[hip[0]+15,hip[1]-3];d1=1;d2=-1;}
 else if(look===0){h1=[hip[0]-9,hip[1]-6];h2=[hip[0]-5,hip[1]-8];d1=1;d2=1;}
 else{const sway=Math.sin(T*1.1)*3;h1=[sa[0]-11+sway,sa[1]+37];h2=[sa[0]+11+sway,sa[1]+37];d2=-1;}
 if(flagB){h2=[14,-96+bob];}
 const e1=joint(sa,h1,21,d1),e2=joint(sa,h2,21,flagB?-1:d2);
 const draw=(g,e)=>{
  if(look===2){g.beginPath();g.moveTo(sh[0]-5,sh[1]+8);g.lineTo(sh[0]+5,sh[1]+8);g.lineTo(hip[0]+15,hip[1]+16);g.lineTo(hip[0]-15,hip[1]+16);g.closePath();g.fill();if(e){g.lineWidth=e;g.stroke();}}
  g.lineWidth=7+e;g.beginPath();seg3(g,hip,k1,ft1);seg3(g,hip,k2,ft2);g.stroke();
  g.lineWidth=6+e;g.beginPath();g.moveTo(ft1[0],ft1[1]);g.lineTo(ft1[0]+6,ft1[1]);g.moveTo(ft2[0],ft2[1]);g.lineTo(ft2[0]+6,ft2[1]);g.stroke();
  g.lineWidth=8+e;g.beginPath();g.moveTo(hip[0],hip[1]);g.quadraticCurveTo(hip[0]+lean*30+1.5,(hip[1]+sh[1])/2,sh[0],sh[1]);g.stroke();
  g.lineWidth=6+e;g.beginPath();seg3(g,sa,e1,h1);seg3(g,sa,e2,h2);g.stroke();
  g.beginPath();g.arc(hd[0],hd[1],12,0,7);g.fill();if(e){g.lineWidth=e;g.stroke();}
  if(look===4){g.lineWidth=3+e;g.beginPath();g.moveTo(sh[0]+5,sh[1]);g.lineTo(hip[0]-10,hip[1]-2);g.stroke();g.fillRect(hip[0]-20-e/2,hip[1]-8-e/2,14+e,12+e);}
  headAcc(g,look,hd,sh,e,T,walk);
  if(flagB){g.lineWidth=3+e;g.beginPath();g.moveTo(14,-90+bob);g.lineTo(14,-140+bob);g.stroke();}
 };
 rimInk(g,draw);
 if(flagB)waveFlag(g,14,-140+bob,44,26,ph);
 g.restore();}
function waveFlag(g,x,y,w,h,ph){g.save();g.translate(x,y);const cols=["#d99a3d","#e8d9b5","#7a9a4e"];for(let b=0;b<3;b++){g.fillStyle=cols[b];g.beginPath();g.moveTo(0,b*h/3);for(let i=0;i<=10;i++){const xx=i*w/10;g.lineTo(xx,b*h/3+Math.sin(ph*2+i*.7)*3);}for(let i=10;i>=0;i--){const xx=i*w/10;g.lineTo(xx,(b+1)*h/3+Math.sin(ph*2+i*.7)*3);}g.closePath();g.fill();}
 g.strokeStyle="#3d5a6b";g.lineWidth=1.2;g.beginPath();g.arc(w/2,h/2+Math.sin(ph*2+3.5)*3,h/7,0,7);g.stroke();for(let i=0;i<12;i++){const a=i/12*Math.PI*2;g.beginPath();g.moveTo(w/2,h/2+Math.sin(ph*2+3.5)*3);g.lineTo(w/2+Math.cos(a)*h/7,h/2+Math.sin(ph*2+3.5)*3+Math.sin(a)*h/7);g.stroke();}g.restore();}
function dome(g,x,y,s){g.save();g.translate(x,y);g.scale(s,s);g.fillStyle=INK;g.fillRect(-260,-40,520,44);for(let i=-12;i<=12;i++)g.fillRect(i*20-3,-78,6,40);g.fillRect(-270,-84,540,8);g.beginPath();g.arc(0,-84,110,Math.PI,0);g.fill();g.fillRect(-6,-224,12,34);g.beginPath();g.arc(0,-228,8,0,7);g.fill();g.restore();}
function birdShape(g,x,y,s,flap){g.save();g.translate(x,y);g.scale(s,s);g.lineCap="round";const w=Math.sin(flap)*10;g.beginPath();g.moveTo(-14,-w);g.quadraticCurveTo(-5,-8-w,0,0);g.quadraticCurveTo(5,-8-w,14,-w);const a=g.globalAlpha;g.strokeStyle=RIM;g.globalAlpha=a*.5;g.lineWidth=7;g.stroke();g.globalAlpha=a;g.strokeStyle=INK;g.lineWidth=3;g.stroke();g.restore();}
/* ---- scene helpers for the script-driven reels (same ink-and-sepia hand as the originals) ---- */
const win=(st,a,b,f)=>{f=(f||.5)*1.6;const v=clamp(Math.min((st-a)/f+.3,(b-st)/f+.3),0,1);return v*v*(3-2*v);};
const offC=document.createElement("canvas");offC.width=W;offC.height=H;const offG=offC.getContext("2d");
function layer(g,a,fn){if(a<=0)return;if(a>=1){fn(g);return;}offG.setTransform(1,0,0,1,0,0);offG.globalAlpha=1;offG.globalCompositeOperation="source-over";offG.clearRect(0,0,W,H);offG.save();fn(offG);offG.restore();g.save();g.globalAlpha=a;g.drawImage(offC,0,0);g.restore();}
function pose(g,x,y,s,aL,aR){const look=figN++%6%5,T=ft+look*1.7;g.save();g.translate(x,y);g.scale(s,s);g.lineCap="round";g.lineJoin="round";
 const br=Math.sin(T*2.2)*1.2,hip=[0,-38],sh=[0,-71+br],sa=[0,-70+br];
 const tilt=clamp((aR[0]-aL[0]>0?(aL[1]-aR[1]):0)*.0012,-.12,.12)+Math.sin(T*.8)*.06;const hd=[Math.sin(tilt)*21,-92+br];
 const elbow=(h,side)=>{const a=joint(sa,h,27,1),b=joint(sa,h,27,-1);return (side*a[0]+a[1]*.5)>(side*b[0]+b[1]*.5)?a:b;};
 const eL=elbow(aL,-1),eR=elbow(aR,1),f1=[-11,0],f2=[11,0],k1=joint(hip,f1,20,1),k2=joint(hip,f2,20,-1);
 const draw=(g,e)=>{
  if(look===2){g.beginPath();g.moveTo(-5,-62+br);g.lineTo(5,-62+br);g.lineTo(15,-22);g.lineTo(-15,-22);g.closePath();g.fill();if(e){g.lineWidth=e;g.stroke();}}
  g.lineWidth=7+e;g.beginPath();seg3(g,hip,k1,f1);seg3(g,hip,k2,f2);g.stroke();
  g.lineWidth=6+e;g.beginPath();g.moveTo(-11,0);g.lineTo(-16,0);g.moveTo(11,0);g.lineTo(16,0);g.stroke();
  g.lineWidth=8+e;g.beginPath();g.moveTo(hip[0],hip[1]);g.quadraticCurveTo(1.5,-55,sh[0],sh[1]);g.stroke();
  g.lineWidth=6+e;g.beginPath();seg3(g,sa,eL,aL);seg3(g,sa,eR,aR);g.stroke();
  g.beginPath();g.arc(aL[0],aL[1],3.5+e/2,0,7);g.arc(aR[0],aR[1],3.5+e/2,0,7);g.fill();
  g.beginPath();g.arc(hd[0],hd[1],12,0,7);g.fill();if(e){g.lineWidth=e;g.stroke();}
  if(look===4){g.lineWidth=3+e;g.beginPath();g.moveTo(5,-70);g.lineTo(-10,-40);g.stroke();g.fillRect(-20-e/2,-46-e/2,14+e,12+e);}
  headAcc(g,look,hd,sh,e,T,false);
 };
 rimInk(g,draw);g.restore();}
function bust(g,x,y,s,c){g.save();g.translate(x,y);g.scale(s,s);const sil=g=>{g.beginPath();g.arc(0,-60,30,0,7);g.moveTo(-9,-34);g.rect(-9,-34,18,14);g.moveTo(-62,30);g.ellipse(0,30,62,56,0,Math.PI,0);g.rect(-62,28,124,60);};
 if(!c||c===INK){sil(g);const a=g.globalAlpha;g.strokeStyle=RIM;g.lineJoin="round";g.globalAlpha=a*.14;g.lineWidth=14;g.stroke();g.globalAlpha=a*.5;g.lineWidth=5;g.stroke();g.globalAlpha=a;}
 g.fillStyle=c||INK;sil(g);g.fill();g.restore();}
function ground(g,y,c){g.fillStyle=c||"#241a0d";g.fillRect(-6,y,W+12,H-y+6);}
function bricks(g,x,y,w,h,c1,c2){if(h<=0)return;g.fillStyle=c1;g.fillRect(x,y,w,h);g.strokeStyle=c2;g.lineWidth=3;for(let r=0;r*30<h;r++){const yy=y+r*30;g.beginPath();g.moveTo(x,yy);g.lineTo(x+w,yy);g.stroke();for(let xx=x+(r%2?30:0);xx<x+w;xx+=60){g.beginPath();g.moveTo(xx,yy);g.lineTo(xx,Math.min(y+h,yy+30));g.stroke();}}}
function qmark(g,x,y,s,c,lw){g.save();g.translate(x,y);g.scale(s,s);g.strokeStyle=c;g.lineWidth=lw;g.lineCap="round";g.beginPath();g.arc(0,-40,34,Math.PI*1.05,Math.PI*2.35);g.quadraticCurveTo(0,-4,0,14);g.stroke();g.fillStyle=c;g.beginPath();g.arc(0,44,lw*.7,0,7);g.fill();g.restore();}
function diya(g,x,y,s,t,lit){g.save();g.translate(x,y);g.scale(s,s);
 if(lit>0){glow(g,0,-26,70,"rgba(240,196,106,.9)",.7*lit);g.globalAlpha=lit;const fl=Math.sin(t*13+x)*1.5;g.fillStyle="#f0c46a";g.beginPath();g.moveTo(0,-44+fl);g.quadraticCurveTo(9,-22,0,-12);g.quadraticCurveTo(-9,-22,0,-44+fl);g.fill();g.fillStyle="#fff6dd";g.beginPath();g.ellipse(0,-19,3,6,0,0,7);g.fill();g.globalAlpha=1;}
 g.fillStyle="#5a3a1a";g.beginPath();g.moveTo(-30,-12);g.quadraticCurveTo(0,22,30,-12);g.quadraticCurveTo(36,-14,40,-18);g.lineTo(30,-14);g.closePath();g.fill();g.strokeStyle="#8a5f22";g.lineWidth=2;g.stroke();g.restore();}
function kite(g,x,y,s,t){g.save();g.translate(x,y);g.rotate(Math.sin(t*1.3)*.15);g.scale(s,s);g.fillStyle="#c2452a";g.beginPath();g.moveTo(0,-30);g.lineTo(22,0);g.lineTo(0,34);g.lineTo(-22,0);g.closePath();g.fill();g.strokeStyle="#e8d9b5";g.lineWidth=1.5;g.beginPath();g.moveTo(0,-30);g.lineTo(0,34);g.moveTo(-22,0);g.lineTo(22,0);g.stroke();g.beginPath();g.moveTo(0,34);for(let i=1;i<6;i++)g.lineTo(Math.sin(t*3+i)*6,34+i*9);g.stroke();g.restore();}
function lantern(g,lx,ly){g.fillStyle="#f0c46a";g.fillRect(lx-9,ly-14,18,24);g.strokeStyle="#3a2c18";g.lineWidth=2;g.strokeRect(lx-9,ly-14,18,24);g.fillStyle=INK;g.fillRect(lx-12,ly-18,24,5);g.fillRect(lx-12,ly+10,24,4);glow(g,lx,ly,120,"rgba(255,230,170,.8)",.6);}
function darkAround(g,x,y,r0,r1,a){const dg=g.createRadialGradient(x,y,r0,x,y,r1);dg.addColorStop(0,"rgba(0,0,0,0)");dg.addColorStop(1,`rgba(4,3,2,${a*.72})`);g.fillStyle=dg;g.fillRect(-6,-6,W+12,H+12);}
function cupped(g,x,y,s,shield){g.save();g.translate(x,y);g.scale(s,s);g.fillStyle="#241608";g.strokeStyle="#241608";g.lineCap="round";
 for(const d of[-1,1]){g.lineWidth=46;g.beginPath();g.moveTo(d*170,260);g.lineTo(d*46,40);g.stroke();g.beginPath();g.ellipse(d*40,22,48,28,d*.45,0,7);g.fill();g.lineWidth=13;for(let k=0;k<4;k++){const fx=d*(58+k*4),fy=10-k*12;g.beginPath();g.moveTo(fx,fy);g.lineTo(fx+d*(18-shield*34),fy-30-shield*44);g.stroke();}}
 g.restore();}
function drawPoster(g,cx,cy,s,rot,extraStamp){
 g.save();g.translate(cx,cy);g.rotate(rot);g.scale(s,s);
 const pw=460,ph=640;
 g.shadowColor="rgba(0,0,0,.7)";g.shadowBlur=30;g.shadowOffsetY=14;
 const pg=g.createLinearGradient(-pw/2,-ph/2,pw/2,ph/2);pg.addColorStop(0,"#efe2bd");pg.addColorStop(.6,"#e3d2a8");pg.addColorStop(1,"#d0ba8a");
 g.fillStyle=pg;g.fillRect(-pw/2,-ph/2,pw,ph);g.shadowColor="transparent";
 g.strokeStyle="rgba(74,52,24,.6)";g.lineWidth=2;g.strokeRect(-pw/2+8,-ph/2+8,pw-16,ph-16);
 for(let i=0;i<7;i++){g.fillStyle=`rgba(122,84,38,${.04+.03*sr(i)})`;g.beginPath();g.arc((sr(i+3)-.5)*pw*.8,(sr(i+9)-.5)*ph*.8,18+sr(i)*40,0,7);g.fill();}
 g.fillStyle="#b8371f";g.textAlign="center";g.font='58px "Yatra One", serif';g.fillText("गुमशुदा !!",0,-ph/2+72);
 g.fillStyle="#3a2a12";g.font='15px "Special Elite", monospace';g.fillText("M I S S I N G  ·  L I B E R T Y",0,-ph/2+100);
 g.strokeStyle="#3a2a12";g.lineWidth=1.5;g.beginPath();g.moveTo(-pw/2+26,-ph/2+114);g.lineTo(pw/2-26,-ph/2+114);g.stroke();
 // oval photo
 g.save();g.translate(0,-ph/2+218);g.beginPath();g.ellipse(0,0,80,96,0,0,7);g.clip();
 const og=g.createRadialGradient(0,-24,10,0,0,120);og.addColorStop(0,"#caa76a");og.addColorStop(1,"#5a4020");g.fillStyle=og;g.fillRect(-90,-110,180,220);
 g.strokeStyle="rgba(240,220,170,.35)";for(let i=0;i<9;i++){g.beginPath();g.moveTo(0,-30);g.lineTo(Math.cos(i/9*6.28)*120,-30+Math.sin(i/9*6.28)*120);g.stroke();}
 g.fillStyle="#1c140c";g.beginPath();g.arc(0,-30,27,0,7);g.fill();g.fillRect(-9,-8,18,16);g.beginPath();g.ellipse(0,52,52,46,0,Math.PI,0);g.fill();g.fillRect(-52,50,104,60);
 g.fillStyle="#e3d2a8";g.save();g.translate(0,42);g.beginPath();g.moveTo(-13,0);g.quadraticCurveTo(-5,-9,0,-1);g.quadraticCurveTo(5,-9,13,0);g.quadraticCurveTo(5,-2,0,4);g.quadraticCurveTo(-5,-2,-13,0);g.fill();g.restore();
 g.restore();
 g.strokeStyle="#4a3418";g.lineWidth=2;g.beginPath();g.ellipse(0,-ph/2+218,80,96,0,0,7);g.stroke();
 const rows=[["NAAM / NAME","Azaadi"],["AAKHRI BAAR DEKHA GAYA / LAST SEEN","ek azaad desh mein"],["PATA / WHEREABOUTS","kisi ko nahi"]];
 g.textAlign="left";let y=-ph/2+338;
 rows.forEach(r=>{g.fillStyle="#6b4d26";g.font='10px "Special Elite", monospace';g.fillText(r[0],-pw/2+26,y);g.fillStyle="#241a0d";g.font='15px "Tiro Devanagari Hindi", serif';g.fillText(r[1],-pw/2+26,y+18,300);g.strokeStyle="rgba(74,52,24,.4)";g.setLineDash([2,3]);g.beginPath();g.moveTo(-pw/2+26,y+26);g.lineTo(pw/2-26,y+26);g.stroke();g.setLineDash([]);y+=40;});
 g.textAlign="center";g.fillStyle="#3a2a12";g.font='11px "Special Elite", monospace';g.fillText("Agar aapko kahin nazar aaye... toh humein zaroor batayein.",0,ph/2-84);
 // stamp
 g.save();g.translate(pw/2-84,ph/2-176);g.rotate(-.22);g.strokeStyle="rgba(184,55,31,.85)";g.lineWidth=3;g.beginPath();g.arc(0,0,52,0,7);g.stroke();g.lineWidth=1.5;g.beginPath();g.arc(0,0,44,0,7);g.stroke();g.fillStyle="rgba(184,55,31,.9)";g.font='17px "Yatra One", serif';g.fillText("तलाश जारी",0,-4);g.font='10px "Special Elite", monospace';g.fillText("SEARCH ON",0,14);g.restore();
 if(extraStamp){g.save();g.rotate(-.1);g.strokeStyle="rgba(184,55,31,.9)";g.lineWidth=4;g.strokeRect(-190,-36,380,72);g.fillStyle="rgba(184,55,31,.92)";g.font='34px "Yatra One", serif';g.fillText("अभी भी गुमशुदा?",0,-2);g.font='13px "Special Elite", monospace';g.fillText("STILL MISSING?",0,24);g.restore();}
 // tear tabs
 g.strokeStyle="#4a3418";g.setLineDash([4,4]);g.beginPath();g.moveTo(-pw/2,ph/2-58);g.lineTo(pw/2,ph/2-58);g.stroke();g.setLineDash([]);
 const tabs=["सवाल","उम्मीद","हिम्मत","याद","आवाज़","ज़िंदा","तलाश"];
 tabs.forEach((tb,i)=>{const x=-pw/2+(i+.5)*pw/7;g.save();g.translate(x,ph/2-30);g.rotate(Math.PI/2);g.fillStyle="#3a2a12";g.font='13px "Tiro Devanagari Hindi", serif';g.textAlign="center";g.fillText(tb,0,4);g.restore();if(i>0){g.strokeStyle="rgba(74,52,24,.5)";g.setLineDash([3,3]);g.beginPath();g.moveTo(-pw/2+i*pw/7,ph/2-58);g.lineTo(-pw/2+i*pw/7,ph/2);g.stroke();g.setLineDash([]);}});
 g.restore();
}

const REND={
 tuning:{bg(g,t){g.fillStyle="#060403";g.fillRect(-6,-6,W+12,H+12);},fg(g,t){const k=Math.floor(t*2.4);if(sr(k)>.55){const px=120+sr(k+1)*600,py=90+sr(k+2)*380,pw=150+sr(k+3)*120;g.save();g.globalAlpha=.5;g.translate(px,py);g.rotate((sr(k+4)-.5)*.2);g.fillStyle="#cbb98e";g.fillRect(-pw/2-8,-90,pw+16,180);g.fillStyle="#3a2f1c";g.fillRect(-pw/2,-82,pw,164);g.fillStyle="#171009";if(k%3===0)dome(g,0,60,.28);else if(k%3===1){for(let i=0;i<4;i++)fig(g,-pw/2+22+i*pw/4,70,.5,i,false);}else waveFlag(g,-20,-40,60,36,t*3);g.restore();}}},
 radio:{bg(g,t){bgGrad(g,"#241a10","#0c0805");glow(g,760,120,340,"rgba(159,196,201,.25)",.5);g.fillStyle="rgba(159,196,201,.06)";g.beginPath();g.moveTo(640,-10);g.lineTo(960,-10);g.lineTo(960,420);g.lineTo(700,300);g.closePath();g.fill();},fg(g,t,st){
  const cx=480,cy=430;g.save();g.translate(cx,cy);
  glow(g,0,-60,320,"rgba(217,164,65,.4)",.55+.1*Math.sin(t*7));
  const wg=g.createLinearGradient(-260,-190,260,190);wg.addColorStop(0,"#4a3016");wg.addColorStop(.5,"#33200e");wg.addColorStop(1,"#241608");
  g.fillStyle=wg;g.beginPath();g.moveTo(-260,180);g.lineTo(-260,-90);g.quadraticCurveTo(-260,-190,-140,-190);g.lineTo(140,-190);g.quadraticCurveTo(260,-190,260,-90);g.lineTo(260,180);g.closePath();g.fill();
  g.strokeStyle="#8a5f22";g.lineWidth=4;g.stroke();
  for(let i=0;i<9;i++){g.strokeStyle="rgba(138,95,34,.25)";g.lineWidth=2;g.beginPath();g.moveTo(-240,-160+i*38);g.quadraticCurveTo(0,-170+i*38+Math.sin(i)*8,240,-160+i*38);g.stroke();}
  // grille
  g.fillStyle="#171009";g.fillRect(-210,-150,180,220);for(let i=0;i<8;i++){g.fillStyle="#8a5f22";g.fillRect(-200+i*22,-142,8,204);}
  // dial
  g.fillStyle="#0f0a05";g.fillRect(-10,-150,240,130);g.strokeStyle="#d9a441";g.lineWidth=3;g.strokeRect(-10,-150,240,130);
  glow(g,110,-85,130,"rgba(240,196,106,.55)",.7);
  g.strokeStyle="#e8d9b5";g.lineWidth=1.5;g.beginPath();g.moveTo(4,-60);g.lineTo(216,-60);g.stroke();
  g.fillStyle="#e8d9b5";g.font='11px "Special Elite", monospace';g.textAlign="center";
  ["495","620","800","1000","1200"].forEach((f,i)=>{const x=14+i*50;g.fillText(f,x,-44);g.beginPath();g.moveTo(x,-60);g.lineTo(x,-68);g.stroke();});
  g.font='10px "Special Elite", monospace';g.fillStyle="#d9a441";["DELHI","LAHORE","BOMBAY","CALCUTTA"].forEach((s,i)=>g.fillText(s,38+i*50,-128));
  g.fillStyle="rgba(232,217,181,.5)";g.font='9px "Special Elite", monospace';g.fillText("kHz · ALL INDIA RADIO",110,-88);
  const needle=14+((Math.sin(st*.55)+Math.sin(st*1.3)*.4+1.4)/2.8)*200;
  g.strokeStyle="#e04b2f";g.lineWidth=3;g.beginPath();g.moveTo(needle,-142);g.lineTo(needle,-32);g.stroke();glow(g,needle,-86,26,"rgba(224,75,47,.8)",.6);
  // knobs
  [[60,120],[170,120]].forEach(k=>{g.fillStyle="#171009";g.beginPath();g.arc(k[0],k[1],30,0,7);g.fill();g.strokeStyle="#d9a441";g.lineWidth=3;g.stroke();g.save();g.translate(k[0],k[1]);g.rotate(t*.4);g.strokeStyle="#e8d9b5";g.beginPath();g.moveTo(0,0);g.lineTo(0,-22);g.stroke();g.restore();});
  g.fillStyle="#d9a441";g.font='13px "Special Elite", monospace';g.fillText("· MURPHY · BABY ·",110,42);
  g.restore();motes(g,t,26,5);}},
 poster:{bg(g){g.fillStyle="#0a0705";g.fillRect(-6,-6,W+12,H+12);},fg(g,t,st){glow(g,480,360,520,"rgba(217,164,65,.18)",.8);drawPoster(g,480,368,.92*Math.min(1,.85+st*.06),-.035,false);motes(g,t,14,9);}},
 struggle:{bg(g,t){bgGrad(g,"#7a5c34","#2a1e10");glow(g,480,260,460,"rgba(240,220,170,.5)",.7);},fg(g,t,st){
  g.fillStyle="rgba(232,217,181,.12)";for(let i=0;i<5;i++){g.beginPath();g.ellipse(((t*20+i*230)%(W+300))-150,180+i*40,160,30,0,0,7);g.fill();}
  ground(g,560);
  g.save();g.globalAlpha=.45;for(let i=0;i<12;i++){const x=((i*95+t*24)%(W+140))-70;fig(g,x,540,.55,t*4+i,i%3===0);}g.restore();
  const d=clamp((st-3)/1,0,1);
  if(d>0){for(let i=0;i<7;i++)diya(g,110+i*125,590,.9,t,d*(.7+.3*sr(i)));}
  for(let i=0;i<7;i++){const x=((i*150+t*48)%(W+200))-100;fig(g,x,660,1,t*4.4+i*2,i%2===0);}
  if(d>0){for(let i=0;i<9;i++){const p=((st-3)*.12+sr(i))%1;const x=80+sr(i+5)*800+Math.sin(t+i)*20,y=lerp(540,60,p);g.globalAlpha=d*(1-p)*.7;g.strokeStyle="#e8d9b5";g.lineWidth=2;g.beginPath();g.arc(x,y,10+sr(i)*16,0,7);g.stroke();}g.globalAlpha=1;}
  motes(g,t,18,51);}},
 lastseen:{bg(g,t){bgGrad(g,"#5a4428","#140e08");glow(g,480,330,380,"rgba(240,196,106,.55)",.8);g.fillStyle="#f0c46a";g.beginPath();g.arc(480,330,54,0,7);g.fill();},fg(g,t,st){
  g.fillStyle="rgba(58,44,24,.85)";dome(g,480,440,.9);
  g.strokeStyle=INK;g.lineWidth=5;g.beginPath();g.moveTo(700,440);g.lineTo(700,170);g.stroke();waveFlag(g,703,170,110,64,t*3);
  ground(g,440,"#1c140c");
  g.strokeStyle="rgba(138,95,34,.5)";g.lineWidth=3;g.beginPath();g.moveTo(180,H);g.lineTo(470,440);g.moveTo(780,H);g.lineTo(490,440);g.stroke();
  const p=clamp(st/6,0,1);const fy=lerp(H-60,452,p),fs=lerp(1.25,.16,p);
  g.globalAlpha=1-clamp((st-4.6)/1.2,0,1)*.9;fig(g,480,fy,fs,t*4,false);g.globalAlpha=1;
  for(let i=0;i<5;i++)birdShape(g,(200+i*140+t*22)%W,120+sr(i)*90,.9,t*7+i);
  motes(g,t,16,53);}},
 lantern:{bg(g){bgGrad(g,"#120d08","#060403");},fg(g,t,st){
  const x=lerp(200,600,st/4),y=620,lx=x+48,ly=548+Math.sin(t*3.5)*3;
  glow(g,lx,ly-40,340,"rgba(240,196,106,.5)",.8+.1*Math.sin(t*9));
  g.fillStyle="#1c140c";for(let i=0;i<6;i++){const px=40+i*180;g.fillRect(px,140,36,480);g.fillRect(px-10,130,56,16);g.fillRect(px-10,608,56,14);}
  g.fillRect(-6,106,W+12,26);
  ground(g,620,"#0e0a06");
  pose(g,x,y,1.2,[-12,-46],[38,-60]);
  g.strokeStyle=INK;g.lineWidth=3;g.beginPath();g.moveTo(x+46,y-72);g.lineTo(lx,ly-18);g.stroke();lantern(g,lx,ly);
  darkAround(g,lx,ly,60,560,.86);
  motes(g,t,10,55);}},
 archive:{bg(g){bgGrad(g,"#2c2013","#100b06");},fg(g,t,st){
  const a=1-clamp((st-2.3)/.5,0,1);
  layer(g,a,g=>{glow(g,480,300,380,"rgba(240,196,106,.35)",.8);
   const sp=["इतिहास","HISTORY","१८५७","१९४२","पन्ने"];for(let i=0;i<5;i++){g.save();g.translate(150+i*4,600-i*40);g.fillStyle=["#3a2c18","#4a3418","#2c2013","#5a4020","#3a2c18"][i];g.fillRect(-80,-38,220-i*14,38);g.strokeStyle="#8a5f22";g.lineWidth=2;g.strokeRect(-80,-38,220-i*14,38);g.fillStyle="#e8d9b5";g.font='16px "Tiro Devanagari Hindi", serif';g.textAlign="left";g.fillText(sp[i],-62,-12);g.restore();}
   g.save();g.translate(600,440);g.fillStyle="#d8c69a";g.beginPath();g.moveTo(-220,20);g.quadraticCurveTo(-110,-24,0,10);g.quadraticCurveTo(110,-24,220,20);g.lineTo(220,110);g.quadraticCurveTo(110,74,0,106);g.quadraticCurveTo(-110,74,-220,110);g.closePath();g.fill();g.strokeStyle="#6b4d26";g.lineWidth=3;g.stroke();
   g.strokeStyle="rgba(74,52,24,.5)";g.lineWidth=1.5;for(let i=0;i<7;i++){g.beginPath();g.moveTo(-200,28+i*10);g.quadraticCurveTo(-100,-4+i*10,-16,20+i*10);g.stroke();g.beginPath();g.moveTo(16,20+i*10);g.quadraticCurveTo(100,-4+i*10,200,28+i*10);g.stroke();}
   const p=(st*1.4)%1,an=p*Math.PI;g.fillStyle="#e8d9b5";g.beginPath();g.moveTo(0,10);g.quadraticCurveTo(Math.cos(an)*200,-50-Math.sin(an)*80,Math.cos(an)*210,20-Math.sin(an)*30);g.lineTo(Math.cos(an)*210,110-Math.sin(an)*30);g.quadraticCurveTo(Math.cos(an)*100,74-Math.sin(an)*50,0,106);g.closePath();g.fill();g.strokeStyle="rgba(74,52,24,.6)";g.lineWidth=1.5;g.stroke();g.restore();
   g.fillStyle="#171009";g.fillRect(836,240,10,180);g.beginPath();g.moveTo(790,240);g.lineTo(892,240);g.lineTo(868,190);g.lineTo(814,190);g.closePath();g.fill();glow(g,841,250,90,"rgba(240,196,106,.8)",.8);});
  layer(g,1-a,g=>{bgGrad(g,"#5a4428","#1c140c");glow(g,480,200,420,"rgba(240,220,170,.45)",.8);
   g.save();g.translate(480,180+Math.sin(t*2)*4);g.fillStyle="#e3d2a8";g.beginPath();g.moveTo(-300,-40);for(let i=0;i<=10;i++)g.lineTo(-300+i*60,-40+Math.sin(t*3+i)*5);for(let i=10;i>=0;i--)g.lineTo(-300+i*60,40+Math.sin(t*3+i)*5);g.closePath();g.fill();g.strokeStyle=INK;g.lineWidth=5;g.beginPath();g.moveTo(-300,-60);g.lineTo(-300,340);g.moveTo(300,-60);g.lineTo(300,340);g.stroke();g.fillStyle="#241a0d";g.font='44px "Rozha One", serif';g.textAlign="center";g.fillText("इंक़लाब ज़िंदाबाद",0,16);g.restore();
   ground(g,600);
   for(let i=0;i<9;i++){const x=60+i*110+Math.sin(t+i)*4;const up=Math.max(0,Math.sin(t*3+i*.9));bust(g,x,640,.9);g.strokeStyle=INK;g.lineWidth=9;g.lineCap="round";g.beginPath();g.moveTo(x+30,622);g.lineTo(x+40,540-up*30);g.stroke();g.fillStyle=INK;g.beginPath();g.arc(x+40,530-up*30,11,0,7);g.fill();}});
  motes(g,t,18,57);}},
 photos:{bg(g){bgGrad(g,"#3a2c18","#140e08");},fg(g,t,st){
  const z=1+st*.05;g.save();g.translate(480,330);g.scale(z,z);g.translate(-480,-330);
  g.fillStyle="rgba(20,14,8,.25)";for(let x=0;x<W;x+=40)g.fillRect(x,-6,14,H+12);
  const fr=[[170,190,150,190,0],[400,170,170,130,1],[640,200,130,170,2],[820,170,120,150,3],[260,450,170,130,4],[500,330,130,150,5],[740,450,170,120,6]];
  fr.forEach(f=>{const[x,y,w,h,k]=f;g.save();g.translate(x,y);g.rotate((sr(k)-.5)*.08);g.fillStyle="#241608";g.fillRect(-w/2-12,-h/2-12,w+24,h+24);g.strokeStyle="#8a5f22";g.lineWidth=3;g.strokeRect(-w/2-12,-h/2-12,w+24,h+24);g.fillStyle="#b89a64";g.fillRect(-w/2,-h/2,w,h);
   g.save();g.beginPath();g.rect(-w/2,-h/2,w,h);g.clip();
   if(k%3===0)bust(g,0,h/2-20,h/260,"#2c2013");else if(k%3===1){for(let i=0;i<3;i++)fig(g,-w/3+i*w/3,h/2-6,h/260,i,i===1);}else dome(g,0,h/2,h/420);
   g.restore();g.strokeStyle="#4a3418";g.lineWidth=2;g.beginPath();g.moveTo(0,-h/2-12);g.lineTo(0,-h/2-40);g.stroke();g.restore();});
  g.restore();
  const d=clamp((st-2)/1,0,1);if(d>0){glow(g,500,330,260,"rgba(240,196,106,.7)",d*.7);for(let i=0;i<8;i++){const p=clamp((st-2)*.5-sr(i)*.4,0,1);birdShape(g,500+Math.cos(i*.8)*p*360,330-p*220+Math.sin(i)*40*p,.8+p*.8,t*8+i);}}
  motes(g,t,14,61);}},
 dream:{bg(g,t){bgGrad(g,"#a68a58","#4a3a20");glow(g,480,260,480,"rgba(240,220,170,.6)",.8);g.save();g.strokeStyle="rgba(240,220,170,.2)";g.lineWidth=22;for(let i=0;i<10;i++){const a=t*.06+i/10*6.28;g.beginPath();g.moveTo(480,260);g.lineTo(480+Math.cos(a)*800,260+Math.sin(a)*800);g.stroke();}g.restore();g.fillStyle="rgba(232,217,181,.22)";for(let i=0;i<4;i++){g.beginPath();g.ellipse(((t*12+i*280)%(W+300))-150,110+i*50,140,18,0,0,7);g.fill();}},fg(g,t,st){
  g.fillStyle="#3a2c18";g.beginPath();g.moveTo(-6,H+6);g.lineTo(-6,590);g.quadraticCurveTo(480,540,966,590);g.lineTo(966,H+6);g.closePath();g.fill();
  layer(g,win(st,-1,3.3,.4),g=>{const x=lerp(260,520,st/3.5);fig(g,x,620,1.3,t*3.6,false);fig(g,x+92,620,.85,t*3.6+1,false);g.strokeStyle=INK;g.lineWidth=6;g.lineCap="round";g.beginPath();g.moveTo(x+12,620-50*1.3);g.quadraticCurveTo(x+50,560,x+82,620-48*.85);g.stroke();for(let i=0;i<6;i++)birdShape(g,(150+i*130+t*28)%W,140+sr(i)*120,1,t*7+i);});
  layer(g,win(st,3.3,7,.4),g=>{g.fillStyle="#241608";g.fillRect(420,560,120,60);g.strokeStyle="#8a5f22";g.lineWidth=3;g.strokeRect(420,560,120,60);
   pose(g,480,560,1.3,[-14,-46],[26,-104+Math.sin(t*5)*4]);
   g.strokeStyle="rgba(232,217,181,.75)";g.lineWidth=3;for(let i=0;i<4;i++){const r=((st*60+i*45)%180)+20;g.globalAlpha=1-r/200;g.beginPath();g.arc(480,440,r,-1.2,-.1);g.stroke();g.beginPath();g.arc(480,440,r,Math.PI+.1,Math.PI+1.2);g.stroke();}g.globalAlpha=1;
   for(let i=0;i<8;i++){const x=80+i*112;if(Math.abs(x-480)<90)continue;bust(g,x,690,.7);}});
  layer(g,win(st,7,12,.4),g=>{const x=lerp(220,520,(st-7)/3.5);fig(g,x,620,1.2,t*5.5,false);const kx=x+260,ky=180+Math.sin(t*1.4)*20;g.strokeStyle="rgba(232,217,181,.8)";g.lineWidth=1.5;g.beginPath();g.moveTo(x+14,620-66*1.2);g.quadraticCurveTo((x+kx)/2,ky+180,kx,ky+30);g.stroke();kite(g,kx,ky,1.6,t);for(let i=0;i<4;i++)birdShape(g,(500+i*120+t*30)%W,120+sr(i+9)*80,.9,t*7+i);});
  motes(g,t,16,63);}},
 question:{bg(g){bgGrad(g,"#3a2c18","#100b06");},fg(g,t,st){
  const a=1-clamp((st-2.2)/.6,0,1);
  layer(g,a,g=>{glow(g,480,300,320,"rgba(240,196,106,.3)",.8);g.save();g.translate(480,290);
   g.save();g.translate(0,140);g.rotate(Math.sin(t*3)*.3);g.strokeStyle="#8a5f22";g.lineWidth=5;g.beginPath();g.moveTo(0,0);g.lineTo(0,170);g.stroke();g.fillStyle="#d9a441";g.beginPath();g.arc(0,180,28,0,7);g.fill();g.restore();
   g.fillStyle="#241608";g.beginPath();g.arc(0,0,150,0,7);g.fill();g.strokeStyle="#8a5f22";g.lineWidth=8;g.stroke();g.fillStyle="#e3d2a8";g.beginPath();g.arc(0,0,130,0,7);g.fill();
   for(let i=0;i<12;i++){g.save();g.rotate(i/12*6.28);g.fillStyle="#241a0d";g.fillRect(-3,-122,6,i%3?12:22);g.restore();}
   const mn=st*2.4,hr=st*.2;g.strokeStyle="#241a0d";g.lineCap="round";g.lineWidth=8;g.beginPath();g.moveTo(0,0);g.lineTo(Math.sin(hr)*70,-Math.cos(hr)*70);g.stroke();g.lineWidth=5;g.beginPath();g.moveTo(0,0);g.lineTo(Math.sin(mn)*108,-Math.cos(mn)*108);g.stroke();g.fillStyle="#c2452a";g.beginPath();g.arc(0,0,8,0,7);g.fill();
   g.restore();});
  layer(g,1-a,g=>{glow(g,250,240,300,"rgba(240,220,170,.5)",.8);g.fillStyle="#3a2c18";dome(g,250,560,.8);g.strokeStyle=INK;g.lineWidth=6;g.beginPath();g.moveTo(250,380);g.lineTo(250,120);g.stroke();waveFlag(g,253,120,150,88,t*3);
   ground(g,560,"#1c140c");
   glow(g,720,470,170,"rgba(159,196,201,.2)",.6);fig(g,720,560,1.1,0,false);
   const q=clamp((st-3)/1.5,0,1);g.save();g.beginPath();g.rect(380,0,200*q+.1,H);g.clip();qmark(g,480,300,2.2,"rgba(232,217,181,.85)",10);g.restore();});
  motes(g,t,12,65);}},
 walls:{bg(g){bgGrad(g,"#3a2c18","#140e08");},fg(g,t,st){
  layer(g,win(st,-1,7,.4),g=>{glow(g,480,240,420,"rgba(240,220,170,.35)",.8);ground(g,600);
   const fx=lerp(160,330,clamp(st/5,0,1));fig(g,fx,610,1.1,st<5?t*4:0,false);
   for(let i=0;i<3;i++){const r=eo(clamp((st-.6-i*1.4)/1.4,0,1));const wx=470+i*150,wh=r*(260+i*60);bricks(g,wx,600-wh,110,wh,["#5a4020","#4a3418","#3a2c18"][i],"#1c140c");}});
  layer(g,win(st,7,9.5,.35),g=>{glow(g,480,200,400,"rgba(240,220,170,.3)",.8);ground(g,600);
   for(let r=0;r<3;r++)for(let i=0;i<9;i++){const x=70+i*102+(r%2)*50,y=380+r*90;bust(g,x,y,.85,["#3a2c18","#2c2013","#1c140c"][r]);g.fillStyle="#14100a";g.fillRect(x-42,y+30,84,10);}
   pose(g,480,700,1.2,[-12,-46],[12,-46]);});
  layer(g,win(st,9.5,14,.4),g=>{glow(g,480,300,380,"rgba(159,196,201,.22)",.7);
   g.save();g.translate(480,420);g.fillStyle=INK;g.beginPath();g.arc(0,-170,80,0,7);g.fill();g.fillRect(-26,-100,52,40);g.beginPath();g.ellipse(0,60,190,170,0,Math.PI,0);g.fill();g.fillRect(-190,58,380,300);
   g.save();g.beginPath();g.ellipse(0,60,170,150,0,Math.PI,0);g.rect(-170,58,340,300);g.clip();const r=eo(clamp((st-10)/2.4,0,1));bricks(g,-150,330-r*300,300,r*300,"#5a3a1a","#14100a");g.restore();
   g.restore();});
  motes(g,t,12,67);}},
 silence:{bg(g){bgGrad(g,"#2a2013","#0c0906");},fg(g,t,st){
  layer(g,win(st,-1,2.8,.35),g=>{ground(g,600,"#1c140c");const press=clamp((st-1.2)/1.2,0,1);
   g.save();g.translate(480,600);g.scale(1,1-press*.2);fig(g,0,0,1.3,0,false);g.restore();
   g.strokeStyle="rgba(232,217,181,.7)";g.lineWidth=3;for(let i=0;i<4;i++){const r=((st*70+i*40)%160)+30;g.globalAlpha=(1-r/190)*(1-press);g.beginPath();g.arc(480,470,r,-2.6,-.5);g.stroke();}g.globalAlpha=1;
   const hy=lerp(-300,350+press*30,eo(clamp(st/1.4,0,1)));g.save();g.translate(480,hy);g.fillStyle="#0a0806";g.fillRect(-60,-400,120,400);g.beginPath();g.ellipse(0,20,110,60,0,0,7);g.fill();for(let i=0;i<4;i++){g.beginPath();g.ellipse(-75+i*50,70,20,44,0,0,7);g.fill();}g.beginPath();g.ellipse(-120,10,20,46,-.6,0,7);g.fill();g.restore();});
  layer(g,win(st,2.8,7,.35),g=>{ground(g,600,"#1c140c");fig(g,300,600,1.2,0,false);
   const sh=clamp((st-3.8)/2,0,1),r=lerp(170,26,eo(sh)),bx=lerp(560,400,eo(sh)),by=lerp(280,420,eo(sh));
   g.strokeStyle="rgba(232,217,181,.5)";g.lineWidth=2;for(let i=0;i<3;i++){g.beginPath();g.arc(lerp(320,bx,(i+1)/4),lerp(470,by,(i+1)/4),5+i*4,0,7);g.stroke();}
   glow(g,bx,by,r*1.6,"rgba(240,196,106,.5)",.7);g.fillStyle="rgba(232,217,181,.18)";g.beginPath();g.arc(bx,by,r,0,7);g.fill();g.strokeStyle="#e8d9b5";g.lineWidth=3;g.stroke();
   g.save();g.beginPath();g.arc(bx,by,r-4,0,7);g.clip();g.translate(bx,by);g.scale(r/170,r/170);kite(g,40,-40,2,t);for(let i=0;i<5;i++){g.fillStyle="#f0c46a";g.beginPath();g.arc(-90+i*40,-90+sr(i)*60,5,0,7);g.fill();}birdShape(g,-60,40,2,t*6);g.restore();});
  motes(g,t,12,69);}},
 puppet:{bg(g){bgGrad(g,"#3a2c18","#0e0a06");glow(g,480,200,360,"rgba(240,196,106,.3)",.8);},fg(g,t,st){
  const cy=150+Math.sin(t*2)*8,cr=Math.sin(t*1.6)*.15;
  const bp=(lx,ly)=>[480+lx*Math.cos(cr)-ly*Math.sin(cr),cy+lx*Math.sin(cr)+ly*Math.cos(cr)];
  const px=480,py=560,j=k=>Math.sin(t*4+k)*18;
  const head=[px,py-260],hand=[px-90+j(1),py-180+j(2)],hand2=[px+90+j(3),py-180-j(1)],foot=[px-40,py+j(4)*.4],foot2=[px+40,py-j(4)*.4];
  g.strokeStyle="rgba(232,217,181,.55)";g.lineWidth=1.5;[[bp(-150,0),hand],[bp(150,0),hand2],[bp(0,8),head],[bp(-60,8),foot],[bp(60,8),foot2]].forEach(s=>{g.beginPath();g.moveTo(s[0][0],s[0][1]);g.lineTo(s[1][0],s[1][1]);g.stroke();});
  g.save();g.translate(480,cy);g.rotate(cr);g.fillStyle="#241608";g.fillRect(-150,-8,300,16);g.fillRect(-8,-60,16,120);g.fillStyle="#0a0806";g.beginPath();g.ellipse(0,-90,70,40,0,0,7);g.fill();g.fillRect(-40,-300,80,210);g.restore();
  g.strokeStyle=INK;g.lineWidth=12;g.lineCap="round";const sh=[px,py-215],hip=[px,py-110];
  g.beginPath();g.moveTo(sh[0],sh[1]);g.lineTo(hip[0],hip[1]);g.moveTo(sh[0],sh[1]+10);g.lineTo(hand[0],hand[1]);g.moveTo(sh[0],sh[1]+10);g.lineTo(hand2[0],hand2[1]);g.moveTo(hip[0],hip[1]);g.lineTo(foot[0],foot[1]);g.moveTo(hip[0],hip[1]);g.lineTo(foot2[0],foot2[1]);g.stroke();
  g.fillStyle=INK;g.beginPath();g.arc(head[0],head[1],26,0,7);g.fill();
  const signs=["ऐसे जियो","यह बनो","इनसे मिलो","यह कहो"],pos=[[170,300,-.12],[790,300,.1],[170,470,.08],[790,470,-.1]];
  signs.forEach((s,i)=>{const a=clamp((st-.4-i*1.3)*3,0,1);if(a<=0)return;const[x,y,r]=pos[i];g.save();g.translate(x,y);g.rotate(r);g.scale(.6+.4*eo(a),.6+.4*eo(a));g.globalAlpha=a;g.strokeStyle="#3a2c18";g.lineWidth=5;g.beginPath();g.moveTo(0,30);g.lineTo(0,140);g.stroke();g.fillStyle="#e3d2a8";g.fillRect(-90,-30,180,60);g.strokeStyle="#3a2a12";g.lineWidth=3;g.strokeRect(-90,-30,180,60);g.fillStyle="#241a0d";g.font='26px "Tiro Devanagari Hindi", serif';g.textAlign="center";g.fillText(s,0,10);g.restore();});
  motes(g,t,12,71);}},
 chains:{bg(g){bgGrad(g,"#1c150c","#0a0806");glow(g,720,150,200,"rgba(159,196,201,.35)",.7);g.fillStyle="#cbb98e";g.beginPath();g.arc(720,150,34,0,7);g.fill();},fg(g,t,st){
  ground(g,600,"#140e08");
  g.fillStyle="#241608";g.beginPath();g.ellipse(400,610,120,40,0,Math.PI,0);g.fill();
  const up=clamp((st-7)/1.5,0,1);
  glow(g,400,480,220,"rgba(240,196,106,.5)",up*.6);
  if(up<1){g.save();g.globalAlpha=1-up;g.translate(400,600);g.fillStyle=INK;g.strokeStyle=INK;g.lineCap="round";g.lineJoin="round";g.lineWidth=9;g.beginPath();g.arc(16,-118,15,0,7);g.fill();g.beginPath();g.moveTo(0,-100);g.quadraticCurveTo(-6,-60,0,-30);g.stroke();g.beginPath();g.moveTo(0,-30);g.lineTo(46,-30);g.lineTo(52,25);g.moveTo(0,-30);g.lineTo(38,-20);g.lineTo(40,25);g.stroke();g.beginPath();g.moveTo(2,-88);g.lineTo(40,-58);g.lineTo(22,-106);g.stroke();g.restore();}
  if(up>0){g.save();g.globalAlpha=up;pose(g,420,600,1.25,[-40,-112],[40,-112]);g.restore();}
  const qa=win(st,1.8,6.6,.5);if(qa>0){g.globalAlpha=qa*.7;qmark(g,470,380,1,"#e8d9b5",6);g.globalAlpha=1;}
  const br=clamp((st-4.5)/1.2,0,1);g.strokeStyle="#5a4322";g.lineWidth=6;
  for(let i=0;i<10;i++){const x=100+i*38,y=618+Math.sin(i*.8)*3;let dx=0,dy=0,rot=i%2?0:.5;let al=1;if(i>=6&&br>0){const k=i-5;dx=k*br*30;dy=-Math.sin(br*Math.PI)*12*k+br*10;rot+=br*k;al=1-br*.7;}g.save();g.globalAlpha=al;g.translate(x+dx,y+dy);g.rotate(rot);g.beginPath();g.ellipse(0,0,18,9,0,0,7);g.stroke();g.restore();}
  g.fillStyle="#241608";g.fillRect(74,540,20,84);
  for(let i=0;i<6;i++){const p=clamp((st-7.2)*.35-sr(i)*.3,0,1);if(p>0)birdShape(g,420+Math.sin(i*2.3)*p*300,440-p*340,1+p,t*8+i);}
  motes(g,t,12,73);}},
 ask:{bg(g,t){bgGrad(g,"#4a3a24","#1c140c");glow(g,620,220,420,"rgba(240,220,170,.35)",.8);},fg(g,t,st){
  const pan=lerp(0,-120,eo(clamp(st/7.5,0,1)));g.save();g.translate(pan,0);
  for(let i=0;i<7;i++){const x=i*180-40,h=180+sr(i)*80;g.fillStyle="#241608";g.fillRect(x,560-h,160,h);g.beginPath();g.moveTo(x-10,560-h);g.lineTo(x+80,560-h-50);g.lineTo(x+170,560-h);g.closePath();g.fill();g.fillStyle="rgba(202,167,106,.5)";g.fillRect(x+30,600-h,30,40);g.fillRect(x+100,600-h,30,40);}
  ground(g,560,"#1c140c");
  for(let i=0;i<6;i++)fig(g,440+i*110,630,1.05,0,false);
  pose(g,220,630,1.15,[-12,-46],[30,-78]);g.save();g.translate(262,538);g.rotate(-.2);g.fillStyle="#e3d2a8";g.fillRect(-18,-24,36,46);g.strokeStyle="#3a2a12";g.lineWidth=2;g.strokeRect(-18,-24,36,46);g.restore();
  g.restore();motes(g,t,14,75);}},
 faces:{bg(g){bgGrad(g,"#261d11","#0e0a06");},fg(g,t,st){
  for(let i=0;i<4;i++){const x=150+i*220,y=320+Math.sin(t*.6+i)*4;const k=clamp((st-.6-i*.8)/.6,0,1);g.save();g.translate(x,y);
   g.fillStyle="#d8c69a";g.beginPath();g.ellipse(0,0,90,120,0,0,7);g.fill();g.strokeStyle="#8a5f22";g.lineWidth=5;g.stroke();
   g.save();g.beginPath();g.ellipse(0,0,80,110,0,0,7);g.clip();g.strokeStyle="rgba(74,52,24,.25)";g.lineWidth=1.5;for(let q=-12;q<12;q++){g.beginPath();g.moveTo(q*10-30,-120);g.lineTo(q*10+30,120);g.stroke();}
   bust(g,0,70,1,"#6b4d26");g.fillStyle="#241a0d";g.beginPath();g.arc(-11,4,3,0,7);g.arc(11,4,3,0,7);g.fill();
   g.fillStyle="#0a0806";g.fillRect(-32*k,18,64*k,12);
   g.fillStyle=`rgba(8,6,4,${k*.5})`;g.fillRect(-90,-120,180,240);g.restore();
   g.restore();}
  g.fillStyle="rgba(10,8,6,.3)";g.fillRect(-6,-6,W+12,H+12);motes(g,t,12,77);}},
 unheard:{bg(g){bgGrad(g,"#3a2c18","#140e08");glow(g,240,260,300,"rgba(240,196,106,.4)",.7);},fg(g,t,st){
  ground(g,600,"#1c140c");
  pose(g,200,610,1.3,[-12,-46],[30,-100+Math.sin(t*4)*6]);
  const gl=["क","ख","ग","श","ब","द","म","ह"];g.font='30px "Tiro Devanagari Hindi", serif';g.textAlign="center";g.fillStyle="#e8d9b5";
  for(let i=0;i<12;i++){const p=((st*.35+i/12)%1);g.globalAlpha=Math.sin(p*Math.PI)*.8;g.fillText(gl[i%8],250+p*560,470-Math.sin(p*3+i)*60-p*80);}g.globalAlpha=1;
  for(let r=0;r<2;r++)for(let i=0;i<4;i++){const x=560+i*100-r*30,y=560+r*70,s=.8+r*.2;g.save();g.translate(x,y);g.scale(s,s);g.strokeStyle="#241608";g.lineWidth=7;g.lineCap="round";g.beginPath();g.moveTo(-26,0);g.lineTo(-26,-80);g.moveTo(-26,-40);g.lineTo(26,-40);g.lineTo(26,0);g.stroke();g.restore();}
  motes(g,t,14,79);}},
 unreach:{bg(g,t){bgGrad(g,"#241c12","#0a0806");g.fillStyle="#e8d9b5";for(let i=0;i<40;i++){g.globalAlpha=.3+.5*Math.abs(Math.sin(t*1.5+i));g.fillRect(sr(i)*W,sr(i+40)*360,2,2);}g.globalAlpha=1;glow(g,720,170,160,"rgba(240,196,106,.6)",.8);},fg(g,t,st){
  g.fillStyle="#f0c46a";g.save();g.translate(720,170);g.rotate(t*.3);g.beginPath();for(let i=0;i<10;i++){const r=i%2?12:30;g.lineTo(Math.cos(i/10*6.28)*r,Math.sin(i/10*6.28)*r);}g.closePath();g.fill();g.restore();
  ground(g,600,"#140e08");
  const reach=clamp((st-1)/2,0,1);pose(g,340,610,1.3,[-12,-46],[lerp(12,64,reach),lerp(-46,-110,reach)]);
  g.fillStyle="#0e0a06";g.fillRect(400,150,10,460);for(let i=0;i<7;i++){g.fillRect(430+i*50,200,10,410);g.beginPath();g.moveTo(425+i*50,200);g.lineTo(435+i*50,175);g.lineTo(445+i*50,200);g.fill();}g.fillRect(400,260,350,12);g.fillRect(400,520,350,12);
  g.save();g.translate(585,400);g.strokeStyle="#0e0a06";g.lineWidth=8;g.beginPath();g.arc(0,-22,16,Math.PI,0);g.stroke();g.fillStyle="#3a2c18";g.fillRect(-22,-22,44,40);g.strokeStyle="#8a5f22";g.lineWidth=2;g.strokeRect(-22,-22,44,40);g.restore();
  motes(g,t,12,83);}},
 choice:{bg(g){bgGrad(g,"#4a3a24","#1c140c");glow(g,480,250,420,"rgba(240,220,170,.3)",.8);},fg(g,t,st){
  ground(g,580,"#241a0d");
  const lo=clamp((st-1.2)/1.5,0,1);
  g.save();g.globalAlpha=.55*lo;bust(g,600,470,3.2,"#0a0806");g.restore();
  g.save();g.globalAlpha=.6*lo;g.strokeStyle="#0a0806";g.lineWidth=40;g.lineCap="round";g.beginPath();g.moveTo(700,470);g.lineTo(lerp(700,880,lo),lerp(470,400,lo));g.stroke();g.restore();
  g.fillStyle="#241608";g.fillRect(474,330,12,260);
  const sign=(y,dir,txt,on)=>{g.save();g.translate(480,y);g.fillStyle=on?"#e3d2a8":"#8a7148";g.beginPath();g.moveTo(0,-22);g.lineTo(dir*150,-22);g.lineTo(dir*180,0);g.lineTo(dir*150,22);g.lineTo(0,22);g.closePath();g.fill();g.strokeStyle="#3a2a12";g.lineWidth=3;g.stroke();g.fillStyle="#241a0d";g.font='22px "Tiro Devanagari Hindi", serif';g.textAlign="center";g.fillText(txt,dir*86,8);g.restore();};
  sign(370,-1,"मेरी राह",lo<.5);sign(430,1,"उनकी राह",lo>=.5);
  if(lo>.6){const c=clamp((lo-.6)/.4,0,1);g.strokeStyle="rgba(184,55,31,.9)";g.lineWidth=5;g.beginPath();g.moveTo(330,352);g.lineTo(lerp(330,450,c),lerp(352,388,c));g.stroke();}
  pose(g,360,640,1.2,[-40,-80],[12,-46]);
  motes(g,t,12,85);}},
 door:{bg(g){bgGrad(g,"#3a2c18","#120c06");},fg(g,t,st){
  g.fillStyle="#f0dca8";g.fillRect(660,220,150,340);glow(g,735,390,300,"rgba(255,236,190,.6)",.8);
  g.strokeStyle="#8a5f22";g.lineWidth=8;g.strokeRect(656,216,158,348);
  g.fillStyle="#241608";g.beginPath();g.moveTo(660,220);g.lineTo(610,200);g.lineTo(610,590);g.lineTo(660,560);g.closePath();g.fill();
  ground(g,560,"#1c140c");
  g.fillStyle="rgba(240,220,170,.14)";g.beginPath();g.moveTo(660,560);g.lineTo(810,560);g.lineTo(700,H);g.lineTo(300,H);g.closePath();g.fill();
  g.strokeStyle="#8a5f22";g.lineWidth=3;g.beginPath();g.moveTo(300,-6);g.lineTo(300,90);g.stroke();g.fillStyle="#d9a441";g.beginPath();g.moveTo(230,104);g.quadraticCurveTo(300,170,370,104);g.closePath();g.fill();for(let i=0;i<5;i++){const x=240+i*30;glow(g,x,96,30,"rgba(240,196,106,.8)",.6+.2*Math.sin(t*8+i));g.fillStyle="#f0c46a";g.fillRect(x-2,90,4,14);}
  for(let i=0;i<3;i++){g.fillStyle="#241608";g.fillRect(70+i*170,230,120,90);g.strokeStyle="#d9a441";g.lineWidth=3;g.strokeRect(70+i*170,230,120,90);g.fillStyle="#6b4d26";g.fillRect(80+i*170,240,100,70);}
  g.fillStyle="#4a3418";g.fillRect(90,470,180,90);g.strokeStyle="#d9a441";g.lineWidth=3;g.strokeRect(90,470,180,90);g.beginPath();g.moveTo(90,500);g.lineTo(270,500);g.stroke();g.fillStyle="#d9a441";g.fillRect(172,494,16,16);
  const s=Math.sin(clamp(st/5.5,0,1)*Math.PI);const fx=lerp(440,560,s*.8);pose(g,fx,600,1.25,[-12,-46],[lerp(12,40,s),lerp(-46,-64,s)]);
  motes(g,t,16,89);}},
 window:{bg(g){bgGrad(g,"#1c140c","#0a0806");},fg(g,t,st){
  g.save();g.beginPath();g.rect(240,90,480,440);g.clip();bgGrad(g,"#a68a58","#5a4428");glow(g,560,200,300,"rgba(240,220,170,.7)",.8);
  for(let i=0;i<8;i++)birdShape(g,((t*40+i*120)%560)+200,140+sr(i)*240+Math.sin(t*1.5+i)*12,1+sr(i)*.5,t*7+i);
  g.fillStyle="#3a2c18";g.beginPath();g.moveTo(240,530);g.quadraticCurveTo(480,440,720,500);g.lineTo(720,530);g.closePath();g.fill();
  g.fillStyle="rgba(232,217,181,.35)";for(let i=0;i<14;i++){const y=(sr(i)*440+t*(20+sr(i+3)*30))%440;g.fillRect(250+sr(i+7)*460,90+y,2,10);}
  g.restore();
  g.strokeStyle="#241608";g.lineWidth=16;g.strokeRect(240,90,480,440);g.lineWidth=10;g.beginPath();g.moveTo(480,90);g.lineTo(480,530);g.moveTo(240,310);g.lineTo(720,310);g.stroke();
  g.fillStyle="#140e08";g.fillRect(200,530,560,24);
  bust(g,430,720,1.6,"#0a0806");g.strokeStyle="#0a0806";g.lineWidth=18;g.lineCap="round";g.beginPath();g.moveTo(510,660);g.lineTo(580,420);g.stroke();g.fillStyle="#0a0806";g.beginPath();g.ellipse(584,404,18,26,.2,0,7);g.fill();
  glow(g,584,404,60,"rgba(240,220,170,.3)",.4+.2*Math.sin(t*2));
  motes(g,t,12,97);}},
 pause:{bg(g,t){bgGrad(g,"#7a5c2e","#2a1e10");glow(g,700,380,300,"rgba(240,196,106,.6)",.8);g.fillStyle="#f0c46a";g.beginPath();g.arc(700,380,50,0,7);g.fill();},fg(g,t,st){
  g.fillStyle="#2a1e10";g.beginPath();g.moveTo(-6,H+6);g.lineTo(-6,520);g.quadraticCurveTo(480,470,966,520);g.lineTo(966,H+6);g.closePath();g.fill();
  const walk=clamp(st/2,0,1),fx=lerp(160,460,eo(walk));
  for(let i=0;i<8;i++){const px=160+i*40;if(px<fx-20){g.fillStyle="rgba(20,14,8,.5)";g.beginPath();g.ellipse(px,572+(i%2)*8,8,4,0,0,7);g.fill();}}
  fig(g,fx,570,1.3,walk<1?t*4.5:0,false);
  if(st>3){g.strokeStyle="rgba(232,217,181,.5)";g.lineWidth=2;for(let i=0;i<3;i++){const r=((st-3)*30+i*30)%90;g.globalAlpha=1-r/90;g.beginPath();g.arc(fx,450,10+r,0,7);g.stroke();}g.globalAlpha=1;}
  g.strokeStyle="#1c140c";g.lineWidth=2;for(let i=0;i<60;i++){const x=sr(i)*W,y=560+sr(i+60)*140;g.beginPath();g.moveTo(x,y);g.quadraticCurveTo(x+Math.sin(t*2+i)*6,y-14,x+Math.sin(t*2+i)*10,y-26);g.stroke();}
  motes(g,t,14,101);}},
 shelves:{bg(g){bgGrad(g,"#1c140c","#080604");},fg(g,t,st){
  const pan=lerp(40,-40,st/7);g.save();g.translate(pan,0);
  for(let s=0;s<3;s++){const x=60+s*320;g.fillStyle="#241608";g.fillRect(x,60,240,560);for(let r=0;r<5;r++){const y=100+r*104;g.fillStyle="#140e08";g.fillRect(x+10,y,220,86);for(let b=0;b<12;b++){const bw=12+sr(s*60+r*12+b)*6,bh=60+sr(b+r)*24;g.fillStyle=["#4a3418","#3a2c18","#5a4020","#2c2013"][(b+r+s)%4];g.fillRect(x+14+b*18,y+86-bh,bw,bh);}}}
  g.restore();
  ground(g,620,"#0a0806");
  const fx=lerp(260,420,st/7),lx=fx+48,ly=560;
  pose(g,fx,620,1.2,[-12,-46],[38,-56]);lantern(g,lx,ly);
  if(st>3.4){for(let i=0;i<7;i++){const p=clamp((st-3.4)*.3-sr(i)*.3,0,1);if(p<=0)continue;g.save();g.translate(lerp(560,960,p)+Math.sin(i)*60,lerp(320,80,p)+sr(i)*120);g.rotate(t*2+i);g.globalAlpha=1-p;g.fillStyle="#e8d9b5";g.fillRect(-18,-24,36,48);g.restore();}}
  darkAround(g,lx,ly,60,620,.8);
  motes(g,t,12,103);}},
 calendar:{bg(g){bgGrad(g,"#3a2c18","#140e08");glow(g,480,300,360,"rgba(240,220,170,.3)",.8);},fg(g,t,st){
  const sl=["जय हिन्द","इंक़लाब","वन्दे मातरम्"];sl.forEach((s,i)=>{g.save();g.translate(150+i*330,170+(i%2)*40);g.rotate((sr(i)-.5)*.2);g.globalAlpha=.5;g.fillStyle="#cbb98e";g.fillRect(-100,-50,200,100);g.fillStyle="#241a0d";g.font='30px "Rozha One", serif';g.textAlign="center";g.fillText(s,0,10);g.fillStyle="#3a2c18";g.beginPath();g.moveTo(40,-50);g.lineTo(100,-50);g.lineTo(100,50);g.lineTo(70,20);g.closePath();g.fill();g.restore();});
  g.save();g.translate(480,400);g.fillStyle="#241608";g.fillRect(-120,-150,240,20);g.fillStyle="#e3d2a8";g.fillRect(-110,-130,220,260);g.strokeStyle="#3a2a12";g.lineWidth=2;g.strokeRect(-110,-130,220,260);
  const days=["१५","२६","३०","९","२","८"],mon=["अगस्त","जनवरी","जनवरी","अगस्त","अक्टूबर","अगस्त"];const k=Math.floor(st*2.2)%6;
  g.fillStyle="#b8371f";g.font='24px "Tiro Devanagari Hindi", serif';g.textAlign="center";g.fillText(mon[k],0,-86);g.fillStyle="#241a0d";g.font='120px "Rozha One", serif';g.fillText(days[k],0,60);
  const p=(st*2.2)%1;g.save();g.translate(p*260,-130-p*120+p*p*400);g.rotate(p*2.4);g.globalAlpha=1-p;g.fillStyle="#e3d2a8";g.fillRect(-110,0,220,260);g.strokeStyle="#3a2a12";g.strokeRect(-110,0,220,260);g.restore();
  g.restore();
  motes(g,t,14,107);}},
 path:{bg(g){bgGrad(g,"#6a5030","#241a0d");glow(g,480,200,460,"rgba(240,220,170,.45)",.8);},fg(g,t,st){
  layer(g,win(st,-1,4.3,.4),g=>{ground(g,360,"#3a2c18");
   const lit=clamp((st-1.2)/1.6,0,1);
   g.fillStyle="#1c140c";g.beginPath();g.moveTo(380,H+6);g.lineTo(470,470);g.lineTo(490,470);g.lineTo(580,H+6);g.closePath();g.fill();
   g.beginPath();g.moveTo(470,470);g.lineTo(250,360);g.lineTo(272,360);g.lineTo(490,470);g.closePath();g.fill();
   g.fillStyle=`rgba(240,196,106,${.25+lit*.6})`;g.beginPath();g.moveTo(470,470);g.lineTo(690,360);g.lineTo(712,360);g.lineTo(490,470);g.closePath();g.fill();glow(g,640,390,200,"rgba(240,196,106,.6)",lit*.7);
   const p=clamp((st-.5)/3.5,0,1);const fx=p<.5?480:lerp(480,620,(p-.5)*2),fy=p<.5?lerp(690,470,p*2):lerp(470,410,(p-.5)*2),fs=p<.5?lerp(1.3,.7,p*2):lerp(.7,.45,(p-.5)*2);
   fig(g,fx,fy,fs,t*4,false);});
  layer(g,win(st,4.3,9,.4),g=>{g.fillStyle="#2a1e10";g.beginPath();g.moveTo(-6,H+6);g.lineTo(-6,600);g.quadraticCurveTo(480,430,966,600);g.lineTo(966,H+6);g.closePath();g.fill();
   glow(g,480,330,300,"rgba(240,196,106,.5)",.7);
   const rise=clamp((st-4.8)/.8,0,1);pose(g,480,525,1.4,[-14,-46],[lerp(14,30,rise),lerp(-46,-112,rise)]);
   g.strokeStyle="rgba(232,217,181,.7)";g.lineWidth=3;for(let i=0;i<5;i++){const r=((st*80+i*50)%250)+30;g.globalAlpha=(1-r/280)*rise;g.beginPath();g.arc(480,525-130*1.4,r,0,7);g.stroke();}g.globalAlpha=1;
   for(let i=0;i<7;i++){const q=clamp((st-5.2)*.4-sr(i)*.3,0,1);if(q>0)birdShape(g,480+(i-3)*180*q,400-q*300+sr(i)*40,1+q*.4,t*8+i);}});
  motes(g,t,14,109);}},
 hands:{bg(g){bgGrad(g,"#8a6a34","#3a2c18");glow(g,480,300,480,"rgba(240,220,170,.55)",.8);},fg(g,t,st){
  ground(g,600,"#2a1e10");
  layer(g,win(st,-1,5,.4),g=>{const b=clamp((st-2.2)/1,0,1);pose(g,360,620,1.3,[-12,-46],[92,-60]);g.save();g.globalAlpha=.35+.65*b;pose(g,600,620,1.3,[-92,-60],[12,-46]);g.restore();
   glow(g,480,500,220,"rgba(240,196,106,.6)",.3+b*.5);diya(g,480,536,.8,t,1);});
  layer(g,win(st,5,8.6,.4),g=>{pose(g,400,620,1.3,[-12,-46],[56,-70]);
   g.save();g.translate(490,500);g.strokeStyle="#3a2c18";g.lineWidth=3;g.beginPath();g.moveTo(0,-90);g.lineTo(0,-110);g.stroke();g.beginPath();g.arc(0,-50,40,Math.PI,0);g.stroke();for(let i=0;i<7;i++){const x=-40+i*13.3;g.beginPath();g.moveTo(x,-50);g.lineTo(x,40);g.stroke();}g.beginPath();g.moveTo(-44,40);g.lineTo(44,40);g.stroke();
   const op=clamp((st-5.8)/.8,0,1);g.fillStyle="#cbb98e";g.fillRect(14,-14,26*(1-op)+.1,44);g.strokeStyle="#3a2c18";g.strokeRect(14,-14,26*(1-op)+.1,44);
   const fly=clamp((st-6.4)/2,0,1);birdShape(g,lerp(0,420,eo(fly)),lerp(0,-380,eo(fly))+Math.sin(t*6)*3,1.2+fly,t*(fly>0?9:2));
   g.restore();});
  layer(g,win(st,8.6,12,.4),g=>{glow(g,480,300,300,"rgba(240,196,106,.4)",.6);for(let i=0;i<7;i++)pose(g,120+i*120,620,1.1,[-60,-62],[60,-62]);for(let i=0;i<8;i++)birdShape(g,(t*40+i*130)%W,140+sr(i)*120+Math.sin(t*2+i)*10,1.1,t*8+i);});
  motes(g,t,16,111);}},
 crowd:{bg(g){bgGrad(g,"#4a3820","#1c140c");glow(g,480,200,420,"rgba(240,220,170,.4)",.8);g.fillStyle="#241608";for(let i=0;i<8;i++){const x=i*130-20,h=200+sr(i+3)*120;g.fillRect(x,480-h,120,h);}},fg(g,t,st){
  ground(g,480,"#241a0d");
  const L=clamp((st-4)/2,0,1),M=W+140;
  g.save();g.globalAlpha=.5;for(let i=0;i<12;i++){const x=((i*90-t*20)%M+M)%M-70;fig(g,x,520,.6,t*4+i,false);}g.restore();
  for(let i=0;i<9;i++){const x=((i*125+t*36)%(W+200))-100;fig(g,x,650,1.1,t*4.2+i*2,false);if(L>0)glow(g,x,584,44,"rgba(255,220,150,.95)",L*(.5+.5*sr(i)));}
  motes(g,t,16,113);}},
 baaki:{bg(g){bgGrad(g,"#2a2013","#0c0906");},fg(g,t,st){
  const starts=[0,4,7.5];
  for(let i=0;i<3;i++){const x=180+i*300,y=320,a=clamp((st-starts[i])/1,0,1);g.save();g.translate(x,y);
   g.fillStyle="#140e08";g.fillRect(-130,-170,260,340);g.strokeStyle="#8a5f22";g.lineWidth=5;g.strokeRect(-130,-170,260,340);
   g.save();g.beginPath();g.rect(-125,-165,250,330);g.clip();
   const gg=g.createLinearGradient(0,-165,0,165);gg.addColorStop(0,"#8a6a34");gg.addColorStop(1,"#3a2c18");g.fillStyle=gg;g.fillRect(-125,-165,250,330);glow(g,0,-60,160,"rgba(240,220,170,.6)",.8);
   g.fillStyle="#241a0d";g.fillRect(-125,150,250,20);
   if(i===0){pose(g,-10,150,1.1,[-12,-46],[22,-112]);qmark(g,50,-70,.9,"#e8d9b5",6);}
   if(i===1){pose(g,0,150,1.1,[-34,-84],[34,-84]);g.strokeStyle="rgba(232,217,181,.75)";g.lineWidth=3;for(let k=0;k<3;k++){const r=((t*50+k*30)%90)+16;g.globalAlpha=1-r/110;g.beginPath();g.arc(0,150-100*1.1,r,-2.5,-.6);g.stroke();}g.globalAlpha=1;}
   if(i===2){fig(g,-60,150,1,0,false);const kx=lerp(10,60,a),ky=lerp(40,-100,a);g.strokeStyle="rgba(232,217,181,.8)";g.lineWidth=1.5;g.beginPath();g.moveTo(-48,80);g.quadraticCurveTo(0,60,kx,ky+30);g.stroke();kite(g,kx,ky,1.1,t);}
   g.fillStyle=`rgba(8,6,4,${(1-a)*.78})`;g.fillRect(-125,-165,250,330);
   g.restore();g.restore();diya(g,x,560,1.3,t,a);}
  motes(g,t,12,127);}},
 recap:{bg(g){g.fillStyle="#0a0705";g.fillRect(-6,-6,W+12,H+12);},fg(g,t,st){
  const z=s=>1+s*.03;
  layer(g,win(st,-1,1.6,.25),g=>{g.save();g.translate(480,360);g.scale(z(st),z(st));g.translate(-480,-360);REND.archive.bg(g,t,0);REND.archive.fg(g,t,Math.min(st,2));g.restore();});
  layer(g,win(st,1.6,3.1,.25),g=>{g.save();g.translate(480,360);g.scale(z(st-1.6),z(st-1.6));g.translate(-480,-360);REND.archive.fg(g,t,4);g.restore();});
  layer(g,win(st,3.1,6,.25),g=>{g.save();g.translate(480,360);g.scale(z(st-3.1),z(st-3.1));g.translate(-480,-360);REND.crowd.bg(g,t,8);REND.crowd.fg(g,t,8);g.restore();});}},
 road:{bg(g,t,st){const p=clamp(st/6,0,1);bgGrad(g,"#7a5c2e","#2a1e10");const sy=lerp(400,330,p);glow(g,480,sy,440,"rgba(240,196,106,.75)",.9);g.fillStyle="#f0c46a";g.beginPath();g.arc(480,sy,60,0,7);g.fill();g.save();g.strokeStyle="rgba(240,196,106,.25)";g.lineWidth=12;for(let i=0;i<12;i++){const a=t*.08+i/12*6.28;g.beginPath();g.moveTo(480+Math.cos(a)*80,sy+Math.sin(a)*80);g.lineTo(480+Math.cos(a)*700,sy+Math.sin(a)*700);g.stroke();}g.restore();},fg(g,t,st){
  g.fillStyle="#2a1e10";g.fillRect(-6,400,W+12,H-394);
  g.fillStyle="#1c140c";g.beginPath();g.moveTo(200,H+6);g.lineTo(474,400);g.lineTo(486,400);g.lineTo(760,H+6);g.closePath();g.fill();
  g.strokeStyle="#e8d9b5";g.lineWidth=4;for(let i=0;i<8;i++){const p=((t*.4+i/8)%1);const y=lerp(402,H,p*p);g.globalAlpha=p;g.beginPath();g.moveTo(480,y);g.lineTo(480,y+22*p*p+2);g.stroke();}g.globalAlpha=1;
  const mp=clamp((st-2)/6,0,1),mq=mp*mp,my=lerp(410,H+160,mq),ms=lerp(.12,2.2,mq),mx=lerp(500,840,mq);
  g.save();g.translate(mx,my);g.scale(ms,ms);g.fillStyle="#cbb98e";g.beginPath();g.moveTo(-34,0);g.lineTo(-34,-70);g.arc(0,-70,34,Math.PI,0);g.lineTo(34,0);g.closePath();g.fill();g.fillStyle="#241a0d";g.font='18px "Tiro Devanagari Hindi", serif';g.textAlign="center";g.fillText("मंज़िल",0,-64);g.font='12px "Special Elite", monospace';g.fillText("∞ KM",0,-40);g.restore();
  const wp=clamp(st/8,0,1);fig(g,470,lerp(640,560,wp),lerp(1.2,.9,wp),t*4,false);
  for(let i=0;i<6;i++){const bx=((t*30+i*160)%(W+200))-100;birdShape(g,bx,120+sr(i)*120+Math.sin(t+i)*10,1,t*7+i);}
  motes(g,t,12,131);}},
 flame:{bg(g){bgGrad(g,"#1c140c","#080604");},fg(g,t,st){
  layer(g,win(st,-1,2.4,.35),g=>{const b=.6+.4*Math.sin(t*4);glow(g,480,460,320,"rgba(240,196,106,.25)",.7);bust(g,480,560,2.6,"#0e0a06");glow(g,470,600,170,"rgba(240,150,90,.9)",b*.8);g.fillStyle="#f0a060";g.save();g.translate(470,600);g.scale(1+.08*b,1+.08*b);g.beginPath();g.moveTo(0,20);g.bezierCurveTo(-40,-6,-26,-40,0,-20);g.bezierCurveTo(26,-40,40,-6,0,20);g.fill();g.restore();});
  layer(g,clamp((st-2.1)/.4,0,1),g=>{glow(g,480,380,280,"rgba(240,196,106,.45)",.7);
   const dy=lerp(150,412,eo(clamp((st-2.5)/1.2,0,1)));const sh=clamp((st-4.6)/.8,0,1);
   if(st<4.4){g.save();g.globalAlpha=clamp((4.4-st)/.6,0,1);g.strokeStyle="#140e08";g.lineWidth=34;g.lineCap="round";g.beginPath();g.moveTo(620,-20);g.lineTo(520,dy-30);g.stroke();g.restore();}
   diya(g,480,dy,1.3,t,1);
   cupped(g,480,430,1,sh);
   if(st>4.4){g.strokeStyle="rgba(232,217,181,.35)";g.lineWidth=2;for(let i=0;i<10;i++){const x=((t*500+i*137)%(W+300))-150,y=180+sr(i)*360;g.beginPath();g.moveTo(x,y);g.quadraticCurveTo(x+60,y-8,x+140,y);g.stroke();}}});
  motes(g,t,12,137);}},
 poster2:{bg(g){g.fillStyle="#0a0705";g.fillRect(-6,-6,W+12,H+12);},fg(g,t,st){glow(g,480,360,520,"rgba(217,164,65,.16)",.8);drawPoster(g,480,368,.92*(1+st*.006),-.02,st>2.5);motes(g,t,14,47);}},
 fin:{bg(g){g.fillStyle="#040302";g.fillRect(-6,-6,W+12,H+12);},fg(){}}
};

/* ---------------- film engine state ---------------- */
let view="lobby",ft=0,playing=false,ci=0,curScene=-1,lastShot=null,shotDip=0;
let irisAge=9,leaderT=0,leaderN=4,pendingSeek=null;
let nextBird=0,nextHeart=0,nextTick=0,nextPen=0,tickAlt=false;
let scratches=[],burns=[],frameN=0,lastSec=-1,lastCapKey=-1;
const grainTiles=[];
for(let k=0;k<6;k++){const c=document.createElement("canvas");c.width=320;c.height=240;const x=c.getContext("2d");const im=x.createImageData(320,240);for(let i=0;i<im.data.length;i+=4){const v=Math.floor(Math.random()*255);im.data[i]=im.data[i+1]=im.data[i+2]=v;im.data[i+3]=255;}x.putImageData(im,0,0);grainTiles.push(c);}

/* ---------------- videos (stock texture layer) ---------------- */
function mkV(){const v=document.createElement("video");v.muted=true;v.loop=true;v.playsInline=true;v.setAttribute("playsinline","");v.preload="auto";return v;}
function tryNext(shot){
 if(!shot.stock||shot.si>=shot.stock.length){shot.vstate=-1;return;}
 if(!shot.v)shot.v=mkV();const v=shot.v;shot.si++;
 clearTimeout(shot.timer);
 v.oncanplay=()=>{clearTimeout(shot.timer);shot.vstate=1;if(playing&&view==="film")v.play().catch(()=>{});};
 v.onerror=()=>{clearTimeout(shot.timer);tryNext(shot);};
 v.src=shot.stock[shot.si-1];v.load();
 shot.timer=setTimeout(()=>{if(v.readyState<2)tryNext(shot);},6000);
}
function ensureLoad(shot){if(shot&&shot.stock&&shot.vstate===0)tryNext(shot);}
function releaseShot(shot){if(shot.v){clearTimeout(shot.timer);try{shot.v.pause();shot.v.oncanplay=null;shot.v.onerror=null;shot.v.removeAttribute("src");shot.v.load();}catch(e){}shot.v=null;}shot.vstate=0;shot.si=0;}
function tidyVideos(idx){SHOTS.forEach(s=>{const si=sceneAt(s.t0);if(si<idx-1||si>idx+1)releaseShot(s);});}
function drawCover(g,v){const vw=v.videoWidth,vh=v.videoHeight;if(!vw)return;const s=Math.max(W/vw,H/vh);const w=vw*s,h=vh*s;g.drawImage(v,(W-w)/2,(H-h)/2,w,h);}

/* ---------------- drawing ---------------- */
function grade(g){
 g.globalCompositeOperation="saturation";g.fillStyle="#808080";g.fillRect(0,0,W,H);
 const tn=S.tone/100;
 g.globalCompositeOperation="multiply";
 g.fillStyle=`rgba(${Math.round(lerp(168,222,tn))},${Math.round(lerp(178,196,tn))},${Math.round(lerp(196,142,tn))},.55)`;g.fillRect(0,0,W,H);
 g.globalCompositeOperation="screen";
 g.fillStyle=`rgba(255,228,170,${.04+.07*tn})`;g.fillRect(0,0,W,H);
 g.fillStyle="rgba(58,46,30,.85)";g.fillRect(0,0,W,H);
 g.globalCompositeOperation="source-over";
 const fl=S.flick/100;const k=Math.floor(ft*24);
 g.fillStyle=`rgba(0,0,0,${fl*(.04+.09*sr(k+.3))})`;g.fillRect(0,0,W,H);
 if(sr(k*1.7)>.985){g.fillStyle=`rgba(255,240,210,${fl*.06})`;g.fillRect(0,0,W,H);}
}
const xfC=document.createElement("canvas");xfC.width=W;xfC.height=H;const xfG=xfC.getContext("2d");const XF=.8;
function renderShot(g,shot,t,vOK){const st=t-shot.t0,pr=st/(shot.t1-shot.t0),dir=SHOTS.indexOf(shot)%2?1:-1,z=1.02+.035*pr;
 g.save();g.translate(480+dir*9*(pr-.5),360-3*pr);g.scale(z,z);g.translate(-480,-360);figN=0;
 const R=REND[shot.r];g.save();g.globalAlpha=vOK?.6:1;if(R.bg)R.bg(g,t,st);g.globalAlpha=1;if(R.fg)R.fg(g,t,st);g.restore();g.restore();}
function drawScene(){
 const g=sc;g.setTransform(1,0,0,1,0,0);g.globalAlpha=1;g.globalCompositeOperation="source-over";
 const wv=S.weave/100,k=Math.floor(ft*24);
 g.save();g.translate((sr(k*3.7)-.5)*5*wv,(sr(k*9.1)-.5)*4*wv);
 g.fillStyle="#0a0806";g.fillRect(-8,-8,W+16,H+16);
 const shot=shotAt(ft);
 const vOK=shot.vstate===1&&shot.v&&shot.v.readyState>=2;
 if(vOK){g.globalAlpha=shot.tex;try{drawCover(g,shot.v);}catch(e){}g.globalAlpha=1;}
 renderShot(g,shot,ft,vOK);
 const prev=SHOTS[SHOTS.indexOf(shot)-1],xp=(ft-shot.t0)/XF;
 if(prev&&xp<1){xfG.setTransform(1,0,0,1,0,0);xfG.globalAlpha=1;xfG.globalCompositeOperation="source-over";xfG.fillStyle="#0a0806";xfG.fillRect(0,0,W,H);renderShot(xfG,prev,ft,false);const v=clamp(xp,0,1);g.globalAlpha=1-v*v*(3-2*v);g.drawImage(xfC,0,0);g.globalAlpha=1;}
 if(shotDip>0){g.fillStyle=`rgba(0,0,0,${Math.min(1,shotDip/.18)*.85})`;g.fillRect(-8,-8,W+16,H+16);}
 grade(g);g.restore();
}
function drawLeader(){
 const g=sc;g.setTransform(1,0,0,1,0,0);g.globalAlpha=1;g.globalCompositeOperation="source-over";
 g.save();g.translate((Math.random()-.5)*4,(Math.random()-.5)*4);
 g.fillStyle="#2a2218";g.fillRect(-8,-8,W+16,H+16);
 const frac=leaderT%1,n=Math.max(1,3-Math.floor(leaderT));
 g.strokeStyle="#cbb98e";g.lineWidth=3;g.beginPath();g.arc(480,360,300,0,7);g.stroke();g.lineWidth=1.5;g.beginPath();g.arc(480,360,240,0,7);g.stroke();
 g.beginPath();g.moveTo(480,-8);g.lineTo(480,H+8);g.moveTo(-8,360);g.lineTo(W+8,360);g.stroke();
 g.fillStyle="rgba(203,185,142,.16)";g.beginPath();g.moveTo(480,360);g.arc(480,360,300,-Math.PI/2,-Math.PI/2+frac*6.283);g.closePath();g.fill();
 g.fillStyle="#e8d9b5";g.textAlign="center";g.font='230px "Rozha One", serif';g.fillText(String(n),480,438);
 g.font='16px "Special Elite", monospace';g.fillStyle="#a67c44";g.fillText("· PICTURE START ·",480,80);g.fillText("GUMSHUDA: AZAADI · REEL 1 · 35MM",480,660);
 grade(g);g.restore();
}
function drawFX(dt){
 const g=fx;g.setTransform(1,0,0,1,0,0);g.globalAlpha=1;g.globalCompositeOperation="source-over";g.clearRect(0,0,W,H);
 const anim=(view==="leader")?leaderT:ft;
 const adv=(view==="leader")||(view==="film"&&playing);
 // grain
 const gr=S.grain/100;
 if(gr>0){g.globalCompositeOperation="overlay";g.globalAlpha=gr*.26;g.imageSmoothingEnabled=false;g.drawImage(grainTiles[Math.floor(anim*24)%6],0,0,W,H);g.imageSmoothingEnabled=true;
  g.globalCompositeOperation="source-over";g.globalAlpha=gr*.5;
  for(let i=0;i<5;i++){const kk=Math.floor(anim*24)*7+i;if(sr(kk)>.5){g.fillStyle=sr(kk+1)>.5?"rgba(240,230,200,.5)":"rgba(0,0,0,.6)";g.fillRect(sr(kk+2)*W,sr(kk+3)*H,2+sr(kk+4)*2,2+sr(kk+5)*3);}}
  g.globalAlpha=1;}
 // scratches
 if(adv&&Math.random()<S.scr/100*.09)scratches.push({x:Math.random()*W,life:.1+Math.random()*.5,age:0,w:.6+Math.random()*1.6,light:Math.random()>.4});
 scratches=scratches.filter(s=>s.age<s.life);
 scratches.forEach(s=>{if(adv)s.age+=dt;g.strokeStyle=s.light?`rgba(240,230,200,${.22*(1-s.age/s.life)})`:`rgba(0,0,0,${.3*(1-s.age/s.life)})`;g.lineWidth=s.w;g.beginPath();g.moveTo(s.x+Math.sin(s.age*40)*2,-4);g.lineTo(s.x+Math.sin(s.age*30+2)*3,H+4);g.stroke();});
 // cue burns
 burns=burns.filter(b=>b.age<.5);
 burns.forEach(b=>{if(adv)b.age+=dt;const p=b.age/.5,r=20+p*90;g.globalAlpha=(1-p)*.85;
  const bg=g.createRadialGradient(870,86,2,870,86,r);bg.addColorStop(0,"#fff6dd");bg.addColorStop(.35,"#d9a441");bg.addColorStop(.7,"rgba(90,50,10,.7)");bg.addColorStop(1,"rgba(0,0,0,0)");
  g.fillStyle=bg;g.beginPath();g.arc(870,86,r,0,7);g.fill();
  g.fillStyle="rgba(20,10,4,.8)";g.beginPath();g.arc(870+r*.4,86-r*.3,r*.24,0,7);g.fill();g.globalAlpha=1;});
 if(adv&&S.burns&&Math.random()<.0007)burns.push({age:0});
 // finale static burst + fade
 if(view==="film"&&ft>=223.4&&ft<224.2){g.globalAlpha=.65;g.drawImage(grainTiles[Math.floor(ft*30)%6],0,0,W,H);g.globalAlpha=.3;g.fillStyle="#fff";for(let i=0;i<3;i++)g.fillRect(0,sr(Math.floor(ft*20)+i)*H,W,2);g.globalAlpha=1;}
 if(view==="film"&&ft>=224.2){g.fillStyle=`rgba(0,0,0,${clamp((ft-224.2)/.8,0,1)})`;g.fillRect(0,0,W,H);}
 // iris
 if(irisAge<.7){if(adv||view==="film")irisAge+=dt;const p=clamp(irisAge/.7,0,1);
  g.globalCompositeOperation="source-over";g.fillStyle="#000";g.fillRect(0,0,W,H);
  g.globalCompositeOperation="destination-out";g.beginPath();g.arc(480,360,eo(p)*700,0,7);g.fill();g.globalCompositeOperation="source-over";}
}

/* ---------------- DOM sync ---------------- */
const capsEl=$("caps"),cardEl=$("card");
function capHTML(c){
 const m=c.m||"sub";const en=c.en?`<p class="en">${c.en}</p>`:"";
 if(m==="hand")return `<div class="cap cap-hand"><span class="rev"><span class="hw">${c.hw}</span></span><svg viewBox="0 0 300 14"><path d="M4 8 C 60 2, 120 12, 180 6 S 280 8, 296 5" pathLength="100"/></svg>${c.hi?`<p class="hi">${c.hi}</p>`:""}${en}</div>`;
 if(m==="stamp")return `<div class="cap cap-stamp"><div class="stampbox">${c.hi}${c.en?`<small>${c.en}</small>`:""}</div></div>`;
 if(m==="fin")return `<div class="cap cap-fin"><p class="hi">${c.hi}</p>${en}</div>`;
 return `<div class="cap"><p class="hi">${c.hi}</p>${en}</div>`;
}
function syncDOM(){
 const idx=sceneAt(ft);
 if(idx!==curScene){
  curScene=idx;const s=SCENES[idx];
  setAmb(idx,ft);tidyVideos(idx);
  if(playing){fire({f:"reel"});if(S.burns)burns.push({age:0});}
  irisAge=0;
  $("cardNum").textContent="दृश्य "+DEV[idx];$("cardHi").textContent=s.hi;$("cardEn").textContent=s.en;
  $("readout").textContent=`रील ${DEV[idx]} · ${s.hi} — ${s.en}`;
  $("slateReel").textContent="REEL ०"+DEV[idx];
  document.querySelectorAll(".chip").forEach((ch,i)=>ch.classList.toggle("on",i===idx));
 }
 cardEl.classList.toggle("show",ft-SCENES[idx].t0<2.6&&idx<6);
 const c=CAPS.find(x=>ft>=x.t0&&ft<x.t1);
 const key=c?c.t0:-1;
 if(key!==lastCapKey){lastCapKey=key;capsEl.innerHTML=c?capHTML(c):"";if(c&&(c.m||"sub")==="sub"&&playing)fire({f:"tick",a:1200});}
 const sec=Math.floor(ft);
 if(sec!==lastSec){lastSec=sec;$("tcode").textContent=fmt(ft)+" / 3:45";$("slateTc").textContent=fmt(ft);}
 const pct=clamp(ft/DUR*100,0,100);$("stripFill").style.width=pct+"%";$("stripHead").style.left=pct+"%";
 $("pausedStamp").classList.toggle("hidden",playing||view!=="film");
 $("playIco").classList.toggle("hidden",playing);$("pauseIco").classList.toggle("hidden",!playing);
}
function processFrame(dt){
 while(ci<CUES.length&&CUES[ci].t<=ft){const c=CUES[ci++];if(ft-c.t<.6)fire(c);}
 const idx=curScene;
 if((idx===5||(idx===1&&ft>54))&&ft>=nextBird){fire({f:"birds"});nextBird=ft+.7+Math.random()*1.8;}
 if(idx===2&&ft>=62&&ft>=nextHeart){fire({f:"heart"});nextHeart=ft+1.25;}
 if((idx===2||idx===3)&&ft>=nextTick){tickAlt=!tickAlt;fire({f:"tick",a:tickAlt?2000:1500});nextTick=ft+.5;}
 const penWin=(ft>101&&ft<107.5)||(ft>114&&ft<121)||(ft>124&&ft<133);
 if(penWin&&ft>=nextPen){fire({f:"pen"});nextPen=ft+.28+Math.random()*.15;}
 if(shotDip>0)shotDip-=dt;
 const shot=shotAt(ft);
 if(shot!==lastShot){if(lastShot&&lastShot.v)try{lastShot.v.pause();}catch(e){}
  lastShot=shot;ensureLoad(shot);if(shot.vstate===1&&shot.v)shot.v.play().catch(()=>{});}
 const nx=SHOTS[SHOTS.indexOf(shot)+1];if(nx&&ft>shot.t1-2)ensureLoad(nx);
}

/* ---------------- master loop ---------------- */
let last=performance.now();
function loop(now){
 requestAnimationFrame(loop);
 const dt=Math.min(.1,(now-last)/1000);last=now;frameN++;
 if(view==="leader"){
  leaderT+=dt;const n=Math.max(1,3-Math.floor(leaderT));
  if(n!==leaderN){leaderN=n;if(AC)osc("sine",1000,AC.currentTime,.14,.12,sfxBus);}
  drawLeader();drawFX(dt);
  if(leaderT>=3.05)startFilm();
 }else if(view==="film"){
  if(playing){ft+=dt;processFrame(dt);}
  drawScene();drawFX(dt);syncDOM();
  if(ft>=DUR)finish();
 }
}
requestAnimationFrame(loop);

/* ---------------- control flow ---------------- */
function showView(v){
 view=v;
 $("lobby").classList.toggle("hidden",v!=="lobby");
 $("filmView").classList.toggle("hidden",v==="lobby");
 $("lobbyNav").classList.toggle("hidden",v!=="lobby");
 $("readout").classList.toggle("hidden",v==="lobby");
 $("fsBtn").classList.toggle("hidden",v==="lobby");
 $("exitBtn").classList.toggle("hidden",v==="lobby");
 document.title=v==="lobby"?"गुमशुदा: आज़ादी — GUMSHUDA: AZAADI":"▶ गुमशुदा: आज़ादी — "+fmt(ft);
}
function roll(at){
 initAudio();if(AC&&AC.state==="suspended")AC.resume();
 pendingSeek=(at==null)?null:at;
 $("endcard").classList.remove("show");
 leaderT=0;leaderN=4;projLevel=.7;applyMix();
 $("skipLeader").classList.remove("hidden");
 showView("leader");window.scrollTo({top:0});
}
function startFilm(){
 $("skipLeader").classList.add("hidden");
 showView("film");projLevel=1;applyMix();
 ft=0;ci=0;curScene=-1;lastShot=null;lastCapKey=-1;lastSec=-1;playing=true;
 resetSchedulers(0);irisAge=0;
 if(pendingSeek!=null){const p=pendingSeek;pendingSeek=null;seekTo(p);}
}
function resetSchedulers(t){nextBird=t;nextHeart=t;nextTick=t;nextPen=t;while(ci<CUES.length&&CUES[ci].t<=t)ci++;}
function seekTo(t){
 t=clamp(t,0,DUR-.05);
 $("endcard").classList.remove("show");
 if(view!=="film"){showView("film");projLevel=1;applyMix();}
 ft=t;ci=0;resetSchedulers(t);curScene=-1;lastShot=null;lastCapKey=-1;lastSec=-1;
 SHOTS.forEach(s=>{if(s.v)try{s.v.pause();}catch(e){}});
 playing=true;if(AC&&AC.state==="suspended")AC.resume();
 irisAge=0;
}
function pausePlay(){
 if(view==="end"){roll();return;}
 if(view!=="film")return;
 playing=!playing;
 if(AC){if(playing)AC.resume();else AC.suspend();}
 SHOTS.forEach(s=>{if(s.v){if(playing&&s===lastShot)s.v.play().catch(()=>{});else s.v.pause();}});
}
function finish(){
 if(view==="end")return;
 playing=false;ft=DUR;ambStop();projLevel=0;setStatic(0);applyMix();
 SHOTS.forEach(s=>{if(s.v)try{s.v.pause();}catch(e){}});
 showView("film");view="end";
 $("readout").textContent="॥ समाप्त · FIN ॥";
 $("tcode").textContent="3:45 / 3:45";$("slateTc").textContent="3:45";
 $("stripFill").style.width="100%";$("stripHead").style.left="100%";
 $("endcard").classList.add("show");
 $("playIco").classList.remove("hidden");$("pauseIco").classList.add("hidden");
 $("pausedStamp").classList.add("hidden");
}
function backToLobby(){
 playing=false;ambStop();projLevel=.22;setStatic(0);applyMix();
 SHOTS.forEach(s=>{if(s.v)try{s.v.pause();}catch(e){}});
 $("endcard").classList.remove("show");
 showView("lobby");window.scrollTo({top:0,behavior:"smooth"});
}
function toggleMute(){
 S.muted=!S.muted;saveS();applyMix();
 const b=$("soundBtn");b.classList.toggle("sound-on",!S.muted);b.classList.toggle("sound-off",S.muted);
 b.setAttribute("aria-pressed",String(S.muted));
 $("soundLbl").textContent=S.muted?"ध्वनि OFF":"ध्वनि ON";
}

/* ---------------- poster export ---------------- */
async function downloadPoster(){
 try{if(document.fonts&&document.fonts.ready)await document.fonts.ready;}catch(e){}
 const c=document.createElement("canvas");c.width=920;c.height=1300;const g=c.getContext("2d");
 g.fillStyle="#171009";g.fillRect(0,0,920,1300);
 drawPoster(g,460,650,1.9,-.015,false);
 const a=document.createElement("a");a.download="gumshuda-azaadi-poster.png";a.href=c.toDataURL("image/png");a.click();
}

/* ---------------- build DOM ---------------- */
const PHOTO_SVG=`<svg viewBox="0 0 168 196" aria-hidden="true"><defs><radialGradient id="pg" cx="50%" cy="32%" r="80%"><stop offset="0%" stop-color="#caa76a"/><stop offset="100%" stop-color="#5a4020"/></radialGradient></defs><rect width="168" height="196" fill="url(#pg)"/><g stroke="rgba(240,220,170,.3)" stroke-width="1">${Array.from({length:10},(_,i)=>{const a=i/10*6.28;return `<line x1="84" y1="72" x2="${84+Math.cos(a)*130}" y2="${72+Math.sin(a)*130}"/>`;}).join("")}</g><circle cx="84" cy="72" r="26" fill="#1c140c"/><rect x="76" y="92" width="16" height="14" fill="#1c140c"/><path d="M32 196 v-52 a52 46 0 0 1 104 0 v52 z" fill="#1c140c"/><path d="M70 152 q7 -9 14 -1 q7 -8 14 1 q-7 -2 -14 4 q-7 -6 -14 -4 z" fill="#e3d2a8"/></svg>`;
function buildLobbyPoster(){
 const rows=[["NAAM / NAME","Azaadi"],["AAKHRI BAAR DEKHA GAYA / LAST SEEN","ek azaad desh mein"],["PATA / WHEREABOUTS","kisi ko nahi"]];
 const ROWS_SPACER=[["आख़िरी दर्शन / LAST SEEN","१५ अगस्त १९४७ — दिल्ली / 15 AUG 1947, DELHI"],["पहचान / MARKS","बेख़ौफ़ हँसी, खुली खिड़की, सवाल पूछती आँखें"],["अगर मिले / IF FOUND","अपने भीतर झाँकें — LOOK WITHIN"]];
 $("lobbyPoster").innerHTML=`<div class="stain"></div><div class="crease"></div>
 <div class="p-head"><h2>गुमशुदा !!</h2><p>MISSING · LIBERTY · गुमशुदा</p></div>
 <div class="p-photo">${PHOTO_SVG}</div>
 <div class="p-rows">${rows.map(r=>`<div class="row"><span class="lab">${r[0]}</span><span class="val">${r[1]}</span></div>`).join("")}${ROWS_SPACER.map(r=>`<div class="row" aria-hidden="true" style="visibility:hidden"><span class="lab">${r[0]}</span><span class="val">${r[1]}</span></div>`).join("")}</div>
 <div class="p-reward">Agar aapko kahin nazar aaye... toh humein zaroor batayein.</div>
 <div class="p-stamp"><span>तलाश जारी<br>SEARCH ON</span></div>
 <div class="p-tabs">${["सवाल","उम्मीद","हिम्मत","याद","आवाज़","ज़िंदा","तलाश"].map(t=>`<div>${t}</div>`).join("")}</div>`;
}
function buildIndex(){
 $("idxRows").innerHTML=SCENES.map((s,i)=>`<button class="idxrow" data-t="${s.t0}"><span class="num">${DEV[i]}</span><span><span class="iname">${s.hi}</span><span class="ien">${s.en}</span></span><span class="itime">${fmt(s.t0)}</span></button>`).join("");
 document.querySelectorAll(".idxrow").forEach(b=>b.addEventListener("click",()=>roll(parseFloat(b.dataset.t))));
 $("chips").innerHTML=SCENES.map((s,i)=>`<button class="chip" data-t="${s.t0}"><b>${DEV[i]}</b>${s.hi}</button>`).join("");
 document.querySelectorAll(".chip").forEach(b=>b.addEventListener("click",()=>seekTo(parseFloat(b.dataset.t))));
 const strip=$("strip");SCENES.forEach(s=>{if(s.t0>0){const t=document.createElement("div");t.className="tick";t.style.left=(s.t0/DUR*100)+"%";strip.appendChild(t);}});
}
function buildAmbience(){
 document.querySelectorAll("[data-bulbs]").forEach(el=>{el.innerHTML=Array.from({length:26},(_,i)=>`<i style="animation-delay:${(i*.13)%1.6}s"></i>`).join("");});
 const df=$("dustfield");df.innerHTML=Array.from({length:16},(_,i)=>`<i style="left:${5+sr(i)*80}%;top:${30+sr(i+9)*60}%;animation-delay:${sr(i+3)*14}s;animation-duration:${10+sr(i+5)*10}s"></i>`).join("");
}

/* ---------------- booth ---------------- */
function bindRange(id,out,key,fn){const r=$(id),o=$(out);r.value=S[key];o.textContent=S[key];
 r.addEventListener("input",()=>{S[key]=+r.value;o.textContent=r.value;saveS();if(fn)fn();});}
function syncBoothUI(){
 [["rGrain","oGrain","grain"],["rFlick","oFlick","flick"],["rScr","oScr","scr"],["rWeave","oWeave","weave"],["rTone","oTone","tone"],["rProj","oProj","proj"],["rSfx","oSfx","sfx"],["rMusic","oMusic","music"]].forEach(a=>{$(a[0]).value=S[a[2]];$(a[1]).textContent=S[a[2]];});
 $("cBurns").checked=S.burns;
 document.querySelectorAll("#langSeg button").forEach(b=>b.classList.toggle("on",b.dataset.l===S.lang));
 capsEl.className="caps lang-"+S.lang;
 $("soundBtn").classList.toggle("sound-on",!S.muted);$("soundBtn").classList.toggle("sound-off",S.muted);
 $("soundLbl").textContent=S.muted?"ध्वनि OFF":"ध्वनि ON";
}
function bindBooth(){
 bindRange("rGrain","oGrain","grain");bindRange("rFlick","oFlick","flick");bindRange("rScr","oScr","scr");
 bindRange("rWeave","oWeave","weave");bindRange("rTone","oTone","tone");
 bindRange("rProj","oProj","proj",applyMix);bindRange("rSfx","oSfx","sfx",applyMix);bindRange("rMusic","oMusic","music",applyMix);
 $("cBurns").addEventListener("change",e=>{S.burns=e.target.checked;saveS();});
 $("cBurns").closest(".switch").addEventListener("click",e=>{if(e.target.tagName!=="INPUT"){e.preventDefault();$("cBurns").checked=!$("cBurns").checked;S.burns=$("cBurns").checked;saveS();}});
 document.querySelectorAll("#langSeg button").forEach(b=>b.addEventListener("click",()=>{S.lang=b.dataset.l;saveS();syncBoothUI();}));
 $("boothReset").addEventListener("click",()=>{const m=S.muted;S={...DEF,muted:m};saveS();syncBoothUI();applyMix();});
}

/* ---------------- events ---------------- */
function bindEvents(){
 $("rollBtn").addEventListener("click",()=>roll());
 $("lobbyPoster").addEventListener("click",()=>roll());
 $("lobbyPoster").addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();roll();}});
 $("brandBtn").addEventListener("click",backToLobby);
 $("exitBtn").addEventListener("click",backToLobby);
 $("soundBtn").addEventListener("click",()=>{initAudio();toggleMute();});
 $("playBtn").addEventListener("click",pausePlay);
 $("restartBtn").addEventListener("click",()=>seekTo(0));
 $("prevBtn").addEventListener("click",()=>{const i=sceneAt(ft);seekTo(SCENES[Math.max(0,(ft-SCENES[i].t0<2?i-1:i))].t0);});
 $("nextBtn").addEventListener("click",()=>{const i=sceneAt(ft);if(i>=6){finish();}else seekTo(SCENES[i+1].t0);});
 $("skipLeader").addEventListener("click",()=>{leaderT=3.05;});
 $("replayBtn").addEventListener("click",()=>roll());
 $("endPosterBtn").addEventListener("click",backToLobby);
 $("endDlBtn").addEventListener("click",downloadPoster);
 $("dlPosterBtn").addEventListener("click",downloadPoster);
 $("stage").addEventListener("click",e=>{if(view==="film"&&e.target.tagName!=="BUTTON")pausePlay();});
 // seek strip
 const strip=$("strip");let dragging=false;
 const seekEv=e=>{const r=strip.getBoundingClientRect();seekTo(clamp((e.clientX-r.left)/r.width,0,1)*DUR);};
 strip.addEventListener("pointerdown",e=>{dragging=true;strip.setPointerCapture(e.pointerId);seekEv(e);});
 strip.addEventListener("pointermove",e=>{if(dragging)seekEv(e);});
 strip.addEventListener("pointerup",()=>{dragging=false;});
 // fullscreen
 $("fsBtn").addEventListener("click",()=>{
  const el=$("filmView");
  try{if(document.fullscreenElement)document.exitFullscreen();else if(el.requestFullscreen)el.requestFullscreen();}catch(e){}
 });
 // poster tilt
 const pw=document.querySelector(".posterWrap"),lp=$("lobbyPoster");
 pw.addEventListener("pointermove",e=>{if(RM)return;const r=pw.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;lp.style.transform=`rotate(-2deg) rotateY(${x*10}deg) rotateX(${-y*8}deg)`;});
 pw.addEventListener("pointerleave",()=>{lp.style.transform="rotate(-2deg)";});
 // first gesture → lobby projector hum
 document.addEventListener("pointerdown",function first(){document.removeEventListener("pointerdown",first);initAudio();if(AC&&AC.state==="suspended")AC.resume();if(view==="lobby"){projLevel=.22;applyMix();}},{once:false});
 // keyboard
 document.addEventListener("keydown",e=>{
  const tag=(e.target.tagName||"").toLowerCase();
  if(tag==="input"||tag==="textarea")return;
  if(e.key==="m"||e.key==="M"){initAudio();toggleMute();return;}
  if(view==="lobby")return;
  if(e.key===" "){e.preventDefault();if(view==="leader")leaderT=3.05;else pausePlay();}
  else if(e.key==="f"||e.key==="F"){$("fsBtn").click();}
  else if(e.key==="r"||e.key==="R"){roll();}
  else if(e.key==="ArrowRight"){e.preventDefault();if(view==="film"){if(e.shiftKey)$("nextBtn").click();else seekTo(ft+5);}}
  else if(e.key==="ArrowLeft"){e.preventDefault();if(view==="film"){if(e.shiftKey)$("prevBtn").click();else seekTo(ft-5);}}
 });
 document.addEventListener("visibilitychange",()=>{if(document.hidden&&view==="film"&&playing)pausePlay();});
}

/* ---------------- init ---------------- */
buildLobbyPoster();buildIndex();buildAmbience();bindBooth();bindEvents();syncBoothUI();showView("lobby");
try{if(document.fonts)["58px Yatra One","52px Rozha One","15px Tiro Devanagari Hindi","15px Special Elite"].forEach(f=>document.fonts.load(f));}catch(e){}
}
