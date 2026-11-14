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
 march:["https://assets.mixkit.co/videos/preview/mixkit-people-walking-in-a-crosswalk-4460.mp4","https://videos.pexels.com/video-files/3195394/3195394-hd_1920_1080_25fps.mp4"],
 street:["https://assets.mixkit.co/videos/preview/mixkit-crowd-of-people-walking-in-the-street-4326.mp4","https://videos.pexels.com/video-files/1093662/1093662-hd_1920_1080_30fps.mp4"],
 train:["https://assets.mixkit.co/videos/preview/mixkit-going-down-a-curved-highway-through-a-mountain-range-41576.mp4"],
 book:["https://assets.mixkit.co/videos/preview/mixkit-turning-the-pages-of-a-book-41569.mp4","https://videos.pexels.com/video-files/4782135/4782135-hd_1920_1080_25fps.mp4"],
 haveli:["https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-flowers-1173.mp4"],
 mirror:["https://assets.mixkit.co/videos/preview/mixkit-going-down-a-curved-highway-through-a-mountain-range-41576.mp4"],
 dawn:["https://videos.pexels.com/video-files/857195/857195-hd_1920_1080_25fps.mp4","https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529.mp4"],
 flag:["https://videos.pexels.com/video-files/857195/857195-hd_1920_1080_25fps.mp4"]
};
const SHOTS=[
 {t0:0,t1:7,r:"tuning"},{t0:7,t1:22,r:"radio"},{t0:22,t1:30,r:"poster"},
 {t0:30,t1:42,r:"paper"},{t0:42,t1:53,r:"march",tex:.42},{t0:53,t1:60,r:"flag",tex:.3},
 {t0:60,t1:72,r:"street",tex:.4},{t0:72,t1:84,r:"train",tex:.34},{t0:84,t1:95,r:"gate"},
 {t0:95,t1:109,r:"book",tex:.18},{t0:109,t1:123,r:"sages"},{t0:123,t1:135,r:"ink"},
 {t0:135,t1:148,r:"charkha"},{t0:148,t1:158,r:"haveli",tex:.3},{t0:158,t1:170,r:"mirror",tex:.22},
 {t0:170,t1:182,r:"class"},{t0:182,t1:193,r:"vote"},{t0:193,t1:204,r:"dawn",tex:.45},
 {t0:204,t1:215,r:"poster2"},{t0:215,t1:225,r:"fin"}
];
SHOTS.forEach(s=>{if(STOCK[s.r]){s.stock=STOCK[s.r];s.tex=s.tex||.3;}s.v=null;s.vstate=0;s.si=0;});
const sceneAt=t=>{for(let i=SCENES.length-1;i>=0;i--)if(t>=SCENES[i].t0)return i;return 0;};
const shotAt=t=>{for(let i=SHOTS.length-1;i>=0;i--)if(t>=SHOTS[i].t0)return SHOTS[i];return SHOTS[0];};

const CAPS=[
 {t0:6,t1:8,hi:"Yeh ek zaroori elaan hai.",en:"VOICE 1"},
 {t0:8.5,t1:10.5,hi:"Ek cheez gumshuda hai.",en:"VOICE 1"},
 {t0:11,t1:13.5,m:"stamp",hi:"Naam hai... Azaadi.",en:"VOICE 1"},
 {t0:14,t1:16.5,hi:"Kehte hain, ise bahut saalon pehle paaya gaya tha.",en:"VOICE 1"},
 {t0:17,t1:20.5,hi:"Iske liye ladaaiyaan ladi gayi, qurbaaniyaan di gayi, aur na jaane kitne sapne dekhe gaye.",en:"VOICE 1"},
 {t0:21,t1:23,hi:"Lekin aaj... iska pata kisi ko nahi.",en:"VOICE 1"},
 {t0:23.5,t1:26.5,hi:"Aakhri baar ise ek azaad desh mein dekha gaya tha.",en:"VOICE 1"},
 {t0:27,t1:29.8,hi:"Agar aapko kahin nazar aaye... toh humein zaroor batayein.",en:"VOICE 1"},
 {t0:32,t1:34,hi:"Humne uski talaash shuru ki.",en:"VOICE 2"},
 {t0:34.5,t1:38.5,hi:"Purani kitaabon mein, itihaas ke pannon mein, un sadkon par jahan kabhi inquilab ke naare goonjte the.",en:"VOICE 2"},
 {t0:39,t1:41,hi:"Har tasveer mein ek kahaani thi.",en:"VOICE 2"},
 {t0:41,t1:43,hi:"Har kahaani mein ek khwaab tha.",en:"VOICE 2"},
 {t0:43.5,t1:46.5,hi:"Ek aise kal ka khwaab, jahan koi kisi se na dare.",en:"VOICE 2"},
 {t0:47,t1:50,hi:"Jahan apni baat kehne ke liye ijazat na maangni pade.",en:"VOICE 2"},
 {t0:50.5,t1:53.5,hi:"Jahan jeene ke liye kisi aur ki marzi zaroori na ho.",en:"VOICE 2"},
 {t0:54,t1:56,hi:"Lekin waqt ke saath ek sawaal reh gaya...",en:"VOICE 2"},
 {t0:56.5,t1:59.8,hi:"Kya humne sirf ek desh ko azaad karaya tha, ya insaan ko bhi?",en:"VOICE 2"},
 {t0:61,t1:64,hi:"Hum aage badhe... toh kuch deewarein nazar aayi.",en:"VOICE 3"},
 {t0:64.5,t1:66.5,hi:"Kuch deewarein patthar ki thi.",en:"VOICE 3"},
 {t0:67,t1:69,hi:"Kuch samaaj ne banayi thi.",en:"VOICE 3"},
 {t0:69.5,t1:73,hi:"Aur kuch... humne khud apne andar khadi kar li thi.",en:"VOICE 3"},
 {t0:73.5,t1:75.5,hi:"Kahin kisi ki awaaz daba di gayi.",en:"VOICE 3"},
 {t0:76,t1:78.5,hi:"Kahin kisi ke sapnon ko chhota kar diya gaya.",en:"VOICE 3"},
 {t0:79,t1:84.5,hi:"Kahin kisi ko bataya gaya ki use kaise jeena hai, kya banna hai, kisse milna hai, kya kehna hai.",en:"VOICE 3"},
 {t0:85,t1:86.5,hi:"Aur hum sochte rahe...",en:"VOICE 3"},
 {t0:87,t1:89,hi:"Aakhir azaadi ka matlab kya hai?",en:"VOICE 3"},
 {t0:89.5,t1:91.5,hi:"Kya sirf zanjeeron ka na hona azaadi hai?",en:"VOICE 3"},
 {t0:92,t1:95,hi:"Ya phir apne khwaabon ko bina dare jee paana bhi zaroori hai?",en:"VOICE 3"},
 {t0:96.5,t1:99,hi:"Humne logon se poochna chaha...",en:"VOICE 4"},
 {t0:99.5,t1:102,m:"hand",hw:"Kya tum azaad ho?",hi:"",en:"VOICE 4"},
 {t0:102.5,t1:106.5,hi:"Lekin jawaab dene se pehle hi kai chehre khamosh ho gaye.",en:"VOICE 4"},
 {t0:107,t1:111.5,hi:"Kisi ke paas kehne ko bahut kuch tha, par sunne wala koi nahi.",en:"VOICE 4"},
 {t0:112,t1:116.5,hi:"Kisi ke paas sapne the, par unhe poora karne ke mauke nahi.",en:"VOICE 4"},
 {t0:117,t1:121.5,hi:"Kisi ke paas apni marzi thi, par faisle karne ka haq nahi.",en:"VOICE 4"},
 {t0:122,t1:127.5,hi:"Aur kisi ke paas sab kuch tha... bas khud ko chunne ki himmat nahi.",en:"VOICE 4"},
 {t0:128,t1:134,m:"hand",hw:"Shayad azaadi ek aisi cheez hai, jise har insaan mehsoos toh karta hai, par har insaan jee nahi paata.",hi:"",en:"VOICE 4"},
 {t0:136,t1:138.5,hi:"Phir ek din hum ruk gaye.",en:"VOICE 5"},
 {t0:139,t1:140.5,hi:"Aur socha...",en:"VOICE 5"},
 {t0:141,t1:144,hi:"Kya hum azaadi ko galat jagah dhoond rahe the?",en:"VOICE 5"},
 {t0:144.5,t1:147.5,hi:"Shayad woh kisi kitaab mein nahi thi.",en:"VOICE 5"},
 {t0:148,t1:150.5,hi:"Na kisi tareekh mein, na kisi naare mein.",en:"VOICE 5"},
 {t0:151,t1:155,hi:"Shayad woh tab thi, jab koi apni marzi se apna raasta chunta hai.",en:"VOICE 5"},
 {t0:155.5,t1:158.5,hi:"Jab koi bina dare apni awaaz uthata hai.",en:"VOICE 5"},
 {t0:159,t1:163.5,hi:"Jab koi doosre ko bhi wahi haq deta hai, jo woh khud ke liye chahta hai.",en:"VOICE 5"},
 {t0:164,t1:167,hi:"Kyunki azaadi sirf khud ke liye azaad hone ka naam nahi...",en:"VOICE 5"},
 {t0:167.5,t1:169.8,hi:"Balki doosron ko bhi azaad rehne dene ka naam hai.",en:"VOICE 5"},
 {t0:171,t1:174.5,hi:"Toh shayad Azaadi gumshuda nahi hai.",en:"VOICE 6"},
 {t0:175,t1:178,hi:"Shayad woh humare beech hi kahin hai.",en:"VOICE 6"},
 {t0:178.5,t1:182,hi:"Har us sawaal mein, jo poochha jaana baaki hai.",en:"VOICE 6"},
 {t0:182.5,t1:185.5,hi:"Har us awaaz mein, jo uthna baaki hai.",en:"VOICE 6"},
 {t0:186,t1:189,hi:"Har us sapne mein, jo poora hona baaki hai.",en:"VOICE 6"},
 {t0:189.5,t1:193.5,hi:"Humne use dhoonda itihaas mein, sadkon par, logon ke beech...",en:"VOICE 6"},
 {t0:194,t1:196.5,hi:"Aur aakhir mein samjha...",en:"VOICE 6"},
 {t0:197,t1:201.5,hi:"Azaadi koi manzil nahi, jahan pahunch kar safar khatam ho jaaye.",en:"VOICE 6"},
 {t0:202,t1:204,hi:"Azaadi ek ehsaas hai.",en:"VOICE 6"},
 {t0:204.5,t1:206,hi:"Ek zimmedari hai.",en:"VOICE 6"},
 {t0:206.5,t1:211,hi:"Ek aisa haq hai, jise har roz jeena aur har roz bachana padta hai.",en:"VOICE 6"},
 {t0:211.5,t1:214.8,hi:"Aur shayad... isi liye uski talaash kabhi khatam nahi hoti.",en:"VOICE 6"},
 {t0:215,t1:216.4,m:"fin",hi:"Azaadi sirf ek lafz nahi...",en:"VOICE 1"},
 {t0:216.4,t1:217.8,m:"fin",hi:"Yeh ek khwaab hai.",en:"VOICE 2"},
 {t0:217.8,t1:219.2,m:"fin",hi:"Ek awaaz hai.",en:"VOICE 3"},
 {t0:219.2,t1:220.6,m:"fin",hi:"Ek sawaal hai.",en:"VOICE 4"},
 {t0:220.6,t1:222,m:"fin",hi:"Ek haq hai.",en:"VOICE 5"},
 {t0:222,t1:223.4,m:"fin",hi:"Aur ek zimmedari bhi.",en:"VOICE 6"}
];

