"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertNotEquals = exports.assertEquals = exports.test = void 0;
const assert_1 = require("assert");
Object.defineProperty(exports, "assertEquals", { enumerable: true, get: function () { return assert_1.deepStrictEqual; } });
Object.defineProperty(exports, "assertNotEquals", { enumerable: true, get: function () { return assert_1.notDeepStrictEqual; } });
const tap_1 = __importDefault(require("tap"));
const test = (label, implementation) => tap_1.default.test(label, implementation);
exports.test = test;
