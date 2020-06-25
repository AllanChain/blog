const repo = 'blog'
const owner = 'AllanChain'

module.exports = {
  gqlVar: {
    repo,
    owner,
    postCount: 10,
    postLabels: [
      'blog: programing'
    ],
    postLabelCount: 5,
    labelCount: 10,
    commentCount: 10,
    reactionCount: 10
  },
  repoQuery: `user:${owner} repo:${repo}`,
  repoUrl: `https://github.com/${owner}/${repo}`,
  profileUrl: `https://github.com/${owner}`
}
