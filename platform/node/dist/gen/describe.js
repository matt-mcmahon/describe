"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeAssert = exports.describe = void 0;
const test_framework_1 = require("../lib/test-framework");
const inspect_1 = require("../lib/inspect");
const utils_1 = require("./utils");
function describe(prefix, implementation) {
    const assert = Object.assign(makeAssert(test_framework_1.assertEquals), {
        not: makeAssert(test_framework_1.assertNotEquals),
    });
    return test_framework_1.test(prefix, async () => implementation({ assert, inspect: inspect_1.inspect }));
}
exports.describe = describe;
function makeAssert(assert) {
    return async (plan) => {
        const p = await plan;
        const expected = utils_1.hasOwnOrDefault("expected")(true)(p);
        const { actual, given = inspect_1.inspect `${utils_1.hasOwnOrDefault("value")(actual)(p)}`, should = inspect_1.inspect `be ${expected}`, message = `given ${given}; should ${should}`, } = p;
        return assert(actual, expected, message);
    };
}
exports.makeAssert = makeAssert;
