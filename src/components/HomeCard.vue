<template>
  <v-card>
    <v-card-title class="headline pb-1">
      {{ capitalizeName }}
    </v-card-title>
    <div class="d-flex flex-no-wrap justify-space-between">
      <v-card-text :class="{ 'pr-0' : !!logo}">
        {{ description }}
      </v-card-text>
      <v-avatar v-if="logo" class="ma-3" rounded size="80">
        <v-img :src="logoUrl" />
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
import utils from '@/utils'

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
  computed: {
    logoUrl () {
      if (this.logo.startsWith('http')) return this.logo
      return process.env.GRIDSOME_BASE_URL + this.logo
    },
    capitalizeName () {
      return utils.capitalize(this.name) + ' Blog'
    }
  }
}
</script>
