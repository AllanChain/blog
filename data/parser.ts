import GithubSlugger from 'github-slugger'

import { htmlPlugins, ChainHTML } from './html'
import { BlogComment, BlogIssue, BlogLabel, ReactionGroup } from './query-types'
import type { ReactionContent } from './sdk'
interface BodyParseResult {
  body: string
  slug: string
  serializedHeadings: string
  summary?: string
  image?: string
  createdAt?: Date
}

interface ParsedReactionGroup {
  ID: ReactionContent
  emoji: string
  count: number
  users: string[]
}

type ParsedComment = Omit<BlogComment, 'reactionGroups'> & {
  reactions: ParsedReactionGroup[]
}

interface ParsedLabel extends BlogLabel {
  id: string
  type: string
  logo: string
}

interface PartsedPost extends BodyParseResult {
  id: number
  createdAt: Date
  lastEditedAt: Date
  title: string
  labels: string[]
  reactions: ParsedReactionGroup[]
  comments: ParsedComment[]
}

const patterns = {
  slug: /<a href="https.*post\/(.*?)" rel="nofollow">View Post on Blog<\/a>/,
  createdAt: /<em>This post was originally created at (.*?)<\/em>/s,
  // summary contains HTML, normally <p>
  // s means "dot all"
  summary: /<blockquote>(.*?)<\/blockquote>/s,
  image: /<img src="(.*?)"/,
}

// const includedLabelTypes = ['blog', 'tag', 'series']

/**
 * Add slug to HTML headers
 * @param {string} html html to add slug
 */
const processSlug = (html: string) => {
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
    serializedHeadings: JSON.stringify(headings),
  }
}

const parseBody = (text: string): BodyParseResult => {
  const result: Partial<BodyParseResult> = {}
  if (!text.includes('<hr')) throw new Error('Post need <hr>')
  result.body = text.split('<hr>').slice(1).join('<hr>')
  text = text.split('<hr>', 1)[0]
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
  if (isNaN(createdAt.getTime())) delete result.createdAt
  else result.createdAt = createdAt
  return result as BodyParseResult
}

export const isGoodLabel = (labelName: string) => {
  console.log(labelName)
  const result = labelName.split(': ')
  // const { includedLabelTypes } = require('../.cache/extra.json')
  return result.length === 2 // && includedLabelTypes.includes(result[0])
}

const parseReactionGroups = (
  reactionGroups: ReactionGroup[]
): ParsedReactionGroup[] => {
  const emojis = {
    CONFUSED: '😕',
    EYES: '👀',
    HEART: '❤',
    HOORAY: '🎉',
    LAUGH: '😄',
    ROCKET: '🚀',
    THUMBS_DOWN: '👎',
    THUMBS_UP: '👍',
  }
  return reactionGroups
    .filter((group) => group.users.totalCount)
    .map((group) => ({
      ID: group.content,
      emoji: emojis[group.content],
      count: group.users.totalCount,
      users: group.users.nodes.map((node) => node.login),
    }))
}

const parseComment = (node: BlogComment): ParsedComment => {
  const { reactionGroups, ...rest } = node
  return {
    ...rest,
    reactions: parseReactionGroups(reactionGroups),
  }
}

export const parseLabel = (label: BlogLabel): ParsedLabel => {
  const [description, logo] = label.description.split('|')
  const [type, name] = label.name.split(': ')
  return { description, logo, id: label.name, color: label.color, type, name }
}

export const parsePost = (node: BlogIssue): PartsedPost => {
  try {
    return {
      id: node.number,
      // Will overwrite in `parseBody` spread
      createdAt: new Date(node.createdAt),
      // Fall back to create time if not edited
      lastEditedAt: new Date(node.lastEditedAt || node.createdAt),
      title: node.title,
      ...parseBody(node.bodyHTML),
      labels: node.labels.nodes
        .filter((label) => isGoodLabel(label.name))
        .map((label) => label.name),
      reactions: parseReactionGroups(node.reactionGroups),
      comments: node.comments.nodes.map(parseComment),
    }
  } catch (err) {
    const message = `Issue ${node.number}: ${err.message}`
    console.error('::error::', message) // gh-action error
    throw new Error(message)
  }
}
