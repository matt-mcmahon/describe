const getEnVar = (varName: string, varDefault: string) =>
  Number.parseInt(Deno.env.get(varName) || varDefault, 10);

export const { columns, rows } = typeof Deno?.consoleSize === "function"
  ? Deno.consoleSize(Deno.stdout.rid)
  : { columns: getEnVar("COLS", "80"), rows: getEnVar("ROWS", "43") };
