export declare const map: <A, B>(f: (a: A) => B) => (as: A[]) => B[];
export declare const mapV: <A, B>(f: (a: A) => B) => (...as: A[]) => B[];
export declare const ifElse: <A, B, C>(predicate: (a: A) => boolean) => (whenTrue: (a: A) => B) => (whenFalse: (a: A) => C) => (a: A) => B | C;
export declare const peak: <A>(a: A) => A;
export declare const isString: (a: unknown) => a is string;
export declare const longerThan: (n: number) => (as: {
    length: number;
}) => boolean;
export declare const isEmpty: (as: {
    length: number;
}) => boolean;
export declare const splitAt: (n: number) => <AS extends unknown[]>(as: AS) => unknown[][];
