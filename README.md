# Azaadi Through The Ages

HARD RULE (HIGHEST PRIORITY, OVERRIDES EVERYTHING BELOW)
The attached HTML file "Qwen_html_20261113_09446k3te.html" is the single source of truth. Every animation, drawing, shot, timing, transition, sound effect and UI behaviour in the final app must be IDENTICAL to what that file produces when opened in a browser. Do NOT redesign, simplify, "improve", re-imagine, shorten or re-draw anything. Do NOT replace any canvas drawing with images, CSS, SVG, libraries or your own version. Do NOT change any number, colour, coordinate, easing, duration, shot timing, cue time, font, layout or CSS value.

HOW TO BUILD IT
- Create a React + Vite + TypeScript app. Port the HTML file's code into the app VERBATIM: copy the CSS unchanged into the global stylesheet, copy the markup structure unchanged into React components (or one component that renders the same DOM), and copy the JavaScript logic unchanged into TypeScript modules. Only add type annotations and the React wiring needed to run it.
- Port these pieces exactly as they are in the file, with no edits to their code: SCENES, STOCK, SHOTS, CUES, the entire audio engine (initAudio, mkBuf, ksInto, pluck, flute, bell, birds, osc, noiseShot, fire, ambience layers, setAmb, trainLayer, charkhaLayer), all canvas helpers (bgGrad, glow, motes, fig, waveFlag, dome, birdShape), drawPoster, the whole REND table (tuning, radio, poster, paper, march, flag, street, train, gate, book, sages, ink, charkha, haveli, mirror, class, vote, dawn, poster2, fin), grade, drawCover, drawScene, drawLeader, drawFX (grain tiles, scratches, flicker, gate weave, cue burns, finale static burst and fade, iris), the stock-video texture layer, the master loop, seeking and scheduler reset logic, pause/resume, the end card, the poster PNG export, the lobby (bulbs, beam, dust, tilting poster, scene index), the booth, keyboard shortcuts and fullscreen.
- If you cannot port something exactly, do NOT approximate it. Stop and say so, or fall back to hosting the attached HTML as-is in /public and embedding it. An exact result matters more than a clean architecture.
- After building, compare the app against the HTML shot by shot (all 20 shots below) and fix any difference before finishing.

NO NARRATION
No voice, no text-to-speech, no speechSynthesis, no recorded audio. Only the synthesized sound effects and music that already exist in the HTML. The script appears only as on-screen subtitles.

THE ONLY THINGS ALLOWED TO CHANGE (nothing else may be touched)
1. The caption data (the CAPS array): replace the text and timings with the script below. Keep the caption rendering code and its animations exactly as in the HTML: normal fade-up caption, "hand" mode (handwriting reveal with underline stroke), "stamp" mode (slam-in stamp box), "fin" mode (finale lines).
   - Each caption entry shows the script line as the main line. The small line under it (the old English line) now shows the voice tag "VOICE 1" to "VOICE 6". This is a label only.
   - In "hand" mode the handwriting text (hw) is the script line itself, and the Hindi line is left empty.
   - Booth "Subtitles" buttons become: दोनों (line + voice tag) / सिर्फ़ पंक्ति (line only) / बंद (off).
2. Poster text (both the lobby poster HTML and the drawPoster canvas function). Keep the layout, fonts, stamp, tabs, stains and every other detail. Only change the text rows to:
   - NAAM / NAME: "Azaadi"
   - AAKHRI BAAR DEKHA GAYA / LAST SEEN: "ek azaad desh mein"
   - PATA / WHEREABOUTS: "kisi ko nahi"
   - Footer line (replacing the reward line): "Agar aapko kahin nazar aaye... toh humein zaroor batayein."
   Remove the other rows without moving the remaining ones.
3. End card: the typed line becomes "Shayad talaash abhi baaki hai." Update the typing animation width and steps to match its length (30 characters). The title "GUMSHUDA: AZAADI" stays as is.

