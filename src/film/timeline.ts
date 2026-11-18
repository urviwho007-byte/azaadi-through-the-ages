// @ts-nocheck
/* Audio-driven film timeline.
   The recordings are the master clock: each reel lasts lead-in + its recording's real (decoded) length + tail,
   and every subtitle is pinned to the moment its words are spoken inside that recording.
   Drawings stay on their original 225 s "picture" timeline; TMAP maps picture time -> film time so each drawn beat
   still lands on its line. Pure data + functions so it can be unit-tested. */
import radioAsset from "@/assets/audio/radio_turning_on.mp3.asset.json";
import urviAsset from "@/assets/audio/urvi_audio_announcement_denoised.mp3.asset.json";
import yashAsset from "@/assets/audio/yashashvi_the_search_denoised.mp3.asset.json";
import shubhiAsset from "@/assets/audio/shubhi_audio_the_invisible_walls_denoised.mp3.asset.json";
import princeAsset from "@/assets/audio/prince_questions_mix_denoised.mp3.asset.json";
import amritAsset from "@/assets/audio/amritansh_audio_the_realisation_denoised.mp3.asset.json";
import satyamAsset from "@/assets/audio/satyam_audio_ending_denoised.mp3.asset.json";
import finaleAsset from "@/assets/audio/last_13_seconds_denoised.mp3.asset.json";

/** Reel boundaries on the picture timeline (seconds). */
export const PIC_REELS = [0, 30, 60, 95, 135, 170, 215, 225];
/** Picture time of the finale burst and the end of the picture. */
export const PIC_BURST = 223.4;

export type VoiceDef = { key: string; url: string; reel: number; lead: number; tail: number; defDur: number };
/** One recorded dialogue file per reel (reel 7 = the "last 13 seconds" recording, which ends at the finale burst).
    Every voice is a de-noised re-master (hum/hiss removed, levelled, soft words lifted; same length and timing as the original
    take). Reel 4 is the user's "prince questions mix" take, which has identical word timing to the first prince recording. lead/tail = the intentional pause before/after the recording,
    taken from the gaps the picture timeline already had around each reel's lines. defDur = measured length,
    used only until the browser has decoded the real file. */
export const VOICES: VoiceDef[] = [
  { key: "urvi", url: urviAsset.url, reel: 0, lead: 6, tail: 0.3, defDur: 33.19 },
  { key: "yashashvi", url: yashAsset.url, reel: 1, lead: 2, tail: 0.3, defDur: 39.74 },
  { key: "shubhi", url: shubhiAsset.url, reel: 2, lead: 1, tail: 0.3, defDur: 46.36 },
  { key: "prince", url: princeAsset.url, reel: 3, lead: 1.5, tail: 1, defDur: 38.93 },
  { key: "amritansh", url: amritAsset.url, reel: 4, lead: 1, tail: 0.3, defDur: 39.53 },
  { key: "satyam", url: satyamAsset.url, reel: 5, lead: 1, tail: 0.3, defDur: 54.63 },
  { key: "finale", url: finaleAsset.url, reel: 6, lead: 0.3, tail: 0.3, defDur: 13.3 },
];
export const RADIO = { key: "radio", url: radioAsset.url, defDur: 72.57 };

/** Opening: the first words come in this long after the static starts fading in… */
export const OPENING_LEAD = 6;
/** …the static keeps going under the first words for this long, then fades out over STATIC_FADE seconds. */
export const STATIC_FADE_DELAY = 1.2;
export const STATIC_FADE = 1.5;
/** Black tail after the finale burst (film seconds). The burst lands right after the reel 7 recording ends. */
export const END_TAIL = 1.6;
/** Subtitles stay up this long after the words finish (never past the next line). */
export const HOLD = 0.6;

export type CapDef = {
  p0: number; p1: number; v?: number; a0?: number; a1?: number; o0?: number; o1?: number;
  m?: string; hi: string; hw?: string; en: string;
};
/** Subtitles: p0/p1 = picture time; v/a0/a1 = recording index and where the words start/end inside it (s);
    Text is unchanged. */
