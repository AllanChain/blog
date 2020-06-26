<template>
  <Layout>
    <template #title>
      {{ $page.post.title }}
    </template>
    <div class="article-head text-center">
      <h1 class="article-title">
        {{ $page.post.title }}
      </h1>
      <div class="mb-2">
        <PostTag
          v-for="tag of tags"
          :key="tag.id"
          :color="`#${tag.color}`"
          :tag="tag"
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
  </Layout>
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
import PostTag from '@/components/PostTag'
import Comment from '@/components/Comment'

export default {
  metaInfo () {
    return {
      title: this.$page.post.title
    }
  },
  components: { PostTag, Comment },
  computed: {
    tags () {
      return this.$page.post.labels.filter(label => label.type === 'tag')
    }
  },
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
    visibility: hidden
  &:hover .anchor-hover
    visibility: visible
</style>
