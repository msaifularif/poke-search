import { ref, customRef } from 'vue';

/**
 * Creates a debounced ref that updates after a specified delay
 * @param {any} initialValue
 * @param {number} delayMs
 */
export function useDebouncedRef(initialValue, delayMs = 300) {
  let timeout;
  return customRef((track, trigger) => {
    let value = initialValue;
    return {
      get() {
        track();
        return value;
      },
      set(newValue) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          value = newValue;
          trigger();
        }, delayMs);
      },
    };
  });
}

/**
 * Debounce a callback function
 */
export function debounce(fn, delayMs = 300) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delayMs);
  };
}
