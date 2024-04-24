import type { RootContent } from 'mdast'
import rehypeRaw from 'rehype-raw'
import rehypeStringify from 'rehype-stringify'
import emoji from 'remark-emoji'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import remarkStringify from 'remark-stringify'
import strip from 'strip-markdown'
import { unified } from 'unified'

export const markdownParser = unified()
  .use(remarkParse)
  .use(emoji)
  .use(remarkMath)
  .use(remarkGfm)

export const markdownRenderer = unified()
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeStringify)

export const markdownTexter = unified().use(strip).use(remarkStringify)

export function parseMarkdown(markdown: string) {
  return markdownParser.parse(markdown)
}

export function parseMarkdownWithAddon(markdown: string) {
  return markdownParser.runSync(parseMarkdown(markdown))
}

export function mdastToHTML(mdast: RootContent[]) {
  return markdownRenderer.stringify(
    markdownRenderer.runSync({
      type: 'root',
      children: mdast,
    }),
  )
}

export function markdownToText(markdown: string) {
  return markdownTexter.stringify(markdownTexter.runSync(parseMarkdown(markdown)))
}
