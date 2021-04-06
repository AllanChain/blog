<template>
  <v-container class="text-center">
    <div v-for="(labels, type) in labelByType" :key="type">
      <HomeHeader>
        {{ type }}
      </HomeHeader>
      <PostLabel
        v-for="label of labels"
        :key="label.id"
        class="ma-2"
        :label="label"
        badge
      />
    </div>
  </v-container>
</template>

<script>
import { capitalize } from '@/utils'
import PostLabel from '@/components/PostLabel'
import HomeHeader from '@/components/HomeHeader'

export default {
  metaInfo: {
    title: 'All Labels'
  },
  components: { PostLabel, HomeHeader },
  computed: {
    labelByType () {
      const labels = this.$page.allLabel.edges.map(edge => edge.node)
        .sort((a, b) => b.belongsTo.totalCount - a.belongsTo.totalCount)
      const labelByType = { Blog: [], Series: [], Tag: [] }

      for (const label of labels) {
        labelByType[capitalize(label.type)].push(label)
      }
      return labelByType
    }
  }
}
</script>

<page-query>
query {
  allLabel {
    edges {
      node {
        id
        type
        name
        color
        path
        belongsTo {
          totalCount
        }
      }
    }
  }
}
</page-query>
