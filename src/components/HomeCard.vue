<template>
  <v-card>
    <v-card-title class="headline pb-1">
      {{ name }}
    </v-card-title>
    <div class="d-flex flex-no-wrap justify-space-between">
      <v-card-text :class="{ 'pr-0' : !!logo}">
        {{ description }}
      </v-card-text>
      <v-avatar v-if="logo" class="ma-3" rounded size="80">
        <v-img :src="fixUrl(logo)" />
      </v-avatar>
    </div>
    <v-card-actions>
      <v-spacer />
      <v-btn text :to="to" color="primary">
        {{ action }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { fixUrl } from '@/utils'

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
      required: true
    },
    action: {
      type: String,
      default: 'Dive In'
    },
    logo: {
      type: String,
      default: null
    }
  },
  methods: { fixUrl }
}
</script>
