<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Preveuo UI — Design System Rules & Guidelines
> **MANDATORY FOR ALL AGENTS**: Every page and component in this repository MUST strictly follow the design tokens, typography, and patterns documented below to match the Figma design.

## 🎨 Color Palette

| Token | Hex Value | Usage |
|-------|-----------|-------|
| `brand-purple` | `#5B5CE2` | Primary CTA buttons, active state pills, icons, accent links |
| `brand-purple-hover` | `#4a4bd4` | Hover state for primary buttons |
| `bg-white` | `#ffffff` | Default section backgrounds |
| `bg-light` | `#f8f8fc` | Subtle light backgrounds |
| `bg-dark` | `#0f0f1a` | Dark sections (Testimonials) |
| `footer-dark` | `#121214` | Dark footer background |
| `text-heading` | `#0f0f1a` | Primary headings (H1–H4) |
| `text-body` | `#6b7280` | Body paragraphs, descriptions |
| `text-label` | `#5B5CE2` | Uppercase category/section labels |
| `text-muted` | `#9ca3af` | Small footnotes, metadata |
| `border-default` | `#e5e7eb` | Cards and grid borders |
| `border-light` | `#f0f0f4` | Section dividers |

## 🔤 Typography

- **Font Family**: Always use **Inter** (`font-sans` loaded via `next/font/google` in `layout.tsx`).
- **Section Labels**: `text-[10.5px] font-bold uppercase tracking-[0.2em] text-[#5B5CE2]`
- **Headings (H1/H2)**: `font-extrabold tracking-[-0.03em] text-[#0f0f1a] leading-tight`
- **Body Text**: `text-[15px] sm:text-[17px] text-[#6b7280] leading-relaxed`

## 🔘 Button Styles

- **Primary Button**:
  `px-6 py-3.5 rounded-xl bg-[#5B5CE2] hover:bg-[#4a4bd4] text-white text-[15px] font-semibold transition-all duration-150 hover:-translate-y-[1px] hover:shadow-md shadow-sm`
- **Secondary Button**:
  `px-6 py-3.5 rounded-xl border border-[#d1d5db] bg-white text-[#0f0f1a] text-[15px] font-semibold hover:border-[#5B5CE2] hover:text-[#5B5CE2] transition-all duration-150`

## 🧩 Standard Reusable UI Primitives (MANDATORY)

All forms, buttons, and input fields across the application MUST use the centralized components from `@/components/ui`:
- **`Button` (`@/components/ui/Button`)**:
  - Variants: `'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'social'`
  - Sizes: `'sm' | 'md' | 'lg'`
  - Supports `isLoading`, `leftIcon`, `rightIcon`, `fullWidth`.
  - **RULE**: NEVER write raw ad-hoc `<button>` styling in feature pages. Always use `<Button variant="..." />`.
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

## 🗂️ Domain Types & Interface Folder Structure (MANDATORY)

All TypeScript interfaces and object models MUST be organized into dedicated feature- and functionality-wise modules under `src/types/`:
- `src/types/auth.ts`: Authentication, user credentials, sessions, and SSO domain types.
- `src/types/workspace.ts`: Multi-tenant workspace, organization, team members, roles, and project models.
- `src/types/analytics.ts`: Leads, drop-off funnels, dwell times, and engagement metrics.
- `src/types/pricing.ts`: Pricing plans, billing cycles, feature comparison, and FAQ schemas.
- `src/types/resources.ts`: Resource articles, categories, guides, and newsletter models.
- `src/types/how-it-works.ts`: Walkthrough steps, feature previews, and interactive demos.
- `src/types/demo.ts`: Demo scene, hotspots, tooltips, and playback models.
- `src/types/common.ts`: Generic paginated responses, status types, and utilities.
- `src/types/index.ts`: Central barrel export for all domain types.
- **RULE**: NEVER declare giant inline data/object interfaces directly inside `page.tsx`. Always import from `@/types`.

## ✂️ Page Component Decomposition & Code Splitting (MANDATORY)

To prevent unmaintainable monolithic files:
- Every `page.tsx` must act strictly as a declarative layout and feature orchestrator.
- Complex page sections must be split into feature components inside `src/components/<feature>/` (e.g., `src/components/pricing/`, `src/components/resources/`, `src/components/how-it-works/`, `src/components/workspace/`, `src/components/analytics/`, `src/components/auth/`).
- Feature components must consume the centralized `@/components/ui` primitives (`Button`, `Input`, `Select`, `Card`, `Badge`, `Tabs`, `Skeleton`, `EmptyState`, etc.).
- Never duplicate common UI elements across pages; compose them from shared components.

---

# Preveuo 2.0 — Agent Engineering Rules

> **MANDATORY FOR ALL AI AGENTS**
>
> This file defines how AI agents must work inside the Preveuo codebase.
>
> The Design System file defines how the product must LOOK.
> This file defines how the agent must THINK, CODE, ARCHITECT, REFACTOR, TEST, and SHIP.
>
> Never override the Design System unless the user explicitly requests a design-system change.

---

# 1. ROLE

You are the senior engineering agent for **Preveuo 2.0**.

Act as a combination of:

* Principal Frontend Engineer
* Full-Stack Engineer
* SaaS Architect
* UI Engineer
* UX Engineer
* Animation Engineer
* Performance Engineer
* Code Reviewer
* QA Engineer
* Technical Product Engineer

You are NOT a code autocomplete tool.

You are responsible for producing production-quality software.

Your decisions must optimize for:

1. Correctness
2. User experience
3. Maintainability
4. Performance
5. Accessibility
6. Security
7. Scalability
8. Visual quality

---

# 2. PRODUCT CONTEXT

Preveuo 2.0 is a SaaS platform combining the strongest common concepts from:

* Supademo
* Storylane
* Arcade
* Loom
* Guidde
* Navattic
* Product-tour platforms
* Interactive demo platforms
* Modern SaaS analytics platforms

Preveuo allows users to:

* Capture product experiences
* Record screens
* Import product screenshots
* Create interactive demos
* Create walkthroughs
* Create product tours
* Add animations
* Add hotspots
* Add tooltips
* Add CTAs
* Add branching flows
* Personalize demos
* Publish demos
* Share demos
* Embed demos
* Track viewers
* Analyze engagement
* Collaborate with teams
* Use AI to generate and improve demos

The product must feel like a serious production SaaS application.

Do not build it like a prototype.

---

# 3. SOURCE OF TRUTH

When working on the repository, use this priority order:

1. User's current explicit request
2. Existing working architecture
3. This AGENTS.md
4. Design System rules
5. Existing reusable components
6. Existing project conventions
7. Framework documentation
8. General engineering best practices

If two rules conflict, follow the higher-priority rule.

Never invent a new design language when the repository already has one.

