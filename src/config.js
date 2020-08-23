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
    reactionCount: 10
  },
  repoQuery: `user:${owner} repo:${repo}`,
  repoUrl: `https://github.com/${owner}/${repo}`,
  profileUrl: `https://github.com/${owner}`,
  labelSizeBrkpnts: { normal: 2, large: 6, xLarge: 15 },
  friends: [
    {
      name: 'ᴍɪᴍɪ',
      blog: 'https://zhangshuqiao.org/',
      avatar: 'https://avatars3.githubusercontent.com/u/16272760?s=100&v=4',
      moto: '做了一点微小的工作'
    },
    {
      name: 'txtyb',
      blog: 'https://txtyb.github.io/',
      avatar: 'https://avatars2.githubusercontent.com/u/14294192?s=100&v=4',
      moto: 'The quieter you be, the more you can hear.'
    },
    {
      name: 'Yixuan-Wang',
      blog: 'https://yixuan-wang.github.io/blog/',
      avatar: 'https://avatars2.githubusercontent.com/u/21151119?s=100&v=4',
      moto: 'Pak'
    }
  ]
}
