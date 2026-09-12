# hey. — Component Build Guide

Expansion of Phase 1.3 in `hey-build-playbook.md`. Twenty-six components in dependency order, each with a paste-ready prompt.

**How to use this file**

1. Work top to bottom. Later components consume earlier ones, so skipping around creates rework.
2. **One component per session.** Run the prompt, answer the open questions it returns, implement, then `/design-system document [Name]`, then add it to `/kitchen-sink`.
3. Tick the done-check before moving on.
4. Run `/design-system audit` after each tier.

**If you are in Claude Code inside the repo**, `CLAUDE.md` already carries the global rules and the prompts below work as written.

**If you are in a Cowork or claude.ai design session**, paste this preamble once at the top of the session first:

```
PROJECT PREAMBLE — paste once per session

Brand: hey. — a Desi Pop makhana (foxnut) snack brand. Retro Indian street graphics:
truck art, matchbox labels, Bollywood poster type, Madhubani linework.

Reference docs: hey-makhana-design-spec.md (§3 colour, §4 type, §10 motion, §11 the
anti-vibe-coded checklist). Tokens live in src/styles/tokens.css.

NON-NEGOTIABLE RULES
- Never hardcode a colour, size, spacing or duration. Use tokens only.
- Every box: 3px solid var(--ink). Every shadow: hard offset, 0 blur.
- No border-radius above 8px, except pills at 999px.
- No gradients anywhere. Backgrounds are var(--paper) #FFF8EE, never #fff.
  Text is var(--ink) #14110F, never #000.
- Grain overlay on every solid colour fill.
- Flavour theming comes from --accent / --accent-sh / --accent-tint / --accent-on,
  set by a data-theme attribute on <html>. Components never know which flavour is active.
- Every animation ships with its prefers-reduced-motion path, written at the same time.
- Copy is Hinglish. No em dashes. Never "guilt-free", "superfood", "curated",
  "seamless", "journey", "elevate".

DEFINITION OF DONE for every component
TypeScript types; all states (default, hover, focus-visible, active, disabled, loading,
error, empty where applicable); keyboard accessible; visible branded focus ring
(4px var(--indigo), 4px offset); reduced-motion path; rendered in /kitchen-sink.
```

---

# TIER 1 — Primitives

Nothing here depends on anything else. Build all eight before touching Tier 2.

---

## 1. ThemeProvider

Infrastructure, not visual. Build it first so every later component can be tested in all four themes.

```
/design-system extend ThemeProvider for the hey. makhana site.

Purpose: set and persist the active flavour theme by writing a data-theme attribute
on the <html> element. Themes: pataka, malai, jaadu, pehelwan. Plus an independent
night mode that inverts --ink and --paper while keeping flavour colours intact.

Requirements:
- Next.js App Router, must not cause a flash of wrong theme on first paint.
  Use an inline blocking script in <head> that reads localStorage before hydration.
- Expose useTheme() returning { theme, setTheme, night, setNight }.
- Theme changes cross-fade background and border colours over var(--dur-base).
  Never transition text colour, it flickers.
- Respect prefers-reduced-motion by switching instantly.
- Also expose a scroll-driven "section theme" mode, where scrolling past a flavour
  section temporarily sets the theme without persisting it.

Give me the props table, the persistence strategy, and how the temporary section
theme interacts with an explicitly chosen one.
```

**Expect to decide:** whether an explicit palette choice locks out scroll-driven theming. It should. Once a user picks a theme, scrolling must not override it.

**Done when:** switching `data-theme` on `<html>` in devtools recolours every component in the kitchen sink, with no hardcoded colour surviving.

---

## 2. Grain

```
/design-system extend Grain overlay for the hey. makhana site.

Purpose: a fixed noise texture over the entire viewport that kills the "flat CSS
gradient" look. This is the single cheapest thing that makes the site look printed
rather than generated.

Requirements:
- position fixed, inset 0, pointer-events none, z-index var(--z-grain).
- Opacity 4 to 5 percent. Inline SVG feTurbulence as a data URL, no image file.
- Must not repaint on scroll. Verify with a paint-flashing profile.
- Prop: intensity ('subtle' | 'default' | 'heavy') for use inside coloured panels
  that need slightly more.
- Must sit above content but below header, modals and toasts.
- Should be invisible to screen readers and to print stylesheets.

Also tell me whether to apply it once globally or per coloured panel, and why.
```

**Expect to decide:** global versus per-panel. Global is one node and cheaper; per-panel lets you vary intensity. Recommendation is global plus an optional per-panel variant for the four flavour columns.

**Done when:** zooming to 400% shows visible texture, and a scroll paint profile shows no repaints.

---

## 3. MakhanaPuff

The brand's atomic illustration. Used in the hero, the column hover burst, the loading spinner and the signup confetti, so it must exist before any of them.

