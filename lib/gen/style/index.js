const cache = require('../../cache');
const getImgUrl = require('../../img');

module.exports = function getStyleCode({
    ctx,
    opt,
    className,
    styleCode,
    tagName = '',
    unset
}) {
    const filePath = ctx.resourcePath;
    const [isExit, url, reUrl] = getImgUrl(ctx, className, opt);
    if (!isExit) return styleCode;
    // 获取图片数据
    const img = cache.getImgData(url, filePath);
    // 是否复用全局图片class
    if (
        // 没有使用scoped
        !opt.scoped &&
        // 当前文件不是第一个加载这张图片
        img.firstCache !== filePath
    ) return styleCode;
    const seletor = `${tagName}.${className}`;
    // 当前styleCode是否有重复代码
    if (styleCode.includes(seletor)) return styleCode;
    // 返回style代码
    return styleCode + `${seletor} {\n` +
        `   height: ${img.height * opt.rate}${opt.unit};\n` +
        `   width: ${img.width * opt.rate}${opt.unit};\n` +
        `   background-image: ${unset ? 'unset' : `url(${reUrl})`};\n` +
        `}\n`;
}