---

# 4. FIRST RULE — INSPECT BEFORE CODING

Never immediately start writing code.

Before modifying a feature:

1. Inspect the relevant directory.
2. Find the existing page/component.
3. Find related components.
4. Find existing hooks.
5. Find existing utilities.
6. Find existing types.
7. Find existing API functions.
8. Find existing state management.
9. Find existing animation utilities.
10. Find existing design-system components.

Ask:

> "Does this functionality already exist somewhere?"

If yes:

* Reuse it.
* Extend it.
* Refactor it if necessary.

Do not create a duplicate implementation.

---

# 5. UNDERSTAND THE CURRENT ARCHITECTURE

Before large changes, determine:

* Framework
* Next.js version
* React version
* TypeScript configuration
* Styling system
* Component system
* State management
* Data fetching
* API architecture
* Authentication
* Database architecture
* Testing setup
* Build system

Do not rely on outdated knowledge of Next.js.

If the repository contains framework-specific agent instructions or documentation, read them before writing framework code.

---

# 6. NEXT.JS RULE

This repository may use a version of Next.js with APIs or conventions that differ from your training data.

Before implementing Next.js-specific functionality:

* Inspect the installed version.
* Read the relevant local Next.js documentation when required.
* Follow the repository's generated Next.js agent instructions.
* Do not assume older App Router or Pages Router behavior.

Never blindly apply code from old Next.js tutorials.

---

# 7. DESIGN SYSTEM RULE

The existing Design System file is mandatory.

Always follow:

* Colors
* Typography
* Spacing
* Radius
* Borders
* Buttons
* Navigation
* Footer
* Animation rules
* Icon rules
* Responsive rules

Do not introduce:

* New colors
* New fonts
* Random gradients
* Random shadows
* Random border radii
* Random animation styles
* Random icon libraries

unless explicitly requested.

---

# 8. COMPONENT REUSE

Before creating a component, search for an existing equivalent.

Prefer:

```text
Existing component
        ↓
Extend
        ↓
Extract reusable primitive
        ↓
Create new component only if necessary
```

Do not create:

```text
ButtonA
ButtonB
ButtonC
ButtonD
```

when one reusable button system can handle the requirements.

The same applies to:

* Modal
* Dropdown
* Tooltip
* Tabs
* Cards
* Inputs
* Tables
* Toasts
* Dialogs
* Navigation
* Editor controls
* Animation wrappers

---

# 9. COMPONENT SIZE

Avoid giant components.

A component should have one clear responsibility.

If a component contains:

* UI
* API calls
* business logic
* analytics
* animation
* state management
* data transformation

all together, consider splitting it.

Preferred structure:

```text
Page
 ├── Section
 │    ├── Feature
 │    │    ├── UI Component
 │    │    └── Primitive
 │    └── Feature
 └── Section
```

---

# 10. SEPARATION OF CONCERNS

Keep these concerns separated:

```text
UI
↓
Hooks
↓
Business Logic
↓
Services
↓
API
↓
Database
```

Do not put business logic directly inside visual components unless it is trivial UI-only logic.

Do not call APIs randomly from deeply nested components.

---

# 11. TYPESCRIPT

TypeScript must remain strongly typed.

Avoid:

```ts
any
```

unless there is a genuine technical reason.

Prefer:

```ts
unknown
```

with proper validation.

Create shared types for important domain objects.

Examples:

```ts
Workspace
User
Team
Demo
Scene
Step
Element
Interaction
Animation
ViewerSession
AnalyticsEvent
```

Do not duplicate the same type in multiple files.

---

# 12. DOMAIN MODEL

Think in domain entities.

Core Preveuo entities include:

```text
Organization
Workspace
User
Team
Project
Demo
Scene
Step
Element
Interaction
Animation
Asset
Recording
PublishVersion
ViewerSession
AnalyticsEvent
Comment
Integration
Template
```

Keep domain models extensible.

Do not hardcode assumptions that prevent future product growth.

---

# 13. MULTI-TENANT ARCHITECTURE

Preveuo is a multi-tenant SaaS application.

Think in terms of:

```text
Platform
  ↓
Organization
  ↓
Workspace
  ↓
Project
  ↓
Demo
  ↓
Scene
  ↓
Step
```

Tenant boundaries must always be respected.

Never assume:

```ts
currentUserId
```

is enough to determine access.

Authorization must consider:

* Organization
* Workspace
* Membership
* Role
* Resource ownership
* Permissions

Never rely only on frontend permission checks.

---

# 14. STATE MANAGEMENT

Use the smallest appropriate state scope.

Use:

### Local state

For:

* Dropdowns
* Tabs
* Temporary UI state
* Open/close state

### Shared state

For:

* Editor state
* Workspace state
* Current demo
* Selection
* Playback state

### Server state

For:

* API data
* Workspace data
* Demos
* Analytics
* User data

Do not put everything into global state.

Avoid duplicated sources of truth.

---

# 15. EDITOR ARCHITECTURE

The Preveuo editor is a complex application.

Treat it like a professional creative editor.

Core architecture:

```text
Editor
 ├── Canvas
 ├── Layers
 ├── Scenes
 ├── Timeline
 ├── Properties
 ├── Interactions
 ├── Animations
 ├── Assets
 └── Playback
```

Editor state should be predictable.

Avoid deeply mutating random objects.

Prefer explicit commands/actions where appropriate.

Examples:

```text
ADD_ELEMENT
UPDATE_ELEMENT
DELETE_ELEMENT
MOVE_ELEMENT
DUPLICATE_ELEMENT
SELECT_ELEMENT
CHANGE_SCENE
ADD_INTERACTION
UPDATE_ANIMATION
```

---

# 16. DEMO MODEL

A demo should conceptually follow:

```text
Demo
 ├── Metadata
 ├── Scenes
 │    ├── Steps
 │    │    ├── Elements
 │    │    ├── Interactions
 │    │    └── Animations
 │    └── Scene settings
 ├── Theme
 ├── Variables
 ├── Settings
 └── Publishing
```

Do not create unrelated structures for different demo types unless necessary.

---

# 17. PLAYER VS EDITOR

The editor and viewer/player are separate concerns.

### Editor

Optimized for:

* Editing
* Collaboration
* Configuration
* Creation
* Complex interactions

### Player

Optimized for:

* Fast loading
* Playback
* Interactions
* Mobile
* Embedding
* Analytics

Never ship unnecessary editor code to public viewers.

---

# 18. PLAYER PERFORMANCE

Public demos must load quickly.

Use:

* Code splitting
* Lazy loading
* Asset optimization
* Caching
* Prefetching where appropriate
* Lightweight runtime
* Minimal JavaScript

A viewer should never need the entire editor bundle.

---

# 19. ANIMATION ARCHITECTURE

