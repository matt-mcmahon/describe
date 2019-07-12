import { inspect as nodeInspect } from "util"

export const defaultOptions = {
  depth: Infinity,
  colors: true,
  breakLength: Infinity,
}

export const configure = (options = defaultOptions) => (strings, ...values) => {
  const inspectedValues = values.map(value => nodeInspect(value, options))
  const full = []
  for (let i = 0; i < strings.length; i++) {
    if (strings[i]) {
      full.push(strings[i])
    }
    if (inspectedValues[i]) {
      full.push(inspectedValues[i])
    }
  }
  return full.join("")
}

export const inspect = configure()
