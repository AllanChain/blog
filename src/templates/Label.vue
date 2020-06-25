<template>
  <Layout>
    <template #title>
      {{ capitalize($page.label.name) }}
    </template>
    <v-row justify="center">
      <v-col cols="12" sm="6">
        <v-select
          v-model="sortKey"
          :items="sortKeys"
          label="Sort By"
          outlined
          hide-details
        />
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="query"
          prepend-inner-icon="mdi-magnify"
          label="Search Post Title and Summary"
          outlined
          hide-details
        />
      </v-col>
    </v-row>
    <v-container fluid>
      <v-row align="center">
        <v-col
          v-for="post of orderedPosts"
          :key="post.id"
          cols="12"
          sm="6"
          md="4"
        >
          <PostPreview :post="post" />
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
              lastEditedAt
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

const sortDate = (key, a, b) => new Date(b[key]) - new Date(a[key])
const sortString = (key, a, b) => a[key] > b[key] ? 1 : -1

const sortBy = {
  createdAt: sortDate.bind(null, 'createdAt'),
  lastEditedAt: sortDate.bind(null, 'lastEditedAt'),
  title: sortString.bind(null, 'title')
}

const postFilter = (query, post) => {
  const inTitle = post.title.includes(query)
  const inSummary = post.summary === null
    ? false
    : post.summary.includes(query)
  return inTitle || inSummary
}

export default {
  components: {
    PostPreview
  },
  data () {
    return {
      sortKeys: [
        { text: 'Create Time', value: 'createdAt' },
        { text: 'Modify Time', value: 'lastEditedAt' },
        { text: 'Post Title', value: 'title' }
      ],
      sortKey: 'createdAt',
      query: null
    }
  },
  computed: {
    orderedPosts () {
      // `posts` is already a copy
      let posts = this.$page.label.belongsTo.edges.map(edge => edge.node)
      if (this.query) posts = posts.filter(postFilter.bind(null, this.query))
      return posts.sort(sortBy[this.sortKey])
    }
  },
  methods: { capitalize }
}
</script>
