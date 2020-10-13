"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasOwnOrDefault = exports.has = exports.splitAt = exports.isEmpty = exports.longerThan = exports.isString = exports.peak = exports.ifElse = exports.mapV = exports.map = void 0;
exports.map = (f) => (as) => as.map(f);
exports.mapV = (f) => (...as) => as.map(f);
exports.ifElse = (predicate) => (whenTrue) => (whenFalse) => (a) => (predicate(a) ? whenTrue(a) : whenFalse(a));
exports.peak = (a) => {
    return a;
};
exports.isString = (a) => typeof a === "string";
exports.longerThan = (n) => (as) => as.length > n;
exports.isEmpty = (as) => as.length === 0;
exports.splitAt = (n) => (as) => [as.slice(0, n), as.slice(n)];
exports.has = (k) => (a) => Object.prototype.hasOwnProperty.call(a, k);
exports.hasOwnOrDefault = (prop) => (def) => (obj) => exports.has(prop)(obj) ? obj[prop] : def;
