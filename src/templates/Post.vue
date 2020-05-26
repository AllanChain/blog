<template>
  <h1>{{ $page.post.title }}</h1>
</template>

<page-query>
query($id: ID!) {
  post(id: $id) {
    title
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
