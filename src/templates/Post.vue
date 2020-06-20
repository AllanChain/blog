<template>
  <Layout>
    <div class="article-head text-center">
      <h1 class="article-title">
        {{ $page.post.title }}
      </h1>
      <div class="mb-2">
        <PostTag
          v-for="tag of $page.post.tag"
          :key="tag.id"
          :color="`#${tag.color}`"
          :tag="tag"
        />
      </div>
      <div>{{ formatTime($page.post.createdAt) }}</div>
    </div>
    <article
      class="article-main markdown-body mx-auto"
      style="max-width: 900px"
      v-html="$page.post.body"
    />
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
      image
      tag {
        id
        color
        path
      }
    }
  }
</page-query>

<script>
import { formatTime } from '@/utils'
import PostTag from '@/components/PostTag'

export default {
  metaInfo () {
    return {
      title: this.$page.post.title
    }
  },
  components: { PostTag },
  methods: { formatTime }
}
</script>

<style>

</style>
