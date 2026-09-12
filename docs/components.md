# Component Library Documentation

This document catalogs all components in the hey. design system, including variants, states, accessibility features, and usage patterns.

---

## Button

**Purpose:** Primary call-to-action for user interactions. Supports multiple variants and sizes to accommodate different visual hierarchies.

**Location:** `src/components/button/Button.tsx`

### Variants
| Variant | Use when |
|---------|----------|
| `primary` | Main actions (CTA, submit, confirm) |
| `secondary` | Supporting actions; same visual weight as primary but softer intent |
| `ghost` | Tertiary actions; low visual weight; no background fill |
| `danger` | Destructive actions (delete, unsubscribe); uses `--chilli` colour |

### Sizes
| Size | Height | Use when |
|------|--------|----------|
| `sm` | 36px | Compact contexts (inline actions, footers) |
| `md` | 44px | Default; most buttons on the page |
| `lg` | 52px | Hero CTAs requiring emphasis |

### States
| State | Behavior | Visual |
|-------|----------|--------|
| Default | Interactive | Full opacity, standard shadow |
| Hover | Lift (translate -2px, -2px); shadow grows to `var(--shadow)` | Spring easing, 160ms |
| Active | Press inward (translate 2px, 2px); shadow shrinks | 3px shadow, spring easing |
| Disabled | Non-interactive | 40% opacity (`var(--opacity-disabled)`), no transform |
| Focus visible | Branded focus ring | 4px paper ring + 8px indigo ring |
| Loading | Shows spinning makhana puff; disabled | Icon hidden, aria-busy=true |

### Props
| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `variant` | `primary \| secondary \| ghost \| danger` | `primary` | Controls fill and colour |
| `size` | `sm \| md \| lg` | `md` | — |
| `iconOnly` | boolean | false | Square button; meets 44px touch target at all sizes |
| `icon` | ReactNode | `→` | Trailing icon; hidden during loading |
| `loading` | boolean | false | Shows spinner, disables button, sets aria-busy |
| `as` | `button \| a` | `button` | `a` disables native button behaviours |
| `disabled` | boolean | false | Only applies if `as="button"` |
| `children` | ReactNode | — | Button label (required) |

### Accessibility
- **Role:** Native `<button>` or `<a>`
- **Keyboard:** Tab focus, Enter/Space to activate (button) or follow (link)
- **Screen reader:** Label read as button text; `aria-busy` announced during loading; icon-only buttons require aria-label
- **Focus ring:** Visible indigo ring at 4px offset; works on any background

### Reduced motion
All animations transition to none; button remains interactive but static.

### Do's and Don'ts
| ✅ Do | ❌ Don't |
|------|---------|
| Use semantic HTML (`<button>` or `<a>`) | Don't nest other interactive elements inside |
| Provide aria-label for icon-only buttons | Don't rely on hover state for critical info |
| Use loading state for async operations | Don't change size mid-action; commit to a size |
| Pair with descriptive label text | Don't use for navigation; use `<a>` instead |

---

## Card

**Purpose:** Container for bounded content. Supports interactive and static use; elevation and tilt for personality.

**Location:** `src/components/card/Card.tsx`

### Elevation (shadow depth)
| Elevation | Shadow | Use when |
|-----------|--------|----------|
| `flat` | None | Minimal visual weight (stacked in lists) |
| `raised` | 6px offset | Default; most cards on the page |
| `floating` | 9px offset | Hover state or emphasis |

### Padding
| Padding | Value | Use when |
|---------|-------|----------|
| `none` | 0 | Custom internal layout |
| `sm` | var(--s-3) = 12px | Dense layouts |
| `md` | var(--s-4) = 16px | Default |
| `lg` | var(--s-5) = 24px | Spacious layouts; hero cards |

### States
| State | Behavior | Notes |
|-------|----------|-------|
| Default | Static; 3px border, 3px shadow | — |
| Hover (interactive=true) | Lift -3px/-3px; shadow grows 9px | Spring easing, 160ms |
| Active (interactive=true) | Press +2px/+2px; shadow shrinks to 3px | — |
| Disabled (interactive=true) | 40% opacity; no transform | Cursor not-allowed |
| Focus visible (interactive=true) | Indigo focus ring (4px + 8px offset) | — |

