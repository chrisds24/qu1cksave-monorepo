export function debounce(func: any, delay: number) {
  // timeout is accessible by returned function because of closure, even after
  //   debounce has returned
  let timeout: any = null;

  return (...args: any[]) => {
    // Clear any existing timeout, "resetting" it
    if (timeout) { clearTimeout(timeout) }
    // After the delay, calls the function with the given arguments
    timeout = setTimeout(() => {
      func(...args);
      timeout = null;
    }, delay);
  };
}