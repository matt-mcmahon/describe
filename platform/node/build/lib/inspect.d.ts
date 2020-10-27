export declare type Inspect = {
    (literals: TemplateStringsArray, ...values: unknown[]): string;
};
/**
 * ```
 * inspect
 * ```
 * -----------------------------------------------------------------------------
 *
 * Node utils.inspect that works as a tagged template function.
 * ```js
 * const foo = { msg: "Foo!" };
 * inspect`foo: ${foo}`; //=>
 * ```
 */
export declare const inspect: (literals: TemplateStringsArray, ...values: unknown[]) => string;