export const CAP_DATA: CapDef[] = [
 {p0:6.0,p1:8.0,v:0,a0:0.3,a1:2.46,hi:"Yeh ek zaroori elaan hai.",en:""},
 {p0:8.5,p1:10.5,v:0,a0:3.36,a1:5.06,hi:"Ek cheez gumshuda hai.",en:""},
 {p0:11.0,p1:13.5,v:0,a0:5.72,a1:7.4,m:"stamp",hi:"Naam hai... Azaadi.",en:""},
 {p0:14.0,p1:16.5,v:0,a0:8.78,a1:11.78,hi:"Kehte hain, ise bahut saalon pehle paaya gaya tha.",en:""},
 {p0:17.0,p1:20.5,v:0,a0:12.36,a1:18.38,hi:"Iske liye ladaaiyaan ladi gayi, qurbaaniyaan di gayi, aur na jaane kitne sapne dekhe gaye.",en:""},
 {p0:21.0,p1:23.0,v:0,a0:19.18,a1:22.26,hi:"Lekin aaj... iska pata kisi ko nahi.",en:""},
 {p0:23.5,p1:26.5,v:0,a0:23.3,a1:26.76,hi:"Aakhri baar ise ek azaad desh mein dekha gaya tha.",en:""},
 {p0:27.0,p1:29.8,v:0,a0:27.56,a1:30.7,hi:"Agar aapko kahin nazar aaye... toh humein zaroor batayein.",en:""},
 {p0:32.0,p1:34.0,v:1,a0:0.44,a1:2.16,hi:"Humne uski talaash shuru ki.",en:""},
 {p0:34.5,p1:38.5,v:1,a0:2.7,a1:9.68,hi:"Purani kitaabon mein, itihaas ke pannon mein, un sadkon par jahan kabhi inquilab ke naare goonjte the.",en:""},
 {p0:39.0,p1:41.0,v:1,a0:11.02,a1:12.68,hi:"Har tasveer mein ek kahaani thi.",en:""},
 {p0:41.0,p1:43.0,v:1,a0:13.58,a1:15.74,hi:"Har kahaani mein ek khwaab tha.",en:""},
 {p0:43.5,p1:46.5,v:1,a0:16.58,a1:19.64,hi:"Ek aise kal ka khwaab, jahan koi kisi se na dare.",en:""},
 {p0:47.0,p1:50.0,v:1,a0:20.38,a1:24.4,hi:"Jahan apni baat kehne ke liye ijazat na maangni pade.",en:""},
 {p0:50.5,p1:53.5,v:1,a0:25.0,a1:28.86,hi:"Jahan jeene ke liye kisi aur ki marzi zaroori na ho.",en:""},
 {p0:54.0,p1:56.0,v:1,a0:29.66,a1:32.58,hi:"Lekin waqt ke saath ek sawaal reh gaya...",en:""},
 {p0:56.5,p1:59.8,v:1,a0:33.6,a1:38.78,hi:"Kya humne sirf ek desh ko azaad karaya tha, ya insaan ko bhi?",en:""},
 {p0:61.0,p1:64.0,v:2,a0:0.06,a1:3.32,hi:"Hum aage badhe... toh kuch deewarein nazar aayi.",en:""},
 {p0:64.5,p1:66.5,v:2,a0:3.6,a1:5.72,hi:"Kuch deewarein patthar ki thi.",en:""},
 {p0:67.0,p1:69.0,v:2,a0:5.76,a1:8.76,hi:"Kuch samaaj ne banayi thi.",en:""},
 {p0:69.5,p1:73.0,v:2,a0:9.2,a1:13.34,hi:"Aur kuch... humne khud apne andar khadi kar li thi.",en:""},
 {p0:73.5,p1:75.5,v:2,a0:13.9,a1:16.9,hi:"Kahin kisi ki awaaz daba di gayi.",en:""},
 {p0:76.0,p1:78.5,v:2,a0:17.3,a1:21.16,hi:"Kahin kisi ke sapnon ko chhota kar diya gaya.",en:""},
 {p0:79.0,p1:84.5,v:2,a0:21.66,a1:30.62,hi:"Kahin kisi ko bataya gaya ki use kaise jeena hai, kya banna hai, kisse milna hai, kya kehna hai.",en:""},
 {p0:85.0,p1:86.5,v:2,a0:31.06,a1:32.84,hi:"Aur hum sochte rahe...",en:""},
 {p0:87.0,p1:89.0,v:2,a0:33.6,a1:35.72,hi:"Aakhir azaadi ka matlab kya hai?",en:""},
 {p0:89.5,p1:91.5,v:2,a0:36.5,a1:40.3,hi:"Kya sirf zanjeeron ka na hona azaadi hai?",en:""},
 {p0:92.0,p1:95.0,v:2,a0:40.64,a1:46.04,hi:"Ya phir apne khwaabon ko bina dare jee paana bhi zaroori hai?",en:""},
 {p0:96.5,p1:99.0,v:3,a0:0.02,a1:2.44,hi:"Humne logon se poochna chaha...",en:""},
 {p0:99.5,p1:102.0,v:3,a0:2.8,a1:3.84,m:"hand",hw:"Kya tum azaad ho?",hi:"",en:""},
 {p0:102.5,p1:106.5,v:3,a0:4.78,a1:8.87,hi:"Lekin jawaab dene se pehle hi kai chehre khamosh ho gaye.",en:""},
 {p0:107.0,p1:111.5,v:3,a0:9.2,a1:13.66,hi:"Kisi ke paas kehne ko bahut kuch tha, par sunne wala koi nahi.",en:""},
 {p0:112.0,p1:116.5,v:3,a0:14.25,a1:18.51,hi:"Kisi ke paas sapne the, par unhe poora karne ke mauke nahi.",en:""},
 {p0:117.0,p1:121.5,v:3,a0:19.22,a1:23.27,hi:"Kisi ke paas apni marzi thi, par faisle karne ka haq nahi.",en:""},
 {p0:122.0,p1:127.5,v:3,a0:23.88,a1:28.58,hi:"Aur kisi ke paas sab kuch tha... bas khud ko chunne ki himmat nahi.",en:""},
 {p0:128.0,p1:134.0,v:3,a0:29.4,a1:37.55,m:"hand",hw:"Shayad azaadi ek aisi cheez hai, jise har insaan mehsoos toh karta hai, par har insaan jee nahi paata.",hi:"",en:""},
 {p0:136.0,p1:138.5,v:4,a0:3.1,a1:5.9,hi:"Phir ek din hum ruk gaye.",en:""},
 {p0:139.0,p1:140.5,v:4,a0:5.92,a1:8.66,hi:"Aur socha...",en:""},
 {p0:141.0,p1:144.0,v:4,a0:9.8,a1:11.86,hi:"Kya hum azaadi ko galat jagah dhoond rahe the?",en:""},
 {p0:144.5,p1:147.5,v:4,a0:12.78,a1:14.94,hi:"Shayad woh kisi kitaab mein nahi thi.",en:""},
 {p0:148.0,p1:150.5,v:4,a0:16.45,a1:18.9,hi:"Na kisi tareekh mein, na kisi naare mein.",en:""},
 {p0:151.0,p1:155.0,v:4,a0:19.86,a1:22.78,hi:"Shayad woh tab thi, jab koi apni marzi se apna raasta chunta hai.",en:""},
 {p0:155.5,p1:158.5,v:4,a0:23.46,a1:26.1,hi:"Jab koi bina dare apni awaaz uthata hai.",en:""},
 {p0:159.0,p1:163.5,v:4,a0:27.32,a1:30.66,hi:"Jab koi doosre ko bhi wahi haq deta hai, jo woh khud ke liye chahta hai.",en:""},
 {p0:164.0,p1:167.0,v:4,a0:32.3,a1:35.58,hi:"Kyunki azaadi sirf khud ke liye azaad hone ka naam nahi...",en:""},
 {p0:167.5,p1:169.8,v:4,a0:35.98,a1:39.1,hi:"Balki doosron ko bhi azaad rehne dene ka naam hai.",en:""},
 {p0:171.0,p1:174.5,v:5,a0:0.68,a1:3.06,hi:"Toh shayad Azaadi gumshuda nahi hai.",en:""},
 {p0:175.0,p1:178.0,v:5,a0:3.9,a1:5.86,hi:"Shayad woh humare beech hi kahin hai.",en:""},
 {p0:178.5,p1:182.0,v:5,a0:7.12,a1:10.52,hi:"Har us sawaal mein, jo poochha jaana baaki hai.",en:""},
 {p0:182.5,p1:185.5,v:5,a0:11.16,a1:14.12,hi:"Har us awaaz mein, jo uthna baaki hai.",en:""},
 {p0:186.0,p1:189.0,v:5,a0:15.44,a1:18.5,hi:"Har us sapne mein, jo poora hona baaki hai.",en:""},
 {p0:189.5,p1:193.5,v:5,a0:19.94,a1:25.8,hi:"Humne use dhoonda itihaas mein, sadkon par, logon ke beech...",en:""},
 {p0:194.0,p1:196.5,v:5,a0:26.96,a1:29.28,hi:"Aur aakhir mein samjha...",en:""},
 {p0:197.0,p1:201.5,v:5,a0:29.96,a1:34.26,hi:"Azaadi koi manzil nahi, jahan pahunch kar safar khatam ho jaaye.",en:""},
 {p0:202.0,p1:204.0,v:5,a0:36.4,a1:38.14,hi:"Azaadi ek ehsaas hai.",en:""},
 {p0:204.5,p1:206.0,v:5,a0:39.12,a1:40.3,hi:"Ek zimmedari hai.",en:""},
 {p0:206.5,p1:211.0,v:5,a0:41.78,a1:47.5,hi:"Ek aisa haq hai, jise har roz jeena aur har roz bachana padta hai.",en:""},
 {p0:211.5,p1:214.8,v:5,a0:49.04,a1:54.06,hi:"Aur shayad... isi liye uski talaash kabhi khatam nahi hoti.",en:""},
 {p0:215.0,p1:216.4,v:6,a0:0.66,a1:2.7,m:"fin",hi:"Azaadi sirf ek lafz nahi...",en:""},
 {p0:216.4,p1:217.8,v:6,a0:3.47,a1:5.18,m:"fin",hi:"Yeh ek khwaab hai.",en:""},
 {p0:217.8,p1:219.2,v:6,a0:5.97,a1:7.16,m:"fin",hi:"Ek awaaz hai.",en:""},
 {p0:219.2,p1:220.6,v:6,a0:7.56,a1:8.47,m:"fin",hi:"Ek sawaal hai.",en:""},
 {p0:220.6,p1:222.0,v:6,a0:9.3,a1:10.03,m:"fin",hi:"Ek haq hai.",en:""},
 {p0:222.0,p1:223.4,v:6,a0:11.0,a1:12.15,m:"fin",hi:"Aur ek zimmedari bhi.",en:""}
];