EVERYTHING ELSE STAYS EXACTLY AS IN THE HTML, including every on-canvas prop text (newspaper, book spines, the three portraits, the "बापू · 1930" photo, the "LESSON ONE" board, the "VOTE" box, the poster's "SEARCH ON" stamp and the "STILL MISSING?" stamp), all lobby/notes/booth copy, SCENES names and times, SHOTS, CUES, audio, DOM, CSS, default booth values and localStorage key "gumshuda-booth".

FROZEN REEL AND SHOT TIMELINE (must match the HTML exactly)
Reels (SCENES): 0–30 एलान THE ANNOUNCEMENT · 30–60 अतीत THE PAST · 60–95 अदृश्य ज़ंजीरें THE INVISIBLE CHAINS · 95–135 आज़ादी का अर्थ THE MEANING OF LIBERTY · 135–170 आईना THE MIRROR · 170–215 तलाश जारी THE SEARCH CONTINUES · 215–225 छह आवाज़ें SIX VOICES.
Shots (SHOTS): 0–7 tuning · 7–22 radio · 22–30 poster · 30–42 paper · 42–53 march · 53–60 flag · 60–72 street · 72–84 train · 84–95 gate · 95–109 book · 109–123 sages · 123–135 ink · 135–148 charkha · 148–158 haveli · 158–170 mirror · 170–182 class · 182–193 vote (women walking until 6 s, then inked finger and ballot) · 193–204 dawn · 204–215 poster2 (extra "STILL MISSING?" stamp after 2.5 s) · 215–225 fin. Keep each shot's stock-video texture opacity ("tex") and URL list from the file.
Sound cues, ambience layers, projector hum, static levels, the Morse "AZAADI", the finale burst at 223.4 s and the projector shutting off: all exactly as in the file's CUES and setAmb. The cue times do not move even though the captions are retimed below.

CAPTIONS FROM THE SCRIPT (replace the CAPS data with exactly this; format: start–end · text · voice tag · mode)

Reel 1, VOICE 1
- 6.0–8.0 · "Yeh ek zaroori elaan hai." · VOICE 1
- 8.5–10.5 · "Ek cheez gumshuda hai." · VOICE 1
- 11.0–13.5 · "Naam hai... Azaadi." · VOICE 1 · stamp
- 14.0–16.5 · "Kehte hain, ise bahut saalon pehle paaya gaya tha." · VOICE 1
- 17.0–20.5 · "Iske liye ladaaiyaan ladi gayi, qurbaaniyaan di gayi, aur na jaane kitne sapne dekhe gaye." · VOICE 1
- 21.0–23.0 · "Lekin aaj... iska pata kisi ko nahi." · VOICE 1
- 23.5–26.5 · "Aakhri baar ise ek azaad desh mein dekha gaya tha." · VOICE 1
- 27.0–29.8 · "Agar aapko kahin nazar aaye... toh humein zaroor batayein." · VOICE 1

Reel 2, VOICE 2
- 32.0–34.0 · "Humne uski talaash shuru ki."
- 34.5–38.5 · "Purani kitaabon mein, itihaas ke pannon mein, un sadkon par jahan kabhi inquilab ke naare goonjte the."
- 39.0–41.0 · "Har tasveer mein ek kahaani thi."
- 41.0–43.0 · "Har kahaani mein ek khwaab tha."
- 43.5–46.5 · "Ek aise kal ka khwaab, jahan koi kisi se na dare."
- 47.0–50.0 · "Jahan apni baat kehne ke liye ijazat na maangni pade."
- 50.5–53.5 · "Jahan jeene ke liye kisi aur ki marzi zaroori na ho."
- 54.0–56.0 · "Lekin waqt ke saath ek sawaal reh gaya..."
- 56.5–59.8 · "Kya humne sirf ek desh ko azaad karaya tha, ya insaan ko bhi?"

Reel 3, VOICE 3
- 61.0–64.0 · "Hum aage badhe... toh kuch deewarein nazar aayi."
- 64.5–66.5 · "Kuch deewarein patthar ki thi."
- 67.0–69.0 · "Kuch samaaj ne banayi thi."
- 69.5–73.0 · "Aur kuch... humne khud apne andar khadi kar li thi."
- 73.5–75.5 · "Kahin kisi ki awaaz daba di gayi."
- 76.0–78.5 · "Kahin kisi ke sapnon ko chhota kar diya gaya."
- 79.0–84.5 · "Kahin kisi ko bataya gaya ki use kaise jeena hai, kya banna hai, kisse milna hai, kya kehna hai."
- 85.0–86.5 · "Aur hum sochte rahe..."
- 87.0–89.0 · "Aakhir azaadi ka matlab kya hai?"
- 89.5–91.5 · "Kya sirf zanjeeron ka na hona azaadi hai?"
- 92.0–95.0 · "Ya phir apne khwaabon ko bina dare jee paana bhi zaroori hai?"

Reel 4, VOICE 4
- 96.5–99.0 · "Humne logon se poochna chaha..."
- 99.5–102.0 · "Kya tum azaad ho?" · hand
- 102.5–106.5 · "Lekin jawaab dene se pehle hi kai chehre khamosh ho gaye."
- 107.0–111.5 · "Kisi ke paas kehne ko bahut kuch tha, par sunne wala koi nahi."
- 112.0–116.5 · "Kisi ke paas sapne the, par unhe poora karne ke mauke nahi."
- 117.0–121.5 · "Kisi ke paas apni marzi thi, par faisle karne ka haq nahi."
- 122.0–127.5 · "Aur kisi ke paas sab kuch tha... bas khud ko chunne ki himmat nahi."
- 128.0–134.0 · "Shayad azaadi ek aisi cheez hai, jise har insaan mehsoos toh karta hai, par har insaan jee nahi paata." · hand

Reel 5, VOICE 5
- 136.0–138.5 · "Phir ek din hum ruk gaye."
- 139.0–140.5 · "Aur socha..."
- 141.0–144.0 · "Kya hum azaadi ko galat jagah dhoond rahe the?"
- 144.5–147.5 · "Shayad woh kisi kitaab mein nahi thi."
- 148.0–150.5 · "Na kisi tareekh mein, na kisi naare mein."
- 151.0–155.0 · "Shayad woh tab thi, jab koi apni marzi se apna raasta chunta hai."
- 155.5–158.5 · "Jab koi bina dare apni awaaz uthata hai."
- 159.0–163.5 · "Jab koi doosre ko bhi wahi haq deta hai, jo woh khud ke liye chahta hai."
- 164.0–167.0 · "Kyunki azaadi sirf khud ke liye azaad hone ka naam nahi..."
- 167.5–169.8 · "Balki doosron ko bhi azaad rehne dene ka naam hai."

Reel 6, VOICE 6
- 171.0–174.5 · "Toh shayad Azaadi gumshuda nahi hai."
- 175.0–178.0 · "Shayad woh humare beech hi kahin hai."
- 178.5–182.0 · "Har us sawaal mein, jo poochha jaana baaki hai."
- 182.5–185.5 · "Har us awaaz mein, jo uthna baaki hai."
- 186.0–189.0 · "Har us sapne mein, jo poora hona baaki hai."
- 189.5–193.5 · "Humne use dhoonda itihaas mein, sadkon par, logon ke beech..."
- 194.0–196.5 · "Aur aakhir mein samjha..."
- 197.0–201.5 · "Azaadi koi manzil nahi, jahan pahunch kar safar khatam ho jaaye."
- 202.0–204.0 · "Azaadi ek ehsaas hai."
- 204.5–206.0 · "Ek zimmedari hai."
- 206.5–211.0 · "Ek aisa haq hai, jise har roz jeena aur har roz bachana padta hai."
- 211.5–214.8 · "Aur shayad... isi liye uski talaash kabhi khatam nahi hoti."

Reel 7, ALL SIX VOICES ONE AFTER ANOTHER (all in "fin" mode, same timing slots as the HTML's finale lines)
- 215.0–216.4 · "Azaadi sirf ek lafz nahi..." · VOICE 1
- 216.4–217.8 · "Yeh ek khwaab hai." · VOICE 2
- 217.8–219.2 · "Ek awaaz hai." · VOICE 3
- 219.2–220.6 · "Ek sawaal hai." · VOICE 4
- 220.6–222.0 · "Ek haq hai." · VOICE 5
- 222.0–223.4 · "Aur ek zimmedari bhi." · VOICE 6
Then, exactly as in the HTML: static burst and projector off at 223.4 s, a few seconds of silence, black until 225 s, then the end card with "GUMSHUDA: AZAADI" and the typed line "Shayad talaash abhi baaki hai."

FINAL CHECK BEFORE YOU FINISH
Run the film from 0:00 to the end card and confirm each of the 20 shots, the film-grain/flicker/scratch/weave/cue-burn effects, the iris wipes, the chapter cards, the leader and skip button, the seek strip, the booth sliders and every sound cue behave exactly like the attached HTML. If anything differs, fix it to match the HTML. The only differences allowed are the caption text/timings, the poster text rows and the end-card typed line listed above.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://azaadi-through-the-ages.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/5a5b9ba9-d34e-4e7e-89c0-32e2ec6bbff0).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
