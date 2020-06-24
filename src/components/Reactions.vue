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
          v-on="on"
        >
          <span class="pr-2">{{ reaction.emoji }}</span>
          <span>{{ reaction.users.length }}</span>
        </v-chip>
      </template>
      <span>{{ reaction.users.join(', ') }}</span>
    </v-tooltip>
  </div>
</template>

<script>
const allReactions = {
  CONFUSED: '😕',
  EYES: '👀',
  HEART: '❤',
  HOORAY: '🎉',
  LAUGH: '😄',
  ROCKET: '🚀',
  THUMBS_DOWN: '👎',
  THUMBS_UP: '👍'
}

export default {
  props: {
    reactions: {
      type: Array,
      required: true
    }
  },
  data () {
    const sortedReactions = {}
    for (const reaction of this.reactions) {
      if (sortedReactions[reaction.content] === undefined) {
        sortedReactions[reaction.content] = {
          emoji: allReactions[reaction.content],
          users: []
        }
      }
      sortedReactions[reaction.content].users.push(reaction.user.login)
    }
    return { sortedReactions }
  }

}
</script>

<style>

</style>
