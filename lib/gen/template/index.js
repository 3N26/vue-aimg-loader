module.exports = function getTemplate(content) {
    const templateReg = /<template>[\s\S]*<\/template>/;
    const commentReg = /<!--[<\s\S>]*?-->/g;
    const [otemplate] = content.match(templateReg) || [''];
    const template = otemplate.replace(commentReg, '');
    return template;
}