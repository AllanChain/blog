const axios = require('axios')
const config = require('../config')

const { owner, repo } = config.gqlVar
const GITHUB_ENCODING__HTML_JSON = 'application/vnd.github.VERSION.html+json'
const GITHUB_ENCODING__REACTIONS_PREVIEW =
  'application/vnd.github.squirrel-girl-preview'

export const githubRequest = async relativeUrl => {
  return await axios.get(relativeUrl, {
    baseURL: 'https://api.github.com/',
    headers: {
      Accept: `${GITHUB_ENCODING__HTML_JSON},${GITHUB_ENCODING__REACTIONS_PREVIEW}`
    }
  })
}

export const getComments = async issueNumber => {
  const url = `repos/${owner}/${repo}/issues/${issueNumber}/comments`
  return (await githubRequest(url)).data
}

export const getPostReactions = async issueNumber => {
  const url = `repos/${owner}/${repo}/issues/${issueNumber}/reactions`
  return (await githubRequest(url)).data
}

export const getSearchResult = async (label, query) => {
  const q = `${query.replace(' ', '+')}+user:${owner}+repo:${repo}+label:"${label}"`
  const url = `search/issues?q=${q}`
  return (await githubRequest(url)).data
}
