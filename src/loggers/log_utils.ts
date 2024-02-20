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
