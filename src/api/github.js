const axios = require('axios')

const queries = require('./queries')
const render = require('./renderer')

const patterns = {
  slug: /^\[View Post on Blog\]\(https.*blog\/(.*)\)$/m,
  createTime: /^\*This post was originally created at (.*)\*$/m,
  summary: /^> (.*)/m
}

const matchFirst = (pattern, text) => {
  const result = text.match(pattern)
  if (result === null) return null
  return result[1]
}

const parseBody = text => {
  const result = {};
  [text, result.body] = text.split('---', 2)
  result.body = render(result.body)
  console.log(result.body)
  for (const key in patterns) {
    result[key] = matchFirst(patterns[key], text)
  }
  result.id = result.slug
  return result
}

module.exports = {
  async gql (query) {
    const resp = await axios({
      method: 'post',
      url: 'https://api.github.com/graphql',
      data: { query },
      headers: {
        Authorization: 'bearer bc48cb2be22ab0b18b1a5dd0daa3dcc6501b5632'
      }
    })
    //          axios gql
    return resp.data.data.repository
  },
  async data () {
    const repo = await this.gql(queries.data)
    const posts = repo.issues.edges.map(edge => ({
      ...parseBody(edge.node.body),
      title: edge.node.title,
      labels: edge.node.labels.edges.map(edge => edge.node.name)
    }))
    const labels = repo.labels.edges.map(edge => edge.node)
    return { posts, labels }
  }
}