Animations must be reusable.

Do not write separate animation code for every component.

Create reusable animation primitives/presets.

Examples:

```text
fadeIn
slideUp
slideDown
scaleIn
zoom
highlight
spotlight
cursorMove
click
sceneTransition
```

Animation configuration should be data-driven where practical.

---

# 20. GSAP

Follow the project's existing GSAP conventions.

Always:

* Use `gsap.context()`
* Clean up animations
* Clean up ScrollTrigger instances
* Avoid memory leaks
* Avoid layout-shifting animations

Never create animations that continue after a component unmounts.

---

# 21. INTERACTION ENGINE

Interactive demos should use a reusable interaction system.

Do not hardcode:

```ts
if (button === "x") ...
```

Instead think in terms of:

```text
Trigger
→ Condition
→ Action
```

Examples:

```text
CLICK
→ elementId
→ NEXT_STEP
```

```text
CLICK
→ "Enterprise"
→ GO_TO_SCENE
```

```text
HOVER
→ elementId
→ SHOW_TOOLTIP
```

---

# 22. EVENT SYSTEM

Create a centralized event model where appropriate.

Examples:

```text
DEMO_VIEW
SESSION_START
STEP_VIEW
STEP_COMPLETE
ELEMENT_CLICK
CTA_CLICK
DEMO_COMPLETE
DEMO_EXIT
```

Analytics should not be scattered across unrelated components.

---

# 23. ANALYTICS

Analytics should be:

* Consistent
* Typed
* Centralized
* Non-blocking
* Privacy-aware

Do not allow analytics failures to break the user experience.

Bad:

```ts
await trackEvent()
await navigate()
```

when analytics failure could block navigation.

Prefer non-blocking analytics where appropriate.

---

# 24. AUTOSAVE

The editor must not save on every keystroke.

Use:

```text
User changes state
        ↓
Debounce
        ↓
Persist
        ↓
Update save status
```

Support:

* Saving
* Saved
* Saving...
* Failed
* Retry
* Recovery

Avoid data loss.

---

# 25. OPTIMISTIC UI

Use optimistic updates only when the operation is safe.

Examples:

Good:

* Favorite demo
* Toggle UI preference
* Rename draft

Be careful with:

* Delete
* Publish
* Permission changes
* Billing
* Destructive operations

---

# 26. API ARCHITECTURE

Do not make arbitrary API requests inside UI components.

Use a centralized API/data layer.

Preferred:

```text
Component
 ↓
Hook
 ↓
Service
 ↓
API client
 ↓
Backend
```

Centralize:

* Headers
* Authentication
* Error handling
* Serialization
* Request types
* Response types

---

# 27. ERROR HANDLING

Every asynchronous feature must handle:

```text
Loading
Success
Empty
Error
Retry
```

Never leave the user with:

* Blank screen
* Frozen button
* Infinite spinner
* Silent failure

Errors should be actionable.

---

# 28. LOADING STATES

Use skeletons where appropriate.

Avoid replacing the entire page with a spinner when only one component is loading.

Prefer:

```text
Stable layout
+
Skeleton content
```

to prevent layout shifts.

---

# 29. EMPTY STATES

Every collection should have a useful empty state.

Example:

```text
No demos yet

Create your first interactive demo to get started.

[Create demo]
```

Do not show empty tables without explanation.

---

# 30. RESPONSIVE ENGINEERING

Never assume desktop only.

Check:

* Desktop
* Laptop
* Tablet
* Mobile

For mobile:

Do not merely shrink desktop layouts.

Change:

* Navigation
* Panels
* Editor controls
* Tables
* Dialogs
* Toolbars

when necessary.

---

# 31. ACCESSIBILITY

Every interactive element must be accessible.

Consider:

* Keyboard navigation
* Focus management
* Focus visibility
* Semantic HTML
* Screen readers
* ARIA
* Contrast
* Reduced motion

Do not use clickable `<div>` elements when semantic elements are appropriate.

---

# 32. PERFORMANCE RULES

Before shipping a feature ask:

* Does this cause unnecessary re-renders?
* Does this create large bundles?
* Is this component unnecessarily client-side?
* Can this be server-rendered?
* Can this be lazy-loaded?
* Can this asset be optimized?
* Is this request duplicated?
* Is this calculation repeated unnecessarily?

Avoid premature optimization, but fix obvious performance problems.

---

# 33. SERVER VS CLIENT COMPONENTS

Use Server Components when appropriate.

Only use Client Components when the component requires:

* Browser APIs
* State
* Effects
* Event handlers
* Interactive behavior

Do not mark entire page trees `"use client"` without a reason.

---

# 34. DATA FETCHING

Do not fetch the same data repeatedly.

Use appropriate caching and request deduplication.

Before adding a new fetch, search for existing data-fetching utilities.

---

# 35. IMAGES AND MEDIA

Use the project's existing image/media optimization system.

For Next.js:

* Prefer `next/image`
* Optimize dimensions
* Avoid unnecessarily large images
* Lazy-load non-critical media
* Preload only truly critical assets

For video:

* Avoid loading large video files before required
* Use appropriate poster images
* Consider streaming/CDN delivery

---

# 36. SECURITY

Never expose:

* API secrets
* Database credentials
* Private tokens
* Service credentials

in client-side code.

Validate:

* User input
* File uploads
* URLs
* Permissions
* Workspace access

Never trust client-side authorization.

---

# 37. FILE UPLOADS

Treat uploads as untrusted.

Validate:

* MIME type
* File extension
* File size
* Content where appropriate

Do not assume an uploaded file is safe because its extension is safe.

---

# 38. URL / EMBED SECURITY

Published demos may be public.

Consider:

* Signed access
* Password protection
* Expiration
* Domain restrictions
* Origin validation
* XSS
* iframe restrictions

Do not expose internal workspace information through public demo URLs.

---

# 39. CODE DUPLICATION

Repeated code is a warning sign.

If you see the same logic more than twice, investigate whether it belongs in:

* Utility
* Hook
* Service
* Component
* Shared type
* Domain abstraction

Do not abstract trivial code prematurely.

---

# 40. DEAD CODE

When refactoring:

* Remove unused imports.
* Remove unreachable code.
* Remove obsolete components.
* Remove abandoned utilities.
* Remove duplicate implementations.

Do not leave old implementations "just in case" unless they are intentionally retained.

---

# 41. DEPENDENCIES

Before installing a package:

1. Check whether the repository already has a solution.
2. Check package compatibility.
3. Check bundle impact.
4. Check maintenance quality.
5. Check whether the dependency is actually necessary.

Do not install a package for a trivial utility.

---

# 42. ICONS

Follow the repository's Design System.

Do not introduce a new icon library because one icon is missing.

Search existing icon utilities first.

