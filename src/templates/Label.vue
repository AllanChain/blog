<template>
  <div>
    <v-row justify="center">
      <v-col cols="12" sm="6">
        <v-select
          id="sort-by"
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
            id="gh-search"
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
    <v-container v-if="orderedPosts.length" fluid>
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
    <div v-else class="text-center py-2 grey--text text--darken-1">
      Nothing to show ¯\_(ツ)_/¯
    </div>
  </div>
</template>

<page-query>
query ($id: ID!) {
  label(id: $id) {
    id
    name
    type
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
            imageLazy
            logo {
              src
              lazySrc
            }
            labels {
              id
              type
              color
              name
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
import { getSearchResult } from '@/api/client'
import PostPreview from '@/components/PostPreview'
import { useLoadNotifier } from '@/composables/usePageLoading'
import { capitalize } from '@/utils'

const sortDate = (key, a, b) => new Date(b[key]) - new Date(a[key])
const sortString = (key, a, b) => a[key] > b[key] ? 1 : -1

const sortBy = {
  createdAt: sortDate.bind(null, 'createdAt'),
  lastEditedAt: sortDate.bind(null, 'lastEditedAt'),
  title: sortString.bind(null, 'title')
}

const naiveSearch = (dest, pattern) => {
  dest = dest.replace(/<.*?>/g, '')
  const patterns = pattern.split(' ')

  if (pattern.toLowerCase() === pattern) {
    const destLower = dest.toLowerCase()
    return patterns.every(p => destLower.includes(p))
  }
  return patterns.every(p => dest.includes(p))
}

const postFilter = (query, post) => {
  const inTitle = naiveSearch(post.title, query)
  const inSummary = post.summary === null
    ? false
    : naiveSearch(post.summary, query)
  return inTitle || inSummary
}

export default {
  components: {
    PostPreview
  },
  setup () {
    useLoadNotifier()
  },
  metaInfo () {
    return {
      title: capitalize(this.$page.label.type) + ' - ' +
        capitalize(this.$page.label.name)
    }
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
        const data = await getSearchResult(this.$page.label.id, this.query)
        const results = data.items.map(node => node.number)
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
