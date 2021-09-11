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
    <g-link class="text-decoration-none" :to="label.path">
      <v-chip
        :color="`#${label.color}`"
        class="font-weight-bold"
        ripple
        v-bind="{ ...style, ...size }"
      >
        <v-icon left v-bind="size">
          {{ icon }}
        </v-icon>
        {{ label.name }}
      </v-chip>
    </g-link>
  </v-badge>
</template>

<script>
import { isDarkColor } from '@/utils'
import extraData from '@/assets/.cache/extra.json'

const { labelSizeBrkpnts } = extraData
const textColor = color => isDarkColor(color, 101) ? 'white' : 'black'

export default {
  props: {
    label: {
      type: Object,
      required: true,
      validator (label) {
        return ['name', 'color', 'path', 'type'].every(key => key in label)
      }
    },
    badge: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    style: {
      label: false,
      outlined: false,
      textColor: undefined
    },
    size: { small: true, large: false, xLarge: false },
    icon: '',
    badgeContent: undefined
  }),
  created () {
    this.style.textColor = textColor(this.label.color)

    if (this.label.type === 'tag') {
      this.icon = 'mdi-tag-outline'
    } else if (this.label.type === 'series') {
      this.icon = 'mdi-book'
      this.style.textColor = undefined
      this.style.outlined = true
    } else if (this.label.type === 'blog') {
      this.icon = 'mdi-archive'
      this.style.label = true
    }

    if (this.badge) {
      const number = this.label.belongsTo.totalCount
      this.badgeContent = number

      if (number > labelSizeBrkpnts.normal) {
        this.size.small = false
        if (number > labelSizeBrkpnts.xLarge) this.size.xLarge = true
        else if (number > labelSizeBrkpnts.large) this.size.large = true
      }
    }
  }
}
</script>
