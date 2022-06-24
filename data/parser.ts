import GithubSlugger from 'github-slugger'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import emoji from 'remark-emoji'
import rehypeSanitize from 'rehype-sanitize'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeHighlight from 'rehype-highlight'
import { visit, EXIT, CONTINUE } from 'unist-util-visit'
import type { HastRoot, MdastRoot } from 'remark-rehype/lib'

import {
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
  image?: string
  createdAt?: Date
}

type LabelParseReslt = Omit<BlogLabel, 'logo' | 'reference'> & { logo?: string }
type PostParseResult = Omit<BlogPost, 'image' | 'labels'> & {
  image?: string
  labels: string[]
}
// const includedLabelTypes = ['blog', 'tag', 'series']

const transformIssueLink = () => (htmlNodes: HastRoot) => {
  visit(htmlNodes, 'element', (node) => {
    if (
      node.tagName === 'a' &&
      typeof node.properties.href === 'string' &&
      node.properties.href.match(/^\d+$/) &&
      node.children[0].type === 'text'
    ) {
      node.properties.href = `../${node.children[0].value}`
    }
  })
}

const enhanceCodeBlock = () => (htmlNodes: HastRoot) => {
  visit(htmlNodes, 'element', (node) => {
    if (
      node.tagName === 'pre' &&
      node.children[0].type === 'element' &&
      node.children[0].tagName === 'code'
    ) {
      const codeElement = node.children[0]
      if (codeElement.properties.className) {
        const classNames = codeElement.properties.className as string[]
        const language = classNames
          .find((className) => className.startsWith('language-'))
          .slice('language-'.length)
        node.children.push({
          type: 'element',
          tagName: 'div',
          properties: {
            className: ['code-lang'],
          },
          children: [
            {
              type: 'text',
              value: language,
            },
          ],
        })
      } else {
        codeElement.properties.className = ['hljs']
      }
    }
  })
}

const markdownRenderer = unified()
  .use(remarkParse)
  .use(emoji)
  .use(remarkMath)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeKatex)
  // .use(rehypeSanitize)
  .use(rehypeHighlight, { ignoreMissing: true, subset: false })
  .use(transformIssueLink)
  .use(enhanceCodeBlock)
  .use(rehypeStringify)

const parseBody = async (text: string): Promise<BodyParseResult> => {
  const result: Partial<BodyParseResult> = {}

  const nodes = markdownRenderer.parse(text)
  const hrIndex = nodes.children.findIndex(
    (node) => node.type === 'thematicBreak'
  )
  if (hrIndex === -1) throw new Error('Post need <hr>')
  const frontNodes: MdastRoot = {
    type: 'root',
    children: nodes.children.slice(0, hrIndex),
  }
  nodes.children.splice(0, hrIndex + 1)

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
        /This post was originally created at (.*?)/
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
    result.summary = markdownRenderer.stringify(
      await markdownRenderer.run(summaryNode)
    )
  }

  visit(frontNodes, 'image', (node) => {
    result.image = node.url
    return EXIT
  })

  const htmlNodes = await markdownRenderer.run(nodes)

  const headings = []
  const slugger = new GithubSlugger()
  visit(htmlNodes, 'element', (node) => {
    const match = node.tagName.match(/^h(\d)$/)
    if (match === null) return CONTINUE
    const headingLevel = parseInt(match[1], 10)

    const childrenText = []
    visit(node, 'text', (child) => {
      childrenText.push(child.value)
    })
    const content = childrenText.join(' ').trim().replace(/ +/g, ' ')
    const slug = slugger.slug(content)

    headings.push({ level: headingLevel, slug, content })

    node.children.unshift({
      type: 'element',
      tagName: 'a',
      properties: {
        href: `#${slug}`,
        id: `${slug}`,
        class: 'anchor-hover hash-link',
      },
      children: [
        {
          type: 'text',
          value: '#',
        },
      ],
    })
  })

  result.body = markdownRenderer.stringify(htmlNodes)
  // result.body = new ChainHTML(result.body)
  //   .use(htmlPlugins.codeLang)
  //   .use(htmlPlugins.issueLink)
  //   .use(htmlPlugins.trimIssue)
  //   .end()
  result.serializedHeadings = JSON.stringify(headings)
  return result as BodyParseResult
}

export const isGoodLabel = (labelName: string) => {
  const result = labelName.split(': ')
  // const { includedLabelTypes } = require('../.cache/extra.json')
  return result.length === 2 // && includedLabelTypes.includes(result[0])
}

const parseReactionGroups = (
  reactionGroups: QueryReactionGroup[]
): ReactionGroup[] => {
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
  const { body, createdAt, reactionGroups, ...rest } = node
  return {
    ...rest,
    createdAt: new Date(createdAt),
    body: String(await markdownRenderer.process(body)),
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
      labels: node.labels.nodes
        .filter((label) => isGoodLabel(label.name))
        .map((label) => label.name),
      reactions: parseReactionGroups(node.reactionGroups),
      comments: await Promise.all(node.comments.nodes.map(parseComment)),
    }
  } catch (err) {
    const message = `Issue ${node.number}: ${err.message}`
    console.error('::error::', message) // gh-action error
    throw new Error(message)
  }
}
