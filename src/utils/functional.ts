export function debounce<F extends (...args: any[]) => void>(func: F, wait: number): (...args: Parameters<F>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function(...args: Parameters<F>): void {
    const later = () => {
      clearTimeout(timeout as ReturnType<typeof setTimeout>);
      func(...args);
    };

    if (timeout !== null) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(later, wait);
  };
}