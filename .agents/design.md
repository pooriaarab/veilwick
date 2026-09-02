---
name: VeilWick
description: Media-first design for a private synthetic adult video experience.
colors:
  light-canvas: "oklch(0.99 0.002 250)"
  light-ink: "oklch(0.145 0.01 250)"
  light-surface: "oklch(1 0.002 250)"
  light-muted: "oklch(0.556 0.008 250)"
  light-line: "oklch(0.922 0.005 250)"
  dark-canvas: "oklch(0.15 0.01 250)"
  dark-surface: "oklch(0.2 0.01 250)"
  dark-text: "oklch(0.95 0.005 250)"
  brand-amber: "amber-400 / amber-500"
  brand-rose: "rose-500 / rose-600"
  premium-violet: "violet-600"
  premium-fuchsia: "fuchsia-600"
typography:
  display:
    fontFamily: "Geist, sans-serif"
    fontSize: "clamp(1.5rem, 1rem + 2.5vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  heading:
    fontFamily: "Geist, sans-serif"
    fontSize: "clamp(1.25rem, 1rem + 1.25vw, 2rem)"
    fontWeight: 700
    lineHeight: 1.2
  body:
    fontFamily: "Geist, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Geist, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.25
  technical:
    fontFamily: "Geist Mono, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  sm: "calc(0.625rem - 4px)"
  md: "calc(0.625rem - 2px)"
  lg: "0.625rem"
  xl: "calc(0.625rem + 4px)"
  media: "0.875rem"
  dialog: "0.625rem"
  series-dialog: "1.125rem"
  pill: "9999px"
spacing:
  unit: "4px"
  gutter-mobile: "12px"
  gutter-page: "16px"
  gutter-wide: "24px"
  marketing-max: "72rem"
  product-max: "82.5rem"
  feed-default-max: "360px"
  feed-md-max: "420px"
  feed-lg-max: "360px"
  feed-xl-max: "380px"
components:
  button:
    height: "2.25rem"
    padding: "0.5rem 1rem"
    rounded: "{rounded.md}"
    focusRing: "3px"
  card:
    backgroundColor: "{colors.light-surface}"
    rounded: "{rounded.xl}"
    padding: "1.5rem"
  media-card:
    backgroundColor: "{colors.dark-surface}"
    textColor: "{colors.dark-text}"
    rounded: "{rounded.media}"
  feed-shell:
    backgroundColor: "black"
    width: "100%"
    maxWidth:
      default: "{spacing.feed-default-max}"
      md: "{spacing.feed-md-max}"
      lg: "{spacing.feed-lg-max}"
      xl: "{spacing.feed-xl-max}"
    height: "100dvh"
---

# VeilWick design system

## Overview

VeilWick is a media-first experience for fictional, synthetic adults. The feed
is the main product. Live rooms and series extend the same portrait catalogue.

**Creative North Star: “private cinema in your hand.”**

The system has two contexts. Marketing uses cool light neutrals and technical
clarity. Media routes use black, portrait imagery, and compact white controls.
Amber type detail, Geist, concise copy, and direct states connect both contexts.

The source of truth is the current VeilWick product code. The generic README,
root metadata, worker name, and placeholder binding names are not brand inputs.

Current evidence lives in:

- `apps/web/app/globals.css` for shared tokens, type behavior, and motion.
- `apps/web/src/components/landing/` for the marketing surface.
- `apps/web/app/(app)/feed/feed-client.tsx` for the primary media surface.
- `apps/web/app/(app)/live/live-client.tsx` for live layout and states.
- `apps/web/src/components/series/` for poster grids and episode dialogs.
- `apps/web/src/components/age-gate.tsx` for the required entry gate.

No production custom domain currently resolves. Treat `veilwick.com` and
`cdn.veilwick.com` as future infrastructure until DNS and routing prove them.

## Colors

The frontmatter records the shared semantic foundation. Product routes add
Tailwind utility colors where the source has not defined a custom token.

### Light context

- **Light canvas** supports landing, authentication, and utility content.
- **Light surface** separates cards and popovers from the canvas.
- **Light ink** carries primary copy and dark neutral actions.
- **Light muted** carries secondary copy at readable sizes.
- **Light line** defines cards, inputs, and section boundaries.

