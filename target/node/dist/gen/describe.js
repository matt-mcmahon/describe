"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeAssert = exports.describe = void 0;
const test_framework_1 = require("../lib/test-framework");
const inspect_1 = require("../lib/inspect");
exports.describe = (prefix, implementation) => {
    const assert = Object.assign(exports.makeAssert(test_framework_1.assertEquals), {
        not: exports.makeAssert(test_framework_1.assertNotEquals),
    });
    return test_framework_1.test(prefix, async () => implementation({ assert, inspect: inspect_1.inspect }));
};
exports.makeAssert = (assert) => {
    return async (_a) => {
        var _b;
        var { actual, expected, value, given = inspect_1.inspect `${value !== null && value !== void 0 ? value : actual}`, should = inspect_1.inspect `be ${expected}`, message = `given ${(_b = given !== null && given !== void 0 ? given : value) !== null && _b !== void 0 ? _b : actual}; should ${should !== null && should !== void 0 ? should : expected}`, } = _a;
        return assert(actual, expected, message);
    };
};
