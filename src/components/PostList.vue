<template>
  <v-container fluid>
    <v-row>
      <v-col
        v-for="edge of edges"
        :key="edge.node.id"
        cols="12"
        sm="6"
        md="4"
      >
        <PostPreview :post="edge.node" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import PostPreview from './PostPreview'

export default {
  components: {
    PostPreview
  },
  props: {
    edges: {
      type: Array,
      required: true
    }
  }
}
</script>