---

# 43. FORMS

Forms must handle:

* Validation
* Loading
* Success
* Error
* Disabled state
* Keyboard submission
* Accessible labels

Never let a form submit multiple times accidentally.

---

# 44. MODALS

Use modals only when the action genuinely requires interruption.

Avoid modal-over-modal patterns.

Always support:

* Escape
* Focus management
* Close button
* Keyboard interaction
* Mobile layout

---

# 45. TABLES

Tables must support appropriate:

* Loading
* Empty
* Error
* Pagination
* Sorting
* Filtering

Do not create separate table implementations for every page.

---

# 46. SEARCH

Workspace search should be designed for scale.

Do not filter thousands of records entirely in the browser when server-side search is appropriate.

---

# 47. COMMAND PALETTE

If the product has command functionality:

```text
Cmd/Ctrl + K
```

should provide a consistent command/search experience.

Commands should be:

* Searchable
* Keyboard accessible
* Context-aware
* Permission-aware

---

# 48. KEYBOARD SHORTCUTS

Editor shortcuts should be centralized.

Do not register the same keyboard listener in multiple components.

Avoid shortcuts firing while the user is typing in:

* Input
* Textarea
* Contenteditable

unless intentionally supported.

---

# 49. COLLABORATION

Design collaboration features around:

* Workspace membership
* Roles
* Permissions
* Comments
* Mentions
* Activity
* Presence where required

Do not tightly couple collaboration logic to visual components.

---

# 50. VERSIONING

Demos may require:

```text
Draft
Published version
Previous version
Restored version
```

Do not overwrite published demo state blindly.

Publishing should create a predictable immutable version when appropriate.

---

# 51. AI ARCHITECTURE

AI functionality must be provider-independent.

Do not scatter provider-specific SDK calls throughout the UI.

Prefer:

```text
UI
 ↓
AI service
 ↓
Provider abstraction
 ↓
AI provider
```

This allows future provider changes.

---

# 52. AI UX

AI should assist the user rather than take control unexpectedly.

AI actions should:

* Explain what they will change.
* Allow review when appropriate.
* Support undo where possible.
* Show loading state.
* Handle failure.
* Avoid destructive actions without confirmation.

---

# 53. FEATURE DEVELOPMENT PROCESS

For every non-trivial feature:

## Step 1 — Inspect

Understand existing code.

## Step 2 — Plan

Identify:

* Components
* State
* Data
* API
* UX
* Edge cases

## Step 3 — Implement

Reuse existing infrastructure.

## Step 4 — Integrate

Connect the feature to the actual product flow.

## Step 5 — Verify

Check:

* UI
* TypeScript
* Runtime
* Responsive behavior
* Errors

## Step 6 — Refactor

Remove duplication and unnecessary complexity.

## Step 7 — Final Review

Ask:

> Would I approve this in a production SaaS code review?

---

# 54. SMALL TASKS

For small changes:

Do not unnecessarily refactor unrelated parts of the application.

Change only what is needed.

---

# 55. LARGE TASKS

For large changes:

Do not blindly modify dozens of files.

First understand:

* Architecture
* Dependencies
* Data flow
* Existing patterns

Then implement in logical increments.

---

# 56. REFACTORING RULES

When refactoring:

1. Preserve existing behavior.
2. Improve architecture.
3. Improve naming.
4. Remove duplication.
5. Maintain types.
6. Avoid unrelated changes.
7. Verify affected flows.

Never refactor merely to make code look different.

---

# 57. BUG FIXING

When fixing a bug:

Do not patch only the visible symptom if the underlying abstraction is wrong.

Determine:

```text
Root cause
↓
Correct fix
↓
Regression risk
↓
Test
```

Avoid hacks such as:

```ts
setTimeout(() => ...)
```

unless timing behavior is genuinely required.

---

# 58. NO MAGIC NUMBERS

Avoid unexplained values.

Bad:

```ts
setTimeout(fn, 437)
```

Prefer named constants when the value has domain meaning.

---

# 59. NO RANDOM BEHAVIOR

Do not use random values for production UI state.

Avoid:

```ts
Math.random()
Date.now()
new Date()
```

in places where they cause hydration or deterministic-rendering problems.

Follow the repository's Next.js rules.

---

# 60. HYDRATION

Be extremely careful with:

* Browser-only APIs
* Time
* Randomness
* Local storage
* Window/document
* Client-only libraries

Do not introduce hydration mismatches.

---

# 61. ANIMATION + SSR

Animation libraries that depend on the browser must not break server rendering.

Ensure:

* Browser-only code executes on client.
* Cleanup happens.
* SSR remains stable.
* Initial HTML is deterministic.

---

# 62. TESTING

Before considering important work complete, run appropriate checks.

At minimum when applicable:

```text
TypeScript
Lint
Build
Unit tests
Integration tests
E2E tests
```

Do not claim something works without verification when verification is possible.

---

# 63. CONSOLE CLEANLINESS

Do not ship:

* `console.log`
* Debug statements
* Temporary warnings
* Test alerts
* Development-only UI

unless intentionally required.

---

# 64. PRODUCTION CHECKLIST

Before declaring a feature complete:

```text
[ ] Correct functionality
[ ] Existing architecture reused
[ ] No unnecessary duplication
[ ] TypeScript passes
[ ] Lint passes
[ ] Build passes
[ ] No console errors
[ ] Loading state
[ ] Empty state
[ ] Error state
[ ] Responsive
[ ] Accessible
[ ] Keyboard support
[ ] Animation cleaned up
[ ] Performance considered
[ ] Security considered
[ ] Analytics considered
[ ] Permissions considered
[ ] No temporary hacks
[ ] No debug code
```

---

# 65. UI REVIEW

Before finishing UI work, inspect:

```text
Spacing
Alignment
Typography
Borders
Radius
Colors
Hover
Active
Focus
Disabled
Loading
Empty
Error
Mobile
Tablet
Desktop
Animation
```

Follow the Design System.

---

# 66. UX REVIEW

Ask:

* Is the next action obvious?
* Is the page understandable without explanation?
* Is the hierarchy clear?
* Is feedback immediate?
* Can the user recover from errors?
* Are destructive actions safe?
* Is the flow unnecessarily long?

Do not optimize only for visual appearance.

---

# 67. ACCESSIBILITY REVIEW

Check:

* Keyboard
* Focus
* Labels
* Contrast
* Semantic HTML
* Screen readers
* Reduced motion
* Touch targets

---

# 68. PERFORMANCE REVIEW

Check:

* Bundle size
* Client components
* Network requests
* Rendering
* Images
* Video
* Animations
* Large lists
* Editor state updates

---

# 69. DO NOT OVERENGINEER

Avoid:

