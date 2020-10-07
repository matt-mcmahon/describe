# @mwm/describe

> This is preview release, and doesn't currently do public/private exports.

_Describe_ is a thin wrapper around [Tap][01] that automates many of the common conventions I use when testing software. Specifically:

1. Each module has a dedicated subfolder.
2. The module's source and tests live in that same folder.
3. _Public_ exports are made by the module's `index.js` file.
4. Exports from any other file are _private_ to that module and should never be
   imported by _sibling_ or _parent_ modules.

For example:

- `../module/module.js` may import from `./helper.js`, but may not import from
  `../sibling/helper.js`.
- `../module/module.js` may import from `../sibling/index.js`.

[01]: https://node-tap.org/