```
/design-system extend MakhanaPuff, the atomic illustration unit for hey.

Purpose: a single puffed lotus seed drawn as an SVG. It appears as decoration,
as particles, as a loading spinner and as confetti, so one component must serve all.

Requirements:
- Irregular organic blob, NOT a circle. 3px ink outline, cream #FFF3D6 fill,
  one faint interior line suggesting the popped seam.
- Props: size (number), rotation (number), variant ('default' | 'toasted' | 'spiced').
  Toasted is darker cream, spiced has a red-orange speckle.
- viewBox 0 0 40 40, scales cleanly from 8px to 200px. At 8px the outline must not
  swallow the shape, so consider a stroke-width that scales non-linearly.
- aria-hidden by default, with an optional label prop for the rare case it carries meaning.
- Provide three shape variants so a scatter of them does not look copy-pasted.

Give me the SVG paths and explain how stroke-width should behave across sizes.
```

**Expect to decide:** whether stroke-width scales with size. It should scale, but sub-linearly, or small puffs turn into ink blobs.

**Done when:** 30 puffs at random sizes and rotations read as a scatter of real objects, not a repeated sticker.

---

## 4. Button

The most-used component on the site. Do not rush it.

```
/design-system extend Button for the hey. makhana site.

Variants:
- primary: background var(--accent), text var(--accent-on)
- secondary: background var(--paper), text var(--ink)
- ghost: no fill, outline only
- danger: background var(--chilli) — used only for destructive confirmations

Sizes: sm (40px), md (48px), lg (56px). Icon-only variant must stay square and
meet a 44px minimum touch target even at sm.

States:
- default: 3px ink border, box-shadow var(--shadow), 0 blur
- hover: translate(-3px,-3px), shadow grows to var(--shadow-lg)
- active: translate(3px,3px), shadow shrinks to var(--shadow-sm) — it presses INTO the page
- focus-visible: 4px var(--indigo) ring, 4px offset, and it must remain visible
  against all four flavour backgrounds
- disabled: 40% opacity, shadow removed entirely, cursor not-allowed
- loading: label stays in place to prevent width jump, a spinning MakhanaPuff
  replaces the trailing icon, aria-busy true, button disabled

Requirements:
- Polymorphic: renders <button> or <a> via an `as` prop, and an anchor must never
  receive a disabled attribute.
- Optional trailing icon, defaulting to the → glyph.
- prefers-reduced-motion: remove translate on hover and active, keep the shadow change
  so the state is still perceivable.

Give me the props table, all states, and confirm the focus ring passes 3:1 against
#EF3E2F, #FFC93C, #6B2FD6 and #3FBF6F.
```

**Expect to decide:** whether the loading label is replaced or retained. Retain it. Replacing it causes a width jump, which on a 3px-bordered button is very visible.

**Done when:** every variant, size and state is in the kitchen sink, tab order works, and the focus ring is visible on all four flavour fills.

---

## 5. Pill

```
/design-system extend Pill for the hey. makhana site.

Purpose: a small outlined label. Used for section eyebrows, the ⌘K affordance,
badge rows in the nutrition panel, and the SKIP link on the jar section.

Variants: 'label' (static), 'action' (clickable), 'kbd' (keyboard shortcut display).
Tones: default (paper fill), accent (var(--accent-tint) fill), inverse (ink fill, paper text).

Requirements:
- border-radius var(--radius-pill). This is the ONLY component allowed to be fully round.
- Typography: var(--font-mono), uppercase, 0.12em letter-spacing, var(--fs-label).
- 3px ink border, no shadow by default; the action variant gets var(--shadow-sm).
- The kbd variant renders as a <kbd> element with a 6px radius, not fully round,
  because a rounded pill reads as a tag rather than a key.
- Action variant needs hover, focus-visible and active states matching Button's logic.
- Optional leading ✱ glyph prop.

Confirm which HTML element each variant renders and why.
```

**Done when:** the three variants are visually distinct without needing a caption to explain them.

---

## 6. Input

```
/design-system extend Input for the hey. makhana notify form.

Types: text, email, tel, and a numeric variant for pin code.

Requirements:
- 48px height, 3px ink border, var(--radius) 4px, background var(--paper).
- Label above, always visible. No floating labels and no placeholder-as-label.
- Placeholder is an example value, never an instruction.
- The tel variant shows a locked, non-editable "+91" prefix inside the field,
  visually divided by a 3px ink rule. The prefix must not be part of the input value.
- The pin code variant: inputmode numeric, maxLength 6, pattern enforced.
- States: default, hover (border thickens to 4px), focus-visible (4px indigo ring,
  4px offset), error (border var(--chilli) plus a small ! sticker at the right edge),
  disabled, readOnly.
- Error message renders below in var(--chilli), font-weight 600, and is linked
  by aria-describedby. Errors appear on blur and on submit, never on every keystroke.
- aria-invalid toggles with the error state. Required fields get a real required attribute,
  and the asterisk in the label must not be the only indicator.
- Optional helper text slot, mutually exclusive with the error slot.

Give me the props table and the exact ARIA wiring between label, input, helper and error.
```

**Expect to decide:** when validation fires. On blur and on submit. Validating on every keystroke punishes people mid-typing.

**Done when:** a screen reader announces label, then value, then error, in that order.

---

## 7. Checkbox

The consent checkbox is legally load-bearing, so this cannot be a styled div.

