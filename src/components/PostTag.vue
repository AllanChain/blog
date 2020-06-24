<template>
  <v-chip
    :color="`#${tag.color}`"
    :text-color="textColor"
    class="font-weight-bold"
    :to="tag.path"
    small
  >
    {{ tag.name }}
  </v-chip>
</template>

<script>
import { isDarkColor } from '@/utils'
export default {
  props: {
    tag: {
      type: Object,
      required: true
    }
  },
  computed: {
    textColor () {
      if (isDarkColor(this.tag.color, 101)) return 'white'
      return 'black'
    }
  }
}
</script>
