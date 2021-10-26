# github-pr-info
Node API to access Github PR information.
JSON data is returned from the endpoint with a subset of key/value pairs than the Github REST API returns for each Pull Request (to reduce the amount of data sent back to the client):
* `number` - Pull Request Number
* `title
* `body`
* `commits` - number of commits associated to the PR
* `commits_url` - API URL for all data associated with each commit
* `url` - URL for viewing the Pull Request in the browser in HTML format
* `created_at` - Timestamp of Pull Request creation
* `updated_at` - Timestamp of Pull Request latest update

## Requirements
Utilizing the Github [REST API](https://docs.github.com/en/rest), create an API that:

✅ &nbsp; Uses Node.js

✅ &nbsp; Accepts a Github repository URL as a query parameter
   ```?repositoryUrl=https://github.com/username/repository```

✅ &nbsp; Returns info for the open pull requests in a Github repository

✅ &nbsp; For **each open PR**, return the number of commits by making multiple requests via the Github REST API.

✅ &nbsp; Has one or more endpoints

✅ &nbsp; Implements a testing strategy

## Getting Started
1) Install depencies: `npm install`
2) Rename the `.env.sample` file to `.env`
3) Add your Github Personal Access Token in the `.env` file (instructions linked there)
4) Start the Express server: `npm run watch:dev`
    *Note: This will run with nodemon and automatically restart the server when there are changes to the src/ files*

## To Run Unit Tests
Currently, there is only one unit test on the function validating the repositoryUrl query parameter to ensure it is a valid Github repository URL format. It does not query the Github API to verify that it is public, your Github Personal Access Token has permissions to access that repository, et al.

To run Jest to see the test results and code coverage:
```npm run test```
