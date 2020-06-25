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
        <v-form @submit.prevent="ghSearch">
          <v-text-field
            v-model="query"
            prepend-inner-icon="mdi-magnify"
            label="Search Post Title and Summary"
            hint="Hit Enter to do fulltext search on GitHub"
            outlined
            persistent-hint
            clearable
            @input="ghSearchStatus = 'false'"
          />
        </v-form>
      </v-col>
    </v-row>
    <div v-if="ghSearchStatus === 'loading'" class="text-center">
      <div><v-progress-circular indeterminate color="primary" /></div>
      <div class="py-2 grey--text text--darken-1">
        Performing fulltext search on GitHub...
      </div>
    </div>
    <v-alert v-else-if="ghSearchStatus === 'error'" type="error" border="left">
      Error making GitHub API call
    </v-alert>
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
      id
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
import ghApi from '@/api/github'
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
      query: null,
      ghSearchStatus: 'false',
      ghSearchResult: []
    }
  },
  computed: {
    orderedPosts () {
      if (this.ghSearchStatus === 'success') return this.ghSearchResult
      // `posts` is already a copy
      let posts = this.$page.label.belongsTo.edges.map(edge => edge.node)
      if (this.query) posts = posts.filter(postFilter.bind(null, this.query))
      return posts.sort(sortBy[this.sortKey])
    }
  },
  methods: {
    capitalize,
    async ghSearch () {
      this.ghSearchStatus = 'loading'
      try {
        const searchQuery =
          `${this.query} ${ghApi.config.repoQuery} label:"${this.$page.label.id}"`
        const data = await ghApi.gql('search', { searchQuery })
        const results = data.search.edges.map(edge => edge.node.number)
        const posts = this.$page.label.belongsTo.edges.map(edge => edge.node)
        this.ghSearchResult =
          posts.filter(post => results.includes(parseInt(post.id, 10)))
        this.ghSearchStatus = 'success'
      } catch (err) {
        this.ghSearchStatus = 'error'
      }
    }
  }
}
</script>
