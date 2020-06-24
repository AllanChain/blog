<template>
  <Layout>
    <template #title>
      {{ capitalize($page.label.name) }}
    </template>
    <v-container fluid>
      <v-row align="center">
        <v-col
          v-for="edge of $page.label.belongsTo.edges"
          :key="edge.node.id"
          cols="12"
          sm="6"
          md="4"
        >
          <PostPreview :post="edge.node" />
        </v-col>
      </v-row>
    </v-container>
  </Layout>
</template>

<page-query>
  query($id: ID!) {
    label(id: $id) {
      name
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
              labels {
                id
                type
                name
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
import PostPreview from '@/components/PostPreview'
import { capitalize } from '@/utils'

export default {
  components: {
    PostPreview
  },
  methods: { capitalize }
}
</script>