### Props
| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `as` | `div \| a \| button` | `div` | Element type; button auto if interactive=true |
| `elevation` | `flat \| raised \| floating` | `raised` | Shadow depth |
| `shadowColor` | string | `ink` | Token name for shadow colour; e.g., `pataka` → `var(--pataka-sh)` |
| `interactive` | boolean | false | Makes card clickable; auto-uses `<button>` if no `as` provided |
| `tilt` | number | 0 | Rotation in degrees; e.g., `-2` for -2° tilt |
| `padding` | `none \| sm \| md \| lg` | `md` | Internal padding |
| `children` | ReactNode | — | Card content |

### Accessibility
- **Role:** Native semantic element (`<a>`, `<button>`, or generic `<div>`) |
- **Keyboard:** Focusable if interactive; Enter to activate |
- **Screen reader:** Read as the contained content; no extra verbosity needed |
- **Focus ring:** Visible indigo ring at 4px offset; painted double-ring technique for visibility over any background |

### Reduced motion
Hover/active transforms disabled; card remains interactive but static.

### Do's and Don'ts
| ✅ Do | ❌ Don't |
|------|---------|
| Use `interactive=true` for single clickable action | Don't nest buttons/links inside interactive card |
| Pair with grain overlay for solid fills | Don't use tilt on every card; reserve for accent cards |
| Use shadow colour matching content (e.g., pataka card gets pataka shadow) | Don't exceed 3° tilt; readability suffers |

---

## Pill

**Purpose:** Compact tagged label or action button. Three distinct variants for different semantic roles.

**Location:** `src/components/pill/Pill.tsx`

### Variants
| Variant | Element | Use when |
|---------|---------|----------|
| `label` | `<span>` | Static text (section eyebrows, nutrition badges, metadata) |
| `action` | `<button>` | Clickable (filter chips, secondary CTAs) |
| `kbd` | `<kbd>` | Keyboard shortcut display (⌘K indicator, hotkey references) |

### Tones
| Tone | Background | Text | Use when |
|------|-----------|------|----------|
| `default` | `var(--paper)` | `var(--ink)` | Neutral/semantic default |
| `accent` | `var(--accent-tint)` | `var(--ink)` | Theme-aware emphasis (matches current flavour) |
| `inverse` | `var(--ink)` | `var(--paper)` | High contrast; dark background required |

### States (action variant only)
| State | Behavior | Visual |
|-------|----------|--------|
| Default | Static | 2px outline, 12px padding |
| Hover | Lift -2px/-2px; shadow appears | var(--shadow-sm) = 4px offset |
| Active | Press +1px/+1px; shadow disappears | — |
| Disabled | Non-interactive | 40% opacity; cursor not-allowed |
| Focus visible | Indigo focus ring | 3px paper + 6px indigo offset |

### Props
| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `variant` | `label \| action \| kbd` | `label` | Element type and behaviour |
| `tone` | `default \| accent \| inverse` | `default` | Colour scheme |
| `glyph` | boolean | false | Adds leading ✱ character (decorative, hidden from AT) |
| `children` | ReactNode | — | Pill text |
| `className` | string | — | Additional CSS classes |

### Accessibility
- **Role:** Native semantic elements (`<span>`, `<button>`, `<kbd>`) |
- **Keyboard (action only):** Tab focus, Enter/Space to activate |
- **Screen reader:** Label read as text; glyph hidden (`aria-hidden`) |
- **Focus ring (action only):** Visible 6px indigo ring with 3px paper gap |

### Reduced motion
Action variant hover/active transforms disabled.

### Do's and Don'ts
| ✅ Do | ❌ Don't |
|------|---------|
| Use kbd variant only for actual keyboard shortcuts | Don't use glyph as the only visual identifier |
| Pair action pills with clear label text | Don't make pills smaller than 12px (readability) |
| Use accent tone for current theme emphasis | Don't nest pills; they're atomic |

---

## Input

**Purpose:** Text input with optional prefix, validation states, and helper text. Accessible labels and error display.

**Location:** `src/components/input/Input.tsx`

### Sizes
| Size | Height | Use when |
|------|--------|----------|
| `sm` | 36px | Compact contexts |
| `md` | 44px | Default |
| `lg` | 52px | Hero forms |

### States
| State | Border | Background | Cursor |
|-------|--------|-----------|--------|
| Default | 3px ink | var(--paper) | text |
| Hover | 4px ink (thickens) | var(--paper) | text |
| Focus | 4px ink + indigo focus ring (4px + 8px) | var(--paper) | text |
| Disabled | 3px ink | var(--paper) | not-allowed; 40% opacity |
| Error | 3px chilli | var(--paper) | text |
| Read-only | 3px ink | var(--paper-2) | default |
| Filled (with value) | 3px ink | var(--paper) | text |

