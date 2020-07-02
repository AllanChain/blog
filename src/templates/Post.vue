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
          :color="`#${label.color}`"
          :label="label"
        />
      </div>
      <div>
        <span class="px-3 py-1 d-inline-block">
          <v-icon>mdi-calendar-month-outline</v-icon>
          {{ formatTime($page.post.createdAt) }}
        </span>
        <span class="px-3 py-1 d-inline-block">
          <v-icon>mdi-calendar-edit</v-icon>
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
        <div class="clean-last-p" v-html="$page.post.summary" />
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
        name
        type
        color
        path
      }
    }
  }
</page-query>

<script>
import { formatTime } from '@/utils'
import PostLabel from '@/components/PostLabel'
import Comment from '@/components/Comment'

export default {
  metaInfo () {
    return {
      title: this.$page.post.title
    }
  },
  components: { PostLabel, Comment },
  methods: { formatTime }
}
</script>

<style lang="sass">
h1, h2, h3,
h4, h5, h6
  @extend %headings !optional

article.article-main.markdown-body %headings
  .anchor-hover
    text-decoration: none
    margin-left: -15px
    opacity: 0 // not hidden to receive hover
  &:hover .anchor-hover
    opacity: 1
  .anchor-target
    position: relative
    top: -100px
</style>
