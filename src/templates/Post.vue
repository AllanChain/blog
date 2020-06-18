<template>
  <Layout>
    <h1>{{ $page.post.title }}</h1>
    <article
      class="article-main"
      v-html="$page.post.body"
    />
  </Layout>
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
