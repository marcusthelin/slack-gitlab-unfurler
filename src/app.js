const express = require('express');
const { isEmpty } = require('lodash');
const { reduce } = require('async');
const getDataFromUrl = require('./helpers/extract-data-from-url');

const bot = require('./helpers/bot');

const app = express();

const unfurlHandlers = {
    merge_requests: require('./handlers/merge-requests'),
    pipelines: require('./handlers/pipelines'),
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
        const urlData = getDataFromUrl(link.url);
        if (!urlData) {
            return;
        }
        const { projectFullPath, type, id, rest } = urlData;
        const handler = unfurlHandlers[type];
        let unfurlBlocks;
        if (handler) {
            unfurlBlocks = await handler(projectFullPath, id, rest);
            unfurlData[link.url] = { blocks: unfurlBlocks };
        }
    }
    if (!isEmpty(unfurlData)) {
        await bot.chat
            .unfurl({
                channel: event.channel,
                ts: event.message_ts,
                unfurls: unfurlData,
            })
            .catch(console.log);
    }

    res.status(500);
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
