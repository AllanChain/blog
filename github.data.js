const api = require('./src/api/github')

const patterns = {
  slug: /<a href="https.*blog\/(.*?)" rel="nofollow">View Post on Blog<\/a>/,
  createdAt: /<em>This post was originally created at (.*?)<\/em>/s,
  // summary contains HTML, normally <p>
  // s means "dot all"
  summary: /<blockquote>(.*?)<\/blockquote>/s,
  image: /<img src="(.*?)"/
}

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
  result.id = result.slug
  return result
}

const parseLabelName = labels => {
  const result = {}
  for (const label of labels) {
    const [key, value] = label.split(': ')
    if (value !== undefined) {
      if (result[key] !== undefined) result[key].push(value)
      else result[key] = [value]
    }
  }
  result.blog = result.blog ? result.blog[0] : 'programing'
  return result
}

const parseLabels = labels => {
  const result = {}
  for (const label of labels) {
    [label.description, label.image] = label.description.split('|')
    // let gridsome know that it do have this field
    if (label.image === undefined) label.image = null
    const [key, name] = label.name.split(': ')
    // skip for non-standard tag
    if (name !== undefined) {
      const value = { ...label, id: name }
      if (result[key] !== undefined) result[key].push(value)
      else result[key] = [value]
    }
  }
  return result
}

module.exports = async () => {
  const repo = await api.gql('data')
  const posts = repo.issues.edges.map(edge => ({
    id: edge.node.number,
    createdAt: edge.node.createdAt,
    lastEditedAt: edge.node.lastEditedAt,
    title: edge.node.title,
    ...parseBody(edge.node.bodyHTML),
    ...parseLabelName(edge.node.labels.edges.map(edge => edge.node.name))
  }))
  const labels = parseLabels(repo.labels.edges.map(edge => edge.node))
  return { posts, labels }
}
