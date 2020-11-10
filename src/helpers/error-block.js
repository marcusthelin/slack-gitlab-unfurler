function errorBlock(id) {
    return [
        {
            type: 'section',
            text: {
                type: 'mrkdwn',
                text: `Could not unfurl URL 😿`,
            },
        },
    ];
}

module.exports = errorBlock;
