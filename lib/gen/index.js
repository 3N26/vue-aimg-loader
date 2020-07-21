const getTag = require('./tag/index');
const getImgCode = require('./tag/img');
const getTemplate = require('./template/index');
const getStyleCode = require('./style/index');

module.exports = function genCode({
    content,
    ctx,
    opt
}) {
    const template = getTemplate(content);
    const tags = getTag(template);
    let templateCode = template;
    let styleCode = '';
    let advance = 0;
    tags.forEach((tag) => {
        switch (tag.name) {
            case 'img':
                [templateCode, styleCode, advance] = getImgCode({
                    ctx,
                    opt,
                    tag,
                    advance,
                    styleCode,
                    templateCode
                });
                break;
            default:
                for (let className of tag.class) {
                    styleCode += getStyleCode({
                        ctx,
                        opt,
                        className,
                    })
                }
                break;
        }
    })
    return [templateCode, styleCode];
}