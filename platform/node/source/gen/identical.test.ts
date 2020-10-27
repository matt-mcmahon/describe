// deno-lint-ignore-file

import type { Identical } from "./identical";
import { describe } from "./describe";

describe("source/app/identical.d", ({ assert }) => {
  const any1: Identical<any, any> = true;
  const any2: Identical<any, never> = false;
  const any3: Identical<any, unknown> = false;

  const never1: Identical<never, any> = false;
  const never2: Identical<never, never> = true;
  const never3: Identical<never, unknown> = false;

  const unknown1: Identical<unknown, any> = false;
  const unknown2: Identical<unknown, never> = false;
  const unknown3: Identical<unknown, unknown> = true;

  const null1: Identical<null, null> = true;
  const null2: Identical<null, undefined> = false;
  const null3: Identical<null, void> = false;

  const undefined1: Identical<undefined, null> = false;
  const undefined2: Identical<undefined, undefined> = true;
  const undefined3: Identical<undefined, void> = false;

  const void1: Identical<void, null> = false;
  const void2: Identical<void, undefined> = false;
  const void3: Identical<void, void> = true;

  const boolean1: Identical<1, true> = false;
  const boolean2: Identical<0, false> = false;
  const boolean3: Identical<true, false> = false;
  const boolean4: Identical<false, true> = false;
  const boolean5: Identical<true, true> = true;
  const boolean6: Identical<false, false> = true;

  const string1: Identical<"a", "b"> = false;
  const string2: Identical<string, "b"> = false;
  const string3: Identical<"a", string> = false;
  const string4: Identical<string, string> = true;

  const object1: Identical<{ a: "A" }, { a: "B" }> = false;
  const object2: Identical<{ a: "A" }, { a: string }> = false;
  const object3: Identical<{ a: "A" }, { b: "A" }> = false;
  const object4: Identical<{ a: "A" }, { a: "A" }> = true;
  const object5: Identical<{ a: string }, { a: string }> = true;

  assert({
    actual: true,
    expected: true,
    message: "all type tests pass",
  });
});