```
/design-system extend Checkbox for the hey. makhana consent field.

Requirements:
- Real <input type="checkbox">, visually hidden but focusable, with a styled
  sibling indicator. Never a div with role=checkbox.
- 24px indicator, 3px ink border, 4px radius. Checked state fills var(--accent)
  and draws a hand-drawn-looking tick, not a geometric one.
- Label sits to the right, is fully clickable, and wraps to multiple lines without
  the indicator shifting or shrinking. Use flex with flex-shrink 0 on the indicator.
- The label may contain links (Privacy). Clicking the link must NOT toggle the checkbox.
- States: unchecked, checked, focus-visible, disabled, error.
  Error draws the border in var(--chilli) plus a message below.
- Unchecked by default, always. Required for the consent use case, with aria-required.
- Reduced motion: the tick appears instantly instead of drawing.

Tell me how to stop the nested link from toggling the input.
```

**Expect to decide:** the nested-link problem. It needs `onClick` with `stopPropagation` on the anchor, and the label must wrap only the text, not the link.

**Done when:** space bar toggles it, clicking the Privacy link does not, and the indicator holds position with a three-line label.

---

## 8. Chip

```
/design-system extend Chip for hey. flavour selection.

Purpose: a toggleable flavour selector used in the notify form and the next-flavour poll.
Multi-select.

Requirements:
- Renders as a <button> with aria-pressed, not a checkbox, because it is a filter
  rather than form data. Confirm whether you agree, given it IS submitted with the form.
- Fully round, 3px ink border, var(--font-body) weight 700.
- Unselected: background var(--{flavour}-tint). Selected: background var(--{flavour}),
  text var(--{flavour}-on), plus var(--shadow-sm) and a 2px translate.
- Optional leading mascot avatar at 20px.
- Optional trailing count or percentage, for the poll variant.
- The flavour colour comes from a `theme` prop, not from the global --accent,
  because four chips of different flavours appear side by side.
- Keyboard: arrow keys move between chips in a group, space toggles.
  Wrap the group in role=group with an aria-label.

Resolve the button-versus-checkbox question before proposing the API.
```

**Expect to decide:** button with `aria-pressed` versus a real checkbox group. Since these values are submitted, a checkbox group inside a fieldset is more correct. Let the skill argue it out.

**Done when:** selected and unselected are distinguishable without relying on colour alone.

---

## 9. Stamp

```
/design-system extend Stamp for the hey. shop cards.

Purpose: the "SOLD OUT" mark over every product image. It has to feel like a rubber
stamp on a paper ticket, not a CSS badge, because every product on the site is
sold out and this element carries the entire "exclusive, not broken" feeling.

Requirements:
- 4px ink border, var(--font-mono) 700, uppercase, 0.16em tracking.
- Rotated -12deg by default, with a rotation prop.
- Semi-transparent paper background (about 82%) so the artwork shows through.
- A distressed edge: use an SVG mask or a repeating-conic clip so the border looks
  inked rather than vector-perfect. This detail is the whole component.
- Variants: 'sold-out', 'coming-soon', 'limited', 'new'.
- Optional jitter animation on parent hover: one 200ms shake, not a loop.
- Must be announced by screen readers as real content, not decoration, since
  availability is meaningful information. Propose the correct markup.

Tell me how to achieve the distressed edge without a raster image.
```

**Expect to decide:** whether the stamp is decorative or semantic. Semantic. Availability must reach assistive tech, so pair it with the product's `aria-describedby` rather than hiding it.

**Done when:** it reads as printed rather than rendered, and VoiceOver announces "Pataka Peri Peri, sold out".

---

## 10. Marquee

```
/design-system extend Marquee for the hey. site. Three instances appear on the page.

Requirements:
- Props: items (string array), direction ('left' | 'right'), speed (seconds per loop),
  tone ('marigold' | 'peacock' | 'rani' | 'ink'), separator (defaults to ✱).
- 44px tall, 3px ink bottom border, var(--font-chunky) Modak at 19px.
- Seamless infinite loop: duplicate the content track and translate by exactly -50%.
  Content must fill at least 200% of the viewport width or the loop will show a gap
  on ultrawide screens. Handle that.
- Pauses on hover and on focus within.
- Alternating instances run in opposite directions and different tones.
- prefers-reduced-motion: no scroll at all. Show a single centred static message.
  Do not simply slow it down.
- Announce nothing to screen readers if the content is decorative, but the first
  marquee carries a real shipping-threshold message. Propose how to handle that split.
- Must not cause layout shift while fonts load.

Confirm the ultrawide gap fix and the reduced-motion markup.
```

**Expect to decide:** the decorative-versus-informational split. The shipping message should also exist as static text somewhere, so the marquee itself can be `aria-hidden`.

**Done when:** it loops with no visible seam at 2560px wide, and reduced motion shows static text.

---

## TIER 1 GATE

```
/design-system audit
```

Point it at `/kitchen-sink` and `src/components/ui`. Do not start Tier 2 until:

