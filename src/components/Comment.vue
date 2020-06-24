<template>
  <div>
    <v-divider class="my-3" />
    <v-alert type="info" border="left">
      <p class="my-2 d-inline-block">
        Want to share your thoughts on this post?
      </p>
      <v-btn class="float-right" color="purple">
        Comment on GitHub
      </v-btn>
    </v-alert>
    <v-timeline align-top dense>
      <v-timeline-item v-for="comment in comments" :key="comment.id" left>
        <template v-slot:icon>
          <v-avatar>
            <img :src="comment.author.avatarUrl">
          </v-avatar>
        </template>
        <v-card>
          <v-card-text class="black--text">
            <div v-html="comment.bodyHTML" />
          </v-card-text>
        </v-card>
      </v-timeline-item>
    </v-timeline>
  </div>
</template>

<script>
import ghApi from '@/api/github'

export default {
  props: {
    number: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      comments: null
    }
  },
  async created () {
    const data = await ghApi.gql('comment', {
      postNumber: this.number
    })
    this.comments = data.repository.issue.comments.edges
      .map(edge => edge.node)
  }
}
</script>

<style>

</style>
