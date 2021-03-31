<script>
const createTocTree = (headings, baseLevel, index, children, activeSlug) => {
  let containsActive = false

  while (index < headings.length) {
    if (baseLevel > headings[index].level) return { index, containsActive }

    if (baseLevel === headings[index].level) {
      const active = headings[index].slug === activeSlug
      // Using bitwise or to be concise
      containsActive |= active
      children.push({ ...headings[index++], active, children: [] })
    } else {
      if (!children.length) {
        children.push({ content: null, active: false, children: [] })
      }
      const result = createTocTree(
        headings,
        baseLevel + 1,
        index,
        children[children.length - 1].children,
        activeSlug
      )
      index = result.index
      containsActive |= result.containsActive
      children[children.length - 1].active |= result.containsActive
    }
  }
  return { index, containsActive }
}

const renderTocNode = (h, node) => {
  const ulElement = h(
    'ul',
    { class: { 'toc-active': node.active } },
    node.children.map(child => renderTocNode(h, child))
  )

  if (node.content === null) return ulElement
  else {
    return h('li', [
      h('a', {
        class: { 'hash-link': true, 'toc-active': node.active },
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
    },
    activeSlug: {
      type: String,
      required: true
    }
  },
  computed: {
    headings () {
      return JSON.parse(this.serializedHeadings)
    },
    tocTree () {
      const tocTree = { content: null, children: [] }
      createTocTree(
        this.headings,
        Math.min(...this.headings.map(h => h.level)),
        0,
        tocTree.children,
        this.activeSlug
      )
      return tocTree
    }
  },
  render (h) {
    return h('div', { class: 'toc' }, ['Table of Contents', renderTocNode(h, this.tocTree)])
  }
}
</script>

<style lang="sass">
.toc ul
  list-style: none
  padding-left: 0 !important
  ul
    display: none
    &.toc-active
      display: block
  li li
    margin-left: 20px
  li:hover > ul
    display: block
  a
    text-decoration: none
    &.toc-active
      color: orange
</style>
