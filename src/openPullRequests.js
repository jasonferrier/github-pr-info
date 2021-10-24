export const openPullRequests = (req, res) => {
  const repositoryUrl = req.query.repositoryUrl
  res.send(`Repository URL: ${repositoryUrl}`)
}