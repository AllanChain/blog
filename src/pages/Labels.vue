<template>
  <v-container class="text-center">
    <div v-for="(labels, type) in labelByType" :key="type">
      <h2 class="my-3">
        {{ type }}
      </h2>
      <PostLabel v-for="label of labels" :key="label.id" :label="label" />
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
      const labelByType = { Blog: [], Series: [], Tag: [] }
      for (const edge of this.$static.allLabel.edges) {
        labelByType[capitalize(edge.node.type)].push(edge.node)
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
        }
      }
    }
  }
</static-query>
