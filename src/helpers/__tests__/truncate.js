const truncate = require('../truncate');

describe('String truncate', () => {
    it('Truncates string longer than 5', () => {
        const string = 'Hej jag heter Marcus';
        expect(truncate(string, 5)).toBe('Hej j...');
    });
});
