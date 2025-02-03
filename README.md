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
| **Github Actions** | ![Github Actions](https://github.com/ICIJ/murmur-next/actions/workflows/deploy-github-pages.yaml/badge.svg)                                              |
|   **Code Climate** | [![Code Climate](https://api.codeclimate.com/v1/badges/e487295b939be72d5f15/maintainability)](ttps://codeclimate.com/github/ICIJ/murmur/maintainability) |
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
