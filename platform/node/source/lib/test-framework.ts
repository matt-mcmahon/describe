import { deepStrictEqual, notDeepStrictEqual } from "assert";
import tap from "tap";

type TestImplementation = {
  (): void | Promise<void>;
};

export const test = (label: string, implementation: TestImplementation) =>
  tap.test(label, implementation);

export {
  deepStrictEqual as assertEquals,
  notDeepStrictEqual as assertNotEquals,
};
