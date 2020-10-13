import { assertEquals } from "./remote/asserts.ts";

import { inspect } from "./inspect.ts";

Deno.test("inspect.test.ts :: should inspect values, but not literals", () => {
  const value = { one: "one" };
  const expected = `one ${Deno.inspect(value)} two`;
  const actual = inspect`one ${value} two`;
  assertEquals(actual, expected);
});

Deno.test("inspect.test.ts :: should inspect strings", () => {
  const value = "test";
  const expected = Deno.inspect(value);
  const actual = inspect`${value}`;
  assertEquals(actual, expected);
  assertEquals(inspect`${""}`, Deno.inspect(""));
});

Deno.test("inspect.test.ts :: should inspect numbers", () => {
  assertEquals(inspect`${1}`, Deno.inspect(1));
  assertEquals(inspect`${1.2}`, Deno.inspect(1.2));
  assertEquals(inspect`${NaN}`, Deno.inspect(NaN));
});

Deno.test("inspect.test.ts :: should inspect booleans", () => {
  assertEquals(inspect`${true}`, Deno.inspect(true));
  assertEquals(inspect`${false}`, Deno.inspect(false));
});

Deno.test("inspect.test.ts :: should inspect null", () => {
  const value = null;
  const expected = Deno.inspect(value);
  const actual = inspect`${value}`;
  assertEquals(actual, expected);
});

Deno.test("inspect.test.ts :: should inspect undefined", () => {
  const value = undefined;
  const expected = Deno.inspect(value);
  const actual = inspect`${value}`;
  assertEquals(actual, expected);
});

Deno.test("inspect.test.ts :: should inspect arrays", () => {
  const value = [1, 2, 3];
  const expected = Deno.inspect(value);
  const actual = inspect`${value}`;
  assertEquals(actual, expected);
});

Deno.test("inspect.test.ts :: should inspect functions", () => {
  const value = (ns: number[]) => Math.max(...ns);
  const expected = Deno.inspect(value);
  const actual = inspect`${value}`;
  assertEquals(actual, expected);
});
