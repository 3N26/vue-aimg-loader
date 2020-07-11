const sizeOf = require('image-size');

const imgCache = new Map(
    // [
    //     'imgUrl',
    //     {
    //         width: 0,
    //         height: 0,
    //         type: 'png',
    //         firstCache: ''
    //     }
    // ]
);

const fileCache = new Map(
    // [
    //     'filePath',
    //     {
    //         template: {
    //             code: '',
    //         },
    //         script: {
    //             code: '',
    //         },
    //         css: {
    //             code: '',
    //             index: 0,
    //         }
    //     },
    // ]
);

function getFile(filePath) {
    return fileCache.get(filePath) || fileCache.set(filePath, {
        template: {
            code: '',
        },
        style: {
            code: ''
        }
    }).get(filePath);
}

function getImgData(url, filePath) {
    let imgData = imgCache.get(url);
    if (!imgData) {
        imgData = sizeOf(url);
        imgData.firstCache = filePath;
        imgCache.set(url, imgData)
    }
    return imgData
}

module.exports = {
    getFile,
    getImgData,
}