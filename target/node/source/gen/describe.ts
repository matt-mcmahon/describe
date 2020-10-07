import { assertEquals, assertNotEquals, test } from "../lib/test-framework";
import { Inspect, inspect } from "../lib/inspect";

export type Plan<A> = {
  actual: unknown;
  expected: A;
  given?: string;
  should?: string;
  value?: unknown;
  message?: string;
  not?: boolean;
};

export type Assert = {
  <A>(plan: Plan<A>): void;
  not<A>(plan: Plan<A>): void;
};

export type AssertFunction = {
  (actual: unknown, expected: unknown, msg?: string): void;
};

export type TestImplementation = ({
  assert,
  inspect,
}: {
  assert: Assert;
  inspect: Inspect;
}) => Promise<void> | void;

export const describe = (
  prefix: string,
  implementation: ({
    assert,
    inspect,
  }: {
    assert: Assert;
    inspect: Inspect;
  }) => Promise<void> | void,
) => {
  const assert = Object.assign(makeAssert(assertEquals), {
    not: makeAssert(assertNotEquals),
  });
  return test(prefix, async () => implementation({ assert, inspect }));
};

export const makeAssert = (assert: AssertFunction) => {
  return async <A>({
    actual,
    expected,
    value,
    given = inspect`${value ?? actual}`,
    should = inspect`be ${expected}`,
    message = `given ${given ?? value ?? actual}; should ${should ?? expected}`,
  }: Plan<A>) => {
    return assert(actual, expected, message);
  };
};
