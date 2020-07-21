const fs = require('fs');
const path = require('path');

function getImgType(url, opt) {
    let type = ''
    const imgTypes = opt.imgTypes;
    const res = imgTypes.some(ext => {
        type = `.${ext}`
        return fs.existsSync(url + type)
    })
    res || console.log(`[vue-aimg-loader] not found url: ${url}.${imgTypes.toString()}`)
    return type
}

function getImgUrl(ctx, baseClass, opt) {
    const file = ctx.resourcePath;
    const root = ctx.rootContext || process.cwd();
    const subImgPath = baseClass.split(opt.prefix)[1].replace(/_/g, '/');
    const imgPath = path.join(opt.imgDir, subImgPath);
    const absolutePath = path.join(root, imgPath).replace(/\\/g, '/');
    const relativePath = path.relative(file, absolutePath).slice(1).replace(/\\/g, '/');
    const type = getImgType(imgPath, opt)
    return [type, imgPath + type, relativePath + type];
}

module.exports = getImgUrl