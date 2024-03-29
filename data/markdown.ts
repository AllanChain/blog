import axios from 'axios'
import { selectAll } from 'hast-util-select'
import { h } from 'hastscript'
import rehypeHighlight from 'rehype-highlight'
import rehypeKatex from 'rehype-katex'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'
import emoji from 'remark-emoji'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import type { HastRoot } from 'remark-rehype/lib'
import remarkStringify from 'remark-stringify'
import strip from 'strip-markdown'
import { unified } from 'unified'
import { visit } from 'unist-util-visit'

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

const transformNoteBlock = () => (htmlNodes: HastRoot) => {
  const supportedBlocks = ['note', 'warning']
  visit(htmlNodes, 'element', (node) => {
    if (node.tagName !== 'blockquote') {
      return
    }
    for (const paraElement of node.children) {
      // Find first <p>
      if (paraElement.type !== 'element' || paraElement.tagName !== 'p') {
        continue
      }
      // Find first <strong> in that <p>
      for (const child of paraElement.children) {
        if (
          child.type !== 'element' ||
          child.tagName !== 'strong' ||
          child.children[0].type !== 'text'
        ) {
          continue
        }
        // ...that should be the block type
        const blockType = child.children[0].value.toLowerCase()
        if (!supportedBlocks.includes(blockType)) return
        node.tagName = 'div'
        node.properties.className = ['custom-block', `${blockType}-block`]
        paraElement.children.splice(paraElement.children.indexOf(child), 1)
        break // Don't consider other <strong>
      }
      break // Don't consider other <p>
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

const fixFootnote = () => (htmlNodes: HastRoot) => {
  // See https://github.com/rehypejs/rehype-sanitize#example-headings-dom-clobbering
  // rehype-sanitize has a bug (?) to append `user-content-` twice.
  visit(htmlNodes, 'element', (node) => {
    if (
      typeof node.properties.id === 'string' &&
      node.properties.id.startsWith('user-content-user-content')
    ) {
      node.properties.id = node.properties.id.slice('user-content-'.length)
    }
  })
}

const transformNewGitHubImage = () => async (htmlNodes: HastRoot) => {
  for (const node of selectAll('img[src^="https://github.com/"]', htmlNodes)) {
    const url = node.properties.src as string
    if (/https:\/\/github.com\/.*\/assets/.test(url)) {
      try {
        const resp = await axios.get(url, {
          maxRedirects: 0,
          validateStatus: (s) => s === 302,
        })
        node.properties.src = resp.headers.location
      } catch {
        console.warn(`${node.properties.src} can't be processed`)
      }
    }
  }
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
  .use(rehypeHighlight)
  .use(transformIssueLink)
  .use(transformNoteBlock)
  .use(enhanceCodeBlock)
  .use(createVideo)
  .use(fixFootnote)
  .use(transformNewGitHubImage)
  .use(rehypeStringify)

export const markdownTexter = unified().use(strip).use(remarkStringify)
