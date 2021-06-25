<template>
  <div>
    <v-tooltip
      v-for="reaction in reactions"
      :key="reaction.emoji"
      bottom
    >
      <template #activator="{ on, attrs }">
        <v-chip
          class="ma-1"
          color="primary"
          v-bind="attrs"
          outlined
          v-on="reaction.users ? on : undefined "
        >
          <span class="pr-2">{{ reaction.emoji }}</span>
          <span>{{ reaction.count }}</span>
        </v-chip>
      </template>
      <span>{{ reaction.users ? reaction.users.join(', ') : '' }}</span>
    </v-tooltip>
  </div>
</template>

<script>

export default {
  props: {
    reactions: {
      type: [Array, Object],
      required: true
    }
  }
}
</script>

<style>

</style>
