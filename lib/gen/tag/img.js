const getImgUrl = require('../../img');
const getStyleCode = require('../style/index');

const IMG_TAG_LEN = 4;

module.exports = function getImgCode({
    ctx,
    opt,
    tag,
    advance,
    styleCode,
    templateCode,
}) {
    const start = tag.start + IMG_TAG_LEN + advance;
    const end = tag.end + advance;
    const tagStr = templateCode.slice(tag.start, end);
    // 原本已经有src的话就不处理
    if (tagStr.includes('src=')) return;
    let src = ''
    const staticClass = tagStr.match(/[^:]class=['"](.+)['"]/);
    const dynamicClass = tagStr.match(/:class=(['"].+['"])/);
    // 如果匹配上静态class就使用第一个匹配到的图片
    // 处理静态class
    if (staticClass && staticClass[1]) {
        const classStr = staticClass[1];
        const className = tag.class.find((cn) => classStr.includes(cn));
        // 有匹配的class
        if (className) {
            const [isExit, _, reUrl] = getImgUrl(ctx, className, opt);
            // 存在图片
            if (isExit) {
                styleCode = getStyleCode({
                    ctx,
                    opt,
                    className,
                    styleCode,
                    tagName: 'img',
                    unset: true,
                });
                // 让其他loader获取最终路径
                src = ` src="${reUrl}" `;
            }
        }
    }
    // 如果匹配上动态class就使用表达式显示图片
    // 处理动态class
    if (!src && dynamicClass && dynamicClass[1]) {
        const dynamicSrc = ` :src=${dynamicClass[1]} `;
        const newSrc = tag.class.reduce((acm, className) => {
            const [isExit, _, reUrl] = getImgUrl(ctx, className, opt);
            const hit = acm.includes(className);
            // 有匹配的class且存在图片
            if (hit && isExit) {
                styleCode = getStyleCode({
                    ctx,
                    opt,
                    className,
                    styleCode,
                    tagName: 'img',
                    unset: true,
                });
            }
            // 使用webpack require Api 获取图片最终路径
            // 注意：如果不存在该图片，使用require会报错
            if (hit) {
                const classReg = new RegExp(`(['"])${className}\\1`);
                acm = acm.replace(classReg, `require($1${reUrl}$1)`);
            }
            return acm
        }, dynamicSrc);
        if (dynamicSrc !== newSrc) {
            src = newSrc;
        }
    }
    // 生成template代码
    if (src) {
        templateCode = templateCode.slice(0, start) + src + templateCode.slice(start);
        // 加位
        advance += src.length;
    }
    return [templateCode, styleCode, advance];
}