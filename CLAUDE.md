# hey. — makhana landing page

## Non-negotiable design rules
- Read /docs/hey-makhana-design-spec.md before any UI work.
- NEVER hardcode a colour, size, spacing or duration. Use tokens from src/styles/tokens.css.
- Every box: 3px solid var(--ink) border. Every shadow: hard offset, 0 blur.
- No border-radius above 8px except pills (999px).
- No gradients. One exception: the posterised hero starburst.
- Backgrounds are var(--paper) (#FFF8EE), never #fff. Text is var(--ink) (#14110F), never #000.
- Grain overlay on every solid colour fill.
- Copy is Hinglish. No em dashes. Never "guilt-free", "superfood", "curated", "seamless", "journey".

## Architecture
- Flavour data lives ONLY in src/data/flavours.ts. No component hardcodes a flavour.
- Components are commerce-agnostic. No cart, no checkout, no platform SDK.
- Every animation must have a prefers-reduced-motion path, written at the same time.

## Definition of done for any component
Types, all states (default/hover/focus/active/disabled/loading/error/empty),
keyboard accessible, visible branded focus ring, reduced-motion path, story in /app/kitchen-sink.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
