import { describe, ownPropOrDefault } from "./describe"

describe(
  {
    path: "source/describe",
    public: [describe],
    private: [ownPropOrDefault],
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
  }
)
