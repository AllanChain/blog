<template>
  <div>
    <div class="article-all">
      <div class="article-head text-center">
        <h1 class="article-title">
          {{ $page.post.title }}
        </h1>
        <div class="mb-2">
          <PostLabel
            v-for="label of $page.post.labels"
            :key="label.id"
            :label="label"
          />
        </div>
        <a
          rel="license"
          href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
        >
          <v-img
            alt="CC-by-nc-sa"
            width="123"
            height="20"
            style="margin: auto"
            :src="require(`@/assets/license.svg?vuetify-preload`)"
          />
        </a>
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
        <v-img
          v-if="$page.post.image"
          :src="$page.post.image"
          :lazy-src="decompressDataURI($page.post.imageLazy)"
        />
      </div>
      <v-divider class="my-3" />
      <article class="article-main markdown-body">
        <v-alert v-if="$page.post.summary" type="info" border="left">
          <div class="article-summary clean-last-p" v-html="$page.post.summary" />
        </v-alert>
        <!-- Functional div for correct toc-wrapper height -->
        <div style="position: relative">
          <div v-if="$page.post.serializedHeadings != '[]'" class="toc-wrapper">
            <ToC
              :serialized-headings="$page.post.serializedHeadings"
              :active-slug="activeSlug"
            />
          </div>
          <div ref="articleContent" v-html="$page.post.body" />
          <Comment
            :number="parseInt($page.post.id, 10)"
            :reactions="$page.post.reactions"
            :comments="$page.post.comments"
          />
        </div>
      </article>
      <Fab />
    </div>
  </div>
</template>

<page-query>
query ($id: ID!) {
  post(id: $id) {
    id
    title
    summary
    body
    createdAt
    lastEditedAt
    image
    imageLazy
    serializedHeadings
    labels {
      id
      type
      name
      color
      path
    }
    reactions {
      emoji
      count
      users
    }
    comments {
      resourcePath
      author {
        id
        avatarUrl
      }
      bodyHTML
      createdAt
      reactions {
        emoji
        count
        users
      }
    }
  }
}
</page-query>

<script>
import { decompressDataURI, formatTime } from '@/utils'
import { repoUrl } from '@/config'
import PostLabel from '@/components/PostLabel'
import Comment from '@/components/Comment'
import Fab from '@/components/Fab'
import ToC from '@/components/ToC'
import { useLoadNotifier } from '@/composables/usePageLoading'

export default {
  metaInfo () {
    const meta = { title: this.$page.post.title }

    if (this.$page.post.body.includes('$')) {
      meta.script = [
        {
          once: true, // https://vue-meta.nuxtjs.org/api/#once
          skip: typeof window !== 'undefined' && window.MathJax.version,
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
  components: { PostLabel, Comment, Fab, ToC },
  setup () {
    useLoadNotifier()
  },
  data () {
    return { repoUrl, activeSlug: '' }
  },
  watch: {
    '$page.post.id': {
      immediate: true,
      handler () {
        if (process.isServer) return
        if (window.MathJax) this.$nextTick(window.MathJax.typesetPromise)
        this.$nextTick(() => {
          document.getElementsByClassName('hash-link').forEach(el => {
            el.addEventListener('click', () => this.goToHash(el.hash))
          })
          document
            .querySelectorAll('.code-bar .mdi-content-copy')
            .forEach(el => {
              el.addEventListener('click', () => {
                navigator.clipboard.writeText(
                  //  .highlight         pre                code
                  el.parentElement.nextElementSibling.firstElementChild
                    .innerText
                ).then(() => {
                  el.style.color = 'lightgreen'
                  setTimeout(() => { el.style.color = null }, 2000)
                }).catch(() => {
                  el.style.color = 'red'
                })
              })
            })
          if (location.hash) this.goToHash(location.hash)
        })
      }
    }
  },
  mounted () {
    document.addEventListener('scroll', this.onscroll)
  },
  destroyed () {
    document.removeEventListener('scroll', this.onscroll)
  },
  methods: {
    decompressDataURI,
    formatTime,
    goToHash (hash) {
      const el = document.getElementById(
        'article-' + decodeURIComponent(hash.slice(1))
      )
      if (el === null) return
      this.$vuetify.goTo(el, {
        duration: 700,
        offset: 10, // already take app bar into account
        easing: 'easeInOutQuart'
      })
    },
    onscroll (event) {
      const headings = this.$refs.articleContent.querySelectorAll('.anchor-hover')
      if (!headings.length) return

      for (const [index, heading] of headings.entries()) {
        if (heading.getBoundingClientRect().y > 75) {
          if (index === 0) return
          this.activeSlug = headings[index - 1].id.slice(8)
          return
        }
      }
      this.activeSlug = headings[headings.length - 1].id.slice(8)
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
  mjx-container[display="true"]
    overflow-x: auto
    overflow-y: hidden
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
    .code-bar
      position: absolute
      top: 0.2em
      right: 0.6em
      font-size: 0.75rem
      color: rgba(255, 255, 255, 0.6)
      .mdi-content-copy:hover
        color: white
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

.theme--dark article.article-main.markdown-body
  :not(pre) > code
    color: #eee8d5
    background-color: #282c34
  pre > code
    background-color: transparent
  blockquote
    color: #bec1c5
  table tr
    background-color: transparent

.article-all
  @media (min-width: 1000px)
    max-width: 75vw

.toc-wrapper
  display: none
  @media (min-width: 1000px)
    display: block
    position: absolute
    height: 100%
    left: calc( 75vw + 10px )
    width: calc( 25vw - 55px )
  .toc
    position: sticky
    top: 70px
</style>
