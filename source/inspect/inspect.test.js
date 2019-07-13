import { describe } from "../describe"
import { inspect, defaultOptions, configure } from "./inspect"

describe(
  {
    path: "source/inspect",
    public: [inspect, configure],
    private: [defaultOptions],
  },
  async ({ assert, inspect }) => {
    const one = { one: "one" }
    {
      const expected = "one { one: [32m'one'[39m } two"
      const actual = inspect`one ${one} two`
      assert({ expected, actual })
    }

    {
      const expected = "one { one: 'one' } two"
      const actual = configure({
        color: false,
      })`one ${one} two`
      assert({ expected, actual })
    }
  }
)
