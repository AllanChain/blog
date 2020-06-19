<template>
  <v-card>
    <v-card-title class="headline pb-1">
      {{ capitalizeName }}
    </v-card-title>
    <div class="d-flex flex-no-wrap justify-space-between">
      <v-card-text :class="{ 'pr-0' : !!image}">
        {{ description }}
      </v-card-text>
      <v-avatar v-if="image" class="ma-3" rounded size="80">
        <v-img :src="imageUrl" />
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
    image: {
      type: String,
      default: null
    }
  },
  computed: {
    imageUrl () {
      if (this.image.startsWith('http')) return this.image
      return process.env.GRIDSOME_BASE_URL + this.image
    },
    capitalizeName () {
      return this.name.charAt(0).toUpperCase() + this.name.slice(1) + ' Blog'
    }
  }
}
</script>
