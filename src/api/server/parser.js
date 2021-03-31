const GithubSlugger = require('github-slugger')

const { htmlPlugins, ChainHTML } = require('../html')

const patterns = {
  slug: /<a href="https.*post\/(.*?)" rel="nofollow">View Post on Blog<\/a>/,
  createdAt: /<em>This post was originally created at (.*?)<\/em>/s,
  // summary contains HTML, normally <p>
  // s means "dot all"
  summary: /<blockquote>(.*?)<\/blockquote>/s,
  image: /<img src="(.*?)"/
}

// const includedLabelTypes = ['blog', 'tag', 'series']

/**
 * Add slug to HTML headers
 * @param {string} html html to add slug
 */
const processSlug = html => {
  const slugger = new GithubSlugger()
  const headings = []
  return {
    body: html.replace(/<h(\d)>(.*?)<\/h\1>/gs, (_, level, content) => {
      const slug = slugger.slug(content.replace(/<.*?>/g, ''))
      headings.push({ level: parseInt(level, 10), slug, content })
      return `<h${level}>
      <a id="article-${slug}" class="anchor-hover hash-link" href="#${slug}">
      #</a> ${content}</h${level}>`
    }),
    serializedHeadings: JSON.stringify(headings)
  }
}

const parseBody = text => {
  const result = {}
  result.body = text.split('<hr>').slice(1).join('<hr>')
  text = text.split('<hr>', 1)[0]
  if (result.body === '') throw new Error('Post need <hr>')
  result.body = new ChainHTML(result.body)
    .use(htmlPlugins.codeLang)
    .use(htmlPlugins.issueLink)
    .use(htmlPlugins.trimIssue)
    .end()
  Object.assign(result, processSlug(result.body))

  for (const key in patterns) {
    const match = text.match(patterns[key])
    // should not override if not provided
    if (match !== null) result[key] = match[1]
  }
  if (result.slug === undefined) throw new Error('Post need slug')
  const createdAt = new Date(result.createdAt)
  // Only overwrite if is correct time
  if (isNaN(createdAt)) delete result.createdAt
  else result.createdAt = createdAt
  return result
}

const isGoodLabel = label => {
  const result = label.name.split(': ')
  const { includedLabelTypes } = require('../../assets/.cache/extra.json')
  return result.length === 2 && includedLabelTypes.includes(result[0])
}

const parseLabel = label => {
  const [description, logo] = label.description.split('|')
  const [type, name] = label.name.split(': ')
  return { description, logo, id: label.name, color: label.color, type, name }
}

const parsePost = node => {
  try {
    return {
      id: node.number,
      // Will overwrite in `parseBody` spread
      createdAt: new Date(node.createdAt),
      // Fall back to create time if not edited
      lastEditedAt: new Date(node.lastEditedAt || node.createdAt),
      title: node.title,
      ...parseBody(node.bodyHTML),
      labels: node.labels.nodes.filter(isGoodLabel).map(label => label.name)
    }
  } catch (err) {
    const message = `Issue ${node.number}: ${err.message}`
    console.error('::error::', message) // gh-action error
    throw new Error(message)
  }
}

module.exports = {
  isGoodLabel,
  parseLabel,
  parsePost
}