### Props
| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `label` | string | — | Associated label text (required for a11y) |
| `type` | string | `text` | HTML input type (email, tel, number, etc.) |
| `placeholder` | string | — | Placeholder text (40% opacity) |
| `value` | string | — | Controlled value |
| `onChange` | function | — | Change handler |
| `disabled` | boolean | false | Non-interactive; 40% opacity |
| `error` | string | — | Error message; shows below input in chilli colour |
| `helperText` | string | — | Helper text below input; 65% opacity (`var(--opacity-helper)`) |
| `prefix` | string | — | Prefix text (e.g., "+91" for Indian phone numbers) |
| `required` | boolean | false | Shows asterisk in label |
| `size` | `sm \| md \| lg` | `md` | — |

### Accessibility
- **Role:** Native `<input>` with associated `<label>` |
- **Keyboard:** Tab focus, standard text input shortcuts (arrow keys, Ctrl+A, etc.) |
- **Screen reader:** Label announced as label for input; required status announced via asterisk + screen-reader-only text; error and helper text associated via aria-describedby |
- **Focus ring:** Indigo ring at 4px + 8px offset; visible on all backgrounds |

### Reduced motion
No animations; transitions disabled.

### Do's and Don'ts
| ✅ Do | ❌ Don't |
|------|---------|
| Always provide a visible label | Don't rely on placeholder as label |
| Use error state for validation feedback | Don't disable form during submission; use loading state instead |
| Set appropriate input type (email, tel, number) | Don't hardcode prefix width; let token spacing handle it |

---

## Checkbox

**Purpose:** Binary yes/no selection. Works as a single checkbox or in groups; supports required and error states.

**Location:** `src/components/checkbox/Checkbox.tsx`

### States
| State | Indicator | Behaviour |
|-------|-----------|-----------|
| Unchecked | Empty box (3px border) | Clickable; toggles to checked |
| Checked | Box + checkmark (accent fill) | Clickable; toggles to unchecked |
| Disabled | 40% opacity | Non-interactive; cursor not-allowed |
| Focus visible | Indigo focus ring (4px + 8px) | Keyboard or pointer focus |
| Error | Border switches to chilli | Validation failed |

### Props
| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `label` | string | — | Associated label text (required) |
| `checked` | boolean | false | Controlled checked state |
| `onChange` | function | — | Change handler |
| `disabled` | boolean | false | Non-interactive; 40% opacity |
| `required` | boolean | false | Shows asterisk in label |
| `error` | string | — | Error message shown below |
| `helperText` | string | — | Helper text shown below |

### Accessibility
- **Role:** Native `<input type="checkbox">` with associated `<label>` |
- **Keyboard:** Tab focus, Space to toggle |
- **Screen reader:** Label announced; required status and error messages announced via aria-describedby |
- **Focus ring:** Visible indigo ring at 4px + 8px offset |

### Reduced motion
Checkmark animation disabled; transition set to none.

---

## CommandPalette

**Purpose:** Global keyboard-driven navigation and action palette. Fuzzy-searchable with theme switching and inline notify flow.

**Location:** `src/components/command-palette/CommandPalette.tsx`

### Groups
1. **Jump to (navigation):** Shop, Store Locator, About Us, Ingredients, Meet the mascots
2. **Flavours:** Pataka, Malai, Jaadu, Pehelwan (each in its own colour; mascot avatar)
3. **Actions:** Notify me, Copy discount code, Contact us
4. **Theme:** 4 flavour switches + Night mode toggle

### Features
- **Fuzzy search:** Typing `peri` matches "Pataka Peri Peri"; `mint` matches Pehelwan
- **Keyboard nav:** ↑↓ to navigate, Enter to select, Esc to close, Tab to cycle groups
- **Live region:** Results announced to screen readers (polite priority)
- **Recent commands:** Last 3 used commands pinned at top (localStorage)
- **Empty state:** 4 mascots shrugging + "Kuch nahi mila. Try 'peri'."
- **Mobile:** Floating search bubble bottom-right; no ⌘K pill

### Inline Notify (when "Notify me" is selected)
- Palette morphs in place (height animates, content cross-fades)
- Shows email field, flavour chip selectors, submit
- On success: panel fills with flavour colour, "✱ you're in." for 1.2s, then closes

