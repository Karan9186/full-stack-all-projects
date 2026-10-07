# Preveuo UI — Design System Rules
# This file is auto-loaded by AI agents working on this codebase.
# ALL pages and components MUST follow these rules exactly.

## 🎨 Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `brand-purple` | `#5B5CE2` | Primary CTA buttons, active states, accent text, icons |
| `brand-purple-hover` | `#4a4bd4` | Hover state for primary buttons |
| `bg-white` | `#ffffff` | Default section background |
| `bg-light` | `#f8f8fc` | Subtle section backgrounds (e.g. CTA section gradient) |
| `bg-dark` | `#0f0f1a` | Dark sections (footer, testimonials) |
| `text-heading` | `#0f0f1a` | All page headings (H1–H4) |
| `text-body` | `#6b7280` | Body paragraphs, subtext |
| `text-label` | `#5B5CE2` | Section labels (UPPERCASE, tracked, 10.5px) |
| `text-muted` | `#9ca3af` | Captions, secondary metadata |
| `border-default` | `#e5e7eb` | Card borders, dividers |
| `border-light` | `#f0f0f4` | Section separators, sidebar borders |
| `text-dark-heading` | `#ffffff` | Headings on dark backgrounds |
| `text-dark-body` | `#9ca3af` | Body on dark backgrounds |
| `purple-icon-bg` | `#eeecff` | Background for purple icon boxes |
| `green-icon-bg` | `#ecfdf5` | Background for green icon boxes |
| `orange-icon-bg` | `#fff7ed` | Background for orange icon boxes |

## 🔤 Typography

### Font Family
**ALWAYS use Inter.** Loaded via next/font/google in layout.tsx.
```
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
```
Never use Geist, Roboto, or any other font unless user explicitly requests it.

### Font Size & Weight Scale

| Element | Size | Weight | Tracking | Color |
|---------|------|--------|----------|-------|
| Section Label | 10.5px | 700 Bold | 0.15–0.2em | #5B5CE2 |
| H1 Hero | 64–72px | 800 ExtraBold | -0.03em | #0f0f1a |
| H1 Hero Purple | 64–72px | 800 ExtraBold | -0.03em | #5B5CE2 |
| H2 Section | 40–52px | 800 ExtraBold | -0.03em | #0f0f1a |
| H2 Dark bg | 40–52px | 800 ExtraBold | -0.03em | #ffffff |
| H3 Card Title | 15px | 700 Bold | normal | #0f0f1a |
| Body / Subtext | 17–18px | 400 | normal | #6b7280 |
| Card Body | 13.5px | 400 | normal | #6b7280 |
| Nav Links | 13.5px | 500 | normal | #4b5563 |
| Button Text | 14–15px | 600 SemiBold | normal | varies |
| Stat Number | 40–48px | 800 ExtraBold | -0.02em | #5B5CE2 |
| Stat Label | 13px | 700 | normal | #0f0f1a |
| Stat Sub | 12px | 400 | normal | #6b7280 |
| Footer Link | 13–14px | 400 | normal | #5B5CE2 on dark bg |
| Footer Col Label | 11px | 700 | 0.12em | #6b7280 |
| Quote Text | 22–28px | 500 | -0.01em | #ffffff |

## 📐 Layout & Spacing

