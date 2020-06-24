const api = require('./src/api/github')

const patterns = {
  slug: /<a href="https.*post\/(.*?)" rel="nofollow">View Post on Blog<\/a>/,
  createdAt: /<em>This post was originally created at (.*?)<\/em>/s,
  // summary contains HTML, normally <p>
  // s means "dot all"
  summary: /<blockquote>(.*?)<\/blockquote>/s,
  image: /<img src="(.*?)"/
}

const includedLabelTypes = ['blog', 'tag', 'series']

const parseBody = text => {
  text = api.htmlConvert(text)
  const result = {};
  [text, result.body] = text.split('<hr>', 2)
  // forget <hr>
  if (result.body === undefined) result.body = text
  for (const key in patterns) {
    const match = text.match(patterns[key])
    // should not override if not provided
    if (match !== null) result[key] = match[1]
  }
  return result
}

const isGoodLabel = label => {
  const result = label.name.split(': ')
  return result.length === 2 && includedLabelTypes.includes(result[0])
}

const parseLabel = label => {
  const [description, logo] = label.description.split('|')
  const [type, name] = label.name.split(': ')
  return { description, logo, id: label.name, color: label.color, type, name }
}

module.exports = async () => {
  const repo = (await api.gql('data')).repository
  const posts = repo.issues.edges.map(edge => ({
    id: edge.node.number,
    createdAt: new Date(edge.node.createdAt),
    lastEditedAt: new Date(edge.node.lastEditedAt),
    title: edge.node.title,
    ...parseBody(edge.node.bodyHTML),
    labels: edge.node.labels.edges.map(edge => edge.node)
      .filter(isGoodLabel).map(label => label.name)
  }))
  const labels = repo.labels.edges.map(edge => edge.node)
    .filter(isGoodLabel).map(parseLabel)
  return { posts, labels }
}