### States
| State | Behaviour |
|-------|-----------|
| Closed | Hidden; triggered by ⌘K, Ctrl+K, or clicking trigger pill |
| Open (list) | Shows search + results; focus trapped; overlay at 60% opacity |
| Open (inline notify) | Panel morphs; shows form only |
| Success | Panel fills with flavour colour; shows confirmation message |

### Props
| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `open` | boolean | false | Controlled open state |
| `onOpenChange` | function | — | Called when state changes |
| `theme` | string | `pataka` | Current flavour theme |
| `onThemeChange` | function | — | Called when theme switches |

### Accessibility
- **Role:** `role="dialog"` `aria-modal="true"` |
- **Keyboard:** ⌘K / Ctrl+K to open, Esc to close, ↑↓ to navigate, Enter to select |
- **Screen reader:** Live region for results (polite), focus trapped, focus returned to trigger on close |
- **Focus ring:** Standard indigo ring on search input and rows |

### Do's and Don'ts
| ✅ Do | ❌ Don't |
|------|---------|
| Use fuzzy search for discoverability | Don't make command list longer than 30 items |
| Persist theme selection in localStorage | Don't require mouse to navigate (keyboard must work) |
| Include Hinglish synonyms in search keywords | Don't change the layout on mobile; switch to bubble UI |

---

## Modal

**Purpose:** Dialog overlay for forms (Notify Me), confirmations, or focused content. Sized (sm/md/lg) with optional mascot decoration.

**Location:** `src/components/modal/Modal.tsx`

### Sizes
| Size | Max-width | Use when |
|------|-----------|----------|
| `sm` | 400px | Confirmations, quick forms |
| `md` | 460px | Default; Notify Me form |
| `lg` | 620px | Complex forms, detailed content |

### States
| State | Behavior |
|-------|----------|
| Closed | Hidden; overlay not rendered |
| Open | Scrim visible at 70% opacity; panel in focus; focus trapped |
| Scrolling (content > 90vh) | Scroll lives on `.scroll` wrapper; `.panel` stays overflow:visible so decoration can hang off edge |

### Props
| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `open` | boolean | false | Controlled open state |
| `onOpenChange` | function | — | Called when state changes |
| `size` | `sm \| md \| lg` | `md` | Max-width |
| `heading` | string | — | Modal title (top of panel) |
| `children` | ReactNode | — | Modal content |
| `decoration` | ReactNode | — | Mascot or illustration (positioned to overlap top-left corner) |
| `tone` | string | `pataka` | Flavour for top border colour |

### Accessibility
- **Role:** `role="dialog"` `aria-modal="true"` `aria-labelledby` (heading) |
- **Keyboard:** Esc to close, focus trapped, focus returned to trigger on close |
- **Screen reader:** Heading announced, focus management correct, content readable |
- **Focus ring:** Indigo ring on panel and form elements |

### Reduced motion
Animations disabled; panel appears instantly without scale/translate.

### Do's and Don'ts
| ✅ Do | ❌ Don't |
|------|---------|
| Use decoration for brand personality | Don't make modal taller than 90vh (scrolling looks bad) |
| Set tone to match current flavour | Don't nest modals; one layer only |
| Return focus to trigger on close | Don't use modal for navigation; use a page instead |

---

## Marquee

**Purpose:** Scrolling ticker text for announcements. Pauses on hover; respects prefers-reduced-motion.

**Location:** `src/components/marquee/Marquee.tsx`

### States
| State | Behavior | Trigger |
|-------|----------|---------|
| Playing | Text scrolls right→left at ~40s per loop | Default; when not hovered |
| Paused | Text freezes | On hover; mouse enters |
| Resume | Text resumes scrolling | On mouse leave |
| Reduced motion | Static, centred, single message | `prefers-reduced-motion: reduce` |

### Props
| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `children` | ReactNode | — | Content to scroll (usually text with ✱ separators) |
| `direction` | `left \| right` | `left` | Scroll direction (left = rightward scroll) |
| `speed` | number | 40 | Seconds per loop |
| `gap` | string | `var(--s-5)` | Gap between repeated content |

### Accessibility
- **Screen reader:** Content announced once (not repeated); marquee doesn't trap focus |
- **Keyboard:** No interaction needed; read content from DOM |
- **Reduced motion:** Text rendered static and centred, no animation |

### Do's and Don'ts
| ✅ Do | ❌ Don't |
|------|---------|
| Use ✱ separator between items | Don't use small text; keep font-size ≥16px |
| Pause on hover for readability | Don't loop faster than 30s; readability suffers |
| Make content readable even when frozen | Don't hide critical info in marquee |

