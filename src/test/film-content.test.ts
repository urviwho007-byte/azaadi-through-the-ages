import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const engine = readFileSync(resolve(__dirname, "../film/engine.ts"), "utf8");
const css = readFileSync(resolve(__dirname, "../styles.css"), "utf8");
const markup = readFileSync(resolve(__dirname, "../film/markup.ts"), "utf8");

describe("Gumshuda film content", () => {
  it("fires the static burst and projector-off cue at the finale's end", () => {
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
