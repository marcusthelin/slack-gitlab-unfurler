const axios = require('axios').default;
const config = require('../config')

module.exports = data => {
    return axios.post(
        config.GITLAB_GRAPHQL_URL,
        { query: data },
        {
            headers: {
                Authorization: `Bearer ${config.GITLAB_TOKEN}`,
                'content-type': 'application/json',
            },
        }
    );
};
