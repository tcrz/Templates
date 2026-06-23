# Tables

Data tables use **TanStack Table** via the shared `DataTable` component
(`components/ui/data-table.tsx`).

## DataTable props

```tsx
<DataTable
  columns={columns}
  data={items}
  loading={isLoading}
  pagination={pagination}
  totalPages={data?.data?.totalPages}
  onPaginationChange={setPagination}
  onRowClick={(row) => router.push(`/items/${row.id}`)}
/>
```

| Prop | Type | Notes |
|------|------|-------|
| `columns` | `ColumnDef<T>[]` | Column definitions (see below) |
| `data` | `T[]` | Row data |
| `loading` | `boolean` | Shows skeleton rows |
| `pagination` | `PaginationState` | From `usePagination` |
| `totalPages` | `number` | Server-side page count |
| `onPaginationChange` | setter | From `usePagination` |
| `manualPagination` | `boolean` | `true` (default) = server-side, `false` = client-side |
| `onRowClick` | `(row: T) => void` | Optional row click handler |
| `rowSelection` | `RowSelectionState` | For selectable rows |
| `onRowSelectionChange` | setter | For selectable rows |

Empty cells automatically render `"-"`. The actions column (id `"actions"`) is
exempt from this.

## Pagination

Use the `usePagination` hook (`hooks/use-pagination.ts`). It syncs page state
with URL search params so pagination survives page refreshes and browser
navigation.

```ts
const { pagination, setPagination } = usePagination();
```

Pass both to `DataTable`. The hook defaults to page 1, size 10, and uses
`pageIndex` / `pageSize` as URL param names.

## Column definitions

Columns live in `components/<feature>/<resource>-columns.tsx` as a factory
function that receives action callbacks:

```ts
interface ColumnOptions {
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
}

export const createItemColumns = (
  options: ColumnOptions
): ColumnDef<Item>[] => [
  {
    accessorKey: "name",
    header: "Name",
  },
  // ...
];
```

### Common column patterns

**Status column** — look up the options map and pass the variant to `StatusTag`:

```ts
{
  accessorKey: "status",
  header: "Status",
  cell: ({ row }) => {
    const status = row.original.status;
    const option = ITEM_STATUS_OPTIONS[status as keyof typeof ITEM_STATUS_OPTIONS];
    return (
      <StatusTag
        status={option?.label ?? status}
        variant={option?.variant ?? "default"}
      />
    );
  },
}
```

**Date column** — use `formatDate` from `lib/utils`:

```ts
{
  accessorKey: "createdAt",
  header: "Created",
  cell: ({ row }) => formatDate(row.original.createdAt),
}
```

**Avatar + name composite cell**:

```ts
{
  accessorKey: "fullName",
  header: "User",
  cell: ({ row }) => (
    <div className="flex items-center gap-3">
      <Avatar>
        <AvatarFallback color={getAvatarColor(row.original.fullName)}>
          {getInitials(row.original.fullName)}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="font-medium">{row.original.fullName}</span>
        <span className="text-sm text-muted-foreground">{row.original.email}</span>
      </div>
    </div>
  ),
}
```

**Actions column** — use a `DropdownMenu` with id `"actions"`:

```ts
{
  id: "actions",
  header: "Actions",
  cell: ({ row }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => options.onEdit(row.original)}>
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          onClick={() => options.onDelete(row.original)}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}
```
