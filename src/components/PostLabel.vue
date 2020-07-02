<template>
  <v-badge
    overlap
    bordered
    class="ma-1"
    offset-y="9"
    :color="`#${label.color}`"
    :content="badgeContent"
    :value="badgeContent != undefined"
  >
    <v-chip
      :color="`#${label.color}`"
      class="font-weight-bold"
      :to="label.path"
      v-bind="{ ...style, ...size }"
    >
      <v-icon left v-bind="size">
        {{ icon }}
      </v-icon>
      {{ label.name }}
    </v-chip>
  </v-badge>
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
        label: false,
        outlined: false,
        textColor: textColor(this.label.color)
      },
      size: { small: true, large: false, xLarge: false },
      icon: '',
      badgeContent: undefined
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
    if (this.label.belongsTo !== undefined) {
      const number = this.label.belongsTo.totalCount
      data.badgeContent = number
      if (number > 5) {
        data.size.small = false
        if (number > 10) data.size.xLarge = true
        else data.size.large = true
      }
    }
    return data
  }
}
</script>
