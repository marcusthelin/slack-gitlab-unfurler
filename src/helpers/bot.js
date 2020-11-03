const Slack = require('slack');
const config = require('../config');

const bot = new Slack({
    token: config.SLACK_OAUTH_TOKEN,
});

module.exports = bot;
