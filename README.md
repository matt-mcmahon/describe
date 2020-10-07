# @mwm/describe

**Describe** began life as testing framework for Node built on [TAP][tap]. It exposes a limited API in order to encourage simple, readable tests. Today, I'm bringing that same testing philosophy to Deno in a way that allows anyone to run the same unit tests in both environments.

_Describe_ has been my tool of choice when unit testing my own code, and I used it exclusively for testing several NPM packages that were part of a _NodeJS, Learn Functional Programming in JavaScript_ series. My goal was to create a functional programming library where the focus was on readable source code and easy debugging. To this end I created several modules:

1. [@mwm/sign](https://www.npmjs.com/package/@mwm/sign): a function-signing module that allows anyone to annotate functions in a way that would persist even after partial application.
2. [@mwm/functional](https://www.npmjs.com/package/@mwm/functional): a functional programming library with an API similar to Ramda, but with source code that focused on readability and clarity, instead of performance.
3. [@mwm/describe](https://www.npmjs.com/package/@mwm/describe): the unit-testing framework that's signed-function aware, and used for testing of my other modules.

### But along Came a TypeScript

Around the same time that I began these projects, [TypeScript][ts] started to really take off. The `tsc` compiler is very good at providing automatic code hints, but it's notoriously bad at typing JavaScript written in a functional style. I wasn't able to figure out a way for it to infer type information for the functions I signed with _@mwm/sign_. Losing the automatic type information negated many of the benefits that module offered and, after a while, I admitted defeat and set the projects aside... until now.

### TypeScript Turns 4

**TypeScript 4** adds a new type category, [Variadic Tuples][tuples], that make typing higher order functions much easier. Combined with a [handful of powerful utility types][advanced-types], higher order functions that had to be typed manually, can now be typed automatically. If you're a FP advocate, this addition to the language is well worth celebrating.

And who arrived just in time for the party? [Deno 1.0][deno]. Starting Deno 1.4.2, TypeScript 4 is available out of the box. There couldn't be a better time to learn a new platform, brush up on my TypeScript skills, and complete a project that I had put on hold years earlier.

## Deno First

**Describe** is a proof-of-concept example of what a Deno-first project might look like. I'm not arguing that this is the best way to tackle Deno-first, but it is _a_ way. I hope it helps convince people that Deno can provide a viable foundation for any JavaScript project.

Currently, NodeJS is the undisputed king of JavaScript and Web Development. Writing a library with broad appeal isn't currently possible if you don't support Node. You can't just drop Deno compatible TypeScript into a NodeJS project and have it work. Why? Deno requires [explicit import specifiers][explicit]. That's off-spec for TypeScript and prevents Deno TypeScript from being used as-is on Node. The Deno team has [good reasons][imp] for this deviation, but if you want to write multi-platform code, this incompatibility needs to be addressed.

Here's how I'm addressing it:

**Step one**, is to restrict platform-dependent code to `lib`-folders. This [convention](#conventions) is the first step in ensuring we can successfully use the same source-code across a number of different platforms &mdash; beginning with Deno, Node, and the Web. This approach isn't my genius idea, and should be familiar to anyone who's worked in system programing.

**Step two**, is to address Deno's incompatible import specifiers. We need some way to automatically rewrite explicit import specifiers so that they're TypeScript compliant. _Describe_ includes a naive translation script that does just that.

**Step three**, is profit! ... or at least to kick the tires, eat the dog food, hoist our own petards, and mix our metaphors. We need some idea of how maintainable this stack will be for a real project, and the only way to answer that question is to write something significant _Deno-first_.

## `> make deno`

Deno strives to be a secure runtime for JavaScript code &mdash; a script can only access the resources that you permit it to access. This security model can be compromised if you grant a script access to resources that the it shouldn't need, but remembering to type umpteen `--allow...` flags every time you `deno run` can be tedious.

**[Make][make]** is a source code management utility that's can help us securely execute our project. Using numerous make _targets_, we can always be specific in which permissions we actually need. So, instead of `deno run ...` we're going to `make <target>`.

For example, and perhaps controversially, we're going to use the `--cached-only` flag wherever possible, and rely on a local `.deno` folder that we check into source control.

### `make <target>` _makes_ all of _this_ easy

| Target       | Alias            | Description                                                                                                                                                                                                                   |
| ------------ | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `build`      |                  | Runs the `build-deno`, and `build-node` tasks.                                                                                                                                                                                |
| `build-deno` | `bundle`, `deno` | Creates a _Deno_-only, single-file bundle of the project appropriate for the cloud.                                                                                                                                           |
| `build-node` | `node`           | A _Node_-compatible build that we can upload to NPM or include as a local dependency in our other projects by running `npm link` in `./target/node/`. See the [Node README.md](./target/node/README.md) for more information. |
| `clean`      |                  | Safely deletes build artifacts and generated files. Run before `build` to start with a clean slate.                                                                                                                           |
| `cache`      |                  | Caches the project's dependencies in `DENO_DIR` for later use. Use this target, or the `configure` script, in your own projects when you want to create file system links to local dependencies.                              |
| `clean`      |                  | Deletes build artifacts and other generated files. Useful if you think you have orphaned files that are no longer needed.                                                                                                     |
| `configure`  |                  | Runs the `./configure` shell script. This script creates a `.env` file for you, and sets other configuration options.                                                                                                         |
| `format`     | `fmt`            | Formats the project source code using `deno fmt`.                                                                                                                                                                             |
| `install`    |                  | Creates `lock-file.json` if one doesn't already exist.                                                                                                                                                                        |
| `link`       |                  | Uses your Node Package Manager's `link` command (default `npm link`) to allow the built project files to be used by other local projects.                                                                                     |
| `lint`       |                  | Checks the project format using `deno fmt --check`, then runs Deno's experimental linter, `deno lint`. We don't lint test files, `*.test.ts`. We assume any lint errors in your Test code are deliberate.                     |
| `lint-quiet` |                  | Like `lint`, but less verbose.                                                                                                                                                                                                |
| `run`        |                  | Executes the project on the command line using `deno run`. **Describe** doesn't currently have an interactive component so this will appear to do nothing.                                                                    |
| `test`       |                  | Runs the unit-tests for the project using `deno test`.                                                                                                                                                                        |
| `test-quiet` |                  | Like `test`, but less verbose.                                                                                                                                                                                                |
| `test-watch` |                  | Watches the `./source` folder for file-changes and runs `make test` after each. [`inotify`][inotify] must be installed.                                                                                                       |
| `upgrade`    |                  | `--reload` the project's dependency cache and update the lock-file. This is only necessary if you change your project's dependencies!                                                                                         |

## Conventions

Our app code lives in `./source/app`, and contains platform-independent project code. We generate spec-compliant TypeScript import specifiers from the Deno-flavored TypeScript in this folder when we copy it to `./target/[platform]/source/gen`, but the code will not be otherwise modified.

All platform-dependent code is located in `lib`, or occasionally `test`, sibling folders. The `./source/lib` folder has Deno-dependent source code in it. Each platform we target has its own `lib` folder written specifically for that platform in `target/[platform]/source/lib`.

For example, the **describe** module uses `Deno.test` when it runs on Deno, but **[tap][tap]** when it runs in Node. We don't want two versions of `describe`, so platform-specific code is hidden behind a the library module, `./source/lib/test-framework.ts`. The _Test Framework_ provides a common API to desperate platform code. As long as we isolate platform specific code in `lib` folders, `app` should be compatible with any platform we wish to target.

## It's not a bundle

`deno bundle` was my first thought at a proof-of-concept demonstration, but it's not a good fit for this use. The `bundle` command generates code that's targeted at **Deno**, not other run-times. It's not a generic _export_ command, and there's no guarantee that bundling code won't introduce a dependency on some Deno-specific platform feature

Next I looked at Deno's [node standard library][node-compat]. That module allows us to run node-on-deno; we're going in the other direction.

Finally, Deno supports building and bundling pragmatically through the `Deno.bundle` and `Deno.build` runtime functions. **These functions are probably the best long-term solution for Deno-first projects, but are more than I wanted to tackle for a simple demonstration project.**

Given the above, the simplest path to compatibility ended up being a [very small shell script][shell].

Turns out, [`find`][find] and [`sed`][sed] work really well together when we need to rewrite predictable strings like import specifiers. Once rewritten, we can let the TypeScript Compiler do it's thing. This solution isn't robust &mdash; but it is _sufficient_. If Deno-first proves to be a productive way to write cross-platform TypeScript, then better tooling will come!

## Project Structure

Here are the highlights for our project's structure. Important files and folders are listed. Some of this may be **Describe**-specific, but parts may be applicable for any similar _Deno_ project.

### `./` root

The project's root folder contains:

- `./lock-file.json` &mdash; lets Deno warn us if the dependencies we've downloaded don't match the ones we originally used. Pulling in code from the internet requires trust, and by using a lockfile, Deno can tell us when that trust may have been violated.
- `./Makefile` &mdash; there's no equivalent to NPM `package.json` scripts in Deno. I don't know any program that's more powerful, easier to use, and easier to understand than _make_ and _Makefile_ for source-code management.
- `./README.md` &mdash; the file you're reading now.
- `./configure` &mdash; a shell script that walks you through creating a basic `.env`, and other files, for the project.

Like most \*nix software, you can bootstrap the application using:

```shell
> git clone git@github.com:matt-mcmahon/sign.git
> cd sign
> ./configure
> make
```

### `./.deno/`

Our local `DENO_DIR`. Maintaining a local cache lets us check-in our dependencies and improve security. After using `git clone` on the repository, you _should_ be able to use the project without running `make cache`, `make upgrade`, or downloading anything else. Requires the, `DENO_DIR` environment variable, which **make** automatically exports (if set in your `.env` file) for every task.

### `./.vscode/`

Microsoft Visual-Studio Code IDE settings, all configured for use with Deno. Note that the Deno extension for VSCode doesn't support custom `DENO_DIR` environment variable at the moment. If VSCode complains about missing imports, run `make cache` and it will safely add your project's dependencies to the global deno folder as well.

### `./source/`

Our project's source code. Contains three sub folders:

### `./source/app/`

Platform-independent source code. Imports platform-dependent code from the `lib` sibling folder. We need to use explicit import specifiers in this folder, but otherwise should avoid any platform-specific code.

### `./source/lib/`

Each platform we _target_ will have it's own version of the `lib` folder in `target/[platform]/source/lib` that exports to a common interface. This folder contains library code that was written to run on _Deno_, and isn't copied, compiled, or transformed when building modules for other platforms. It's assumed that every target needs platform-specific library code.

### `./source/test/`

Like `./source/lib/` test contains platform-specific unit tests. General tests should be co-located with your source code in `app/` so that they can be run on every platform you target. Tests located here won't be copied or translated for other platforms by `make build`.

### `./target/<platform>`

Contains platform-specific build **targets** for our various **platform**s; e.g. a folder for _Node_, the _Web_, etc.

### `./target/node/`

The Node-compatible build for our project. It can be published to NPM, or `pm link` as a local dependency in other Node modules.

- `source/` &mdash; generated and platform specific source code for NodeJS.
  - `gen/` &mdash; Node compatible TypeScript code, generated from `./source/app`. See [Why not `bundle`](#why-not-bundle), above, for more information. Do not manually edit these files.
  - `lib/` &mdash; project dependencies and Node-specific code is found here. Modules in _lib_ export a platform-agnostic public interface but may use platform-dependent code internally. These files are not automatically generated and need to be created manually.
  - `test/` &mdash; if you need to write Node- or NPM-specific tests, add them here. Like `lib`, this folder won't be overwritten by `make node`.
  - `index.ts` &mdash; becomes the module entry-point for `package.json::main`, after compilation.
  - `types.d.ts` &mdash; becomes the type definitions for `package.json::types`, after compilation.
- `build/` &mdash; Node CommonJS _source_ files compiled by `tsc`.
  - `index.js` &mdash; entry-point for `package.json::main`.
  - `types.d.ts` &mdash; type definitions for `package.json::types`.
- `README.md` &mdash; NPM-specific documentation for the project.
- `tsconfig.json` &mdash; TypeScript configuration. We're targeting CommonJS as the module format until the situation with Node & ESM settles down. A second `tsconfig.production.json` is included for the production build.
- `package.json`, etc. The _Node_ module is independent of the Deno parent module, so we can use different linting rules, testing conventions, etc., if desired.

[ts]: https://www.typescriptlang.org/
[tap]: https://node-tap.org/
[deno]: https://deno.land/
[make]: https://www.gnu.org/software/make/
[sed]: https://www.gnu.org/software/sed/manual/sed.html
[tuples]: https://github.com/microsoft/TypeScript/pull/39094
[node-compat]: https://deno.land/std/node/README.md
[shell]: https://www.urbandictionary.com/define.php?term=go%20away%20or%20I%20will%20replace%20you%20with%20a%20simple%20shell%20script
[imp]: https://youtu.be/M3BM9TB-8yA?t=836
[advanced-types]: https://www.freecodecamp.org/news/typescript-curry-ramda-types-f747e99744ab/
[find]: https://www.gnu.org/software/findutils/
[explicit]: https://deno.land/manual/getting_started/typescript#using-typescript
[inotify]: https://man7.org/linux/man-pages/man7/inotify.7.html
