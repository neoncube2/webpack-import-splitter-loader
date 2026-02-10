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

This loader makes it so that the code is split like we might have expected, with `getSanitizedFilename()` and `mapAndFilter()` being placed into `dist/dynamic-module.js` and `getRandomInt()` into `dist/main.js`.

**Limitations**
* Non-ESM modules are skipped.
