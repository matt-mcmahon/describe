import tap from "tap"

import { basename, resolve } from "path"

import { inspect } from "../inspect"

export const ownPropOrDefault = (key, def, plan) => {
  return plan.hasOwnProperty(key) ? plan[key] : def
}

const withTap = tapAssert => {
  const assert = block => {
    const actual = block.actual
    const expected = ownPropOrDefault("expected", true, block)
    const given = ownPropOrDefault("given", inspect`${actual}`, block)
    const should = ownPropOrDefault("should", inspect`be ${expected}`, block)
    tapAssert.deepEqual(actual, expected, `given ${given}; should ${should}`)
  }
  assert.doesNotThrow = tapAssert.doesNotThrow.bind(tapAssert)
  assert.skip = ({ actual, expected, given, should }) => {
    return tapAssert.skip(actual, expected, `given ${given}; should ${should}`)
  }
  assert.fail = tapAssert.fail.bind(tapAssert)
  assert.test = async (description, plan) => {
    return tapAssert.test(description, async innerAssert => {
      plan({ assert: withTap(innerAssert) })
    })
  }
  return assert
}

const defaultWhat = Object.freeze({
  path: ".",
  public: Object.freeze([]),
  private: Object.freeze([]),
})

const getMods = async path => {
  const name = basename(path)
  const publicPath = resolve(process.cwd(), path, "index")
  const privatePath = resolve(process.cwd(), path, name)
  const publicMod = await import(publicPath)
  const privateMod = await import(privatePath)
  return { name, publicMod, privateMod }
}

export const describe = async (what = {}, plan = async () => {}) => {
  const w = { ...defaultWhat, ...what }

  tap.test(w.path, async ({ test }) => {
    test("public/private exports", async tapAssert => {
      const assert = withTap(tapAssert)

      const relative = w.path
      const { name, privateMod, publicMod } = await getMods(relative)

      {
        const given = inspect`${`${relative}/${name}.js`}`
        {
          const actual = new Set(Object.values(privateMod))
          const expected = new Set([...w.public, ...w.private])
          const should = inspect`export only ${expected}`
          assert({ given, should, actual, expected })
        }
      }

      {
        {
          const actual = new Set(Object.values(publicMod))
          const expected = new Set(w.public)
          const given = inspect`${relative + "/index.js"}`
          const should = inspect`include only public exports`
          assert({ given, should, actual, expected })
        }
      }
    })

    test(`user plan`, async tapAssert => {
      const assert = withTap(tapAssert)
      plan({
        assert,
        inspect,
      })
    })
  })
}
