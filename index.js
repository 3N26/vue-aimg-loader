const url = require('url');
const loaderUtils = require('loader-utils');
const qs = require('querystring')
const cache = require('./cache')
const getBlockCode = require('./block');
const {
    genCode,
    genStylePlaceholder
} = require('./genCode');

function initOpt(ctx) {
    const opt = Object.assign({
            imgDir: 'src/asset/img',
            prefix: 'bg-',
            extendTypes: [],
            scoped: false,
            pxToUnitRate: 1,
            unit: 'px',
        },
        loaderUtils.getOptions(ctx)
    )
    opt.imgTypes = ['png', 'jpg', 'jpeg'].concat(opt.extendTypes);
    return opt;
}

module.exports = function (content) {
    const ctx = this;
    const opt = initOpt(ctx);
    const file = cache.getFile(ctx.resourcePath);
    const query = qs.parse(ctx.resourceQuery.slice(1));
    if (query.type) {
        return getBlockCode({
            file,
            query,
            content
        })
    }
    [file.template.code, file.style.code] = genCode({
        content,
        ctx,
        opt
    });
    // 插入占位style
    return content + genStylePlaceholder(file, content, opt);
};