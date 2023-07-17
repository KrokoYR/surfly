export function invariant(value: boolean, message?: string): asserts value;
export function invariant<T>(value: T | null | undefined, message?: string): asserts value is T;
export function invariant(value: unknown, message = 'Assertion Error'): asserts value {
  if (value === false || value === null || typeof value === 'undefined') throw new Error(message);
}
