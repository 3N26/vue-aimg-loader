module.exports = function getTag(html) {
    let imgStr = html;
    let tagStr = html;
    const res = [];
    const tags = [];
    const startTagReg = /<([a-zA-Z0-9]+)/;
    const imgClassReg = /img-\w+/;
    let index = 0;
    let pre = 0;
    while (tagStr) {
        const match = tagStr.match(startTagReg);
        if (!match) {
            tags[index - 1].end = html.length;
            break;
        };
        const name = match[1];
        const start = match.index + pre;
        const len = name.length + match.index;
        index && (tags[index - 1].end = start);
        tags[index++] = {
            name,
            start,
            class: []
        };
        tagStr = tagStr.slice(len);
        pre += len;
    }
    index = 0;
    pre = 0;
    while (imgStr) {
        const match = imgStr.match(imgClassReg);
        if (!match) break;
        const className = match[0];
        const cur = match.index + pre;
        for (let i = index; i < tags.length; i++) {
            const tag = tags[i];
            if (tag.start < cur && cur < tag.end) {
                tag.class.push(className);
                break;
            } else {
                tag.class.length && res.push(tag);
                index++;
            }
        }
        const len = className.length + match.index;
        imgStr = imgStr.slice(len);
        pre += len;
    }
    tags[index].class.length && res.push(tags[index]);
    return res;
}