- [ ] Zero hardcoded hex, px or ms outside `tokens.css` — verify with `rg '#[0-9a-fA-F]{6}' src --glob '!tokens.css'`
- [ ] Every component renders in all four themes plus night mode
- [ ] Every interactive component is reachable and operable by keyboard
- [ ] Focus rings visible on all four flavour backgrounds
- [ ] Naming is consistent: pick `theme` or `flavour` as the prop name, never both
- [ ] Audit score 90+

---

# TIER 2 — Composites

Each of these consumes Tier 1 components. If one needs something Tier 1 does not provide, stop and extend Tier 1 rather than inventing a local solution.

---

## 11. Card

```
/design-system extend Card, the base container for the hey. site.

Purpose: every card on the site extends this — product cards, proof cards, comic panels,
the modal. Get the base right and the rest inherit correctly.

Requirements:
- 3px ink border, var(--radius) 4px, hard offset shadow with 0 blur.
- Props: elevation ('flat' | 'raised' | 'floating') mapping to no shadow,
  var(--shadow), var(--shadow-lg).
- Prop shadowColor, so a product card can cast its own flavour's shadow
  (var(--{flavour}-sh)) rather than ink.
- Props: interactive (boolean), tilt (degrees, default 0), padding (token scale).
- When interactive: hover translates -3px,-3px and grows the shadow;
  active presses in; focus-visible shows the indigo ring. A non-interactive card
  must have none of these.
- An interactive card must be a single focusable element with one clear action.
  Never nest a button inside a clickable card — resolve this, it affects ProductCard.
- Polymorphic `as` prop.

Address the nested-interactive problem explicitly.
```

**Expect to decide:** the nested-interactive problem. The ProductCard has a card-level action and a Notify button. Solution is the "card as container, button as the only interactive element" pattern, with the whole card as a hover surface but not a click target.

**Done when:** no card produces a nested-interactive warning in axe.

---

## 12. SectionHeading

Used by every section, so it belongs in the system rather than being rewritten seven times.

```
/design-system extend SectionHeading for the hey. site.

Requirements:
- Composes: optional Pill eyebrow, the heading itself, optional lede paragraph,
  optional hand-drawn underline swoosh.
- Heading in var(--font-display) Rozha One, var(--fs-h1), line-height 0.88,
  letter-spacing -0.02em.
- Prop misregister (boolean): adds a 3px offset duplicate in a second colour via
  text-shadow, imitating bad offset printing. Colour comes from a prop, default var(--rani).
  IMPORTANT: text-shadow must not reduce legibility. Verify contrast with it applied.
- Prop swoosh (boolean): an SVG underline that is hand-drawn, not a straight rule.
  Provide three swoosh path variants so repeated use does not look mechanical.
- Prop align ('left' | 'center'), level (h1..h4 for correct document outline).
  Visual size must be independent of heading level.
- Lede: var(--font-body), var(--fs-body-l), max-width 62ch.
- Reduced motion: no reveal animation.

Confirm the heading level and visual size are fully decoupled.
```

**Done when:** the page has exactly one `h1`, and heading order is sequential with no skips.

---

## 13. MascotAvatar

```
/design-system extend MascotAvatar for hey.

Purpose: a circular cropped mascot, used in the comic tab row, the command palette
result rows, the notify modal corner, and the chip leading icon.

Requirements:
- Sizes: 20, 32, 56, 88px. The crop must reframe per size — at 20px show only the
  head, at 88px show head and shoulders. A single image scaled down will be illegible.
- 3px ink border, fully round, background var(--{flavour}-tint).
- Props: flavour (slug), size, expression ('default' | 'happy' | 'idle').
- Hover: translateY(-5px) rotate(-6deg), spring easing.
- Optional idle animation, off by default, on only when the parent is hovered.
- Correct alt text when meaningful, aria-hidden when decorative. Propose the rule
  for deciding which.

Explain how to handle the per-size reframing without four separate SVG files.
```

**Expect to decide:** the reframing approach. A single SVG with a size-dependent `viewBox` is the clean answer.

**Done when:** the 20px avatar is recognisable as its character.

---

## 14. SpeechBubble

```
/design-system extend SpeechBubble for the hey. comic panels.

Requirements:
- Hand-drawn-looking polygon, NOT a rounded rectangle. Irregular clip-path with a
  tail that reads as inked.
- Props: tail ('bottom-left' | 'bottom-right' | 'top-left' | 'none'),
  tone ('speech' | 'thought' | 'shout'). Shout has a jagged starburst outline.
- 3px ink border. Border must follow the clip-path exactly — a clip-path alone
  removes the border, so solve this with an SVG shape or a layered pseudo-element.
- Typography var(--font-chunky) Modak, minimum 14px, and never below that.
- Auto-sizes to content, max-width 34ch, wraps without breaking the tail.
- Must be real readable text, not an image, for screen readers and for search.

The border-following-clip-path problem is the core of this component. Solve it first.
```

**Expect to decide:** SVG shape versus layered pseudo-element. SVG is more reliable and scales the stroke properly.

**Done when:** a one-word bubble and a three-line bubble both keep an intact border and a correctly attached tail.

---

## 15. ComicPanel

