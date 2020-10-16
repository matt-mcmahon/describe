# @mwm/describe

**Describe** began its life as a humble testing framework for Node. It exposes a limited subset of [TAP][tap]'s API in order to encourage simple, readable tests. Today, I'm bringing that same testing philosophy to [Deno][deno] in a way that allows anyone to run the same unit tests in both environments.

## Our Story so Far

_Describe_ has been my tool of choice when unit testing my own code, and I used it exclusively for testing several NPM packages that were part of a _NodeJS, Learn Functional Programming in JavaScript_ series. My goal was to create a functional programming library where the focus was on readable source code and easy debugging. To this end I created several modules:

1. [@mwm/sign](https://www.npmjs.com/package/@mwm/sign): a function-signing module that could annotate functions and allow automatic partial application.
2. [@mwm/functional](https://www.npmjs.com/package/@mwm/functional): a functional programming library with a Ramda-compatible API, but with simpler source code that focused on readability and clarity, instead of performance.
3. [@mwm/describe](https://www.npmjs.com/package/@mwm/describe): a unit-testing framework that's **sign**ed-function aware, but can be used for testing any style of JavaScript.

### Then Along Came a TypeScript

Around the same time that I began these projects, [TypeScript][ts] started to really take off. The `tsc` compiler is very good at providing automatic code hints, but it's notoriously difficult to type JavaScript written in a functional style.

I wasn't able to figure out a way for it to infer type information for the functions I signed with _@mwm/sign_, and losing the automatic type information negated many of the benefits that module offered. After a while, I admitted defeat and set the projects aside... until now.

### TypeScript Turns 4

**TypeScript 4** adds a new type category, [Variadic Tuples][tuples], that make typing higher order functions much easier. Combined with a [handful of powerful utility types][advanced-types], higher order functions that had to be typed manually, can now be typed automatically. If you're a FP advocate, this addition to the language is well worth celebrating.

And who arrived just in time for the party? [Deno!][deno] Combining better security with built-in TypeScript and super fast code quality tools? Deno has the potential to become the next goto tool for JavaScript development. And in version 1.4.2, Deno supported TypeScript 4. I couldn't imagine a better time to learn a new platform, brush up on my TypeScript skills, and dust off a project I had to put on hold years earlier.

## Deno First

**Describe** is a great project to test out a Deno-first development strategy. It's a testing framework that doesn't try to reinvent the wheel, but rather simplifies existing tools. Deno has it's own unit-testing, code coverage, and linting tools all built in, so _Describe_ is well placed to unify testing between Node and Deno.

It's also the first module in what will become a series of Deno-first projects. Once this module is minimally complete, I'll bring the same Deno-first development to [@mwm/functional] and [@mwm/sign].

The argument here isn't that this is the best way to tackle Deno-first development. Rather its to explore Deno's capabilities as cross-platform JavaScript development environment.

NodeJS is the king of JavaScript development, and that's not likely to change anytime soon. As such, no library can really have broad appeal if it doesn't support Node. That's where we hit our first wrinkle. You can't just drop Deno compatible TypeScript into a NodeJS project and have it work. Why? Deno requires [explicit import specifiers][explicit]. That's off-spec for TypeScript and prevents Deno TypeScript from being used as-is by Node. The Deno team has [good reasons][imp] for this deviation, but if you want to write multi-platform code, this incompatibility needs to be addressed.

Here's how I'm addressing it:

**Step one, restrict platform-dependent code to `lib`-folders.** This [convention](#conventions) is essential if we want to use the same source-code on platforms with different capabilities &mdash; beginning with Deno, Node, and the Web. Hiding platform incompatibilities behind library code isn't my genius idea, and should be familiar to anyone who's worked in system programing.

**Step two, address Deno's off-spec import specifiers.** We need some way to automatically rewrite explicit import specifiers so that they're TypeScript compliant. _Describe_ includes a naive translation script that does just that.

**Step three, profit!** ... or at least to kick the tires, eat the dog food, hoist our own petards, and mix our metaphors. How maintainable is this stack actually going to be? We can't know without using _Deno-first_ to create something significant, using a mix of local and remote repositories, all while maintaining good NPM support &mdash; not a short order.

## `> make deno`

Deno is only as secure as you run it, but remembering to type umpteen `--allow...` flags every time you `deno run` is tedious. **[Make][make]** is an ubiquitous source code management utility that can help us securely run and administrate programming projects. Using `make`, we can always be specific in which permissions we actually need. So, instead of `deno run ...` we're going to `make <target>`

### `make <target>` _makes_ all of _this_ easy

| Target                 | Alias | Description                                                                                                                                                                                               |
| ---------------------- | ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `all`                  |       | Runs the `clean`, `install`, `build` and `test-all` targets.                                                                                                                                              |
| `build`                |       | Creates a Deno `bundle`, and then copies and transforms the source-code for other `target/*` platforms.                                                                                                   |
| `bundle.js`            |       | Creates a Deno-only, single-file bundle of the project appropriate for the cloud. You can rename `bundle.js` by setting `DENO_BUNDLE_FILE` in `.env`.                                                     |
| `cache`                |       | Caches the project's dependencies in `DENO_DIR` and in your global Deno cache (so that IDEs like VSCode know what's in them).                                                                             |
| `clean`                |       | Safely deletes build artifacts and common un-tracked files. Run before `build` to start with a clean slate.                                                                                               |
| `configure`            |       | Runs the `./configure` shell script. This script creates a `.env` file for you, and sets other configuration options.                                                                                     |
| `deno`                 |       | Runs `bundle` then `test-deno`                                                                                                                                                                            |
| `do-build-targets`     |       | Run `make` on all `target/<platform>` folders. See: <https://github.com/matt-mcmahon/describe/issues/4>                                                                                                   |
| `do-integration-tests` |       | Run `make` on all `integration-tests/<test>` folders.                                                                                                                                                     |
| `format`               | `fmt` | Formats the project source code using `deno fmt`.                                                                                                                                                         |
| `install`              |       | Creates `lock-file.json` if one doesn't already exist.                                                                                                                                                    |
| `integration-tests/*`  |       | Run an integration-test.                                                                                                                                                                                  |
| `lint`                 |       | Checks the project format using `deno fmt --check`, then runs Deno's experimental linter, `deno lint`. We don't lint test files, `*.test.ts`. We assume any lint errors in your Test code are deliberate. |
| `lint-quiet`           |       | Like `lint`, but less verbose.                                                                                                                                                                            |
| `lock-file.json`       |       | Create `lock-file.json` for the project. You can rename `lock-file.json` by setting `LOCK_FILE` in `.env`.                                                                                                |  |
| `run`                  |       | Executes the project on the command line using `deno run`. **Describe** doesn't currently have an interactive component so this will appear to do nothing.                                                |
| `target/*`             |       | Clean, build, and test a target platform.                                                                                                                                                                 |
| `test`                 |       | Runs tests for Deno version of the project only, using `deno test`.                                                                                                                                       |
| `test-all`             |       | Runs all tests for the project, including `integration-tests/*` and `target/*` tests.                                                                                                                     |
| `test-quiet`           |       | Like `test`, but less verbose.                                                                                                                                                                            |
| `test-watch`           |       | Watches the `./source` folder for file-changes and runs `make test` after each. [`inotify`][inotify] must be installed.                                                                                   |
| `transform`            |       | Transforms the Deno-TypeScript into spec-compliant TypeScript and copies into `target/node/gen`. See <https://github.com/matt-mcmahon/describe/issues/5>                                                  |
| `upgrade`              |       | `--reload` the project's dependency cache and update the lock-file. This is only necessary if you change your project's dependencies!                                                                     |

## Conventions

Our app code lives in `./source/app`, and contains platform-independent project code. We generate spec-compliant TypeScript import specifiers from the Deno-flavored TypeScript in this folder when we copy it to `./target/[platform]/source/gen`, but the code will not be otherwise modified.

All platform-dependent code is located in `lib`, or occasionally `test`, sibling folders. The `./source/lib` folder has Deno-dependent source code in it. Each platform we target has its own `lib` folder written specifically for that platform in `target/[platform]/source/lib`.

For example, the **describe** module uses `Deno.test` when it runs on Deno, but **[tap][tap]** when it runs in Node. We don't want two versions of `describe`, so platform-specific code is hidden behind a the library module, `./source/lib/test-framework.ts`. The _Test Framework_ provides a common API to desperate platform code. As long as we isolate platform specific code in `lib` folders, `app` should be compatible with any platform we wish to target.

## It's not a bundle

`deno bundle` was my first thought at a proof-of-concept demonstration, but it's not a good fit for this use. The `bundle` command generates code that's targeted at **Deno**, not other run-times. It's not a generic _export_ command, and there's no guarantee that bundling code won't introduce a dependency on some Deno-specific platform feature

Next I looked at Deno's [node standard library][node-compat]. That module allows us to run node-on-deno; we're going in the other direction.

Finally, Deno supports building and bundling pragmatically through the `Deno.bundle` and `Deno.build` runtime functions. **These functions are probably the best long-term solution for Deno-first projects, but are more than I wanted to tackle for a simple demonstration project.**

Given the above, the simplest path to compatibility ended up being a [very small shell script][shell].

Turns out, [`find`][find] and [`sed`][sed] work really well together when we need to rewrite predictable strings like import specifiers. Once rewritten, we can let the TypeScript Compiler do it's thing. This solution isn't robust &mdash; but it is _sufficient_. If Deno-first proves to be a productive way to write cross-platform TypeScript, then the efficiency and dependency gains for using the `Deno.bundle` and `Deno.build` will be well worth exploring.

## Project Structure

Here are the highlights for our project's structure. Important files and folders are listed. Some of this may be **Describe**-specific, but parts may be applicable for any similar _Deno_ project.

### `./` root

The project's root folder contains:

- `./lock-file.json` &mdash; lets Deno warn us if the dependencies we've downloaded don't match the ones we originally used. Pulling in code from the internet requires trust, and by using a lockfile, Deno can tell us when that trust may have been violated.
- `./Makefile` &mdash; there's no equivalent to NPM `package.json` scripts in Deno. I don't know of any source-code management program that's more ubiquitous, more powerful, easier to use, and easier to understand than `make`.
- `./README.md` &mdash; the file you're reading now.
- `./configure` &mdash; a shell script that walks you through setting up _Describe_ on your local machine. It creates basic `.env`, and other files for your version of the project.

Like most \*nix software, you can bootstrap the application using:

```shell
> git clone git@github.com:matt-mcmahon/describe.git
> cd describe
> ./configure
> make
```

### `./.deno/`

Our local `DENO_DIR`. Maintaining a local cache lets us check-in our dependencies and improve security. After using `git clone` on the repository, you _should_ be able to use the project without running `make cache`, `make upgrade`, or downloading anything else. Requires the, `DENO_DIR` environment variable, which `make` automatically exports (if set in your `.env` file) for every task.

### `./.vscode/`

Microsoft Visual-Studio Code IDE settings, all configured for use with Deno. Note that the Deno extension for VSCode doesn't support custom `DENO_DIR` environment variable at the moment. If VSCode complains about missing imports, run `make cache` and it will safely add your project's dependencies to the global Deno folder as well as updating the local `.deno` cache.

### `./source/`

Our project's source code. Contains three sub folders:

### `./source/app/`

Platform-independent source code. Imports platform-dependent code from the `lib` sibling folder. We need to use explicit import specifiers in this folder, but otherwise should avoid any platform-specific code.

### `./source/lib/`

Each platform we _target_ will have it's own version of the `lib/` folder, `target/[platform]/source/lib/`, that exports to a common interface. `lib/` contains library code that was written to run on _Deno_, and isn't copied, compiled, or transformed when generating source code for other platforms. It's assumed that every target needs its own platform-specific library code.

### `./source/test/`

Like `./source/lib/`, `test/` contains platform-specific unit tests. General tests should be co-located with your source code in `app/` so that they can be run on every platform you target. Tests located here won't be copied or translated for other platforms by `make build`.

### `./target/<platform>`

Contains platform-specific build **targets** for our various **platform**s; e.g. a folder for _Node_, the _Web_, etc.

### `./target/node/`

The Node-compatible build for our project. It can be published to NPM, or `pm link` as a local dependency in other Node modules.

- `source/` &mdash; generated and platform specific source code for NodeJS.
  - `gen/` &mdash; Node compatible TypeScript code, generated from `./source/app`. See [Why not `bundle`](#why-not-bundle), above, for more information. **Do not edit these files.**
  - `lib/` &mdash; project dependencies and Node-specific code is found here. Modules in _lib_ export a platform-agnostic public interface but may use platform-dependent code internally. These files are not automatically generated and need to be created manually.
  - `test/` &mdash; if you need to write Node- or NPM-specific tests, add them here. Like `lib/`, this folder isn't overwritten by `make node`.
  - `index.ts` &mdash; becomes the module entry-point for `package.json::main`, after compilation.
  - `types.d.ts` &mdash; becomes the type definitions for `package.json::types`, after compilation.
- `build/` &mdash; Node CommonJS _source_ files compiled by `tsc`.
  - `index.js` &mdash; entry-point for `package.json::main`.
  - `types.d.ts` &mdash; type definitions for `package.json::types`.
- `README.md` &mdash; NPM-specific documentation for the project.
- `tsconfig.json` &mdash; TypeScript configuration. We're targeting CommonJS as the module format until the situation with Node & ESM settles down. A second `tsconfig.production.json` is included for the production build.
- `package.json`, etc. The _Node_ module is independent of the Deno parent module, so we can use different linting rules, testing conventions, etc., if desired.

## Try it yourself

Use the folder structure above in your own projects, and copy `./configure` and `Makefile`. Most of the configuration you'll need is in the `.env` file, and it's my hope that this structure can be useful for every kind of JavaScript project imaginable!

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
[@mwm/sign]: https://www.npmjs.com/package/@mwm/sign
[@mwm/functional]: https://www.npmjs.com/package/@mwm/functional
[@mwm/describe]: https://www.npmjs.com/package/@mwm/describe
