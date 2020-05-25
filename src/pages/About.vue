<template>
  <Layout>
    <h1>About us</h1>
    <div
     v-for="edge of $page.allBlogs.edges" 
     :key="edge.node.title">
     {{ edge.node.title }}
     </div>
  </Layout>
</template>

<page-query>
query {
  allBlogs {
    edges {
      node {
        title
      }
    }
  }
}
</page-query>

<script>
export default {
  metaInfo: {
    title: 'About us'
  },
  created() {
    console.log(this.$page)
  }
}
</script>
