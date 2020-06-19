<template>
  <div>
    <g-link :to="post.path">
      {{ post.title }}
    </g-link>
    <p>{{ post.createdAt }}</p>
    <div v-html="post.summary" />
  </div>
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
