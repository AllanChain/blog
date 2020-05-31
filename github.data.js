const api = require('./src/api/github')

const md = require('markdown-it')({
  html: true
})

md.use(require('markdown-it-emoji'))
  .use(require('./src/markdown-it-code'))
md.renderer.rules.code_block = md.renderer.rules.fence

const patterns = {
  slug: /^\[View Post on Blog\]\(https.*blog\/(.*)\)$/m,
  createdAt: /^\*This post was originally created at (.*)\*$/m,
  summary: /^> (.*)/m
}

const parseBody = text => {
  const result = {};
  [text, result.body] = text.split('---', 2)
  result.body = md.render(result.body)
  console.log(result.body)
  for (const key in patterns) {
    const match = text.match(patterns[key])
    // should not override if not provided
    if (match !== null) result[key] = match[1]
  }
  result.id = result.slug
  return result
}

module.exports = async () => {
  const repo = await api.gql('data')
  const posts = repo.issues.edges.map(edge => ({
    createdAt: edge.node.createdAt,
    lastEditedAt: edge.node.lastEditedAt,
    title: edge.node.title,
    ...parseBody(edge.node.body),
    labels: edge.node.labels.edges.map(edge => edge.node.name)
  }))
  const labels = repo.labels.edges.map(edge => edge.node)
  return { posts, labels }
}
