"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inspect = void 0;
const util_1 = require("util");
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
exports.inspect = (literals, ...values) => {
    const inspectedValues = values.map((o) => util_1.inspect(o, { colors: true }));
    const full = [];
    for (let i = 0; i < literals.length; i++) {
        if (literals[i]) {
            full.push(literals[i]);
        }
        if (inspectedValues[i]) {
            full.push(inspectedValues[i]);
        }
    }
    return full.join("");
};
