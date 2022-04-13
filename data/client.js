const axios = require('axios')
const config = require('../config')

const { owner, repo } = config.gqlVar
const GITHUB_ENCODING__HTML_JSON = 'application/vnd.github.VERSION.html+json'
const GITHUB_ENCODING__REACTIONS_PREVIEW =
  'application/vnd.github.squirrel-girl-preview'
const allReactions = {
  confused: { id: 'CONFUSED', emoji: '😕' },
  eyes: { id: 'EYES', emoji: '👀' },
  heart: { id: 'HEART', emoji: '❤' },
  hooray: { id: 'HOORAY', emoji: '🎉' },
  laugh: { id: 'LAUGH', emoji: '😄' },
  rocket: { id: 'ROCKET', emoji: '🚀' },
  '-1': { id: 'THUMBS_DOWN', emoji: '👎' },
  '+1': { id: 'THUMBS_U', emoji: '👍' }
}

export const githubRequest = async relativeUrl => {
  return await axios.get(relativeUrl, {
    baseURL: 'https://api.github.com/',
    headers: {
      Accept: `${GITHUB_ENCODING__HTML_JSON},${GITHUB_ENCODING__REACTIONS_PREVIEW}`
    }
  })
}

const parseCommentReactions = reactions => {
  const sortedReactions = []

  for (const reactionContent in reactions) {
    if (
      reactionContent in allReactions &&
      reactions[reactionContent] > 0
    ) {
      sortedReactions.push({
        ...allReactions[reactionContent],
        count: reactions[reactionContent]
      })
    }
  }
  return sortedReactions
}

export const getComments = async issueNumber => {
  const url = `repos/${owner}/${repo}/issues/${issueNumber}/comments`
  return (await githubRequest(url)).data.map(comment => ({
    id: comment.id,
    createdAt: new Date(comment.created_at),
    bodyHTML: comment.body_html,
    resourcePath: comment.html_url,
    author: {
      id: comment.user.login,
      avatarUrl: comment.user.avatar_url
    },
    reactions: parseCommentReactions(comment.reactions)
  }))
}

export const getPostReactions = async issueNumber => {
  const url = `repos/${owner}/${repo}/issues/${issueNumber}/reactions`
  const sortedReactions = {}

  for (const reaction of (await githubRequest(url)).data) {
    if (sortedReactions[reaction.content] === undefined) {
      sortedReactions[reaction.content] = {
        ...allReactions[reaction.content],
        count: 0
      }
    }
    sortedReactions[reaction.content].count += 1
  }
  return Object.values(sortedReactions)
}

export const getSearchResult = async (label, query) => {
  const q = `${query.replace(' ', '+')}+user:${owner}+repo:${repo}+label:"${label}"`
  const url = `search/issues?q=${q}`
  return (await githubRequest(url)).data
}
