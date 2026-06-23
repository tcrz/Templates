"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import {
  buildExportDocument,
  buildExportWorkbook,
  downloadExport,
  downloadWorkbookXlsx,
  type ExportColumn,
  type ExportWorksheetSpec,
  writeWorkbookToXlsx,
} from "@/lib/exports";

export function useExportDownload() {
  const [isExporting, setIsExporting] = useState(false);

  const runExport = useCallback(
    <T,>(opts: {
      filename: string;
      rows: T[];
      columns: ExportColumn<T>[];
      emptyMessage?: string;
    }) => {
      const { filename, rows, columns, emptyMessage } = opts;
      if (rows.length === 0) {
        toast.warning(
          emptyMessage ?? "Nothing to export for the current filters."
        );
        return;
      }
      setIsExporting(true);
      try {
        const content = buildExportDocument(rows, columns);
        downloadExport({ filename, content });
        toast.success("Export downloaded.");
      } catch (e) {
        const message = e instanceof Error ? e.message : "Export failed.";
        toast.error(message);
      } finally {
        setIsExporting(false);
      }
    },
    []
  );

  const runWorkbookExport = useCallback(
    (opts: {
      filename: string;
      sheets: ExportWorksheetSpec<any>[];
      /** When true (default), block if every sheet has zero data rows. */
      requireSomeRows?: boolean;
      emptyMessage?: string;
    }) => {
      const {
        filename,
        sheets,
        requireSomeRows = true,
        emptyMessage,
      } = opts;
      if (sheets.length === 0) {
        toast.warning(emptyMessage ?? "No worksheets to export.");
        return;
      }
      if (
        requireSomeRows &&
        sheets.every((s) => s.rows.length === 0)
      ) {
        toast.warning(
          emptyMessage ?? "Nothing to export for the current filters."
        );
        return;
      }
      setIsExporting(true);
      try {
        const wb = buildExportWorkbook(sheets);
        const data = writeWorkbookToXlsx(wb);
        downloadWorkbookXlsx(filename, data);
        toast.success("Export downloaded.");
      } catch (e) {
        const message = e instanceof Error ? e.message : "Export failed.";
        toast.error(message);
      } finally {
        setIsExporting(false);
      }
    },
    []
  );

  return { runExport, runWorkbookExport, isExporting };
}
