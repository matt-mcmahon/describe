/**
 * Use with template literals to customize interpolation. See
 * [Template Literals on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_templates).
 */
interface TaggedTemplateFunction {
  (stings: string[], values: any[]): string
}

/**
 * ```
 * inspect :: t => t
 * ```
 * -----------------------------------------------------------------------------
 *
 * Tags a _template-literal_ by inspecting each of its arguments. For example:
 *
```
inspect`one ${{ one: "one" }} two` => "one { one: [32m'one'[39m } two"
```
 */
export declare const inspect: TaggedTemplateFunction

/**
 * ```
 * configure :: o => TemplateTag
 * ```
 * -----------------------------------------------------------------------------
 *
 * Configures an instance of inspect with any options of the options allowed by
 * [Node's util/inspect module](https://nodejs.org/dist/latest-v12.x/docs/api/util.html#util_util_inspect_object_options).
 *
 * This module's `inspect` uses these default options:
 * ```
 * {
 *   depth: Infinity,
 *   colors: true,
 *   breakLength: Infinity,
 * }
 * ```
 */
export declare function configure(): TaggedTemplateFunction