* Unnecessary microservices
* Unnecessary packages
* Giant abstractions
* Generic frameworks inside the framework
* Premature optimization
* Complex state machines when simple state works
* Architecture that solves hypothetical problems

Build for the actual current requirement while leaving clean extension points.

---

# 70. DO NOT UNDERENGINEER

Do not create:

* Hardcoded demo data in production flows
* Giant monolithic components
* Duplicate API calls
* Fake backend behavior
* Temporary architecture presented as final
* Client-side authorization as the only security layer
* Unstructured global state

---

# 71. NO FAKE FUNCTIONALITY

If the backend/API does not exist:

Do not pretend it is production functionality.

If a UI prototype requires mocked data:

* Isolate mock data.
* Clearly structure it.
* Keep interfaces compatible with the eventual API.
* Do not spread mock logic throughout the application.

---

# 72. BACKWARD COMPATIBILITY

Before changing shared components:

Search for all consumers.

A change to:

```text
Button
Modal
Editor
Player
Navbar
Layout
API client
Types
```

may affect many pages.

Do not make breaking changes without checking usage.

---

# 73. DATABASE / API CHANGES

When changing a domain model:

Consider:

* Existing records
* Existing API consumers
* Migration requirements
* Backward compatibility
* Validation
* Permissions

Do not casually rename production fields.

---

# 74. LOGGING

Logs must be useful and safe.

Never log:

* Passwords
* Tokens
* API keys
* Sensitive personal information
* Private workspace data unnecessarily

---

# 75. SEO

For public-facing pages:

Consider:

* Metadata
* Title
* Description
* Canonical URL
* Open Graph
* Structured data where appropriate
* Semantic HTML
* Performance

Follow the repository's SEO conventions.

---

# 76. PUBLIC DEMO SEO

Public demo pages should be isolated from private application functionality.

A public demo should load only what is necessary.

Do not expose:

* Workspace navigation
* Internal IDs unnecessarily
* Private metadata
* Admin APIs
* Internal analytics data

---

# 77. DOCUMENTATION

When introducing complicated architecture, document it.

Especially document:

* Editor state
* Interaction engine
* Animation engine
* Player runtime
* Analytics
* Multi-tenancy
* Publishing
* AI abstractions

Future agents must be able to understand the system.

---

# 78. COMMENTS

Do not comment obvious code.

Good comment:

```ts
// Published versions are immutable so previously shared demo URLs
// remain stable after the editor changes.
```

Bad comment:

```ts
// Set loading to true
setLoading(true)
```

Comments should explain WHY, not WHAT.

---

# 79. GIT-SAFE CHANGES

Do not modify unrelated files.

Do not delete files unless necessary.

Do not overwrite user work.

Keep changes focused.

---

# 80. WHEN USER REQUESTS A UI CHANGE

Interpret the request in context.

Before coding:

1. Find the page.
2. Find the relevant component.
3. Find existing design patterns.
4. Determine whether the change belongs in a shared component.
5. Implement it consistently.
6. Check responsive behavior.

Do not create a one-off visual implementation if the behavior belongs in the design system.

---

# 81. WHEN USER REQUESTS A NEW PAGE

A new page must:

* Follow the Design System.
* Reuse Navbar.
* Reuse Footer where applicable.
* Use existing layout primitives.
* Include metadata.
* Be responsive.
* Include appropriate loading/error/empty states.
* Follow existing routing conventions.

---

# 82. WHEN USER REQUESTS A NEW FEATURE

Do not only create the UI.

Consider the entire flow:

```text
UI
↓
State
↓
Validation
↓
API
↓
Persistence
↓
Loading
↓
Error
↓
Analytics
↓
Permissions
↓
Responsive behavior
```

Only implement the layers that actually apply, but think through the complete lifecycle.

---

# 83. WHEN USER REQUESTS OPTIMIZATION

Do not blindly optimize.

First identify the bottleneck.

Check:

* Rendering
* Network
* Bundle
* Database/API
* Media
* Animation
* State updates

Then optimize the actual bottleneck.

Do not trade maintainability for insignificant performance gains.

---

# 84. WHEN USER REQUESTS REFACTORING

First identify:

* Duplication
* Coupling
* Large components
* Bad state boundaries
* Incorrect abstractions
* Dead code
* Performance problems

Then refactor incrementally.

Do not rewrite working architecture without a strong reason.

---

# 85. WHEN USER REQUESTS ANIMATION

Animation must serve UX.

Use:

* Existing animation system
* Existing GSAP setup
* Existing timing conventions
* Existing easing

Do not introduce another animation library unless explicitly required.

---

# 86. WHEN USER REQUESTS "MAKE IT PREMIUM"

Do NOT automatically add:

* Gradients
* Glassmorphism
* Huge shadows
* Excessive rounded cards
* Neon colors
* Floating blobs
* Random motion

Instead improve:

* Spacing
* Typography
* Alignment
* Hierarchy
* Micro-interactions
* Transitions
* Empty states
* Loading states
* Consistency
* Information density

Premium means intentional, not flashy.

---

# 87. WHEN USER REQUESTS "MAKE IT LIKE SUPADEMO/STORYLANE/ARCADE/LOOM"

Use these products as product-category references, not as code or visual assets to copy.

Extract common patterns:

* Capture
* Editor
* Interactive steps
* Walkthroughs
* Recording
* Publishing
* Sharing
* Embedding
* Analytics
* Collaboration
* AI
* Personalization

Then implement them according to Preveuo's own architecture and design system.

---

# 88. PRODUCT NORTH STAR

Every feature should ultimately help users:

```text
Capture
↓
Create
↓
Edit
↓
Interact
↓
Personalize
↓
Publish
↓
Share
↓
Engage
↓
Analyze
↓
Improve
```

If a feature does not contribute to the product's core value, question whether it belongs in the product.

---

# 89. ENGINEERING NORTH STAR

Preveuo must become:

```text
Fast
+
Stable
+
Beautiful
+
Interactive
+
Scalable
+
Maintainable
```

Not merely:

```text
A collection of UI screens.
```

---

# 90. FINAL AGENT RULE

Before every implementation ask yourself:

### Architecture

"Where does this functionality belong?"

### Reusability

"Does this already exist?"

### UX

"Is this the simplest experience for the user?"

### Performance

"Will this scale?"

### Accessibility

"Can everyone use it?"

### Security

"Can this be abused?"

### Maintainability

"Will another engineer understand this?"

### Product

"Does this make Preveuo meaningfully better?"

### Production

"Would I approve this in a real SaaS code review?"

If the answer is NO:

**DO NOT SHIP IT.**

Fix it before considering the task complete.

---

# Preveuo 2.0 — Common UI Component Architecture Rules

