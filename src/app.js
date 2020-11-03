const express = require('express');
const { reduce } = require('async');
const getDataFromUrl = require('./helpers/extract-data-from-url');

const bot = require('./helpers/bot');

const app = express();

const unfurlHandlers = {
    merge_requests: require('./lib/get-merge-request-data'),
};

app.use(express.json());

app.post('/unfurl', async (req, res) => {
    /**
     * If body has a challenge field we just want to return
     * that data. This is a verifaction process from Slack.
     */
    if (req.body.challenge) {
        return res.send(req.body.challenge);
    }

    const { links = [] } = req.body.event;
    const { event } = req.body;
    const unfurlData = {};

    for await (const link of links) {
        const { projectFullPath, type, id } = getDataFromUrl(link.url);
        const handler = unfurlHandlers[type];
        let unfurlBlocks;
        if (handler) {
            unfurlBlocks = await handler(projectFullPath, id);
        }
        unfurlData[link.url] = { blocks: unfurlBlocks };
    }

    await bot.chat
        .unfurl({
            channel: event.channel,
            ts: event.message_ts,
            unfurls: unfurlData,
        })
        .catch(console.log);
    res.end();
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
