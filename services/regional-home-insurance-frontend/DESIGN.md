# Frontend Design System
> Home Insurance — Full Revamp Reference
> Style: **Clean · Minimal · Corporate Insurance**  
> Theme: **Light only**

---

## 0. Brand Assets

### Logo

| File | Path | Usage |
|---|---|---|
| **Etiqa-EGIB** (primary) | `/images/Etiqa-EGIB.png` | Main horizontal wordmark — login page, dashboard header, loading screen, email headers |
| **Etiqa-EGTB** (alternate) | `/images/Etiqa-EGTB.png` | Alternate variant — use when white background is not available or per brand guideline |

**Rendering rules:**
- Always use `next/image` (`<Image>`) for logos — never raw `<img>` tags
- Recommended height: `h-7` (28px) in headers · `h-9` (36px) in login panel · `h-8` (32px) in loading screen
- Always set `width` + `height` props + `className="h-{n} w-auto object-contain"` to preserve aspect ratio
- On **dark backgrounds** (`#111827`, `#1A1A1A`): wrap logo in a white rounded container (`bg-white rounded-xl px-4 py-2.5`) so the dark-ink wordmark remains legible
- Add `priority` prop on above-the-fold logo instances (login page, dashboard header)
- Never stretch, recolour, or rotate the logo

```tsx
// Standard usage (white background)
<Image src="/images/Etiqa-EGIB.png" alt="Etiqa" width={100} height={30}
  className="h-7 w-auto object-contain" priority />

// On dark background
<div className="inline-flex bg-white rounded-xl px-4 py-2.5 shadow-md">
  <Image src="/images/Etiqa-EGIB.png" alt="Etiqa" width={120} height={36}
    className="h-9 w-auto object-contain" priority />
</div>
```

---

### Favicon

| File | Path | Usage |
|---|---|---|
| **Etiqa_Favicon** | `/images/Etiqa_Favicon.png` | Browser tab icon, Apple touch icon, loading screen spinner centre |

Registered in `app/[locale]/layout.tsx` metadata:
```ts
icons: {
  icon:     "/images/Etiqa_Favicon.png",
  shortcut: "/images/Etiqa_Favicon.png",
  apple:    "/images/Etiqa_Favicon.png",
}
```

In the loading screen, the favicon is used as the 32×32 icon inside the gold spinning ring:
```tsx
<Image src="/images/Etiqa_Favicon.png" alt="Etiqa" width={32} height={32}
  className="w-8 h-8 object-contain" priority />
```

---

### Where each asset is used

| Component / Page | Logo | Favicon |
|---|---|---|
| `app/[locale]/layout.tsx` | — | ✅ browser tab + Apple icon |
| `app/[locale]/page.tsx` (login) | ✅ Etiqa-EGIB in white container | — |
| `components/dashboard/dashboard-header.tsx` | ✅ Etiqa-EGIB | — |
| `components/loading-screen.tsx` | ✅ Etiqa-EGIB (wordmark below spinner) | ✅ inside spinner circle |

---

## 1. Color Tokens

### Secondary / Surface Palette

| Token | Hex | Usage |
|---|---|---|
| `secondary` | `#1E293B` | Dashboard shell background — the dark canvas behind all content panels |
| `secondary-surface` | `#FFFFFF` | Cards, sidebar, header — white panels that float on the dark bg |
| `secondary-text` | `#FFFFFF` | Headings rendered directly on `secondary` background |
| `secondary-text-muted` | `#94A3B8` | Subtitles / hints on `secondary` background |
| `secondary-border` | `rgba(255,255,255,0.15)` | Dashed borders / dividers on `secondary` background |
| `secondary-overlay` | `rgba(255,255,255,0.05)` | Subtle glass tint panels on `secondary` (e.g. coming-soon placeholder) |

> **Usage rule:** Use `text-white` / `text-[#94A3B8]` for any text that sits directly on `#1E293B`. Inside white cards, always use the standard `text-[#1A1A1A]` / `text-[#555555]` tokens.

---

### Primary Palette

| Token | Hex | Usage |
|---|---|---|
| `primary` | `#F5A623` | Logo mark, primary CTA buttons, step indicators, add-on icons, progress bar fill |
| `primary-dark` | `#D4891A` | Hover state for primary buttons |
| `primary-light` | `#FEF3DC` | Light tint backgrounds, active chip backgrounds |
| `accent` | `#E87722` | Category labels (e.g. "Home Content"), section badges, tag pills |
| `accent-light` | `#FDF0E6` | Background tint behind accent labels |
| `success` | `#00A651` | Selected card checkmark, selected border, success states, confirmed steps |
| `success-light` | `#E6F7EE` | Selected card background tint |
| `link` | `#0066CC` | Inline links ("Product comparison", "Get estimate cost here", "View Summary") |
| `link-hover` | `#004EA8` | Hover state for links |

### Neutral Palette

