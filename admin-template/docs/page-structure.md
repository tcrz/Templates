# Page Structure

## Route pages

Pages live under `app/(routes)/<route>/page.tsx`. They should be thin — just
render a container component:

```tsx
import Items from "@/components/items/items";

export default function ItemsPage() {
  return <Items />;
}
```

All logic, state, and data fetching belong in the container component under
`components/<feature>/`.

## Container component

A typical list page container follows this layout:

```tsx
<PageWrapper>
  <PageHeader title="Items" description="Manage your items">
    <Button><Plus /> Add Item</Button>
  </PageHeader>

  <div className="space-y-6">
    <StatCardsGrid>
      <StatCard title="Total" value={stats?.total} icon={Box} />
    </StatCardsGrid>

    <FilterBar fields={FILTER_FIELDS} variant="inline" />

    <DataTable
      columns={columns}
      data={items}
      pagination={pagination}
      loading={isLoading}
      totalPages={data?.data?.totalPages}
      onPaginationChange={setPagination}
    />

    <ItemFormModal open={isModalOpen} onOpenChange={handleModalClose} item={selected} />
  </div>
</PageWrapper>
```

## Layout components

| Component | File | Purpose |
|-----------|------|---------|
| `PageWrapper` | `components/layout/page-wrapper.tsx` | Max-width container with padding. Optional `useNestedContainer` for a white card background. |
| `PageHeader` | `components/layout/page-header.tsx` | Title + description + action buttons slot. Has a `loading` skeleton state. |

## Shared UI

| Component | Location | Usage |
|-----------|----------|-------|
| `DataTable` | `components/ui/data-table.tsx` | TanStack Table wrapper with pagination |
| `FilterBar` | `components/shared/filter-bar.tsx` | Declarative filter fields — text, select, date |
| `StatCard` / `StatCardsGrid` | `components/ui/stat-card.tsx` | Summary metric cards |

## File layout per feature

```
components/<feature>/
  <feature>.tsx           — container (list page)
  <resource>-columns.tsx  — TanStack Table column defs
  <resource>-form-modal.tsx — create/edit Dialog
shared-queries/
  <resource>.queries.ts   — query hooks + QUERY_KEY
app/(routes)/<route>/
  page.tsx                — thin route page
```
