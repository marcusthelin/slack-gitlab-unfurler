const getDataFromUrl = require('../extract-data-from-url');
describe('Merge request data handling', () => {
    it('Can extract data from merge request url', async () => {
        const extractedData = getDataFromUrl(
            'https://gitlab.24hr.se/resurs/site/-/merge_requests/913'
        );
        expect(extractedData).toBeInstanceOf(Object);
        expect(extractedData).toHaveProperty('projectFullPath');
        expect(extractedData).toHaveProperty('type');
        expect(extractedData).toHaveProperty('id');
        expect(extractedData.projectFullPath).toBe('resurs/site');
        expect(extractedData.type).toBe('merge_requests');
        expect(extractedData.id).toBe('913');
    });
});
