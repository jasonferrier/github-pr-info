require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT

app.get('/', (req, res) => {
  res.send('This is the root of the server. Hit the `/open-pull-requests` endpoint for Github PR info.')
})

app.listen(port, () => {
  console.log(`Node API listening at http://localhost:${port}`)
})

app.get('/open-pull-requests', (req, res, next) => {
  const repositoryUrl = req.query.repositoryUrl
  res.send(`Repository URL: ${repositoryUrl}`)
})