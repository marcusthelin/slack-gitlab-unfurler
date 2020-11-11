# Slack GitLab Unfurler
A server to unfurl GitLab links from Slack.

## What is unfurl?
Unfurling is the term Slack uses for displaying crawled data from a link under the message.

## When to use this server?
I created this server because Slack couldn't unfurl links from private GitLab repositories. For example when me and my team sends links to merge requests, we would just see the Sign In page as the unfurled data. With this solution, it will render information about the merge request.

# How to use it
## Gitlab token
Genereate a personal access token from your Gitlab account.

## Slack bot setup
First of all you'll need to create a Slack bot and install it on a Workspace. Obtain the Bot User OAuth Access Token.
Make sure to set the **Bot Token Scopes** to `links:read` and `links:write`.
![Obtain oAuth token](./assets/images/oauth.png)

Go to Event Subscriptions and enable it, then enter the request URL. The url should be something like: `http(s)://<your-domain>/unfurl`. The important part is the `/unfurl` path. This is where all events and Slack's challenge request ends up. **This will not work unless server is started. See [Start the server](#start-the-server)
![Events](./assets/images/events.png)**
Scroll down to **Subscribe to events on behalf of users** and add the scope `link_shared`.
Finally, on the same page, under **App unfurl domains** add the domains the events should happen on. E.g `gitlab.com`.

## Environment variables
```shell
GITLAB_TOKEN
GITLAB_URL - Full url to your Gitlab instance. E.g https://gitlab.com
SLACK_OAUTH_TOKEN
PORT - What port the server should run on.
```

## Start the server
The server can be most easily started by running the Docker image.
```shell
docker run -d -p 5000:5000 \
-e GITLAB_TOKEN=<your token> \
-e GITLAB_URL=<url to your gitlab instance>
-e SLACK_OAUTH_TOKEN=<slack bot oauth token> \
-e PORT=5000 \
marcusthelin/slack-gitlab-unfurler:latest
```

# Supported unfurls
## Merge request information. 

Can show the following if information exists:
- Title
- Description
- Author
- Milestone
- Merge status
- Assignee
- Pipeline status
- Jira issues found in description text 

![Merge request](assets/images/merge_request.png)

## Pipeline information. 

Can show the following if information exists:
- ID with a link to the pipeline
- Status
- User that started the pipeline
- Branch

![Pipeline status](assets/images/pipeline.png)

# Changelog
## 2.x.x 
Breaking changes! GITLAB_GRAPHQL_URL environment variable has been replaced with GITLAB_URL. You will now only need to pass the url to your Gitlab instance.