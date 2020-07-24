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
                <img :src="comment.author.avatarUrl" crossorigin="anonymous">
              </v-avatar>
            </template>
            <span>{{ comment.author.login }}</span>
          </v-tooltip>
        </template>
        <v-card color="cyan darken-3">
          <div class="py-1 pl-3 pr-1 d-flex align-center">
            <div class="white--text font-weight-thin">
              {{ formatTime(comment.createdAt) }}
            </div>
            <v-spacer />
            <v-btn
              icon
              :href="`https://github.com/${comment.resourcePath}`"
              style="margin: -4px;"
              target="_blank"
              rel="noopener"
            >
              <v-icon color="white">
                mdi-github
              </v-icon>
            </v-btn>
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
import { gql, htmlPlugins, ChainHTML } from '@/api'
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
  watch: {
    number: {
      immediate: true,
      async handler (postNumber) {
        if (process.isServer) return
        this.comments = []
        this.postReactions = []
        this.loadStatus = 'loading'
        try {
          const data = await gql('comment', { postNumber })
          data.repository.issue.comments.nodes.forEach(comment => {
            comment.bodyHTML = new ChainHTML(comment.bodyHTML)
              .use(htmlPlugins.codeLang)
              .use(htmlPlugins.issueLink)
              .use(htmlPlugins.trimIssue)
              .end()
          })
          this.comments = data.repository.issue.comments.nodes
          this.postReactions = data.repository.issue.reactions.nodes
          this.loadStatus = 'success'
          if (
            window?.MathJax?.typesetPromise &&
            this.comments.some(node => node.bodyHTML.includes('$'))
          ) {
            this.$nextTick(window.MathJax.typesetPromise)
          }
        } catch (err) {
          this.loadStatus = 'error'
        }
      }
    }
  },
  methods: { formatTime }
}
</script>

<style>

</style>
