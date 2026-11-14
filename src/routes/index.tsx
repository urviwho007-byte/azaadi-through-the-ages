import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

import { FILM_MARKUP } from "@/film/markup";

const TITLE = "गुमशुदा: आज़ादी — GUMSHUDA: AZAADI · एक काव्य-वृत्तचित्र";
const DESC =
  "A poetic documentary on Liberty, in the style of old Hindi cinema. Six reels, six voices — not one spoken. Only sound.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

declare global {
  interface Window {
    __gumshudaStarted?: boolean;
  }
}

function Index() {
  useEffect(() => {
    // The film engine owns this DOM (exactly like the original page script); start it once.
    if (window.__gumshudaStarted) return;
    window.__gumshudaStarted = true;
    import("@/film/engine").then((m) => m.runGumshuda());
  }, []);

  // Same DOM as the source HTML's <body>; display:contents keeps the wrapper out of layout.
  return <div style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: FILM_MARKUP }} />;
}