---

## Grain

**Purpose:** Noise overlay on solid colour fills. Three intensity levels; scoped to prevent overkill.

**Location:** `src/components/grain/Grain.tsx`

### Intensities
| Intensity | Opacity | Use when |
|-----------|---------|----------|
| `subtle` | 3% | Light fills; secondary elements |
| `default` | 4.5% | Standard fills; buttons, cards |
| `heavy` | 6.5% | Dark fills; footer, dark themes |

### Scopes
| Scope | Purpose | Example |
|-------|---------|---------|
| `panel` | Default for cards, buttons, modals | Most common |
| `background` | Large area fills | Section backgrounds |
| `fine` | Smaller, intricate elements | Badges, stamps |

### Props
| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `intensity` | `subtle \| default \| heavy` | `default` | Opacity level |
| `scope` | `panel \| background \| fine` | `panel` | Affects image resolution and performance |
| `className` | string | — | Additional CSS |

### Usage Pattern
```tsx
<div style={{ background: 'var(--accent)' }}>
  Content here
  <Grain scope="panel" intensity="default" />
</div>
```

### Do's and Don'ts
| ✅ Do | ❌ Don't |
|------|---------|
| Apply grain to every solid fill | Don't apply grain to transparent/paper backgrounds |
| Match intensity to fill darkness | Don't layer grain multiple times |

---

## SectionHeading

**Purpose:** Large, stylized section headlines with optional mis-registration shadow for personality.

**Location:** `src/components/section-heading/SectionHeading.tsx`

### Variants
| Variant | Shadow | Use when |
|---------|--------|----------|
| `default` | None | Neutral headline |
| `offset` | 3px `--rani` mis-registration | Accent headline; "Our Makhanas" etc. |

### Sizes
| Size | Font size | Use when |
|------|-----------|----------|
| `lg` | `var(--fs-h1)` | Section main headlines |
| `md` | `var(--fs-h2)` | Sub-section headlines |

### Props
| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `as` | `h1 \| h2 \| h3` | `h1` | Semantic heading level |
| `variant` | `default \| offset` | `default` | Mis-registration shadow |
| `size` | `lg \| md` | `lg` | Font size |
| `children` | ReactNode | — | Heading text |

### Accessibility
- **Role:** Native heading (`<h1>`, `<h2>`, `<h3>`) |
- **Screen reader:** Read as a heading with appropriate level |
- **Semantics:** Match `as` prop to document outline; don't skip levels |

---

## Toast

**Purpose:** Dismissible notification messages. Auto-dismiss after 4s or manual close.

**Location:** `src/components/toast/Toast.tsx` & `ToastProvider.tsx`

### Tones
| Tone | Background | Text | Use when |
|------|-----------|------|----------|
| `default` | accent-tint | ink | General notifications |
| `success` | green tint | ink | Positive confirmation |
| `error` | chilli tint | paper | Error/alert |
| `warning` | amber tint | ink | Caution/warning |

### States
| State | Behavior | Duration |
|-------|----------|----------|
| Appearing | Fade + slide up from bottom | 320ms |
| Visible | Full opacity; auto-dismiss timer running | 4000ms |
| Dismissing | Fade + slide down | 160ms |

### Props
| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `message` | string | — | Toast text |
| `tone` | `default \| success \| error \| warning` | `default` | Colour scheme |
| `duration` | number | 4000 | Auto-dismiss ms; 0 = no auto-dismiss |
| `action` | { label: string; onClick: fn } | — | Optional action button |

### Usage (with ToastProvider)
```tsx
import { useToast } from '@/components/toast/ToastProvider';

function MyComponent() {
  const toast = useToast();
  
  const handleClick = () => {
    toast.show({ message: 'Saved!', tone: 'success' });
  };
  
  return <button onClick={handleClick}>Save</button>;
}
```

### Accessibility
- **Role:** `role="alert"` for errors; `role="status"` for success/default |
- **Screen reader:** Message announced immediately on appear; action button announced as focusable |
- **Keyboard:** Action button is focusable and activatable; Esc to dismiss |
- **Auto-dismiss:** Cancels on focus (user reading) or action click |

---

## ComicPanel

**Purpose:** Four-panel illustrated comic strip revealing on scroll. Tabs to swap strips; stagger animation on reveal.

**Location:** `src/components/comic-panel/ComicPanel.tsx`

