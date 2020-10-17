export const map = <A, B>(f: (a: A) => B) => (as: A[]) => as.map(f);
export const mapV = <A, B>(f: (a: A) => B) => (...as: A[]) => as.map(f);

export const ifElse = <A, B, C>(predicate: (a: A) => boolean) =>
  (whenTrue: (a: A) => B) =>
    (whenFalse: (a: A) => C) =>
      (a: A) => (predicate(a) ? whenTrue(a) : whenFalse(a));

export const peak = <A>(a: A) => {
  return a;
};
export const isString = (a: unknown): a is string => typeof a === "string";
export const longerThan = (n: number) =>
  (as: { length: number }) => as.length > n;
export const isEmpty = (as: { length: number }) => as.length === 0;
export const splitAt = (n: number) =>
  <AS extends unknown[]>(as: AS) => [as.slice(0, n), as.slice(n)];
