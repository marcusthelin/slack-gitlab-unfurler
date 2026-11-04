const config = require('../config');

/**
 * Minimal Slack Web API client. Posts JSON with the token in the
 * Authorization header (Slack's recommended form) using Node's built-in
 * fetch (Node 18+). Exposes the same call shape as before: bot.chat.unfurl({...}).
 */
async function call(method, args) {
    const res = await fetch(`https://slack.com/api/${method}`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${config.SLACK_OAUTH_TOKEN}`,
            'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(args),
    });
    const body = await res.json();
    if (!body.ok) {
        const err = new Error(body.error || `HTTP ${res.status}`);
        err.response = body;
        throw err;
    }
    return body;
}

module.exports = {
    chat: {
        unfurl: args => call('chat.unfurl', args),
    },
};
