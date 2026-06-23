# Branding

## Identity

All app identity strings live in `constants/branding.ts`:

```ts
export const APP_BRAND = {
  name: "Acme",
  tagline: "Control Center",
  description: "Admin Back Office",
  logo: "/logo.svg",
} as const;
```

To rebrand, update this object and replace `public/logo.svg`. Every component
that displays the app name, tagline, or logo reads from `APP_BRAND` — no
find-and-replace needed.

## Theme colours

Colours are CSS custom properties in `app/globals.css`, defined in `:root`
(light) and `.dark` (dark mode).

### Key variables to change

| Variable | Controls | Default |
|----------|----------|---------|
| `--primary` | Buttons, links, active states, sidebar accent | Green (`oklch(0.6234 0.1681 147.3)`) |
| `--accent` | Accent highlights | Same as primary |
| `--ring` | Focus rings | Same as primary |
| `--secondary` | Secondary backgrounds/badges | Light green tint |
| `--sidebar` | Sidebar background | Dark green (`oklch(0.2224 0.0371 150.91)`) |
| `--sidebar-primary` | Active sidebar item | Same as primary |
| `--destructive` | Delete/error actions | Red |
| `--chart-1` through `--chart-5` | Chart/graph colours | Green scale |

The `--sidebar-*` variables control the dark sidebar independently from the
main content area.

### Changing the brand colour

To switch from green to e.g. blue, replace the oklch hue angle (`147.3`) with
your target hue across all `--primary`, `--accent`, `--ring`, `--sidebar-*`,
and `--chart-*` variables in both `:root` and `.dark` blocks.

The sidebar active-item styles in the `@layer utilities` block also reference
the primary colour directly — update `.sidebar-menu-item-active` and
`.sidebar-scrollbar` to match.

### Other theme values

| Variable | Purpose |
|----------|---------|
| `--radius` | Base border radius (`0.5rem`), all other radii derive from it |
| `--app-background` | Page background behind cards (`#f1f5f9` — slate-100) |
| `--border` / `--input` | Border colours for inputs and dividers |
| `--muted` / `--muted-foreground` | Subdued text and backgrounds |
