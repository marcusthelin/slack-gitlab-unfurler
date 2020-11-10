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
                text: `Could not unfurl URL 😿`,
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
                    createdAt
                    mergedAt
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

        let { title, description, author, milestone, state, createdAt, mergedAt } = data;
        let jiraLinks = [];
        const assignee = data.assignees.nodes.map(user => user.name)[0] || 'No assignee';
        let stateEmoji;

        if (!milestone || !milestone.title) {
            milestone = { title: 'No milestone' };
        }

        if (description) {
            const regex = /http(s)?:\/{0,2}([a-zA-Z0-9-_]*)\.atlassian\.\w+\/browse\/(?<issue>[A-Za-z0-9-_]+)/g;
            description.split(/\s+/g).forEach(word => {
                const match = regex.exec(word);
                if (match) {
                    jiraLinks.push({ url: match[0], issue: match.groups.issue });
                }
            });
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
        const fields = [
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
                    // Status. If merged also display date of merge.
                    {
                        type: 'mrkdwn',
                        text: `*Status:*\n${capitalize(state)} ${stateEmoji} ${
                            mergedAt ? `_(${new Date(mergedAt).toLocaleDateString('sv-se')})_` : ''
                        }`,
                    },
                    {
                        type: 'mrkdwn',
                        text: `*Assignee:*\n${assignee}`,
                    },
                ],
            },
        ];
        if (jiraLinks.length) {
            // Render jira links
            const linksMarkdown = jiraLinks.map(link => `<${link.url}|${link.issue}>`).join('\n');
            fields.push({
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: `*Jira issues:*\n${linksMarkdown}`,
                },
            });
        }
        // Render a context displaying merge request creation date
        fields.push({
            type: 'context',
            elements: [
                {
                    type: 'plain_text',
                    text: `Created ${new Date(createdAt).toLocaleDateString('sv-se')}`,
                    emoji: true,
                },
            ],
        });
        return fields;
    } catch (error) {
        return errorBlock(id);
    }
}

module.exports = getMergeRequestData;
