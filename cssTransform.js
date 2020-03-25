// const path = require('path');
const {
    fileMap
} = require('./fileMap');

module.exports = function transform(ctx, content, opt) {
    const imgArr = fileMap.get(ctx.resourcePath);
    if (!imgArr) return content;
    return content.replace('<\/style>', END_TAG => {
        let res = imgArr.reduce((acm, img) => {
            return `
            .${img.class} {
                height: ${img.height * opt.pxToUnitRate}${opt.unit};
                width: ${img.width * opt.pxToUnitRate}${opt.unit};
                background-image: url(~@root/${img.url});
            }
            ` + acm;
        }, END_TAG);
        // imgArr.length = 0;
        return res;
    });
}