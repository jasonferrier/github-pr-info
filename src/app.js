import express from 'express'
import { openPullRequests } from './openPullRequests.js'

const app = express()
const port = process.env.PORT

app.get('/', (req, res) => {
  res.send('This is the root of the server. Hit the `/open-pull-requests` endpoint for Github PR info.')
})

app.get('/open-pull-requests', (req, res) => {
  openPullRequests(req, res)
})

export default app
