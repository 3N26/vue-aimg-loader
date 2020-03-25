const loaderUtils = require('loader-utils');
const url = require('url');
const templateTransform = require('./templateTransform')
const cssTransform = require('./cssTransform')

module.exports = function (content, sourceMap) {
    const ctx = this;
    // ctx.async()
    // ctx.cacheable(true)
    const opt = Object.assign({
            unit: 'px',
            imgPath: 'src/asset/img',
            pxToUnitRate: 1,
            configMap: {
                'contain': ''
            },
        },
        loaderUtils.getOptions(ctx)
    )
    console.log('ctx.resourceQuery', ctx.resourceQuery)
    const query = url.parse(ctx.resourceQuery, true).query;
    if (query.type === 'template') {
        return templateTransform(ctx, content, opt);
    }
    if (query.type === 'style') {
        return cssTransform(ctx, content, opt);
    }
    ctx.callback(null, content, sourceMap);
};


// `
// remainingRequest
// /src/App.vue

// /src/App.vue?vue&type=template&id=7ba5bd90&
// `

// `
// precedingRequest

// /node_modules/cache-loader/dist/cjs.js??ref--0-0!
// /node_modules/vue-loader/lib/index.js??vue-loader-options

// node_modules/css-loader/index.js??ref--10-oneOf-1-1!
// node_modules/vue-loader/lib/loaders/stylePostLoader.js!
// node_modules/postcss-loader/src/index.js??ref--10-oneOf-1-2!
// node_modules/less-loader/dist/cjs.js??ref--10-oneOf-1-3!
// node_modules/cache-loader/dist/cjs.js??ref--0-0!
// node_modules/vue-loader/lib/index.js??vue-loader-options
// `