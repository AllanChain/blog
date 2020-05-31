<template>
<div>
  <h1>{{ $page.post.title }}</h1>
  <main v-html="$page.post.body" />
</div>
</template>

<page-query>
query($id: ID!) {
  post(id: $id) {
    title
    body
  }
}
</page-query>

<script>
export default {
  created() {
    console.log(this.$page)
  }
}
</script>

<style>

</style>
