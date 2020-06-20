<template>
  <v-card>
    <v-img
      v-if="post.image"
      max-height="200px"
      :src="post.image"
    />
    <v-card-title class="pb-0">
      {{ post.title }}
    </v-card-title>
    <div
      class="d-flex flex-no-wrap justify-space-between"
    >
      <div>
        <v-card-subtitle>
          {{ formatTime(post.createdAt) }}
        </v-card-subtitle>
        <v-card-text class="pb-1">
          <div class="mb-1">
            <PostTag
              v-for="tag of post.tag"
              :key="tag.id"
              :color="`#${tag.color}`"
              :tag="tag"
            />
          </div>
          <div v-html="post.summary" />
        </v-card-text>
      </div>
      <!-- If no heading image and have tag logo -->
      <v-avatar
        v-if="!post.image && post.tag.length && post.tag[0].logo"
        class="ma-3"
        rounded
        size="80"
      >
        <v-img :src="fixUrl(post.tag[0].logo)" />
      </v-avatar>
    </div>
    <v-card-actions>
      <v-spacer />
      <v-btn text :to="post.path" color="primary">
        Dive In
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { fixUrl, formatTime } from '@/utils'
import PostTag from '@/components/PostTag'

export default {
  components: {
    PostTag
  },
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  methods: {
    fixUrl,
    formatTime
  }
}
</script>