- Max content width: max-w-[1100px] for wide sections, max-w-[760px] for centered text
- Section padding: py-20 (80px) standard, py-24 for hero/CTA
- Section separator: border-t border-[#f0f0f4] between sections on white bg
- Card border radius: rounded-2xl (16px) for feature cards, rounded-xl for small
- Card border: border border-[#e5e7eb]
- Card padding: p-6 standard, p-4 compact
- Grid gaps: gap-5 for cards, gap-3 for tight grids

## 🖱️ Interactive States

- Hover translation: hover:-translate-y-[1px] on primary buttons
- Hover shadow: hover:shadow-md on primary buttons
- Link hover: hover:text-[#5B5CE2] on neutral links
- Card hover: hover:border-[#5B5CE2]/30 hover:shadow-[0_4px_24px_rgba(91,92,226,0.08)]
- Transition: transition-all duration-150 (fast, snappy)
- Nav active pill: white bg + shadow-[0_0_0_1px_#e5e7eb] + font-semibold

## 🔘 Button System

### Primary Button
```
className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#5B5CE2] hover:bg-[#4a4bd4] text-white text-[15px] font-semibold transition-all duration-150 hover:shadow-md hover:-translate-y-[1px] shadow-sm"
```

### Secondary / Outlined Button (on light bg)
```
className="px-6 py-3.5 rounded-xl border border-[#d1d5db] text-[#0f0f1a] text-[15px] font-semibold hover:border-[#5B5CE2] hover:text-[#5B5CE2] transition-all duration-150"
```

### Ghost / Outlined Button (on dark bg)
```
className="px-6 py-3.5 rounded-xl border border-white/20 text-white text-[15px] font-semibold hover:bg-white/10 transition-all duration-150"
```

## 🧩 Standard Reusable UI Primitives (MANDATORY)

All forms, buttons, and input fields across the application MUST use the centralized components from `@/components/ui`:
- **`Button` (`@/components/ui/Button`)**:
  - Variants: `'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'social'`
  - Sizes: `'sm' | 'md' | 'lg'`
  - Supports `isLoading`, `leftIcon`, `rightIcon`, `fullWidth`.
  - **RULE**: NEVER write custom `<button className="...">` styling in feature pages. Always use `<Button variant="..." />`.
- **`Input` (`@/components/ui/Input`)**:
  - Built-in label, error message, helper text, left/right icons, and password reveal toggle (`isPassword`).
  - **RULE**: NEVER write unstyled or ad-hoc `<input>` tags. Always use `<Input />`.
- **`Select` (`@/components/ui/Select`)**:
  - Custom chevron, accessible label, error messages, and options.
- **`Checkbox` (`@/components/ui/Checkbox`)**:
  - Accessible checkbox with label and description.

## 🏢 Multi-Tenant SaaS Architecture Rules

Preveuo is a multi-tenant platform. All authentication and onboarding flows must:
1. Support Workspace/Organization identification: Every user is scoped to an Organization & Workspace with a unique slug (`preveuo.com/w/[slug]`).
2. Provide a 2-step onboarding flow: Step 1 (User credentials / OAuth) → Step 2 (Workspace creation: Name, Slug, Team Size, Role, Primary Goal).
3. Support Enterprise Workspace SSO login alongside standard email/password authentication.

## 📝 Section Label Pattern
All sections use a consistent purple uppercase label above heading:
```tsx
<p className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-[#5B5CE2] mb-4">
  Section Label Here
</p>
```

## 🏗️ Navbar Rules
- Fixed, white background, 60px height
- Logo: Purple rounded-[8px] square icon + bold uppercase PREVEUO text
- Nav links: plain gray, active link gets pill with border + white bg
- Right: Log in plain text + Start for free purple button
- Mobile: hamburger drawer
- No dark mode — always white navbar

## 🦶 Footer Rules
- Dark background: bg-[#121214] (mandatory common footer across all pages)
- Logo: purple square lock icon + white PREVEUO text
- Tagline: "Turn every product story into an experience people remember—and act on." (#9ca3af)
- Green status: simple green dot (● bg-[#10b981]) + "All systems operational" (#9ca3af)
- 4 columns: PRODUCT, RESOURCES, COMPANY, LEGAL
- Column links: off-white/light gray (text-[#d4d4d8] hover:text-white)
- Column headers: uppercase tracked gray labels (text-[11.5px] font-bold text-[#71717a])
- Bottom bar: left "© 2025 Preveuo, Inc. All rights reserved.", right "Built for teams that believe great products deserve great stories."
- Floating help button: fixed circular button bottom-right with "?" icon
- No social media icons in footer

## 🌑 Dark Section Rules (Testimonials, etc.)
- Background: #0f0f1a
- Heading/quote: text-white, large, centered
- Body: text-[#9ca3af]
- Icon: purple stroke SVG

## 📊 Stats Section Rules
- Split: left = label + heading + subtext; right = 2x2 stat grid
- Grid uses border lines as dividers (not card shadows)
- Stat number: text-[42–48px] font-extrabold text-[#5B5CE2]
- Stat bold label: text-[13px] font-bold text-[#0f0f1a]
- Stat sub: text-[12px] text-[#6b7280]

## 🎬 GSAP Animation Rules
- Always use gsap.context() + ctx.revert() cleanup
- Check typeof window !== 'undefined' before ScrollTrigger
- Hero: stagger reveal from bottom (y: 30→0, opacity: 0→1)
- Sections: GSAPReveal wrapper for scroll reveals
- Duration: 0.5–0.75s, ease: power3.out
- No layout-shifting animations

## ✅ Component Checklist for Every Page
- suppressHydrationWarning on body (already in layout.tsx)
- No Date.now(), Math.random(), new Date() in Server Components
- All icons use inline SVG (no lucide-react for brand/social icons)
- All interactive elements have unique id attributes
- Use next/image for all img tags
- Page has export const metadata for SEO
- Mobile responsive with sm: breakpoints

## 🚫 Never Do
- Never use dark: Tailwind variants (design is light-only except footer/testimonials)
- Never use indigo-* colors — use #5B5CE2 directly
- Never use violet-* or purple-* tailwind named colors
- Never use fonts other than Inter
- Never add gradient text effects to headings
- Never use glassmorphism (backdrop-blur, bg-white/80) except navbar on scroll
- Never add drop shadows to text
- Never import @heroicons/react — use inline SVG or lucide-react
