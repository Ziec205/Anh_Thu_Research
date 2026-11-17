---
name: WAKEI Zen Minimalist
colors:
  surface: '#fcf9f4'
  surface-dim: '#dcdad5'
  surface-bright: '#fcf9f4'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3ee'
  surface-container: '#f0ede9'
  surface-container-high: '#ebe8e3'
  surface-container-highest: '#e5e2dd'
  on-surface: '#1c1c19'
  on-surface-variant: '#414943'
  inverse-surface: '#31302d'
  inverse-on-surface: '#f3f0eb'
  outline: '#717973'
  outline-variant: '#c0c9c1'
  surface-tint: '#37684f'
  primary: '#21533b'
  on-primary: '#ffffff'
  primary-container: '#3a6b52'
  on-primary-container: '#b4e9ca'
  inverse-primary: '#9ed2b4'
  secondary: '#8c4c51'
  on-secondary: '#ffffff'
  secondary-container: '#fdabb0'
  on-secondary-container: '#793c42'
  tertiary: '#24523b'
  on-tertiary: '#ffffff'
  tertiary-container: '#3d6a52'
  on-tertiary-container: '#b7e8ca'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#b9efcf'
  primary-fixed-dim: '#9ed2b4'
  on-primary-fixed: '#002113'
  on-primary-fixed-variant: '#1e5038'
  secondary-fixed: '#ffdadb'
  secondary-fixed-dim: '#ffb2b7'
  on-secondary-fixed: '#390a11'
  on-secondary-fixed-variant: '#70353a'
  tertiary-fixed: '#bceecf'
  tertiary-fixed-dim: '#a1d1b4'
  on-tertiary-fixed: '#002112'
  on-tertiary-fixed-variant: '#224f39'
  background: '#fcf9f4'
  on-background: '#1c1c19'
  surface-variant: '#e5e2dd'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '500'
    lineHeight: 30px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 26px
  body-lg:
    fontFamily: Noto Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Noto Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Noto Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.04em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 10px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-sm: 0.75rem
  gutter-lg: 1.5rem
  margin: 1.25rem
  margin-sm: 1rem
  margin-lg: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style
This design system embodies the philosophy of *Ma* (間) — the deliberate, meaningful use of negative space — merged with modern digital craftsmanship. It is tailored for contemplative, focused mobile experiences bridging Vietnamese and Japanese bilingual contexts. 

The aesthetic is serene, tactile, and grounded:
- **Emotional Resonance:** Calm, mindful, balanced, unhurried, and deeply intentional.
- **Design Movement:** Japanese Minimal Zen with organic, wabi-sabi paper-like warmth. Elements feel as though they rest naturally upon traditional textured washi paper rather than sterile digital canvases.
- **Visual Cadence:** Uncluttered layouts, generous vertical breathing room, and soft tonal boundaries that invite natural focus without visual fatigue.

## Colors
The color palette balances the grounding presence of Sencha/Matcha botanicals with the ephemeral warmth of Sakura petals against tactile washi surfaces:

- **Primary (`#3A6B52` - Matcha Green):** Serves as the primary anchor for core actions, active states, key interactive indicators, and primary branding glyphs.
- **Secondary (`#E8999E` - Sakura Blossom):** Used for delicate accents, subtle highlight badges, notifications, and soft micro-moments.
- **Tertiary (`#2D5A43` - Deep Sencha):** Provides deeper grounding for high-emphasis containers, status pills, and prominent contrasting elements.
- **Neutral Canvas (`#FAF7F2` - Washi Paper Base):** The primary warm background tint that eliminates harsh blue-light glare and delivers organic warmth.
- **Surfaces & Text:** Pure white (`#FFFFFF`) is reserved for elevated cards to mimic layered sheets of handmade paper. Primary typography utilizes a deep ink-charcoal (`#1E2621`), maintaining high legibility while remaining softer than pure `#000000`.

## Typography
Typography is tuned for bilingual harmony between Vietnamese diacritics and Japanese Kanji/Kana glyphs:

- **Headlines (`Plus Jakarta Sans`):** Soft geometric terminals and balanced round apertures offer an approachable, elegant modern aesthetic.
- **Body & Longform (`Noto Sans`):** Ensures complete Unicode coverage, uniform optical density between Latin accents and CJK strokes, and superior readability across compact screen layouts.
- **Language Switcher & Bilingual Pairing:** When displaying tandem Vietnamese and Japanese text, line heights expand to at least 1.6x the font size to accommodate diacritic ascenders/descenders alongside dense Kanji structures without collision.

