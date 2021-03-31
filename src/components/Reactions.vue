<template>
  <div>
    <v-tooltip
      v-for="(reaction, name) in sortedReactions"
      :key="name"
      bottom
    >
      <template #activator="{ on, attrs }">
        <v-chip
          class="ma-1"
          color="primary"
          v-bind="attrs"
          outlined
          v-on="reaction.users.length ? on : undefined "
        >
          <span class="pr-2">{{ reaction.emoji }}</span>
          <span>{{ reaction.count || reaction.users.length }}</span>
        </v-chip>
      </template>
      <span>{{ reaction.users.join(', ') }}</span>
    </v-tooltip>
  </div>
</template>

<script>
const allReactions = {
  confused: '😕',
  eyes: '👀',
  heart: '❤',
  hooray: '🎉',
  laugh: '😄',
  rocket: '🚀',
  '-1': '👎',
  '+1': '👍'
}

export default {
  props: {
    reactions: {
      type: [Array, Object],
      required: true
    }
  },
  data () {
    const sortedReactions = {}

    if (Array.isArray(this.reactions)) {
      for (const reaction of this.reactions) {
        if (sortedReactions[reaction.content] === undefined) {
          sortedReactions[reaction.content] = {
            emoji: allReactions[reaction.content],
            users: []
          }
        }
        sortedReactions[reaction.content].users.push(reaction.user.login)
      }
    } else {
      for (const reactionContent in this.reactions) {
        if (
          reactionContent in allReactions &&
          this.reactions[reactionContent] > 0
        ) {
          sortedReactions[reactionContent] = {
            emoji: allReactions[reactionContent],
            count: this.reactions[reactionContent],
            users: []
          }
        }
      }
    }
    return { sortedReactions }
  }

}
</script>

<style>

</style>
