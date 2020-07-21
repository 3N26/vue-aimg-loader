const cache = require('../../cache');
const getImgUrl = require('../../img');

module.exports = function getStyleCode({
    ctx,
    className,
    opt,
    tagName = '',
    unset
}) {
    const filePath = ctx.resourcePath;
    const [isExit, url, reUrl] = getImgUrl(ctx, className, opt);
    if (!isExit) return '';
    // 获取图片数据
    const img = cache.getImgData(url, filePath);
    // 是否复用全局图片class
    if (
        // 没有使用scoped
        !opt.scoped &&
        // 当前文件不是第一个加载这张图片
        img.firstCache !== filePath
    ) return '';
    let backgroundImage = unset ? 'unset' : `url(${reUrl})`;
    // 返回style代码
    return `${tagName}.${className} {\n` +
        `   height: ${img.height * opt.rate}${opt.unit};\n` +
        `   width: ${img.width * opt.rate}${opt.unit};\n` +
        `   background-image: ${backgroundImage};\n` +
        `}\n`;
}