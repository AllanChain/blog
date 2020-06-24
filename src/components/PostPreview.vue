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
          <v-icon>mdi-calendar-month-outline</v-icon>
          {{ formatTime(post.createdAt) }}
        </v-card-subtitle>
        <v-card-text v-if="tags.length">
          <PostTag
            v-for="tag of tags"
            :key="tag.id"
            :color="`#${tag.color}`"
            :tag="tag"
          />
        </v-card-text>
      </div>
      <!-- If no heading image and have tag logo -->
      <v-avatar
        v-if="!post.image && tags.length && tags[0].logo"
        class="ma-3"
        rounded
        size="80"
      >
        <v-img :src="fixUrl(tags[0].logo)" />
      </v-avatar>
    </div>
    <v-card-text class="py-0">
      <div class="clean-last-p" v-html="post.summary" />
    </v-card-text>
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
  computed: {
    tags () {
      return this.post.labels.filter(label => label.type === 'tag')
    }
  },
  methods: {
    fixUrl,
    formatTime
  }
}
</script>
