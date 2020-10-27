// deno-fmt-ignore-file
// deno-lint-ignore-file
// @ts-nocheck
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

// This is a specialised implementation of a System module loader.

"use strict";

// @ts-nocheck
/* eslint-disable */
let System, __instantiate;
(() => {
  const r = new Map();

  System = {
    register(id, d, f) {
      r.set(id, { d, f, exp: {} });
    },
  };
  async function dI(mid, src) {
    let id = mid.replace(/\.\w+$/i, "");
    if (id.includes("./")) {
      const [o, ...ia] = id.split("/").reverse(),
        [, ...sa] = src.split("/").reverse(),
        oa = [o];
      let s = 0,
        i;
      while ((i = ia.shift())) {
        if (i === "..") s++;
        else if (i === ".") break;
        else oa.push(i);
      }
      if (s < sa.length) oa.push(...sa.slice(s));
      id = oa.reverse().join("/");
    }
    return r.has(id) ? gExpA(id) : import(mid);
  }

  function gC(id, main) {
    return {
      id,
      import: (m) => dI(m, id),
      meta: { url: id, main },
    };
  }

  function gE(exp) {
    return (id, v) => {
      const e = typeof id === "string" ? { [id]: v } : id;
      for (const [id, value] of Object.entries(e)) {
        Object.defineProperty(exp, id, {
          value,
          writable: true,
          enumerable: true,
        });
      }
      return v;
    };
  }

  function rF(main) {
    for (const [id, m] of r.entries()) {
      const { f, exp } = m;
      const { execute: e, setters: s } = f(gE(exp), gC(id, id === main));
      delete m.f;
      m.e = e;
      m.s = s;
    }
  }

  async function gExpA(id) {
    if (!r.has(id)) return;
    const m = r.get(id);
    if (m.s) {
      const { d, e, s } = m;
      delete m.s;
      delete m.e;
      for (let i = 0; i < s.length; i++) s[i](await gExpA(d[i]));
      const r = e();
      if (r) await r;
    }
    return m.exp;
  }

  function gExp(id) {
    if (!r.has(id)) return;
    const m = r.get(id);
    if (m.s) {
      const { d, e, s } = m;
      delete m.s;
      delete m.e;
      for (let i = 0; i < s.length; i++) s[i](gExp(d[i]));
      e();
    }
    return m.exp;
  }
  __instantiate = (m, a) => {
    System = __instantiate = undefined;
    rF(m);
    return a ? gExpA(m) : gExp(m);
  };
})();

