<template>
  <Layout>
    <h1>{{ $page.tag.id }}</h1>
    <PostList :edges="$page.tag.belongsTo.edges" />
  </Layout>
</template>

<page-query>
  query($id: ID!) {
    tag(id: $id) {
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
              image
              tag {
                id
                logo
                color
                path
              }
            }
          }
        }
      }
    }
  }
</page-query>

<script>
import PostList from '~/components/PostList'

export default {
  components: {
    PostList
  }
}
</script>
