# Routes & Sidebar

All route paths and sidebar navigation are defined in `constants/index.ts`.

## ROUTES

A single `const` object that maps logical names to URL strings. Reference
`ROUTES.X` everywhere — never hardcode a path string in `<Link href>`,
`router.push`, or `redirect`.

```ts
export const ROUTES = {
  HOME: "/",
  LOGIN: "/auth/login",
  DASHBOARD: "/dashboard",
  USERS: "/users",
  SETTINGS: "/settings",
} as const;
```

When adding a new feature, add its path here first.

## Sidebar config

`sidebarItems` is an array of `SidebarItem` entries. An item is either:

- **Standalone** (`SidebarMenuConfig`) — has `title`, `url`, `icon`. Renders as
  a single link in the sidebar.
- **Group** (`SidebarGroupConfig`) — has `title`, an `items` array, and an
  optional `defaultOpen`. Renders as a collapsible section.

```ts
// Standalone
{ title: "Dashboard", url: ROUTES.DASHBOARD, icon: LayoutGrid }

// Group
{
  title: "Management",
  defaultOpen: true,
  items: [
    { title: "Users", url: ROUTES.USERS, icon: Users },
  ],
}
```

Use `isSidebarGroup(item)` to type-narrow when iterating.

## Adding a new route

1. Add the path to `ROUTES`.
2. Add a sidebar entry (standalone or inside a group) in `sidebarItems`.
3. Create `app/(routes)/<route>/page.tsx` — a thin page that renders a container
   component from `components/<feature>/`.
