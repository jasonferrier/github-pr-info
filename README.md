# github-pr-info
Node API to access Github PR information
## Requirements
Utilizing the Github [REST API](https://docs.github.com/en/rest), create an API that:
* Uses Node.js
* Accepts a Github repository URL as a query parameter `?repositoryUrl=https://github.com/username/repository`
* Returns info for the open pull requests in a Github repository
* For **each open PR**, return the number of commits by making multiple requests via the Github REST API.
* Has one or more endpoints
* Implements a testing strategy

## Getting Started
1) Install depencies: `npm install`
2) Rename the `.env.sample` file to `.env`
3) Start the Express server: `npm run dev`