| Token | Hex | Usage |
|---|---|---|
| `text-heading` | `#1A1A1A` | H1, H2, card titles, important labels |
| `text-body` | `#555555` | Body copy, descriptions, secondary labels |
| `text-muted` | `#9E9E9E` | Placeholder text, hints, disabled labels |
| `text-disabled` | `#BDBDBD` | Disabled inputs, inactive steps |
| `border-selected` | `#00A651` | Card / input border when selected / active |
| `border-default` | `#E0E0E0` | Default card borders, dividers, input borders |
| `border-focus` | `#F5A623` | Input focus ring |
| `bg-page` | `#FFFFFF` | Page background |
| `bg-card` | `#FFFFFF` | Standard card background |
| `bg-card-tinted` | `#FFFDE7` | Warm yellowish tint — Home Content section, highlighted info cards |
| `bg-subtle` | `#FAFAFA` | Table alternate rows, section backgrounds |
| `bg-overlay` | `rgba(0,0,0,0.45)` | Modal backdrop |

### Semantic / Status Colors

| Token | Hex | Usage |
|---|---|---|
| `error` | `#D32F2F` | Validation errors, required field indicators |
| `error-light` | `#FFEBEE` | Error message backgrounds |
| `warning` | `#F59E0B` | Warning banners, caution states |
| `warning-light` | `#FFFBEB` | Warning backgrounds |
| `info` | `#0288D1` | Info tooltips, informational banners |
| `info-light` | `#E1F5FE` | Info backgrounds |

---

## 2. Typography

### Font Stack
```css
font-family: 'Inter', 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

> Prefer **Inter** (load via Google Fonts or `next/font`). Fall back to Roboto then system sans.

### Type Scale

| Role | Size | Weight | Line Height | Token |
|---|---|---|---|---|
| H1 — Page title | 24px / 1.5rem | 700 Bold | 1.3 | `text-2xl font-bold` |
| H2 — Section heading | 18px / 1.125rem | 600 SemiBold | 1.4 | `text-lg font-semibold` |
| H3 — Card title | 16px / 1rem | 600 SemiBold | 1.4 | `text-base font-semibold` |
| Body — Default | 14px / 0.875rem | 400 Regular | 1.5 | `text-sm` |
| Body — Emphasized | 14px / 0.875rem | 500 Medium | 1.5 | `text-sm font-medium` |
| Caption / Label | 12px / 0.75rem | 400 Regular | 1.4 | `text-xs` |
| Caption — Bold | 12px / 0.75rem | 600 SemiBold | 1.4 | `text-xs font-semibold` |
| Overline / Tag | 11px / 0.6875rem | 600 SemiBold | 1.2 | `text-[11px] font-semibold uppercase tracking-wide` |

### Text Color Rules
- Headings → `text-heading` (`#1A1A1A`)  
- Body copy → `text-body` (`#555555`)  
- Muted / hints → `text-muted` (`#9E9E9E`)  
- Links → `text-link` (`#0066CC`), underline on hover  
- Error messages → `error` (`#D32F2F`)

### Tailwind Gray Ban
> **Never use Tailwind's built-in `text-gray-*` scale in this project.**  
> These classes produce low-contrast text that disappears on the `#F1F5F9` dashboard background.  
> Always map to the explicit design tokens above:

| ❌ Banned | ✅ Use instead | Role |
|---|---|---|
| `text-gray-900` | `text-[#1A1A1A]` | Headings, important values |
| `text-gray-800` | `text-[#1A1A1A]` | Section titles, bold labels |
| `text-gray-700` | `text-[#555555]` | Body copy, descriptions |
| `text-gray-600` | `text-[#555555]` | Secondary body text |
| `text-gray-500` | `text-[#555555]` | Captions, sub-labels |
| `text-gray-400` | `text-[#9E9E9E]` | Hints, placeholders, muted |
| `text-gray-300` | `text-[#BDBDBD]` | Disabled labels |

### Light Background Contrast Rule
> The dashboard background is `#F1F5F9`. On this surface:
> - `#9E9E9E` is **only** acceptable for true placeholders, input prefixes/suffixes, spinners, and legal disclaimers.
> - All readable content text (section headings, descriptions, labels, card sub-text) **must** use `#555555` or darker.
> - Overline / section headings → `text-[#555555]` (not `#9E9E9E`)
> - Unselected toggle button text → `text-[#1A1A1A]` (high contrast on `#F5F5F5` pill bg)

---

## 3. Spacing Scale

Uses an **8px base grid**. All spacing, padding, and gap values are multiples of 4px.

| Token | Value | Tailwind | Usage |
|---|---|---|---|
| `space-1` | 4px | `p-1 / m-1` | Micro gaps, icon padding |
| `space-2` | 8px | `p-2 / m-2` | Tight internal padding |
| `space-3` | 12px | `p-3 / m-3` | Input padding, compact sections |
| `space-4` | 16px | `p-4 / m-4` | Card padding (mobile), standard gaps |
| `space-5` | 20px | `p-5 / m-5` | Card padding (desktop) |
| `space-6` | 24px | `p-6 / m-6` | Section vertical rhythm |
| `space-8` | 32px | `p-8 / m-8` | Large section spacing |
| `space-12` | 48px | `p-12 / m-12` | Page-level vertical padding |

