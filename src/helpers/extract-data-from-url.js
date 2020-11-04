function extractDataFromUrl(url) {
    const { pathname } = new URL(url);
    const regex = /\/(\w+.+)\/-\/(\w+)\/(.*)/;

    try {
        const [_, projectPath, type, id] = regex.exec(pathname);
        return {
            projectFullPath: projectPath,
            type,
            id,
        };
    } catch (error) {
        return null;
    }
}

module.exports = extractDataFromUrl;