System.register("https://deno.land/std@0.74.0/fmt/colors", [], function (exports_1, context_1) {
    "use strict";
    var noColor, enabled, ANSI_PATTERN;
    var __moduleName = context_1 && context_1.id;
    function setColorEnabled(value) {
        if (noColor) {
            return;
        }
        enabled = value;
    }
    exports_1("setColorEnabled", setColorEnabled);
    function getColorEnabled() {
        return enabled;
    }
    exports_1("getColorEnabled", getColorEnabled);
    function code(open, close) {
        return {
            open: `\x1b[${open.join(";")}m`,
            close: `\x1b[${close}m`,
            regexp: new RegExp(`\\x1b\\[${close}m`, "g"),
        };
    }
    function run(str, code) {
        return enabled
            ? `${code.open}${str.replace(code.regexp, code.open)}${code.close}`
            : str;
    }
    function reset(str) {
        return run(str, code([0], 0));
    }
    exports_1("reset", reset);
    function bold(str) {
        return run(str, code([1], 22));
    }
    exports_1("bold", bold);
    function dim(str) {
        return run(str, code([2], 22));
    }
    exports_1("dim", dim);
    function italic(str) {
        return run(str, code([3], 23));
    }
    exports_1("italic", italic);
    function underline(str) {
        return run(str, code([4], 24));
    }
    exports_1("underline", underline);
    function inverse(str) {
        return run(str, code([7], 27));
    }
    exports_1("inverse", inverse);
    function hidden(str) {
        return run(str, code([8], 28));
    }
    exports_1("hidden", hidden);
    function strikethrough(str) {
        return run(str, code([9], 29));
    }
    exports_1("strikethrough", strikethrough);
    function black(str) {
        return run(str, code([30], 39));
    }
    exports_1("black", black);
    function red(str) {
        return run(str, code([31], 39));
    }
    exports_1("red", red);
    function green(str) {
        return run(str, code([32], 39));
    }
    exports_1("green", green);
    function yellow(str) {
        return run(str, code([33], 39));
    }
    exports_1("yellow", yellow);
    function blue(str) {
        return run(str, code([34], 39));
    }
    exports_1("blue", blue);
    function magenta(str) {
        return run(str, code([35], 39));
    }
    exports_1("magenta", magenta);
    function cyan(str) {
        return run(str, code([36], 39));
    }
    exports_1("cyan", cyan);
    function white(str) {
        return run(str, code([37], 39));
    }
    exports_1("white", white);
    function gray(str) {
        return brightBlack(str);
    }
    exports_1("gray", gray);
    function brightBlack(str) {
        return run(str, code([90], 39));
    }
    exports_1("brightBlack", brightBlack);
    function brightRed(str) {
        return run(str, code([91], 39));
    }
    exports_1("brightRed", brightRed);
    function brightGreen(str) {
        return run(str, code([92], 39));
    }
    exports_1("brightGreen", brightGreen);
    function brightYellow(str) {
        return run(str, code([93], 39));
    }
    exports_1("brightYellow", brightYellow);
    function brightBlue(str) {
        return run(str, code([94], 39));
    }
    exports_1("brightBlue", brightBlue);
    function brightMagenta(str) {
        return run(str, code([95], 39));
    }
    exports_1("brightMagenta", brightMagenta);
    function brightCyan(str) {
        return run(str, code([96], 39));
    }
    exports_1("brightCyan", brightCyan);
    function brightWhite(str) {
        return run(str, code([97], 39));
    }
    exports_1("brightWhite", brightWhite);
    function bgBlack(str) {
        return run(str, code([40], 49));
    }
    exports_1("bgBlack", bgBlack);
    function bgRed(str) {
        return run(str, code([41], 49));
    }
    exports_1("bgRed", bgRed);
    function bgGreen(str) {
        return run(str, code([42], 49));
    }
    exports_1("bgGreen", bgGreen);
    function bgYellow(str) {
        return run(str, code([43], 49));
    }
    exports_1("bgYellow", bgYellow);
    function bgBlue(str) {
        return run(str, code([44], 49));
    }
    exports_1("bgBlue", bgBlue);
    function bgMagenta(str) {
        return run(str, code([45], 49));
    }
    exports_1("bgMagenta", bgMagenta);
    function bgCyan(str) {
        return run(str, code([46], 49));
    }
    exports_1("bgCyan", bgCyan);
    function bgWhite(str) {
        return run(str, code([47], 49));
    }
    exports_1("bgWhite", bgWhite);
    function bgBrightBlack(str) {
        return run(str, code([100], 49));
    }
    exports_1("bgBrightBlack", bgBrightBlack);
    function bgBrightRed(str) {
        return run(str, code([101], 49));
    }
    exports_1("bgBrightRed", bgBrightRed);
    function bgBrightGreen(str) {
        return run(str, code([102], 49));
    }
    exports_1("bgBrightGreen", bgBrightGreen);
    function bgBrightYellow(str) {
        return run(str, code([103], 49));
    }
    exports_1("bgBrightYellow", bgBrightYellow);
    function bgBrightBlue(str) {
        return run(str, code([104], 49));
    }
    exports_1("bgBrightBlue", bgBrightBlue);
    function bgBrightMagenta(str) {
        return run(str, code([105], 49));
    }
    exports_1("bgBrightMagenta", bgBrightMagenta);
    function bgBrightCyan(str) {
        return run(str, code([106], 49));
    }
    exports_1("bgBrightCyan", bgBrightCyan);
    function bgBrightWhite(str) {
        return run(str, code([107], 49));
    }
    exports_1("bgBrightWhite", bgBrightWhite);
    function clampAndTruncate(n, max = 255, min = 0) {
        return Math.trunc(Math.max(Math.min(n, max), min));
    }
    function rgb8(str, color) {
        return run(str, code([38, 5, clampAndTruncate(color)], 39));
    }
    exports_1("rgb8", rgb8);
    function bgRgb8(str, color) {
        return run(str, code([48, 5, clampAndTruncate(color)], 49));
    }
    exports_1("bgRgb8", bgRgb8);
    function rgb24(str, color) {
        if (typeof color === "number") {
            return run(str, code([38, 2, (color >> 16) & 0xff, (color >> 8) & 0xff, color & 0xff], 39));
        }
        return run(str, code([
            38,
            2,
            clampAndTruncate(color.r),
            clampAndTruncate(color.g),
            clampAndTruncate(color.b),
        ], 39));
    }
    exports_1("rgb24", rgb24);
    function bgRgb24(str, color) {
        if (typeof color === "number") {
            return run(str, code([48, 2, (color >> 16) & 0xff, (color >> 8) & 0xff, color & 0xff], 49));
        }
        return run(str, code([
            48,
            2,
            clampAndTruncate(color.r),
            clampAndTruncate(color.g),
            clampAndTruncate(color.b),
        ], 49));
    }
    exports_1("bgRgb24", bgRgb24);
    function stripColor(string) {
        return string.replace(ANSI_PATTERN, "");
    }
    exports_1("stripColor", stripColor);
    return {
        setters: [],
        execute: function () {
            noColor = globalThis.Deno?.noColor ?? true;
            enabled = !noColor;
            ANSI_PATTERN = new RegExp([
                "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
                "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))",
            ].join("|"), "g");
        }
    };
});
System.register("https://deno.land/std@0.74.0/testing/_diff", [], function (exports_2, context_2) {
    "use strict";
    var DiffType, REMOVED, COMMON, ADDED;
    var __moduleName = context_2 && context_2.id;
    function createCommon(A, B, reverse) {
        const common = [];
        if (A.length === 0 || B.length === 0)
            return [];
        for (let i = 0; i < Math.min(A.length, B.length); i += 1) {
            if (A[reverse ? A.length - i - 1 : i] === B[reverse ? B.length - i - 1 : i]) {
                common.push(A[reverse ? A.length - i - 1 : i]);
            }
            else {
                return common;
            }
        }
        return common;
    }
    function diff(A, B) {
        const prefixCommon = createCommon(A, B);
        const suffixCommon = createCommon(A.slice(prefixCommon.length), B.slice(prefixCommon.length), true).reverse();
        A = suffixCommon.length
            ? A.slice(prefixCommon.length, -suffixCommon.length)
            : A.slice(prefixCommon.length);
        B = suffixCommon.length
            ? B.slice(prefixCommon.length, -suffixCommon.length)
            : B.slice(prefixCommon.length);
        const swapped = B.length > A.length;
        [A, B] = swapped ? [B, A] : [A, B];
        const M = A.length;
        const N = B.length;
        if (!M && !N && !suffixCommon.length && !prefixCommon.length)
            return [];
        if (!N) {
            return [
                ...prefixCommon.map((c) => ({ type: DiffType.common, value: c })),
                ...A.map((a) => ({
                    type: swapped ? DiffType.added : DiffType.removed,
                    value: a,
                })),
                ...suffixCommon.map((c) => ({ type: DiffType.common, value: c })),
            ];
        }
        const offset = N;
        const delta = M - N;
        const size = M + N + 1;
        const fp = new Array(size).fill({ y: -1 });
        const routes = new Uint32Array((M * N + size + 1) * 2);
        const diffTypesPtrOffset = routes.length / 2;
        let ptr = 0;
        let p = -1;
        function backTrace(A, B, current, swapped) {
            const M = A.length;
            const N = B.length;
            const result = [];
            let a = M - 1;
            let b = N - 1;
            let j = routes[current.id];
            let type = routes[current.id + diffTypesPtrOffset];
            while (true) {
                if (!j && !type)
                    break;
                const prev = j;
                if (type === REMOVED) {
                    result.unshift({
                        type: swapped ? DiffType.removed : DiffType.added,
                        value: B[b],
                    });
                    b -= 1;
                }
                else if (type === ADDED) {
                    result.unshift({
                        type: swapped ? DiffType.added : DiffType.removed,
                        value: A[a],
                    });
                    a -= 1;
                }
                else {
                    result.unshift({ type: DiffType.common, value: A[a] });
                    a -= 1;
                    b -= 1;
                }
                j = routes[prev];
                type = routes[prev + diffTypesPtrOffset];
            }
            return result;
        }
        function createFP(slide, down, k, M) {
            if (slide && slide.y === -1 && down && down.y === -1) {
                return { y: 0, id: 0 };
            }
            if ((down && down.y === -1) ||
                k === M ||
                (slide && slide.y) > (down && down.y) + 1) {
                const prev = slide.id;
                ptr++;
                routes[ptr] = prev;
                routes[ptr + diffTypesPtrOffset] = ADDED;
                return { y: slide.y, id: ptr };
            }
            else {
                const prev = down.id;
                ptr++;
                routes[ptr] = prev;
                routes[ptr + diffTypesPtrOffset] = REMOVED;
                return { y: down.y + 1, id: ptr };
            }
        }
        function snake(k, slide, down, _offset, A, B) {
            const M = A.length;
            const N = B.length;
            if (k < -N || M < k)
                return { y: -1, id: -1 };
            const fp = createFP(slide, down, k, M);
            while (fp.y + k < M && fp.y < N && A[fp.y + k] === B[fp.y]) {
                const prev = fp.id;
                ptr++;
                fp.id = ptr;
                fp.y += 1;
                routes[ptr] = prev;
                routes[ptr + diffTypesPtrOffset] = COMMON;
            }
            return fp;
        }
        while (fp[delta + offset].y < N) {
            p = p + 1;
            for (let k = -p; k < delta; ++k) {
                fp[k + offset] = snake(k, fp[k - 1 + offset], fp[k + 1 + offset], offset, A, B);
            }
            for (let k = delta + p; k > delta; --k) {
                fp[k + offset] = snake(k, fp[k - 1 + offset], fp[k + 1 + offset], offset, A, B);
            }
            fp[delta + offset] = snake(delta, fp[delta - 1 + offset], fp[delta + 1 + offset], offset, A, B);
        }
        return [
            ...prefixCommon.map((c) => ({ type: DiffType.common, value: c })),
            ...backTrace(A, B, fp[delta + offset], swapped),
            ...suffixCommon.map((c) => ({ type: DiffType.common, value: c })),
        ];
    }
    exports_2("diff", diff);
    return {
        setters: [],
        execute: function () {
            (function (DiffType) {
                DiffType["removed"] = "removed";
                DiffType["common"] = "common";
                DiffType["added"] = "added";
            })(DiffType || (DiffType = {}));
            exports_2("DiffType", DiffType);
            REMOVED = 1;
            COMMON = 2;
            ADDED = 3;
        }
    };
});
System.register("https://deno.land/std@0.74.0/testing/asserts", ["https://deno.land/std@0.74.0/fmt/colors", "https://deno.land/std@0.74.0/testing/_diff"], function (exports_3, context_3) {
    "use strict";
    var colors_ts_1, _diff_ts_1, CAN_NOT_DISPLAY, AssertionError;
    var __moduleName = context_3 && context_3.id;
    function _format(v) {
        return globalThis.Deno
            ? Deno.inspect(v, {
                depth: Infinity,
                sorted: true,
                trailingComma: true,
                compact: false,
                iterableLimit: Infinity,
            })
            : `"${String(v).replace(/(?=["\\])/g, "\\")}"`;
    }
    exports_3("_format", _format);
    function createColor(diffType) {
        switch (diffType) {
            case _diff_ts_1.DiffType.added:
                return (s) => colors_ts_1.green(colors_ts_1.bold(s));
            case _diff_ts_1.DiffType.removed:
                return (s) => colors_ts_1.red(colors_ts_1.bold(s));
            default:
                return colors_ts_1.white;
        }
    }
    function createSign(diffType) {
        switch (diffType) {
            case _diff_ts_1.DiffType.added:
                return "+   ";
            case _diff_ts_1.DiffType.removed:
                return "-   ";
            default:
                return "    ";
        }
    }
    function buildMessage(diffResult) {
        const messages = [];
        messages.push("");
        messages.push("");
        messages.push(`    ${colors_ts_1.gray(colors_ts_1.bold("[Diff]"))} ${colors_ts_1.red(colors_ts_1.bold("Actual"))} / ${colors_ts_1.green(colors_ts_1.bold("Expected"))}`);
        messages.push("");
        messages.push("");
        diffResult.forEach((result) => {
            const c = createColor(result.type);
            messages.push(c(`${createSign(result.type)}${result.value}`));
        });
        messages.push("");
        return messages;
    }
    function isKeyedCollection(x) {
        return [Symbol.iterator, "size"].every((k) => k in x);
    }
    function equal(c, d) {
        const seen = new Map();
        return (function compare(a, b) {
            if (a &&
                b &&
                ((a instanceof RegExp && b instanceof RegExp) ||
                    (a instanceof URL && b instanceof URL))) {
                return String(a) === String(b);
            }
            if (a instanceof Date && b instanceof Date) {
                const aTime = a.getTime();
                const bTime = b.getTime();
                if (Number.isNaN(aTime) && Number.isNaN(bTime)) {
                    return true;
                }
                return a.getTime() === b.getTime();
            }
            if (Object.is(a, b)) {
                return true;
            }
            if (a && typeof a === "object" && b && typeof b === "object") {
                if (seen.get(a) === b) {
                    return true;
                }
                if (Object.keys(a || {}).length !== Object.keys(b || {}).length) {
                    return false;
                }
                if (isKeyedCollection(a) && isKeyedCollection(b)) {
                    if (a.size !== b.size) {
                        return false;
                    }
                    let unmatchedEntries = a.size;
                    for (const [aKey, aValue] of a.entries()) {
                        for (const [bKey, bValue] of b.entries()) {
                            if ((aKey === aValue && bKey === bValue && compare(aKey, bKey)) ||
                                (compare(aKey, bKey) && compare(aValue, bValue))) {
                                unmatchedEntries--;
                            }
                        }
                    }
                    return unmatchedEntries === 0;
                }
                const merged = { ...a, ...b };
                for (const key in merged) {
                    if (!compare(a && a[key], b && b[key])) {
                        return false;
                    }
                }
                seen.set(a, b);
                return true;
            }
            return false;
        })(c, d);
    }
    exports_3("equal", equal);
    function assert(expr, msg = "") {
        if (!expr) {
            throw new AssertionError(msg);
        }
    }
    exports_3("assert", assert);
    function assertEquals(actual, expected, msg) {
        if (equal(actual, expected)) {
            return;
        }
        let message = "";
        const actualString = _format(actual);
        const expectedString = _format(expected);
        try {
            const diffResult = _diff_ts_1.diff(actualString.split("\n"), expectedString.split("\n"));
            const diffMsg = buildMessage(diffResult).join("\n");
            message = `Values are not equal:\n${diffMsg}`;
        }
        catch (e) {
            message = `\n${colors_ts_1.red(CAN_NOT_DISPLAY)} + \n\n`;
        }
        if (msg) {
            message = msg;
        }
        throw new AssertionError(message);
    }
    exports_3("assertEquals", assertEquals);
    function assertNotEquals(actual, expected, msg) {
        if (!equal(actual, expected)) {
            return;
        }
        let actualString;
        let expectedString;
        try {
            actualString = String(actual);
        }
        catch (e) {
            actualString = "[Cannot display]";
        }
        try {
            expectedString = String(expected);
        }
        catch (e) {
            expectedString = "[Cannot display]";
        }
        if (!msg) {
            msg = `actual: ${actualString} expected: ${expectedString}`;
        }
        throw new AssertionError(msg);
    }
    exports_3("assertNotEquals", assertNotEquals);
    function assertStrictEquals(actual, expected, msg) {
        if (actual === expected) {
            return;
        }
        let message;
        if (msg) {
            message = msg;
        }
        else {
            const actualString = _format(actual);
            const expectedString = _format(expected);
            if (actualString === expectedString) {
                const withOffset = actualString
                    .split("\n")
                    .map((l) => `    ${l}`)
                    .join("\n");
                message =
                    `Values have the same structure but are not reference-equal:\n\n${colors_ts_1.red(withOffset)}\n`;
            }
            else {
                try {
                    const diffResult = _diff_ts_1.diff(actualString.split("\n"), expectedString.split("\n"));
                    const diffMsg = buildMessage(diffResult).join("\n");
                    message = `Values are not strictly equal:\n${diffMsg}`;
                }
                catch (e) {
                    message = `\n${colors_ts_1.red(CAN_NOT_DISPLAY)} + \n\n`;
                }
            }
        }
        throw new AssertionError(message);
    }
    exports_3("assertStrictEquals", assertStrictEquals);
    function assertNotStrictEquals(actual, expected, msg) {
        if (actual !== expected) {
            return;
        }
        throw new AssertionError(msg ?? `Expected "actual" to be strictly unequal to: ${_format(actual)}\n`);
    }
    exports_3("assertNotStrictEquals", assertNotStrictEquals);
    function assertStringContains(actual, expected, msg) {
        if (!actual.includes(expected)) {
            if (!msg) {
                msg = `actual: "${actual}" expected to contain: "${expected}"`;
            }
            throw new AssertionError(msg);
        }
    }
    exports_3("assertStringContains", assertStringContains);
    function assertArrayContains(actual, expected, msg) {
        const missing = [];
        for (let i = 0; i < expected.length; i++) {
            let found = false;
            for (let j = 0; j < actual.length; j++) {
                if (equal(expected[i], actual[j])) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                missing.push(expected[i]);
            }
        }
        if (missing.length === 0) {
            return;
        }
        if (!msg) {
            msg = `actual: "${_format(actual)}" expected to contain: "${_format(expected)}"\nmissing: ${_format(missing)}`;
        }
        throw new AssertionError(msg);
    }
    exports_3("assertArrayContains", assertArrayContains);
    function assertMatch(actual, expected, msg) {
        if (!expected.test(actual)) {
            if (!msg) {
                msg = `actual: "${actual}" expected to match: "${expected}"`;
            }
            throw new AssertionError(msg);
        }
    }
    exports_3("assertMatch", assertMatch);
    function assertNotMatch(actual, expected, msg) {
        if (expected.test(actual)) {
            if (!msg) {
                msg = `actual: "${actual}" expected to not match: "${expected}"`;
            }
            throw new AssertionError(msg);
        }
    }
    exports_3("assertNotMatch", assertNotMatch);
    function fail(msg) {
        assert(false, `Failed assertion${msg ? `: ${msg}` : "."}`);
    }
    exports_3("fail", fail);
    function assertThrows(fn, ErrorClass, msgIncludes = "", msg) {
        let doesThrow = false;
        let error = null;
        try {
            fn();
        }
        catch (e) {
            if (e instanceof Error === false) {
                throw new AssertionError("A non-Error object was thrown.");
            }
            if (ErrorClass && !(e instanceof ErrorClass)) {
                msg =
                    `Expected error to be instance of "${ErrorClass.name}", but was "${e.constructor.name}"${msg ? `: ${msg}` : "."}`;
                throw new AssertionError(msg);
            }
            if (msgIncludes &&
                !colors_ts_1.stripColor(e.message).includes(colors_ts_1.stripColor(msgIncludes))) {
                msg =
                    `Expected error message to include "${msgIncludes}", but got "${e.message}"${msg ? `: ${msg}` : "."}`;
                throw new AssertionError(msg);
            }
            doesThrow = true;
            error = e;
        }
        if (!doesThrow) {
            msg = `Expected function to throw${msg ? `: ${msg}` : "."}`;
            throw new AssertionError(msg);
        }
        return error;
    }
    exports_3("assertThrows", assertThrows);
    async function assertThrowsAsync(fn, ErrorClass, msgIncludes = "", msg) {
        let doesThrow = false;
        let error = null;
        try {
            await fn();
        }
        catch (e) {
            if (e instanceof Error === false) {
                throw new AssertionError("A non-Error object was thrown or rejected.");
            }
            if (ErrorClass && !(e instanceof ErrorClass)) {
                msg =
                    `Expected error to be instance of "${ErrorClass.name}", but got "${e.name}"${msg ? `: ${msg}` : "."}`;
                throw new AssertionError(msg);
            }
            if (msgIncludes &&
                !colors_ts_1.stripColor(e.message).includes(colors_ts_1.stripColor(msgIncludes))) {
                msg =
                    `Expected error message to include "${msgIncludes}", but got "${e.message}"${msg ? `: ${msg}` : "."}`;
                throw new AssertionError(msg);
            }
            doesThrow = true;
            error = e;
        }
        if (!doesThrow) {
            msg = `Expected function to throw${msg ? `: ${msg}` : "."}`;
            throw new AssertionError(msg);
        }
        return error;
    }
    exports_3("assertThrowsAsync", assertThrowsAsync);
    function unimplemented(msg) {
        throw new AssertionError(msg || "unimplemented");
    }
    exports_3("unimplemented", unimplemented);
    function unreachable() {
        throw new AssertionError("unreachable");
    }
    exports_3("unreachable", unreachable);
    return {
        setters: [
            function (colors_ts_1_1) {
                colors_ts_1 = colors_ts_1_1;
            },
            function (_diff_ts_1_1) {
                _diff_ts_1 = _diff_ts_1_1;
            }
        ],
        execute: function () {
            CAN_NOT_DISPLAY = "[Cannot display]";
            AssertionError = class AssertionError extends Error {
                constructor(message) {
                    super(message);
                    this.name = "AssertionError";
                }
            };
            exports_3("AssertionError", AssertionError);
        }
    };
});
System.register("file:///home/matt/@mwm/describe/source/lib/remote/asserts", ["https://deno.land/std@0.74.0/testing/asserts"], function (exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    function exportStar_1(m) {
        var exports = {};
        for (var n in m) {
            if (n !== "default") exports[n] = m[n];
        }
        exports_4(exports);
    }
    return {
        setters: [
            function (asserts_ts_1_1) {
                exportStar_1(asserts_ts_1_1);
            }
        ],
        execute: function () {
        }
    };
});
System.register("file:///home/matt/@mwm/describe/source/lib/test-framework", ["file:///home/matt/@mwm/describe/source/lib/remote/asserts"], function (exports_5, context_5) {
    "use strict";
    var test;
    var __moduleName = context_5 && context_5.id;
    return {
        setters: [
            function (asserts_ts_2_1) {
                exports_5({
                    "assertEquals": asserts_ts_2_1["assertEquals"],
                    "assertNotEquals": asserts_ts_2_1["assertNotEquals"]
                });
            }
        ],
        execute: function () {
            exports_5("test", test = (label, implementation) => Deno.test(label, implementation));
        }
    };
});
System.register("file:///home/matt/@mwm/describe/source/lib/inspect", [], function (exports_6, context_6) {
    "use strict";
    var inspect;
    var __moduleName = context_6 && context_6.id;
    return {
        setters: [],
        execute: function () {
            exports_6("inspect", inspect = (literals, ...values) => {
                const inspectedValues = values.map((o) => Deno.inspect(o));
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
            });
        }
    };
});
System.register("file:///home/matt/@mwm/describe/source/app/utils", [], function (exports_7, context_7) {
    "use strict";
    var map, mapV, ifElse, peak, isString, longerThan, isEmpty, splitAt, has, hasOwnOrDefault;
    var __moduleName = context_7 && context_7.id;
    return {
        setters: [],
        execute: function () {
            exports_7("map", map = (f) => (as) => as.map(f));
            exports_7("mapV", mapV = (f) => (...as) => as.map(f));
            exports_7("ifElse", ifElse = (predicate) => (whenTrue) => (whenFalse) => (a) => (predicate(a) ? whenTrue(a) : whenFalse(a)));
            exports_7("peak", peak = (a) => {
                return a;
            });
            exports_7("isString", isString = (a) => typeof a === "string");
            exports_7("longerThan", longerThan = (n) => (as) => as.length > n);
            exports_7("isEmpty", isEmpty = (as) => as.length === 0);
            exports_7("splitAt", splitAt = (n) => (as) => [as.slice(0, n), as.slice(n)]);
            exports_7("has", has = (k) => (a) => Object.prototype.hasOwnProperty.call(a, k));
            exports_7("hasOwnOrDefault", hasOwnOrDefault = (prop) => (def) => (obj) => has(prop)(obj) ? obj[prop] : def);
        }
    };
});
System.register("file:///home/matt/@mwm/describe/source/app/describe", ["file:///home/matt/@mwm/describe/source/lib/test-framework", "file:///home/matt/@mwm/describe/source/lib/inspect", "file:///home/matt/@mwm/describe/source/app/utils"], function (exports_8, context_8) {
    "use strict";
    var test_framework_ts_1, inspect_ts_1, utils_ts_1;
    var __moduleName = context_8 && context_8.id;
    async function describe(prefix, implementation) {
        const assert = Object.assign(makeAssert(test_framework_ts_1.assertEquals), {
            not: makeAssert(test_framework_ts_1.assertNotEquals),
        });
        return test_framework_ts_1.test(prefix, async () => implementation({ assert, inspect: inspect_ts_1.inspect }));
    }
    exports_8("describe", describe);
    function makeAssert(assert) {
        return async (plan) => {
            const p = await plan;
            const expected = utils_ts_1.hasOwnOrDefault("expected")(true)(p);
            const { actual, given = inspect_ts_1.inspect `${utils_ts_1.hasOwnOrDefault("value")(actual)(p)}`, should = inspect_ts_1.inspect `be ${expected}`, message = `given ${given}; should ${should}`, } = p;
            return assert(actual, expected, message);
        };
    }
    exports_8("makeAssert", makeAssert);
    return {
        setters: [
            function (test_framework_ts_1_1) {
                test_framework_ts_1 = test_framework_ts_1_1;
            },
            function (inspect_ts_1_1) {
                inspect_ts_1 = inspect_ts_1_1;
            },
            function (utils_ts_1_1) {
                utils_ts_1 = utils_ts_1_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("file:///home/matt/@mwm/describe/module", ["file:///home/matt/@mwm/describe/source/app/describe"], function (exports_9, context_9) {
    "use strict";
    var __moduleName = context_9 && context_9.id;
    return {
        setters: [
            function (describe_ts_1_1) {
                exports_9({
                    "describe": describe_ts_1_1["describe"]
                });
            }
        ],
        execute: function () {
        }
    };
});

const __exp = __instantiate("file:///home/matt/@mwm/describe/module", false);
export const describe = __exp["describe"];

