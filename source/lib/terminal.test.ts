import { columns, rows } from "./terminal.ts";
import { assertEquals } from "./deps/asserts.ts";

Deno.test("terminal.ts :: should export { rows: number, columns: number } ", () => {
  assertEquals(typeof rows, "number");
  assertEquals(typeof columns, "number");
});

Deno.test("terminal.ts :: { rows, columns } should not be NaN", () => {
  assertEquals(Number.isNaN(rows), false);
  assertEquals(Number.isNaN(columns), false);
});

Deno.test("terminal.ts :: { rows, columns } should be > 0", () => {
  assertEquals(rows > 0, true);
  assertEquals(rows > 0, true);
});