```
/design-system extend ComicPanel for the hey. brand story section.

Requirements:
- Composes Card + SpeechBubble + a mascot slot.
- 3px ink border, flavour tint background, subtle paper texture.
- Torn or perforated bottom edge via an SVG mask, so it reads as printed comic stock.
- Props: flavour, aspect ('1:1' | '4:3' | '16:9'), revealDelay (ms).
- Reveal on intersection: opacity 0 to 1 plus translateY(22px) plus rotate from -3deg
  to 0. Staggered 180ms between siblings, spring easing.
- The reveal must fire once, then disconnect the observer.
- Two layouts: grid mode (2x2, four small panels) and solo mode (one large panel).
  Switching between them must not remount the mascot or restart its animation.
- Reduced motion: all panels visible immediately, no stagger, no rotation.

Explain how to preserve mascot state across a grid-to-solo transition.
```

**Done when:** switching tabs four times in a row does not cause a flash or a re-fetch.

---

## 16. HeatMeter

```
/design-system extend HeatMeter for hey. flavour cards.

Requirements:
- Five 15px squares, 2px ink border, filled squares use var(--ink).
  Deliberately NOT chilli icons — the ink squares are more distinctive and print better.
- Props: value (1-5), max (default 5), size ('sm' | 'md'), label (boolean).
- Accessibility: this is the important part. It must not be five decorative divs.
  Use role="img" with aria-label="Heat level 4 out of 5", or propose a meter element
  if you think that is more correct. Argue it.
- Must be legible without colour, since the fill is ink on a coloured background.
  Verify contrast of ink squares on all four flavour fills.
- Optional variant for crunch level, using a different glyph so the two are not confused.

Recommend role=img versus <meter> and justify it.
```

**Expect to decide:** `role="img"` versus `<meter>`. `<meter>` carries semantics you cannot style away cleanly; `role="img"` with a good label is usually the pragmatic answer.

**Done when:** a screen reader says "Heat level 4 out of 5" as a single announcement, not "square square square".

---

## 17. Modal

Build this once, correctly. Three features depend on it.

```
/design-system extend Modal for the hey. site.

Requirements:
- Scrim: rgba ink at 70%, 5px backdrop blur, click-outside closes.
- Panel: var(--paper), 3px ink border, var(--shadow-xl), 12px top border in var(--accent).
- Enters with a spring scale from 0.94 and translateY 12px over var(--dur-base).
- Sizes: sm 400, md 460, lg 620px. Full-screen below 640px viewport width.
- Optional decoration slot that overlaps the panel edge, used for the mascot
  in the top-left corner of the notify modal. It must not clip and must not be
  read by screen readers.

Accessibility, all required:
- role=dialog, aria-modal=true, labelled by the heading via aria-labelledby.
- Focus moves to the first focusable element on open, or to the panel if none.
- Focus is trapped: Tab from the last element goes to the first, Shift+Tab reverses.
- ESC closes. Focus returns to the trigger on close, always.
- Background scroll locked without a layout shift from the disappearing scrollbar.
- Content behind is inert (the inert attribute, or aria-hidden on the app root).
- Nested modals are not supported; make that explicit in the API.

Reduced motion: appears instantly, no scale or translate.

Give me the full focus-management implementation, not a summary of it.
```

**Done when:** you can complete the entire notify flow using only a keyboard, and focus returns to the exact button you opened it from.

---

## 18. Toast

```
/design-system extend Toast for the hey. site.

Requirements:
- Fixed bottom-centre, ink background, paper text, fully round, var(--z-toast).
- Enters with a spring translateY from 120%, auto-dismisses after 2200ms.
- Props: message, tone ('default' | 'success' | 'error'), duration, action (optional
  label plus handler, for example "Undo").
- Queue behaviour: multiple toasts must not overlap. Decide between stacking and
  replacing, and justify the choice.
- Accessibility: role=status with aria-live=polite for default and success,
  role=alert with aria-live=assertive for errors. Announcements must not be duplicated
  when the same message fires twice.
- Hovering pauses the dismiss timer.
- Must be dismissible by keyboard when it carries an action.
- Reduced motion: fades instead of sliding.

Resolve the stack-versus-replace question.
```

**Expect to decide:** stack versus replace. Replace, with a maximum of one visible toast. This site never has two things to say at once, and stacking adds complexity for no gain.

**Done when:** firing five toasts rapidly produces one clean sequence, not overlap.

---

## 19. ProductCard

```
/design-system extend ProductCard for the hey. shop section.

Composes: Card, Stamp, HeatMeter, Button, MascotAvatar, MakhanaPuff.

Requirements:
- Image area: flavour tint background, pack render tilted -2deg that straightens
  on hover, SOLD OUT stamp centred, mascot popping in from behind the pack on hover.
- Body: name in Modak, a mono line reading "PERI PERI · 60g", a price row with the
  MRP struck through beside the live price, a HeatMeter, and a full-width Notify button.
- Card shadow uses the flavour's own shadow token, not ink.
- Two faces. The back face, shown after signup, is the flavour colour with a ticket
  stub graphic, "You're on the list", a ticket number, and the mascot with a thumbs-up.
  Flip is rotateY 180deg over var(--dur-slow).
- The flipped state persists per flavour in localStorage and must be restored on load
  WITHOUT a visible flip animation on first paint.
- Only one interactive element: the Notify button. The card is a hover surface, not
  a click target. When flipped, the button is removed from the tab order entirely.
- Skeleton loading state matching the card's exact dimensions, so there is no layout shift.
- Reduced motion: cross-fade between faces instead of flipping.

Explain how to restore the flipped state on load without animating.
```

