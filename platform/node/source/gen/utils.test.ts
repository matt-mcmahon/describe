import { describe } from "./describe";
import {
  has,
  hasOwnOrDefault,
  ifElse,
  isEmpty,
  isString,
  longerThan,
  map,
  mapV,
  peak,
  splitAt,
} from "./utils";

describe(`has`, async ({ assert, inspect }) => {
  {
    const prop = "foo";
    const value = { foo: undefined };
    const actual = has(prop)(value);
    const expected = true;
    const should = inspect`has(${prop}) should be ${expected}`;
    assert({ actual, expected, value, should });
  }
  {
    const prop = "bar";
    const value = { foo: undefined };
    const actual = has(prop)(value);
    const expected = false;
    const should = inspect`has(${prop}) should be ${expected}`;
    assert({ actual, expected, value, should });
  }
});

describe(`hasOwnOrDefault`, async ({ assert, inspect }) => {
  const value = { foo: undefined };
  {
    const prop = "foo";
    const expected = undefined;
    const actual = hasOwnOrDefault(prop)(expected)(value);
    const given = inspect`hasOwnOrDefault(${prop})(${expected})(${value})`;
    assert({ actual, expected, value, given });
  }
  {
    const prop = "bar";
    const expected = "default bar";
    const actual = hasOwnOrDefault(prop)(expected)(value);
    const given = inspect`hasOwnOrDefault(${prop})(${expected})(${value})`;
    assert({ actual, expected, value, given });
  }
});

describe("isString", ({ assert }) => {
  assert({ actual: isString(""), expected: true });
  assert({ actual: isString(1), expected: false });
  assert({ actual: isString({ some: "object" }), expected: false });
  assert({ actual: isString(true), expected: false });
  assert({ actual: isString(BigInt("1234")), expected: false });
});

describe("ifElse", ({ assert }) => {
  const id = <A>(a: A) => () => a;
  const T = id(true);
  const F = id(false);
  const pass = id("pass");
  const fail = id("fail");

  const stringTest = ifElse(isString)(() => "string")(() => "other");

  assert({ actual: ifElse(T)(pass)(fail)("ignored"), expected: "pass" });
  assert({ actual: ifElse(F)(fail)(pass)("ignored"), expected: "pass" });
  assert({ actual: stringTest("I'm a string"), expected: "string" });
  assert({ actual: stringTest(1000), expected: "other" });
});

describe(`isEmpty`, async ({ assert, inspect }) => {
  {
    const value = "not empty";
    const actual = isEmpty(value);
    const expected = false;
    const given = inspect`${value}`;
    const should = inspect`not be empty`;
    assert({ actual, expected, value, given, should });
  }
  {
    const value = "";
    const actual = isEmpty(value);
    const expected = true;
    const given = inspect`${value}`;
    const should = inspect`be empty`;
    assert({ actual, expected, value, given, should });
  }
  {
    const value: string[] | [] = [];
    const actual = isEmpty(value);
    const expected = true;
    const given = inspect`${value}`;
    const should = inspect`be empty`;
    assert({ actual, expected, value, given, should });
  }
  {
    const value: string[] | [] = ["not empty"];
    const actual = isEmpty(value);
    const expected = false;
    const given = inspect`${value}`;
    const should = inspect`not be empty`;
    assert({ actual, expected, value, given, should });
  }
  {
    const value: string[] | [] = [""];
    const actual = isEmpty(value);
    const expected = false;
    const given = inspect`${value}`;
    const should = inspect`not be empty`;
    assert({ actual, expected, value, given, should });
  }
});

describe("longerThan", ({ assert }) => {
  const longerThan4 = longerThan(4);
  {
    const value = "12345";
    const expected = true;
    assert({ actual: longerThan4(value), expected, value });
  }
  {
    const value = [1, 2, 3, 4, 5];
    const expected = true;
    assert({ actual: longerThan4(value), expected, value });
  }
  {
    const value = "1234";
    const expected = false;
    assert({ actual: longerThan4(value), expected, value });
  }
  {
    const value = [1, 2, 3, 4];
    const expected = false;
    assert({ actual: longerThan4(value), expected, value });
  }
});

describe(`map`, async ({ assert }) => {
  {
    const value = ["a", "b", "c"];
    const actual = map((a: string) => a.toUpperCase())(value);
    const expected = ["A", "B", "C"];
    assert({ actual, expected, value });
  }
});

describe(`mapV`, async ({ assert }) => {
  {
    const value = ["a", "b", "c"];
    const actual = mapV((a: string) => a.toUpperCase())(...value);
    const expected = ["A", "B", "C"];
    assert({ actual, expected, value });
  }
});

describe(`peak`, async ({ assert }) => {
  {
    const value = "foo";
    const actual = peak(value);
    const expected = value;
    assert({ actual, expected, value });
  }
});

describe(`splitAt`, async ({ assert }) => {
  {
    const value = ["a", "b", "c", "d", "e"];
    const actual = splitAt(2)(value);
    const expected = [["a", "b"], ["c", "d", "e"]];
    assert({ actual, expected, value });
  }
});
