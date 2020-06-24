<template>
  <div>
    <Reactions v-if="loadStatus === 'success'" :reactions="postReactions" />
    <v-divider class="my-3" />
    <v-alert type="info" border="left" :icon="false">
      <p class="my-2 d-inline-block">
        Want to share your thoughts on this post?
      </p>
      <v-btn
        class="float-right"
        color="green darken-1"
        target="_blank"
        rel="noopener"
        :href="`https://github.com/AllanChain/blog/issues/${number}#new_comment_field`"
      >
        <v-icon class="pr-2">
          mdi-github
        </v-icon>
        Comment on GitHub
      </v-btn>
    </v-alert>
    <div v-if="loadStatus === 'loading'" class="text-center">
      <v-progress-circular indeterminate color="primary" />
    </div>
    <v-alert v-else-if="loadStatus === 'error'" type="error" border="left">
      Error making GitHub API call
    </v-alert>
    <v-timeline
      v-else-if="comments.length"
      align-top
      dense
      style="margin-left: -30px;"
    >
      <v-timeline-item v-for="comment in comments" :key="comment.id" left>
        <template v-slot:icon>
          <v-avatar>
            <img :src="comment.author.avatarUrl">
          </v-avatar>
        </template>
        <v-card>
          <v-card-text class="black--text clean-last-p">
            <div v-html="comment.bodyHTML" />
          </v-card-text>
          <v-card-actions>
            <Reactions
              :reactions="comment.reactions.edges.map(edge => edge.node)"
            />
          </v-card-actions>
        </v-card>
      </v-timeline-item>
    </v-timeline>
  </div>
</template>

<script>
import ghApi from '@/api/github'
import Reactions from '@/components/Reactions'

export default {
  components: { Reactions },
  props: {
    number: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      comments: [],
      postReactions: [],
      loadStatus: 'loading'
    }
  },
  async created () {
    try {
      const data = await ghApi.gql('comment', {
        postNumber: this.number
      })
      this.comments = data.repository.issue.comments.edges
        .map(edge => edge.node)
      this.postReactions = data.repository.issue.reactions.edges
        .map(edge => edge.node)
      this.loadStatus = 'success'
    } catch (err) {
      this.loadStatus = 'error'
    }
  }
}
</script>

<style>

</style>
