---
name: Precision Intelligence
colors:
  surface: '#faf9ff'
  surface-dim: '#d7d9e7'
  surface-bright: '#faf9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f3ff'
  surface-container: '#ebedfb'
  surface-container-high: '#e5e8f5'
  surface-container-highest: '#dfe2ef'
  on-surface: '#181b25'
  on-surface-variant: '#434655'
  inverse-surface: '#2c303a'
  inverse-on-surface: '#eef0fe'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#4b41e1'
  on-secondary: '#ffffff'
  secondary-container: '#645efb'
  on-secondary-container: '#fffbff'
  tertiary: '#005d73'
  on-tertiary: '#ffffff'
  tertiary-container: '#007793'
  on-tertiary-container: '#dcf4ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#e2dfff'
  secondary-fixed-dim: '#c3c0ff'
  on-secondary-fixed: '#0f0069'
  on-secondary-fixed-variant: '#3323cc'
  tertiary-fixed: '#b7eaff'
  tertiary-fixed-dim: '#6cd3f7'
  on-tertiary-fixed: '#001f28'
  on-tertiary-fixed-variant: '#004e61'
  background: '#faf9ff'
  on-background: '#181b25'
  surface-variant: '#dfe2ef'
typography:
  display-xl:
    fontFamily: Geist
    fontSize: 56px
    fontWeight: '700'
    lineHeight: 64px
    letterSpacing: -0.04em
  display-lg:
    fontFamily: Geist
    fontSize: 40px
    fontWeight: '650'
    lineHeight: 48px
    letterSpacing: -0.035em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.03em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.025em
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.025em
  headline-sm:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.02em
  body-lg:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: -0.005em
  body-sm:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0em
  metric-display:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.04em
  metric-sm:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: '650'
    lineHeight: 24px
    letterSpacing: -0.03em
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: -0.01em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.02em
  code-inline:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-tablet: 2rem
  margin-desktop: 3rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.875rem
  space-lg: 1.25rem
  space-xl: 2rem
---

## Brand & Style

The design system projects high-velocity technical mastery, algorithmic clarity, and executive-level authority. Designed for elite software engineers, technical leads, and engineering directors, the aesthetic merges the sharp, utilitarian ergonomics of modern developer utilities with the luminous, high-finish craft of next-generation intelligence tooling. It avoids gimmicky futuristic tropes in favor of crystalline typography, pristine surfaces, and micro-calibrated density.

The style is an ultra-refined blend of modern technical SaaS minimalism and subtle glassmorphic illumination. The interface feels weightless yet substantial: expansive white and slate fields anchored by razor-sharp hairline borders, luminous electric blue interactions, and concentrated computational accents (cyan, indigo, and emerald). The UI evokes the emotional sensation of an exquisitely tuned performance instrument—frictionless, deterministic, and deeply empowering.

## Colors

The palette is light-first, grounded in pristine, cool off-whites that prevent ocular fatigue while keeping information architecture crisp and legible.

### Canvas & Surface Structure
- **Canvas Base:** `#F8FAFC` (Slate 50) provides the atmospheric foundation.
- **Surface Elevation 1 (Cards, Modules):** `#FFFFFF` (Pure White) provides immediate, clean contrast against the base canvas.
- **Surface Elevation 2 (Muted Insets, Code Blocks, Wells):** `#F1F5F9` (Slate 100) serves secondary interactive regions, search inputs, and inactive metric blocks.
- **Surface Elevation 3 (Hover States & Selected Wells):** `#E2E8F0` (Slate 200).

### Text & Contrast Hierarchy
- **Text Primary:** `#090D16` (Deep Ink Navy) delivers stark optical authority without the harshness of pure black.
- **Text Secondary:** `#334155` (Slate 700) for body copy, labels, and supportive metadata.
- **Text Muted:** `#64748B` (Slate 500) for timestamps, secondary metrics, and deactivated UI states.
- **Text Inverse:** `#FFFFFF` on dark accents or high-fill active states.