/* ---------------- sound cues ---------------- */
const CUES=[];
const cue=(t,f,a)=>CUES.push({t,f,a});
cue(0.1,"staticHi");[0.4,2.2,4,5.8,7.6,9.4].forEach(t=>cue(t,"sweep"));
(()=>{ // morse AZAADI
 const M={A:".-",Z:"--..",D:"-..",I:".."};let t=8.2;const u=.085;
 for(const ch of "AZAADI"){for(const s of M[ch]){cue(t,"morse",s==="."?u:u*3);t+=s==="."?u*2:u*4;}t+=u*3;}
})();
cue(16,"staticLo");cue(16,"click");cue(22.3,"page");cue(23,"thud");
cue(31.4,"whistle");cue(30.8,"page");cue(52.5,"whistle");cue(54,"bell");cue(55.4,"birds");cue(56.4,"birds");
[[392,.9,33],[415.3,.9,34.1],[466.16,.9,35.2],[523.25,1.4,36.3],[466.16,.8,38],[415.3,.8,39],[392,1.2,40],[349.23,1.7,41.2]].forEach(n=>cue(n[2],"flute",[n[0],n[1]]));
for(let t=31;t<59;t+=4){cue(t,"dha");cue(t+.75,"tin");cue(t+1.5,"dha");cue(t+2.25,"tin");cue(t+3,"dha");}
[66.3,70.2,84.7,86.1,88.4].forEach(t=>cue(t,"clink"));
cue(72,"trainOn");cue(84,"trainOff");[75.5,78.5,81.5].forEach(t=>cue(t,"thud"));
[96.5,100.8,110.5,123.5].forEach(t=>cue(t,"page"));
[97,100.2,103.4,106.6,110,113,116.5,119.5].forEach((t,i)=>cue(t,"pluck",[261.63,311.13,349.23,311.13,261.63,233.08,261.63,311.13][i]));
cue(124.5,"chord",[261.63,392,523.25]);
cue(135,"charkhaOn");cue(148,"charkhaOff");
[[261.63,.8,150],[277.18,.8,151],[311.13,1,152],[349.23,1.2,153.2],[311.13,.8,154.6],[277.18,.8,155.6],[261.63,1.8,156.6]].forEach(n=>cue(n[2],"flute",[n[0],n[1]]));
cue(163,"chime");
[[261.63,172],[311.13,175],[349.23,178],[392,181],[466.16,184],[523.25,187]].forEach(n=>cue(n[1],"pluck",[n[0]]));
for(let t=171;t<213;t+=2)cue(t,"tin");
cue(186,"chime");cue(194,"swell");cue(194,"chord",[261.63,392,523.25]);cue(200,"pluck",[523.25]);
cue(204.6,"page");cue(206.5,"thud");
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
 if(idx===2){mkDrone([55,82.41],.05);mkLoop(BUF.brown,"lowpass",380,.06,sfxBus);if(t>=72&&t<84)trainLayer(true);}
 if(idx===3){mkLoop(BUF.brown,"lowpass",230,.05,sfxBus);}
 if(idx===4){mkLoop(BUF.tanpura,"lowpass",2600,.16,scoreBus);mkLoop(BUF.brown,"lowpass",420,.04,sfxBus);if(t<148)charkhaLayer(true);}
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
function fig(g,x,y,s,ph,flagB){g.save();g.translate(x,y);g.scale(s,s);g.fillStyle=INK;g.strokeStyle=INK;g.lineWidth=7;g.lineCap="round";
 const l1=Math.sin(ph)*14,l2=Math.sin(ph+Math.PI)*14;
 g.beginPath();g.arc(0,-92,11,0,7);g.fill();
 g.beginPath();g.moveTo(0,-80);g.lineTo(0,-38);g.stroke();
 g.beginPath();g.moveTo(0,-38);g.lineTo(l1,0);g.moveTo(0,-38);g.lineTo(l2,0);g.stroke();
 g.beginPath();g.moveTo(0,-70);g.lineTo(-l2*.7,-48);g.moveTo(0,-70);g.lineTo(flagB?14:l1*.7,flagB?-96:-48);g.stroke();
 if(flagB){g.lineWidth=3;g.beginPath();g.moveTo(14,-96);g.lineTo(14,-140);g.stroke();waveFlag(g,14,-140,44,26,ph);}
 g.restore();}
