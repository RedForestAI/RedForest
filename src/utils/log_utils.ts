/** Convert a 2D array into a CSV string
 * https://stackoverflow.com/a/68146412/13231446
 */

export function arrayToCsv(data: any[]): string {
  return data.map(row =>
    row
    .map(String)  // convert every value to String
    .map((v: any) => v.replaceAll('"', '""'))  // escape double quotes
    .map((v: any) => `"${v}"`)  // quote it
    .join(',')  // comma-separated
  ).join('\r\n');  // rows starting on new lines
}

function parseCSVData(data: string): string[][] {
  const rows = data.split('\n').filter(row => row.length > 0);
  const cells: string[][] = rows.map(row => row.split(','));

  // remove any whitespace characters from the cells
  for (let i = 0; i < cells.length; i++) {
    for (let j = 0; j < (cells[i]?.length ?? 0); j++) {
      // @ts-ignore
      cells[i][j] = cells[i][j].trim();
      // @ts-ignore
      cells[i][j] = cells[i][j].replaceAll('""', '"');

      // Remove the first and last character "
      // @ts-ignore
      if (cells[i][j][0] === '"') {
        // @ts-ignore
        cells[i][j] = cells[i][j].substring(1);
      }
      // @ts-ignore
      if (cells[i][j][cells[i][j].length - 1] === '"') {
        // @ts-ignore
        cells[i][j] = cells[i][j].substring(0, cells[i][j].length - 1);
      }
    }
  }
  return cells
}

export function loadCSVData(blob: Blob, as_df: boolean = true): Promise<string[][]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const data = reader.result as string;
      resolve(parseCSVData(data));
    };
    reader.onerror = reject;
    reader.readAsText(blob);
  });
}

// Function to get the stem of a file from a filepath
export function getFileStem(filePath: string): string {
  // Split the filepath by '/' to get parts and take the last part as the filename
  const fileName = filePath.split('/').pop() || '';
  
  // Split the filename by '.' to separate the extension if any
  const parts = fileName.split('.');
  
  // If there's no extension, return the fileName
  if(parts.length < 2) {
    return fileName;
  }

  // Remove the last part (extension) and rejoin, handles filenames with multiple dots
  return parts.slice(0, -1).join('.');
}