<template>
  <div>
    <h1>{{ $page.post.title }}</h1>
    <vue-markdown>{{ $page.post.body }}</vue-markdown>
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
  created () {
    console.log(this.$page)
  }
}
</script>

<style>

</style>
