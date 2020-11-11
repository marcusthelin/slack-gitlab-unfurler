const axios = require('axios').default;
const config = require('../config');

/**
 * An axios instance with a base url.
 * This will come in handy since not all API endpoints
 * have been transfered to graphql.
 */
const restClient = axios.create({
    baseURL: `${config.GITLAB_URL}/api/v4`,
    headers: {
        Authorization: `Bearer ${config.GITLAB_TOKEN}`,
    },
});

const graphqlClient = axios.create({
    baseURL: `${config.GITLAB_URL}/api/graphql`,
    headers: {
        Authorization: `Bearer ${config.GITLAB_TOKEN}`,
    },
});

exports.restClient = restClient;
exports.graphqlClient = graphqlClient;