## Layout & Spacing
The layout relies on a mobile-first column structure that honors the rhythm of *Ma*:

- **Grid Architecture:** Standard mobile layouts use a 4-column fluid grid with `1.25rem` outer margins and `1rem` gutters. Tablet and expansive viewports scale to an 8-column format with `2rem` margins.
- **Vertical Ryhthm:** Generous vertical intervals (`space-xl` / `2.5rem`) separate functional zones, allowing content clusters to breathe rather than feeling condensed.
- **Whitespace Allocation:** Density should be intentionally restrained; negative space around focal interactions functions as an active structural element rather than empty room.

## Elevation & Depth
In line with Japanese wabi-sabi, this design system avoids heavy drop shadows and artificial skeuomorphism:

- **Tonal Layering:** Hierarchy is communicated through subtle value shifts. The base canvas sits at `#FAF7F2` (Washi), resting containers lift onto pure `#FFFFFF` sheets, and elevated overlays rely on warm translucent backdrops.
- **Ambient Paper Shadows:** When elevation is necessary (e.g., floating bottom sheets or prominent cards), shadows must be faint, ultra-diffused, and warm-tinted:
  - Ambient base: `box-shadow: 0 4px 20px -2px rgba(58, 107, 82, 0.06), 0 2px 6px -1px rgba(30, 38, 33, 0.04);`
- **Ghost Boundaries:** Surface divisions use ultra-fine 1px borders rendered in `rgba(58, 107, 82, 0.1)` or `rgba(232, 153, 158, 0.2)` instead of stark grey divider lines.

## Shapes
Geometry takes cues from natural, hand-carved forms — neither starkly angular nor overly bubbly:

- **Base Radius (0.5rem / 8px):** Applied to inputs, buttons, checkboxes, and segmented controls.
- **Large Radius (1rem / 16px):** Standard for floating content cards, dialogs, and modal sheets.
- **Pill Geometry (Full Curve):** Reserved strictly for interactive badges, language toggles (`VI | JA`), and tactile action chips.

## Components

### Buttons
- **Primary:** Filled in Matcha Green (`#3A6B52`) with pure white text. Height: 48px for comfortable touch targets. Corner radius: `rounded` (8px). Pressed state smoothly scales down to 0.98 with a slight tint shift to `#2D5A43`.
- **Secondary / Soft:** Tinted background (`#FDF2F4`) with Sakura Green text (`#3A6B52`) and a subtle 1px border (`#E8999E` at 30% opacity).
- **Ghost:** Text-only in `#3A6B52`, with `label-lg` styling and subtle underline feedback on interaction.

### Language Switcher (VI | JA)
- **Structure:** Pill-shaped segmented container (`rounded-full`), height 32px, padded with `0.25rem`.
- **Background:** Subtle tinted wash (`rgba(58, 107, 82, 0.08)`).
- **Active Segment:** Pure white card with ambient micro-shadow (`rgba(58, 107, 82, 0.12)`), text rendered in `#3A6B52` with `label-md` weight.
- **Inactive Segment:** Charcoal ink (`#5C6660`), font weight `400`. Smooth sliding indicator transition between `VI` and `JA`.

### Cards & Content Tiles
- **Surface:** Solid `#FFFFFF` set against the `#FAF7F2` canvas.
- **Border:** 1px solid `rgba(58, 107, 82, 0.08)`.
- **Corner Radius:** 16px (`rounded-lg`).
- **Padding:** `space-md` (1rem) to `space-lg` (1.5rem) to ensure elements inside retain an airy balance.

### Input Fields
- **Container:** 48px height, rounded to 8px.
- **State Neutral:** Background `#FFFFFF`, 1px border in `rgba(58, 107, 82, 0.18)`, placeholder in muted slate-ink.
- **State Focused:** Border transitions to `#3A6B52` with an ambient outer glow of `rgba(58, 107, 82, 0.12)`.

### Chips & Badges
- **Status Badges:** Delicate Sakura tint (`#FDF2F4`) bordered with `#E8999E`, text set in `#2D5A43`.
- **Filter Chips:** Pill-shaped, bordered by `rgba(58, 107, 82, 0.15)`. Selected state fills with `#3A6B52` and contrasts with white typography.

### Checkboxes & Radios
- **Checkmark:** 20px box with 4px border radius. Unselected uses a 1.5px border (`rgba(58, 107, 82, 0.3)`). Selected fills with `#3A6B52` displaying a clean white check glyph.
- **Radio:** 20px circular ring with concentric inner dot in `#3A6B52`.