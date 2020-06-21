<template>
  <Layout>
    <template #title>
      {{ capitalize($page.blog.id) }}
    </template>
    <PostList :edges="$page.blog.belongsTo.edges" />
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
import { capitalize } from '@/utils'

export default {
  components: {
    PostList
  },
  methods: { capitalize }
}
</script>