**Expect to decide:** the restore-without-animating problem. Set the state before paint and only enable the transition after the first frame.

**Done when:** you sign up, reload, and the card is already flipped with no flash.

---

## 20. FlavourColumn

```
/design-system extend FlavourColumn for the hey. "Our Makhanas" section.

Requirements:
- Full-height column, solid flavour fill, grain overlay, 3px ink divider between
  siblings, zero gaps, zero rounded corners.
- Contains: an index label ("01 / 04"), the mascot standing on the bottom edge,
  the name in Modak rotated -4deg, a mono descriptor, a HeatMeter, and a Notify
  button that slides up on hover.
- Hover or focus-within: this column flexes to 1.7 while siblings compress, over
  420ms with spring easing. The mascot scales 1.1 and plays its idle loop.
  The ink border thickens to 4px. Nine MakhanaPuff particles burst upward from the base.
- The expansion MUST also trigger on keyboard focus, not hover alone.
- Particle burst must be capped and must clean up its DOM nodes. It must not fire
  on rapid hover-in and hover-out, so debounce it.
- Mobile below 900px: becomes a horizontal snap-scroll carousel with a 12% peek of
  the next card so the swipe is discoverable. No expansion behaviour on touch.
- Reduced motion: no flex change, no particles, no mascot scale. Use a border
  thickness change alone to signal focus.
- Text colour comes from var(--{flavour}-on). Verify contrast on all four fills.

Give me the debounce strategy and the particle cleanup guarantee.
```

**Done when:** tabbing through the four columns expands each in turn, and rapid mouse movement across all four leaves zero orphaned DOM nodes.

---

## TIER 2 GATE

```
/design-system audit
```

- [ ] Every Tier 2 component is built only from Tier 1 components
- [ ] Zero nested-interactive violations in axe
- [ ] Every composite renders correctly in all four themes and in night mode
- [ ] Reduced-motion path exists and is tested for each
- [ ] Score 90+

---

# TIER 3 — Patterns

Full features assembled from Tier 1 and 2. These carry business logic, so they need tests, not just states.

---

## 21. NotifyForm

The only component on the site with a real business outcome. Everything else is decoration by comparison.

```
/design-system extend NotifyForm, the waitlist signup pattern for hey.

Composes: Input, Checkbox, Chip, Button, Toast.

Fields:
- Email, required, type email
- Phone, optional, +91 prefix locked, 10 digits, Indian mobile validation
- Flavour preference, multi-select chips, pre-checked with whichever the user clicked
- Pin code, optional, 6 digits, feeds the store-locator rollout
- Consent checkbox, REQUIRED and unchecked by default, with a Privacy link

Behaviour:
- Validation fires on blur and on submit. Never on every keystroke.
- On submit: button enters loading state with a spinning MakhanaPuff, form is disabled,
  aria-busy set.
- Success: 30 MakhanaPuff confetti particles, the source ProductCard flips,
  a toast reads "You're #2419 in line", modal closes after 1.2s.
- Duplicate email is NOT an error. Show "Already on the list. We remember you."
  and merge the flavour preferences.
- Network failure: keep the form open, preserve every entered value, show a retry
  affordance. Losing a user's input on a failed request is unacceptable.
- Honeypot field, visually hidden but NOT display:none, and never focusable via tab.
- Invisible Turnstile, verified server-side.

Copy, all Hinglish, no em dashes:
- Invalid email: "That email looks... unusual. Mind checking?"
- Bad phone: "10 digits, please."
- No consent: "We need this to email you. That's kind of the point."

Two layouts: full (in the modal, all fields) and compact (in the command palette,
email plus chips only, three fields maximum).

Accessibility:
- Real <form> with onSubmit, so Enter submits from any field.
- Errors linked by aria-describedby, focus moves to the first invalid field on
  failed submit.
- Success announced in a polite live region.
- Fully completable by keyboard alone.

Give me the validation schema, the full error matrix, and the network-failure recovery.
```

**Expect to decide:** what happens to entered data on a failed request. Preserve everything, always.

**Done when:** the Playwright suite in Phase 5.4 of the playbook passes end to end.

---

## 22. CommandPalette

