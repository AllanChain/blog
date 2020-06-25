<template>
  <div>
    <Reactions
      v-if="loadStatus === 'success'"
      class="mt-5 mb-1"
      :reactions="postReactions"
    />
    <v-alert type="info" border="left" :icon="false">
      <p class="my-2 d-inline-block">
        Want to share your thoughts on this post?
      </p>
      <v-btn
        class="float-right"
        color="green darken-1"
        target="_blank"
        rel="noopener"
        :href="`${repoUrl}/issues/${number}#new_comment_field`"
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
      <v-timeline-item
        v-for="comment in comments"
        :key="comment.id"
        left
      >
        <template v-slot:icon>
          <v-tooltip bottom>
            <template #activator="{ on, attrs }">
              <v-avatar v-bind="attrs" v-on="on">
                <img :src="comment.author.avatarUrl">
              </v-avatar>
            </template>
            <span>{{ comment.author.login }}</span>
          </v-tooltip>
        </template>
        <v-card color="blue-grey">
          <div class="py-1 px-3 d-flex">
            <div class="d-flex grey--text text--lighten-3">
              {{ formatTime(comment.createdAt) }}
            </div>
            <v-spacer />
            <a
              class="px-0"
              :href="`https://github.com/${comment.resourcePath}`"
              target="_blank"
              rel="noopener"
            >
              <v-icon color="white">
                mdi-github
              </v-icon>
            </a>
          </div>
          <v-card-text class="white black--text clean-last-p">
            <div v-html="comment.bodyHTML" />
          </v-card-text>
          <v-card-actions class="white">
            <Reactions
              :reactions="comment.reactions.nodes"
            />
          </v-card-actions>
        </v-card>
      </v-timeline-item>
    </v-timeline>
    <div v-else class="text-center py-2 grey--text text--darken-1">
      There are no comments yet. Comment now!
    </div>
  </div>
</template>

<script>
import ghApi from '@/api'
import { repoUrl } from '@/config'
import { formatTime } from '@/utils'
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
      repoUrl,
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
      this.comments = data.repository.issue.comments.nodes
      this.postReactions = data.repository.issue.reactions.nodes
      this.loadStatus = 'success'
    } catch (err) {
      this.loadStatus = 'error'
    }
  },
  methods: { formatTime }
}
</script>

<style>

</style>