function waveFlag(g,x,y,w,h,ph){g.save();g.translate(x,y);const cols=["#d99a3d","#e8d9b5","#7a9a4e"];for(let b=0;b<3;b++){g.fillStyle=cols[b];g.beginPath();g.moveTo(0,b*h/3);for(let i=0;i<=10;i++){const xx=i*w/10;g.lineTo(xx,b*h/3+Math.sin(ph*2+i*.7)*3);}for(let i=10;i>=0;i--){const xx=i*w/10;g.lineTo(xx,(b+1)*h/3+Math.sin(ph*2+i*.7)*3);}g.closePath();g.fill();}
 g.strokeStyle="#3d5a6b";g.lineWidth=1.2;g.beginPath();g.arc(w/2,h/2+Math.sin(ph*2+3.5)*3,h/7,0,7);g.stroke();for(let i=0;i<12;i++){const a=i/12*Math.PI*2;g.beginPath();g.moveTo(w/2,h/2+Math.sin(ph*2+3.5)*3);g.lineTo(w/2+Math.cos(a)*h/7,h/2+Math.sin(ph*2+3.5)*3+Math.sin(a)*h/7);g.stroke();}g.restore();}
function dome(g,x,y,s){g.save();g.translate(x,y);g.scale(s,s);g.fillStyle=INK;g.fillRect(-260,-40,520,44);for(let i=-12;i<=12;i++)g.fillRect(i*20-3,-78,6,40);g.fillRect(-270,-84,540,8);g.beginPath();g.arc(0,-84,110,Math.PI,0);g.fill();g.fillRect(-6,-224,12,34);g.beginPath();g.arc(0,-228,8,0,7);g.fill();g.restore();}
function birdShape(g,x,y,s,flap){g.save();g.translate(x,y);g.scale(s,s);g.strokeStyle=INK;g.lineWidth=3;g.lineCap="round";const w=Math.sin(flap)*10;g.beginPath();g.moveTo(-14,-w);g.quadraticCurveTo(-5,-8-w,0,0);g.quadraticCurveTo(5,-8-w,14,-w);g.stroke();g.restore();}
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
 paper:{bg(g){bgGrad(g,"#2a2013","#120c06");},fg(g,t,st){
  const z=1+st*.006;g.save();g.translate(480,360);g.rotate(-.045);g.scale(z,z);
  g.shadowColor="rgba(0,0,0,.8)";g.shadowBlur=40;g.shadowOffsetY=16;
  g.fillStyle="#e3d2a8";g.fillRect(-330,-300,660,600);g.shadowColor="transparent";
  g.fillStyle="#241a0d";g.textAlign="center";g.font='52px "Rozha One", serif';g.fillText("आज़ाद भारत",0,-236);
  g.font='13px "Special Elite", monospace';g.fillText("THE FREE INDIA · VOL. I · No. 1 · SATURDAY, AUGUST 16, 1947 · PRICE ONE ANNA",0,-208);
  g.strokeStyle="#241a0d";g.lineWidth=2;g.beginPath();g.moveTo(-310,-194);g.lineTo(310,-194);g.stroke();
  g.font='46px "Rozha One", serif';g.fillText("INDIA WINS FREEDOM",0,-140);
  g.font='26px "Rozha One", serif';g.fillText("भारत आज़ाद! — अर्धरात्रि को नया युग आरंभ",0,-100);
  g.fillStyle="#3a2f1c";g.fillRect(-310,-78,300,240);
  g.save();g.beginPath();g.rect(-310,-78,300,240);g.clip();g.fillStyle="#6b543a";g.fillRect(-310,-78,300,240);dome(g,-160,150,.5);waveFlag(g,-190,-60,90,54,t*3);g.restore();
  g.fillStyle="rgba(20,16,10,.25)";for(let yy=-78;yy<162;yy+=5)for(let xx=-310;xx<-10;xx+=5){if(sr(xx*yy)>.4)g.fillRect(xx,yy,2,2);}
  g.fillStyle="#241a0d";g.font='15px "Special Elite", monospace';g.textAlign="left";g.fillText("'A TRYST WITH DESTINY'",10,-64);
  for(let c=0;c<2;c++)for(let i=0;i<24;i++){const w=120+sr(c*40+i)*160;g.fillStyle="rgba(36,26,13,.55)";g.fillRect(10+c*160,-40+i*9,Math.min(w,140),3);}
  for(let i=0;i<10;i++){g.fillStyle="rgba(36,26,13,.55)";g.fillRect(-310,186+i*10,240+sr(i)*340,3);}
  g.font='17px "Special Elite", monospace';g.fillStyle="#241a0d";g.fillText("MIDNIGHT: THE WORLD SLEEPS, INDIA AWAKES TO LIFE AND FREEDOM.",-310,300-14,620);
  g.restore();}},
 march:{bg(g,t){bgGrad(g,"#8a7148","#3a2c18");glow(g,480,240,420,"rgba(240,220,170,.5)",.7);g.fillStyle="rgba(58,44,24,.5)";dome(g,480,470,1.15);},fg(g,t,st){
  g.fillStyle="#241a0d";g.fillRect(-6,560,W+12,H-554);
  g.save();g.globalAlpha=.5;for(let i=0;i<14;i++){const x=((i*90+t*26)%(W+140))-70;fig(g,x,540,.55,t*4+i,i%5===0);}g.restore();
  for(let i=0;i<9;i++){const x=((i*130+t*52)%(W+180))-90;fig(g,x,650,1.05,t*4.4+i*2,i%3===0);}
  g.fillStyle="rgba(20,14,8,.2)";g.fillRect(-6,0,W+12,H+6);motes(g,t,16,3);}},
 flag:{bg(g,t){bgGrad(g,"#a68a58","#4a3a20");glow(g,480,300,460,"rgba(240,220,170,.65)",.8);},fg(g,t){
  g.save();g.strokeStyle="rgba(240,220,170,.28)";g.lineWidth=26;for(let i=0;i<10;i++){const a=t*.08+i/10*6.28;g.beginPath();g.moveTo(480,330);g.lineTo(480+Math.cos(a)*800,330+Math.sin(a)*800);g.stroke();}g.restore();
  dome(g,480,640,1.5);
  g.strokeStyle="#14100a";g.lineWidth=8;g.beginPath();g.moveTo(480,600);g.lineTo(480,150);g.stroke();
  waveFlag(g,484,150,190,110,t*3);
  for(let i=0;i<7;i++)birdShape(g,(120+i*130+t*30)%W,120+sr(i)*140+Math.sin(t+i)*10,1.1,t*7+i);}},
 street:{bg(g,t){bgGrad(g,"#1c1712","#0a0806");glow(g,700,90,180,"rgba(159,196,201,.4)",.6);g.fillStyle="#cbb98e";g.beginPath();g.arc(700,90,26,0,7);g.fill();},fg(g,t,st){
  const vx=480,vy=310;
  g.strokeStyle="rgba(120,100,70,.5)";g.lineWidth=3;g.beginPath();g.moveTo(-40,H);g.lineTo(vx,vy);g.moveTo(W+40,H);g.lineTo(vx,vy);g.stroke();
  for(let i=0;i<7;i++){const p=(i+ (st*.35)%1)/7;const y=lerp(H,vy,p*p),sc=1-p;g.strokeStyle="rgba(120,100,70,.3)";g.beginPath();g.moveTo(lerp(-40,vx,p*p),y);g.lineTo(lerp(W+40,vx,p*p),y);g.stroke();
   for(const side of[-1,1]){const lx=vx+side*lerp(430,26,p*p);g.strokeStyle="#14100a";g.lineWidth=6*sc+1;g.beginPath();g.moveTo(lx,y);g.lineTo(lx,y-170*sc);g.stroke();const fl=.6+.4*sr(Math.floor(t*9)+i);glow(g,lx,y-170*sc,70*sc+8,`rgba(240,196,106,${.5*fl})`,.8);g.fillStyle="#e8d9b5";g.beginPath();g.arc(lx,y-170*sc,5*sc+1,0,7);g.fill();
   g.fillStyle="rgba(240,196,106,.06)";g.beginPath();g.moveTo(lx,y-170*sc);g.lineTo(lx-50*sc,y);g.lineTo(lx+50*sc,y);g.closePath();g.fill();}}
  const p=clamp(st/12,0,1)*.7;const fy=lerp(H-30,vy+16,p*p),fs=lerp(1.5,.18,p);
  g.fillStyle="rgba(10,8,6,.5)";g.beginPath();g.ellipse(vx+8,fy+4,60*fs,10*fs,0,0,7);g.fill();
  fig(g,vx+8,fy,fs,t*4,false);
  g.fillStyle="rgba(28,23,18,.35)";for(let i=0;i<3;i++)g.fillRect(-6,240+i*90+Math.sin(t*.4+i)*12,W+12,34);}},
 train:{bg(g,t){bgGrad(g,"#241c12","#0e0a06");},fg(g,t,st){
  g.fillStyle="#171009";g.fillRect(-6,150,W+12,260);
  for(let i=0;i<3;i++){const x=60+i*310;g.fillStyle="#0a0806";g.fillRect(x,180,250,180);g.strokeStyle="#5a4322";g.lineWidth=5;g.strokeRect(x,180,250,180);
   g.save();g.beginPath();g.rect(x,180,250,180);g.clip();for(let k=0;k<9;k++){const lx=x+250-((t*560+k*140+i*60)%400);g.fillStyle=`rgba(240,220,170,${.25+.35*sr(k+i)})`;g.fillRect(lx,200+sr(k*3+i)*130,60+sr(k)*70,5);}g.restore();}
  g.strokeStyle="#8a5f22";g.lineWidth=7;g.beginPath();g.moveTo(-6,130);g.lineTo(W+6,130);g.stroke();
  for(let i=0;i<6;i++){const x=95+i*160,a=Math.sin(t*2.1+i*1.3)*.13;g.save();g.translate(x,130);g.rotate(a);g.strokeStyle="#3a2c18";g.lineWidth=5;g.beginPath();g.moveTo(0,0);g.lineTo(0,64);g.stroke();g.strokeStyle="#8a5f22";g.lineWidth=6;g.beginPath();g.arc(0,84,20,0,7);g.stroke();g.restore();}
  g.fillStyle="#14100a";for(let i=0;i<12;i++){const x=30+i*84+Math.sin(t*2+i)*4,h=150+sr(i)*70;g.beginPath();g.arc(x,H-h,26+sr(i+4)*8,0,7);g.fill();g.fillRect(x-42,H-h+16,84,h);
   g.fillStyle="rgba(20,16,10,.9)";}
  g.fillStyle="rgba(14,10,6,.4)";g.fillRect(-6,H-70,W+12,76);}},
 gate:{bg(g,t){bgGrad(g,"#4a3a24","#1c140c");},fg(g,t,st){
  g.save();g.globalAlpha=.4;for(let i=0;i<10;i++){const x=((i*110+t*30)%(W+120))-60;fig(g,x,560,.6,t*4+i,false);}g.restore();
  g.fillStyle="rgba(20,14,8,.35)";g.fillRect(-6,0,W+12,H+6);
  for(let i=0;i<9;i++){const x=40+i*110;g.fillStyle="#100c08";g.fillRect(x,-6,20,H+12);g.fillStyle="#2c2013";g.fillRect(x+3,-6,4,H+12);for(let yy=60;yy<H;yy+=140){g.fillStyle="#3a2c18";g.beginPath();g.arc(x+10,yy,5,0,7);g.fill();}}
  g.fillStyle="#100c08";g.fillRect(-6,120,W+12,26);g.fillRect(-6,520,W+12,26);
  // padlock
  g.save();g.translate(480,360);g.rotate(Math.sin(t*.8)*.04);
  g.strokeStyle="#0e0a06";g.lineWidth=22;g.beginPath();g.arc(0,-70,52,Math.PI,0);g.stroke();
  const lg=g.createLinearGradient(-80,-30,80,90);lg.addColorStop(0,"#3a2c18");lg.addColorStop(1,"#171009");g.fillStyle=lg;g.beginPath();g.moveTo(-80,-30);g.quadraticCurveTo(-90,90,-60,96);g.lineTo(60,96);g.quadraticCurveTo(90,90,80,-30);g.closePath();g.fill();g.strokeStyle="#8a5f22";g.lineWidth=3;g.stroke();
  g.fillStyle="#0a0806";g.beginPath();g.arc(0,26,15,0,7);g.fill();g.fillRect(-6,26,12,34);
  g.restore();
  // chain
  g.save();g.strokeStyle="#241a0d";g.lineWidth=8;for(let i=0;i<12;i++){const x=120+i*66,y=330+Math.sin(i*.9)*24;g.save();g.translate(x,y);g.rotate(i%2?.9:.2);g.beginPath();g.ellipse(0,0,26,14,0,0,7);g.stroke();g.restore();}g.restore();
  // moving bar shadows
  g.fillStyle="rgba(5,4,3,.45)";for(let i=0;i<6;i++){const x=((i*200+t*22)%(W+300))-150;g.save();g.translate(x,0);g.transform(1,0,-.35,1,0,0);g.fillRect(0,-6,44,H+12);g.restore();}}},
 book:{bg(g){bgGrad(g,"#2c2013","#100b06");glow(g,800,110,300,"rgba(240,196,106,.4)",.7);},fg(g,t,st){
  g.fillStyle="#241608";g.fillRect(-6,540,W+12,H-534);
  const titles=["ON LIBERTY","स्वराज","SOCIAL CONTRACT","दो बीघा"];
  for(let i=0;i<4;i++){g.save();g.translate(120,540-i*46);g.fillStyle=["#3a2c18","#4a3418","#2c2013","#5a4020"][i];g.fillRect(-70,-42,240-i*18,42);g.strokeStyle="#8a5f22";g.lineWidth=2;g.strokeRect(-70,-42,240-i*18,42);g.fillStyle="#e8d9b5";g.font='17px "Tiro Devanagari Hindi", serif';g.textAlign="left";g.fillText(titles[i],-52,-14);g.restore();}
  // open book
  g.save();g.translate(560,470);
  g.fillStyle="#d8c69a";g.beginPath();g.moveTo(-250,20);g.quadraticCurveTo(-130,-30,0,10);g.quadraticCurveTo(130,-30,250,20);g.lineTo(250,120);g.quadraticCurveTo(130,80,0,116);g.quadraticCurveTo(-130,80,-250,120);g.closePath();g.fill();g.strokeStyle="#6b4d26";g.lineWidth=3;g.stroke();
  g.strokeStyle="rgba(74,52,24,.5)";g.lineWidth=1.5;for(let i=0;i<8;i++){g.beginPath();g.moveTo(-225,26+i*11);g.quadraticCurveTo(-120,-8+i*11,-20,20+i*11);g.stroke();g.beginPath();g.moveTo(20,20+i*11);g.quadraticCurveTo(120,-8+i*11,225,26+i*11);g.stroke();}
  g.strokeStyle="#3a2a12";g.beginPath();g.moveTo(0,10);g.lineTo(0,116);g.stroke();
  const flips=[2,5.4,8.8];for(const f0 of flips){const p=(st-f0)/1.2;if(p>0&&p<1){const a=p*Math.PI;g.save();g.translate(0,10);g.fillStyle="#e8d9b5";g.beginPath();g.moveTo(0,0);g.quadraticCurveTo(Math.cos(a)*230,-60-Math.sin(a)*90,Math.cos(a)*240,10-Math.sin(a)*30);g.lineTo(Math.cos(a)*240,110-Math.sin(a)*30);g.quadraticCurveTo(Math.cos(a)*120,70-Math.sin(a)*60,0,106);g.closePath();g.fill();g.strokeStyle="rgba(74,52,24,.6)";g.stroke();g.restore();}}
  g.restore();
  // lamp
  g.fillStyle="#171009";g.fillRect(806,240,10,180);g.beginPath();g.moveTo(760,240);g.lineTo(862,240);g.lineTo(838,190);g.lineTo(784,190);g.closePath();g.fill();glow(g,811,250,90,"rgba(240,196,106,.8)",.8);
  motes(g,t,22,11);}},
 sages:{bg(g){bgGrad(g,"#261d11","#0e0a06");},fg(g,t,st){
  const pan=lerp(-160,160,eo(clamp(st/13,0,1)));
  const sages=[["J. S. MILL","1806–1873",0],["I. BERLIN","1909–1997",1],["J-J. ROUSSEAU","1712–1778",2]];
  sages.forEach((sg,i)=>{const x=200+i*290-pan;g.save();g.translate(x,340);
   g.fillStyle="#d8c69a";g.beginPath();g.ellipse(0,0,118,152,0,0,7);g.fill();g.strokeStyle="#8a5f22";g.lineWidth=5;g.stroke();g.lineWidth=1.5;g.beginPath();g.ellipse(0,0,106,140,0,0,7);g.stroke();
   g.save();g.beginPath();g.ellipse(0,0,104,138,0,0,7);g.clip();
   g.strokeStyle="rgba(74,52,24,.25)";for(let k=-14;k<14;k++){g.beginPath();g.moveTo(k*10-40,-150);g.lineTo(k*10+40,150);g.stroke();}
   g.fillStyle="#241a0d";g.beginPath();g.arc(0,-38,34,0,7);g.fill();g.beginPath();g.ellipse(0,66,62,60,0,Math.PI,0);g.fill();g.fillRect(-62,60,124,90);
   if(i===0){g.beginPath();g.ellipse(0,-4,26,30,0,0,Math.PI);g.fill();}
   if(i===1){g.strokeStyle="#d8c69a";g.lineWidth=3;g.beginPath();g.arc(-13,-42,9,0,7);g.stroke();g.beginPath();g.arc(13,-42,9,0,7);g.stroke();g.beginPath();g.moveTo(-4,-42);g.lineTo(4,-42);g.stroke();}
   if(i===2){g.fillStyle="#241a0d";for(let k=0;k<5;k++){g.beginPath();g.arc(-36+k*18,-64,12,0,7);g.fill();}g.beginPath();g.arc(-38,-30,10,0,7);g.fill();g.beginPath();g.arc(38,-30,10,0,7);g.fill();}
   g.restore();
   g.fillStyle="#e8d9b5";g.textAlign="center";g.font='19px "Special Elite", monospace';g.fillText(sg[0],0,196);g.font='12px "Special Elite", monospace';g.fillStyle="#a67c44";g.fillText(sg[1],0,218);
   g.restore();});
  g.fillStyle="rgba(10,8,6,.35)";g.fillRect(-6,0,W+12,H+6);motes(g,t,12,17);}},
 ink:{bg(g,t){bgGrad(g,"#1c150c","#0c0906");glow(g,480,300,420,"rgba(232,217,181,.12)",.8);},fg(g,t,st){
  g.save();g.translate(150,560);g.fillStyle="#171009";g.beginPath();g.moveTo(-46,0);g.quadraticCurveTo(-56,-70,0,-74);g.quadraticCurveTo(56,-70,46,0);g.closePath();g.fill();g.strokeStyle="#8a5f22";g.lineWidth=2;g.stroke();g.fillStyle="#0a0806";g.beginPath();g.ellipse(0,-72,26,8,0,0,7);g.fill();
  g.save();g.translate(10,-70);g.rotate(-.7+Math.sin(t*1.2)*.03);g.strokeStyle="#e8d9b5";g.lineWidth=4;g.beginPath();g.moveTo(0,0);g.lineTo(150,-120);g.stroke();g.fillStyle="#e8d9b5";g.beginPath();g.moveTo(30,-24);g.quadraticCurveTo(120,-140,152,-122);g.quadraticCurveTo(120,-90,40,-16);g.closePath();g.fill();g.restore();g.restore();
  // balance scale
  g.save();g.translate(790,520);const tilt=Math.sin(t*.7)*.1;g.strokeStyle="#a67c44";g.lineWidth=4;g.beginPath();g.moveTo(0,60);g.lineTo(0,-80);g.stroke();g.beginPath();g.moveTo(-50,60);g.lineTo(50,60);g.stroke();
  g.save();g.translate(0,-80);g.rotate(tilt);g.beginPath();g.moveTo(-90,0);g.lineTo(90,0);g.stroke();for(const s of[-1,1]){g.beginPath();g.moveTo(s*90,0);g.lineTo(s*90,44);g.stroke();g.beginPath();g.arc(s*90,52,26,0,Math.PI);g.stroke();}
  g.fillStyle="#e8d9b5";g.font='12px "Special Elite", monospace';g.textAlign="center";g.fillText("FROM",-90,102);g.fillText("TO",90,102);g.restore();g.restore();
  g.strokeStyle="rgba(217,164,65,.2)";g.lineWidth=2;for(let i=0;i<3;i++){g.beginPath();g.moveTo(100,620+i*8);g.bezierCurveTo(300,600+Math.sin(t+i)*14,600,640+Math.cos(t*.7+i)*14,880,616+i*8);g.stroke();}}},
 charkha:{bg(g){bgGrad(g,"#3a2c18","#140e08");glow(g,300,300,380,"rgba(240,196,106,.3)",.7);},fg(g,t,st){
  const ang=t*1.5;
  g.fillStyle="#241608";g.fillRect(60,570,840,26);g.fillRect(120,596,26,90);g.fillRect(760,596,26,90);
  g.save();g.translate(330,430);
  g.strokeStyle="#171009";g.lineWidth=14;g.beginPath();g.arc(0,0,150,0,7);g.stroke();g.strokeStyle="#8a5f22";g.lineWidth=4;g.beginPath();g.arc(0,0,150,0,7);g.stroke();g.beginPath();g.arc(0,0,138,0,7);g.stroke();
  g.strokeStyle="#241608";g.lineWidth=8;for(let i=0;i<12;i++){const a=ang+i/12*6.28;g.beginPath();g.moveTo(Math.cos(a)*16,Math.sin(a)*16);g.lineTo(Math.cos(a)*140,Math.sin(a)*140);g.stroke();}
  g.strokeStyle="rgba(240,196,106,.15)";g.lineWidth=20;g.beginPath();g.arc(0,0,120,ang,ang+1.2);g.stroke();
  g.fillStyle="#171009";g.beginPath();g.arc(0,0,18,0,7);g.fill();g.strokeStyle="#d9a441";g.lineWidth=3;g.stroke();g.restore();
  g.strokeStyle="#3a2c18";g.lineWidth=5;g.beginPath();g.moveTo(330,282);g.lineTo(716,442);g.moveTo(330,578);g.lineTo(716,486);g.stroke();
  g.save();g.translate(720,464);g.strokeStyle="#171009";g.lineWidth=8;g.beginPath();g.arc(0,0,24,0,7);g.stroke();g.strokeStyle="#8a5f22";g.lineWidth=3;for(let i=0;i<6;i++){const a=ang*6+i/6*6.28;g.beginPath();g.moveTo(0,0);g.lineTo(Math.cos(a)*22,Math.sin(a)*22);g.stroke();}g.restore();
  g.strokeStyle="#e8d9b5";g.lineWidth=1.5;g.beginPath();g.moveTo(744,464);g.quadraticCurveTo(830,470+Math.sin(t*3)*5,930,452);g.stroke();
  g.fillStyle="#e8d9b5";g.beginPath();g.ellipse(930,452,20,12,0,0,7);g.fill();
  if(st>7){g.save();g.translate(770,180);g.rotate(.1);g.globalAlpha=Math.min(1,(st-7));g.fillStyle="#e8d9b5";g.fillRect(-92,-104,184,208);g.fillStyle="#5a4020";g.fillRect(-80,-92,160,160);
   g.fillStyle="#1c140c";g.beginPath();g.arc(0,-40,30,0,7);g.fill();g.beginPath();g.ellipse(0,42,52,44,0,Math.PI,0);g.fill();g.fillRect(-52,38,104,32);
   g.strokeStyle="#e8d9b5";g.lineWidth=3;g.beginPath();g.arc(-12,-42,10,0,7);g.stroke();g.beginPath();g.arc(12,-42,10,0,7);g.stroke();g.beginPath();g.moveTo(-2,-42);g.lineTo(2,-42);g.stroke();g.beginPath();g.arc(0,-28,8,.3,2.8);g.stroke();
   g.fillStyle="#241a0d";g.font='16px "Tiro Devanagari Hindi", serif';g.textAlign="center";g.fillText("बापू · 1930",0,92);g.restore();}
  motes(g,t,18,23);}},
 haveli:{bg(g,t){bgGrad(g,"#4a3820","#1c140c");},fg(g,t,st){
  // cusped arch
  g.fillStyle="#100c08";g.beginPath();g.moveTo(60,H);g.lineTo(60,260);let ax=60;for(let i=0;i<7;i++){g.quadraticCurveTo(ax+60,150+Math.abs(3-i)*24,ax+120,260-Math.abs(3-i)*0);ax+=120;}g.lineTo(900,H);g.lineTo(960,H);g.lineTo(960,-6);g.lineTo(-6,-6);g.lineTo(-6,H);g.closePath();g.fill("evenodd");
  g.strokeStyle="#8a5f22";g.lineWidth=4;g.beginPath();g.moveTo(60,H);g.lineTo(60,260);let bx=60;for(let i=0;i<7;i++){g.quadraticCurveTo(bx+60,150+Math.abs(3-i)*24,bx+120,260);bx+=120;}g.lineTo(900,H);g.stroke();
  // jharokha window
  g.fillStyle="#caa76a";g.fillRect(640,220,180,220);g.strokeStyle="#241608";g.lineWidth=6;g.strokeRect(640,220,180,220);for(let i=1;i<4;i++){g.beginPath();g.moveTo(640+i*45,220);g.lineTo(640+i*45,440);g.stroke();}for(let i=1;i<5;i++){g.beginPath();g.moveTo(640,220+i*44);g.lineTo(820,220+i*44);g.stroke();}
  g.fillStyle="rgba(240,220,170,.13)";g.beginPath();g.moveTo(640,220);g.lineTo(820,220);g.lineTo(560,660);g.lineTo(260,660);g.closePath();g.fill();
  // charpai
  g.save();g.translate(260,600);g.strokeStyle="#241608";g.lineWidth=8;g.beginPath();g.moveTo(-120,0);g.lineTo(-120,60);g.moveTo(120,0);g.lineTo(120,60);g.moveTo(-90,-14);g.lineTo(-90,46);g.moveTo(150,-14);g.lineTo(150,46);g.stroke();g.fillStyle="#8a6a34";g.beginPath();g.moveTo(-130,-8);g.lineTo(130,-8);g.lineTo(160,-26);g.lineTo(-100,-26);g.closePath();g.fill();g.strokeStyle="rgba(36,22,8,.6)";g.lineWidth=2;for(let i=0;i<12;i++){g.beginPath();g.moveTo(-124+i*22,-8);g.lineTo(-96+i*22,-26);g.stroke();}g.restore();
  // tulsi
  g.fillStyle="#241608";g.beginPath();g.moveTo(470,660);g.lineTo(510,660);g.lineTo(502,600);g.lineTo(478,600);g.closePath();g.fill();g.strokeStyle="#3a5a2e";g.lineWidth=4;for(let i=0;i<5;i++){g.beginPath();g.moveTo(490,600);g.quadraticCurveTo(490+(i-2)*16,560,490+(i-2)*24,540+Math.abs(i-2)*10);g.stroke();}
  g.strokeStyle="rgba(138,95,34,.3)";for(let i=0;i<6;i++){g.beginPath();g.moveTo(-6,640+i*16);g.lineTo(W+6,632+i*18);g.stroke();}
  motes(g,t,30,29);}},
 mirror:{bg(g){bgGrad(g,"#241c12","#0c0906");},fg(g,t,st){
  g.save();g.translate(500,330);
  g.fillStyle="#0e0a06";g.beginPath();g.ellipse(0,0,158,218,0,0,7);g.fill();
  g.save();g.beginPath();g.ellipse(0,0,146,206,0,0,7);g.clip();
  const roadP=clamp((st-8)/3,0,1);
  const mg=g.createRadialGradient(0,-40,20,0,0,240);mg.addColorStop(0,"#8a7148");mg.addColorStop(1,"#241c12");g.fillStyle=mg;g.fillRect(-160,-220,320,440);
  if(roadP<1){g.save();g.globalAlpha=1-roadP;const lag=Math.sin((t-.6)*.5)*.06;g.translate(14,40);g.rotate(lag);
   g.fillStyle="rgba(28,20,12,.85)";g.beginPath();g.arc(0,-60,34,0,7);g.fill();g.beginPath();g.ellipse(0,60,70,80,0,Math.PI,0);g.fill();g.fillRect(-70,56,140,160);
   g.globalAlpha=(1-roadP)*(.4+.3*Math.sin(t*2));birdShape(g,0,-130,1.6,t*8);g.restore();}
  if(roadP>0){g.save();g.globalAlpha=roadP;g.fillStyle="#3a2c18";g.fillRect(-160,20,320,200);g.fillStyle="#171009";g.beginPath();g.moveTo(-140,220);g.lineTo(-16,10);g.lineTo(16,10);g.lineTo(140,220);g.closePath();g.fill();
   g.strokeStyle="#e8d9b5";g.lineWidth=4;for(let i=0;i<6;i++){const p=((t*.6+i/6)%1);const y=lerp(216,14,p*p);g.globalAlpha=roadP*(1-p);g.beginPath();g.moveTo(0,y);g.lineTo(0,y-14*(1-p)-3);g.stroke();}
   g.globalAlpha=roadP;g.strokeStyle="#241608";g.lineWidth=10;g.beginPath();g.moveTo(0,-220);g.lineTo(0,220);g.moveTo(-160,-20);g.lineTo(160,-20);g.stroke();g.restore();}
  g.restore();
  g.strokeStyle="#8a5f22";g.lineWidth=10;g.beginPath();g.ellipse(0,0,152,212,0,0,7);g.stroke();g.strokeStyle="#d9a441";g.lineWidth=2;g.beginPath();g.ellipse(0,0,160,220,0,0,7);g.stroke();
  g.fillStyle="#8a5f22";g.beginPath();g.ellipse(0,-228,20,12,0,0,7);g.fill();
  g.restore();
  // viewer from behind
  g.fillStyle="#0a0806";g.beginPath();g.arc(430,560,44,0,7);g.fill();g.beginPath();g.ellipse(430,700,110,110,0,Math.PI,0);g.fill();g.fillRect(320,690,220,40);
  glow(g,500,330,300,"rgba(159,196,201,.12)",.7);motes(g,t,14,31);}},
 class:{bg(g,t){bgGrad(g,"#5a4828","#241c12");glow(g,830,180,300,"rgba(240,220,170,.5)",.7);},fg(g,t,st){
  g.fillStyle="#caa76a";g.fillRect(760,120,170,240);g.strokeStyle="#241608";g.lineWidth=6;g.strokeRect(760,120,170,240);g.beginPath();g.moveTo(845,120);g.lineTo(845,360);g.moveTo(760,240);g.lineTo(930,240);g.stroke();
  for(let i=0;i<3;i++)birdShape(g,780+((t*26+i*50)%150),150+i*40+Math.sin(t*2+i)*6,.7,t*8+i);
  g.fillStyle="rgba(240,220,170,.12)";g.beginPath();g.moveTo(760,120);g.lineTo(930,120);g.lineTo(660,640);g.lineTo(420,640);g.closePath();g.fill();
  // slate board
  g.fillStyle="#171009";g.fillRect(120,110,420,200);g.strokeStyle="#8a5f22";g.lineWidth=6;g.strokeRect(120,110,420,200);
  g.fillStyle="#e8d9b5";g.font='64px "Tiro Devanagari Hindi", serif';g.textAlign="left";
  const letters=["क","ख","ग"];const n=Math.min(3,Math.floor(st/2.4)+1);for(let i=0;i<n;i++){g.globalAlpha=Math.min(1,(st-i*2.4)*2);g.fillText(letters[i],170+i*120,240);}g.globalAlpha=1;
  g.font='16px "Special Elite", monospace';g.fillStyle="#a67c44";g.fillText("पाठ एक · LESSON ONE",170,290);
  // children at desks
  for(let r=0;r<2;r++)for(let i=0;i<4;i++){const x=140+i*200+r*60,y=520+r*120,s=.8+r*.25;g.save();g.translate(x,y);g.scale(s,s);
   g.fillStyle="#241608";g.fillRect(-56,10,130,14);g.fillRect(-48,24,10,50);g.fillRect(56,24,10,50);
   g.fillStyle="#14100a";g.beginPath();g.arc(0,-52,17,0,7);g.fill();g.beginPath();g.ellipse(0,-6,30,42,0,Math.PI,0);g.fill();g.fillRect(-30,-8,60,20);
   g.strokeStyle="#14100a";g.lineWidth=7;g.lineCap="round";g.beginPath();g.moveTo(14,-24);g.lineTo(40+Math.sin(t*6+i+r)*4,-2+Math.cos(t*6+i)*2);g.stroke();
   g.fillStyle="#e8d9b5";g.fillRect(20,2,44,8);g.restore();}
  motes(g,t,20,37);}},
 vote:{bg(g,t){bgGrad(g,"#8a6a34","#3a2c18");glow(g,480,560,500,"rgba(240,196,106,.4)",.7);},fg(g,t,st){
  if(st<6){ // women walking
   glow(g,480,300,300,"rgba(240,220,170,.5)",.8);g.fillStyle="#241a0d";g.fillRect(-6,580,W+12,H-574);
   for(let i=0;i<3;i++){const x=((t*70+i*300)%(W+260))-130,s=1.15-i*.12,y=600-i*24;
    g.save();g.globalAlpha=.35;g.fillStyle="#0a0806";g.beginPath();g.ellipse(x+40,y+6,90*s,12,0,0,7);g.fill();g.restore();
    fig(g,x,y,s,t*4.6+i*2,false);
    g.strokeStyle="#14100a";g.lineWidth=6;g.beginPath();g.moveTo(x-4,y-92*s);for(let k=1;k<=8;k++)g.lineTo(x-4-k*14*s,y-92*s+Math.sin(t*4+k*.8+i)*10+k*3);g.stroke();}
  }else{ // inked finger + ballot
   g.save();g.translate(330,720);g.fillStyle="#14100a";g.beginPath();g.moveTo(-70,0);g.quadraticCurveTo(-80,-190,-40,-230);g.lineTo(60,-230);g.quadraticCurveTo(100,-180,90,0);g.closePath();g.fill();
   g.beginPath();g.moveTo(-16,-224);g.quadraticCurveTo(-26,-420,4,-430);g.quadraticCurveTo(36,-420,28,-224);g.closePath();g.fill();
   if(st>7.6){const a=Math.min(1,(st-7.6)*2);g.globalAlpha=a;g.fillStyle="#0a0602";g.beginPath();g.ellipse(5,-390,15,22,0,0,7);g.fill();g.fillStyle="rgba(159,196,201,.5)";g.beginPath();g.ellipse(0,-398,4,7,-.4,0,7);g.fill();g.globalAlpha=1;glow(g,5,-390,60,"rgba(159,196,201,.4)",a*.6);}
   g.restore();
   g.save();g.translate(700,470);g.fillStyle="#241608";g.fillRect(-130,-60,260,220);g.strokeStyle="#8a5f22";g.lineWidth=4;g.strokeRect(-130,-60,260,220);g.fillStyle="#0a0806";g.fillRect(-70,-46,140,10);
   g.fillStyle="#e8d9b5";g.font='30px "Rozha One", serif';g.textAlign="center";g.fillText("मतदान",0,60);g.font='14px "Special Elite", monospace';g.fillStyle="#a67c44";g.fillText("· VOTE ·",0,90);
   g.save();g.rotate(-.06);g.fillStyle="#e3d2a8";g.fillRect(-40,-110,80,54);g.strokeStyle="#3a2a12";g.strokeRect(-40,-110,80,54);g.strokeStyle="#3a2a12";g.lineWidth=2;g.beginPath();g.arc(0,-88,12,0,7);g.stroke();for(let i=0;i<8;i++){const a=i/8*6.28;g.beginPath();g.moveTo(0,-88);g.lineTo(Math.cos(a)*12,-88+Math.sin(a)*12);g.stroke();}g.restore();
   g.restore();}
  motes(g,t,14,41);}},
 dawn:{bg(g,t,st){const p=clamp((st-5)/6,0,1);
  const gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,st<5?"#3a2c18":"#7a5c2e");gr.addColorStop(.6,"#8a6a34");gr.addColorStop(1,"#241c12");g.fillStyle=gr;g.fillRect(-6,-6,W+12,H+12);
  const sy=lerp(560,400,p);glow(g,480,sy,420,"rgba(240,196,106,.75)",.9);
  g.fillStyle="#f0c46a";g.beginPath();g.arc(480,sy,70,0,7);g.fill();
  g.save();g.strokeStyle="rgba(240,196,106,.3)";g.lineWidth=14;for(let i=0;i<12;i++){const a=t*.1+i/12*6.28;g.beginPath();g.moveTo(480+Math.cos(a)*90,sy+Math.sin(a)*90);g.lineTo(480+Math.cos(a)*700,sy+Math.sin(a)*700);g.stroke();}g.restore();
  g.fillStyle="rgba(232,217,181,.2)";for(let i=0;i<4;i++){const y=140+i*80;g.beginPath();g.ellipse(((t*14+i*260)%(W+300))-150,y,130,16,0,0,7);g.fill();}},fg(g,t,st){
  if(st<6){g.fillStyle="#241a0d";g.fillRect(-6,600,W+12,H-594);
   for(let i=0;i<8;i++){const x=80+i*115,bob=Math.sin(t*2.4+i)*5;g.save();g.translate(x,600+bob);
    g.fillStyle="#14100a";g.beginPath();g.arc(0,-84,13,0,7);g.fill();g.fillRect(-12,-72,24,50);g.beginPath();g.moveTo(-12,-24);g.lineTo(-16,0);g.lineTo(-6,0);g.lineTo(0,-20);g.lineTo(6,0);g.lineTo(16,0);g.lineTo(12,-24);g.closePath();g.fill();
    g.strokeStyle="#14100a";g.lineWidth=6;g.lineCap="round";g.beginPath();g.moveTo(8,-64);g.lineTo(26,-108-bob);g.stroke();
    g.save();g.translate(26,-108-bob);g.rotate(Math.sin(t*2+i)*.06);g.strokeStyle="#3a2c18";g.lineWidth=4;g.beginPath();g.moveTo(0,0);g.lineTo(0,-46);g.stroke();g.fillStyle="#e3d2a8";g.fillRect(-42,-92,84,48);g.strokeStyle="#3a2a12";g.lineWidth=2;g.strokeRect(-42,-92,84,48);g.fillStyle="#241a0d";g.font='19px "Tiro Devanagari Hindi", serif';g.textAlign="center";g.fillText(["सवाल?","उम्मीद","आज़ादी?","हिम्मत"][i%4],0,-62);g.restore();g.restore();}}
  g.fillStyle="#1c140c";g.beginPath();g.moveTo(-6,H);g.lineTo(-6,640);g.quadraticCurveTo(300,600,520,650);g.quadraticCurveTo(760,690,966,640);g.lineTo(966,H);g.closePath();g.fill();
  for(let i=0;i<9;i++){const bx=((t*36+i*140)%(W+200))-100,by=110+sr(i)*180+Math.sin(t*1.4+i)*12;birdShape(g,bx,by,1+sr(i+3)*.6,t*7+i);}
  motes(g,t,12,43);}},
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
 g.globalCompositeOperation="source-over";
 const fl=S.flick/100;const k=Math.floor(ft*24);
 g.fillStyle=`rgba(0,0,0,${fl*(.04+.09*sr(k+.3))})`;g.fillRect(0,0,W,H);
 if(sr(k*1.7)>.985){g.fillStyle=`rgba(255,240,210,${fl*.06})`;g.fillRect(0,0,W,H);}
}
function drawScene(){
 const g=sc;g.setTransform(1,0,0,1,0,0);g.globalAlpha=1;g.globalCompositeOperation="source-over";
 const wv=S.weave/100,k=Math.floor(ft*24);
 g.save();g.translate((sr(k*3.7)-.5)*5*wv,(sr(k*9.1)-.5)*4*wv);
 g.fillStyle="#0a0806";g.fillRect(-8,-8,W+16,H+16);
 const shot=shotAt(ft);
 const vOK=shot.vstate===1&&shot.v&&shot.v.readyState>=2;
 if(vOK){g.globalAlpha=shot.tex;try{drawCover(g,shot.v);}catch(e){}g.globalAlpha=1;}
 const R=REND[shot.r];
 g.save();g.globalAlpha=vOK?.6:1;if(R.bg)R.bg(g,ft,ft-shot.t0);g.globalAlpha=1;if(R.fg)R.fg(g,ft,ft-shot.t0);g.restore();
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
 const m=c.m||"sub";
 if(m==="hand")return `<div class="cap cap-hand"><span class="rev"><span class="hw">${c.hw}</span></span><svg viewBox="0 0 300 14"><path d="M4 8 C 60 2, 120 12, 180 6 S 280 8, 296 5" pathLength="100"/></svg><p class="hi">${c.hi}</p><p class="en">${c.en}</p></div>`;
 if(m==="stamp")return `<div class="cap cap-stamp"><div class="stampbox">${c.hi}<small>${c.en}</small></div></div>`;
 if(m==="fin")return `<div class="cap cap-fin"><p class="hi">${c.hi}</p><p class="en">${c.en}</p></div>`;
 return `<div class="cap"><p class="hi">${c.hi}</p><p class="en">${c.en}</p></div>`;
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
 if(shot!==lastShot){if(lastShot&&shotAt(ft).r!==lastShot.r)shotDip=.18;if(lastShot&&lastShot.v)try{lastShot.v.pause();}catch(e){}
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
 const ROWS_SPACER=[["उम्र / AGE","सदियों पुरानी — CENTURIES OLD"],["पहचान / MARKS","बेख़ौफ़ हँसी, खुली खिड़की, सवाल पूछती आँखें"],["अगर मिले / IF FOUND","अपने भीतर झाँकें — LOOK WITHIN"]];
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
