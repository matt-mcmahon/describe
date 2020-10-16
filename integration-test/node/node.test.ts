import { assertEquals } from "../../source/lib/remote/asserts.ts";

testModule("@mwm/describe");

function testModule(moduleId: string) {
  Deno.test(
    `integration: require("${moduleId}")`,
    makeTest(`require("${moduleId}");`, "commonjs"),
  );
  Deno.test(
    `integration: import "${moduleId}"`,
    makeTest(`import "${moduleId}";`, "module"),
  );
}

function makeTest(script: string, inputType: "commonjs" | "module") {
  const cmd = ["node", "--input-type", inputType, "-e", script];
  return async () => {
    const p = Deno.run({ cmd, stdout: "piped", stderr: "piped" });
    const stderr = await p.stderrOutput();
    const stdout = await p.output();
    const actual = await p.status();
    p.close();

    const td = new TextDecoder();
    const expected = { success: true, code: 0 };
    const message = td.decode(stderr) + td.decode(stdout);
    assertEquals(actual, expected, message);
  };
}
