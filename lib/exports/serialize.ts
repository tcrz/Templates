import * as XLSX from "xlsx";
import type { ExportColumn, ExportWorksheetSpec } from "./types";

const INVALID_SHEET_CHARS = /[\\/*?:[\]]/g;
const MAX_SHEET_NAME_LEN = 31;

/**
 * Excel worksheet name rules: max 31 chars, no \ / * ? : [ ]
 */
export function sanitizeWorksheetName(name: string): string {
  const trimmed = name.trim().replace(INVALID_SHEET_CHARS, " ");
  const collapsed = trimmed.replace(/\s+/g, " ").trim();
  const base =
    collapsed.length > 0 ? collapsed.slice(0, MAX_SHEET_NAME_LEN) : "Sheet";
  return base.slice(0, MAX_SHEET_NAME_LEN);
}

function uniqueWorksheetNames(rawNames: string[]): string[] {
  const used = new Set<string>();
  return rawNames.map((raw) => {
    let name = sanitizeWorksheetName(raw);
    if (!used.has(name)) {
      used.add(name);
      return name;
    }
    let n = 2;
    while (n < 1000) {
      const suffix = ` (${n})`;
      const maxBase = MAX_SHEET_NAME_LEN - suffix.length;
      const truncated = name.slice(0, Math.max(1, maxBase)) + suffix;
      if (!used.has(truncated)) {
        used.add(truncated);
        return truncated;
      }
      n += 1;
    }
    const fallback = `Sheet${used.size + 1}`.slice(0, MAX_SHEET_NAME_LEN);
    used.add(fallback);
    return fallback;
  });
}

function buildWorksheet<T>(rows: T[], columns: ExportColumn<T>[]): XLSX.WorkSheet {
  const headerRow = columns.map((c) => c.header);
  const dataRows = rows.map((row) =>
    columns.map((c) => {
      const v = c.accessor(row);
      if (v === null || v === undefined) return "";
      return v;
    })
  );
  const aoa = [headerRow, ...dataRows];
  return XLSX.utils.aoa_to_sheet(aoa);
}

/**
 * Build a SheetJS workbook with one or more worksheets (for `.xlsx` or single-sheet CSV).
 * Use {@link ExportWorksheetSpec} per sheet; row types may differ across sheets.
 */
export function buildExportWorkbook(
  sheets: ExportWorksheetSpec<any>[]
): XLSX.WorkBook {
  if (sheets.length === 0) {
    throw new Error("buildExportWorkbook requires at least one worksheet.");
  }
  const wb = XLSX.utils.book_new();
  const names = uniqueWorksheetNames(sheets.map((s) => s.name));
  sheets.forEach((spec, i) => {
    const ws = buildWorksheet(spec.rows, spec.columns);
    XLSX.utils.book_append_sheet(wb, ws, names[i]);
  });
  return wb;
}

/**
 * Encode a workbook as an `.xlsx` file (binary).
 */
export function writeWorkbookToXlsx(wb: XLSX.WorkBook): Uint8Array {
  return XLSX.write(wb, { bookType: "xlsx", type: "array" });
}

/**
 * Build a comma-separated export string from rows and column definitions (first sheet only).
 */
export function buildExportDocument<T>(
  rows: T[],
  columns: ExportColumn<T>[]
): string {
  const wb = buildExportWorkbook([{ name: "Export", rows, columns }]);
  return XLSX.write(wb, { bookType: "csv", type: "string" });
}
