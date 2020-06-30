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
        <v-card-subtitle class="py-1">
          <span class="mr-4 pb-1 d-inline-block">
            <v-icon>mdi-calendar-month-outline</v-icon>
            {{ formatTime(post.createdAt) }}
          </span>
          <span class="pb-1 d-inline-block">
            <v-icon>mdi-calendar-edit</v-icon>
            {{ formatTime(post.lastEditedAt) }}
          </span>
        </v-card-subtitle>
        <v-card-text v-if="labels.length">
          <PostLabel
            v-for="label of labels"
            :key="label.id"
            :color="`#${label.color}`"
            :label="label"
          />
        </v-card-text>
      </div>
      <!-- If no heading image and have tag logo -->
      <v-avatar
        v-if="logo"
        class="ma-3"
        rounded
        size="80"
      >
        <v-img :src="fixUrl(logo)" />
      </v-avatar>
    </div>
    <v-card-text class="py-0 black--text">
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
import PostLabel from '@/components/PostLabel'

export default {
  components: {
    PostLabel
  },
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  computed: {
    labels () {
      return this.post.labels.filter(label => label.type !== 'blog')
    },
    logo () {
      return !this.post.image && !!this.labels.length && this.labels[0].logo
    }
  },
  methods: {
    fixUrl,
    formatTime
  }
}
</script>
