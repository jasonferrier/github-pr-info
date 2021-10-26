import fetch from 'node-fetch'
import createThrottle from 'async-throttle'
const throttle = createThrottle(5)

const apiBase = 'https://api.github.com'
const fetchOptions = {
  method: 'GET',
  headers: {
    authorization: `token ${process.env.GITHUB_PERSONAL_ACCESS_TOKEN}`,
    accept: 'application/vnd.github.v3+json',
    'User-Agent': 'jasonferrier/github-pr-info'
  }
}

export const getUserAndRepo = (url) => {
  // This assumes a valid github URL in the format https://github.com/USERNAME/REPOSITORY
  let owner = ''
  let repo = ''

  const splitUrlArray = url.split('github.com/')
  if (splitUrlArray.length > 1) {
    const path = splitUrlArray[1]
    const splitPathArray = path.split('/')
    owner = splitPathArray.length > 0 ? splitPathArray[0] : ''
    repo = splitPathArray.length > 1 ? splitPathArray[1] : ''
  }

  return {
    owner: owner,
    repo: repo
  }
}

const getNextFromLink = (link) => {
  const decodedHeader = link ?
    Object.fromEntries(
      link.split(/\s*,\s*/).map(r => {
        const m = r.match(/<([^>]+)>;\s*rel="([^\"]+)"/);
        return [m[2], m[1]];
      })
    ) : {}

  return decodedHeader['next']
}

const fetchPaginatedData = async(url, options) => {
  let next = url;
  let results = []

  do {
    const response = await fetch(next, options)
    // https://docs.github.com/en/rest/guides/traversing-with-pagination
    const link = await response.headers.get('link')
    const json = await response.json()
    if (json.message && json.message === 'Not Found') {
      results = [{error: 'There was an error retrieving your data.'}]
      next = null
    } else {
      results = results.concat(json)
      next = getNextFromLink(link)
    }

  } while (next)

  return results
}

export const openPullRequestsInfo = async (req, res) => {
  const repositoryUrl = req.query.repositoryUrl

  if (!repositoryUrl) {
    res.json({error: 'Please supply a repository Url in the query string.'})
    return
  }

  const repoInfo = getUserAndRepo(repositoryUrl)

  if (!repoInfo.owner || !repoInfo.repo) {
    res.json({error: 'Please supply a valid Github repository Url in the query string. (Hint: https://github.com/USERNAME/REPOSITORY)'})
    return
  }

  // NOTE: Use the following line to test pagination since there are ~162 closed PRs on the https://github.com/colinhacks/zod repository
  // const pullRequests = await fetchPaginatedData(`${apiBase}/repos/${repoInfo.owner}/${repoInfo.repo}/pulls?state=closed`, fetchOptions)
  const pullRequests = await fetchPaginatedData(`${apiBase}/repos/${repoInfo.owner}/${repoInfo.repo}/pulls`, fetchOptions)

  if (pullRequests.length === 0) {
    res.json({message: 'No open pull requests found.'})
  } else if (pullRequests.length === 1 && pullRequests[0].error) {
    res.json(pullRequests[0])
    return
  } else {
    const pullIDs = pullRequests.map(pr => pr.number)
    let numCommitsOnEachPR = []

    // Deal Github secondary rate limiting https://docs.github.com/en/rest/guides/best-practices-for-integrators#dealing-with-secondary-rate-limits
    Promise.all(pullIDs.map((pullNumber) => throttle(async () => {
      await fetchPaginatedData(`${apiBase}/repos/${repoInfo.owner}/${repoInfo.repo}/pulls/${pullNumber}/commits`, fetchOptions)
        .then(commits => {
          numCommitsOnEachPR.push({pullNumber: pullNumber, numCommits: commits.length})
        })
    })))
      .then(() => {
        // Provide response back with filtered PR information and the number of commits associated to each
        const filteredResults = pullRequests.map(pr => {
          let numCommits = 0
          const numCommitsResults = numCommitsOnEachPR.filter(nc => nc.pullNumber === pr.number)
          if (!!numCommitsResults.length) {
            numCommits = numCommitsResults[0].numCommits
          }

          return {
            number: pr.number,
            title: pr.title,
            body: pr.body,
            commits: numCommits,
            commits_url: pr.commits_url,
            url: pr.html_url,
            created_at: pr.created_at,
            updated_at: pr.updated_at
          }
        })

        res.json(filteredResults)
      })
  }
}