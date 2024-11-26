export function useDebounce(func: any, delay: number) {
  let timeout: any = null;

  return (...args: any[]) => {
    if (timeout) { clearTimeout(timeout) }
    timeout = setTimeout(() => {
      func(...args);
      timeout = null;
    }, delay);
  };
}