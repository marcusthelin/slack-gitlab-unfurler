function getOrError(name) {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Env variable ${name} not set!`);
    }
    return value;
}

exports.GITLAB_TOKEN = getOrError('GITLAB_TOKEN');
exports.GITLAB_GRAPHQL_URL = getOrError('GITLAB_GRAPHQL_URL');
exports.SLACK_OAUTH_TOKEN = getOrError('SLACK_OAUTH_TOKEN');