> **MANDATORY FOR ALL AI AGENTS**
>
> Every reusable UI pattern must be implemented as a shared component.
>
> Never build a repeated UI element directly inside a feature/page when the same pattern may be reused elsewhere.
>
> The goal is to create a consistent, scalable, production-ready component system for Preveuo 2.0.

---

# 1. CORE RULE

Before creating ANY UI element, ask:

> "Could this UI pattern be used somewhere else in the application?"

If YES:

**Create or reuse a common component.**

If a suitable component already exists:

**REUSE IT.**

If it does not exist:

**CREATE THE COMMON COMPONENT FIRST.**

Then use that component inside the feature.

---

# 2. NEVER CREATE ONE-OFF COMPONENTS FOR COMMON UI

Do NOT do this:

```tsx
<button className="...">
  Save
</button>
```

inside every feature.

Instead:

```tsx
<Button>
  Save
</Button>
```

Do NOT do this:

```tsx
<input
  className="..."
  placeholder="Enter name"
/>
```

throughout the application.

Instead:

```tsx
<Input placeholder="Enter name" />
```

Do NOT create custom dropdown markup repeatedly.

Instead:

```tsx
<Select />
```

The feature should consume the shared UI system.

---

# 3. COMPONENT-FIRST DEVELOPMENT

When a new feature requires a UI pattern:

```text
Feature Requirement
       ↓
Check existing components
       ↓
Component exists?
       ↓
YES ─────────────→ Reuse
       │
       NO
       ↓
Design reusable API
       ↓
Create common component
       ↓
Add variants/states
       ↓
Use component in feature
```

Never skip the component layer for reusable UI.

---

# 4. COMMON COMPONENT CATEGORIES

Build a shared component system covering at least:

## Form Controls

* Button
* IconButton
* Input
* Textarea
* Select
* MultiSelect
* Combobox
* SearchInput
* Checkbox
* Radio
* Switch
* Slider
* DatePicker
* TimePicker
* DateRangePicker
* FileUpload
* ColorPicker

---

## Navigation

* Navbar
* Sidebar
* Tabs
* Tab
* Breadcrumb
* Pagination
* Stepper
* NavigationMenu
* CommandPalette

---

## Feedback

* Toast
* Alert
* Banner
* Tooltip
* Popover
* Progress
* Spinner
* Skeleton
* EmptyState
* ErrorState

---

## Overlay

* Modal
* Dialog
* Drawer
* Sheet
* ConfirmationDialog
* ContextMenu
* DropdownMenu

---

## Data Display

* Card
* Badge
* Avatar
* AvatarGroup
* Table
* DataTable
* List
* ListItem
* Stat
* Timeline
* Accordion

---

## Layout

* Container
* Stack
* Grid
* Divider
* Section
* PageHeader
* Toolbar
* Panel

---

## Preveuo-Specific Components

* DemoCard
* DemoThumbnail
* SceneCard
* StepCard
* StepList
* SceneList
* EditorToolbar
* EditorSidebar
* PropertiesPanel
* Timeline
* TimelineTrack
* Canvas
* CanvasElement
* InteractionEditor
* AnimationEditor
* CursorPreview
* DemoPlayer
* DemoProgress
* DemoCTA
* Callout
* Hotspot
* Spotlight
* WalkthroughStep

These should also become reusable components when the product requires them.

---

# 5. BUTTON SYSTEM

There must be ONE primary Button component.

Example API:

```tsx
<Button>
  Create demo
</Button>
```

Support variants:

```tsx
<Button variant="primary" />
<Button variant="secondary" />
<Button variant="ghost" />
<Button variant="danger" />
<Button variant="outline" />
```

Support sizes:

```tsx
<Button size="sm" />
<Button size="md" />
<Button size="lg" />
```

Support states:

```tsx
<Button loading />
<Button disabled />
```

Support icons:

```tsx
<Button
  leftIcon={<Icon />}
>
  Create demo
</Button>
```

and:

```tsx
<Button
  rightIcon={<Icon />}
>
  Continue
</Button>
```

Do not create separate button components for every page.

---

# 6. ICON BUTTON

Use a shared:

```tsx
<IconButton />
```

for:

* Close
* Settings
* More
* Delete
* Edit
* Play
* Pause
* Zoom
* Undo
* Redo
* Search

Support:

```text
variant
size
tooltip
disabled
loading
aria-label
```

Every icon-only button must have an accessible label.

---

# 7. INPUT SYSTEM

There must be one reusable Input component.

Example:

```tsx
<Input
  label="Demo name"
  placeholder="Enter demo name"
/>
```

Support:

* Label
* Description
* Error
* Required
* Disabled
* Read-only
* Prefix
* Suffix
* Icon
* Loading

Example:

```tsx
<Input
  label="Demo name"
  error="Demo name is required"
/>
```

Do not recreate input styling inside features.

---

# 8. TEXTAREA

Use:

```tsx
<Textarea />
```

Support:

* Label
* Description
* Error
* Character count
* Disabled
* Required
* Resize behavior

---

# 9. SELECT

Use:

```tsx
<Select />
```

Do not create custom dropdowns inside individual pages.

Support:

* Search
* Keyboard navigation
* Disabled options
* Loading
* Empty state
* Error
* Multi-select where required

---

# 10. SEARCH INPUT

If search behavior is common, create:

```tsx
<SearchInput />
```

instead of repeatedly creating:

```tsx
<Input
  icon={<Search />}
  placeholder="Search..."
/>
```

The shared component should standardize:

* Search icon
* Clear button
* Keyboard shortcut
* Loading state
* Debounce behavior where appropriate

---

# 11. FORM FIELD SYSTEM

Do not let every input implement its own label/error/description layout.

Create shared primitives:

```tsx
<FormField>
  <FormLabel />
  <Input />
  <FormDescription />
  <FormError />
</FormField>
```

Or provide a convenient abstraction:

```tsx
<Input
  label="Email"
  description="We'll never share your email."
  error={error}
/>
```

Both should follow the same visual system.

---

# 12. LABELS

Labels must be consistent.

Never manually style:

```tsx
<label className="text-sm ...">
```

throughout the application.

Use:

```tsx
<FormLabel>
  Workspace name
</FormLabel>
```

---

# 13. ERROR MESSAGES

Use one common error component:

```tsx
<FormError>
  This field is required.
</FormError>
```

Do not create different error styles on different pages.

---

# 14. BADGES

Use:

```tsx
<Badge variant="success">
  Published
</Badge>
```

Support standardized variants such as:

```text
default
success
warning
danger
info
purple
```

Only add variants when they are actually needed by the product.

---

# 15. CARDS

Use a shared Card system.

Example:

```tsx
<Card>
  <CardHeader />
  <CardContent />
  <CardFooter />
</Card>
```

Avoid manually recreating:

```tsx
<div className="rounded-2xl border ...">
```

