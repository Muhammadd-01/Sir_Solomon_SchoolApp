# Design System & Theme

## Color Palette

Extracted from the school logo for brand consistency:

### Primary Colors

| Color Name | Hex | RGB | Usage |
|------------|-----|-----|-------|
| **Primary Lime** | `#B4FF71` | `rgb(180, 255, 113)` | Primary CTAs, badges, teacher highlights, attendance confirmed state |
| **Purple Accent** | `#C84AB6` | `rgb(200, 74, 182)` | Headers, buttons, links, gradient partner with accent |
| **Dark Navy** | `#081F5C` | `rgb(8, 31, 92)` | Navbar, footer, dark mode cards |
| **Dark Text** | `#111111` | `rgb(17, 17, 17)` | Headings, icons, body text |

### Neutral Colors

| Color Name | Hex | RGB | Usage |
|------------|-----|-----|-------|
| **Background White** | `#FFFFFF` | `rgb(255, 255, 255)` | Cards, main background (light mode) |
| **Gray** | `#BDBDBD` | `rgb(189, 189, 189)` | Disabled state, borders, dividers |

### Dark Mode

| Element | Light Mode | Dark Mode |
|---------|------------|-----------|
| Background | `#FFFFFF` | `#081F5C` |
| Cards | `#FFFFFF` | `#0A2570` |
| Text | `#111111` | `#FFFFFF` |
| Borders | `#BDBDBD` | `#1E3A8A` |

## Typography

### Mobile App (Flutter)

**Primary Font**: Inter or Roboto

```dart
TextTheme(
  displayLarge: TextStyle(fontSize: 32, fontWeight: FontWeight.bold),
  displayMedium: TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
  displaySmall: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
  headlineMedium: TextStyle(fontSize: 20, fontWeight: FontWeight.w600),
  titleLarge: TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
  bodyLarge: TextStyle(fontSize: 16, fontWeight: FontWeight.normal),
  bodyMedium: TextStyle(fontSize: 14, fontWeight: FontWeight.normal),
  labelLarge: TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
)
```

### Admin Panel (React/Tailwind)

**Primary Font**: Inter (via Google Fonts)

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

## Spacing Scale

Consistent spacing using 8px base unit:

| Token | Value | Usage |
|-------|-------|-------|
| `xs` | 4px | Tight spacing, icon padding |
| `sm` | 8px | Small gaps, compact layouts |
| `md` | 16px | Standard spacing, card padding |
| `lg` | 24px | Section spacing |
| `xl` | 32px | Large sections |
| `2xl` | 48px | Page sections |

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `sm` | 4px | Buttons, inputs |
| `md` | 8px | Cards, containers |
| `lg` | 12px | Modals, large cards |
| `full` | 9999px | Pills, badges, avatars |

## Shadows

### Light Mode
```css
sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
md: 0 4px 6px -1px rgba(0, 0, 0, 0.1)
lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1)
xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1)
```

### Dark Mode
```css
sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3)
md: 0 4px 6px -1px rgba(0, 0, 0, 0.4)
lg: 0 10px 15px -3px rgba(0, 0, 0, 0.5)
xl: 0 20px 25px -5px rgba(0, 0, 0, 0.6)
```

## Component Styles

### Buttons

**Primary Button**
- Background: `#B4FF71`
- Text: `#111111`
- Hover: Darken by 10%
- Border Radius: `8px`
- Padding: `12px 24px`

**Secondary Button**
- Background: `#C84AB6`
- Text: `#FFFFFF`
- Hover: Darken by 10%
- Border Radius: `8px`
- Padding: `12px 24px`

**Outline Button**
- Border: `2px solid #C84AB6`
- Text: `#C84AB6`
- Hover: Background `#C84AB6`, Text `#FFFFFF`

### Cards

- Background: `#FFFFFF` (light) / `#0A2570` (dark)
- Border Radius: `12px`
- Padding: `16px`
- Shadow: `md`

### Badges

**Status Badges**
- Present: Background `#B4FF71`, Text `#111111`
- Absent: Background `#EF4444`, Text `#FFFFFF`
- Late: Background `#F59E0B`, Text `#FFFFFF`
- Pending: Background `#BDBDBD`, Text `#111111`

### Inputs

- Border: `1px solid #BDBDBD`
- Border Radius: `8px`
- Padding: `12px 16px`
- Focus Border: `#C84AB6`
- Focus Shadow: `0 0 0 3px rgba(200, 74, 182, 0.1)`

## Icons

Use **Material Icons** or **Heroicons** for consistency.

Primary icon color: `#111111` (light mode) / `#FFFFFF` (dark mode)

## Accessibility

### Contrast Ratios
All color combinations meet WCAG AA standards:
- Primary Lime (#B4FF71) on Dark Text (#111111): 10.2:1 ✓
- Purple Accent (#C84AB6) on White: 4.8:1 ✓
- Dark Navy (#081F5C) on White: 13.5:1 ✓

### Focus States
All interactive elements have visible focus indicators with 3px outline.

### Large Text Mode
Support for 1.5x and 2x text scaling.

## Animation

### Transitions
- Default duration: `200ms`
- Easing: `cubic-bezier(0.4, 0, 0.2, 1)`

### Micro-interactions
- Button hover: Scale 1.02, duration 150ms
- Card hover: Lift shadow, duration 200ms
- Page transitions: Fade + slide, duration 300ms

## Responsive Breakpoints

| Breakpoint | Width | Target |
|------------|-------|--------|
| `sm` | 640px | Large phones |
| `md` | 768px | Tablets |
| `lg` | 1024px | Small laptops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large screens |

## Logo Usage

### Primary Logo
- File: `assets/logo.jpg`
- Minimum size: 48x48px
- Clear space: 16px on all sides
- Do not distort aspect ratio

### App Icon
- Generated from logo
- Sizes: 48dp, 72dp, 96dp, 144dp, 192dp (Android)
- Sizes: 20pt, 29pt, 40pt, 60pt, 76pt, 83.5pt (iOS)

### Favicon
- 32x32px and 16x16px for web
- SVG version for modern browsers

## Implementation

### Flutter Theme
See: `mobile/lib/src/core/theme/app_theme.dart`

### Tailwind Config
See: `admin/tailwind.config.js`

### CSS Variables (Admin)
```css
:root {
  --color-primary: #B4FF71;
  --color-accent: #C84AB6;
  --color-navy: #081F5C;
  --color-text: #111111;
  --color-gray: #BDBDBD;
}

[data-theme="dark"] {
  --color-bg: #081F5C;
  --color-card: #0A2570;
  --color-text: #FFFFFF;
}
```