### Accents & Intelligence Signifiers
- **Primary Action (Electric Blue):** `#2563EB` (Rest), `#1D4ED8` (Hover), `#1E40AF` (Active), with `#DBEAFE` as a glowing interactive tint.
- **Secondary Accent (Indigo Core):** `#4F46E5` serves progression milestones, architecture tracking, and systemic growth indices.
- **AI Synthesis Accent (Teal / Cyan):** `#0891B2` paired with `#06B6D4` highlights generative recommendations, dynamic skill graphs, and real-time algorithmic telemetry.

### Semantic Tones
- **Success (Emerald):** `#059669` (Text/Stroke), `#ECFDF5` (Surface tint) for verified competencies, deployment achievements, and resolved PR velocity.
- **Warning (Amber):** `#D97706` (Text/Stroke), `#FFFBEB` (Surface tint) for skill drift and stagnating metrics.
- **Destructive (Crimson):** `#DC2626` (Text/Stroke), `#FEF2F2` (Surface tint) for attrition flags and critical blockers.

## Typography

Typography establishes an analytical posture through precise tracking and disciplined sizing.

- **Primary Interface Typeface (Geist):** Handles all display, headline, and body copy. Negative letter tracking is mandatory for all text sizes 16px and above to produce a tight, machined typographic texture characteristic of developer-focused software.
- **Telemetry & Technical Typeface (JetBrains Mono):** Applied deliberately to micro-badges, code references, numeric tables, operational statuses, and data labels. Monospacing keeps metrics horizontally stable during real-time streaming updates.
- **Metric Displays:** High-contrast numeric representations (e.g., skill percentiles, commit velocity, level indices) use `metric-display` with tight tracking and tabular figures enabled (`font-variant-numeric: tabular-nums`).

## Layout & Spacing

The spatial architecture leverages a 12-column adaptive fluid grid designed to display concurrent data channels without clutter.

### Breakpoints & Canvas Bounds
- **Mobile (< 768px):** 4-column flow with continuous `margin` of `1rem` and `gutter` of `1.25rem`. Complex telemetry widgets stack vertically.
- **Tablet (768px - 1199px):** 8-column layout with `margin-tablet` of `2rem`. Analytical panels adopt a 2-column distribution.
- **Desktop (1200px+):** 12-column configuration with `margin-desktop` of `3rem`, constrained to a maximum content container width of `1440px`.

### Spacing Cadence
Component internals follow a strict 4px base increment:
- `space-xs` (4px): Micro gaps inside tags, between icons and badge text.
- `space-sm` (8px): Button internal vertical padding, space between related inline fields.
- `space-md` (14px): Card-level content grouping, between labels and analytical charts.
- `space-lg` (20px): Outer padding inside data containers and panel headers.
- `space-xl` (32px): Separation between distinct functional dashboard modules.

## Elevation & Depth

Visual hierarchy uses physical micro-separation via crisp borders rather than heavy blur shadows, maintaining a lightweight, modern feel.

### Surface Outlines
All elevated components sit on hairline borders: `1px solid rgba(226, 232, 240, 0.95)`. Hover states shift borders subtly to `rgba(203, 213, 225, 1)`.

### Layer Stacking & Shadow Rhythms
- **Base Canvas:** Flat `#F8FAFC` without shadow.
- **Resting Tile / Card (`elevation-card`):** Soft dual-stop micro-shadow:
  `0 1px 2px 0 rgba(15, 23, 42, 0.04), 0 0 0 1px rgba(226, 232, 240, 0.8)`.
- **Interactive Hover (`elevation-hover`):** Lifted state with light absorption:
  `0 8px 20px -4px rgba(15, 23, 42, 0.06), 0 2px 6px -1px rgba(15, 23, 42, 0.03), 0 0 0 1px rgba(148, 163, 184, 0.4)`.