---

## 4. Border Radius

| Role | Value | Tailwind |
|---|---|---|
| Button | 8px | `rounded-lg` |
| Input | 8px | `rounded-lg` |
| Card (small) | 12px | `rounded-xl` |
| Card (large / hero) | 16px | `rounded-2xl` |
| Badge / Pill | 9999px | `rounded-full` |
| Chip / Tag | 6px | `rounded-md` |

---

## 5. Elevation / Shadow

| Level | Tailwind | Usage |
|---|---|---|
| 0 — Flat | `shadow-none` | Tables, inline elements |
| 1 — Subtle | `shadow-sm` | Cards at rest, inputs |
| 2 — Raised | `shadow-md` | Hovered cards, dropdowns |
| 3 — Floating | `shadow-lg` | Modals, popovers |
| 4 — Sticky bar | `shadow-2xl` | Sticky bottom CTA bar |

---

## 6. Component Specifications

### 6.1 Buttons

#### Primary CTA
```
bg: #F5A623   text: #FFFFFF   font: 14px SemiBold
padding: 12px 24px   radius: 8px
hover: bg #D4891A   active: bg #B8751A
disabled: bg #E0E0E0  text #9E9E9E  cursor-not-allowed
icon: 16px, gap 8px from text
```

#### Secondary / Outline
```
bg: transparent   border: 1.5px #E0E0E0   text: #1A1A1A
hover: border #F5A623  text #F5A623  bg #FEF3DC
```

#### Ghost / Link Button
```
bg: transparent   text: #0066CC
hover: text #004EA8  underline
```

#### Destructive
```
bg: #D32F2F   text: #FFFFFF
hover: bg #B71C1C
```

#### Toggle Button Group (inline pill selectors)
```
Used for: Owner / Tenant, Yes / No, ID type (MYKAD / Passport / MYPR)

Container: bg #F5F5F5  radius: 8px  padding: 4px

Selected:   bg #333331   text #FFFFFF   radius: 6px   shadow-sm
            hover: bg #4a4a48  (darken slightly)

Unselected: bg transparent   text #555555
            hover: bg #FEF3DC   text #D4891A   (warm amber tint — on-theme)

NOTE: Do NOT use primary gold (#F5A623) as the selected bg.
      Gold (#F5A623) is reserved for primary CTA buttons only.
      Hover uses the light amber tint (#FEF3DC) to stay on-brand without
      competing with the primary CTA.
```

#### Sizes
| Size | Height | Padding H | Font |
|---|---|---|---|
| `sm` | 32px | 12px | 12px |
| `md` (default) | 40px | 20px | 14px |
| `lg` | 48px | 28px | 15px |

---

### 6.2 Selectable Cards

Used throughout the quotation flow for coverage selection and add-ons.

```
Default state:
  bg: #FFFFFF
  border: 1.5px solid #E0E0E0
  radius: 12px (rounded-xl)
  shadow: shadow-sm
  padding: 16–20px

Selected state:
  bg: #E6F7EE  (success-light)
  border: 2px solid #00A651
  → show green checkmark icon (top-right corner, 20px circle, bg #00A651, white tick)

Hover state (unselected):
  border: 1.5px solid #F5A623
  shadow: shadow-md
  cursor: pointer

Disabled state:
  bg: #FAFAFA
  border: #E0E0E0
  text: text-muted
  cursor: not-allowed
  opacity: 0.6
```

#### Card anatomy
```
┌─────────────────────────────────────┐
│  [Icon 32px]  Card Title  [✓ badge] │  ← header row
│  Description text (text-body)        │
│  ─────────────────────────────────  │  ← divider (optional)
│  Price  /  Coverage detail           │  ← footer row
└─────────────────────────────────────┘
```

---

### 6.3 Toggle Add-On Items

For optional coverage add-ons (e.g. flood, MLTA).

```
Layout: horizontal row card
Left:  icon (24px, accent color) + label + optional description
Right: toggle switch + optional price

Toggle ON:   #00A651 track, white thumb
Toggle OFF:  #E0E0E0 track, white thumb

Row bg when ON:  #E6F7EE with border #00A651
Row bg when OFF: #FFFFFF with border #E0E0E0
```

---

### 6.4 Progress / Step Indicator

Multi-step numbered bar at the top of the quotation flow.

```
Step states:
  Completed:  circle bg #00A651, white tick, connector line #00A651
  Active:     circle bg #F5A623, white number, connector line #E0E0E0
  Upcoming:   circle bg #E0E0E0, grey number, connector line #E0E0E0

Circle size: 28px diameter
Label: 11px SemiBold below circle, text-muted (upcoming) / text-heading (active/done)
Connector: 2px line between circles
```

---

### 6.5 Input Fields

