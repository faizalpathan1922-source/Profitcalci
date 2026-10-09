/**
 * Utility for exporting data to formatted CSV files with UTF-8 BOM
 * for clean opening in Microsoft Excel, Google Sheets, and Numbers.
 */

export interface CsvExportOptions {
  filename: string;
  headers: string[];
  rows: (string | number | boolean | null | undefined)[][];
  summaryRows?: (string | number | boolean | null | undefined)[][];
  metadata?: {
    title?: string;
    generatedAt?: string;
    extraNotes?: string[];
  };
}

/**
 * Escapes a cell value for standard CSV format (RFC 4180 compliant)
 */
function escapeCsvCell(val: string | number | boolean | null | undefined): string {
  if (val === null || val === undefined) {
    return '""';
  }
  const str = String(val);
  // If string contains comma, quote, newline, or carriage return, enclose in quotes and escape quotes
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

/**
 * Downloads a structured dataset as a CSV file in the browser
 */
export function downloadCsv({
  filename,
  headers,
  rows,
  summaryRows = [],
  metadata,
}: CsvExportOptions): void {
  const lines: string[] = [];

  // Optional Metadata Header
  if (metadata?.title) {
    lines.push(`"${metadata.title.replace(/"/g, '""')}"`);
    if (metadata.generatedAt) {
      lines.push(`"Generated on: ${metadata.generatedAt}"`);
    }
    if (metadata.extraNotes && metadata.extraNotes.length > 0) {
      metadata.extraNotes.forEach((note) => {
        lines.push(`"${note.replace(/"/g, '""')}"`);
      });
    }
    lines.push(''); // Blank separator line
  }

  // Column Headers
  lines.push(headers.map(escapeCsvCell).join(','));

  // Data Rows
  rows.forEach((row) => {
    lines.push(row.map(escapeCsvCell).join(','));
  });

  // Summary Rows
  if (summaryRows.length > 0) {
    lines.push(''); // Blank row before summary
    summaryRows.forEach((sRow) => {
      lines.push(sRow.map(escapeCsvCell).join(','));
    });
  }

  // Add UTF-8 BOM (\uFEFF) so Excel respects UTF-8 encoding (including currency symbols)
  const csvString = '\uFEFF' + lines.join('\r\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const cleanFilename = filename.toLowerCase().endsWith('.csv') ? filename : `${filename}.csv`;

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', cleanFilename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Parses simple CSV content string into headers and rows
 */
export function parseCsv(text: string): { headers: string[]; rows: string[][] } {
  // Normalize newlines
  const lines = text.split(/\r\n|\n|\r/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) return { headers: [], rows: [] };

  const parseLine = (line: string): string[] => {
    const result: string[] = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          cur += '"';
          i++; // skip next quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(cur.trim());
        cur = '';
      } else {
        cur += char;
      }
    }
    result.push(cur.trim());
    return result;
  };

  const headers = parseLine(lines[0]);
  const rows = lines.slice(1).map(parseLine);
  return { headers, rows };
}
