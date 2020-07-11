# vue-aimg-loader

![vue-aimg-loader](https://github.com/chenxinan/vue-aimg-loader/blob/master/doc/banner.jpg)

## Installation

```bash
npm i -D vue-aimg-loader

yarn add --dev vue-aimg-loader
```

## Basic configuration

### webpack

```js
// webpack.config.js
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
    module: {
        rules: [
            // ... other rules
            {
                test: /\.vue$/,
                use: [
                    { loader: 'vue-loader' },
                    {
                        loader: 'vue-aimg-loader',
                        options: {
                            imgDir: 'src/asset/img',
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        // make sure to include the plugin!
        new VueLoaderPlugin(),
    ],
};
```

### Vue CLI

```js
module.exports = {
    chainWebpack: (config) => {
        config.module
            .rule('vue')
            .use('vue-aimg-loader')
            .loader('vue-aimg-loader')
            .tap(() => {
                return {
                    imgDir: 'src/asset/img',
                };
            })
            .end();
    },
};
```

## Example usage

### vue

```vue
<template>
    <div id="app">
        <div class="img-logo" />
        <img class="img-logo" />
        <div class="img-test_logo" />
    </div>
</template>
```

### recommend global css

```css
[class^='img-'] {
    object-fit: contain;
    background-size: contain;
}
```

## Option

### imgDir

-   type: `String`
-   default: `src/asset/img`

Path to the folder containing the image file.

### prefix

-   type: `String`
-   default: `img-`

class prefix.

### unit

-   type: `String`
-   default: `px`

image size unit.

### rate

-   type: `String`
-   default: `1`

image size rate.

### scoped

-   type: `Boolean`
-   default: `false`

If `true`, image style will be scoped.

### extendTypes

-   type: `Array`
-   default: `[]`

default types are `['png', 'jpg', 'jpeg']`, you can use `extendTypes` to extend it.

## License

MIT License
