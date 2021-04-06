<template>
  <v-card>
    <v-img
      v-if="post.image"
      max-height="200px"
      :src="post.image"
      :lazy-src="decompressDataURI(post.imageLazy)"
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
        <v-card-text>
          <PostLabel
            v-for="label of post.labels"
            :key="label.id"
            :label="label"
          />
        </v-card-text>
      </div>
      <!-- If no heading image and have tag logo -->
      <v-avatar
        v-if="!post.image && post.logo"
        class="ma-3"
        rounded
        size="80"
      >
        <v-img :src="post.logo.src" :lazy-src="decompressDataURI(post.logo.lazySrc)" />
      </v-avatar>
    </div>
    <div>
      <!-- Wrap card-text in div to avoid being gray -->
      <v-card-text class="py-0">
        <div class="clean-last-p" v-html="post.summary" />
      </v-card-text>
    </div>
    <v-card-actions>
      <v-spacer />
      <g-link class="text-decoration-none" :to="post.path">
        <v-btn text ripple color="primary">
          Dive In
        </v-btn>
      </g-link>
    </v-card-actions>
  </v-card>
</template>

<script>
import { decompressDataURI, formatTime } from '@/utils'
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
  methods: {
    decompressDataURI,
    formatTime
  }
}
</script>
