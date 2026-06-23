export type ExportColumn<T> = {
  header: string;
  accessor: (row: T) => unknown;
};

/** One worksheet in a multi-sheet workbook (`any` row type allows mixed sheets). */
export type ExportWorksheetSpec<T = unknown> = {
  name: string;
  rows: T[];
  columns: ExportColumn<T>[];
};

/** Snapshot of table data for client-side export (parent state, filled by child panels). */
export type TableExportSnapshot<T = unknown> = {
  filename: string;
  rows: T[];
  columns: ExportColumn<T>[];
};
