import remarkParse from 'remark-parse'
import type { MdastRoot } from 'remark-rehype/lib'
import remarkStringify from 'remark-stringify'
import strip from 'strip-markdown'
import { unified } from 'unified'
import { visit, EXIT } from 'unist-util-visit'

import type {
  QueryComment,
  QueryIssue,
  QueryLabel,
  QueryReactionGroup,
  Comment,
  BlogLabel,
  ReactionGroup,
  BlogPost,
} from './types'

interface BodyParseResult {
  slug: string
  body: string
  serializedHeadings: string
  summary?: string
  summaryText?: string
  image?: string
  imageAlt?: string
  createdAt?: Date
}

type LabelParseReslt = Omit<BlogLabel, 'logo' | 'reference'> & { logo?: string }
type PostParseResult = Omit<BlogPost, 'image' | 'labels'> & {
  image?: string
  labels: string[]
}
// const includedLabelTypes = ['blog', 'tag', 'series']
const markdownParser = unified().use(remarkParse).use(remarkStringify)
const markdownTexter = unified().use(strip).use(remarkStringify)

const parseBody = async (text: string): Promise<BodyParseResult> => {
  const result: Partial<BodyParseResult> = {}

  const nodes = markdownParser.parse(text)
  const hrIndex = nodes.children.findIndex((node) => node.type === 'thematicBreak')
  if (hrIndex === -1) throw new Error('Post need <hr>')
  const frontNodes: MdastRoot = {
    type: 'root',
    children: nodes.children.splice(0, hrIndex),
  }

  visit(frontNodes, 'link', (node) => {
    if (
      node.children.length === 1 &&
      node.children[0].type === 'text' &&
      node.children[0].value === 'View Post on Blog'
    ) {
      result.slug = node.url.match(/https.*post\/(.*)/)[1]
      return EXIT
    }
  })
  if (result.slug === undefined) throw new Error('Post need slug')

  visit(frontNodes, 'emphasis', (node) => {
    if (node.children.length === 1 && node.children[0].type === 'text') {
      const match = node.children[0].value.match(
        /This post was originally created at (.*)/,
      )
      if (match !== null) {
        const createdAt = new Date(match[1])
        if (!isNaN(createdAt.getTime())) {
          result.createdAt = createdAt
        }
        return EXIT
      }
    }
  })

  let summaryNode: MdastRoot
  visit(frontNodes, 'blockquote', (node) => {
    summaryNode = {
      type: 'root',
      children: node.children,
    }
  })
  if (summaryNode) {
    result.summary = markdownTexter.stringify(summaryNode)
    result.summaryText = markdownTexter
      .stringify(await markdownTexter.run(summaryNode))
      // https://stackoverflow.com/a/46548738/8810271
      .replace(/(?: *[\n\r])+ */g, ' ')
      .trim()
  }

  visit(frontNodes, 'image', (node) => {
    result.image = node.url
    result.imageAlt = node.alt
    return EXIT
  })

  // The first child now is hr
  result.body = text.slice(nodes.children[0].position.end.offset)
  result.serializedHeadings = '[]'
  // result.serializedHeadings = JSON.stringify(headings)
  return result as BodyParseResult
}

const parseReactionGroups = (reactionGroups: QueryReactionGroup[]): ReactionGroup[] => {
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

const parseComment = async (node: QueryComment): Promise<Comment> => {
  const { createdAt, reactionGroups, ...rest } = node
  return {
    ...rest,
    createdAt: new Date(createdAt),
    reactions: parseReactionGroups(reactionGroups),
  }
}

export const parseLabel = (label: QueryLabel): LabelParseReslt => {
  const [description, logo] = label.description.split('|')
  const [type, name] = label.name.split(': ')
  return { description, logo, id: label.name, color: label.color, type, name }
}

export const parsePost = async (node: QueryIssue): Promise<PostParseResult> => {
  try {
    return {
      id: node.number,
      url: node.url,
      // Will overwrite in `parseBody` spread
      createdAt: new Date(node.createdAt),
      // Fall back to create time if not edited
      lastEditedAt: new Date(node.lastEditedAt || node.createdAt),
      title: node.title,
      ...(await parseBody(node.body)),
      labels: node.labels.nodes.map((label) => label.name),
      reactions: parseReactionGroups(node.reactionGroups),
      comments: await Promise.all(node.comments.nodes.map(parseComment)),
    }
  } catch (err) {
    const message = `Issue ${node.number}: ${err.message}`
    console.error('::error::', message) // gh-action error
    throw new Error(message)
  }
}
