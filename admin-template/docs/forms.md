# Forms

All forms use **react-hook-form** + **zod** for validation. For create/edit
workflows, forms are rendered inside a Dialog — see
[docs/modals.md](modals.md) for the modal shell.

## Zod schema

Define the schema and infer the type in the same file:

```ts
const itemFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.email("Invalid email"),
  status: z.string().min(1, "Status is required"),
});

type ItemFormData = z.infer<typeof itemFormSchema>;
```

## useForm setup

```ts
const {
  register,
  handleSubmit,
  formState: { errors },
  reset,
  watch,
  setValue,
} = useForm<ItemFormData>({
  resolver: zodResolver(itemFormSchema),
  values: {
    name: item?.name || "",
    email: item?.email || "",
    status: item?.status || "Active",
  },
});
```

Use `values` (not `defaultValues`) so the form resets when the backing data
changes (e.g. switching from create to edit).

## Field components

Use the `Field` wrapper from `components/ui/field.tsx`:

```tsx
<Field data-invalid={!!errors.name}>
  <FieldLabel htmlFor="name">Name</FieldLabel>
  <Input id="name" {...register("name")} />
  {errors.name && <FieldError>{errors.name.message}</FieldError>}
</Field>
```

For `<Select>` (Radix), bridge with `watch` + `setValue`:

```tsx
<Select
  value={watch("status")}
  onValueChange={(v) => setValue("status", v, { shouldValidate: true })}
>
```

## Mutation wiring

Use `useApiMutation` with the URL switching on edit mode:

```ts
const mutation = useApiMutation<Item, ItemFormData>(
  isEditMode ? `/items/${item.id}` : "/items",
  {
    onSuccess: () => {
      toast.success(isEditMode ? "Updated" : "Created");
      queryClient.invalidateQueries({ queryKey: [ITEMS_QUERY_KEY] });
      handleClose();
    },
  }
);

const onSubmit = async (data: ItemFormData) => {
  await mutation.mutateAsync({
    data,
    config: { method: isEditMode ? "PUT" : "POST" },
  });
};
```
