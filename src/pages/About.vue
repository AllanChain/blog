<template>
  <Layout>
    <h1>List</h1>
    <div
      v-for="edge of $page.allPost.edges"
      :key="edge.node.title"
    >
      <g-link :to="'/' + edge.node.slug">
        {{ edge.node.title }}
      </g-link>
    </div>
  </Layout>
</template>

<page-query>
  query {
    allPost {
      edges {
        node {
          title
          slug
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
  created () {
    // console.log(this.$page)
  }
}
</script>
