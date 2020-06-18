const api = require('./src/api/github')

const patterns = {
  slug: /<a href="https.*blog\/(.*?)" rel="nofollow">View Post on Blog<\/a>/,
  createdAt: /<em>This post was originally created at (.*)<\/em>/s,
  // summary contains HTML, normally <p>
  // s means "dot all"
  summary: /<blockquote>(.*)<\/blockquote>/s
}

const parseBody = text => {
  text = api.htmlConvert(text)
  const result = {};
  [text, result.body] = text.split('<hr>', 2)
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
    ...parseBody(edge.node.bodyHTML),
    labels: edge.node.labels.edges.map(edge => edge.node.name)
  }))
  const labels = repo.labels.edges.map(edge => edge.node)
  return { posts, labels }
}
