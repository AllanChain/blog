<template>
  <Layout>
    <v-container fluid>
      <v-row>
        <v-col
          v-for="edge of $static.allLabel.edges"
          :key="edge.node.id"
          cols="12"
          sm="6"
          md="4"
        >
          <HomeCard
            :name="capitalize(edge.node.name) + ' Blog'"
            :to="edge.node.path"
            :description="edge.node.description"
            :logo="edge.node.logo"
          />
        </v-col>
      </v-row>
    </v-container>
  </Layout>
</template>

<static-query>
  query {
    allLabel(filter: { type: { eq: "blog" } }) {
      edges {
        node {
          name
          description
          logo
          path
        }
      }
    }
  }
</static-query>

<script>
import HomeCard from '~/components/HomeCard'
import { capitalize } from '@/utils'

export default {
  metaInfo: {
    title: 'Home'
  },
  components: {
    HomeCard
  },
  methods: { capitalize }
}
</script>

<style>

</style>
