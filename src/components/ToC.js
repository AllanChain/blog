const createTocTree = (headings, baseLevel, index, children) => {
  while (index < headings.length) {
    if (baseLevel === headings[index].level) {
      children.push({ ...headings[index++], children: [] })
    } else if (baseLevel < headings[index].level) {
      if (!children.length) {
        children.push({ content: null, children: [] })
      }
      index = createTocTree(
        headings,
        baseLevel + 1,
        index,
        children[children.length - 1].children
      )
    } else {
      return index
    }
  }
}

const renderTocNode = (h, node) => {
  const ulElement = h('ul', node.children.map(child => renderTocNode(h, child)))
  if (node.content === null) return ulElement
  else {
    return h('li', [
      h('a', {
        class: 'hash-link',
        domProps: {
          href: `#${node.slug}`,
          innerHTML: node.content
        }
      }),
      ulElement
    ])
  }
}

export default {
  props: {
    serializedHeadings: {
      type: String,
      required: true
    }
  },
  data () {
    const headings = JSON.parse(this.serializedHeadings)
    const tocTree = { content: null, children: [] }
    createTocTree(
      headings,
      Math.min(...headings.map(h => h.level)),
      0,
      tocTree.children
    )
    return { tocTree }
  },
  render (h) {
    return h('div', { class: 'toc' }, ['Table of Contents', renderTocNode(h, this.tocTree)])
  }
}
