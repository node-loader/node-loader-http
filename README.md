# @node-loader/http

A [nodejs loader](https://nodejs.org/dist/latest-v13.x/docs/api/esm.html#esm_experimental_loaders) for loading modules over the network with http/https.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

**Table of Contents** _generated with [DocToc](https://github.com/thlorenz/doctoc) (`npx doctoc README.md`)_

- [Installation](#installation)
- [Usage](#usage)
  - [Configure cache behaviour](#configure-cache-behaviour)
- [Semantics](#semantics)
- [Composition](#composition)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

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

### Configure cache behaviour

Override default `make-fetch-happen` [options](https://github.com/npm/make-fetch-happen#--make-fetch-happen-options) via specifying the `HTTP_IMPORT_CACHING` (`opts.cache`) environment variable, and/or the `HTTP_IMPORT_CACHDIR` (`opts.cachePath`) environment variable.

```sh
HTTP_IMPORT_CACHING=default \
HTTP_IMPORT_CACHDIR=.local-cache \
node --experimental-loader @node-loader/http file.js
```

## Semantics

This project uses [make-fetch-happen](https://github.com/npm/make-fetch-happen) to implement familiar HTTP semantics,
including http redirects, https redirects, HTTP status checks, etc.

## Composition

If you wish to combine http loader with other NodeJS loaders, you may do so by using [node-loader-core](https://github.com/node-loader/node-loader-core).
