const path = require('path');
const img = require('image-size');
const {
    fileMap
} = require('./fileMap');

module.exports = function transform(ctx, content, opt) {
    const file = ctx.resourcePath;
    const imgArr = fileMap.get(file) || fileMap.set(file, []).get(file);
    return content.replace(/<template>[\s\S]*<\/template>/, template => {
        return template.replace(/bg-[\w\?&]+/g, bgClass => {
            const [baseClass, paramStr = ''] = bgClass.split('?', 2);
            let type = opt.imgDefaultType;
            let _class = paramStr.split('&').reduce((acm, param) => {
                if (img.types.includes(param)) {
                    type = param;
                } else if (param) {
                    acm += ' ' + (opt.configMap[param] || param);
                }
                return acm;
            }, baseClass)
            let url = path.join(
                opt.imgPath,
                baseClass.split('bg-')[1].replace(/_/g, '/'),
            ) + '.' + type;
            let existIndex = -1;
            const isSame = imgArr.some((img, index) => {
                if (img.class === baseClass) existIndex = index;
                return img.url === url
            })
            if (!isSame) {
                if (existIndex > -1) {
                    imgArr.splice(existIndex + 1, 1);
                }
                img.imageSize(url, (err, data) => {
                    if (err) return;
                    data.class = baseClass;
                    data.url = url;
                    imgArr.push(data);
                })
            }
            return _class;
        })
    })
}