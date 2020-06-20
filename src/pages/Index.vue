<template>
  <Layout>
    <v-container fluid>
      <v-row>
        <v-col
          v-for="edge of $static.allBlog.edges"
          :key="edge.node.id"
          cols="12"
          sm="6"
          md="4"
        >
          <HomeCard
            :name="edge.node.id"
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
    allBlog {
      edges {
        node {
          id
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

export default {
  metaInfo: {
    title: 'Home'
  },
  components: {
    HomeCard
  }
}
</script>

<style>

</style>
