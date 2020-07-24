<template>
  <div>
    <div class="article-head text-center">
      <h1 class="article-title">
        {{ $page.post.title }}
      </h1>
      <div class="mb-2">
        <PostLabel
          v-for="label of this.$page.post.labels"
          :key="label.id"
          :label-id="label.id"
        />
      </div>
      <div class="text-center">
        <a
          rel="license"
          href="http://creativecommons.org/licenses/by-nc-sa/4.0/"
        >
          <img
            alt="CC-by-nc-sa"
            style="border-width:0"
            src="https://i.creativecommons.org/l/by-nc-sa/4.0/80x15.png"
          >
        </a>
      </div>
      <div>
        <span class="px-3 d-inline-block">
          <v-btn icon>
            <v-icon>mdi-calendar-month-outline</v-icon>
          </v-btn>
          {{ formatTime($page.post.createdAt) }}
        </span>
        <span class="px-3 d-inline-block">
          <v-btn
            icon
            :href="`${repoUrl}/issues/${$page.post.id}`"
            target="_blank"
            rel="noopener"
          >
            <v-icon>mdi-calendar-edit</v-icon>
          </v-btn>
          {{ formatTime($page.post.lastEditedAt) }}
        </span>
      </div>
      <v-img v-if="$page.post.image" :src="$page.post.image" />
    </div>
    <v-divider class="my-3" />
    <article
      class="article-main markdown-body mx-auto"
      style="max-width: 900px"
    >
      <v-alert v-if="$page.post.summary" type="info" border="left">
        <div class="article-summary clean-last-p" v-html="$page.post.summary" />
      </v-alert>
      <div v-html="$page.post.body" />
      <Comment :number="parseInt($page.post.id, 10)" />
    </article>
  </div>
</template>

<page-query>
query($id: ID!) {
  post(id: $id) {
    id
    title
    summary
    body
    createdAt
    lastEditedAt
    image
    labels {
      id
    }
  }
}
</page-query>

<script>
import { formatTime } from '@/utils'
import { repoUrl } from '@/config'
import PostLabel from '@/components/PostLabel'
import Comment from '@/components/Comment'

export default {
  metaInfo () {
    const meta = { title: this.$page.post.title }
    if (this.$page.post.body.includes('$')) {
      meta.script = [
        {
          src: 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js',
          id: 'MathJax-script',
          async: true,
          defer: true,
          key: 'mathjax'
        }
      ]
    }
    return meta
  },
  components: { PostLabel, Comment },
  data () {
    return { repoUrl }
  },
  watch: {
    '$page.post.id': {
      immediate: true,
      handler () {
        if (process.isServer) return
        if (!window.MathJax) {
          window.MathJax = {
            tex: {
              inlineMath: [['$', '$'], ['\\(', '\\)']],
              macros: {
                ds: '\\displaystyle'
              }
            },
            svg: { fontCache: 'global' }
          }
        } else this.$nextTick(window.MathJax.typesetPromise)
        this.$nextTick(() => {
          document.getElementsByClassName('anchor-hover').forEach(el => {
            el.addEventListener('click', () => this.goToHash(el.hash))
          })
          if (location.hash) this.goToHash(location.hash)
        })
      }
    }
  },
  methods: {
    formatTime,
    goToHash (hash) {
      const el = document.getElementById(
        'article-' + decodeURIComponent(hash.slice(1))
      )
      console.log(hash, el)
      if (el === null) return
      this.$vuetify.goTo(el, {
        duration: 700,
        // `offset` take app bar into account
        offset: 10,
        easing: 'easeInOutQuart'
      })
    }
  }
}
</script>

<style lang="sass">
@import "~primer-markdown/index.scss"
@import "~github-syntax-dark/lib/github-dark.css"

h1, h2, h3,
h4, h5, h6
  @extend %headings !optional

$font-mono: source-code-pro, Menlo, Monaco, Consolas, Courier New, monospace

=full-width($margin)
  @media (max-width: 500px)
    margin-left: $margin
    margin-right: $margin
    border-radius: 0
    pre
      border-radius: 0

article.article-main.markdown-body
  & :not(pre) > code
    color: #476582
    padding: 0.25rem 0.5rem
    margin: 0
    background-color: rgba(27, 31, 35, 0.05)
    border-radius: 3px

  pre, .highlight pre
    padding: 16px
    overflow: auto
    line-height: 1.45
    background-color: #282c34
    border-radius: 3px
    font-size: 95%
    code
      color: #eee8d5
      font-weight: normal
      font-family: $font-mono

  .highlight
    position: relative
    font-family: $font-mono
    .code-lang
      position: absolute
      top: 0.2em
      right: 0.6em
      font-size: 0.75rem
      color: rgba(255, 255, 255, 0.6)
    +full-width(-20px)

  & :not(.highlight) > pre
    +full-width(-20px)

  .v-card // comments
    .highlight
      +full-width(-16px)
    & :not(.highlight) > pre
      +full-width(-16px)

  %headings
    .anchor-hover
      text-decoration: none
      margin-left: -15px
      opacity: 0 // not hidden to receive hover
    &:hover .anchor-hover
      opacity: 1

  .article-summary a
    color: white
  a
    word-break: break-word
</style>
