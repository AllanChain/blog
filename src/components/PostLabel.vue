<template>
  <span class="ma-1">
    <v-chip
      v-if="label.type === 'tag'"
      :color="`#${label.color}`"
      :text-color="textColor"
      class="font-weight-bold"
      :to="label.path"
      small
    >
      <v-icon left small>mdi-tag-outline</v-icon>
      {{ label.name }}
    </v-chip>
    <v-chip
      v-else-if="label.type === 'series'"
      :color="`#${label.color}`"
      class="font-weight-bold"
      :to="label.path"
      small
      outlined
    >
      <v-icon left small>mdi-book</v-icon>
      {{ label.name }}
    </v-chip>
    <v-chip
      v-else-if="label.type === 'blog'"
      :color="`#${label.color}`"
      class="font-weight-bold"
      :to="label.path"
      small
      label
    >
      <v-icon left small>mdi-archive</v-icon>
      {{ label.name }}
    </v-chip>
  </span>
</template>

<script>
import { isDarkColor } from '@/utils'
export default {
  props: {
    label: {
      type: Object,
      required: true
    }
  },
  computed: {
    textColor () {
      if (isDarkColor(this.label.color, 101)) return 'white'
      return 'black'
    }
  }
}
</script>
