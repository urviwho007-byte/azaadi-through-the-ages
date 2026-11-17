import { describe, expect, it } from "vitest";
import { buildTimeline, CAP_DATA, VOICES } from "@/film/timeline";

const durs = VOICES.map((v) => v.defDur);
const tl = buildTimeline(durs, 72.57);

describe("audio-driven timeline", () => {
  it("has 64 subtitles with no voice tag under the line", () => {
    expect(CAP_DATA.length).toBe(64);
    expect(CAP_DATA.every((c) => c.en === "")).toBe(true);
    expect(JSON.stringify(CAP_DATA)).not.toContain("VOICE");
  });

  it("keeps the name stamp and the handwritten 'Kya tum azaad ho?'", () => {
    expect(CAP_DATA.find((c) => c.m === "stamp")?.hi).toBe("Naam hai... Azaadi.");
    expect(CAP_DATA.find((c) => c.m === "hand")?.hw).toBe("Kya tum azaad ho?");
  });

  it("plays the cleaned recordings for reels 4 and 6", () => {
    expect(VOICES[3].url).toContain("prince_audio_the_questions_clean.mp3");
    expect(VOICES[5].url).toContain("satyam_audio_ending_clean.mp3");
  });

  it("plays the 'last 13 seconds' recording in reel 7", () => {
    expect(VOICES[6].reel).toBe(6);
    expect(VOICES[6].url).toContain("last_13_seconds.mp3");
  });

  it("puts the finale burst right after the reel 7 recording ends", () => {
    expect(tl.burst).toBeCloseTo(tl.vStart[6] + durs[6] + VOICES[6].tail, 5);
    expect(tl.burst).toBeGreaterThanOrEqual(tl.vStart[6] + durs[6]);
  });

  it("shows each finale line when it is spoken in the recording", () => {
    const fin = tl.caps.filter((c) => c.m === "fin");
    expect(fin.map((c) => c.hi)).toEqual([
      "Azaadi sirf ek lafz nahi...",
      "Yeh ek khwaab hai.",
      "Ek awaaz hai.",
      "Ek sawaal hai.",
      "Ek haq hai.",
      "Aur ek zimmedari bhi.",
    ]);
    expect(fin[0].t0).toBeCloseTo(tl.vStart[6] + 0.66, 5);
    expect(fin[5].t0).toBeCloseTo(tl.vStart[6] + 11.0, 5);
  });

  it("never overlaps subtitles and keeps each up until its words finish", () => {
    tl.caps.forEach((c, i) => {
      const spokenEnd = tl.vStart[c.v as number] + (c.a1 as number);
      const nx = tl.caps[i + 1];
      // stays until its words finish (or the very next line's words begin, when two lines run together)
      expect(c.t1).toBeGreaterThanOrEqual(Math.min(spokenEnd, nx ? nx.t0 - 0.05 : spokenEnd) - 1e-6);
      if (i > 0) expect(c.t0).toBeGreaterThan(tl.caps[i - 1].t1);
    });
  });

  it("ends the film 1.6 s after the burst", () => {
    expect(tl.DUR).toBeCloseTo(tl.burst + 1.6, 5);
  });
});
