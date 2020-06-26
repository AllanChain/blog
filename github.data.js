const GithubSlugger = require('github-slugger')
const { gql, htmlPlugins, ChainHTML } = require('./src/api')

const patterns = {
  slug: /<a href="https.*post\/(.*?)" rel="nofollow">View Post on Blog<\/a>/,
  createdAt: /<em>This post was originally created at (.*?)<\/em>/s,
  // summary contains HTML, normally <p>
  // s means "dot all"
  summary: /<blockquote>(.*?)<\/blockquote>/s,
  image: /<img src="(.*?)"/
}

const includedLabelTypes = ['blog', 'tag', 'series']

const slugPlugin = html => {
  const slugger = new GithubSlugger()
  return html.replace(/<h(\d)>(.*?)<\/h\1>/gs, (_, level, title) => {
    const slug = slugger.slug(title)
    return `<h${level}><a id="${slug}" class="anchor-hover" href="#${slug}">
      #</a> ${title}</h${level}>`
  })
}

const parseBody = text => {
  const result = {};
  [text, result.body] = text.split('<hr>', 2)
  // forget <hr>
  if (result.body === undefined) result.body = text
  result.body = new ChainHTML(result.body)
    .use(htmlPlugins.codeLang)
    .use(slugPlugin)
    .end()
  for (const key in patterns) {
    const match = text.match(patterns[key])
    // should not override if not provided
    if (match !== null) result[key] = match[1]
  }
  const createdAt = new Date(result.createdAt)
  if (!isNaN(createdAt)) result.createdAt = createdAt
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
  const repo = (await gql('data')).repository
  const posts = repo.issues.nodes.map(node => ({
    id: node.number,
    createdAt: new Date(node.createdAt),
    lastEditedAt: new Date(node.lastEditedAt),
    title: node.title,
    ...parseBody(node.bodyHTML),
    labels: node.labels.nodes.filter(isGoodLabel).map(label => label.name)
  }))
  const labels = repo.labels.nodes.filter(isGoodLabel).map(parseLabel)
  return { posts, labels }
}
