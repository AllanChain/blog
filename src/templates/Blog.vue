<template>
  <Layout>
    <h1>{{ $page.blog.id }}</h1>
    <PostPreview
      v-for="edge in $page.blog.belongsTo.edges"
      :key="edge.node.id"
      :post="edge.node"
    />
  </Layout>
</template>

<page-query>
  query($id: ID!) {
    blog(id: $id) {
      id
      belongsTo {
        edges {
          node {
            ... on Post {
              id
              title
              path
              summary
              createdAt
            }
          }
        }
      }
    }
  }
</page-query>

<script>
import PostPreview from '~/components/PostPreview'

export default {
  components: {
    PostPreview
  }
}
</script>
