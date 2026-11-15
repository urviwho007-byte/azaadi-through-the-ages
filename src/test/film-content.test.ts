import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const engine = readFileSync(resolve(__dirname, "../film/engine.ts"), "utf8");
const css = readFileSync(resolve(__dirname, "../styles.css"), "utf8");
const markup = readFileSync(resolve(__dirname, "../film/markup.ts"), "utf8");

describe("Gumshuda film content", () => {
  it("has 64 captions with no voice tag under the line", () => {
    const caps = engine.slice(engine.indexOf("const CAPS=["), engine.indexOf("];", engine.indexOf("const CAPS=[")));
    expect((caps.match(/\{t0:/g) || []).length).toBe(64);
    expect((caps.match(/en:""/g) || []).length).toBe(64);
    expect(caps).not.toContain("VOICE");
  });

  it("shows the name as a stamp from 11 to 13.5 s", () => {
    expect(engine).toContain('{t0:11,t1:13.5,m:"stamp",hi:"Naam hai... Azaadi.",en:""}');
  });

  it("writes 'Kya tum azaad ho?' by hand from 99.5 to 102 s with no extra line", () => {
    expect(engine).toContain('{t0:99.5,t1:102,m:"hand",hw:"Kya tum azaad ho?",hi:"",en:""}');
  });

  it("ends the finale at 222–223.4 s, before the burst", () => {
    expect(engine).toContain('{t0:222,t1:223.4,m:"fin",hi:"Aur ek zimmedari bhi.",en:""}');
    expect(engine).toContain('cue(223.4,"burst");cue(223.4,"projOff");');
  });

  it("keeps only the three poster rows and the new footer", () => {
    expect(engine).toContain(
      'const rows=[["NAAM / NAME","Azaadi"],["AAKHRI BAAR DEKHA GAYA / LAST SEEN","ek azaad desh mein"],["PATA / WHEREABOUTS","kisi ko nahi"]];',
    );
    expect(engine).not.toContain("REWARD: ONE AWAKENED HEART");
    expect(engine).toContain("Agar aapko kahin nazar aaye... toh humein zaroor batayein.");
  });

  it("types the 30-character end line in 30 steps", () => {
    expect(markup).toContain('<div class=\\"typeline\\">Shayad talaash abhi baaki hai.</div>');
    expect("Shayad talaash abhi baaki hai.".length).toBe(30);
    expect(css).toContain("steps(30)");
  });
});
