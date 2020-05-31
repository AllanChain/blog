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
      <p>{{ edge.node.createdAt }}</p>
      <p>{{ edge.node.summary }}</p>
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
          summary
          createdAt
          lastEditedAt
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