```
Height: 40px (md) / 48px (lg)
Padding: 0 12px
Border: 1.5px solid #E0E0E0   radius: 8px
Font: 14px Regular  color: #1A1A1A
Placeholder: #9E9E9E

Focus:  border #F5A623  ring: 0 0 0 3px rgba(245,166,35,0.2)
Error:  border #D32F2F  ring: 0 0 0 3px rgba(211,47,47,0.15)
        error message: 12px #D32F2F below field
Filled: border #E0E0E0  bg #FFFFFF
Disabled: bg #FAFAFA  border #E0E0E0  text #BDBDBD

Prefix/suffix unit: 12px #9E9E9E, padded inside field
```

---

### 6.6 Category / Section Badge

```
e.g. "Home Content", "Building Cover"

bg: #FDF0E6   text: #E87722
border: 1px solid #F5C896
radius: 6px (rounded-md)
font: 11px SemiBold uppercase tracking-wide
padding: 3px 8px
```

---

### 6.7 Info / Link Row

```
e.g. "Get estimate cost here →",  "View Summary"

text: #0066CC   font: 14px  (no underline by default)
hover: underline  color: #004EA8
icon: ChevronRight or ExternalLink (14px, same color)
```

---

### 6.8 Sticky Bottom Bar (CTA)

```
Position: fixed bottom-0, full width
bg: #FFFFFF   border-top: 1px solid #E0E0E0
shadow: shadow-2xl
height: ~72px
padding: 12px 20px
z-index: 50

Left side:  Total label (12px text-muted) + amount (20px Bold text-heading)
Right side: Primary CTA button (lg size)
```

---

### 6.9 Expand / Collapse Row ("Show More")

```
Trigger: full-width button row at bottom of a section
text: "Show More" / "Show Less"   color: #0066CC   font: 14px Medium
icon: ChevronDown (rotates 180° when open)  color: #0066CC
border-top: 1px solid #E0E0E0   padding: 12px 20px
hover: bg #F5F5F5
```

---

### 6.10 Data Tables (Admin / Config)

```
Header row: bg #1A1A1A (or brand dark)  text #FFFFFF  font 14px SemiBold
            → OR:  bg #0066CC  (for config page context)
Body rows:
  Even:   bg #FFFFFF
  Odd:    bg #FAFAFA
  Hover:  bg primary-color  text #FFFFFF  (full-row highlight)
Border: 1px solid #E0E0E0 between rows
Cell padding: 12px 16px
Font: 14px Regular  color: #1A1A1A
Pending dot: 6px circle  bg #F5A623  (unsaved change indicator)
```

---

### 6.11 Badges / Tags

| Variant | bg | text | border | Usage |
|---|---|---|---|---|
| Primary | `#FEF3DC` | `#D4891A` | `#F5C896` | Highlighted info |
| Success | `#E6F7EE` | `#00A651` | `#86EFAC` | Active / confirmed |
| Warning | `#FFFBEB` | `#D97706` | `#FDE68A` | Pending / caution |
| Error | `#FFEBEE` | `#D32F2F` | `#FECACA` | Issues / errors |
| Neutral | `#F5F5F5` | `#555555` | `#E0E0E0` | Labels / misc |
| Blue | `#E0F0FF` | `#0066CC` | `#BFDBFE` | Info / links |

---

## 7. Layout & Page Structure

### Breakpoints
| Name | Width | Layout |
|---|---|---|
| `sm` | 640px | Single column, full-width cards |
| `md` | 768px | Two-column grids unlock |
| `lg` | 1024px | Sidebar appears (admin pages) |
| `xl` | 1280px | Max content width caps at 1200px |

### Page Container
```
max-width: 1200px
margin: 0 auto
padding: 0 16px (mobile)  →  0 24px (md+)
```

### Quotation Flow Layout
```
┌──────────────────────────────────────────┐
│  Step Progress Bar (sticky top)          │
├──────────────────────────────────────────┤
│  Page Header (H1 + subtitle)             │
├──────────────────────────────────────────┤
│  Content Area                            │
│  ┌──────────────────┐  ┌──────────────┐ │
│  │  Main column     │  │  Summary     │ │
│  │  (cards/form)    │  │  sidebar     │ │
│  │  ~65%            │  │  ~35%        │ │
│  └──────────────────┘  └──────────────┘ │
├──────────────────────────────────────────┤
│  Sticky Bottom Bar (total + CTA)         │
└──────────────────────────────────────────┘
```

### Admin / Config Layout
```
┌──────────────────────────────────────────┐
│  Top nav                                 │
├───────────┬──────────────────────────────┤
│  Sidebar  │  Main content area           │
│  240px    │  Country selector + tabs     │
│           │  Tab content (tables)        │
│           │  Save All footer             │
└───────────┴──────────────────────────────┘
```

---

## 8. Page-Level Design Specs

### 8.1 Quotation — Coverage Selection Page

**Header section**
- H1: Plan name, `text-heading`
- Subtitle: coverage description, `text-body`
- Category badge: `accent` color pill (e.g. "Home Content")

**Coverage cards grid**
- 2 columns on md+, 1 column on mobile
- Selectable card pattern (see §6.2)
- Each card: icon (32px, primary color) + title + description + price
- Selected: green border + checkmark

**Add-ons section**
- Section heading H2
- Background: `bg-card-tinted` (`#FFFDE7`) to visually separate
- Toggle rows (see §6.3)

