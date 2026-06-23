# Status Enums

All status values and their display metadata live in `constants/statuses.ts`.

## Pattern

Each resource status needs three things:

### 1. Const enum object + type

```ts
export const OrderStatus = {
  Pending: "Pending",
  Processing: "Processing",
  Completed: "Completed",
  Cancelled: "Cancelled",
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];
```

### 2. Options map

A `Record<Status, StatusOption<Status>>` keyed by each status value. Each entry
has `label` (display text), `value` (the raw string), and `variant` (drives
`StatusTag` / `Badge` colour).

```ts
export const ORDER_STATUS_OPTIONS: Record<OrderStatus, StatusOption<OrderStatus>> = {
  [OrderStatus.Pending]:    { label: "Pending",    value: OrderStatus.Pending,    variant: "warning" },
  [OrderStatus.Processing]: { label: "Processing", value: OrderStatus.Processing, variant: "info" },
  [OrderStatus.Completed]:  { label: "Completed",  value: OrderStatus.Completed,  variant: "success" },
  [OrderStatus.Cancelled]:  { label: "Cancelled",  value: OrderStatus.Cancelled,  variant: "error" },
};
```

### 3. List array

```ts
export const ORDER_STATUS_LIST = Object.values(ORDER_STATUS_OPTIONS);
```

## Available variants

```ts
type StatusVariant =
  | "default" | "success" | "warning" | "error"
  | "info" | "secondary" | "purple" | "orange";
```

## Usage

- **Table columns** — look up `*_OPTIONS[row.status]` and pass `variant` to
  `<StatusTag>`.
- **Filters** — map `*_LIST` to `{ label, value }` for `<Select>` or
  `FilterBar` options.
- **Forms** — iterate `*_LIST` to populate `<SelectItem>` entries.

This keeps status display consistent across tables, filters, and forms from one
source of truth.
