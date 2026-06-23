# Modals

All modals use the `Dialog` primitive from `components/ui/dialog.tsx`. There are
two patterns: **form modals** for create/edit workflows and **confirmation
dialogs** for destructive or important actions.

## Form modals

Used for create/edit flows. The component receives controlled open state and an
optional item (null = create, present = edit).

```tsx
interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: Item | null;
}
```

### Layout

```tsx
<Dialog open={open} onOpenChange={handleClose}>
  <DialogContent className="sm:max-w-[500px]">
    <DialogHeader>
      <DialogTitle>{isEditMode ? "Edit Item" : "Add Item"}</DialogTitle>
      <DialogDescription>...</DialogDescription>
    </DialogHeader>

    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Form fields — see docs/forms.md */}

      <DialogFooter>
        <Button variant="outline" onClick={handleClose}>Cancel</Button>
        <Button type="submit" loading={mutation.isPending}>Save</Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>
```

### Close handler

Reset form state after the dialog animation completes:

```ts
const handleClose = () => {
  onOpenChange(false);
  setTimeout(() => reset(), 200);
};
```

### File naming

Form modals live at `components/<feature>/<resource>-form-modal.tsx`.

## Confirmation dialogs

For destructive actions, status toggles, or success/error feedback. Use the
`useConfirmationDialog` hook (`hooks/use-confirmation-dialog.ts`) instead of
building a one-off Dialog.

### Setup

```tsx
const { showWarning, showSuccess, showError, renderDialog } = useConfirmationDialog();
```

Render `{renderDialog()}` somewhere in the component's JSX.

### Variants

**Warning / confirmation** (shows Cancel + Confirm):

```ts
showWarning({
  title: "Deactivate User",
  content: "Are you sure you want to deactivate this user?",
  onConfirm: async () => { await deactivate(); },
  confirmText: "Deactivate",
  lazy: true,  // shows loading spinner on confirm button
});
```

**Success** (single button, no cancel):

```ts
showSuccess({
  title: "Done",
  content: "The user has been activated.",
  confirmText: "Continue",
});
```

**Error** (single button, no cancel):

```ts
showError({
  title: "Something went wrong",
  content: "Could not update the user. Please try again.",
});
```

### Icon types

`"warning"` | `"delete"` | `"alert"` | `"success"` | `"error"` — each renders
a different icon and colour. `showWarning`, `showSuccess`, and `showError` set
these automatically; use `showDialog` with `iconType` for manual control.

### Lazy mode

Pass `lazy: true` when `onConfirm` is async. The confirm button shows a loading
spinner and waits for the promise to resolve before closing.
