/**
 * Status enums + display option maps.
 *
 * Convention (see the `new-status` skill):
 *  - A `const` object of the raw status string values + a matching `type`.
 *  - A `*_OPTIONS` map keyed by value, each `{ label, value, variant }`.
 *    `variant` matches `StatusTag` / `Badge` variants so columns and filters
 *    can render and filter from a single source of truth.
 *
 * The `UserStatus` below is an example for the bundled Users feature — replace
 * or extend with your own domain statuses.
 */

export type StatusVariant =
  | "default"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "secondary"
  | "purple"
  | "orange";

export interface StatusOption<T extends string = string> {
  label: string;
  value: T;
  variant: StatusVariant;
}

export const UserStatus = {
  Active: "Active",
  Inactive: "Inactive",
  Suspended: "Suspended",
  Pending: "Pending",
} as const;

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];

export const USER_STATUS_OPTIONS: Record<UserStatus, StatusOption<UserStatus>> = {
  [UserStatus.Active]: { label: "Active", value: UserStatus.Active, variant: "success" },
  [UserStatus.Inactive]: { label: "Inactive", value: UserStatus.Inactive, variant: "secondary" },
  [UserStatus.Suspended]: { label: "Suspended", value: UserStatus.Suspended, variant: "error" },
  [UserStatus.Pending]: { label: "Pending", value: UserStatus.Pending, variant: "warning" },
};

/** Array form for `<Select>` / filter dropdowns. */
export const USER_STATUS_LIST = Object.values(USER_STATUS_OPTIONS);