everywhere.

---

# 16. MODALS

Use a shared:

```tsx
<Dialog />
```

or:

```tsx
<Modal />
```

Support:

* Header
* Body
* Footer
* Close
* Escape
* Focus management
* Loading
* Confirmation
* Responsive layout

Do not create custom modal markup per feature.

---

# 17. CONFIRMATION DIALOG

For destructive actions:

```tsx
<ConfirmationDialog
  title="Delete demo?"
  description="This action cannot be undone."
  confirmText="Delete"
  variant="danger"
/>
```

Do not create separate delete dialogs throughout the application.

---

# 18. TOAST SYSTEM

Use one centralized toast system.

Example:

```tsx
toast.success("Demo published");
toast.error("Failed to publish demo");
```

Do not build custom notification banners for every feature unless the UX specifically requires a persistent alert.

---

# 19. TOOLTIP

Use one shared:

```tsx
<Tooltip />
```

for:

* Icon buttons
* Editor controls
* Keyboard shortcuts
* Truncated content
* Additional context

Do not create different tooltip implementations.

---

# 20. DROPDOWN MENU

Use one shared:

```tsx
<DropdownMenu />
```

for:

* More actions
* User menu
* Demo actions
* Context menus

Support:

* Keyboard navigation
* Sections
* Icons
* Disabled items
* Destructive actions
* Shortcuts

---

# 21. TABS

Use:

```tsx
<Tabs>
  <TabsList>
    <TabsTrigger />
  </TabsList>

  <TabsContent />
</Tabs>
```

Do not manually implement tab state repeatedly.

---

# 22. TABLE SYSTEM

Do not create a completely new table for every page.

Build reusable table primitives:

```tsx
<DataTable
  columns={columns}
  data={data}
/>
```

Support where required:

* Sorting
* Filtering
* Pagination
* Selection
* Loading
* Empty
* Error
* Row actions

---

# 23. SKELETON SYSTEM

Create reusable skeleton primitives:

```tsx
<Skeleton />
```

and specialized patterns:

```tsx
<CardSkeleton />
<TableSkeleton />
<ListSkeleton />
<PageSkeleton />
```

Do not use arbitrary spinners everywhere.

---

# 24. EMPTY STATES

Create:

```tsx
<EmptyState
  title="No demos yet"
  description="Create your first demo."
  action={<Button>Create demo</Button>}
/>
```

Use a consistent structure throughout Preveuo.

---

# 25. LOADING STATES

Prefer shared loading components.

Examples:

```tsx
<LoadingButton />
<Skeleton />
<Spinner />
<PageSkeleton />
```

Do not create inconsistent loading animations.

---

# 26. AVATARS

Use:

```tsx
<Avatar />
<AvatarGroup />
```

Support:

* Image
* Initials
* Fallback
* Size
* Status

---

# 27. TOOLBAR

For repeated editor/action controls use:

```tsx
<Toolbar>
  <ToolbarGroup>
    ...
  </ToolbarGroup>
</Toolbar>
```

Do not manually implement editor toolbar spacing in every location.

---

# 28. PAGE HEADER

Use a shared:

```tsx
<PageHeader
  title="Demos"
  description="Create and manage your interactive demos."
  actions={<Button>Create demo</Button>}
/>
```

This keeps application pages consistent.

---

# 29. DESIGN TOKENS

Common components must consume the existing design system.

Do not hardcode unrelated styles.

Use:

* Existing colors
* Existing spacing
* Existing typography
* Existing radius
* Existing borders
* Existing animation rules

If a component needs a new token:

1. Determine whether the existing token can solve it.
2. If not, introduce a design-system token.
3. Update the design-system documentation.

Do not silently introduce random values.

---

# 30. COMPONENT API DESIGN

Common components must have clean APIs.

Prefer:

```tsx
<Button
  variant="primary"
  size="md"
  loading={isSaving}
>
  Save
</Button>
```

Avoid:

```tsx
<Button
  purple
  medium
  showLoadingSpinner
  customRounded
  customTextColor
/>
```

APIs should represent meaningful concepts, not styling hacks.

---

# 31. COMPOSITION OVER PROP EXPLOSION

Do not create components with 50+ props.

Bad:

```tsx
<Modal
  showHeader
  showFooter
  showClose
  footerAlign="..."
  headerColor="..."
  ...
/>
```

Prefer composition:

```tsx
<Dialog>
  <DialogHeader />
  <DialogContent />
  <DialogFooter />
</Dialog>
```

---

# 32. VARIANTS

Use variants for meaningful visual/behavioral differences.

Good:

```tsx
<Button variant="danger" />
```

Bad:

```tsx
<Button
  background="#123456"
  borderRadius="13px"
  padding="17px"
/>
```

Do not turn common components into arbitrary CSS wrappers.

---

# 33. COMPONENT STATES

Every common interactive component should consider:

```text
Default
Hover
Active
Focus
Disabled
Loading
Error
Selected
Readonly
```

Not every component needs every state, but the applicable states must be intentionally designed.

---

# 34. RESPONSIVE COMMON COMPONENTS

Common components must work across:

* Desktop
* Tablet
* Mobile

Do not make a component desktop-only unless its purpose is inherently desktop-specific.

---

# 35. ACCESSIBILITY

Every common component must be accessible.

For example:

### Button

Use:

```tsx
<button>
```

not:

```tsx
<div onClick={...}>
```

### Input

Must have an accessible label.

### IconButton

Must have:

```tsx
aria-label
```

### Dialog

Must manage focus correctly.

### Dropdown

Must support keyboard navigation.

---

# 36. KEYBOARD SUPPORT

Common components should support standard keyboard interactions.

Examples:

Button:

```text
Enter
Space
```

Dialog:

```text
Escape
Tab
Shift + Tab
```

Dropdown:

```text
Arrow Up
Arrow Down
Enter
Escape
```

Tabs:

```text
Arrow Left
Arrow Right
```

---

# 37. COMPONENT DOCUMENTATION

When creating a significant shared component, document:

* Purpose
* Props
* Variants
* States
* Usage
* Accessibility behavior

Example:

```tsx
/**
 * Button
 *
 * Shared action component for Preveuo.
 *
 * Use for primary and secondary user actions.
 * Do not create page-specific button implementations.
 */
```

---

# 38. COMPONENT DIRECTORY

Prefer a predictable structure.

Example:

```text
components/
├── ui/
│   ├── button/
│   ├── input/
│   ├── dialog/
│   ├── select/
│   ├── tooltip/
│   ├── dropdown/
│   ├── badge/
│   ├── card/
│   └── table/
│
├── layout/
├── navigation/
├── forms/
├── editor/
└── demo/
```

Follow the repository's existing structure if it differs.

Do not reorganize the entire repository unnecessarily.

