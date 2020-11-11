function extractDataFromUrl(url) {
    const { pathname } = new URL(url);
    const regex = /\/(?<fullPath>\w+.+)\/-\/(?<type>\w+)\/(?<id>\d*)\/*(?<rest>.*)/;
    
    try {
        const { groups } = regex.exec(pathname);
        if (!groups) {
            return null;
        }
        return {
            projectFullPath: groups.fullPath,
            type: groups.type,
            id: groups.id,
            rest: groups.rest,
        };
    } catch (error) {
        return null;
    }
}

module.exports = extractDataFromUrl;
