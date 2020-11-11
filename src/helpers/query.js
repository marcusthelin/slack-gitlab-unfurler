const axios = require('axios').default;
const config = require('../config');
const { graphqlClient } = require('./api-client');

module.exports = data => {
    return graphqlClient.post(
        '/',
        { query: data },
        {
            headers: {
                'content-type': 'application/json',
            },
        }
    );
};
