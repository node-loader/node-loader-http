# @node-loader/http

A [nodejs loader](https://nodejs.org/dist/latest-v13.x/docs/api/esm.html#esm_experimental_loaders) for loading modules over the network with http/https.

## Installation

```sh
npm install --save @node-loader/http

# Or, if you prefer Yarn
yarn add --save @node-loader/http
```

NodeJS 16.12 changed the Node Loader API. If using NodeJS@<16.12, please use `@node-loader/http@1`. Otherwise, use `@node-loader/http@latest`.

## Usage

Create a file that imports a module over http:

```js
import * as singleSpa from "http://unpkg.com/single-spa@5.5.5/lib/esm/single-spa.dev.js";
```

Now run node with the `--experimental-loader` flag:

```sh
node --experimental-loader @node-loader/http file.js
```

## Semantics

This project uses [node-fetch](https://github.com/node-fetch/node-fetch) to implement familiar HTTP semantics,
including http redirects, https redirects, HTTP status checks, etc. Customizing the behavior of node-fetch is
planned, but not yet implemented.

## Composition

If you wish to combine http loader with other NodeJS loaders, you may do so by using [node-loader-core](https://github.com/node-loader/node-loader-core).
