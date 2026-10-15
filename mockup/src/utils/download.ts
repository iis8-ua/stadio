/** Descarga un archivo en el navegador. */
export function downloadFile(filename: string, content: string, mime = "text/plain;charset=utf-8"): void {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Revocar más tarde: si se revoca justo tras el click, algunos navegadores
  // cancelan la descarga.
  window.setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/** Convierte filas a CSV (separador ";" para Excel en español). */
export function toCsv(rows: (string | number)[][]): string {
  return rows
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(";"))
    .join("\n");
}

/** Descarga un objeto como JSON. */
export function downloadJson(filename: string, data: unknown): void {
  downloadFile(filename, JSON.stringify(data, null, 2), "application/json;charset=utf-8");
}