- **Floating Overlays & Popovers (`elevation-overlay`):** Command palettes and filter popouts:
  `0 20px 30px -10px rgba(15, 23, 42, 0.1), 0 8px 12px -4px rgba(15, 23, 42, 0.04), 0 0 0 1px rgba(226, 232, 240, 1)`.

### AI Surface Depth
Panels containing algorithmic insights or generative career guidance receive a distinctive hairline treatment:
`background: linear-gradient(180deg, #FFFFFF 0%, #FAFCFF 100%)`, wrapped with a pseudo-border gradient ranging from `rgba(6, 182, 212, 0.35)` to `rgba(99, 102, 241, 0.35)`.

## Shapes

The shape system balances modern softness with structured UI discipline:
- **Base Components (0.5rem / 8px):** Buttons, dropdown items, text input fields, and pill tags.
- **Cards and Structured Containers (`rounded-lg`, 1rem / 16px):** Primary metric cards, analytics graphs, and split-screen workbench viewports.
- **Large Overlays (`rounded-xl`, 1.5rem / 24px):** Command bars (Cmd+K), modal dialogs, and comprehensive career trajectory review drawers.
- **Pills (`full` / 9999px):** Pure geometric pills are reserved strictly for operational status badges, active filter tokens, and real-time state chips.

## Components

### Buttons & Interactive Triggers
- **Primary:** Solid `#2563EB` fill, white typography, subtle inner top bevel (`inset 0 1px 0 rgba(255, 255, 255, 0.2)`), sharp focus ring (`0 0 0 2px #FFFFFF, 0 0 0 4px #2563EB`).
- **Secondary / Neutral:** Pure white background, `1px solid #E2E8F0`, deep slate text (`#1E293B`). On hover, background shifts to `#F8FAFC` with border darkening to `#CBD5E1`.
- **Tertiary / Ghost:** Transparent surface with `#475569` text, transitioning to `#F1F5F9` on hover.

### Inputs & Search Bars
- Standard height: 38px. Background: `#FFFFFF`. Border: `1px solid #E2E8F0`. Typography: 13px Geist.
- Focus state applies a crisp dual border: border color changes to `#2563EB` with an ambient glow of `0 0 0 3px rgba(37, 99, 235, 0.12)`.
- Command Palette Trigger (Raycast style): Contains monospaced key indicator chips (`⌘K`) in JetBrains Mono styled with `#F1F5F9` backgrounds, `#64748B` typography, and `1px solid #E2E8F0` border.

### Status Chips & Career Level Badges
- Constructed with a continuous pill radius (9999px), 22px fixed height, and horizontal padding of 8px.
- Structure: Leading 6px circular indicator dot (pulsing when real-time telemetry is running), paired with 11px uppercase JetBrains Mono text (`tracking: 0.04em`).
- AI Recommendation Badge: Subtle radial gradient background (`rgba(6, 182, 212, 0.08)` to `rgba(99, 102, 241, 0.08)`), cyan text (`#0891B2`), and cyan-indigo dual border.

### Data Visualization Cards & Metric Containers
- Surface: `#FFFFFF`, border: `1px solid #E2E8F0`, corner radius: 16px. Internal padding: 20px (`space-lg`).
- Header displays category taxonomy in 12px uppercase JetBrains Mono, accompanied by contextual metadata.
- Numeric focal point uses `metric-display` in Geist, followed by mini delta indicators (e.g., `+14.2%` with `#059669` text and `#ECFDF5` micro-pill background).
- Embedded sparklines and progress rings feature thin stroke weights (2px) using Electric Blue (`#2563EB`) and AI Cyan (`#06B6D4`) over a light track tone (`#F1F5F9`).

### Checkboxes & Toggle Controls
- Checkboxes: 16px x 16px square with 4px corner radius. Unchecked state: `#FFFFFF` fill with `1px solid #CBD5E1`. Checked state: `#2563EB` fill with a white checkmark icon.
- Toggles: 20px height, 36px width pill track. Active state shifts track to `#2563EB` with a crisp white circular thumb moving with an elastic `cubic-bezier(0.16, 1, 0.3, 1)` transition.