export type Cap = CapDef & { t0: number; t1: number };
export type Timeline = {
  R0: number[]; vStart: number[]; vDur: number[]; caps: Cap[]; TMAP: number[][]; DUR: number; burst: number;
  staticFadeStart: number; staticFadeEnd: number; staticLoop: boolean;
};

/** Build the whole film timeline from the recordings' real durations (seconds). */
export function buildTimeline(voiceDurs: number[], staticDur: number): Timeline {
  const R0: number[] = [], vStart: number[] = [], vDur: number[] = [];
  const lead0 = Math.max(0.5, Math.min(OPENING_LEAD, staticDur - STATIC_FADE_DELAY - STATIC_FADE));
  let t = 0;
  VOICES.forEach((v, r) => {
    R0[r] = t;
    vDur[r] = voiceDurs[r] > 0 ? voiceDurs[r] : v.defDur;
    vStart[r] = t + (r === 0 ? lead0 : v.lead);
    t = vStart[r] + vDur[r] + v.tail;
  });
  const burst = t;
  const DUR = burst + END_TAIL;
  const staticFadeStart = vStart[0] + STATIC_FADE_DELAY;
  const staticFadeEnd = staticFadeStart + STATIC_FADE;

  const caps: Cap[] = CAP_DATA.map((c) => {
    return { ...c, t0: vStart[c.v as number] + (c.a0 as number), t1: vStart[c.v as number] + (c.a1 as number) };
  });
  caps.forEach((c, i) => {
    const nx = caps[i + 1];
    const sameVoice = nx && nx.v === c.v;
    const limit = sameVoice ? nx.t0 - 0.05 : (c.v + 1 < R0.length ? R0[c.v + 1] : burst) - 0.05;
    c.t1 = c.m === "hand" ? limit : Math.min(c.t1 + HOLD, limit);
    // keep picture strictly ahead of film gaps so drawings never freeze between lines
    const nextPic = sameVoice ? nx.p0 : c.v === 6 ? PIC_BURST : PIC_REELS[c.v + 1];
    if (nextPic - c.p1 < 0.2) c.p1 = Math.max(c.p0 + 0.1, nextPic - 0.25);
  });

  const anchors: number[][] = [];
  for (let r = 0; r < 7; r++) anchors.push([PIC_REELS[r], R0[r]]);
  caps.forEach((c) => { anchors.push([c.p0, c.t0]); anchors.push([c.p1, c.t1]); });
  anchors.push([PIC_BURST, burst], [PIC_REELS[7], DUR]);
  anchors.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const TMAP: number[][] = [];
  anchors.forEach((a) => {
    const L = TMAP[TMAP.length - 1];
    if (!L || (a[0] >= L[0] && a[1] >= L[1] && (a[0] > L[0] || a[1] === L[1]))) { if (!L || a[0] !== L[0] || a[1] !== L[1]) TMAP.push(a); }
  });
  return { R0, vStart, vDur, caps, TMAP, DUR, burst, staticFadeStart, staticFadeEnd, staticLoop: staticDur < staticFadeEnd };
}

/** Linear map through TMAP: a=0,b=1 picture->film; a=1,b=0 film->picture. */
export function mapTime(TMAP: number[][], t: number, a: number, b: number): number {
  const L = TMAP.length;
  if (t <= TMAP[0][a]) return t;
  for (let i = 1; i < L; i++) {
    const p = TMAP[i - 1], q = TMAP[i];
    if (t <= q[a]) { const d = q[a] - p[a]; return d > 0 ? p[b] + ((t - p[a]) * (q[b] - p[b])) / d : q[b]; }
  }
  return TMAP[L - 1][b] + (t - TMAP[L - 1][a]);
}
