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

---

# 57. FEATURE & FUNCTIONALITY-WISE INTERFACE ARCHITECTURE

All TypeScript interfaces and object models MUST be organized into dedicated feature- and functionality-wise modules under `src/types/`:
- `src/types/auth.ts`: Authentication, credentials, sessions, and SSO types.
- `src/types/workspace.ts`: Workspaces, members, roles, categories, and project models.
- `src/types/analytics.ts`: Leads, drop-off funnels, and engagement metrics.
- `src/types/pricing.ts`: Pricing plans, billing cycles, features, and FAQ schemas.
- `src/types/resources.ts`: Articles, categories, and newsletters.
- `src/types/how-it-works.ts`: Walkthrough steps, previews, and interactive demos.
- `src/types/demo.ts`: Demo scenes, steps, hotspots, and analytics.
- `src/types/common.ts`: Generic paginated responses and action states.
- `src/types/index.ts`: Central barrel export for all domain types.

**RULE**: Never define monolithic domain interfaces inside `page.tsx` files. Always declare them in `src/types/` and import via `@/types`.

---

# 58. PAGE COMPONENT DECOMPOSITION & CODE SPLITTING

Pages (`page.tsx`) must never be giant monolithic files containing thousands of lines of markup, forms, and states.

Follow this decomposition rule:
1. `page.tsx` is an orchestrator: loads data/state, imports layout (`Navbar`, `Footer`), and renders modular section components.
2. Section/feature components live in `src/components/<feature>/` (e.g., `src/components/pricing/`, `src/components/resources/`, `src/components/how-it-works/`, `src/components/workspace/`, `src/components/analytics/`, `src/components/auth/`).
3. Every feature component consumes the shared `@/components/ui` primitives (`Button`, `Input`, `Select`, `Card`, `Badge`, `Tabs`, `Skeleton`, `EmptyState`, etc.).

