const api = require('./src/api/github')

const md = require('markdown-it')({
  html: true
})

md.use(require('markdown-it-emoji'))

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
  result.body = md.render(result.body)
  console.log(result.body)
  for (const key in patterns) {
    result[key] = matchFirst(patterns[key], text)
  }
  result.id = result.slug
  return result
}

module.exports = async () => {
  const repo = await api.gql('data')
  const posts = repo.issues.edges.map(edge => ({
    ...parseBody(edge.node.body),
    title: edge.node.title,
    labels: edge.node.labels.edges.map(edge => edge.node.name)
  }))
  const labels = repo.labels.edges.map(edge => edge.node)
  return { posts, labels }
}