---
name: Cloud Drift
colors:
  surface: '#f8f9ff'
  surface-dim: '#d7dae1'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f4fb'
  surface-container: '#ebeef5'
  surface-container-high: '#e5e8ef'
  surface-container-highest: '#dfe2ea'
  on-surface: '#181c21'
  on-surface-variant: '#44474c'
  inverse-surface: '#2d3136'
  inverse-on-surface: '#eef1f8'
  outline: '#75777d'
  outline-variant: '#c5c6cd'
  surface-tint: '#515f74'
  primary: '#4f5d71'
  on-primary: '#ffffff'
  primary-container: '#68758b'
  on-primary-container: '#fdfcff'
  inverse-primary: '#b9c7df'
  secondary: '#52606f'
  on-secondary: '#ffffff'
  secondary-container: '#d3e1f3'
  on-secondary-container: '#566474'
  tertiary: '#5b5c59'
  on-tertiary: '#ffffff'
  tertiary-container: '#747571'
  on-tertiary-container: '#fefdf7'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d5e3fc'
  primary-fixed-dim: '#b9c7df'
  on-primary-fixed: '#0e1c2e'
  on-primary-fixed-variant: '#3a485b'
  secondary-fixed: '#d6e4f6'
  secondary-fixed-dim: '#bac8da'
  on-secondary-fixed: '#0f1d2a'
  on-secondary-fixed-variant: '#3b4857'
  tertiary-fixed: '#e3e3de'
  tertiary-fixed-dim: '#c7c7c2'
  on-tertiary-fixed: '#1b1c19'
  on-tertiary-fixed-variant: '#464744'
  background: '#f8f9ff'
  on-background: '#181c21'
  surface-variant: '#dfe2ea'
typography:
  display-lg:
    fontFamily: Quicksand
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Quicksand
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Quicksand
    fontSize: 28px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Quicksand
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
---

## Brand & Style
The design system is centered on the concept of "Restful Precision." It bridges the gap between tactile comfort and professional reliability, specifically tailored for a premium travel commerce experience. The target audience consists of frequent travelers and commuters who value ergonomic support as much as aesthetic tranquility.

The visual style is **Soft Minimalism**. It utilizes heavy whitespace to create an "airy" feel, reminiscent of cloud-like comfort, while maintaining a structured grid to signal professional quality. Interaction is defined by gentle transitions, low-friction layouts, and a "squishy" high-quality feel that mirrors the physical product in the reference image.

## Colors
The palette is derived directly from the cooling, heathered textures of high-end travel gear. 

- **Primary (Steel Blue-Grey):** A muted, professional tone used for key branding elements and primary actions. It provides enough contrast for accessibility while remaining "soft."
- **Secondary (Mist Blue):** Used for subtle accents, hover states, and background washes to reinforce the airy theme.
- **Tertiary (Warm Cream):** The base surface color. Replacing pure white with a warm cream (#F9F8F3) reduces eye strain and evokes a sense of "coziness" and premium quality.
- **Neutral (Charcoal Grey):** Used for text and icons to ensure legibility without the harshness of pure black.

## Typography
The typography pairing balances approachability with clarity. 

**Quicksand** is used for headings. Its rounded terminals mirror the soft contours of the travel pillow, creating a friendly and inviting hierarchy. 

**Plus Jakarta Sans** is used for all functional body and label text. It offers a clean, modern grotesque feel that ensures the store remains professional and easy to navigate. Line heights are intentionally generous (1.6x) to maintain the "airy" feel of the brand narrative.

## Layout & Spacing
The layout follows a **Fluid Grid** model with high internal margins. Elements should never feel crowded. 

- **Desktop:** 12-column grid with a 1280px max-width container. Use wide 64px margins to frame the content like a lifestyle editorial.
- **Mobile:** 4-column grid. Spacing is reduced to 20px margins, but vertical "breathing room" (padding-top/bottom) should remain high between sections (80px+).
- **Rhythm:** Use an 8px base unit. Component spacing should favor large values (e.g., 32px or 48px) to emphasize the minimalist aesthetic.

## Elevation & Depth
Depth is conveyed through **Ambient Shadows** and **Tonal Layering**. 

Avoid harsh borders. Instead, use soft, diffused shadows with a large blur radius and low opacity (e.g., `box-shadow: 0 10px 30px rgba(125, 139, 161, 0.1)`). Surfaces should feel like they are "resting" on one another rather than floating high above. 

Subtle color shifts in background containers (moving from Cream to a very light Grey-Blue) are preferred over lines to separate content sections.

## Shapes
The shape language is "Organic & Protective." Following the `rounded-2` scale:
- **Buttons and Inputs:** Use 0.5rem (8px) radius for a modern, accessible feel.
- **Product Cards:** Use `rounded-lg` (1rem / 16px) to create a soft frame for photography.
- **Featured Banners:** Use `rounded-xl` (1.5rem / 24px) for large-scale immersive elements.

All icons should use rounded caps and joins to match the typography.

## Components
- **Buttons:** Primary buttons use a solid Steel Blue-Grey background with white text. Secondary buttons use a ghost style with a 1px Steel Blue-Grey border. All buttons should have a subtle "lift" on hover via an increased shadow blur.
- **Inputs:** Text fields should have a Warm Cream background and a thin Mist Blue border. On focus, the border thickens slightly and the shadow softens.
- **Product Cards:** Cards should be borderless, utilizing a soft ambient shadow. Typography within cards should be centered to maintain a clean, boutique look.
- **Chips/Badges:** Used for "In Stock" or "New" labels. These should be pill-shaped with very low-saturation background colors (Mist Blue) and charcoal text.
- **Quantity Selectors:** Large, touch-friendly rounded rectangles with soft +/- icons to ensure ease of use on mobile devices.