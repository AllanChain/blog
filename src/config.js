const repo = 'blog'
const owner = 'AllanChain'

module.exports = {
  gqlVar: {
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
  },
  repoQuery: `user:${owner} repo:${repo}`,
  repoUrl: `https://github.com/${owner}/${repo}`,
  profileUrl: `https://github.com/${owner}`
}
