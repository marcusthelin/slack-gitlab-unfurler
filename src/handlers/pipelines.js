const gql = require('graphql-tag');
const { capitalize } = require('lodash');
const { restClient } = require('../helpers/api-client');
const truncate = require('../helpers/truncate');
const errorBlock = require('../helpers/error-block');

const textByStatus = {
    success: {
        text: 'passed',
        emoji: '✅',
    },
    failed: {
        text: 'failed',
        emoji: '🛑',
    },
    canceled: {
        text: 'canceled',
        emoji: '✋',
    },
    skipped: {
        text: 'skipped',
        emoji: ':shrug:',
    },
};

function getStatusValue(status) {
    if (textByStatus[status]) {
        return textByStatus[status];
    } else {
        return { text: status, emoji: '' };
    }
}

/**
 * Pipelines does not support graphql with the ID from the URL.
 * Will use the REST endpoint for now.
 */
async function pipelineHandler(projectFullPath, id, rest) {
    try {
        const url = `/projects/${encodeURIComponent(projectFullPath)}/pipelines/${id}`;
        const res = await restClient.get(url).catch(console.log);
        const { status, ref, id: pipelineId, web_url, user } = res.data;
        const { text: statusText, emoji: statusEmoji } = getStatusValue(status);
        return [
            {
                type: 'header',
                text: {
                    type: 'plain_text',
                    text: `Pipeline #${pipelineId} ${statusEmoji}`,
                    emoji: true,
                },
            },
            {
                type: 'section',
                fields: [
                    {
                        type: 'mrkdwn',
                        text: `*ID:*\n<${web_url}|#${id}>`,
                    },
                    {
                        type: 'mrkdwn',
                        text: `*Status:*\n${capitalize(statusText)}`,
                    },
                    {
                        type: 'mrkdwn',
                        text: `*Branch:*\n${ref}`,
                    },
                    {
                        type: 'mrkdwn',
                        text: `*Started by:*\n${user.name}`,
                    },
                ],
            },
        ];
    } catch (error) {
        console.log(error);
        return errorBlock(id);
    }
}

module.exports = pipelineHandler;
