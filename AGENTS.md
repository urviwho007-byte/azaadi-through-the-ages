<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules
- The film (src/film/engine.ts, src/film/markup.ts, src/styles.css) started as a port of the user's source HTML; its scenes are now custom canvas reels in that HTML's ink-and-sepia style. Keep the original engine structure (REND table, CUES, drawFX, booth) and change only what the user asks. Why: the user wants the original look and behaviour, with script-driven scenes.
- Figures (fig/pose) share a per-shot counter (figN, reset in renderShot) that picks each figure's costume look; shots crossfade via renderShot into an offscreen canvas. Why: stable per-figure personality and seamless cuts without touching each renderer.
- src/styles.css must not import Tailwind; its preflight changes the film's layout. Why: exact visual parity with the source HTML.
- The engine runs once on mount from src/routes/index.tsx over markup injected with dangerouslySetInnerHTML. Why: the original script owns and mutates that DOM directly.
