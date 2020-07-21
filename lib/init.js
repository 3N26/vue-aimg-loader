const loaderUtils = require('loader-utils');

module.exports = function initOpt(ctx) {
    const opt = Object.assign({
            imgDir: 'src/asset/img',
            prefix: 'img-',
            unit: 'px',
            rate: 1,
            scoped: false,
            extendTypes: [],
        },
        loaderUtils.getOptions(ctx)
    )
    opt.imgTypes = ['png', 'jpg', 'jpeg'].concat(opt.extendTypes);
    return opt;
}