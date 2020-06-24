<template>
  <div>
    <v-chip
      v-for="(reaction, name) in sortedReactions"
      :key="name"
      color="primary"
      outlined
    >
      <span class="pr-2">{{ reaction.emoji }}</span>
      <span>{{ reaction.users.length }}</span>
    </v-chip>
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
