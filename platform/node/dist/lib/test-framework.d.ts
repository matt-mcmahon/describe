import { deepStrictEqual, notDeepStrictEqual } from "assert";
declare type TestImplementation = {
    (): void | Promise<void>;
};
export declare const test: (label: string, implementation: TestImplementation) => Promise<void>;
export { deepStrictEqual as assertEquals, notDeepStrictEqual as assertNotEquals, };