### States
| State | Behavior |
|-------|----------|
| Load | Panels reveal sequentially (stagger 180ms) with rotate-in from ±3° |
| Default | All 4 panels visible; Pataka panel highlighted (first tab active) |
| Tab selected | Strip swaps to selected mascot; tint colour updates |
| Shuffle (rotate sticker clicked) | Panel order randomizes with a twist animation |

### Props
| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `panels` | { title, image, description }[] | — | 4 panel objects |
| `onTabChange` | function | — | Called when tab changes |

### Accessibility
- **Role:** `role="tablist"` for tabs, `role="tabpanel"` for panel content |
- **Keyboard:** ← → to switch tabs, Tab to move between regions |
- **Screen reader:** Current tab announced, panel content read in full |
- **Focus ring:** Visible on tab buttons |

---

## Chip (Flavour Selection)

**Purpose:** Toggleable flavour/option selector. Multi-select by default; shows avatar + metadata.

**Location:** `src/components/chip/Chip.tsx`

### States
| State | Appearance | Behavior |
|-------|-----------|----------|
| Unselected | Flavour tint background | Clickable; toggles to selected |
| Selected | Flavour primary fill; lift +shadow | Clickable; toggles to unselected |
| Hover | Lift -2px/-2px; shadow grows | Mouse enters |
| Active (selected hover) | Lift -3px/-3px; shadow larger | Mouse on selected chip |
| Disabled | 40% opacity; no transform | Non-interactive |
| Focus visible | Indigo focus ring (3px + 6px) | Keyboard focus |

### Props
| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `label` | string | — | Chip text |
| `theme` | string | — | Flavour slug (pataka, malai, jaadu, pehelwan) |
| `selected` | boolean | false | Controlled selected state |
| `onChange` | function | — | Change handler (e: ChangeEvent<HTMLButtonElement>) |
| `avatar` | string (URL) | — | Optional image; masked to circle |
| `meta` | string | — | Secondary text (e.g., "Heat 4/5"); 75% opacity |
| `disabled` | boolean | false | Non-interactive; 40% opacity |

### Accessibility
- **Role:** `role="checkbox"` (group) or `aria-pressed` (individual) |
- **Keyboard:** Tab to focus, Space to toggle |
- **Screen reader:** Label announced; selected state announced via aria-pressed |
- **Focus ring:** Visible indigo ring at 3px + 6px offset |

---

## MaskotAvatar

**Purpose:** Small circular mascot illustrations. Used in palette rows, chips, and decorative slots.

**Location:** `src/components/mascot-avatar/MascotAvatar.tsx`

### Props
| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `character` | `pataka \| malai \| jaadu \| pehelwan` | — | Mascot to render |
| `size` | number | 40 | Width/height in px |
| `animate` | boolean | false | Plays idle loop (blink/bounce/sparkle) |

### Sizes
- **20px:** Palette row icon
- **24px:** Chip avatar
- **40px:** Modal decoration (default)
- **64px+:** Hero sections

---

## HeatMeter

**Purpose:** 5-square visual indicator of spiciness. Filled squares = heat level.

**Location:** `src/components/heat-meter/HeatMeter.tsx`

### Props
| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `level` | 1–5 | 3 | Number of filled squares |
| `size` | number | 16 | Square size in px |
| `gap` | number | 4 | Gap between squares |

---

## FlavourColumn (4-Column Grid)

**Purpose:** Full-bleed column in the 4-colour grid section. Expands on hover; particle burst effect.

**Location:** `src/components/flavour-column/FlavourColumn.tsx`

### States
| State | Behavior | Effect |
|-------|----------|--------|
| Default | Column at 1x flex | Static |
| Hover | Expands to 1.6x over 400ms (spring) | Siblings compress; makhana particles burst up (8–12, 700ms) |
| Focus | Same as hover | Keyboard accessible |
| Mobile | Horizontal snap-scroll carousel | Peek of next card at 12% |

### Interactions
- **Mascot:** Scales 8% on hover; plays 3-frame idle loop
- **Notify Me button:** Slides up from bottom on hover
- **Background:** Saturates slightly; border thickens to 4px

### Accessibility
- **Role:** Single focusable link (entire column is one action) |
- **Keyboard:** Tab focus, Enter to navigate |
- **Focus ring:** 4px indigo ring at 4px offset |
- **Screen reader:** Column title and description read; link purpose clear |

---

## ScrollReveal

**Purpose:** Content that fades and slides in on scroll intersection.

