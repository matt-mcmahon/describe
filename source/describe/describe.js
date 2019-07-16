import tap from "tap"

import { basename, resolve } from "path"

import { inspect } from "../inspect"

export const ownPropOrDefault = (key, def, plan) => {
  return plan.hasOwnProperty(key) ? plan[key] : def
}

const print = v =>
  v && v.name
    ? v.name
    : typeof v === "string"
    ? `${v}`.trim().replace(/\s+/gi, " ")
    : v

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

export const includesAll = (all, list) => {
  return all.map(a => list.includes(a)).reduce((a, b) => a && b, true)
}

export const includesAny = (any, list) => {
  return any.map(a => list.includes(a)).reduce((a, b) => a || b, false)
}

export const describe = async (what = {}, plan = async () => {}) => {
  const w = { ...defaultWhat, ...what }

  tap.test(w.path, async ({ test }) => {
    test("public/private exports", async tapAssert => {
      const assert = withTap(tapAssert)

      const relative = w.path
      const { name, privateMod, publicMod } = await getMods(relative)

      {
        const all = [...w.public, ...w.private]
        const list = Object.values(privateMod)

        const given = inspect`${relative}/${name}.js`
        {
          const actual = includesAll(all, list)
          const expected = true
          const should = inspect`export only ${all.map(print)}`
          assert({ given, should, actual, expected })
        }

        {
          const should = inspect`not export anything else`
          const actual = all.length
          const expected = list.length
          assert({ given, should, actual, expected })
        }
      }

      {
        const given = inspect`${relative}/index.js`
        {
          const actual = includesAll(w.public, Object.values(publicMod))
          const expected = true
          const should = inspect`have all ${w.public.map(print)}`
          assert({ given, should, actual, expected })
        }

        {
          const actual = includesAny(w.private, Object.values(publicMod))
          const expected = false
          const should = inspect`not have any ${w.private.map(print)}`
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