```
/design-system extend CommandPalette for hey., built on the cmdk library.

Trigger: ⌘K or Ctrl+K, the header ⌘K pill, or "/" pressed outside any input.

Shell:
- 580px wide, var(--paper), 4px ink border, var(--shadow-xl), positioned at 16vh.
- Spring scale from 0.94 plus translateY 12px on enter.
- Search input in var(--font-mono) 17px, placeholder:
  'type a flavour, a page, or "spicy"...'

Result rows — this is the identity of the feature:
- Each row carries a 6px left colour bar in the colour of the thing it points at.
- On keyboard highlight the entire row fills with that colour, so arrowing down
  paints the palette. Text colour on highlight MUST come from --{flavour}-on,
  never hardcoded, or purple rows will fail contrast.
- Row anatomy: colour bar, 24px MascotAvatar or icon, label, description,
  right-aligned shortcut chip.

Groups: Jump to (5 nav items), Flavours (4), Actions (notify, copy code, contact),
Theme (4 flavours, night mode, sound toggle).

Behaviour:
- Fuzzy search matching label, description, and a keywords array from flavours.ts
  that includes Hinglish and Devanagari synonyms. "mint", "pudina" and "green"
  must all find Pehelwan.
- Selecting "Notify me" morphs the palette in place into the compact NotifyForm.
  Height animates, content cross-fades. It does not open a second modal.
- Theme rows set data-theme on <html> via ThemeProvider and persist.
- Recents: the last 3 used commands pinned at the top under a RECENT label.
- Empty state: the four mascots shrugging, plus 'Kuch nahi mila. Try "peri".'
- Mobile: a floating search bubble bottom-right instead of the ⌘K pill.

Accessibility:
- role=dialog, aria-modal, focus trapped, focus returned to the trigger on close.
- Combobox pattern: aria-activedescendant on the input, role=listbox on the list,
  role=option on rows. Do NOT move DOM focus to the rows.
- Result count announced in a polite live region as the query changes, debounced.
- ESC closes. Arrow keys navigate. Enter selects. Tab cycles groups.

Confirm the combobox ARIA wiring and the debounce on the live region.
```

**Expect to decide:** whether the inline notify form is a good idea or a scope trap. It is worth it, but only if the compact layout is genuinely three fields.

**Done when:** arrowing from top to bottom paints every colour with legible text on each, and the whole thing is operable without a mouse.

---

## 23. Header

```
/design-system extend Header for the hey. site.

Layout: "Shop | Store Locator" left, the hey. logotype centre,
"About Us | ⌘K | Cart(0)" right.

Requirements:
- 72px tall, var(--paper), 3px ink bottom rule, sticky at top, var(--z-header).
- Logotype in Rozha One 40px. The full stop is a filled circle in var(--accent),
  and it recolours as the user scrolls past each flavour section. This is the
  signature detail — get it right.
- After 100vh of scroll: shrinks to 56px, background becomes var(--accent-tint),
  gains var(--shadow). Spring transition over 320ms.
- The shrink must be driven by a throttled scroll listener or an IntersectionObserver
  sentinel, never an unthrottled scroll handler.
- ⌘K pill pulses once, 3 seconds after first load, then never again.
  Persist that in localStorage. On mobile it becomes a search icon.
- Mobile: hamburger opens a full-screen takeover in the current flavour colour,
  links at var(--fs-h1) in Rozha One, mascot peeking from the bottom corner.
  The takeover traps focus and closes on ESC.
- A skip-to-content link that is visually hidden until focused.
- Reduced motion: no shrink animation, instant state change.

Give me the scroll-driven accent logic and confirm it does not fight an explicitly
chosen palette theme.
```

**Expect to decide:** the interaction between scroll-driven accent and a user-chosen theme. The user's choice must win.

**Done when:** scrolling the full page changes the logotype dot four times smoothly, and choosing a theme in the palette freezes it.

---

## 24. Footer

```
/design-system extend Footer for the hey. site.

Requirements:
- var(--ink) background, var(--paper) text, full bleed.
- Four columns: Shop (the four flavours from flavours.ts, never hardcoded),
  Info, Support, Newsletter.
- Newsletter: an inline Input plus a → Button. Reuses NotifyForm's email validation
  logic rather than duplicating it.
- A giant "hey." in Rozha One at min(26vw, 300px), cropped so only the top 70%
  is visible. It must be aria-hidden, since the logotype already appears in the header.
- The four mascots stand along the bottom edge, half-cropped by the viewport,
  waving. Decorative, aria-hidden.
- Social row as 3px-outlined circular stickers with accessible names,
  not just icons.
- Bottom bar in mono: "© hey. 2026 ✱ MADE WITH GHEE-LEVEL LOVE ✱ BIHAR → YOUR FACE"
- Two columns below 900px.
- Every link must meet contrast against ink. Verify, since paper at reduced opacity
  will fail.

Flag any contrast failures in the muted link colours.
```

**Expect to decide:** the muted-link opacity. Anything below about 70% paper on ink will fail AA.

**Done when:** every footer link passes 4.5:1 and the cropped wordmark does not create a horizontal scrollbar.

---

## 25. ScrollReveal

A utility wrapper, but it belongs in the system so reveals stay identical everywhere.

```
/design-system extend ScrollReveal, a utility wrapper for the hey. site.

Purpose: one consistent reveal used by every section, so reveals never drift.

Requirements:
- Reveal is translateY(24px) plus opacity 0 to 1. Nothing else.
  Deliberately NO scale, NO blur, NO rotation — piling those on is the visual
  signature of an unconsidered site.
- Props: delay (ms), stagger (ms, applied to direct children), threshold,
  once (default true).
- Uses IntersectionObserver, disconnects after firing when once is true.
- Must never leave content invisible if the observer fails or JS is disabled.
  Content is visible by default and the component hides it only after mount.
  Explain how to do this without a flash.
- prefers-reduced-motion: renders children with no animation and no observer at all.
- Must not create a wrapper div that breaks a parent grid or flex layout.
  Propose a solution — probably display:contents, with its accessibility caveats noted.

Address the no-JS visibility problem and the display:contents caveat.
```

