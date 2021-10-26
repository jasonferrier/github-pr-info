import { getUserAndRepo, getNextFromLink, openPullRequestsInfo, openPullRequests } from './openPullRequests'

describe('', () => {
  test('Receives good Github Repository URL', () => {
    const url = "https://github.com/username/repository"
    const res = getUserAndRepo(url)
    expect(res.owner).toEqual('username')
    expect(res.repo).toEqual('repository')
  })

  test('Receives bad Github Repository URL', () => {
    const url = 'https://test.domain/username/repository'
    const res = getUserAndRepo(url)
    expect(res.owner).toEqual('')
    expect(res.repo).toEqual('')
  });

  test('Receives bad Github Repository URL - missing repository', () => {
    const url = 'https://github.com/username/'
    const res = getUserAndRepo(url)
    expect(res.owner).toEqual('username')
    expect(res.repo).toEqual('')
  });

  test('Receives good Github Repository URL - with extra paths', () => {
    const url = 'https://github.com/username/repository/extra/path/information/here?query=string&ok=stop'
    const res = getUserAndRepo(url)
    expect(res.owner).toEqual('username')
    expect(res.repo).toEqual('repository')
  });
})
