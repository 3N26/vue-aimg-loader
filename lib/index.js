const qs = require('querystring')
const cache = require('./cache')
const initOpt = require('./init');
const getBlockCode = require('./block');
const genCode = require('./gen/index')
const genStylePlaceholder = require('./gen/style/placeholder');

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