**Comparison link row**
- Blue link text + ChevronRight icon
- "Product comparison ›"

**Sticky bottom bar**
- Running total (left) + "Next / Proceed" button (right)

---

### 8.2 Quotation — Building Calculator Page

**Hero banner**
- Gradient: amber-500 → orange-500 → red-500 (retain existing warm gradient)
- White text H1 + subtitle
- Info pill: benchmark year + area unit

**Form sections** (numbered, stacked)
- Each section: H2 label (overline style, grey uppercase) + control
- Property type: 3×2 grid of selectable icon cards
- Construction type: 2-button row
- Area input: right-aligned number input + unit suffix
- Storeys: stepper (minus / number / plus)
- Classification selectors: button grids (2–4 columns)
- Location: province dropdown + tier badge + override buttons
- Cost add-ons: 2-column input grid

**Cost breakdown card**
- Amber tinted bg (`#FFFDE7`)
- Numbered step rows with amber step badges
- Dividers between steps
- Total row: stronger amber bg, bold amount

---

### 8.3 Modify Config (Admin)

**Country selector**
- Pill button row (ID / PH / KH)
- Active: `#0066CC` bg white text
- Inactive: white bg, border `#E0E0E0`

**Tabs**
- 6-column tab bar
- Active tab: white bg, bold text, bottom border `#F5A623`
- Inactive: transparent bg, `text-body`

**Tables** (see §6.10)
- Header: `#0066CC` bg
- Hover row: `#0066CC` bg full highlight
- Pending changes: amber dot indicator
- Save All footer: blue CTA button with pending count badge

---

## 9. Iconography

- Library: **Lucide React** (already in use)
- Default icon size: **16px** (inline), **20px** (standalone), **24px** (feature icons)
- Stroke width: **1.5px** (default Lucide)
- Color: inherit from parent text color unless overridden
- Add-on / feature icons: **32px**, color `primary` (`#F5A623`)
- Step indicator checkmark: **12px** white inside green circle

---

## 10. Motion & Transitions

| Property | Duration | Easing |
|---|---|---|
| Color / border changes | `150ms` | `ease-in-out` |
| Card hover shadow | `150ms` | `ease-in-out` |
| Expand / collapse (chevron rotate) | `200ms` | `ease-in-out` |
| Modal / drawer enter | `250ms` | `ease-out` |
| Progress bar fill | `400ms` | `ease-in-out` |
| Skeleton shimmer | `1500ms` | `linear` infinite |

Tailwind class: `transition-all duration-150` for most interactive elements.

---

## 11. States Reference

Every interactive element must handle all five states:

| State | Visual cue |
|---|---|
| **Default** | Standard border + bg |
| **Hover** | Border / bg shift, cursor pointer |
| **Active / Selected** | Green border `#00A651`, tinted bg, checkmark |
| **Focus** | Amber ring `rgba(245,166,35,0.2)` |
| **Disabled** | Greyed out, `cursor-not-allowed`, opacity 0.6 |
| **Loading** | Skeleton pulse or spinner (`Loader2` from Lucide, `animate-spin`) |
| **Error** | Red border + red message below |
| **Success** | Green border + green message / checkmark |

---

## 12. Do / Don't

### ✅ Do
- Use white space generously — let cards breathe
- Use the primary yellow/gold only for the most important actions (1 CTA per screen)
- Use green exclusively to mean "selected / confirmed / success"
- Use `#0066CC` for all navigational / informational links
- Keep shadows subtle — `shadow-sm` at rest, `shadow-md` on hover
- Truncate long text with `truncate` + `title` tooltip

### ❌ Don't
- Don't use red for anything other than errors or destructive actions
- Don't mix multiple accent colors in the same section
- Don't use `shadow-xl` or larger on regular cards
- Don't make disabled states invisible — they should still be readable
- Don't use all-caps except for overline labels / table headers

---

## 13. AI Document Scanner — Frontend Integration

> **Feature:** Auto-fill the purchase form by scanning an uploaded document  
> **Service:** `doc-scanner-svc` — a separate Python microservice, **not** ApplicationService  
> **Regions:** PH · ID · KH  
> **Phase 1 scope:** IC / Passport only · PH first

### What It Does

At the start of the purchase journey the customer can upload a document (IC/passport, property title, previous policy, or utility bill). The AI reads the document and pre-fills as many form fields as possible.

- Fields filled by AI are shown with a **green** badge ("Auto-filled")
- Low-confidence fills get a **yellow** badge ("Please verify")
- Fields edited by the customer turn **blue** ("Edited")
- The uploaded document is **never stored** — discarded the moment extraction is done

---

### Environment Config

The scanner runs on a different host from ApplicationService. Put its URL in the env file — never hardcode it.

```env
NEXT_PUBLIC_SCANNER_URL=https://<doc-scanner-svc-host>
```

Auth reuses the **same JWT** already in memory — no second login needed.

---

### API — `POST /scan`

