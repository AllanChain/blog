<template>
  <v-container class="text-center">
    <div v-for="(labels, type) in labelByType" :key="type">
      <h2 class="my-3">
        {{ type }}
      </h2>
      <PostLabel
        v-for="label of labels"
        :key="label.id"
        class="ma-2"
        :label="label"
      />
    </div>
  </v-container>
</template>

<script>
import { capitalize } from '@/utils'
import PostLabel from '@/components/PostLabel'

export default {
  components: { PostLabel },
  computed: {
    labelByType () {
      const labels = this.$static.allLabel.edges.map(edge => edge.node)
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

<static-query>
  query {
    allLabel {
      edges {
        node {
          color
          type
          name
          path
          belongsTo {
            totalCount
          }
        }
      }
    }
  }
</static-query>
