import express from 'express'
import { openPullRequestsInfo } from './openPullRequests.js'

const app = express()

app.get('/', (req, res) => {
  res.send('This is the root of the server. Hit the `/open-pull-requests` endpoint for Github PR info.')
})

app.get('/open-pull-requests', (req, res) => {
  openPullRequestsInfo(req, res)
})

export default app
