<template>
  <v-card>
    <v-img
      v-if="post.image"
      max-height="200px"
      :src="fixUrl(post.image)"
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
            v-for="label of labels"
            :key="label.id"
            :label-id="label.id"
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

<static-query>
query {
  allLabel {
    edges {
      node {
        id
        logo
        belongsTo {
          totalCount
        }
      }
    }
  }
}
</static-query>

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
      // New labels in received data will not match any known label in old js.
      // Ignoring them as a temporary fix
      return this.$static.allLabel.edges.filter(edge =>
        this.post.labels.findIndex(label => label.id === edge.node.id) !== -1
      )
        .map(edge => edge.node)
        .sort((a, b) => b.belongsTo.totalCount - a.belongsTo.totalCount)
    },
    logo () {
      if (!this.post.image) {
        // Do not use the hottest one
        const restLabelLogos = this.labels.slice(1)
          .map(label => label.logo).filter(Boolean)
        return !!restLabelLogos.length && restLabelLogos.slice(-1)[0]
      }
      return false
    }
  },
  methods: {
    fixUrl,
    formatTime
  }
}
</script>
