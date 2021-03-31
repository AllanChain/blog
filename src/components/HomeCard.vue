<template>
  <v-card>
    <v-card-title class="headline pb-1">
      {{ name }}
    </v-card-title>
    <div class="d-flex flex-no-wrap justify-space-between">
      <v-card-text :class="{ 'pr-0' : !!logo}">
        {{ description }}
      </v-card-text>
      <v-avatar v-if="logo" class="ma-3" rounded="circle" size="80">
        <v-img :src="logo" :lazy-src="decompressDataURI(logoLazy)" />
      </v-avatar>
    </div>
    <v-card-actions>
      <v-spacer />
      <g-link class="text-decoration-none" v-bind="linkProp">
        <v-btn text ripple color="primary">
          {{ action }}
        </v-btn>
      </g-link>
    </v-card-actions>
  </v-card>
</template>

<script>
import { decompressDataURI } from '@/utils'

export default {
  props: {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    to: {
      type: String,
      default: undefined
    },
    href: {
      type: String,
      default: undefined
    },
    action: {
      type: String,
      default: 'Dive In'
    },
    logoLazy: {
      type: String,
      default: null
    },
    logo: {
      type: String,
      default: null
    }
  },
  computed: {
    linkProp () {
      if (this.href) {
        return {
          href: this.href,
          rel: 'noopener',
          target: '_blank'
        }
      }
      return { to: this.to }
    }
  },
  methods: { decompressDataURI }
}
</script>
