# Overview

Let's say that our project has a `util.js` file with several functions in it and a dynamicallly loaded module that calls some of those functions:

**util.js**
```js
export function getRandomInt() {...}
export function getSanitizedFilename() {...}
export function mapAndFilter() {...}
```

**index.js**
```js
import { getRandomInt } from './util.js';

const dynamicallyImportedModule = import('./dynamic-module.js');
```

**dynamic-module.js**
```js
import { getSanitiedFilename, mapAndFilter} from './util.js';
```

After compiling, we end up with two chunks, `dist/main.js` and `dist/dynamic-module.js`. We might expect that the code of `getSanitizedFilename()` and `mapAndFilter()` would end up in `dist/dynamic-module.js` and `getRandomInt()` in `dist/main.js`, but in actually, the code of every function in `util.js` is placed in `dist/main.js`.

This loader makes it so that the code is split like we might have expected, with `getSanitizedFilename()` and `mapAndFilter()` being placed into `dist/dynamic-module.js` and `getRandomInt()` into `dist/main.js`. This can decrease the size of your main bundle, especially if you have a lot of functions that are called by your dynamically loaded module and are not called elsewhere.

# Setup
## Installation
Install `webpack-import-splitter-loader` as a dev dependency (`yarn add webpack-import-splitter-loader -D` or `npm install webpack-import-splitter-loader -D`)

## Add loader to `webpack.config.js`
```js
module: {
  rules: [
    {
      test: /\.(js|jsx|mjs)$/,
      use: [
        process.env.NODE_ENV === 'production' &&
        {
          loader: 'webpack-import-splitter-loader'
        }
        // ...(other loaders)
      ]
    }
  ]
  // ...
}
```

## Add VirtualUrlPlugin to `webpack.config.js`
`webpack-import-splitter-loader` relies on `Webpack.experiments.schemes.VirtualUrlPlugin`, and I haven't yet figured out how to have the loader dynamically add it, so for now, you also need to add this plugin to `webpack.config.js`:
```js
plugins: [
  new Webpack.experiments.schemes.VirtualUrlPlugin(
    {
      '__unused__': ''
    },
    'webpack-import-splitter-loader'
  )
// ...
]
```

# Limitations
* Non-ESM modules are skipped.
