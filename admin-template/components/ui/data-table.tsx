"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  InitialTableState,
  OnChangeFn,
  PaginationState,
  RowSelectionState,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { cn, isEmpty } from "@/lib/utils";
import { Pagination } from "@/components/shared/pagination";

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  loading?: boolean;
  data: TData[];
  totalPages?: number;
  pagination?: PaginationState;
  manualPagination?: boolean;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: OnChangeFn<RowSelectionState> | undefined;
  onRowClick?: (row: TData) => void;
  tableContainerClassName?: string;
  onPaginationChange?: Dispatch<SetStateAction<PaginationState>>;
  rowId?: string;
  enableMultiRowSelection?: boolean;
  initialState?: InitialTableState;
}

export function DataTable<TData>({
  columns,
  data,
  loading = false,
  totalPages,
  pagination,
  rowSelection,
  onRowSelectionChange,
  onRowClick,
  onPaginationChange,
  tableContainerClassName,
  manualPagination = true,
  enableMultiRowSelection = false,
  rowId = "id",
  initialState,
}: DataTableProps<TData>) {
  /** Client-side pagination must be controlled; `onPaginationChange: undefined` breaks page changes. */
  const [clientPagination, setClientPagination] = useState<PaginationState>(
    () => ({
      pageIndex: initialState?.pagination?.pageIndex ?? 0,
      pageSize: initialState?.pagination?.pageSize ?? 10,
    })
  );

  const tableInitialState = useMemo(() => {
    if (!initialState) return initialState;
    if (manualPagination) return initialState;
    const { pagination: _clientPaginationHandledInState, ...rest } =
      initialState;
    return rest;
  }, [initialState, manualPagination]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: manualPagination,
    pageCount: manualPagination ? totalPages ?? -1 : undefined,
    initialState: tableInitialState,
    state: {
      ...(manualPagination && pagination ? { pagination } : {}),
      ...(!manualPagination ? { pagination: clientPagination } : {}),
      rowSelection,
    },
    getRowId: (row: TData) =>
      String((row as Record<string, unknown>)[rowId] ?? ""),
    enableMultiRowSelection: enableMultiRowSelection,
    onRowSelectionChange,
    onPaginationChange: manualPagination
      ? onPaginationChange
      : setClientPagination,
  });

  return (
    <div className="ring-foreground/10 bg-card rounded-sm ring-1 overflow-hidden">
      <div
        className={cn("relative overflow-auto", tableContainerClassName)}
      >
        <Table className="w-full border-collapse">
          <TableHeader className="sticky top-0 z-10 bg-muted/50 border-b">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="hover:bg-transparent border-b-0"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="px-4 py-3 text-left text-muted-foreground font-medium"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {loading ? (
              // Skeleton Rows when loading
              Array.from({ length: columns.length }).map((_, index) => (
                <TableRow key={index} className="border-b">
                  {columns.map((_, index) => (
                    <TableCell key={index} className="px-4 py-3">
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={cn(
                    "border-b transition-colors",
                    rowSelection && row.getIsSelected()
                      ? "bg-primary/10 hover:bg-primary/15"
                      : "hover:bg-muted/50",
                    onRowClick && "cursor-pointer"
                  )}
                  onClick={
                    onRowClick
                      ? () => onRowClick(row.original as TData)
                      : undefined
                  }
                >
                  {row.getVisibleCells().map((cell) => {
                    const renderedValue = flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    );

                    // Get the underlying cell value from the row data
                    const cellValue = cell.getValue();
                    // if cell has an id of "actions", then it is a custom cell and should be treated as not empty
                    if (cell.column.columnDef.id === "actions") {
                      return (
                        <TableCell key={cell.id} className="px-4 py-3">
                          {renderedValue}
                        </TableCell>
                      );
                    }

                    // Check if either the underlying value or rendered value is empty
                    // This handles cases where:
                    // 1. The underlying value is null/undefined/empty (no custom renderer)
                    // 2. The custom renderer returns null/undefined/empty
                    const isCellEmpty =
                      isEmpty(cellValue) || isEmpty(renderedValue);

                    return (
                      <TableCell key={cell.id} className="px-4 py-3">
                        {isCellEmpty ? "-" : renderedValue}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No Data.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* Pagination: server (manual) requires controlled props; client uses table instance */}
      {Boolean(table.getRowModel().rows.length) &&
        (manualPagination
          ? pagination && onPaginationChange
          : table.getPageCount() > 1) && (
          <Pagination
            totalPages={table.getPageCount()}
            pagination={table.getState().pagination}
            onPaginationChange={
              manualPagination && onPaginationChange
                ? onPaginationChange
                : table.setPagination
            }
            className="border-t bg-muted/30"
          />
        )}
    </div>
  );
}
