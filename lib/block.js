module.exports = function getBlockCode({
    file,
    query,
    content,
}) {
    if (
        query.type === `template` &&
        file.template.code
    ) {
        const templateReg = /<template>[\s\S]*<\/template>/;
        content = content.replace(templateReg, file.template.code);
        file.template.code = '';
        return content
    } else if (
        query.type === `style` &&
        query.index === file.style.index
    ) {
        content += `\n<style>\n${file.style.code}</style>\n`;
        file.style.code = ''
        return content
    }
    return content;
}