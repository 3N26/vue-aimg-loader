module.exports = function genStylePlaceholder(file, content, opt) {
    if (!file.style.code) return '';
    // 获取占位style的index
    const index = `${(content.match(/<\/style>/g) || []).length}`;
    file.style.index = index;
    // 插入占位style
    return `\n<style ${opt.scoped ? 'scoped' : ''}>/* MAGIC_AUTO_IMG */</style>\n`;
}