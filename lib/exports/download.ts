const CSV_MIME = "text/csv;charset=utf-8";
const XLSX_MIME =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

export type DownloadExportOptions = {
  filename: string;
  /** File body (e.g. from {@link buildExportDocument}). */
  content: string;
  /** Defaults to CSV UTF-8. */
  mimeType?: string;
  /** Prepend UTF-8 BOM so Excel recognizes encoding (default true for CSV). */
  includeBom?: boolean;
};

/**
 * Ensures a `.csv` download name (strips a non-csv final segment if present).
 * Mirrors {@link downloadWorkbookXlsx} for `.xlsx`.
 */
export function ensureCsvFilename(filename: string): string {
  if (filename.toLowerCase().endsWith(".csv")) {
    return filename;
  }
  return `${filename.replace(/\.[^/.]+$/, "")}.csv`;
}

function withOptionalBom(content: string, mimeType: string, includeBom: boolean) {
  const isCsv = mimeType.includes("csv");
  if (includeBom && isCsv) {
    return new Blob(["\uFEFF", content], { type: mimeType });
  }
  return new Blob([content], { type: mimeType });
}

/**
 * Trigger a browser download from a {@link Blob} (e.g. `.xlsx` from {@link writeWorkbookToXlsx}).
 */
export function downloadExportBlob(filename: string, blob: Blob): void {
  const url = URL.createObjectURL(blob);
  try {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
  } finally {
    URL.revokeObjectURL(url);
  }
}

/**
 * Trigger a browser download for a text export (e.g. CSV).
 */
export function downloadExport({
  filename,
  content,
  mimeType = CSV_MIME,
  includeBom = true,
}: DownloadExportOptions): void {
  const blob = withOptionalBom(content, mimeType, includeBom);
  const name =
    mimeType.includes("csv") ? ensureCsvFilename(filename) : filename;
  downloadExportBlob(name, blob);
}

/**
 * Convenience: download a SheetJS workbook as `.xlsx` (ensures filename ends with `.xlsx`).
 */
export function downloadWorkbookXlsx(
  filename: string,
  data: Uint8Array
): void {
  const name = filename.toLowerCase().endsWith(".xlsx")
    ? filename
    : `${filename.replace(/\.[^/.]+$/, "")}.xlsx`;
  // `xlsx` types `Uint8Array` with `ArrayBufferLike`; DOM `Blob` expects `BlobPart` (stricter `ArrayBuffer`).
  const blob = new Blob([data as BlobPart], { type: XLSX_MIME });
  downloadExportBlob(name, blob);
}

export { XLSX_MIME };