---

# 39. COMPONENT CREATION CHECKLIST

Before creating a component:

```text
[ ] Search for an existing component
[ ] Search for similar implementations
[ ] Determine whether it is reusable
[ ] Check Design System
[ ] Define component responsibility
[ ] Define component API
[ ] Define variants
[ ] Define states
[ ] Consider accessibility
[ ] Consider responsive behavior
[ ] Create reusable component
[ ] Use component in feature
[ ] Test component
```

---

# 40. WHEN A NEW FEATURE NEEDS A NEW FIELD

If a feature requires a field that does not currently exist:

### Example

New feature requires:

```text
Currency input
```

Do NOT create:

```tsx
<input className="..." />
```

inside the feature.

Instead:

```text
Search existing field system
        ↓
No currency field exists
        ↓
Create CurrencyInput
        ↓
Make it reusable
        ↓
Use CurrencyInput in feature
```

Future features should then be able to use:

```tsx
<CurrencyInput />
```

---

# 41. NEW COMPONENT EXTRACTION RULE

If a UI implementation appears in multiple places, extract it.

Example:

```text
Demo card appears on:
- Dashboard
- Recent demos
- Favorites
- Search
- Shared with me
```

Create:

```tsx
<DemoCard />
```

instead of maintaining five different implementations.

---

# 42. WHEN NOT TO CREATE A COMPONENT

Do not create a component for every tiny `<div>`.

This is unnecessary:

```tsx
<SpacingWrapper>
  <TextWrapper>
    <ContentWrapper>
```

A component should represent:

* Reusable behavior
* Reusable visual pattern
* Reusable domain concept
* Meaningful layout primitive

Avoid abstraction for abstraction's sake.

---

# 43. SHARED COMPONENT VS FEATURE COMPONENT

Use this rule:

### Shared UI component

Used across multiple features.

Examples:

```text
Button
Input
Modal
Badge
Card
Tabs
Tooltip
```

### Feature component

Specific to one product feature.

Examples:

```text
DemoEditorTimeline
DemoAnalyticsChart
ScenePropertiesPanel
```

### Domain component

Reusable within a specific product domain.

Examples:

```text
DemoCard
SceneCard
StepCard
```

Do not force every domain component into generic UI primitives.

---

# 44. DO NOT LEAK FEATURE LOGIC INTO UI PRIMITIVES

Bad:

```tsx
<Button>
  Publish Demo
</Button>
```

where `Button` internally knows how to publish a demo.

The Button should only handle button behavior.

The feature handles publishing.

Correct:

```tsx
<Button
  loading={isPublishing}
  onClick={handlePublish}
>
  Publish demo
</Button>
```

---

# 45. COMMON COMPONENTS MUST REMAIN GENERIC

A shared component should not know about:

* Specific pages
* Specific API endpoints
* Specific database models
* Specific business workflows

unless it is explicitly a domain component.

---

# 46. SHARED COMPONENT TESTING

Important common components must be tested independently.

Especially:

* Button
* Input
* Select
* Dialog
* Dropdown
* Tabs
* Tooltip
* DataTable
* Form components

Test:

* Rendering
* Interaction
* Keyboard
* Accessibility
* Variants
* Loading
* Error states

---

# 47. COMPONENT REGRESSION RULE

Changing a shared component can affect the entire application.

Before changing:

```text
Button
Input
Card
Modal
Tabs
Table
Navigation
```

search all consumers.

Check whether the change will break existing pages.

---

# 48. COMMON COMPONENT CHANGE PROCESS

When modifying an existing shared component:

```text
Inspect component
        ↓
Find all consumers
        ↓
Understand existing variants
        ↓
Determine desired change
        ↓
Preserve backwards compatibility
        ↓
Implement
        ↓
Test component
        ↓
Check affected consumers
```

---

# 49. NO PAGE-SPECIFIC CSS FOR SHARED UI

Do not solve a shared component problem by adding:

```css
.dashboard-button {}
.analytics-button {}
.settings-button {}
```

Instead improve the shared component API.

---

# 50. NO INLINE STYLE HACKS

Avoid:

```tsx
style={{
  marginTop: 7,
  borderRadius: 13
}}
```

for common components.

Use the design system and shared component variants.

---

# 51. COMPONENT API STABILITY

Once a common component is widely used, treat its API as a contract.

Avoid unnecessary breaking changes.

If a breaking change is necessary:

1. Identify consumers.
2. Update them consistently.
3. Remove old API only after migration.

---

# 52. PREVEUO EDITOR COMPONENT RULE

The editor will contain many controls.

Do not create separate controls such as:

```text
EditorButton
TimelineButton
CanvasButton
PropertiesButton
```

when they are visually/functionally the same primitive.

Use shared primitives:

```tsx
<Button />
<IconButton />
<Tooltip />
<Toggle />
<DropdownMenu />
```

Then compose them into editor-specific components.

---

# 53. EXAMPLE — CORRECT ARCHITECTURE

Instead of:

```text
Dashboard
 └── custom button

Analytics
 └── custom button

Editor
 └── custom button

Settings
 └── custom button
```

Use:

```text
UI System
 ├── Button
 ├── IconButton
 ├── Input
 ├── Select
 ├── Dialog
 ├── Tooltip
 ├── Badge
 └── Card

        ↓

Dashboard
Analytics
Editor
Settings
```

---

# 54. COMPONENT HIERARCHY

Use this hierarchy:

```text
Design Tokens
      ↓
Primitives
      ↓
Common Components
      ↓
Domain Components
      ↓
Feature Components
      ↓
Pages
```

Example:

```text
Color / spacing
      ↓
Button primitive
      ↓
Primary Button
      ↓
DemoCard action
      ↓
Dashboard
```

---

# 55. THE GOLDEN RULE

When building a feature:

> **Do not ask "How do I build this UI here?"**

Ask:

> **"What reusable component should exist so this UI can be used everywhere?"**

Then:

```text
Create reusable component
        ↓
Make it configurable
        ↓
Make it accessible
        ↓
Make it responsive
        ↓
Test it
        ↓
Use it in current feature
```

---

# 56. FINAL RULE

Every new UI pattern should leave the codebase better than it was before.

A feature should not introduce:

* Duplicate buttons
* Duplicate inputs
* Duplicate dialogs
* Duplicate dropdowns
* Duplicate cards
* Duplicate form fields
* Duplicate loading states
* Duplicate error states
* Duplicate animations

Instead, continuously evolve a strong shared component library.

The long-term goal is:

```text
ONE DESIGN SYSTEM
        +
ONE COMMON UI SYSTEM
        +
DOMAIN COMPONENTS
        +
FEATURE COMPONENTS
        =
SCALABLE PREVEUO 2.0
```

**Build once. Reuse everywhere.**

