import {
  describe,
  ownPropOrDefault,
  includesAll,
  includesAny,
} from "./describe"

describe(
  {
    path: "source/describe",
    public: [describe],
    private: [ownPropOrDefault, includesAll, includesAny],
  },
  async ({ assert, inspect }) => {
    assert.test("async arguments", async ({ assert }) => {
      const given = inspect`inspect`
      const should = inspect`be a ${"function"}`
      const actual = typeof inspect
      const expected = "function"
      assert({ given, should, actual, expected })
    })

    assert.test("ownPropOrDefault", async ({ assert }) => {
      const plan = { foo: "foo" }
      {
        const given = inspect`ownPropOrDefault(${"foo"}, ${"bar"}, ${plan})`
        const should = inspect`be ${plan.foo}`
        const actual = ownPropOrDefault("foo", "bar", plan)
        const expected = "foo"
        assert({ given, should, actual, expected })
      }

      {
        const given = inspect`ownPropOrDefault(${"bar"}, ${"bar"}, ${plan})`
        const should = inspect`be ${"bar"}`
        const actual = ownPropOrDefault("bar", "bar", plan)
        const expected = "bar"
        assert({ given, should, actual, expected })
      }
    })

    assert.test("includesAll/Any", async ({ assert }) => {
      const [a, b, c, d, e] = ["a", "b", "c", "d", "e"]

      {
        const all = [a, b, c]
        const list = [a, b, c, d, e]
        const actual = includesAll(all, list)
        const expected = true
        const given = inspect`includesAll(all: ${all}, list: ${list})`
        const should = inspect`be ${expected}, list has all`
        assert({ given, should, actual, expected })
      }

      {
        const all = [a, b, c, d, e]
        const list = [a, b, c]
        const actual = includesAll(all, list)
        const expected = false
        const given = inspect`includesAll(all: ${all}, list: ${list})`
        const should = inspect`be ${expected}, list does not have ${[d, e]}`
        assert({ given, should, actual, expected })
      }

      {
        const any = [b, c]
        const list = [a, d, e]
        const actual = includesAny(any, list)
        const expected = false
        const given = inspect`includesAny(any: ${any}, list: ${list})`
        const should = inspect`be ${expected}, list does not have any`
        assert({ given, should, actual, expected })
      }

      {
        const any = [b, c, e]
        const list = [a, b, d, e]
        const actual = includesAny(any, list)
        const expected = true
        const given = inspect`shouldNotHaveAny(any: ${any}, list: ${list})`
        const should = inspect`be ${expected}, list has ${b}`
        assert({ given, should, actual, expected })
      }
    })

    assert.skip("assert.skip", () => {
      throw new Error("should skip this test")
    })
  }
)