**Location:** `src/components/scroll-reveal/ScrollReveal.tsx`

### Default Animation
- **Transform:** translateY(24px) + opacity 0 → 0
- **Trigger:** On intersection (80% threshold)
- **Duration:** 320ms `var(--ease-out)`
- **Stagger (if multiple children):** 80ms between each

### Props
| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `children` | ReactNode | — | Element to animate |
| `threshold` | number | 0.8 | Intersection threshold (0–1) |
| `stagger` | boolean | false | Stagger multiple children by 80ms |

### Reduced motion
Animation disabled; content visible immediately.

---

## JarStage (Ingredient Scrollytelling)

**Purpose:** Pinned scroll-driven sequence showing ingredients poured into a jar. Complex animation; requires heavy engineering.

**Location:** `src/components/jar-story/JarStage.tsx`

### Scroll Timeline
- **0.00–0.10:** Empty jar fades in, scales up from 0.9
- **0.10–0.25:** Makhana pours (40 particles, gravity + bounce, settles to 35%)
- **0.25–0.38:** Almonds drop (12 particles, settles to 50%)
- **0.38–0.50:** Cashews drop (10 particles, settles to 62%)
- **0.50–0.62:** Peanuts drop (14 particles, settles to 72%)
- **0.62–0.74:** Seeds scatter (60 tiny particles, settles to 82%)
- **0.74–0.86:** Spice cloud drifts down (coloured dust; jar tints to flavour colour)
- **0.86–0.95:** JAR SHAKES (lid slams, ±8° rotate, ±14px translate, 6 oscillations ~900ms; screen shakes 4px; background flashes to primary 120ms; crunch SFX plays if enabled)
- **0.95–1.00:** Settles; product pack fades in; final headline appears

### Implementation Notes
- Built with **GSAP ScrollTrigger** (`scrub: 1`) or Framer Motion `useScroll`
- Particles as absolutely-positioned SVG sprites; transform-only animation; `will-change: transform`
- Pre-computed settle positions (no live physics engine — prevents jank on mid-range Android)
- Progress rail on right edge: vertical line with 7 notches, fills in flavour colour
- **Fallback for reduced motion / low-power:** Static stacked infographic (jar left, 7 ingredient cards right, fade on intersection)
- **Skip link** top-right of pinned stage: "Skip →" jumps to section 07

### Accessibility
- **Screen reader:** Ingredient list announced via aria-live region; skip link available |
- **Keyboard:** Skip link focusable and activatable |
- **Reduced motion:** Entire scrollytelling collapses to static infographic; same content, no pinning |

### Props
| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `tone` | string | `pataka` | Flavour colour for tints and flashes |
| `onComplete` | function | — | Called when scroll reaches 1.0 |

---

## Theme Switcher

**Purpose:** Toggle theme (flavour) and night mode. Persists to localStorage.

**Location:** `src/components/theme/ThemeProvider.tsx`

### Usage
```tsx
import { useTheme } from '@/components/theme/ThemeProvider';

function MyComponent() {
  const { theme, setTheme, nightMode, setNightMode } = useTheme();
  
  return (
    <>
      <button onClick={() => setTheme('malai')}>Malai</button>
      <button onClick={() => setNightMode(!nightMode)}>🌙</button>
    </>
  );
}
```

### Storage
- **localStorage key:** `hey-theme` (e.g., `"pataka"`, `"malai"`)
- **localStorage key:** `hey-night-mode` (e.g., `"true"`, `"false"`)
- **Persistence:** Loaded on mount; persists on change

### Props
| Prop | Type | Notes |
|------|------|-------|
| `theme` | string | Current flavour slug |
| `setTheme` | function | Updates theme and storage |
| `nightMode` | boolean | Whether night mode is active |
| `setNightMode` | function | Toggles night mode and storage |

---

## NotifyForm

**Purpose:** Waitlist signup form. Email (required) + phone (optional) + flavour selection + consent checkbox + pin code.

**Location:** `src/components/notify-form/NotifyForm.tsx`

### Fields
1. **Email** – required, type=email
2. **Phone** – optional, +91 prefix locked, 10 digits, `inputmode="numeric"`
3. **Which flavour?** – 4 colour chips, multi-select
4. **Pin code** – optional, drives store-locator rollout
5. **Consent** – required, unchecked by default (DPDP Act compliance)