**Expect to decide:** the `display: contents` accessibility bug. It has historically removed semantics in some browsers, so it needs checking against current support.

**Done when:** disabling JavaScript leaves all content visible, and the reveal never causes layout shift.

---

## 26. JarStory

The largest component on the site. Build it last, and build its fallback first.

```
/design-system extend JarStory, the ingredient scrollytelling section for hey.

Spec: hey-makhana-design-spec.md §07, the seven-beat timeline.

BUILD THE FALLBACK FIRST. Before any scroll logic, build the static version:
a jar illustration on the left, seven ingredient cards on the right, revealed with
ScrollReveal. This is what runs under prefers-reduced-motion and on low-power devices.
Building it afterwards means it never gets built properly.

Then layer the scrollytelling:
- 420vh section with a position:sticky 100vh stage. GSAP ScrollTrigger, scrub 1.
- Import only gsap/ScrollTrigger, never the full bundle.
- Seven beats: intro question, makhana, almonds, cashews, peanuts, seeds,
  spice cloud, then the shake, then the finale.
- Particles are absolutely positioned SVG sprites. Settle positions are PRE-COMPUTED
  into a static array. No live physics engine — it will jank on mid-range Android.
- Cap total DOM nodes at 140. Animate transform and opacity ONLY.
  No top, no width, no filters.
- A 7-notch progress rail on the right edge, filling in the accent colour.
- A "Skip →" escape hatch, top-right of the pinned stage.
- The shake beat: jar rotates ±8deg and translates ±14px over 6 oscillations in
  about 900ms, with a WebAudio crunch if sound is enabled.
- Sound is synthesised (filtered noise burst), no audio files, off by default,
  persistent toggle, never autoplays.

Accessibility:
- The section must be fully comprehensible without scrolling through it.
  The ingredient list must also exist as real, readable text.
- Pinning must not trap keyboard users. Tabbing to the Skip link must work
  from anywhere in the section.
- Announce nothing on scroll — a live region firing seven times is hostile.

Performance gate: 45fps minimum on a mid-range Android at 4x CPU throttle.

Give me the beat timeline as a data structure, and confirm the fallback is
independently renderable.
```

**Expect to decide:** whether 420vh is too long. Watch the `jar_complete` analytics event after launch; under 40% completion means shorten it.

**Done when:** a throttled Android scroll-through holds 45fps, and the reduced-motion version communicates the same information with zero scroll logic running.

---

## TIER 3 GATE

```
/design-system audit
/design:accessibility-review
```

- [ ] Every pattern built only from Tier 1 and 2 components
- [ ] NotifyForm's Playwright suite passes
- [ ] Full keyboard journey works: open palette, pick flavour, open notify, submit, close
- [ ] Every animation has a tested reduced-motion path
- [ ] Bundle under 180KB gzipped
- [ ] Score 90+

---

# Summary

| # | Component | Tier | Depends on |
|---|---|---|---|
| 1 | ThemeProvider | 1 | — |
| 2 | Grain | 1 | — |
| 3 | MakhanaPuff | 1 | — |
| 4 | Button | 1 | MakhanaPuff |
| 5 | Pill | 1 | — |
| 6 | Input | 1 | — |
| 7 | Checkbox | 1 | — |
| 8 | Chip | 1 | MascotAvatar (optional) |
| 9 | Stamp | 1 | — |
| 10 | Marquee | 1 | — |
| 11 | Card | 2 | — |
| 12 | SectionHeading | 2 | Pill |
| 13 | MascotAvatar | 2 | mascot SVGs |
| 14 | SpeechBubble | 2 | — |
| 15 | ComicPanel | 2 | Card, SpeechBubble |
| 16 | HeatMeter | 2 | — |
| 17 | Modal | 2 | Card |
| 18 | Toast | 2 | — |
| 19 | ProductCard | 2 | Card, Stamp, HeatMeter, Button, MascotAvatar |
| 20 | FlavourColumn | 2 | HeatMeter, Button, MakhanaPuff |
| 21 | NotifyForm | 3 | Input, Checkbox, Chip, Button, Toast |
| 22 | CommandPalette | 3 | NotifyForm, MascotAvatar, ThemeProvider |
| 23 | Header | 3 | Pill, ThemeProvider |
| 24 | Footer | 3 | Input, Button |
| 25 | ScrollReveal | 3 | — |
| 26 | JarStory | 3 | ScrollReveal, MakhanaPuff, Pill |

**Three ordering notes.** MascotAvatar is listed in Tier 2 but Chip optionally uses it, so build a version without the avatar in Tier 1 and add the prop later. ScrollReveal is technically a Tier 1 utility but is listed late because nothing needs it until sections are assembled. JarStory is a section rather than a component, and it appears here only because it is complex enough to deserve the same rigour.