### Media context

- **Black** is the feed canvas and video fallback.
- **Zinc 950** supports live rooms, series pages, and episode dialogs.
- **White** carries media controls and primary copy.
- **White opacity steps** separate primary, secondary, and quiet metadata.
- **White at 10 to 20 percent** defines borders and translucent controls.

### Accent roles

- **Amber 400 or 500** marks the `W`, focus, and selected brand detail.
- **Rose 500 or 600** supports the compact mark, live state, and social feedback.
- **Violet 600 to fuchsia 600** marks premium actions and locked episodes.
- **Sky 400** marks verified live hosts only.

Do not swap these roles. A premium gradient does not become the main brand
gradient. Rose does not label ordinary navigation. Amber does not carry body
copy on a light canvas.

Use semantic success, warning, error, and information tokens for system state.
Do not express validation through color alone. Pair color with text or an icon.

Protect media copy with black gradients. The feed uses a stronger bottom fade
and a quiet top fade. Keep control contrast stable across bright video frames.

## Typography

Geist Sans is the interface family. Geist Mono is the technical family. Both
load through `next/font` in `apps/web/app/layout.tsx`.

### Hierarchy

- **Marketing display** uses the fluid 2XL scale, bold weight, and tight tracking.
- **Section headings** use the fluid XL scale or 30px to 36px equivalents.
- **Product headings** use 18px to 24px with bold or black weight.
- **Body** starts at 16px on marketing surfaces.
- **Media body** may use 14px when contrast and line length remain clear.
- **Labels** use 10px to 12px, semibold, and uppercase only for compact status.
- **Technical text** uses Geist Mono for routes, code, IDs, and measurements.

The wordmark uses heavy Geist Sans with tight tracking. Render `Veil`, then an
amber `W`, then `ick`. Preserve the exact VeilWick capitalization in prose.

Headings use balanced wrapping. Paragraphs use pretty wrapping. Tables and
explicitly marked numeric displays use tabular numbers. Apply `tabular-nums` to
durations, prices, counts, and timelines.

Do not use monospace as a decorative technology signal. Do not use uppercase
for paragraphs. Do not place important safety copy below 12px.

## Layout

Marketing content uses a 72rem maximum width and 20px side padding. Major
sections use 64px vertical spacing, then 96px on wider screens.

The feed owns the full viewport. It uses `100dvh` and vertical snap points. Its
portrait shell caps at 360px by default, 420px at `md`, 360px at `lg`, and 380px
at `xl`. Each clip fills one viewport. Keep actions inside safe edges.

The category rail scrolls horizontally. It remains touch-scrollable and does
not expose a visible scrollbar. Every category remains reachable by keyboard.

Live rooms use one responsive split. Video sits above chat on narrow screens.
At large widths, video takes the flexible area and chat uses 340px. The whole
layout stops at 82.5rem.

Series use a portrait poster grid. Columns grow from two to five. Posters keep
a 9:16 aspect. The episode dialog stacks on small screens and splits on large
screens. Its maximum width is 920px.

Landing grids grow from one column to two, then three. Buttons stack on narrow
screens. Header navigation collapses below the desktop breakpoint.

Test 320px, 375px, 768px, 1024px, and 1440px widths. No route may create page
horizontal scroll. Media rails may scroll only inside their named region.

## Elevation & Depth

Marketing surfaces stay flat. Canvas, surface color, and one-pixel borders
create most hierarchy. Static cards do not need large shadows.

The sticky marketing header may use `backdrop-blur-xl` and the subtle shadow
token after scrolling. The series header may use a translucent zinc surface
and a small blur. Blur supports legibility, not decoration.

Media controls may use translucent black or white fills with backdrop blur.
Always preserve their border or contrast edge over moving imagery.

Dialogs and paywalls may use the floating or 2XL shadow treatment. They sit
above a dark scrim. A static content card does not copy dialog elevation.

Poster hover may scale media to 1.03 over 300ms. The frame does not move. Button
press feedback may scale to 0.97 over 150ms.

