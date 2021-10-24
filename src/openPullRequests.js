import https from 'https'

const getUserAndRepo = (url) => {
  // This assumes a valid github URL in the format https://github.com/USERNAME/REPOSITORY
  const owner = url.split('github.com/')[1].split('/')[0]
  const repo = url.split('github.com/')[1].split('/')[1]

  return {
    owner: owner,
    repo: repo
  }
}

export const openPullRequests = (req, res) => {
  const clientResponse = res
  const repositoryUrl = req.query.repositoryUrl
  const repoInfo = getUserAndRepo(repositoryUrl)
  const options = {
    hostname: 'api.github.com',
    port: 443,
    headers: {
      authorization: `token ${process.env.GITHUB_PERSONAL_ACCESS_TOKEN}`,
      accept: 'application/vnd.github.v3+json',
      'User-Agent': 'jasonferrier/github-pr-info'
    },
    path: `/repos/${repoInfo.owner}/${repoInfo.repo}/pulls`
    // Useful query string parameters:
    //    state: 'open', // default is open
    //    per_page: 30, // Default 30
    //    page: 1 // default 1
  }
  
  https.get(options, res => {
    const { statusCode } = res
    const contentType = res.headers['content-type']
    const link = res.headers['link']
    // If there are more than `per_page` results, the response will contain the Link header
    // https://docs.github.com/en/rest/guides/traversing-with-pagination

    if (link) {
      // TODO: implement pagination with subsequent queries to append the resulting data.
      console.log('There is pagination to deal with.')
    }

    let error
    // Any 2xx status code signals a successful response but
    // here we're only checking for 200.
    if (statusCode !== 200) {
      error = new Error('Request Failed.\n' +
                        `Status Code: ${statusCode}`)
    } else if (!/^application\/json/.test(contentType)) {
      error = new Error('Invalid content-type.\n' +
                        `Expected application/json but received ${contentType}`)
    }
    if (error) {
      console.error(error.message)
      // Consume response data to free up memory
      res.resume()
      return
    }

    res.setEncoding('utf8')
    let rawData = ''
    res.on('data', (chunk) => { rawData += chunk })
    res.on('end', () => {
      try {
        const parsedData = JSON.parse(rawData)
        // console.log(parsedData)
        clientResponse.json(parsedData)
      } catch (e) {
        console.error(e.message)
      }
    })
  }).on('error', (e) => {
    console.error(`Got error: ${e.message}`)
  })
}
