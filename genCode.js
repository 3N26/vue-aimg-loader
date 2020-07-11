const cache = require('./cache');
const getImgUrl = require('./img');

function getTemplate(content) {
    const templateReg = /<template>[\s\S]*<\/template>/;
    const commentReg = /<!--[<\s\S>]*?-->/g;
    const [otemplate] = content.match(templateReg) || [''];
    const template = otemplate.replace(commentReg, '');
    return template;
}

function genStylePlaceholder(file, content, opt) {
    if (!file.style.code) return '';
    // 获取占位style的index
    const index = `${(content.match(/<\/style>/g) || []).length}`;
    file.style.index = index;
    // 插入占位style
    return `\n<style ${opt.scoped ? 'scoped' : ''}>/* MAGIC_AUTO_IMG */</style>\n`;
}

function genCode({
    content,
    ctx,
    opt
}) {
    let styleCode = '';
    let templateCode = '';
    const filePath = ctx.resourcePath;
    const template = getTemplate(content);
    const imgClassReg = new RegExp(`<(\\w+)[^>]*?(${opt.prefix}\\w+)[^>]*?>`, 'g');
    templateCode = template.replace(imgClassReg, (startTag, tag, clxss) => {
        // 获取图片路径
        const [isExit, url, reUrl] = getImgUrl(ctx, clxss, opt);
        if (!isExit) return startTag;
        let useTagScope = false;
        let backgroundImage = `url(${reUrl})`;
        if (tag === 'img') {
            // 有src的话就不处理
            if (startTag.includes('src=')) return startTag;
            // 添加src属性
            startTag = startTag.replace(/(\/?>)$/, ` src="${reUrl}" $1`);
            // 使用标签css作用域
            useTagScope = true;
            // 复写已存在的class背景属性
            backgroundImage = `unset`;
        };
        // 获取图片数据
        const img = cache.getImgData(url, filePath);
        // 是否复用全局图片class
        if (
            // 没有使用scoped
            !opt.scoped &&
            // 当前文件不是第一个加载这张图片
            img.firstCache !== filePath
        ) return startTag;
        // 拼接style代码
        styleCode += `${useTagScope ? tag : ''}.${clxss} {\n` +
            `   height: ${img.height * opt.pxToUnitRate}${opt.unit};\n` +
            `   width: ${img.width * opt.pxToUnitRate}${opt.unit};\n` +
            `   background-image: ${backgroundImage};\n` +
            `}\n`;
        return startTag;
    });
    return [templateCode, styleCode];
}

module.exports = {
    genCode,
    genStylePlaceholder
}