**Endpoint:** `${NEXT_PUBLIC_SCANNER_URL}/scan`  
**Auth:** `Authorization: Bearer <JWT>`  
**Content-Type:** `multipart/form-data`

#### Request fields

| Field | Type | Required | Values |
|---|---|---|---|
| `file` | File | ✅ | PDF, JPG, JPEG, PNG, WEBP — **max 10 MB** |
| `documentType` | string | ✅ | `IC` \| `PROPERTY_TITLE` \| `POLICY` \| `UTILITY_BILL` |
| `countryCode` | string | ✅ | `PH` \| `ID` \| `KH` |

#### Success `200 OK`

```json
{
  "documentType": "IC",
  "countryCode": "PH",
  "confidence": 0.91,
  "fields": {
    "fullName":        { "value": "Juan dela Cruz",  "confidence": 0.97, "filled": true  },
    "dateOfBirth":     { "value": "1990-05-14",      "confidence": 0.95, "filled": true  },
    "idNumber":        { "value": "123-456-789-000", "confidence": 0.93, "filled": true  },
    "postcode":        { "value": null,              "confidence": 0.00, "filled": false },
    "email":           { "value": null,              "confidence": 0.00, "filled": false }
  },
  "warnings": [
    "Postcode not found on document — customer must enter manually."
  ]
}
```

#### Error responses

| HTTP | When |
|---|---|
| `400` | Wrong file type, file > 10 MB, missing `documentType` or `countryCode` |
| `401` | Missing or invalid JWT |
| `422` | Model couldn't parse the document (too blurry, wrong language, etc.) |
| `503` | AI model not loaded / service starting up |

> **On any error:** Do NOT block the form. Show an inline error banner and let the customer fill manually. No automatic retry — user must re-upload if they want to try again.

---

### What Each Document Type Can Fill

| Form Field | IC / Passport | Property Title | Previous Policy | Utility Bill |
|---|---|---|---|---|
| fullName | ✅ | ✅ owner name | ✅ policyholder | ✅ |
| dateOfBirth | ✅ | ❌ | ❌ | ❌ |
| idNumber | ✅ | ❌ | ❌ | ❌ |
| gender | ✅ | ❌ | ❌ | ❌ |
| nationality | ✅ | ❌ | ❌ | ❌ |
| addressLine1 | ✅ | ✅ | ✅ | ✅ |
| city | ✅ | ✅ | ✅ | ✅ |
| state | ✅ | ✅ | ✅ | ✅ |
| postcode | sometimes | ✅ | ✅ | ✅ |
| propertyType | ❌ | sometimes | ✅ | ❌ |
| floorArea | ❌ | sometimes | sometimes | ❌ |
| yearBuilt | ❌ | sometimes | sometimes | ❌ |
| constructionType | ❌ | ❌ | sometimes | ❌ |
| sumInsured | ❌ | ❌ | ✅ | ❌ |

**UX tip — suggest the right document per step:**
- Step 1 Personal Info → suggest **IC / Passport**
- Step 2 Property Details → suggest **Property Title** or **Previous Policy**
- Step 3 Coverage → suggest **Previous Policy**

---

### Session Storage

Save the scan result to `sessionStorage` immediately after a successful response. It is cleared automatically when the tab closes.

```ts
interface FieldResult {
  value: string | null;
  confidence: number;       // 0.0 – 1.0
  filled: boolean;
  source: 'scanned' | 'manual'; // update to 'manual' when customer edits
}

interface ScannedData {
  scannedAt: string;        // ISO timestamp — new Date().toISOString()
  documentType: string;
  fields: Record<string, FieldResult>;
}

// Save
sessionStorage.setItem('scanResult', JSON.stringify(data));

// Read
const raw = sessionStorage.getItem('scanResult');
const scanData: ScannedData | null = raw ? JSON.parse(raw) : null;
```

---

### Auto-fill Logic

Only fill fields that are currently empty — **never overwrite** what the customer already typed.

```ts
function applyScannedData(
  result: ScanResult,
  formMethods: UseFormReturn
) {
  Object.entries(result.fields).forEach(([fieldKey, field]) => {
    if (field.filled && field.value !== null) {
      const current = formMethods.getValues(fieldKey);
      if (!current) {
        formMethods.setValue(fieldKey, field.value, { shouldValidate: true });
      }
    }
  });
}
```

---

### Multiple Document Uploads — Merge Logic

The customer can upload a second document (e.g. IC first, then property title). New fields fill empty slots; already-filled fields are **not** overwritten.

```ts
function mergeScannedData(
  existing: ScannedData,
  newResult: ScanResult
): ScannedData {
  const merged = { ...existing, fields: { ...existing.fields } };
  Object.entries(newResult.fields).forEach(([key, field]) => {
    const alreadyFilled = existing.fields[key]?.filled;
    if (field.filled && !alreadyFilled) {
      merged.fields[key] = { ...field, source: 'scanned' };
    }
  });
  return merged;
}
```

---

### Field Status Badges

Every form field that participates in auto-fill shows a small inline badge:

