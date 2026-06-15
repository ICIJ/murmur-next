<p align="center">
<a href="https://icij.github.io/murmur/">
  <img src="https://github.com/ICIJ/murmur/raw/master/lib/assets/images/murmur-dark.png" width="158px">
</a>
<br>
Murmur is <a href="https://icij.org">ICIJ</a>'s Design System for Bootstrap 5 and Vue.js
</p>

<div align="center">

|                    | Status                                                                                                                                                   |
|-------------------:|:---------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Github Actions** | ![Github Actions](https://github.com/ICIJ/murmur-next/actions/workflows/main.yml/badge.svg)                                              |
|    **NPM version** | [![NPM version](https://img.shields.io/npm/v/@icij/murmur-next)](https://www.npmjs.com/package/@icij/murmur-next)                                        |
|  **NPM downloads** | [![NPM download](https://img.shields.io/npm/dm/@icij/murmur-next)](https://www.npmjs.com/package/@icij/murmur-next)                                      |

</div>


## Installation guide

If you are using module bundlers such as Webpack or Vite, you might need to include the package into your project.
To get started, use NPM or Yarn to get latest version of **@icij/murmur**.

```bash
# with NPM:
npm i @icij/murmur-next

# or with Yarn:
yarn add @icij/murmur-next
```
Then, register Murmur as a plugin in your app entry point:

```js
import {createApp} from 'vue'
import Murmur from '@icij/murmur-next'


const app = createApp({})
app.use(Murmur)
```

Now all components will be globally available in your app.
[Read the documentation](https://icij.github.io/murmur/) to know how to use them.

## Importing components

`@icij/murmur-next` ships a tree-shakable ESM build. Import only the components you
use and your bundler drops the rest — including each component's styles:

```js
import { ButtonIcon } from '@icij/murmur-next'
```

Each component pulls in only its own scoped styles, so unused components and their CSS never reach your bundle. As with any Bootstrap 5 design system, your app still needs the Bootstrap base styles and Murmur's design tokens; the aggregate `@icij/murmur-next/dist/lib/murmur.css` bundles those (along with every component's styles), but importing it opts out of per-component CSS tree-shaking.

### Using the global plugin

The all-in plugin still registers every component at once:

```js
import { createApp } from 'vue'
import Murmur from '@icij/murmur-next'

const app = createApp({})
app.use(Murmur)
```

> **Migration note:** when using the ESM build, `app.use(Murmur)` registers
> components but no longer guarantees the aggregate stylesheet is loaded for you.
> If you relied on the single bundled stylesheet, import it explicitly:
>
> ```js
> import '@icij/murmur-next/dist/lib/murmur.css'
> ```
>
> The UMD/CDN build (`dist/lib/murmur.umd.cjs`) is unchanged and still bundles all styles.

### Dependencies note

One runtime dependency, [`vue-headroom`](https://github.com/caro3801/vue-headroom)
(used by `AppHeader`), is installed directly from GitHub because it is not
published to the npm registry. Installing `@icij/murmur-next` will fetch it from
GitHub; this requires network access to GitHub at install time.

## Build Setup

``` bash
# install dependencies
yarn

# serve documentation with hot reload at localhost:8080
yarn serve

# build library and documentation for production with minification
yarn build

# build storybook documentation for production 
yarn build-storybook

# publish a version of the package on NPM registry
yarn publish

# run unit tests
yarn test
```
