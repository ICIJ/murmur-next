<p align="center">
<a href="https://icij.github.io/murmur/">
  <img src="https://github.com/ICIJ/murmur/raw/main/lib/assets/images/murmur-dark.png" width="158px">
</a>
<br>
Murmur is <a href="https://icij.org">ICIJ</a>'s Design System for Bootstrap 5 and Vue.js
</p>

<div align="center">

|                    | Status                                                                                                                                                   |
|-------------------:|:---------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Github Actions** | ![Github Actions](https://github.com/ICIJ/murmur/actions/workflows/main.yml/badge.svg)                                              |
|    **NPM version** | [![NPM version](https://img.shields.io/npm/v/@icij/murmur)](https://www.npmjs.com/package/@icij/murmur)                                        |
|  **NPM downloads** | [![NPM download](https://img.shields.io/npm/dm/@icij/murmur)](https://www.npmjs.com/package/@icij/murmur)                                      |

</div>


## Installation guide

If you are using module bundlers such as Webpack or Vite, you might need to include the package into your project.
To get started, use NPM or Yarn to get latest version of **@icij/murmur**.

```bash
# with NPM:
npm i @icij/murmur

# or with Yarn:
yarn add @icij/murmur
```
Then, register Murmur as a plugin in your app entry point:

```js
import {createApp} from 'vue'
import Murmur from '@icij/murmur'


const app = createApp({})
app.use(Murmur)
```

Now all components will be globally available in your app.
[Read the documentation](https://icij.github.io/murmur/) to know how to use them.

## Importing components

`@icij/murmur` ships a tree-shakable ESM build. Import only the components you use and your bundler drops the rest:

```js
import { ButtonIcon } from '@icij/murmur'
```

Each component automatically imports its own styles, so the components you use bring their CSS with them and unused components — and their CSS — never reach your bundle. There is no separate Murmur stylesheet to import.

Murmur is a Bootstrap 5 design system: its components are styled on top of Bootstrap 5, so your app still needs to provide Bootstrap 5's own CSS, as it always has. Murmur's per-component styles only cover what Murmur adds on top.

If you would rather load every component's styles from a single file — for example in a UMD/CDN page — the aggregate stylesheet is still published:

```js
import '@icij/murmur/dist/lib/murmur.css'
```

Importing the aggregate pulls in every component's styles at once, so it opts out of per-component CSS tree-shaking.

### Using the global plugin

The all-in plugin still registers every component at once and loads their styles automatically:

```js
import { createApp } from 'vue'
import Murmur from '@icij/murmur'

const app = createApp({})
app.use(Murmur)
```

> **Upgrading:** the ESM build now imports each component's CSS automatically, so a manual `import '@icij/murmur/dist/lib/murmur.css'` is no longer required for Murmur's component styles. The UMD/CDN build (`dist/lib/murmur.umd.cjs`) is unchanged.

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
