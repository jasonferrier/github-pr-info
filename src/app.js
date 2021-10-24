const express = require('express')
const app = express()
const port = process.env.PORT
import { openPullRequests } from './openPullRequests.js'

app.get('/', (req, res) => {
  res.send('This is the root of the server. Hit the `/open-pull-requests` endpoint for Github PR info.')
})

app.get('/open-pull-requests', (req, res, next) => {
  openPullRequests(req, res)
})

export default app
