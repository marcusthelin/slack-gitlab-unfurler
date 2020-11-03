function extractDataFromUrl(url) {
    const { pathname } = new URL(url);
    const regex = /(\w*\/\w*)\/-\/(\w*)\/([A-Za-z0-9]+)/;

    const [_, projectPath, type, id] = regex.exec(url);

    return {
        projectFullPath: projectPath,
        type,
        id,
    };
}

module.exports = extractDataFromUrl;