| State | Colour | Condition | Label |
|---|---|---|---|
| Filled by scan | 🟢 `#00A651` green | `filled === true` AND `confidence >= 0.80` | "Auto-filled" |
| Low confidence | 🟡 `#F5A623` amber | `filled === true` AND `confidence < 0.80` | "Please verify" |
| Not found | — none | `filled === false` | *(empty field, no badge)* |
| Edited by customer | 🔵 `#0066CC` blue | `source === 'manual'` | "Edited" |

When the customer edits an auto-filled field, update `source` to `'manual'` and swap the badge to blue.

```tsx
// Badge component
function FieldBadge({ field }: { field: FieldResult }) {
  if (field.source === 'manual') {
    return <span className="text-[10px] font-medium text-[#0066CC] bg-[#E8F1FB] px-1.5 py-0.5 rounded">Edited</span>
  }
  if (field.filled && field.confidence >= 0.80) {
    return <span className="text-[10px] font-medium text-[#00A651] bg-[#E6F7EE] px-1.5 py-0.5 rounded">Auto-filled</span>
  }
  if (field.filled && field.confidence < 0.80) {
    return <span className="text-[10px] font-medium text-[#D4891A] bg-[#FDF0E6] px-1.5 py-0.5 rounded">Please verify</span>
  }
  return null
}
```

---

### UI Flow

```
Purchase Journey — Step 1
┌──────────────────────────────────────────────────────┐
│  📄 Save time — scan your document                   │
│                                                      │
│  [ IC / Passport ]  [ Property Title* ]              │
│  [ Insurance Policy* ]  [ Utility Bill* ]            │
│  * Coming soon (Phase 2)                             │
│                                                      │
│  [ Upload & Auto-fill ↑ ]   or   [ Fill manually ]  │
└──────────────────────────────────────────────────────┘
          │ customer selects file
          ▼
  Spinner: "Scanning your document…"
  (upload button disabled during request)
          │ POST /scan
          ├── 200 OK ──────────────────────────────────
          │   ✅ 8 of 11 fields filled automatically
          │   Full Name      Juan dela Cruz   🟢 Auto-filled
          │   Date of Birth  14 May 1990     🟢 Auto-filled
          │   City           Makati          🟡 Please verify
          │   Postcode       [ type here ]   (not found)
          │   [ Upload another document ]  [ Continue → ]
          │
          └── 4xx / 5xx ─────────────────────────────
              ⚠️  We couldn't read this document.
              Please check the file and try again,
              or fill in the details manually.
              [ Try again ]  [ Fill manually ]
```

---

### Phase Plan

| Phase | Scope | Status |
|---|---|---|
| **1 — MVP** | IC / Passport only · PH first · field badges · sessionStorage | First build |
| **2 — More docs** | Property Title, Policy, Utility Bill · ID + KH formats | After Phase 1 |
| **3 — Polish** | Multi-doc merge UI · "Upload another" · low-confidence review modal | After Phase 2 |

---

### ❌ What NOT to Do

- Do **not** send the file to ApplicationService — only `doc-scanner-svc` receives it
- Do **not** store the file in React state or localStorage
- Do **not** block form submission if the scan fails — manual fill must always work
- Do **not** auto-fill a field the customer already typed into
- Do **not** show the raw `confidence` number to the customer — show the colour badge only
- Do **not** hardcode the scanner base URL — use `NEXT_PUBLIC_SCANNER_URL`

---

## 14. AI Document Scanner — Implementation Plan

> **Total Phase 1 to live:** ~2.5 weeks if backend and frontend run Steps 5–6 in parallel after Step 4.

---

### Phase 1 — Foundation

#### Step 1 — Backend: Scaffold the repo `(1–2 days)`
> **Depends on:** nothing

- Create new repo `doc-scanner-svc`
- Set up FastAPI project structure
- Add `GET /health` — returns model name + status
- Add `GET /supported-doc-types` — returns static list for now
- Write `Dockerfile` and `docker-compose.yml`
- **No AI, no Ollama yet** — just the skeleton compiles and runs

---

#### Step 2 — Backend: Install Ollama + LLaMA 3.2 Vision locally `(1 day)`
> **Depends on:** Step 1

- Install Ollama on dev machine
- Pull model: `ollama pull llama3.2-vision:11b`
- Confirm model loads and answers a basic prompt via Ollama's REST API
- Wire Ollama client into the FastAPI app (`config.py` — Ollama base URL, model name)

---

#### Step 3 — Backend: Implement `POST /scan` for IC / Passport only `(3–4 days)`
> **Depends on:** Step 2

- Write `pdf_converter.py` — convert first 3 pages of PDF to images
- Write `image_utils.py` — validate MIME type, enforce 10 MB limit, resize if too large
- Write IC/passport extraction prompt (`prompts/ic_passport.txt`)
- Write `extractor.py` — sends image + prompt to Ollama, parses JSON response, retries on invalid JSON
- Write `scan.py` router — ties everything together, returns `ExtractionResult`
- Add JWT validation middleware (same secret as ApplicationService)
- **Test manually** with a real PH IC photo — confirm field extraction works

---

