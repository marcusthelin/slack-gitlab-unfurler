const express = require('express');
const { isEmpty } = require('lodash');
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

    /**
     * Slack expects an HTTP 200 within 3 seconds and retries the event (up to
     * 3 times) otherwise; apps that keep failing to respond get their event
     * subscription disabled. Acknowledge right away, then do the GitLab and
     * Slack work after the response has been sent.
     */
    res.sendStatus(200);

    if (req.get('x-slack-retry-num')) {
        // A retry of an event we already acknowledged (our ack was slow). The
        // original delivery is still being processed; don't unfurl it twice.
        return;
    }

    const { event } = req.body;
    if (!event || !Array.isArray(event.links)) {
        return;
    }
    const unfurlData = {};

    for (const link of event.links) {
        const urlData = getDataFromUrl(link.url);
        if (!urlData) {
            continue;
        }
        const { projectFullPath, type, id, rest } = urlData;
        const handler = unfurlHandlers[type];
        if (handler) {
            const unfurlBlocks = await handler(projectFullPath, id, rest);
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
            .then(() => console.log(`unfurled ${Object.keys(unfurlData).join(', ')}`))
            .catch(console.log);
    }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
