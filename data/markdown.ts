import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import emoji from 'remark-emoji'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import rehypeRaw from 'rehype-raw'
import remarkMath from 'remark-math'
import remarkStringify from 'remark-stringify'
import strip from 'strip-markdown'
import rehypeKatex from 'rehype-katex'
import rehypeHighlight from 'rehype-highlight'

import { h } from 'hastscript'
import { visit } from 'unist-util-visit'
import type { HastRoot } from 'remark-rehype/lib'
import { prefixLink } from '@/utils'

const transformIssueLink = () => (htmlNodes: HastRoot) => {
  visit(htmlNodes, 'element', (node) => {
    if (
      node.tagName === 'a' &&
      typeof node.properties.href === 'string' &&
      node.properties.href.match(/^\d+$/) &&
      node.children[0].type === 'text'
    ) {
      const rawUrl = node.children[0].value
      const url = rawUrl.includes('#') ? rawUrl.replace('#', '/#') : rawUrl + '/'
      node.properties.href = prefixLink(`post/${url}`)
    }
  })
}

const createVideo = () => (htmlNodes: HastRoot) => {
  visit(htmlNodes, 'element', (node) => {
    if (
      node.tagName === 'a' &&
      typeof node.properties.href === 'string' &&
      node.properties.href.match(/\.mp4$/) &&
      node.children.length === 1 &&
      node.children[0].type === 'text' &&
      node.children[0].value === node.properties.href
    ) {
      node.tagName = 'video'
      const videoSource = node.properties.href
      node.properties = { controls: true }
      node.children = [
        h('source', { src: videoSource, type: 'video/mp4' }),
        h('a', { href: videoSource }, 'This is a MP4 video.'),
      ]
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
        node.children.push(h('div.code-lang', language))
      } else {
        codeElement.properties.className = ['hljs']
      }
    }
  })
}

export const markdownRenderer = unified()
  .use(remarkParse)
  .use(emoji)
  .use(remarkMath)
  .use(remarkGfm)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeSanitize, {
    ...defaultSchema,
    attributes: {
      ...defaultSchema.attributes,
      div: [...defaultSchema.attributes.div, ['className', 'math', 'math-display']],
      span: [['className', 'math', 'math-inline']],
      code: ['className'],
    },
  })
  .use(rehypeKatex)
  .use(rehypeHighlight, { ignoreMissing: true, subset: [] })
  .use(transformIssueLink)
  .use(enhanceCodeBlock)
  .use(createVideo)
  .use(rehypeStringify)

export const markdownTexter = unified().use(strip).use(remarkStringify)