#### Step 4 — Backend + Frontend: Lock the API contract `(0.5 day)`
> **Depends on:** Step 3

- Confirm final field key names (`fullName`, `dateOfBirth`, `idNumber`, etc.)
- Confirm confidence threshold is `0.80`
- Write a Postman / Bruno collection with example request + response
- **Share with frontend — this is the green light to start Step 5**

---

#### Step 5 — Frontend: Build upload UI with mock response `(2–3 days)`
> **Depends on:** Step 4  
> **Runs in parallel with:** Step 6 prep

- Add env var `NEXT_PUBLIC_SCANNER_URL`
- Build the upload section component:
  - Document type selector buttons (IC / Passport active, others "Coming Soon")
  - File picker + spinner ("Scanning your document…")
  - Error banner (`400` / `422` / `503`)
- Create `mockScanResult.ts` — hardcoded `ScanResult` matching the Step 4 contract
- Build `<FieldBadge />` — green / yellow / grey / blue driven by mock data
- Build `applyScannedData()` — writes mock values into form fields
- Build `mergeScannedData()` — merge logic for multiple uploads
- Build `sessionStorage` read/write helpers (`scanResult` key)
- **Everything works 100% offline using the mock — no real API needed yet**

---

#### Step 6 — Frontend: Replace mock with real API call `(1 day)`
> **Depends on:** Steps 3 + 5

- Write `scanDocument(file, documentType, countryCode)` service function
- Swap mock in the upload component for the real service call
- Attach JWT from auth store to the `Authorization` header
- Test end-to-end against the locally running `doc-scanner-svc`

```ts
// lib/api/scan-document.ts
export async function scanDocument(
  file: File,
  documentType: 'IC' | 'PROPERTY_TITLE' | 'POLICY' | 'UTILITY_BILL',
  countryCode: string,
): Promise<ScanResult> {
  const form = new FormData()
  form.append('file', file)
  form.append('documentType', documentType)
  form.append('countryCode', countryCode)

  const res = await fetch(`${process.env.NEXT_PUBLIC_SCANNER_URL}/scan`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${getToken()}` },
    body: form,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message ?? `Scan failed (${res.status})`)
  }
  return res.json()
}
```

---

#### Step 7 — Both: Integration testing `(1–2 days)`
> **Depends on:** Step 6

| Test case | Expected result |
|---|---|
| PH IC — photo | Fields fill correctly, green badges appear |
| PH IC — PDF | Same as photo path |
| Blurry / rotated image | `422` error banner shows, form stays usable |
| `503` (stop Ollama) | Error banner shows, nothing breaks, manual fill works |
| Manual fill path | Nothing depends on scan being called |
| Two document uploads | Merge logic — second upload fills only empty slots |

---

### Phase 2 — More Document Types *(after Phase 1 ships)*

#### Step 8 — Backend: Add remaining document prompts `(2–3 days)`
> **Depends on:** Step 7

- `prompts/property_title.txt`
- `prompts/policy.txt`
- `prompts/utility_bill.txt`
- Test each with real sample docs from PH, ID, KH

#### Step 9 — Frontend: Enable remaining document type buttons `(1 day)`
> **Depends on:** Step 8

- Remove "Coming soon" state from Property Title, Policy, Utility Bill buttons
- Map new fields (`propertyType`, `floorArea`, `yearBuilt`, `sumInsured`) to form fields

---

### Phase 3 — Production *(when ready to go live)*

#### Step 10 — DevOps: Provision GPU server `(1–2 days)`
> **Depends on:** Step 9

- Decide provider: RunPod · Lambda Labs · AWS
- Deploy `doc-scanner-svc` Docker image with `--gpus all`
- Switch from Ollama → vLLM if higher throughput is needed
- Set up HTTPS + reverse proxy (nginx or Caddy)
- Point `NEXT_PUBLIC_SCANNER_URL` to the production URL

---

### Summary Table

| Step | Who | Depends on | Est. Time |
|---|---|---|---|
| 1. Scaffold repo | Backend | — | 1–2 days |
| 2. Ollama + LLaMA setup | Backend | Step 1 | 1 day |
| 3. `POST /scan` (IC only) | Backend | Step 2 | 3–4 days |
| 4. Lock API contract | Backend + Frontend | Step 3 | 0.5 day |
| 5. Upload UI + mock | Frontend | Step 4 | 2–3 days |
| 6. Real API integration | Frontend | Steps 3 + 5 | 1 day |
| 7. Integration testing | Both | Step 6 | 1–2 days |
| 8. More doc types (BE) | Backend | Step 7 | 2–3 days |
| 9. Enable more doc buttons | Frontend | Step 8 | 1 day |
| 10. GPU + production deploy | DevOps | Step 9 | 1–2 days |

> **Phase 1 critical path:** Steps 1 → 2 → 3 → 4 (backend) then Steps 5 → 6 → 7 (frontend can start Step 5 in parallel once Step 4 is done).  
> **Estimated Phase 1 duration:** ~2.5 weeks running Steps 5–6 in parallel with backend finishing Step 3.
- Don't render amber and orange next to each other without clear intent