### States
| State | Behavior |
|-------|----------|
| Idle | Form ready; submit button enabled |
| Submitting | Submit button shows spinning makhana puff; form disabled (70% opacity) |
| Success | Confetti (30 makhana puffs); card flips to back face (rotateY 180deg, 500ms) |
| Error | Inline error below field in chilli colour (e.g., "That email looks... unusual. Mind checking?") |
| Duplicate email | "Already on the list. We remember you." + update flavour prefs (no error) |

### Props
| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `onSubmit` | function | — | Async submit handler; receives form data |
| `defaultFlavours` | string[] | [] | Pre-selected flavours (e.g., from card click) |
| `onSuccess` | function | — | Called on success (for analytics) |

### Accessibility
- **Form:** `<form>` with `aria-label` |
- **Inputs:** All with associated `<label>` elements |
- **Error messages:** Associated via `aria-describedby` |
- **Required indicator:** Asterisk + screen-reader-only "(required)" text |
- **Submit button:** Shows aria-busy during submission |

---

## ProductCard (Shop Grid)

**Purpose:** Product in the shop section. Shows SOLD OUT stamp, heat meter, mascot on hover.

**Location:** `src/components/product-card/ProductCard.tsx`

### States
| State | Appearance | Behavior |
|-------|-----------|----------|
| Default | Tilted pack, SOLD OUT stamp visible | Static |
| Hover | Card lifts (-3px/-3px), shadow grows to 9px, pack straightens, mascot pops in, stamp jitters | Mouse enters |
| Focus | 4px indigo focus ring at 4px offset | Keyboard focus |
| Submitted | Card flips (rotateY 180deg, 500ms) to back face in flavour colour; shows ticket stub + mascot thumbs-up | After successful notify |

### Props
| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `flavour` | string | — | Flavour slug (pataka, malai, jaadu, pehelwan) |
| `name` | string | — | Product name (e.g., "PATAKA PERI PERI") |
| `heat` | number | 3 | Heat level (1–5) for meter |
| `image` | string (URL) | — | Product pack image |
| `onNotifyClick` | function | — | Called when Notify Me is clicked |

### Accessibility
- **Role:** Card is a single focusable button (the entire card is the action) |
- **Keyboard:** Tab focus, Enter to open notify modal |
- **Focus ring:** Visible indigo ring |
- **Screen reader:** Flavour name, heat level, and "Notify Me" action announced |

---

## SpeechBubble

**Purpose:** Hand-drawn polygonal speech bubble for mascot dialogue.

**Location:** `src/components/speech-bubble/SpeechBubble.tsx`

### Props
| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `children` | ReactNode | — | Bubble text |
| `tone` | string | `pataka` | Flavour colour for fill and tail |
| `tailPosition` | `left \| right \| bottom` | `bottom` | Tail direction |
| `className` | string | — | Additional CSS |

### Styling
- 3px ink outline
- Flavour fill + tail
- Hand-drawn-ish polygon (slight irregularity)
- Grain overlay (subtle intensity)

---

## Stamp (SOLD OUT Badge)

**Purpose:** Rotated "SOLD OUT" sticker for product cards. Distressed edge mask.

**Location:** `src/components/stamp/Stamp.tsx`

### Props
| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `text` | string | `SOLD OUT` | Stamp text |
| `rotation` | number | -12 | Rotation in degrees |
| `tone` | string | `ink` | Fill colour token |

### Styling
- Space Mono, uppercase, 18px
- Rotated by default (-12deg)
- Distressed/rough edge mask (SVG perforated border effect)
- Jitters on card hover

---

## Accessibility & Testing Checklist

When shipping any component, verify:

- [ ] Types are exported and documented (TSDoc)
- [ ] All interactive states implemented (default, hover, active, disabled, focus, loading if applicable)
- [ ] Keyboard navigation works (Tab, Enter, Esc, Arrow keys as needed)
- [ ] Focus ring is visible and branded (indigo, 4–8px offset)
- [ ] Screen reader announces labels, roles, and state changes
- [ ] Reduced-motion path is implemented and tested
- [ ] Colours pass WCAG AA contrast (4.5:1 for normal text, 3:1 for large text)
- [ ] No hardcoded colours/sizes; all use tokens from `src/styles/tokens.css`
- [ ] Grain overlay applied to solid colour fills
- [ ] Story / kitchen-sink page updated with variants and states
- [ ] Tested on: Chrome, Safari, iOS Safari, Android Chrome
- [ ] Tested at: 375px (mobile), 768px (tablet), 1280px (desktop), 1920px (wide)

---

**Last updated:** 2026-09-12
