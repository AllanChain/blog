<template>
  <v-card class="ma-3">
    <v-card-title>
      <g-link :to="post.path">
        {{ post.title }}
      </g-link>
    </v-card-title>
    <v-card-subtitle>
      {{ post.createdAt }}
    </v-card-subtitle>
    <v-card-text class="pb-1">
      <div v-html="post.summary" />
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    post: {
      type: Object,
      required: true
    }
  }
}
</script>

<style>

</style>
