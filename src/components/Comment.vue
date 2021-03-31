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
    >
      <v-timeline-item
        v-for="comment in comments"
        :key="comment.id"
        left
      >
        <template #icon>
          <v-tooltip bottom>
            <template #activator="{ on, attrs }">
              <v-avatar size="36" v-bind="attrs" v-on="on">
                <img :src="`${comment.user.avatar_url}&s=36`" crossorigin="anonymous">
              </v-avatar>
            </template>
            <span>{{ comment.user.login }}</span>
          </v-tooltip>
        </template>
        <v-card color="cyan darken-3">
          <div class="py-1 pl-3 pr-1 d-flex align-center">
            <div class="white--text font-weight-thin">
              {{ formatTime(comment.created_at) }}
            </div>
            <v-spacer />
            <v-btn
              icon
              :href="comment.html_url"
              style="margin: -4px;"
              target="_blank"
              rel="noopener"
            >
              <v-icon color="white">
                mdi-github
              </v-icon>
            </v-btn>
          </div>
          <v-card-text
            class="clean-last-p"
            :class="themeClass"
          >
            <div v-html="comment.body_html" />
          </v-card-text>
          <v-card-actions :class="themeClass">
            <Reactions :reactions="comment.reactions" />
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
import { htmlPlugins, ChainHTML } from '@/api/html'
import { getComments, getPostReactions } from '@/api/client'
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
  computed: {
    themeClass () {
      return this.$vuetify.theme.dark ? 'theme--dark' : 'theme--light'
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
          this.comments = await getComments(postNumber)
          this.postReactions = await getPostReactions(postNumber)
        } catch (err) {
          this.loadStatus = 'error'
        }
        this.comments.forEach(comment => {
          comment.body_html = new ChainHTML(comment.body_html)
            .use(htmlPlugins.codeLang)
            .use(htmlPlugins.issueLink)
            .use(htmlPlugins.trimIssue)
            .end()
        })

        this.loadStatus = 'success'

        if (
          window?.MathJax?.typesetPromise &&
            this.comments.some(node => node.body_html.includes('$'))
        ) {
          this.$nextTick(window.MathJax.typesetPromise)
        }
      }
    }
  },
  methods: { formatTime }
}
</script>

<style lang="sass" scoped>
@import '~vuetify/src/styles/styles.sass'

@media #{map-get($display-breakpoints, 'xs-only')}
  .v-timeline
    margin-left: -30px
  .v-timeline-item
    margin-right: -10px

+theme(v-card__text) using ($material)
  background-color: map-get($material, 'cards')
  color: map-deep-get($material, 'text', 'primary')

+theme(v-card__actions) using ($material)
  background-color: map-get($material, 'cards')
  color: map-deep-get($material, 'text', 'primary')
</style>
