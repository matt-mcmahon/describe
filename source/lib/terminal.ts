export const { columns, rows } = typeof Deno?.consoleSize === "function"
  ? Deno.consoleSize(Deno.stdout.rid)
  : { columns: 80, rows: 43 };
