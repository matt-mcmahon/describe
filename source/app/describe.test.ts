import { Inspect, inspect as _inspect } from "../lib/inspect.ts";
import {
  Assert,
  describe,
  makeAssert,
  Plan,
  TestImplementation,
} from "./describe.ts";
import { Identical } from "./identical.d.ts";

describe("describe, self-test", ({ assert, inspect }) => {
  {
    const actual = inspect;
    const expected = _inspect;
    assert({ actual, expected });
  }

  // Type Tests, okay unless compiler error
  {
    type Left = Parameters<typeof describe>[1];
    type Right = TestImplementation;
    const test: Identical<Left, Right> = true;
    [test]; // ignore unused var error
  }

  {
    type Left = typeof assert;
    type Right = Assert;
    const test: Identical<Left, Right> = true;
    [test]; // ignore unused var error
  }

  {
    type Left = typeof assert.not;
    type Right = (plan: Plan) => void;
    const test: Identical<Left, Right> = true;
    [test]; // ignore unused var error
  }

  {
    type Left = Parameters<typeof assert>[0];
    type Right = Plan;
    const test: Identical<Left, Right> = true;
    [test]; // ignore unused var error
  }

  {
    type Left = typeof inspect;
    type Right = Inspect;
    const test: Identical<Left, Right> = true;
    [test]; // ignore unused var error
  }
});

const fakeAssert = (
  assert: Assert,
  result: { actual: unknown; expected: unknown; message: string },
) =>
  (actual: unknown, expected: unknown, message?: string) => {
    assert({ actual: actual, expected: result.actual });
    assert({ actual: expected, expected: result.expected });
    assert({ actual: message, expected: result.message });
  };

describe("makeAssert: { actual, expected }", async ({ assert, inspect }) => {
  const plan: Plan = {
    actual: "foo",
    expected: "bar",
  };
  const result = {
    actual: "foo",
    expected: "bar",
    message: inspect`given ${"foo"}; should be ${"bar"}`,
  };
  makeAssert(fakeAssert(assert, result))(plan);
});

describe("async makeAssert", async ({ assert, inspect }) => {
  const plan: Plan = {
    actual: "foo",
    expected: "bar",
  };
  const result = {
    actual: "foo",
    expected: "bar",
    message: inspect`given ${"foo"}; should be ${"bar"}`,
  };
  makeAssert(fakeAssert(assert, result))(Promise.resolve(plan));
});

describe("makeAssert: { ... message }", async ({ assert }) => {
  const plan: Plan = {
    actual: "foo",
    expected: "bar",
    message: "some custom message",
  };
  const result = {
    actual: "foo",
    expected: "bar",
    message: "some custom message",
  };
  makeAssert(fakeAssert(assert, result))(plan);
});

describe("makeAssert: { ... value }", async ({ assert, inspect }) => {
  const plan: Plan = {
    value: "value",
    actual: "actual",
    expected: "expected",
  };
  const result = {
    actual: "actual",
    expected: "expected",
    message: inspect`given ${plan.value}; should be ${plan.expected}`,
  };
  makeAssert(fakeAssert(assert, result))(plan);
});

describe("makeAssert: { ... given, should }", async ({ assert, inspect }) => {
  const plan: Plan = {
    actual: "actual",
    expected: "expected",
    given: "given",
    should: "should",
  };
  const result = {
    actual: "actual",
    expected: "expected",
    message: inspect`given given; should should`,
  };
  makeAssert(fakeAssert(assert, result))(plan);
});

describe("makeAssert: { ... message, given, should }", async ({ assert }) => {
  const plan: Plan = {
    actual: "actual",
    expected: "expected",
    given: "given",
    should: "should",
    message: "message",
  };
  const result = {
    actual: "actual",
    expected: "expected",
    message: "message",
  };
  makeAssert(fakeAssert(assert, result))(plan);
});
