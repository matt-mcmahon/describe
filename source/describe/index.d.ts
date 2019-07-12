import { TaggedTemplateFunction } from "../inspect"

/**
 * ```
 * describe :: (o, (assert => *)) => *
 * ```
 * -----------------------------------------------------------------------------
 *
 * The __describe__ function verifies that an EcmaScript Module exports the
 * expected properties. `path` is the path to the file module you want to test,
 * relative to the root of your project. `public` includes all public values
 * that are exported by the _index.js_, and `private` array values that are
 * exported by the module itself.
 *
 * Takes an __moduleDescription__ of the form
 * `{ path: String, public: [Function], private: [Function] }`,
 * and a __moduleTests__ function with assertions, and passes an object that
 * has the following properties:
 *
 * - `assert`: a function that takes an object of the form, `{ given, should,
 *   actual, expected }` and passes if the `actual` and `expected` values are
 *   equivalent.
 * - `inspect`: inspects a _TemplateString_ and formats it's parts for terminal
 *   output.
 *
 * ```
 * describe({
 *   path: 'source/my-module/myModule',
 *   public: [publicModuleExport],
 *   private: [privateModuleExport]
 * }, async ({ assert, inspect }) => {
 *   // Note: tests private path: source/my-module/index.js
 *   assert({
 *     given: inspect`'foo'.length`,
 *     should: inspect`should be ${3}`,
 *     actual: 'foo'.length,
 *     expected: 4,
 *   })
 * })
 * ```
 */
export declare function describe(
  moduleDescription: {
    path: string
    public: Function[]
    private: Function[]
  },
  moduleTests: (utilities: Utilities) => Promise<void>
): void

export declare type Utilities = {
  assert: Assert<any>
  inspect: TaggedTemplateFunction
}

export declare interface Assert<T> {
  (options: { given: string; should: string; expected: T; actual: T }): void
}
