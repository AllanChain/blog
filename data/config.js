const repo = 'blog'
const owner = 'AllanChain'

export const gqlVar = {
  repo,
  owner,
  postCount: 100,
  postLabels: ['@post'],
  postLabelCount: 5,
  labelCount: 40,
  commentCount: 10,
  // display this number of user on one reaction
  reactionCount: 5,
  // issue number for extra data
  extraDataNumber: 148
}
export const repoQuery = `user:${owner} repo:${repo}`
export const repoUrl = `https://github.com/${owner}/${repo}`
export const profileUrl = `https://github.com/${owner}`