Reduced-motion mode removes shared custom animations, staggered entrances, and
button press transforms. Add a reduced-motion result to each product-specific
motion.

## Shapes

The shared base radius is 0.625rem. Standard controls use the 8px medium radius.
Generic dialogs use 10px. Cards and series posters use the 14px XL radius. The
series episode dialog uses the 18px 2XL radius.

Pills are reserved for categories, status, counts, compact controls, and
playlists. Do not turn paragraphs, sections, or navigation groups into pills.

Portrait media stays rectangular with restrained rounding. Full-height feed
clips remain edge-to-edge. Series posters use 14px corners inside their grid.

Avatars are circular. Primary media controls may be circular when their icon is
universally understood. Give icon-only controls an accessible name.

The compact mark uses a softly rounded square. Do not infer a standalone logo
geometry from that component. No approved vector logo exists in the repo.

## Components

### Wordmark and compact mark

Use the authored VeilWick text lockup. Highlight only the `W` in amber. The
compact `V` tile may use amber-to-rose inside the existing interface.

### Buttons

Shared buttons use 36px height, medium radius, 14px type, and 150ms state
transitions. Primary light-context buttons use the semantic primary pair.

Media buttons use white, black, or translucent fills. Premium buttons alone
use violet-to-fuchsia. Destructive actions use the destructive token.

Every button needs a visible three-pixel focus ring. Disabled buttons retain
their label and shape. Icon-only buttons need an `aria-label`.

### Feed slide

Each slide fills `100dvh`. Video uses `object-cover`. A bottom gradient protects
creator, caption, hashtag, and music text. Actions form one right-side rail.

Keep captions to two lines. Keep interaction counts under their icons. Keep
mute and captions controls separate from the social action rail.

### Category rail

Categories use compact pills. The selected pill is white with black text.
Unselected pills use translucent white, a quiet ring, and white text.

### Live room

The live badge uses rose with a text label and a pulse dot. Viewer count uses a
neutral pill. Host identity, title, and tags sit above the protected media edge.

Chat uses a fixed-width side panel on large screens. Messages remain readable
without color. The composer stays visible at the panel bottom.

### Series poster and episode dialog

Series posters use 9:16 imagery, a bottom fade, category label, episode count,
and title. Locked episodes show a lock and lower image opacity.

The episode dialog provides close, play, mute, timeline, and episode controls.
Escape closes the active layer. Opening the dialog locks background scrolling.

### Age gate

The age gate blocks protected routes until confirmation. It uses a clear title,
short explanation, full-width actions, and visible age language.

Legal routes remain reachable without the blocking gate. Do not use local
storage alone as proof for protected server actions.

### Motion

Use the existing strong ease-out curves for short interface transitions. Keep
standard state changes between 150ms and 300ms. Pause continuous motion when
the user can interact with it.

Every motion pattern needs a reduced-motion result. Do not start readable
content at zero opacity.

## Do's and Don'ts

### Do

- **Do** make the portrait feed the primary product reference.
- **Do** keep the light marketing and dark media contexts coordinated.
- **Do** preserve VeilWick capitalization and the amber `W`.
- **Do** label demos, samples, and placeholders truthfully.
- **Do** state synthetic, fictional, and 18+ together.
- **Do** protect text contrast over every video frame.
- **Do** keep keyboard focus visible on every control.
- **Do** preserve 9:16 crops for feed clips and series posters.
- **Do** verify reduced motion, keyboard order, and 320px layouts.
- **Do** serve this file byte for byte at `/design.md` after launch.

### Don't

- **Don't** expose the generic master-template identity as VeilWick branding.
- **Don't** claim `veilwick.com` is live before DNS and routing prove it.
- **Don't** claim sample footage was generated by VeilWick.
- **Don't** invent a vector logo, mascot, or extra wordmark.
- **Don't** use premium gradients for ordinary navigation.
- **Don't** use rose for neutral state or amber for body copy.
- **Don't** hide safety language in tiny or low-contrast text.
- **Don't** rely on color alone for live, locked, or error state.
- **Don't** place essential controls outside portrait safe edges.
- **Don't** animate readable content from zero opacity.
