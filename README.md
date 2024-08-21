# typesense-js [![NPM version][npm-image]][npm-url] ![downloads](https://img.shields.io/npm/dt/typesense?label=downloads)

Javascript client library for accessing the [Typesense HTTP API](https://github.com/typesense/typesense).

This library can be used both on the server-side and on the client-side. The library's [source](/src) is in ES6 and during build time, generate two artifacts - [one](/lib) that is transpiled to ES5 that can be used on the server-side and [another](/dist) that can be used on the client side.

## Installation

#### Option 1: Install via npm

```sh
npm install --save typesense
```

Install peer dependencies:
```sh
npm install --save @babel/runtime
```

Note: `@babel/runtime` is very a common dependency among many JS libraries. So instead of each library adding it as a dependency independently (which will cause multiple instances of `@babel/runtime` to be installed increasing bundle size), Babel's recommendation is that the libraries ask users to install it once as a direct dependency, so there's only one copy of `@babel/runtime` for the entire project. In some cases, your JS framework might already include `@babel/runtime` as a dependency.

#### Option 2: Include the minified JS file for use in the browser directly

```html
<script src="dist/typesense.min.js"></script>
```

or via jsDelivr

```html
<script src="https://cdn.jsdelivr.net/npm/typesense@1/dist/typesense.min.js"></script>
```

## Usage

Read the documentation here for detailed examples: [https://typesense.org/docs/api/](https://typesense.org/docs/api/)

Tests are also a good place to know how the library works internally: [test](test)

**Note: When using this library in a browser, please be sure to use an API Key that only allows search operations instead of the `master` API key.** See [doc/examples/server/keys.js](doc/examples/server/keys.js) for an example of how to generate a search only API key.

See [Configuration.ts](src/Typesense/Configuration.ts) for a list of all client configuration options.

### Examples

Here are some examples with inline comments that walk you through how to use the client: [doc/examples](doc/examples)

To run the examples, from the repo root:

```bash
npm run typesenseServer
node doc/examples/server/bulkImport.js
```

## GatsbyJS Integration

If you use [GatsbyJS](https://www.gatsbyjs.com/) for a framework, we have a plugin (that uses typesense-js behind the scenes) to automatically push your site data to Typesense when you build your site. Learn more [here](https://github.com/typesense/gatsby-plugin-typesense).

## Firebase Integration

If you use [Firebase](https://firebase.google.com/), we have a Firebase extension (that uses typesense-js behind the scenes) to automatically push your Firestore data to Typesense. Learn more [here](https://github.com/typesense/firestore-typesense-search).

## Building UI components

Checkout the [Typesense-InstantSearch.js](https://github.com/typesense/typesense-instantsearch-adapter) (which uses typesense-js) for UI components you can use to quickly build powerful instant search experiences.

## Compatibility

This table refers to server=>client compatibility. Newer versions of the client library maintain backwards compatibility with older versions of the server library.

| Typesense Server | typesense-js |
|------------------|--------------|
| \>= v27.0.rc20   | \>= v2.0.0   |
| \>= v0.26.0.rc38 | \>= v1.8.0   |
| \>= v0.25.0      | \>= v1.7.0   |
| \>= v0.24.0      | \>= v1.5.0   |
| \>= v0.23.0      | \>= v1.3.0   |
| \>= v0.21.0      | \>= v0.14.0  |
| \>= v0.20.0      | \>= v0.12.0  |
| \>= v0.19.0      | \>= v0.11.0  |
| \>= v0.18.0      | \>= v0.10.0  |
| \>= v0.17.0      | \>= v0.9.0   |
| \>= v0.16.0      | \>= v0.8.0   |
| \>= v0.15.0      | \>= v0.7.0   |
| \>= v0.12.1      | \>= v0.5.0   |
| \>= v0.12.0      | \>= v0.4.7   |
| <= v0.11         | <= v0.3.0    |

## Development

After checking out the repo, run `npm install` to install dependencies. Then run `npm test` to run the linter and tests.

To release a new version, we use the [np](https://github.com/sindresorhus/np) package:

```shell
$ npm install --global np
$ np

# Follow instructions that np shows you

```

## Contributing

Bug reports and pull requests are welcome on GitHub at [https://github.com/typesense/typesense-js](https://github.com/typesense/typesense-js).

[npm-image]: https://badge.fury.io/js/typesense.svg
[npm-url]: https://npmjs.org/package/typesense
