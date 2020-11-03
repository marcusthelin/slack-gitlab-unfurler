const gql = require('graphql-tag');
const { capitalize } = require('lodash');
const query = require('../helpers/query');
const truncate = require('../helpers/truncate');

function errorBlock(id) {
    return [
        {
            type: 'section',
            text: {
                type: 'mrkdwn',
                text: `Something went wrong when fetching information about merge request with ID *${id}*`,
            },
        },
    ];
}

async function getMergeRequestData(projectFullPath, id) {
    const mrQuery = `
        query getMR {
            project(fullPath: "${projectFullPath}") {
                fullPath
                name
                mergeRequest(iid: "${id}") {
                    state
                    title
                    description
                    assignees {
                        nodes {
                            name
                        }
                    }
                    author {
                        name
                        avatarUrl
                    }
                    milestone {
                        title
                    }
                }
            }
        }
    `;
    try {
        const response = await query(mrQuery);
        const data = response.data.data.project.mergeRequest;
        if (!data) {
            return errorBlock(id);
        }

        let { title, description, author, milestone, state } = data;
        const assignee = data.assignees.nodes.map(user => user.name)[0] || 'No assignee';
        let stateEmoji;
        console.log('🤯 🤢 🤮: data', data);

        if (!milestone || !milestone.title) {
            milestone = { title: 'No milestone' };
        }

        if (description) {
            description = truncate(description, 200).replace(/#/g, '');
        } else {
            description = 'No description';
        }

        if (state === 'merged') {
            stateEmoji = '✅';
        } else if (state === 'opened') {
            stateEmoji = '🟢';
        } else {
            stateEmoji = '🛑';
        }

        return [
            {
                type: 'header',
                text: {
                    type: 'plain_text',
                    text: `${title}`,
                    emoji: true,
                },
            },
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: `${description}`,
                },
                ...(author.avatarUrl.startsWith('https://secure.gravatar.com') && {
                    accessory: {
                        type: 'image',
                        image_url: author.avatarUrl,
                        alt_text: author.name,
                    },
                }),
            },
            {
                type: 'section',
                fields: [
                    {
                        type: 'mrkdwn',
                        text: `*Author:*\n${author.name}`,
                    },
                    {
                        type: 'mrkdwn',
                        text: `*Milestone:*\n${milestone.title}`,
                    },
                    {
                        type: 'mrkdwn',
                        text: `*Status:*\n${capitalize(state)} ${stateEmoji}`,
                    },
                    {
                        type: 'mrkdwn',
                        text: `*Assignee:*\n${assignee}`,
                    },
                ],
            },
        ];
    } catch (error) {
        console.log('🤯 🤢 🤮: error', error);
        return errorBlock(id);
    }
}

module.exports = getMergeRequestData;
