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
    return tapAssert.deepEqual(
      actual,
      expected,
      `given ${given}; should ${should}`,
      {
        skip: true,
      }
    )
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
  const e = process.env
  const publicPath = resolve(process.cwd())
  const privatePath = resolve(process.cwd(), path, name)
  const publicMod = await import(publicPath)
  const privateMod = await import(privatePath)
  return { name, publicPath, publicMod, privatePath, privateMod }
}

const valuesFor = as => Object.values(as)

const unique = as => [...new Set(as)]

const findMissingElements = (elements, target) => {
  return elements.filter(element => !target.includes(element))
}

const findIncludedElements = (elements, target) => {
  return elements.filter(element => target.includes(element))
}

export const describe = async (what = {}, plan = async () => {}) => {
  const w = { ...defaultWhat, ...what }

  tap.test(w.path, async ({ test }) => {
    test("public/private exports", async tapAssert => {
      const assert = withTap(tapAssert)

      const relative = w.path
      const mods = await getMods(relative)
      const { name, publicPath, publicMod, privatePath, privateMod } = mods

      // Private Mod should have all public and private exports.
      {
        const elements = unique([...w.public, ...w.private])
        const target = unique(valuesFor(privateMod))
        const actual = findMissingElements(elements, target)
        const expected = []
        const given = inspect`${privatePath}`
        const should = inspect`include all public and private exports; missing exports:`
        assert({ given, should, actual, expected })
      }

      // Public Mod should have all public exports
      const target = unique(valuesFor(publicMod))
      {
        const elements = unique(w.public)
        const actual = findMissingElements(elements, target)
        const expected = []
        const given = inspect`${publicPath}`
        const should = inspect`include all public exports`
        assert({ given, should, actual, expected })
      }

      // Public Mod should have no private exports
      {
        const elements = unique(w.private)
        const actual = findIncludedElements(elements, target)
        const expected = []
        const given = inspect`${publicPath}`
        const should = inspect`include no private exports`
        assert({ given, should, actual, expected })
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
