<template>
  <div class="ma-1 d-inline-block">
    <v-chip
      :color="`#${label.color}`"
      class="font-weight-bold"
      :to="label.path"
      v-bind="style"
    >
      <v-icon left small>
        {{ icon }}
      </v-icon>
      {{ label.name }}
    </v-chip>
  </div>
</template>

<script>
import { isDarkColor } from '@/utils'

const textColor = color => isDarkColor(color, 101) ? 'white' : 'black'

export default {
  props: {
    label: {
      type: Object,
      required: true
    }
  },
  data () {
    const data = {
      style: {
        small: true,
        label: false,
        outlined: false,
        textColor: textColor(this.label.color)
      },
      icon: ''
    }
    if (this.label.type === 'tag') {
      data.icon = 'mdi-tag-outline'
    } else if (this.label.type === 'series') {
      data.icon = 'mdi-book'
      data.style.textColor = undefined
      data.style.outlined = true
    } else if (this.label.type === 'blog') {
      data.icon = 'mdi-archive'
      data.style.label = true
    }
    return data
  }
}
</script>
